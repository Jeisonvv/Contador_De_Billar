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
    console.log(`🔧 resetCounters llamado: ids=${ids}, valorReinicio=${valorReinicio}`);
    ids.forEach((id, idx) => {
      window["valor_" + id] = valorReinicio;
      const el = document.getElementById(id);
      if (el) {
        el.textContent = valorReinicio;
        console.log(`✅ Reset de ${id}: window.valor_${id}=${valorReinicio}, DOM=${el.textContent}`);
      }

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

    console.log("🔄 INICIANDO resetSet()");

    // Reiniciar puntos a 0
    resetCounters(["Point_White", "Point_Yellow"], false, ["Point_White", "Point_Yellow"], 0);

    // Reiniciar entrada a 1
    resetCounters(["entry"], true, ["entry"], 1);

    console.log("✅ resetSet completado, ahora inicializando EffectivenessManager");

    // Reiniciar efectivas a 0
    resetCounters(["totalEfectivasBlanco", "totalEfectivasAmarillo"], false, ["totalEfectivasBlanco", "totalEfectivasAmarillo"], 0);

    // Reiniciar fallidas a 0
    resetCounters(["noCarambola_White", "noCarambola_Yellow"], false, ["noCarambola_White", "noCarambola_Yellow"], 0);

    // Limpiar display de efectividad inmediatamente
    const efectivasBlancoDisplay = document.getElementById("efectivasBlanco");
    const efectivasAmarilloDisplay = document.getElementById("efectivasAmarillo");
    const fallidasBlancoDisplay = document.getElementById("fallidasBlancoDetail");
    const fallidasAmarilloDisplay = document.getElementById("fallidasAmarilloDetail");
    const promedioBlancoDom = document.getElementById("promedioBlanco");
    const promedioAmarilloDom = document.getElementById("promedioAmarillo");
    
    if (efectivasBlancoDisplay) efectivasBlancoDisplay.textContent = 0;
    if (efectivasAmarilloDisplay) efectivasAmarilloDisplay.textContent = 0;
    if (fallidasBlancoDisplay) fallidasBlancoDisplay.textContent = 0;
    if (fallidasAmarilloDisplay) fallidasAmarilloDisplay.textContent = 0;
    if (promedioBlancoDom) promedioBlancoDom.textContent = "0%";
    if (promedioAmarilloDom) promedioAmarilloDom.textContent = "0%";

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

    // Actualizar display de efectividad
    if (window.CounterManager && window.CounterManager.updateEntradaDisplay) {
      CounterManager.updateEntradaDisplay();
    }

    // Reiniciar EffectivenessManager para registrar correctamente la próxima entrada
    if (window.EffectivenessManager && window.EffectivenessManager.initialize) {
      EffectivenessManager.initialize();
      console.log("✅ EffectivenessManager reiniciado después de resetear set");
    }
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

      // Limpiar efectivas y fallidas acumuladas
      const totalEfectivasBlanco = document.getElementById("totalEfectivasBlanco");
      const totalEfectivasAmarillo = document.getElementById("totalEfectivasAmarillo");
      const noCarambolaWhite = document.getElementById("noCarambola_White");
      const noCarambolaYellow = document.getElementById("noCarambola_Yellow");
      
      if (totalEfectivasBlanco) totalEfectivasBlanco.textContent = 0;
      if (totalEfectivasAmarillo) totalEfectivasAmarillo.textContent = 0;
      if (noCarambolaWhite) noCarambolaWhite.textContent = 0;
      if (noCarambolaYellow) noCarambolaYellow.textContent = 0;

      // Limpiar display de efectividad
      const efectivasBlancoDisplay = document.getElementById("efectivasBlanco");
      const efectivasAmarilloDisplay = document.getElementById("efectivasAmarillo");
      const fallidasBlancoDisplay = document.getElementById("fallidasBlancoDetail");
      const fallidasAmarilloDisplay = document.getElementById("fallidasAmarilloDetail");
      const promedioBlancoDom = document.getElementById("promedioBlanco");
      const promedioAmarilloDom = document.getElementById("promedioAmarillo");
      
      if (efectivasBlancoDisplay) efectivasBlancoDisplay.textContent = 0;
      if (efectivasAmarilloDisplay) efectivasAmarilloDisplay.textContent = 0;
      if (fallidasBlancoDisplay) fallidasBlancoDisplay.textContent = 0;
      if (fallidasAmarilloDisplay) fallidasAmarilloDisplay.textContent = 0;
      if (promedioBlancoDom) promedioBlancoDom.textContent = "0%";
      if (promedioAmarilloDom) promedioAmarilloDom.textContent = "0%";

      // Guardar valores vacíos
      DataManager.saveGeneralFile("nombre_blanco", "");
      DataManager.saveGeneralFile("nombre_amarillo", "");
      DataManager.saveGeneralFile("handicap_blanco", "");
      DataManager.saveGeneralFile("handicap_amarillo", "");
      DataManager.saveGeneralFile("Point_White", "");
      DataManager.saveGeneralFile("Point_Yellow", "");
      DataManager.saveGeneralFile("totalEfectivasBlanco", 0);
      DataManager.saveGeneralFile("totalEfectivasAmarillo", 0);

      // Reiniciar todos los sets
      const sets = ["set1", "set2", "set3", "set4", "set5"];
      const setOriginal = DataManager.getSetActual();
      const setSelector = document.getElementById("setSelector");

      sets.forEach((setName) => {
        if (setSelector) setSelector.value = setName;
        resetSet(true);
      });

      if (setSelector) setSelector.value = setOriginal;

      // Actualizar display final de efectividad
      if (window.CounterManager && window.CounterManager.updateEntradaDisplay) {
        CounterManager.updateEntradaDisplay();
      }

      // Reiniciar EffectivenessManager para el set original
      if (window.EffectivenessManager && window.EffectivenessManager.initialize) {
        EffectivenessManager.initialize();
        console.log("✅ EffectivenessManager reiniciado después de resetear todos los marcadores");
      }
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
