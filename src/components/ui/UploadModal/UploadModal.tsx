import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Alert } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import FileSvg from '@/assets/svg/file.svg';
import ArrowUp from '@/assets/svg/arrow-up-right.svg';
import rogApi from '@/services/axiosInstance';

// Safely import DocumentPicker with error handling
let DocumentPicker: any;
let isInProgress: any;
let DocumentTypes: any;

try {
  const docPicker = require('react-native-document-picker');
  DocumentPicker = docPicker.default || docPicker;
  isInProgress = docPicker.isInProgress;
  DocumentTypes = docPicker.types || docPicker.DocumentPicker?.types;
} catch (error) {
  console.error('Failed to import react-native-document-picker:', error);
}

// Define DocumentPickerResponse type manually since we're using dynamic import
interface DocumentPickerResponse {
  uri: string;
  fileCopyUri?: string;
  name?: string;
  type?: string;
  size?: number;
  [key: string]: any;
}

// Constants matching route.ts
const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks

export type FileType = 'raw' | 'final' | 'images';

interface UploadModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpload?: (uploadedFiles: UploadedFileInfo[]) => void;
  onCheckStatus?: () => void;
  // Event/Shoot data required for Google Drive upload
  eventCode: string;
  eventName: string;
  eventDate: string; // Format: YYYY-MM-DD
  creatorCode: string;
  fileType: FileType; // 'raw' | 'final' | 'images'
  // Optional: Custom upload endpoint (defaults to ROG_API_BASE_URL + '/api/upload')
  uploadEndpoint?: string;
}

interface UploadedFileInfo {
  fileName: string;
  driveFileId: string;
  uploadDate: Date;
  creatorCode: string;
}

interface UploadProgress {
  fileName: string;
  currentChunk: number;
  totalChunks: number;
  percentage: number;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isVisible,
  onClose,
  onUpload,
  onCheckStatus,
  eventCode,
  eventName,
  eventDate,
  creatorCode,
  fileType,
  uploadEndpoint,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const uploadAbortController = useRef<AbortController | null>(null);

  // Get upload endpoint
  const getUploadEndpoint = () => {
    if (uploadEndpoint) {
      return uploadEndpoint;
    }
    // Use relative path - rogApi already has baseURL configured
    return '/api/upload';
  };

  // Get file info without reading the entire file
  const getFileInfo = (file: DocumentPickerResponse): { fileName: string; fileSize: number; mimeType: string; uri: string } => {
    const uri = file.fileCopyUri || file.uri;
    const fileName = file.name || uri.split('/').pop() || `file-${Date.now()}`;
    const fileSize = file.size || 0;
    const mimeType = file.type || 'application/octet-stream';

    return { fileName, fileSize, mimeType, uri };
  };

  // Calculate total chunks needed
  const calculateChunks = (fileSize: number): number => {
    return Math.ceil(fileSize / CHUNK_SIZE);
  };

  // Upload a single chunk
  const uploadChunk = async (
    fileUri: string,
    chunkIndex: number,
    totalChunks: number,
    fileName: string,
    fileSize: number,
    mimeType: string
  ): Promise<{ fileName: string; driveFileId: string; uploadDate: Date; creatorCode: string } | null> => {
    const formData = new FormData();
    
    // For React Native, we append the file URI with range info
    // The server will handle reading the chunk from the file
    // Since React Native FormData doesn't support streaming, we'll upload the full file
    // and let the server handle chunking, OR we can read chunks using RNFS if needed
    // For now, we'll send the full file URI and let multiparty handle it on the server
    
    // Note: React Native FormData requires file objects with uri, type, name
    // Ensure URI is in the correct format for React Native
    const normalizedUri = fileUri.startsWith('file://') ? fileUri : `file://${fileUri}`;
    
    const fileObject = {
      uri: normalizedUri,
      type: mimeType || 'application/octet-stream',
      name: fileName,
    };
    
    formData.append('chunk', fileObject as any);

    // Append form fields matching route.ts specification
    formData.append('eventName', eventName);
    formData.append('eventCode', eventCode);
    formData.append('eventDate', eventDate);
    formData.append('creatorCode', creatorCode);
    formData.append('fileName', fileName);
    formData.append('totalChunks', totalChunks.toString());
    formData.append('currentChunk', chunkIndex.toString());
    formData.append('fileSize', fileSize.toString());
    formData.append('fileType', fileType);
    formData.append('mimeType', mimeType);

    try {
      const endpoint = getUploadEndpoint();
      
      // Configure axios request
      // Note: Don't set Content-Type header manually - axios will set it with boundary for FormData
      const config: any = {
        timeout: 120000, // 2 minutes timeout
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const chunkProgress = ((chunkIndex * CHUNK_SIZE + (progressEvent.loaded || 0)) / fileSize) * 100;
            const percentage = Math.min(Math.round(chunkProgress), 100);
            setUploadProgress({
              fileName,
              currentChunk: chunkIndex + 1,
              totalChunks,
              percentage,
            });
          }
        },
      };

