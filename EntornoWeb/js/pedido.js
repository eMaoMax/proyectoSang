document.addEventListener("DOMContentLoaded", () => {
  // Leer carrito desde sessionStorage
  const carritoRaw = sessionStorage.getItem('carrito');
  let carrito = [];
  if (carritoRaw) {
    try {
      carrito = JSON.parse(carritoRaw) || [];
    } catch (e) {
      console.error('Error parseando sessionStorage.carrito', e);
    }
  }

  console.log(carrito);

  // Crear sección para mostrar el carrito
  const carritoSection = document.createElement('section');
  carritoSection.className = 'mt-4 text-center';

  const title = document.createElement('h2');
  title.textContent = 'Carrito de compras';
  carritoSection.appendChild(title);

  if (!Array.isArray(carrito) || carrito.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'El carrito está vacío.';
    carritoSection.appendChild(empty);
  } else {
    const table = document.createElement('table');
    table.className = 'table table-striped mt-4';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
          <th>Acciones</th>
        </tr>
      </thead>
    `;

    const tbody = document.createElement('tbody');
    let total = 0;

    carrito.forEach((item, index) => {
      const tr = document.createElement('tr');
      const precio = Number(item.precio) || 0;
      const subtotal = Number(item.subtotal) || (precio * (Number(item.cantidad) || 0));
      total += subtotal;

      tr.innerHTML = `
        <td><img src="${item.imagen || ''}" alt="${item.nombreProducto || ''}" style="height:60px; object-fit:cover;"></td>
        <td>${item.nombreProducto || ''}</td>
        <td>$ ${precio.toLocaleString()}</td>
        <td>
          <input type="number" class="form-control qty-input" data-index="${index}" value="${item.cantidad || 0}" min="1" style="width: 70px;">
        </td>
        <td class="subtotal-cell">$ ${subtotal.toLocaleString()}</td>
        <td>
          <button class="btn update-qty-btn" data-index="${index}">
            <img src="img/editar.png" alt="editar" style="height:25px; object-fit:cover;">
          </button>
          <button class="btn remove-btn" data-index="${index}">
            <img src="img/eliminar.png" alt="editar" style="height:25px; object-fit:cover;">
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    carritoSection.appendChild(table);

    const totalDiv = document.createElement('div');
    totalDiv.className = 'text-end fw-bold fs-4 mt-3';
    totalDiv.id = 'total-carrito';
    totalDiv.textContent = `Total: $ ${Number(total).toLocaleString()}`;
    carritoSection.appendChild(totalDiv);

    // Botón confirmar pedido
    const confirmBtn = document.createElement('button');
    confirmBtn.id = 'confirm-order-btn';
    confirmBtn.className = 'btn btn-success mt-3';
    confirmBtn.textContent = 'Confirmar Pedido';
    carritoSection.appendChild(confirmBtn);

    // Manejar confirmación de pedido: registrar en servidor y en detalle_pedido
    confirmBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');

      // Si no hay usuario en localStorage, redirigir a login
      if (!userId || !userRole) {
        alert('Debes iniciar sesión o registrarte antes de confirmar el pedido. Serás redirigido al login.');
        window.location.href = '../Login/viwe/login.html';
        return;
      }

      // Confirmar intención
      const confirmar = confirm('¿Deseas confirmar tu pedido ahora?');
      if (!confirmar) return;

      // Calcular nuevoTotal a partir del carrito
      let nuevoTotal = 0;
      const carritoProcesado = carrito.map(item => {
        const precio = Number(item.precio) || 0;
        const cantidad = Number(item.cantidad) || 0;
        const subtotal = Number(item.subtotal) || (precio * cantidad);
        nuevoTotal += subtotal;
        return {
          ...item,
          precio,
          cantidad,
          subtotal
        };
      });

      const fecha = new Date().toISOString();
      const pedidoPayload = {
        id_fkUsuario: Number(userId) || userId,
        fecha_pedido: fecha,
        estado_pedido: 'Pedido Confirmado',
        sub_total: nuevoTotal,
        iva: '0.19',
        total: nuevoTotal + (nuevoTotal * 0.19)
      };

      try {
        // Enviar pedido
        const resp = await fetch('http://sang.somee.com/api/pedido', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pedidoPayload)
        });

        if (!resp.ok) throw new Error('Error creando pedido: ' + resp.statusText);
        const pedidoResult = await resp.json();

        // Intentar extraer el id del pedido creado
        let id_pedido = pedidoResult.id_pedido || pedidoResult.id || (Array.isArray(pedidoResult) && (pedidoResult[0] && (pedidoResult[0].id_pedido || pedidoResult[0].id)));
        if (!id_pedido) id_pedido = pedidoResult.insertId || pedidoResult.insertedId;
        if (!id_pedido) {
          console.warn('No se recibió id_pedido en la respuesta del servidor:', pedidoResult);
          throw new Error('No se recibió id_pedido del servidor.');
        }

        // Enviar detalle por cada item
        const detallesPromises = carritoProcesado.map(item => {
          const detallePayload = {
            id_pedido: id_pedido,
            id_producto: item.id_producto,
            cantidad: item.cantidad,
            valor_total: item.subtotal
          };
          return fetch('http://sang.somee.com/api/detalle_pedido', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(detallePayload)
          }).then(r => {
            if (!r.ok) throw new Error('Error creando detalle: ' + r.statusText);
            return r.json();
          });
        });

        await Promise.all(detallesPromises);

        // Si todo sale bien, limpiar carrito y redirigir
        sessionStorage.removeItem('carrito');
        alert('Pedido registrado correctamente.');
        window.location.href = 'index.html';

      } catch (err) {
        console.error('Error al registrar pedido:', err);
        alert('Ocurrió un error al registrar el pedido: ' + (err.message || err));
      }
    });

    // Función para recalcular el total
    function recalcularTotal() {
      let nuevoTotal = 0;
      document.querySelectorAll('tbody tr').forEach((row, idx) => {
        const subtotalCell = row.querySelector('.subtotal-cell');
        const qtyInput = row.querySelector('.qty-input');
        if (qtyInput && subtotalCell && carrito[idx]) {
          const precio = Number(carrito[idx].precio) || 0;
          const qty = parseInt(qtyInput.value) || 0;
          const subtotal = precio * qty;
          subtotalCell.textContent = `$ ${subtotal.toLocaleString()}`;
          nuevoTotal += subtotal;
        }
      });
      document.getElementById('total-carrito').textContent = `Total: $ ${Number(nuevoTotal).toLocaleString()}`;
    }

    // Usar delegación de eventos en la tabla
    table.addEventListener('click', (e) => {
      const updateBtn = e.target.closest('.update-qty-btn');
      const removeBtn = e.target.closest('.remove-btn');

      if (updateBtn) {
        e.preventDefault();
        const index = parseInt(updateBtn.dataset.index);
        const input = table.querySelector(`.qty-input[data-index="${index}"]`);
        const newQty = parseInt(input.value) || 0;

        if (newQty <= 0) {
          alert('Por favor ingresa una cantidad mayor a 0.');
          input.value = carrito[index].cantidad;
          return;
        }

        carrito[index].cantidad = newQty;
        carrito[index].subtotal = carrito[index].precio * newQty;

        sessionStorage.setItem('carrito', JSON.stringify(carrito));
        recalcularTotal();
      }

      if (removeBtn) {
        e.preventDefault();
        const index = parseInt(removeBtn.dataset.index);
        if (confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
          carrito.splice(index, 1);
          sessionStorage.setItem('carrito', JSON.stringify(carrito));
          location.reload();
        }
      }
    });
  }

  // Insertar la sección del carrito debajo del main.card (si existe) o al final del container
  const mainCard = document.querySelector('main.card');
  if (mainCard && mainCard.parentNode) {
    mainCard.parentNode.insertBefore(carritoSection, mainCard.nextSibling);
  } else {
    const container = document.querySelector('.container') || document.body;
    container.appendChild(carritoSection);
  }



});