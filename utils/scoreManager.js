/**
 * ================================================================
 * SCORE MANAGER - Gestión de Acumulación de Puntos
 * ================================================================
 * Maneja la acumulación de puntos y sincronización con marcadores
 */

const ScoreManager = (() => {
  /**
   * Acumula puntos del contador actual al marcador
   * @param {string} idContador - ID del contador de puntos
   * @param {string} idMarcador - ID del marcador acumulado
   */
  function accumulate(idContador, idMarcador) {
    // Obtener puntos actuales del contador
    const puntosActuales = parseInt(document.getElementById(idContador).textContent, 10) || 0;

    // Obtener marcador actual
    let marcador = document.getElementById(idMarcador);
    let puntosAcumulados = parseInt(marcador.textContent, 10) || 0;

    // Sumar puntos al marcador
    puntosAcumulados += puntosActuales;
    marcador.textContent = puntosAcumulados;

    // Reiniciar valor interno del contador
    if (window["valor_" + idContador] !== undefined) {
      window["valor_" + idContador] = 0;
    }

    // Reiniciar contador visual a 0
    document.getElementById(idContador).textContent = 0;

    // Guardar cambios en archivos
    DataManager.saveSetFile(idMarcador, puntosAcumulados);
    DataManager.saveSetFile(idContador, 0);
    DataManager.saveGeneralFile(idMarcador, puntosAcumulados);
    DataManager.saveGeneralFile(idContador, 0);
  }

  /**
   * Inicializa los listeners para acumular puntos
   */
  function initializeListeners() {
    document.getElementById("buttonWhitePlayerMarcador")?.addEventListener("click", () => {
      accumulate("Point_White", "whitePlayerMarcador");
    });

    document.getElementById("buttonYellowPlayerMarcador")?.addEventListener("click", () => {
      accumulate("Point_Yellow", "yellowPlayerMarcador");
    });
  }

  // Public API
  return {
    accumulate,
    initializeListeners
  };
})();

// Hacer accesible globalmente
window.ScoreManager = ScoreManager;

