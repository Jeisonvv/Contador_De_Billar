/**
 * ================================================================
 * DATA MANAGER - Gestión de Persistencia de Datos
 * ================================================================
 * Maneja la carga y guardado de archivos en data/general/ y data/setN/
 */

const DataManager = (() => {
  const { fileAPI } = window;

  /**
   * Obtiene el set actual seleccionado en la UI
   * @returns {string} El valor del selector de sets (ej: "set1", "set2", etc.)
   */
  function getSetActual() {
    const setSelector = document.getElementById("setSelector");
    return setSelector ? setSelector.value : "set1";
  }

  /**
   * Guarda datos globales en data/general/
   * @param {string} nombreArchivo - Nombre del archivo (sin extensión)
   * @param {any} valor - Valor a guardar
   */
  async function saveGeneralFile(nombreArchivo, valor) {
    try {
      const result = await fileAPI.saveGeneralFile(nombreArchivo, valor.toString());
      if (!result.success) {
        console.error("Error al guardar el archivo general:", result.error);
      }
    } catch (err) {
      console.error("Error en IPC saveGeneralFile:", err);
    }
  }

  /**
   * Carga datos globales de data/general/
   * @param {string} nombreArchivo - Nombre del archivo (sin extensión)
   * @returns {Promise<string>} El contenido del archivo
   */
  async function loadGeneralFile(nombreArchivo) {
    try {
      const result = await fileAPI.loadGeneralFile(nombreArchivo);
      return result.content || '';
    } catch (err) {
      console.error("Error en IPC loadGeneralFile:", err);
      return '';
    }
  }

  /**
   * Guarda datos específicos del set actual en data/setN/
   * @param {string} nombreArchivo - Nombre del archivo (sin extensión)
   * @param {any} valor - Valor a guardar
   */
  async function saveSetFile(nombreArchivo, valor) {
    const setActual = getSetActual();
    try {
      const result = await fileAPI.saveSetFile(setActual, nombreArchivo, valor.toString());
      if (!result.success) {
        console.error("Error al guardar el archivo del set:", result.error);
      }
    } catch (err) {
      console.error("Error en IPC saveSetFile:", err);
    }
  }

  /**
   * Carga datos específicos del set actual de data/setN/
   * @param {string} nombreArchivo - Nombre del archivo (sin extensión)
   * @returns {Promise<string>} El contenido del archivo
   */
  async function loadSetFile(nombreArchivo) {
    const setActual = getSetActual();
    try {
      const result = await fileAPI.loadSetFile(setActual, nombreArchivo);
      return result.content || '';
    } catch (err) {
      console.error("Error en IPC loadSetFile:", err);
      return '';
    }
  }

  // Public API
  return {
    getSetActual,
    saveGeneralFile,
    loadGeneralFile,
    saveSetFile,
    loadSetFile
  };
})();

// Hacer accesible globalmente
window.DataManager = DataManager;
