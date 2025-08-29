const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

require('@electron/remote/main').initialize();

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // Attendre que la fenêtre soit prête
  await win.loadURL('http://localhost:3000');

  // Ouvrir les DevTools en mode développement
  if (isDev) {
    win.webContents.openDevTools();
  }
}

// Attendre que l'application soit prête
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
