declare module 'react-native-vector-icons/Ionicons' {
  import * as React from 'react';
  import { StyleProp, TextStyle } from 'react-native';

  export interface IoniconsProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
  }
  export default class Ionicons extends React.Component<IoniconsProps> {}
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import * as React from 'react';
  import { StyleProp, TextStyle } from 'react-native';

  export interface MaterialCommunityIconsProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
  }
  export default class MaterialCommunityIcons extends React.Component<MaterialCommunityIconsProps> {}
}
