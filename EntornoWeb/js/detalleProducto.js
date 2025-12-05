document.addEventListener("DOMContentLoaded", () => {
  const imgDetalleProducto = document.getElementById("imgDetalleProducto");

  const urlParams = new URLSearchParams(window.location.search);
  const id_producto = urlParams.get("id");

  console.log(id_producto)

  // Verificar si se obtuvo un id_categoria
  if (!id_producto) {
    console.error("No se encontró el id_producto en la URL.");
    imgDetalleProducto.innerHTML =
        '<p class="text-danger">Selecciona un producto para ver su detalle.</p>';
    return; // Detiene la ejecución si no hay ID
  }

  // Obtener todos los campos de la página
  const nombreProducto = document.getElementById("nombre_producto");
  const descripcion = document.getElementById("descripcion");
  const precio = document.getElementById("precio");
  const cantidad = document.getElementById("quantity");
  const subtotal = document.getElementById("subtotal");

  // Variable para guardar el producto actual
  let currentProduct = null;

  // Función para obtener y mostrar los detalles del producto
  const agregarProductoBtn = document.getElementById("agregarProducto");

  function detalleProducto() {
    fetch(`http://sang.somee.com/api/producto/${id_producto}`)
      .then((response) => response.json())
      .then((data) => {

        console.log(data)

        // Usamos el primer elemento devuelto por la API
        if (Array.isArray(data) && data.length > 0) {
          const producto = data[0];
          currentProduct = producto;

          imgDetalleProducto.innerHTML = `
            <div class="product-image rounded d-flex justify-content-center align-items-center" style="height: 400px;">
              <img src="${producto.imagen}" alt="${producto.nombre_producto}" class="img-fluid" style="max-height: 100%; max-width: 100%;">
            </div>
          `;
          nombreProducto.textContent = producto.nombre_producto || '';
          descripcion.textContent = producto.descripcion || '';
          // Mostrar precio formateado pero mantener valor numérico en currentProduct.precio
          precio.textContent = `$ ${Number(producto.precio).toLocaleString()}` || '';
        }

        // Actualizar subtotal al cambiar la cantidad
        cantidad.addEventListener("input", () => {
          const qty = parseInt(cantidad.value) || 0;
          const price = (currentProduct && Number(currentProduct.precio)) || 0;
          const total = qty * price;
          subtotal.textContent = `$ ${total.toLocaleString()}`;
        });

      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  }

  detalleProducto();

  // Manejar el evento del botón "Agregar al Carrito"
  agregarProductoBtn.addEventListener("click", () => {
    const qty = parseInt(cantidad.value) || 0;
    if (qty <= 0) {
      alert("Por favor, ingresa una cantidad válida.");
      return;
    }

    if (!currentProduct) {
      alert("Error: datos del producto no disponibles. Intenta recargar la página.");
      return;
    }

    const priceNum = Number(currentProduct.precio) || 0;
    const subtotalNum = qty * priceNum;

    const item = {
      id_producto: id_producto,
      imagen: currentProduct.imagen || '',
      nombreProducto: currentProduct.nombre_producto || '',
      precio: priceNum,
      cantidad: qty,
      subtotal: subtotalNum
    };

    // Guardar en sessionStorage bajo la clave 'carrito' (array de items)
    try {
      const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
      carrito.push(item);
      sessionStorage.setItem('carrito', JSON.stringify(carrito));
      // También guardamos el último ítem por conveniencia
      sessionStorage.setItem('ultimoProducto', JSON.stringify(item));
    } catch (e) {
      console.error('Error guardando en sessionStorage', e);
    }

    // Mostrar alerta y redirigir al listado de categorías para seguir comprando
    alert(`Producto agregado al carrito. Cantidad: ${qty}`);
    window.location.href = 'categoriaProductos.html';
  });

});