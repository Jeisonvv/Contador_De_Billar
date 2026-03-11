/**
 * ================================================================
 * TABLE MANAGER - Gestión de Tabla de Resumen de Partida
 * ================================================================
 * Genera y actualiza dinámicamente la tabla con entradas, puntos totales
 * y resalta al ganador en verde
 */

const TableManager = (() => {
  /**
   * Obtiene los datos actuales para la tabla
   * @returns {object} Objeto con datos de ambos jugadores
   */
  function getTableData() {
    // Obtener nombres de jugadores
    const whitePlayerName = document.getElementById("nameWhitePlayer")?.value || "BLANCO";
    const yellowPlayerName = document.getElementById("nameYellowPlayer")?.value || "AMARILLO";

    // Obtener entradas actuales
    const entries = parseInt(document.getElementById("entry")?.textContent || 0, 10);

    // Obtener puntos totales (acumulados en marcadores)
    const whiteTotal = parseInt(document.getElementById("whitePlayerMarcador")?.textContent || 0, 10);
    const yellowTotal = parseInt(document.getElementById("yellowPlayerMarcador")?.textContent || 0, 10);

    return {
      whiteName: whitePlayerName,
      yellowName: yellowPlayerName,
      entries: entries,
      whiteTotal: whiteTotal,
      yellowTotal: yellowTotal
    };
  }

  /**
   * Identifica al ganador basado en puntos totales
   * @param {number} whiteTotal - Puntos totales del jugador blanco
   * @param {number} yellowTotal - Puntos totales del jugador amarillo
   * @returns {string} "white", "yellow", o "none" (si hay empate o ambos en 0)
   */
  function getWinner(whiteTotal, yellowTotal) {
    if (whiteTotal > yellowTotal) return "white";
    if (yellowTotal > whiteTotal) return "yellow";
    return "none";
  }

  /**
   * Renderiza la tabla dinámicamente
   */
  function renderTable() {
    const tbody = document.getElementById("resumenPartidaBody");
    if (!tbody) {
      console.error("ERROR: No se encontró el elemento resumenPartidaBody");
      return;
    }

    // Obtener datos
    const data = getTableData();
    const winner = getWinner(data.whiteTotal, data.yellowTotal);

    // Limpiar tabla
    tbody.innerHTML = "";

    // Crear fila para BLANCO
    const whiteRow = document.createElement("tr");
    whiteRow.className = winner === "white" ? "ganador" : "";
    whiteRow.innerHTML = `
      <td>${data.whiteName}</td>
      <td>${data.entries}</td>
      <td>${data.whiteTotal}</td>
    `;
    tbody.appendChild(whiteRow);

    // Crear fila para AMARILLO
    const yellowRow = document.createElement("tr");
    yellowRow.className = winner === "yellow" ? "ganador" : "";
    yellowRow.innerHTML = `
      <td>${data.yellowName}</td>
      <td>${data.entries}</td>
      <td>${data.yellowTotal}</td>
    `;
    tbody.appendChild(yellowRow);

    console.log(`📊 Tabla actualizada - Ganador: ${winner === "white" ? data.whiteName : winner === "yellow" ? data.yellowName : "Empate/Sin datos"}`);
  }

  /**
   * Inicializa los listeners para actualizar la tabla
   */
  function initializeListeners() {
    // Actualizar tabla cuando cambian los nombres
    document.getElementById("nameWhitePlayer")?.addEventListener("input", renderTable);
    document.getElementById("nameYellowPlayer")?.addEventListener("input", renderTable);

    // Actualizar tabla cuando cambian los marcadores
    const observerConfig = { childList: true, subtree: true, characterData: true };
    
    const whiteObserver = new MutationObserver(renderTable);
    const yellowObserver = new MutationObserver(renderTable);
    const entryObserver = new MutationObserver(renderTable);

    const whiteElement = document.getElementById("whitePlayerMarcador");
    const yellowElement = document.getElementById("yellowPlayerMarcador");
    const entryElement = document.getElementById("entry");

    if (whiteElement) whiteObserver.observe(whiteElement, observerConfig);
    if (yellowElement) yellowObserver.observe(yellowElement, observerConfig);
    if (entryElement) entryObserver.observe(entryElement, observerConfig);

    console.log("✅ TableManager listeners inicializados");
  }

  // Public API
  return {
    renderTable,
    initializeListeners,
    getTableData,
    getWinner
  };
})();

// Hacer accesible globalmente
window.TableManager = TableManager;
