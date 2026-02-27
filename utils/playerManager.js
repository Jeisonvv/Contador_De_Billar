/**
 * ================================================================
 * PLAYER MANAGER - Gestión de Información de Jugadores
 * ================================================================
 * Maneja el intercambio de Jugadores y sincronización de datos
 */

const PlayerManager = (() => {
  /**
   * Inicializa los listeners para sincronizar cambios de nombres y handicaps
   */
  function initializeListeners() {
    // Escuchar cambios de nombre del jugador blanco
    document.getElementById("nameWhitePlayer")?.addEventListener("input", (e) => {
      DataManager.saveGeneralFile("nombre_blanco", e.target.value);
    });

    // Escuchar cambios de handicap del jugador blanco
    document.getElementById("handicapWhitePlayer")?.addEventListener("input", (e) => {
      DataManager.saveGeneralFile("handicap_blanco", e.target.value);
    });

    // Escuchar cambios de nombre del jugador amarillo
    document.getElementById("nameYellowPlayer")?.addEventListener("input", (e) => {
      DataManager.saveGeneralFile("nombre_amarillo", e.target.value);
    });

    // Escuchar cambios de handicap del jugador amarillo
    document.getElementById("handicapYellowPlayer")?.addEventListener("input", (e) => {
      DataManager.saveGeneralFile("handicap_amarillo", e.target.value);
    });

    // Listener para intercambiar jugadores
    document.getElementById("Exchangebutton")?.addEventListener("click", exchange);
  }

  /**
   * Intercambia nombres y handicaps de ambos jugadores
   */
  function exchange() {
    const whiteName = document.getElementById("nameWhitePlayer");
    const yellowName = document.getElementById("nameYellowPlayer");
    const whiteHandicap = document.getElementById("handicapWhitePlayer");
    const yellowHandicap = document.getElementById("handicapYellowPlayer");

    // Intercambiar nombres
    const tempName = whiteName.value;
    whiteName.value = yellowName.value;
    yellowName.value = tempName;

    // Intercambiar handicaps
    const tempHandicap = whiteHandicap.value;
    whiteHandicap.value = yellowHandicap.value;
    yellowHandicap.value = tempHandicap;

    // Guardar los valores intercambiados en archivos
    DataManager.saveGeneralFile("nombre_blanco", whiteName.value);
    DataManager.saveGeneralFile("nombre_amarillo", yellowName.value);
    DataManager.saveGeneralFile("handicap_blanco", whiteHandicap.value);
    DataManager.saveGeneralFile("handicap_amarillo", yellowHandicap.value);
  }

  // Public API
  return {
    initializeListeners,
    exchange
  };
})();
