const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('justevivoDesktop', Object.freeze({
  platform: process.platform,
  appName: 'JUSTEVIVO AI',
  isDesktop: true
}));
