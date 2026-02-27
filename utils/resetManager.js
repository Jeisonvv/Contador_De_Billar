/**
 * ================================================================
 * RESET MANAGER - Gestión de Reinicio de Contadores y Sets
 * ================================================================
 * Maneja el reinicio de sets, marcadores y todos los datos asociados
 */

const ResetManager = (() => {
  /**
   * Reinicia múltiples contadores a un valor específico
   * @param {array} ids - Array de IDs de elementos a reiniciar
   * @param {boolean} esGeneral - Si true, reinicia en data/general/
   * @param {array} archivos - Array de nombres de archivos
   * @param {number} valorReinicio - Valor a establecer
   */
  function resetCounters(ids, esGeneral, archivos, valorReinicio = 1) {
    ids.forEach((id, idx) => {
      window["valor_" + id] = valorReinicio;
      const el = document.getElementById(id);
      if (el) el.textContent = valorReinicio;

      if (archivos && archivos[idx]) {
        if (esGeneral) {
          DataManager.saveGeneralFile(archivos[idx], valorReinicio);
        } else {
          DataManager.saveSetFile(archivos[idx], valorReinicio);
        }
      }
    });
  }

  /**
   * Reinicia todos los datos del set actual
   * @param {boolean} sinConfirmacion - Si true, reinicia sin pedir confirmación
   */
  function resetSet(sinConfirmacion = false) {
    if (!sinConfirmacion) {
      ModalManager.showConfirmation('¿Deseas borrar todos los datos del set actual?', (confirmado) => {
        if (confirmado) resetSet(true);
      });
      return;
    }

    // Reiniciar puntos a 0
    resetCounters(["Point_White", "Point_Yellow"], false, ["Point_White", "Point_Yellow"], 0);

    // Reiniciar entrada a 1
    resetCounters(["entry"], true, ["entry"], 1);

    // Reiniciar marcadores acumulados a 0
    ["whitePlayerMarcador", "yellowPlayerMarcador"].forEach((id) => {
      window["valor_" + id] = 0;
      const el = document.getElementById(id);
      if (el) el.textContent = 0;
      DataManager.saveSetFile(id, 0);
    });

    // Reiniciar series y entradas de series
    [
      { id: "highestserieWhite", archivo: "highestserieWhite" },
      { id: "highestserieYellow", archivo: "highestserieYellow" },
      { id: "entrada_serie_white", archivo: "entrada_serie_white" },
      { id: "entrada_serie_yellow", archivo: "entrada_serie_yellow" },
    ].forEach(({ id, archivo }) => {
      window["valor_" + id] = 0;
      const el = document.getElementById(id);
      if (el) el.textContent = 0;
      DataManager.saveSetFile(archivo, 0);
    });

    // Recalcular promedios
    StatsManager.updateWhiteAverage();
    StatsManager.updateYellowAverage();
  }

  /**
   * Reinicia toda la partida (marcador completo + todos los sets)
   */
  function resetAllMarkers() {
    ModalManager.showConfirmation('¿Deseas borrar TODO el marcador y todos los sets?', (confirmado) => {
      if (!confirmado) return;

      // Limpiar nombres y handicaps
      document.getElementById("nameWhitePlayer").value = "";
      document.getElementById("nameYellowPlayer").value = "";
      document.getElementById("handicapWhitePlayer").value = "";
      document.getElementById("handicapYellowPlayer").value = "";

      // Guardar valores vacíos
      DataManager.saveGeneralFile("nombre_blanco", "");
      DataManager.saveGeneralFile("nombre_amarillo", "");
      DataManager.saveGeneralFile("handicap_blanco", "");
      DataManager.saveGeneralFile("handicap_amarillo", "");
      DataManager.saveGeneralFile("Point_White", "");
      DataManager.saveGeneralFile("Point_Yellow", "");

      // Reiniciar todos los sets
      const sets = ["set1", "set2", "set3", "set4", "set5"];
      const setOriginal = DataManager.getSetActual();
      const setSelector = document.getElementById("setSelector");

      sets.forEach((setName) => {
        if (setSelector) setSelector.value = setName;
        resetSet(true);
      });

      if (setSelector) setSelector.value = setOriginal;
    });
  }

  /**
   * Inicializa los listeners para los botones de reinicio
   */
  function initializeListeners() {
    document.getElementById("resetButtonSet")?.addEventListener("click", () => {
      resetSet(false);
    });

    document.getElementById("resetButtonMarcador")?.addEventListener("click", () => {
      resetAllMarkers();
    });
  }

  // Public API
  return {
    resetCounters,
    resetSet,
    resetAllMarkers,
    initializeListeners
  };
})();
