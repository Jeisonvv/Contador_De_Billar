/**
 * ================================================================
 * CONTADOR PRINCIPAL - Orquestador de Módulos
 * ================================================================
 * Inicializa y coordina todos los módulos de la aplicación
 */

document.addEventListener('DOMContentLoaded', async function() {
  
  /**
   * Inicializar todos los módulos cuando el DOM esté listo
   */

  // 0. Limpiar valores por defecto (puntos a 0, nombres vacíos, entrada a 1)
  initializeDefaultValues();

  // 1. Inicializar gestión de jugadores (intercambio y sincronización)
  PlayerManager.initializeListeners();

  // 2. Inicializar contadores (puntos y entradas)
  CounterManager.initializeAllCounters();

  // 3. Inicializar acumulación de puntos
  ScoreManager.initializeListeners();

  // 4. Inicializar estadísticas (promedios y series)
  StatsManager.initializeListeners();

  // 5. Inicializar reinicio de sets y marcadores
  ResetManager.initializeListeners();

  // 6. Cargar datos correctos del set actual ANTES de inicializar EffectivenessManager
  await loadSetDataFromFiles();

  console.log("✅ DOM preparado con valores por defecto");
  
  // 7. Escuchar cambios de set para recargar efectivas y fallidas
  const setSelector = document.getElementById("setSelector");
  if (setSelector) {
    setSelector.addEventListener("change", async () => {
      console.log("🔄 Cambio de set detectado, cargando datos del nuevo set...");
      await loadSetDataFromFiles();
      console.log("✅ Datos del nuevo set cargados correctamente");
      
      // CRÍTICO: Reinicializar EffectivenessManager DESPUÉS de que todos los datos estén cargados
      const entryValue = parseInt(document.getElementById("entry")?.textContent || 1, 10);
      console.log(`🔧 [CRITICAL] Reinicializando EffectivenessManager con entrada=${entryValue}`);
      EffectivenessManager.initialize(entryValue);
      console.log(`✅ [CRITICAL] EffectivenessManager reiniciado a entrada=${entryValue}`);
    });
  }

  // 9. Escuchar evento de cierre desde Electron
  if (window.fileAPI && window.fileAPI.onResetMarker) {
    window.fileAPI.onResetMarker(() => {
      ResetManager.resetAllMarkers();
    });
  }

  // 10. Limpiar valores por defecto cuando se cierre la ventana
  window.addEventListener("beforeunload", () => {
    console.log("🔌 Cerrando aplicación - Limpiando valores por defecto...");
    saveDefaultValuesToFiles();
  });

});

/**
 * Guarda valores por defecto en todos los archivos
 */
function saveDefaultValuesToFiles() {
  try {
    if (!window.DataManager) return;

    const sets = ["set1", "set2", "set3", "set4", "set5"];
    const setSelector = document.getElementById("setSelector");
    const setOriginal = setSelector ? setSelector.value : "set1";

    // Guardar en general
    DataManager.saveGeneralFile("nombre_blanco", "");
    DataManager.saveGeneralFile("nombre_amarillo", "");
    DataManager.saveGeneralFile("Point_White", 0);
    DataManager.saveGeneralFile("Point_Yellow", 0);

    // Guardar valores por defecto en todos los sets
    sets.forEach((setName) => {
      if (setSelector) setSelector.value = setName;
      
      DataManager.saveSetFile("entry", 1);
      DataManager.saveSetFile("Point_White", 0);
      DataManager.saveSetFile("Point_Yellow", 0);
      DataManager.saveSetFile("whitePlayerMarcador", 0);
      DataManager.saveSetFile("yellowPlayerMarcador", 0);
      DataManager.saveSetFile("totalEfectivasBlanco", 0);
      DataManager.saveSetFile("totalEfectivasAmarillo", 0);
      DataManager.saveSetFile("noCarambola_White", 0);
      DataManager.saveSetFile("noCarambola_Yellow", 0);
    });

    // Restaurar set original
    if (setSelector) setSelector.value = setOriginal;


  } catch (err) {
    console.error("Error al guardar valores por defecto:", err);
  }
}

/**
 * Inicializa los valores por defecto
 */
function initializeDefaultValues() {

  
  // Limpiar nombres de jugadores
  const nameWhitePlayer = document.getElementById("nameWhitePlayer");
  const nameYellowPlayer = document.getElementById("nameYellowPlayer");
  
  if (nameWhitePlayer) nameWhitePlayer.value = "";
  if (nameYellowPlayer) nameYellowPlayer.value = "";
  
  // Establecer puntos a 0
  const pointWhite = document.getElementById("Point_White");
  const pointYellow = document.getElementById("Point_Yellow");
  
  if (pointWhite) {
    pointWhite.textContent = 0;
    window["valor_Point_White"] = 0;
  }
  if (pointYellow) {
    pointYellow.textContent = 0;
    window["valor_Point_Yellow"] = 0;
  }
  
  // Establecer entrada a 1
  const entry = document.getElementById("entry");
  if (entry) {
    entry.textContent = 1;
    window["valor_entry"] = 1;
  }
  

}

/**
 * Carga los valores acumulados de efectivas desde los archivos\n */
