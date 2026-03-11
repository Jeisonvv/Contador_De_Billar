/**
 * ================================================================
 * SCORE MANAGER - Gestión de Acumulación de Puntos
 * ================================================================
 * Maneja la acumulación de puntos y sincronización con marcadores
 */

const ScoreManager = (() => {
  // 🔵 VARIABLES BOOLEANAS POR JUGADOR PARA RASTREAR EFECTIVIDAD
  // Se ponen en true cuando se actualiza con puntos, se revisan al cambiar entrada
  window.isWhiteEffective = false;
  window.isYellowEffective = false;

  /**
   * Acumula puntos del contador actual al marcador
   * @param {string} idContador - ID del contador de puntos
   * @param {string} idMarcador - ID del marcador acumulado
   * @param {string} playerColor - Color del jugador ("White" o "Yellow")
   */
  async function accumulate(idContador, idMarcador, playerColor) {
    // Obtener puntos actuales del contador
    const puntosActuales = parseInt(document.getElementById(idContador).textContent, 10) || 0;

    // Obtener marcador actual
    let marcador = document.getElementById(idMarcador);
    let puntosAcumulados = parseInt(marcador.textContent, 10) || 0;

    // 🔵 SI HAY PUNTOS QUE ACUMULAR, MARCAR COMO EFECTIVA PARA ESTE JUGADOR
    if (puntosActuales > 0) {
      if (playerColor === "White") {
        window.isWhiteEffective = true;
        console.log(`✅ Entrada BLANCO marcada como EFECTIVA (puntos acumulados: ${puntosActuales})`);
      } else if (playerColor === "Yellow") {
        window.isYellowEffective = true;
        console.log(`✅ Entrada AMARILLO marcada como EFECTIVA (puntos acumulados: ${puntosActuales})`);
      }
    }

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
    await DataManager.saveSetFile(idMarcador, puntosAcumulados);
    await DataManager.saveSetFile(idContador, 0);
    await DataManager.saveGeneralFile(idMarcador, puntosAcumulados);
    await DataManager.saveGeneralFile(idContador, 0);
  }

  /**
   * Inicializa los listeners para acumular puntos
   */
  function initializeListeners() {
    document.getElementById("buttonWhitePlayerMarcador")?.addEventListener("click", async () => {
      await accumulate("Point_White", "whitePlayerMarcador", "White");
    });

    document.getElementById("buttonYellowPlayerMarcador")?.addEventListener("click", async () => {
      await accumulate("Point_Yellow", "yellowPlayerMarcador", "Yellow");
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

