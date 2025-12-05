document.addEventListener("DOMContentLoaded", () => {
  const modalPago = document.getElementById("modalPago");
  const totalPagoEl = document.getElementById("totalPago");
  const formaPagoSelect = document.getElementById("formaPago");
  const btnPagar = document.getElementById("btnPagar");
  const btnCancelar = document.getElementById("btnCancelar");

  // Leer el total desde sessionStorage.currentOrder o calcularlo del carrito
  let totalAPagar = 0;

  function cargarTotal() {
    const currentOrder = sessionStorage.getItem("currentOrder");
    if (currentOrder) {
      try {
        const order = JSON.parse(currentOrder);
        totalAPagar = order.total || 0;
      } catch (e) {
        console.error("Error parseando currentOrder", e);
        totalAPagar = 0;
      }
    } else {
      // Si no hay currentOrder, intentar leerlo del carrito (fallback)
      const carritoRaw = sessionStorage.getItem("carrito");
      if (carritoRaw) {
        try {
          const carrito = JSON.parse(carritoRaw);
          let subtotal = 0;
          carrito.forEach(item => {
            subtotal += (Number(item.subtotal) || 0);
          });
          totalAPagar = subtotal + (subtotal * 0.19);
        } catch (e) {
          console.error("Error parseando carrito", e);
          totalAPagar = 0;
        }
      }
    }

    // Mostrar total con dos decimales
    if (totalPagoEl) {
      totalPagoEl.textContent = `$ ${Number(totalAPagar).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  // Cargar total cuando el modal se muestra
  if (modalPago) {
    modalPago.addEventListener("show.bs.modal", () => {
      cargarTotal();
    });
  }

  // Manejar botón Pagar: guardar transacción en API y actualizar pedido a 'Pagado'
  btnPagar.addEventListener("click", async () => {
    const formaPagoSeleccionada = formaPagoSelect.value;

    if (!formaPagoSeleccionada) {
      alert("Por favor, selecciona una forma de pago.");
      return;
    }

    // Obtener datos necesarios
    const userId = localStorage.getItem('userId');
    const id_pedido = sessionStorage.getItem('lastPedidoId') || (() => {
      const currentOrder = sessionStorage.getItem('currentOrder');
      if (currentOrder) {
        try { return JSON.parse(currentOrder).id_pedido || JSON.parse(currentOrder).id; } catch(e){return null}
      }
      return null;
    })();

    if (!id_pedido) {
      alert('No se encontró el id del pedido. Por favor intenta nuevamente.');
      return;
    }

    const pagoPayload = {
      forma_pago: formaPagoSeleccionada,
      id_fkUsuario: Number(userId) || userId,
      id_fkPedido: Number(id_pedido) || id_pedido
    };

    try {
      // Enviar registro de pago
      const respPago = await fetch('http://sang.somee.com/api/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagoPayload)
      });

      if (!respPago.ok) throw new Error('Error registrando pago: ' + respPago.statusText);

      // Marcar pedido como Pagado y enviar todos los datos requeridos
      const currentOrderRaw = sessionStorage.getItem('currentOrder');
      let orderData = {};
      if (currentOrderRaw) {
        try { orderData = JSON.parse(currentOrderRaw); } catch(e){}
      }
      // Calcular sub_total si no existe o es 0
      let subTotalFinal = 0;
      if (orderData.sub_total && orderData.sub_total > 0) {
        subTotalFinal = orderData.sub_total;
      } else if (orderData.subtotal && orderData.subtotal > 0) {
        subTotalFinal = orderData.subtotal;
      } else if (orderData.items && Array.isArray(orderData.items)) {
        subTotalFinal = orderData.items.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0);
      } else if (totalAPagar > 0) {
        subTotalFinal = Number(totalAPagar) / 1.19;
      }
      const putPayload = {
        id_pedido: Number(id_pedido) || id_pedido,
        id_fkUsuario: Number(userId) || userId,
        estado_pedido: 'Pagado',
        sub_total: subTotalFinal,
        iva: orderData.iva || '0.19',
        total: orderData.total || totalAPagar
      };
      const respPut = await fetch(`http://sang.somee.com/api/pedido/${id_pedido}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(putPayload)
      });

      if (!respPut.ok) throw new Error('Error actualizando pedido: ' + respPut.statusText);

      // Éxito: limpiar y cerrar modal
      alert(`Pago de $ ${Number(totalAPagar).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} realizado exitosamente mediante ${formaPagoSeleccionada}.`);
      sessionStorage.removeItem('carrito');
      sessionStorage.removeItem('currentOrder');
      sessionStorage.removeItem('lastPedidoId');

      const modal = bootstrap.Modal.getInstance(modalPago);
      if (modal) modal.hide();

      setTimeout(() => { window.location.href = 'index.html'; }, 500);

    } catch (err) {
      console.error('Error procesando pago:', err);
      alert('Ocurrió un error al procesar el pago: ' + (err.message || err));
    }
  });

  // Manejar botón Cancelar: actualizar pedido a 'Cancelado' en la API
  btnCancelar.addEventListener('click', async () => {
    const id_pedido = sessionStorage.getItem('lastPedidoId') || (() => {
      const currentOrder = sessionStorage.getItem('currentOrder');
      if (currentOrder) {
        try { return JSON.parse(currentOrder).id_pedido || JSON.parse(currentOrder).id; } catch(e){return null}
      }
      return null;
    })();

    if (!id_pedido) {
      // simplemente cerrar
      return;
    }

    if (!confirm('¿Deseas cancelar el pedido?')) return;

    try {
      const userId = localStorage.getItem('userId');
      const currentOrderRaw = sessionStorage.getItem('currentOrder');
      let orderData = {};
      if (currentOrderRaw) {
        try { orderData = JSON.parse(currentOrderRaw); } catch(e){}
      }
      // Calcular sub_total si no existe o es 0
      let subTotalFinalCancel = 0;
      if (orderData.sub_total && orderData.sub_total > 0) {
        subTotalFinalCancel = orderData.sub_total;
      } else if (orderData.subtotal && orderData.subtotal > 0) {
        subTotalFinalCancel = orderData.subtotal;
      } else if (orderData.items && Array.isArray(orderData.items)) {
        subTotalFinalCancel = orderData.items.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0);
      } else if (totalAPagar > 0) {
        subTotalFinalCancel = Number(totalAPagar) / 1.19;
      }
      const putPayload = {
        id_pedido: Number(id_pedido) || id_pedido,
        id_fkUsuario: Number(userId) || userId,
        estado_pedido: 'Cancelado',
        sub_total: subTotalFinalCancel,
        iva: orderData.iva || '0.19',
        total: orderData.total || totalAPagar
      };
      const respPut = await fetch(`http://sang.somee.com/api/pedido/${id_pedido}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(putPayload)
      });

      if (!respPut.ok) throw new Error('Error actualizando pedido: ' + respPut.statusText);

      sessionStorage.removeItem('lastPedidoId');
      alert('Pedido cancelado correctamente.');
      const modal = bootstrap.Modal.getInstance(modalPago);
      if (modal) modal.hide();
      setTimeout(() => { window.location.href = 'index.html'; }, 500);
    } catch (err) {
      console.error('Error cancelando pedido:', err);
      alert('Ocurrió un error al cancelar el pedido: ' + (err.message || err));
    }
  });

  // Inicializar: cargar total al documento
  cargarTotal();
});
