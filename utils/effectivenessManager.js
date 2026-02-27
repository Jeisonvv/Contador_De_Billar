/**
 * ================================================================
 * EFFECTIVENESS MANAGER - Gestión de Efectividad de Tacadas
 * ================================================================
 * Revisa cambios en puntos y entradas para determinar si una tacada fue efectiva
 */

const EffectivenessManager = (() => {
  // Estado anterior para comparación
  let previousState = {
    whitePoints: 0,
    yellowPoints: 0,
    entries: 0,
    timestamp: Date.now()
  };

  /**
   * Cargar estado anterior desde memoria
   */
  function loadPreviousState() {
    const entryElement = document.getElementById("entry");
    const white = parseInt(document.getElementById("Point_White")?.textContent || 0, 10);
    const yellow = parseInt(document.getElementById("Point_Yellow")?.textContent || 0, 10);
    const entries = parseInt(entryElement?.textContent || 0, 10);

    console.log(`📖 loadPreviousState() leyendo del DOM: entry=${entries}, white=${white}, yellow=${yellow}`);

    previousState = {
      whitePoints: white,
      yellowPoints: yellow,
      entries: entries,
      timestamp: Date.now()
    };
    
    console.log(`📋 EffectivenessManager inicializado - Previous State: entries=${entries}, white=${white}, yellow=${yellow}`);
  }

  /**
   * Obtiene el estado actual
   */
  function getCurrentState() {
    const currentState = {
      whitePoints: parseInt(document.getElementById("Point_White")?.textContent || 0, 10),
      yellowPoints: parseInt(document.getElementById("Point_Yellow")?.textContent || 0, 10),
      entries: parseInt(document.getElementById("entry")?.textContent || 0, 10),
      timestamp: Date.now()
    };
    
    console.log(`📍 getCurrentState(): entries=${currentState.entries}, white=${currentState.whitePoints}, yellow=${currentState.yellowPoints}`);
    
    return currentState;
  }

  /**
   * Revisa si se realizó una tacada efectiva
   * Una tacada es efectiva si:
   * - Aumentaron los puntos (de al menos un jugador)
   * @returns {object} Información sobre la efectividad de la tacada
   */
  function checkEffectiveness() {
    const currentState = getCurrentState();
    
    const whitePointsAdded = currentState.whitePoints - previousState.whitePoints;
    const yellowPointsAdded = currentState.yellowPoints - previousState.yellowPoints;
    const entriesAdded = currentState.entries - previousState.entries;
    
    console.log(`🧮 Cálculo: entriesAdded = ${currentState.entries} (actual) - ${previousState.entries} (anterior) = ${entriesAdded}`);
    
    const isEffective = whitePointsAdded > 0 || yellowPointsAdded > 0;
    
    const result = {
      isEffective: isEffective,
      whitePointsAdded: whitePointsAdded,
      yellowPointsAdded: yellowPointsAdded,
      entriesAdded: entriesAdded,
      totalPointsAdded: whitePointsAdded + yellowPointsAdded,
      previousState: previousState,
      currentState: currentState,
      timestamp: currentState.timestamp
    };

    console.log("📊 Análisis de Tacada:", result);
    return result;
  }

  /**
   * Revisa si una tacada fue efectiva sin consumir entrada
   * @returns {boolean} True si hay puntos y no se consumió entrada
   */
  function isCleanShot() {
    const currentState = getCurrentState();
    
    const pointsAdded = (currentState.whitePoints - previousState.whitePoints) +
                        (currentState.yellowPoints - previousState.yellowPoints);
    const entriesAdded = currentState.entries - previousState.entries;
    
    return pointsAdded > 0 && entriesAdded === 0;
  }

  /**
   * Revisa si fue un error (consumió entrada sin puntos)
   * @returns {boolean} True si se consumió entrada pero no hay puntos
   */
  function isError() {
    const currentState = getCurrentState();
    
    const pointsAdded = (currentState.whitePoints - previousState.whitePoints) +
                        (currentState.yellowPoints - previousState.yellowPoints);
    const entriesAdded = currentState.entries - previousState.entries;
    
    return pointsAdded === 0 && entriesAdded > 0;
  }

  /**
   * Obtiene descripción texual de la efectividad
   * @returns {string} Descripción de la tacada
   */
  function getDescription() {
    const effectiveness = checkEffectiveness();
    
    if (!effectiveness.isEffective && effectiveness.entriesAdded === 0) {
      return "Sin cambios";
    }
    
    if (effectiveness.isEffective && effectiveness.entriesAdded === 0) {
      return `✅ Táicada Efectiva: +${effectiveness.totalPointsAdded} puntos`;
    }
    
    if (!effectiveness.isEffective && effectiveness.entriesAdded > 0) {
      return `❌ Error: Entrada consumida`;
    }
    
    if (effectiveness.isEffective && effectiveness.entriesAdded > 0) {
      return `⚠️  Táicada con Error: +${effectiveness.totalPointsAdded} puntos con +${effectiveness.entriesAdded} entrada(s)`;
    }
  }

  /**
   * Inicializa el monitor de efectividad
   * Debe llamarse después de cargar el DOM
   */
  function initialize() {
    loadPreviousState();
    console.log("✅ EffectivenessManager inicializado");
  }

  /**
   * Actualiza el estado anterior (deber llamarse después de guardar una tacada)
   */
  function updatePreviousState() {
    console.log("🔄 Actualizando previousState...");
    loadPreviousState();
    console.log("✅ previousState actualizado:", previousState);
  }

  // Public API
  return {
    initialize,
    checkEffectiveness,
    isCleanShot,
    isError,
    getDescription,
    updatePreviousState,
    getCurrentState,
    getPreviousState: () => previousState
  };
})();
