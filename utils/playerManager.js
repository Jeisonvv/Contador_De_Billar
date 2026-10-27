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
    document.getElementById("nameWhitePlayer")?.addEventListener("change", async (e) => {
      await DataManager.saveGeneralFile("nombre_blanco", e.target.value);
      // Actualizar el h4 con el nombre del jugador blanco
      const blancoHeader = document.getElementById("blancoHeader");
      if (blancoHeader) {
        blancoHeader.textContent = e.target.value || "BLANCO";
      }
    });

    // Escuchar cambios de handicap del jugador blanco
    document.getElementById("handicapWhitePlayer")?.addEventListener("change", async (e) => {
      await DataManager.saveGeneralFile("handicap_blanco", e.target.value);
    });

    // Escuchar cambios de nombre del jugador amarillo
    document.getElementById("nameYellowPlayer")?.addEventListener("change", async (e) => {
      await DataManager.saveGeneralFile("nombre_amarillo", e.target.value);
      // Actualizar el h4 con el nombre del jugador amarillo
      const amarilloHeader = document.getElementById("amarilloHeader");
      if (amarilloHeader) {
        amarilloHeader.textContent = e.target.value || "AMARILLO";
      }
    });

    // Escuchar cambios de handicap del jugador amarillo
    document.getElementById("handicapYellowPlayer")?.addEventListener("change", async (e) => {
      await DataManager.saveGeneralFile("handicap_amarillo", e.target.value);
    });

    // Listener para intercambiar jugadores
    document.getElementById("Exchangebutton")?.addEventListener("click", exchange);
  }

  /**
   * Intercambia nombres y handicaps de ambos jugadores
   */
  async function exchange() {
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

    // Actualizar los h4 con los nombres intercambiados
    const blancoHeader = document.getElementById("blancoHeader");
    const amarilloHeader = document.getElementById("amarilloHeader");
    if (blancoHeader) {
      blancoHeader.textContent = whiteName.value || "BLANCO";
    }
    if (amarilloHeader) {
      amarilloHeader.textContent = yellowName.value || "AMARILLO";
    }

    // Guardar los valores intercambiados en archivos
    await DataManager.saveGeneralFile("nombre_blanco", whiteName.value);
    await DataManager.saveGeneralFile("nombre_amarillo", yellowName.value);
    await DataManager.saveGeneralFile("handicap_blanco", whiteHandicap.value);
    await DataManager.saveGeneralFile("handicap_amarillo", yellowHandicap.value);
  }

  // Public API
  return {
    initializeListeners,
    exchange
  };
})();

// Hacer accesible globalmente
window.PlayerManager = PlayerManager;
