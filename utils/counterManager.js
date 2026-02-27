/**
 * ================================================================
 * COUNTER MANAGER - Gestión de Contadores
 * ================================================================
 * Crea contadores genéricos con sincronización automática con archivos
 */

const CounterManager = (() => {
  /**
   * Crea un contador con botones de incremento y decremento
   * @param {string} idBtnMas - ID del botón para aumentar
   * @param {string} idBtnMenos - ID del botón para disminuir
   * @param {string} idDisplay - ID del elemento que muestra el valor
   * @param {boolean} esGeneral - Si true, guarda en data/general/; si false, en data/setN/
   * @param {boolean} guardarEnAmbos - Si true, guarda en ambas ubicaciones
   */
  function createCounter(idBtnMas, idBtnMenos, idDisplay, esGeneral, guardarEnAmbos = false) {
    // Inicializar valor interno en memoria
    window["valor_" + idDisplay] = 0;
    const display = document.getElementById(idDisplay);

    // Listener para botón de incremento
    document.getElementById(idBtnMas)?.addEventListener("click", () => {
      window["valor_" + idDisplay]++;
      display.textContent = window["valor_" + idDisplay];
      saveValue(idDisplay, window["valor_" + idDisplay], esGeneral, guardarEnAmbos);
    });

    // Listener para botón de decremento
    document.getElementById(idBtnMenos)?.addEventListener("click", () => {
      if (window["valor_" + idDisplay] > 0) {
        window["valor_" + idDisplay]--;
        display.textContent = window["valor_" + idDisplay];
        saveValue(idDisplay, window["valor_" + idDisplay], esGeneral, guardarEnAmbos);
      }
    });
  }

  /**
   * Guarda el valor del contador según la configuración
   */
  function saveValue(idDisplay, value, esGeneral, guardarEnAmbos) {
    if (guardarEnAmbos) {
      DataManager.saveSetFile(idDisplay, value);
      DataManager.saveGeneralFile(idDisplay, value);
    } else if (esGeneral) {
      DataManager.saveGeneralFile(idDisplay, value);
    } else {
      DataManager.saveSetFile(idDisplay, value);
    }
  }

  /**
   * Inicializa todos los contadores del juego
   */
  function initializeAllCounters() {
    // Contador de puntos del jugador blanco
    createCounter("increase_white", "decrease_white", "Point_White", false, true);

    // Contador de entradas
    createCounter("increase_entry", "decrease_entry", "entry", true);

    // Contador de puntos del jugador amarillo
    createCounter("increase_yellow", "decrease_yellow", "Point_Yellow", false, true);
  }

  // Public API
  return {
    createCounter,
    initializeAllCounters
  };
})();
