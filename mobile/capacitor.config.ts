import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'todolist.ppp',
  appName: 'ToDoList',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
    allowNavigation: [
      "http://130.162.34.50:8002"
    ]
  }
};

export default config;
