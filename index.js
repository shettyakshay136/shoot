/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Ensure asset registry is available
import '@react-native/assets-registry/registry';

AppRegistry.registerComponent(appName, () => App);
