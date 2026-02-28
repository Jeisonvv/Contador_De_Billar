/**
 * ================================================================
 * STATS MANAGER - Gestión de Estadísticas (Promedios y Series)
 * ================================================================
 * Calcula promedios de puntos por entrada y gestiona series/rachas
 */

const StatsManager = (() => {
  /**
   * Calcula y actualiza el promedio de puntos por entrada
   * @param {string} idMarcador - ID del marcador acumulado
   * @param {string} idPuntos - ID del contador de puntos actual
   * @param {string} idEntradas - ID del contador de entradas
   * @param {string} idPromedio - ID del elemento que muestra el promedio
   * @param {string} archivo - Nombre del archivo donde guardar
   */
  function calculateAndUpdateAverage(
    idMarcador,
    idPuntos,
    idEntradas,
    idPromedio,
    archivo
  ) {
    const marcador = parseInt(document.getElementById(idMarcador).textContent, 10) || 0;
    const puntos = parseInt(document.getElementById(idPuntos).textContent, 10) || 0;
    const entradas = parseInt(document.getElementById(idEntradas).textContent, 10) || 1;

    // Calcular promedio: (marcador + puntos) / entradas * 1000
    const promedio = Math.round(((marcador + puntos) / entradas) * 1000);
    const promedioTexto = `Prom:  ${promedio}`;

    document.getElementById(idPromedio).textContent = promedio;
    DataManager.saveGeneralFile(archivo, promedioTexto);
  }

  /**
   * Actualiza el promedio del jugador blanco
   */
  function updateWhiteAverage() {
    calculateAndUpdateAverage(
      "whitePlayerMarcador",
      "Point_White",
      "entry",
      "promedio_white_tabla",
      "promedio_blanco"
    );
  }

  /**
   * Actualiza el promedio del jugador amarillo
   */
  function updateYellowAverage() {
    calculateAndUpdateAverage(
      "yellowPlayerMarcador",
      "Point_Yellow",
      "entry",
      "promedio_yellow_tabla",
      "promedio_amarillo"
    );
  }

  /**
   * Actualiza la serie (racha) más alta del jugador
   * @param {string} idPoint - ID del contador de puntos actual
   * @param {string} idSerie - ID de la serie más alta
   * @param {string} identry - ID del contador de entradas
   * @param {string} idserieEntry - ID de la entrada donde ocurrió la serie
   */
  function updateSeries(idPoint, idSerie, identry, idserieEntry) {
    const point = Number(document.getElementById(idPoint).textContent) || 0;
    const serie = Number(document.getElementById(idSerie).textContent) || 0;
    const entrada = Number(document.getElementById(identry).textContent) || 0;

    if (point > serie) {
      document.getElementById(idSerie).textContent = point;
      document.getElementById(idserieEntry).textContent = entrada;
      DataManager.saveSetFile(idSerie, point);
    }
  }

  /**
   * Inicializa todos los listeners de estadísticas
   */
  function initializeListeners() {
    // Listeners para actualizar promedios del jugador blanco
    document.getElementById("buttonWhitePlayerMarcador")?.addEventListener("click", updateWhiteAverage);
    document.getElementById("increase_white")?.addEventListener("click", updateWhiteAverage);
    document.getElementById("decrease_white")?.addEventListener("click", updateWhiteAverage);
    document.getElementById("increase_entry")?.addEventListener("click", updateWhiteAverage);
    document.getElementById("decrease_entry")?.addEventListener("click", updateWhiteAverage);

    // Listeners para actualizar promedios del jugador amarillo
    document.getElementById("buttonYellowPlayerMarcador")?.addEventListener("click", updateYellowAverage);
    document.getElementById("increase_yellow")?.addEventListener("click", updateYellowAverage);
    document.getElementById("decrease_yellow")?.addEventListener("click", updateYellowAverage);
    document.getElementById("increase_entry")?.addEventListener("click", updateYellowAverage);
    document.getElementById("decrease_entry")?.addEventListener("click", updateYellowAverage);

    // Listeners para actualizar series
    ["increase_yellow", "decrease_yellow", "buttonYellowPlayerMarcador"].forEach((id) => {
      document.getElementById(id)?.addEventListener("click", () => {
        updateSeries("Point_Yellow", "highestserieYellow", "entry", "entrada_serie_yellow");
      });
    });

    ["increase_white", "decrease_white", "buttonWhitePlayerMarcador"].forEach((id) => {
      document.getElementById(id)?.addEventListener("click", () => {
        updateSeries("Point_White", "highestserieWhite", "entry", "entrada_serie_white");
      });
    });
  }

  // Public API
  return {
    calculateAndUpdateAverage,
    updateWhiteAverage,
    updateYellowAverage,
    updateSeries,
    initializeListeners
  };
})();

// Hacer accesible globalmente
window.StatsManager = StatsManager;
