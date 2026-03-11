const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Usar carpeta data local del proyecto para almacenar datos
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const generalDir = path.join(dataDir, 'general');
if (!fs.existsSync(generalDir)) {
  fs.mkdirSync(generalDir, { recursive: true });
}
for (let i = 1; i <= 5; i++) {
  const setDir = path.join(dataDir, `set${i}`);
  if (!fs.existsSync(setDir)) {
    fs.mkdirSync(setDir, { recursive: true });
  }
}

// Exponer la ruta de datos al renderer process
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 800,
    icon: path.join(__dirname, 'BillarEnLinea.ico'),
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('close', (e) => {
    mainWindow.webContents.send('reiniciar-marcador');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ================================================================
// IPC HANDLERS PARA GUARDAR Y CARGAR ARCHIVOS
// ================================================================

/**
 * Guarda un archivo en data/general/
 */
ipcMain.handle('save-general-file', (event, fileName, content) => {
  const generalDir = path.join(dataDir, 'general');
  if (!fs.existsSync(generalDir)) {
    fs.mkdirSync(generalDir, { recursive: true });
  }
  const filePath = path.join(generalDir, fileName + '.txt');
  try {
    fs.writeFileSync(filePath, content.toString(), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Error al guardar archivo general:', err);
    return { success: false, error: err.message };
  }
});

/**
 * Carga un archivo de data/general/
 */
ipcMain.handle('load-general-file', (event, fileName) => {
  const generalDir = path.join(dataDir, 'general');
  const filePath = path.join(generalDir, fileName + '.txt');
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return { success: true, content };
    }
    return { success: false, content: '' };
  } catch (err) {
    console.error('Error al cargar archivo general:', err);
    return { success: false, content: '', error: err.message };
  }
});

/**
 * Guarda un archivo en data/setN/
 */
ipcMain.handle('save-set-file', (event, setName, fileName, content) => {
  const setDir = path.join(dataDir, setName);
  if (!fs.existsSync(setDir)) {
    fs.mkdirSync(setDir, { recursive: true });
  }
  const filePath = path.join(setDir, fileName + '.txt');
  try {
    fs.writeFileSync(filePath, content.toString(), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Error al guardar archivo de set:', err);
    return { success: false, error: err.message };
  }
});

/**
 * Carga un archivo de data/setN/
 */
ipcMain.handle('load-set-file', (event, setName, fileName) => {
  const setDir = path.join(dataDir, setName);
  const filePath = path.join(setDir, fileName + '.txt');
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return { success: true, content };
    }
    return { success: false, content: '' };
  } catch (err) {
    console.error('Error al cargar archivo de set:', err);
    return { success: false, content: '', error: err.message };
  }
});

/**
 * Retorna la ruta de datos para debugging
 */
ipcMain.handle('get-data-path', (event) => {
  return dataDir;
});