async function loadEfectivasFromFiles() {
  try {
    // Cargar efectivas blanco
    const efectivasBlanco = await DataManager.loadGeneralFile("totalEfectivasBlanco");
    const valBlanco = parseInt(efectivasBlanco, 10) || 0;
    const elemBlanco = document.getElementById("totalEfectivasBlanco");
    if (elemBlanco) {
      elemBlanco.textContent = valBlanco;
    }

    // Cargar efectivas amarillo
    const efectivasAmarillo = await DataManager.loadGeneralFile("totalEfectivasAmarillo");
    const valAmarillo = parseInt(efectivasAmarillo, 10) || 0;
    const elemAmarillo = document.getElementById("totalEfectivasAmarillo");
    if (elemAmarillo) {
      elemAmarillo.textContent = valAmarillo;
    }

    // Actualizar display con los valores cargados
    if (window.CounterManager && window.CounterManager.updateEntradaDisplay) {
      CounterManager.updateEntradaDisplay();
    }


  } catch (err) {
    console.error("Error al cargar efectivas:", err);
  }
}

/**
 * Carga los datos del set actual (efectivas, fallidas) desde archivos
 */
async function loadSetDataFromFiles() {
  try {
    // Cargar efectivas del set actual
    const efectivasBlanco = await DataManager.loadSetFile("totalEfectivasBlanco");
    const efectivasAmarillo = await DataManager.loadSetFile("totalEfectivasAmarillo");
    
    // Cargar fallidas del set actual
    const fallidasBlanco = await DataManager.loadSetFile("noCarambola_White");
    const fallidasAmarillo = await DataManager.loadSetFile("noCarambola_Yellow");
    
    // Cargar series más altas del set actual
    const highestserieWhite = await DataManager.loadSetFile("highestserieWhite");
    const entrada_serie_white = await DataManager.loadSetFile("entrada_serie_white");
    const highestserieYellow = await DataManager.loadSetFile("highestserieYellow");
    const entrada_serie_yellow = await DataManager.loadSetFile("entrada_serie_yellow");
    
    // Cargar entrada y puntos del set actual
    const entry = await DataManager.loadSetFile("entry");
    const pointWhite = await DataManager.loadSetFile("Point_White");
    const pointYellow = await DataManager.loadSetFile("Point_Yellow");
    
    // Actualizar DOM
    const valBlanco = parseInt(efectivasBlanco, 10) || 0;
    const valAmarillo = parseInt(efectivasAmarillo, 10) || 0;
    const valFallidasBlanco = parseInt(fallidasBlanco, 10) || 0;
    const valFallidasAmarillo = parseInt(fallidasAmarillo, 10) || 0;
    const valHighestserieWhite = parseInt(highestserieWhite, 10) || 0;
    const valEntrada_serie_white = parseInt(entrada_serie_white, 10) || 0;
    const valHighestserieYellow = parseInt(highestserieYellow, 10) || 0;
    const valEntrada_serie_yellow = parseInt(entrada_serie_yellow, 10) || 0;
    const valEntry = parseInt(entry, 10) || 1;
    const valPointWhite = parseInt(pointWhite, 10) || 0;
    const valPointYellow = parseInt(pointYellow, 10) || 0;
    
    const elemEfectivasBlanco = document.getElementById("totalEfectivasBlanco");
    const elemEfectivasAmarillo = document.getElementById("totalEfectivasAmarillo");
    const elemFallidasBlanco = document.getElementById("noCarambola_White");
    const elemFallidasAmarillo = document.getElementById("noCarambola_Yellow");
    const elemHighestserieWhite = document.getElementById("highestserieWhite");
    const elemEntrada_serie_white = document.getElementById("entrada_serie_white");
    const elemHighestserieYellow = document.getElementById("highestserieYellow");
    const elemEntrada_serie_yellow = document.getElementById("entrada_serie_yellow");
    const elemEntry = document.getElementById("entry");
    const elemPointWhite = document.getElementById("Point_White");
    const elemPointYellow = document.getElementById("Point_Yellow");
    
    if (elemEfectivasBlanco) elemEfectivasBlanco.textContent = valBlanco;
    if (elemEfectivasAmarillo) elemEfectivasAmarillo.textContent = valAmarillo;
    if (elemFallidasBlanco) elemFallidasBlanco.textContent = valFallidasBlanco;
    if (elemFallidasAmarillo) elemFallidasAmarillo.textContent = valFallidasAmarillo;
    if (elemHighestserieWhite) elemHighestserieWhite.textContent = valHighestserieWhite;
    if (elemEntrada_serie_white) elemEntrada_serie_white.textContent = valEntrada_serie_white;
    if (elemHighestserieYellow) elemHighestserieYellow.textContent = valHighestserieYellow;
    if (elemEntrada_serie_yellow) elemEntrada_serie_yellow.textContent = valEntrada_serie_yellow;
    
    // Actualizar entrada y puntos en el DOM
    if (elemEntry) {
      elemEntry.textContent = valEntry;
      window["valor_entry"] = valEntry;
    }
    if (elemPointWhite) {
      elemPointWhite.textContent = valPointWhite;
      window["valor_Point_White"] = valPointWhite;
    }
    if (elemPointYellow) {
      elemPointYellow.textContent = valPointYellow;
      window["valor_Point_Yellow"] = valPointYellow;
    }
    
    // Actualizar display con los valores cargados
    if (window.CounterManager && window.CounterManager.updateEntradaDisplay) {
      CounterManager.updateEntradaDisplay();
    }
    
    const setActual = DataManager.getSetActual();

  } catch (err) {
    console.error("Error al cargar datos del set:", err);
  }
}

// Cierre de DOMContentLoaded
