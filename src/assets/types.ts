export interface AssetProps {
  source: any;
  style?: any;
}

export interface ImageAssetProps extends AssetProps {
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}
