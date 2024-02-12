/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Scan from './Scan';
import Navigator from './Navigator';
import LightBox from './LightBox';
import {name as appName} from './app.json';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
Icon.loadFont();

AppRegistry.registerComponent(appName, () => Navigator);
