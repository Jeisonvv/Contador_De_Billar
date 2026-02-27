const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('fileAPI', {
  // Guardar y cargar archivos generales
  saveGeneralFile: (fileName, content) => ipcRenderer.invoke('save-general-file', fileName, content),
  loadGeneralFile: (fileName) => ipcRenderer.invoke('load-general-file', fileName),
  
  // Guardar y cargar archivos de sets
  saveSetFile: (setName, fileName, content) => ipcRenderer.invoke('save-set-file', setName, fileName, content),
  loadSetFile: (setName, fileName) => ipcRenderer.invoke('load-set-file', setName, fileName),
  
  // Obtener ruta de datos (para debugging)
  getDataPath: () => ipcRenderer.invoke('get-data-path'),
  
  // Escuchar eventos
  onResetMarker: (callback) => ipcRenderer.on('reiniciar-marcador', callback),
})