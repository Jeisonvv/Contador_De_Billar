/**
 * ================================================================
 * CONTADOR PRINCIPAL - Orquestador de Módulos
 * ================================================================
 * Inicializa y coordina todos los módulos de la aplicación
 */

document.addEventListener('DOMContentLoaded', function() {
  
  /**
   * Inicializar todos los módulos cuando el DOM esté listo
   */

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

  // 6. Escuchar evento de cierre desde Electron
  if (window.fileAPI && window.fileAPI.onResetMarker) {
    window.fileAPI.onResetMarker(() => {
      ResetManager.resetAllMarkers();
    });
  }

}); // Cierre de DOMContentLoaded
