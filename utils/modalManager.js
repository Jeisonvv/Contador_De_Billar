/**
 * ================================================================
 * MODAL MANAGER - Gestión de Modales
 * ================================================================
 * Maneja la creación y visualización de modales de confirmación
 */

const ModalManager = (() => {
  /**
   * Muestra un modal personalizado con opciones Sí/No
   * @param {string} mensaje - Texto a mostrar
   * @param {function} callback - Función a ejecutar con resultado (true/false)
   */
  function showConfirmation(mensaje, callback) {
    let modal = document.getElementById('modalConfirmacion');

    if (!modal) {
      // Crear modal si no existe
      modal = document.createElement('div');
      modal.id = 'modalConfirmacion';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.35)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = 10000;

      modal.innerHTML = `
        <div style="background: #fff; padding: 36px 48px; border-radius: 18px; box-shadow: 0 4px 24px #0003; text-align: center; min-width: 320px; max-width: 90vw;">
          <div id="modalMensaje" style="margin-bottom: 28px; font-size: 1.25em; color: #222; font-weight: 600; letter-spacing: 0.5px;">${mensaje}</div>
          <button id="btnConfirmarSi" style="margin-right: 32px; padding: 10px 36px; font-size: 1.1em; background: #4caf50; color: #fff; border: none; border-radius: 6px; cursor: pointer; transition: background 0.2s; font-weight: 500;">Sí</button>
          <button id="btnConfirmarNo" style="padding: 10px 36px; font-size: 1.1em; background: #f44336; color: #fff; border: none; border-radius: 6px; cursor: pointer; transition: background 0.2s; font-weight: 500;">No</button>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      // Actualizar mensaje si el modal ya existe
      const mensajeDiv = modal.querySelector('#modalMensaje');
      if (mensajeDiv) mensajeDiv.textContent = mensaje;
      modal.style.display = 'flex';
    }

    // Agregar efectos hover
    setTimeout(() => {
      const btnSi = document.getElementById('btnConfirmarSi');
      const btnNo = document.getElementById('btnConfirmarNo');

      if (btnSi) {
        btnSi.onmouseover = () => btnSi.style.background = '#388e3c';
        btnSi.onmouseout = () => btnSi.style.background = '#4caf50';
      }
      if (btnNo) {
        btnNo.onmouseover = () => btnNo.style.background = '#b71c1c';
        btnNo.onmouseout = () => btnNo.style.background = '#f44336';
      }
    }, 10);

    // Listeners de respuesta
    document.getElementById('btnConfirmarSi').onclick = function() {
      modal.style.display = 'none';
      callback(true);
    };

    document.getElementById('btnConfirmarNo').onclick = function() {
      modal.style.display = 'none';
      callback(false);
    };
  }

  // Public API
  return {
    showConfirmation
  };
})();

// Hacer accesible globalmente
window.ModalManager = ModalManager;
