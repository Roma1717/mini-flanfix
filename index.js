import { AppRegistry } from 'react-native';
import App from './App'; // Убедитесь, что путь к App.tsx указан правильно
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

