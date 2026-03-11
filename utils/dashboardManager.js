/**
 * ================================================================
 * DASHBOARD MANAGER - Gestión del Dashboard de Datos de Partida
 * ================================================================
 * Genera dinámicamente el contenido completo de datos de partida:
 * - Efectivas, fallidas, porcentaje
 * - Entradas
 * - Puntos totales
 * - Identificación del ganador (resaltado en verde)
 */

const DashboardManager = (() => {
  /**
   * Obtiene todos los datos necesarios para el dashboard
   * @returns {object} Objeto con datos de ambos jugadores
   */
  function getDashboardData() {
    // Datos de BLANCO
    const whiteEfectivas = parseInt(document.getElementById("totalEfectivasBlanco")?.textContent || 0, 10);
    const whiteFallidas = parseInt(document.getElementById("noCarambola_White")?.textContent || 0, 10);
    const whiteTotalEntradas = whiteEfectivas + whiteFallidas;
    const whitePromedioPct = whiteTotalEntradas > 0 ? Math.round((whiteEfectivas / whiteTotalEntradas) * 100) : 0;
    const whitePuntos = parseInt(document.getElementById("whitePlayerMarcador")?.textContent || 0, 10);
    const whitePuntosPromedio = whiteTotalEntradas > 0 ? Math.round((whitePuntos / whiteTotalEntradas) * 1000) : 0;
    const whiteSerieAlta = parseInt(document.getElementById("highestserieWhite")?.textContent || 0, 10);
    const whiteEntradaSerie = parseInt(document.getElementById("entrada_serie_white")?.textContent || 0, 10);
    const whitePlayerName = document.getElementById("nameWhitePlayer")?.value || "BLANCO";

    // Datos de AMARILLO
    const yellowEfectivas = parseInt(document.getElementById("totalEfectivasAmarillo")?.textContent || 0, 10);
    const yellowFallidas = parseInt(document.getElementById("noCarambola_Yellow")?.textContent || 0, 10);
    const yellowTotalEntradas = yellowEfectivas + yellowFallidas;
    const yellowPromedioPct = yellowTotalEntradas > 0 ? Math.round((yellowEfectivas / yellowTotalEntradas) * 100) : 0;
    const yellowPuntos = parseInt(document.getElementById("yellowPlayerMarcador")?.textContent || 0, 10);
    const yellowPuntosPromedio = yellowTotalEntradas > 0 ? Math.round((yellowPuntos / yellowTotalEntradas) * 1000) : 0;
    const yellowSerieAlta = parseInt(document.getElementById("highestserieYellow")?.textContent || 0, 10);
    const yellowEntradaSerie = parseInt(document.getElementById("entrada_serie_yellow")?.textContent || 0, 10);
    const yellowPlayerName = document.getElementById("nameYellowPlayer")?.value || "AMARILLO";

    // Identificar ganador
    let ganador = "none";
    if (whitePuntos > yellowPuntos) ganador = "white";
    else if (yellowPuntos > whitePuntos) ganador = "yellow";

    return {
      white: {
        name: whitePlayerName,
        efectivas: whiteEfectivas,
        fallidas: whiteFallidas,
        promedioPct: whitePromedioPct,
        puntos: whitePuntos,
        puntosPromedio: whitePuntosPromedio,
        serieAlta: whiteSerieAlta,
        entradaSerie: whiteEntradaSerie,
        isGanador: ganador === "white"
      },
      yellow: {
        name: yellowPlayerName,
        efectivas: yellowEfectivas,
        fallidas: yellowFallidas,
        promedioPct: yellowPromedioPct,
        puntos: yellowPuntos,
        puntosPromedio: yellowPuntosPromedio,
        serieAlta: yellowSerieAlta,
        entradaSerie: yellowEntradaSerie,
        isGanador: ganador === "yellow"
      }
    };
  }

  /**
   * Crea el HTML para un jugador
   * @param {string} color - "white" o "yellow"
   * @param {object} datos - Objeto con datos del jugador
   * @returns {string} HTML generado
   */
  function createPlayerHTML(color, datos) {
    const isGanador = datos.isGanador;
    const clasesGanador = isGanador ? "ganador" : "";
    const colorClass = color === "white" ? "white" : "yellow";

    return `
      <div class="efectividad_player ${clasesGanador}" data-ganador="${isGanador}">
        <h4 class="player-name ${colorClass}">${datos.name.toUpperCase()}</h4>
        
        <div class="efectividad_item">
          <p class="label">Entradas Efectivas</p>
          <p class="valor">${datos.efectivas}</p>
        </div>
        
        <div class="efectividad_item">
          <p class="label">Entradas Fallidas</p>
          <p class="valor">${datos.fallidas}</p>
        </div>
        
        <div class="efectividad_item">
          <p class="label">Porcentaje Efectividad</p>
          <p class="valor">${datos.promedioPct}%</p>
        </div>
        
        <div class="efectividad_item">
          <p class="label">Entradas Totales</p>
          <p class="valor">${datos.efectivas + datos.fallidas}</p>
        </div>
        
        <div class="efectividad_item">
          <p class="label">Puntos Totales</p>
          <p class="valor">${datos.puntos}</p>
        </div>
        
        <div class="efectividad_item">
          <p class="label">Promedio Jugador</p>
          <p class="valor">${datos.puntosPromedio}</p>
        </div>
        
        <div class="efectividad_item">
          <p class="label">Serie Más Alta</p>
          <p class="valor">${datos.serieAlta} carambolas (entrada ${datos.entradaSerie})</p>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza el dashboard completo
   */
  function renderDashboard() {
    const container = document.getElementById("containerEfectividad");
    if (!container) {
      console.error("ERROR: Contenedor containerEfectividad no encontrado");
      return;
    }

    // Obtener datos
    const datos = getDashboardData();

    // Determinar ganador
    let ganadorText = "EMPATADOS";
    let ganadorClass = "empate";
    let nombreGanador = "";
    
    if (datos.white.isGanador) {
      ganadorText = `🏆 ${datos.white.name.toUpperCase()} VA GANANDO`;
      ganadorClass = "white-ganador";
      nombreGanador = datos.white.name.toUpperCase();
    } else if (datos.yellow.isGanador) {
      ganadorText = `🏆 ${datos.yellow.name.toUpperCase()} VA GANANDO`;
      ganadorClass = "yellow-ganador";
      nombreGanador = datos.yellow.name.toUpperCase();
    }

    // Crear HTML
    let html = `
      <div class="ganador_actual ${ganadorClass}">
        <div class="ganador_info">
          <p class="label_ganador">GANADOR</p>
          <p class="nombre_ganador">${nombreGanador || "EMPATADOS"}</p>
        </div>
      </div>

      <div class="efectividad_header">
        <h3>DATOS DE PARTIDA</h3>
      </div>
      <div class="efectividad_content">
        ${createPlayerHTML("white", datos.white)}
        ${createPlayerHTML("yellow", datos.yellow)}
      </div>
    `;

    // Insertar en el contenedor
    container.innerHTML = html;

    // Log para debug
    console.log(`📊 Dashboard actualizado - Ganador: ${ganadorText}`);
  }

  /**
   * Inicializa los listeners para actualizar el dashboard
   */
  function initializeListeners() {
    // Actualizar dashboard cuando cambian los nombres
    document.getElementById("nameWhitePlayer")?.addEventListener("input", renderDashboard);
    document.getElementById("nameYellowPlayer")?.addEventListener("input", renderDashboard);

    // Usar MutationObserver para detectar cambios en elementos observados
    const observerConfig = { childList: true, subtree: true, characterData: true };
    
    const elementsToObserve = [
      "totalEfectivasBlanco",
      "totalEfectivasAmarillo",
      "noCarambola_White",
      "noCarambola_Yellow",
      "whitePlayerMarcador",
      "yellowPlayerMarcador",
      "highestserieWhite",
      "highestserieYellow",
      "entrada_serie_white",
      "entrada_serie_yellow"
    ];

    elementsToObserve.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new MutationObserver(renderDashboard);
        observer.observe(element, observerConfig);
      }
    });

    console.log("✅ DashboardManager listeners inicializados");
  }

  // Public API
  return {
    renderDashboard,
    initializeListeners,
    getDashboardData
  };
})();

// Hacer accesible globalmente
window.DashboardManager = DashboardManager;
