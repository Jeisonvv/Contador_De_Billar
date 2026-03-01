/**
 * ================================================================
 * COUNTER MANAGER - Gestión de Contadores
 * ================================================================
 * Crea contadores genéricos con sincronización automática con archivos
 */

const CounterManager = (() => {
  // Rastrear qué jugador está en turno (último en incrementar puntos)
  let lastPlayerTurn = "White";

  /**
   * Crea un contador con botones de incremento y decremento
   * @param {string} idBtnMas - ID del botón para aumentar
   * @param {string} idBtnMenos - ID del botón para disminuir
   * @param {string} idDisplay - ID del elemento que muestra el valor
   * @param {boolean} esGeneral - Si true, guarda en data/general/; si false, en data/setN/
   * @param {boolean} guardarEnAmbos - Si true, guarda en ambas ubicaciones
   * @param {boolean} verificarFallidas - Si true, verifica fallidas al incrementar entrada
   * @param {string} playerColor - Color del jugador (White/Yellow) para rastrear turno
   */
  function createCounter(idBtnMas, idBtnMenos, idDisplay, esGeneral, guardarEnAmbos = false, verificarFallidas = false, playerColor = null) {
    // Inicializar valor interno en memoria
    window["valor_" + idDisplay] = 0;
    const display = document.getElementById(idDisplay);

    // Listener para botón de incremento
    document.getElementById(idBtnMas)?.addEventListener("click", () => {
      window["valor_" + idDisplay]++;
      display.textContent = window["valor_" + idDisplay];
      
      saveValue(idDisplay, window["valor_" + idDisplay], esGeneral, guardarEnAmbos);

      // Si es puntos de un jugador, registrar que es su turno
      if (playerColor && (idDisplay === "Point_White" || idDisplay === "Point_Yellow")) {
        lastPlayerTurn = playerColor;
        // Actualizar display de efectividad cuando cambian los puntos
        updateEntradaDisplay();
      }

      // Si es la entrada, verificar fallidas automáticamente
      if (verificarFallidas && idDisplay === "entry") {
        checkAndRegisterFailures();
        updateEntradaDisplay(); // Actualizar display de entrada
      }
    });

    // Listener para botón de decremento
    document.getElementById(idBtnMenos)?.addEventListener("click", () => {
      if (window["valor_" + idDisplay] > 0) {
        window["valor_" + idDisplay]--;
        display.textContent = window["valor_" + idDisplay];
        saveValue(idDisplay, window["valor_" + idDisplay], esGeneral, guardarEnAmbos);

        // Si es puntos de un jugador, registrar que es su turno
        if (playerColor && (idDisplay === "Point_White" || idDisplay === "Point_Yellow")) {
          lastPlayerTurn = playerColor;
        }
      }
    });
  }

  /**
   * Verifica y registra fallidas y efectivas cuando se incrementa la entrada
   * Cuenta automáticamente cuando la entrada se incrementa
   */
  function checkAndRegisterFailures() {
    console.log("▶️ INICIANDO checkAndRegisterFailures()");
    if (!EffectivenessManager) {
      console.error("EffectivenessManager NO EXISTE");
      return;
    }

    const effectiveness = EffectivenessManager.checkEffectiveness();
    if (effectiveness.entriesAdded > 0) {
      const whitePoints = parseInt(document.getElementById("Point_White")?.textContent || 0, 10);
      const yellowPoints = parseInt(document.getElementById("Point_Yellow")?.textContent || 0, 10);

      // ACUMULAR puntos en los marcadores antes de resetear
      if (whitePoints > 0) {
        const marcadorWhite = document.getElementById("whitePlayerMarcador");
        let puntosAcumulados = parseInt(marcadorWhite?.textContent || 0, 10);
        puntosAcumulados += whitePoints;
        
        if (marcadorWhite) marcadorWhite.textContent = puntosAcumulados;
        DataManager.saveSetFile("whitePlayerMarcador", puntosAcumulados);
        DataManager.saveGeneralFile("whitePlayerMarcador", puntosAcumulados);
      }
      
      if (yellowPoints > 0) {
        const marcadorYellow = document.getElementById("yellowPlayerMarcador");
        let puntosAcumulados = parseInt(marcadorYellow?.textContent || 0, 10);
        puntosAcumulados += yellowPoints;
        
        if (marcadorYellow) marcadorYellow.textContent = puntosAcumulados;
        DataManager.saveSetFile("yellowPlayerMarcador", puntosAcumulados);
        DataManager.saveGeneralFile("yellowPlayerMarcador", puntosAcumulados);
      }

      console.log(`📋 ANÁLISIS DE PUNTOS: Blanco=${whitePoints}, Amarillo=${yellowPoints}`);
      
      // 🔵 VERIFICAR VARIABLES BOOLEANAS PARA CADA JUGADOR
      const whiteWasEffective = window.isWhiteEffective;
      const yellowWasEffective = window.isYellowEffective;
      console.log(`🔵 Variable isWhiteEffective = ${whiteWasEffective}`);
      console.log(`🔵 Variable isYellowEffective = ${yellowWasEffective}`);
      
      // ✅ BLANCO: Verificar su variable independiente
      if (whiteWasEffective) {
        console.log(`✅ BLANCO EFECTIVA - Se acumularon puntos en esta entrada`);
        incrementarEfectivas("White");
      } else {
        console.log(`❌ BLANCO FALLIDA - No se acumularon puntos en esta entrada`);
        incrementarFallidas("White");
      }
      
      // ✅ AMARILLO: Verificar su variable independiente
      if (yellowWasEffective) {
        console.log(`✅ AMARILLO EFECTIVA - Se acumularon puntos en esta entrada`);
        incrementarEfectivas("Yellow");
      } else {
        console.log(`❌ AMARILLO FALLIDA - No se acumularon puntos en esta entrada`);
        incrementarFallidas("Yellow");
      }

      // Resetear puntos para la próxima entrada
      window["valor_Point_White"] = 0;
      window["valor_Point_Yellow"] = 0;
      document.getElementById("Point_White").textContent = 0;
      document.getElementById("Point_Yellow").textContent = 0;
      
      // Guardar los puntos reseteados en los archivos
      saveValue("Point_White", 0, false, true);
      saveValue("Point_Yellow", 0, false, true);

      // 🔵 RESET DE LAS VARIABLES BOOLEANAS PARA AMBOS JUGADORES
      window.isWhiteEffective = false;
      window.isYellowEffective = false;
      console.log(`🔄 Variables isWhiteEffective e isYellowEffective reset a FALSE para próxima entrada`);

      // Actualizar display de efectividad después de procesar
      updateEntradaDisplay();
    }

    // Actualizar estado anterior después de procesar
    EffectivenessManager.updatePreviousState();
  }

  /**
   * Actualiza el display de efectividad
   * Muestra carambolas efectivas acumuladas, fallidas, promedio por jugador y series más altas
   */
  function updateEntradaDisplay() {
    // Obtener efectivas acumuladas
    const efectivasBlanco = parseInt(document.getElementById("totalEfectivasBlanco")?.textContent || 0, 10);
    const efectivasAmarillo = parseInt(document.getElementById("totalEfectivasAmarillo")?.textContent || 0, 10);
    
    // Obtener fallidas acumuladas
    const fallidasBlanco = parseInt(document.getElementById("noCarambola_White")?.textContent || 0, 10);
    const fallidasAmarillo = parseInt(document.getElementById("noCarambola_Yellow")?.textContent || 0, 10);
    
    // Obtener series más altas y entradas
    const highestserieWhite = parseInt(document.getElementById("highestserieWhite")?.textContent || 0, 10);
    const entrada_serie_white = parseInt(document.getElementById("entrada_serie_white")?.textContent || 0, 10);
    const highestserieYellow = parseInt(document.getElementById("highestserieYellow")?.textContent || 0, 10);
    const entrada_serie_yellow = parseInt(document.getElementById("entrada_serie_yellow")?.textContent || 0, 10);
    
    // Calcular promedio de efectividad
    const totalBlanco = efectivasBlanco + fallidasBlanco;
    const totalAmarillo = efectivasAmarillo + fallidasAmarillo;
    
    const promedioBlancoPct = totalBlanco > 0 ? Math.round((efectivasBlanco / totalBlanco) * 100) : 0;
    const promedioAmarilloPct = totalAmarillo > 0 ? Math.round((efectivasAmarillo / totalAmarillo) * 100) : 0;
    
    // Actualizar elementos de efectividad y fallidas
    const efectivasBlancoDOM = document.getElementById("efectivasBlanco");
    const efectivasAmarilloDOM = document.getElementById("efectivasAmarillo");
    const fallidasBlancoDetail = document.getElementById("fallidasBlancoDetail");
    const fallidasAmarilloDetail = document.getElementById("fallidasAmarilloDetail");
    const promedioBlancoDom = document.getElementById("promedioBlanco");
    const promedioAmarilloDom = document.getElementById("promedioAmarillo");
    
    if (efectivasBlancoDOM) efectivasBlancoDOM.textContent = efectivasBlanco;
    if (efectivasAmarilloDOM) efectivasAmarilloDOM.textContent = efectivasAmarillo;
    if (fallidasBlancoDetail) fallidasBlancoDetail.textContent = fallidasBlanco;
    if (fallidasAmarilloDetail) fallidasAmarilloDetail.textContent = fallidasAmarillo;
    if (promedioBlancoDom) promedioBlancoDom.textContent = promedioBlancoPct + "%";
    if (promedioAmarilloDom) promedioAmarilloDom.textContent = promedioAmarilloPct + "%";
    
    // Actualizar elementos de series más altas
    const highestserieWhiteDisplay = document.getElementById("highestserieWhiteDisplay");
    const entrada_serie_whiteDisplay = document.getElementById("entrada_serie_whiteDisplay");
    const highestserieYellowDisplay = document.getElementById("highestserieYellowDisplay");
    const entrada_serie_yellowDisplay = document.getElementById("entrada_serie_yellowDisplay");
    
    if (highestserieWhiteDisplay) highestserieWhiteDisplay.textContent = highestserieWhite;
    if (entrada_serie_whiteDisplay) entrada_serie_whiteDisplay.textContent = entrada_serie_white;
    if (highestserieYellowDisplay) highestserieYellowDisplay.textContent = highestserieYellow;
    if (entrada_serie_yellowDisplay) entrada_serie_yellowDisplay.textContent = entrada_serie_yellow;
  }

  /**
   * Incrementa el contador de efectivas
   * @param {string} colorJugador - "White" o "Yellow"
   */
  function incrementarEfectivas(colorJugador) {
    const colorName = colorJugador === "White" ? "Blanco" : "Amarillo";
    const idEfectivas = `totalEfectivas${colorName}`;
    const elemento = document.getElementById(idEfectivas);
    if (!elemento) {
      console.error(`Elemento no encontrado: ${idEfectivas}`);
      return;
    }

    let efectivas = parseInt(elemento.textContent, 10) || 0;
    efectivas++;
    elemento.textContent = efectivas;

    // Guardar en archivos
    DataManager.saveSetFile(idEfectivas, efectivas);
    DataManager.saveGeneralFile(idEfectivas, efectivas);
    console.log(`✅ Carambola efectiva registrada para ${colorName}: ${efectivas} (ID: ${idEfectivas})`);
  }

  /**
   * Incrementa el contador de fallidas
   * @param {string} colorJugador - "White" o "Yellow"
   */
  function incrementarFallidas(colorJugador) {
    const idFallidas = `noCarambola_${colorJugador}`;
    const elemento = document.getElementById(idFallidas);
    
    if (!elemento) {
      console.error(`ERROR: Elemento ${idFallidas} NO ENCONTRADO en el DOM`);
      return;
    }

    let fallidas = parseInt(elemento.textContent, 10) || 0;
    fallidas++;
    elemento.textContent = fallidas;
    console.log(`📊 Fallidas actuales para ${colorJugador}: ${fallidas}`);
    try {
      console.log(`💾 Intentando guardar ${idFallidas} = ${fallidas} en archivos...`);
      DataManager.saveSetFile(idFallidas, fallidas);
      console.log(`✅ Guardado en set file: ${idFallidas}`);
      DataManager.saveGeneralFile(idFallidas, fallidas);
      console.log(`✅ Guardado en general file: ${idFallidas}`);
    } catch (err) {
      console.error(`Error al guardar fallida para ${colorJugador}:`, err);
    }
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
    // Contador de puntos del jugador blanco (registra turno)
    createCounter("increase_white", "decrease_white", "Point_White", false, true, false, "White");

    // Contador de entradas (Guarda en AMBAS ubicaciones para trabajar con sets)
    // Parámetros: id+, id-, idDisplay, esGeneral, guardarEnAmbos, verificarFallidas
    createCounter("increase_entry", "decrease_entry", "entry", true, true, true);

    // Contador de puntos del jugador amarillo (registra turno)
    createCounter("increase_yellow", "decrease_yellow", "Point_Yellow", false, true, false, "Yellow");
  }

  // Public API
  return {
    createCounter,
    initializeAllCounters,
    incrementarFallidas,
    incrementarEfectivas,
    updateEntradaDisplay
  };
})();

// Hacer accesible globalmente
window.CounterManager = CounterManager;