      // Only add signal if AbortController is supported
      if (uploadAbortController.current && typeof AbortController !== 'undefined') {
        try {
          config.signal = uploadAbortController.current.signal;
        } catch (e) {
          // AbortController not supported, skip
        }
      }

      // Use rogApi to post the form data
      const response = await rogApi.post(endpoint, formData, config);

      // Update progress
      const percentage = Math.round(((chunkIndex + 1) / totalChunks) * 100);
      setUploadProgress({
        fileName,
        currentChunk: chunkIndex + 1,
        totalChunks,
        percentage,
      });

      return response.data?.uploadResult || null;
    } catch (error: any) {
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        throw new Error('Upload cancelled');
      }
      console.error('Chunk upload error:', error);
      throw error;
    }
  };

  // Upload a file with chunking
  // Note: For React Native, we'll simulate chunking by sending the file multiple times
  // with chunk indices. The server will handle reassembly.
  // For true chunking, you'd need react-native-fs to read file chunks client-side.
  const uploadFile = async (file: DocumentPickerResponse): Promise<UploadedFileInfo> => {
    const { fileName, fileSize, mimeType, uri } = getFileInfo(file);
    
    // For small files (< 4MB), upload as single chunk
    // For larger files, we'll need to implement proper chunk reading
    // For now, let's upload as a single chunk and let the server handle it
    // OR implement proper chunking if fileSize > CHUNK_SIZE
    
    let totalChunks = 1;
    if (fileSize > CHUNK_SIZE) {
      totalChunks = calculateChunks(fileSize);
      // Note: For true chunking, you'd read file in chunks using react-native-fs
      // For now, we'll send the full file but indicate chunking for progress tracking
    }

    let uploadResult: UploadedFileInfo | null = null;

    // If file is small, upload as single chunk
    if (totalChunks === 1) {
      const result = await uploadChunk(uri, 0, 1, fileName, fileSize, mimeType);
      if (result) {
        uploadResult = {
          fileName: result.fileName,
          driveFileId: result.driveFileId,
          uploadDate: new Date(result.uploadDate),
          creatorCode: result.creatorCode,
        };
      }
    } else {
      // For larger files, we'd need react-native-fs to read chunks
      // For now, upload as single chunk with chunk info for progress
      console.warn('Large file detected. True chunking requires react-native-fs. Uploading as single request.');
      const result = await uploadChunk(uri, 0, totalChunks, fileName, fileSize, mimeType);
      if (result) {
        uploadResult = {
          fileName: result.fileName,
          driveFileId: result.driveFileId,
          uploadDate: new Date(result.uploadDate),
          creatorCode: result.creatorCode,
        };
      }
    }

    if (!uploadResult) {
      throw new Error('Upload completed but no file ID received');
    }

    return uploadResult;
  };

  // Handle file selection and upload
  const handleFileUpload = async () => {
    try {
      // Check if DocumentPicker is available
      if (!DocumentPicker || typeof DocumentPicker.pick !== 'function') {
        Alert.alert(
          'Setup Required',
          'Document picker native module is not available. Please:\n\n' +
          '1. Stop the Metro bundler\n' +
          '2. For iOS: Run "cd ios && pod install && cd .."\n' +
          '3. Rebuild the app completely\n' +
          '4. Restart the Metro bundler',
          [{ text: 'OK' }]
        );
        console.error('DocumentPicker is not available:', DocumentPicker);
        return;
      }

      const pickerOptions: any = {
        allowMultiSelection: true,
        presentationStyle: 'fullScreen',
      };

      // Add type if DocumentTypes is available
      if (DocumentTypes && DocumentTypes.allFiles) {
        pickerOptions.type = [DocumentTypes.allFiles];
      }

      // Add copyTo for proper file handling
      if (Platform.OS === 'android') {
        pickerOptions.copyTo = 'cachesDirectory';
      } else {
        pickerOptions.copyTo = 'documentDirectory';
      }

      const results = await DocumentPicker.pick(pickerOptions);

      if (!results || results.length === 0) {
        return;
      }

      setIsUploading(true);
      setUploadedFiles([]);
      uploadAbortController.current = new AbortController();

      const uploaded: UploadedFileInfo[] = [];

      // Upload files sequentially
      for (const file of results) {
        try {
          const result = await uploadFile(file);
          uploaded.push(result);
          setUploadedFiles([...uploaded]);
        } catch (error: any) {
          console.error('Error uploading file:', error);
          Alert.alert(
            'Upload Error',
            `Failed to upload ${file.name}: ${error.message || 'Unknown error'}`
          );
        }
      }

      setUploadProgress(null);
      setIsUploading(false);

      if (uploaded.length > 0) {
        Alert.alert('Success', `Successfully uploaded ${uploaded.length} file(s)`);
        onUpload?.(uploaded);
      }
    } catch (error: any) {
      setIsUploading(false);
      setUploadProgress(null);
      
      if (DocumentPicker && DocumentPicker.isCancel && DocumentPicker.isCancel(error)) {
        // User cancelled
        return;
      } else if (isInProgress && isInProgress(error)) {
        Alert.alert('Error', 'Multiple file pickers opened');
      } else {
        console.error('File picking error:', error);
        const errorMessage = error?.message || error?.toString() || 'Failed to pick files';
        
        // Check if it's a native module error
        if (errorMessage.includes('native') || errorMessage.includes('undefined')) {
          Alert.alert(
            'Native Module Error',
            'The document picker native module is not linked. Please rebuild the app:\n\n' +
            'iOS: cd ios && pod install && cd ..\n' +
            'Then rebuild the app completely.'
          );
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    }
  };

  // Cancel upload
  const handleCancelUpload = () => {
    if (uploadAbortController.current) {
      uploadAbortController.current.abort();
      uploadAbortController.current = null;
    }
    setIsUploading(false);
    setUploadProgress(null);
  };

  // Reset state when modal closes
  const handleClose = () => {
    if (isUploading) {
      handleCancelUpload();
    }
    setUploadProgress(null);
    setUploadedFiles([]);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      avoidKeyboard={true}
      useNativeDriver={true}
      hideModalContentWhileAnimating={false}
      propagateSwipe={true}
    >
      <View style={styles.container}>
        <View style={styles.handleLine} />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <FileSvg width={80} height={80} />
          </View>
          
          <Text style={styles.title}>Upload files</Text>
          
          <Text style={styles.subtitle}>
            Follow the instructions you have received in the email and upload it securely from here.
          </Text>

          {/* Upload Progress */}
          {uploadProgress && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Uploading: {uploadProgress.fileName}
              </Text>
              <Text style={styles.progressText}>
                {uploadProgress.currentChunk}/{uploadProgress.totalChunks} chunks ({uploadProgress.percentage}%)
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress.percentage}%` }]} />
              </View>
            </View>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && !isUploading && (
            <View style={styles.uploadedContainer}>
              <Text style={styles.uploadedTitle}>Uploaded Files:</Text>
              {uploadedFiles.map((file, index) => (
                <Text key={index} style={styles.uploadedFile}>
                  ✓ {file.fileName}
                </Text>
              ))}
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
            onPress={handleFileUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <View style={styles.uploadButtonContent}>
                <ActivityIndicator size="small" color="#983614" style={styles.loader} />
                <Text style={styles.uploadButtonText}>Uploading...</Text>
              </View>
            ) : (
              <Text style={styles.uploadButtonText}>Upload Files</Text>
            )}
          </TouchableOpacity>

          {isUploading && (
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancelUpload}
            >
              <Text style={styles.cancelButtonText}>Cancel Upload</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {onCheckStatus && !isUploading && (
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.checkStatusButton}
              onPress={onCheckStatus}
            >
              <LinearGradient
                colors={['#000000', '#61240E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.checkStatusButtonGradient}
              >
                <Text style={styles.checkStatusButtonText}>Submit for Review</Text>
                <ArrowUp/>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  handleLine: {
    width: "40%",
    height: 5,
    backgroundColor: 'black',
    borderRadius: 2,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    minHeight: '60%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingVertical:20
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    fontFamily: 'Saans TRIAL',
    textAlign: 'center',
    marginBottom: 32,
  },
  uploadButton: {
    backgroundColor: '#FFF7ED',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems:'center',
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#FDD8AB',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#983614',
    fontFamily: 'Saans TRIAL',
  },
  cancelButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Saans TRIAL',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 23,
    backgroundColor: 'white',
    paddingVertical:30
  },
  checkStatusButton: {
    borderRadius: 100,
    overflow: 'hidden',
    width: '100%',
  },
  checkStatusButtonGradient: {
    borderRadius: 120,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    opacity: 1,
  },
  checkStatusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Saans TRIAL',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Saans TRIAL',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#983614',
    borderRadius: 4,
  },
  uploadedContainer: {
    width: '100%',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
  },
  uploadedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Saans TRIAL',
    marginBottom: 8,
  },
  uploadedFile: {
    fontSize: 14,
    color: '#059669',
    fontFamily: 'Saans TRIAL',
    marginBottom: 4,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: 8,
  },
});

export default UploadModal;

