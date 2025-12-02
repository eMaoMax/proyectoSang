document.addEventListener("DOMContentLoaded", () => {
  const imagenProducto = document.getElementById("imagenProductos");

  const urlParams = new URLSearchParams(window.location.search);
  const id_categoria = urlParams.get("id"); 

  console.log(id_categoria)

  // Verificar si se obtuvo un id_categoria
  if (!id_categoria) {
    console.error("No se encontró el id_categoria en la URL.");
    imagenProducto.innerHTML = 
        '<p class="text-danger">Selecciona una categoría para ver los productos.</p>';
    return; // Detiene la ejecución si no hay ID
  }

  // Se convierte el id_categoria a número para asegurar la comparación estricta.
  // Las URL params son strings, y la clave de la tabla (id_fkCategoria) puede ser número.
  // Usaremos parseInt() o Number() para asegurar que la comparación sea correcta.
  const categoriaIdNumerico = Number(id_categoria);      

  function traerProducto() {
    fetch(`http://sang.somee.com/api/producto`)
      .then((response) => response.json())
      .then((data) => {
        const productosFiltrados = data.filter(producto => 
             producto.id_fkCategoria == categoriaIdNumerico
        );

        console.log(productosFiltrados)

        imagenProducto.innerHTML = "";

        // Comprobar si la lista filtrada está vacía
        if (productosFiltrados.length === 0) {
            imagenProducto.innerHTML = 
                '<p class="text-info">No hay productos disponibles para esta categoría.</p>';
            return;
        }

        // Renderizado de los productos filtrados
        productosFiltrados.forEach((user) => {
            const img = document.createElement("div");
            img.innerHTML = `
                <div class="col">                        
                    <div class="card h-100">                    
                        <a href="detalleProducto.html?id=${user.id_producto}">
                            <img src="${user.imagen}" class="card-img-top" alt="Imagen de ${user.nombre_producto}">
                        </a>
                        <div class="card-body mx-auto">
                            <h5 class="card-title">${user.nombre_producto}</h5>
                        </div>                             
                    </div> 
                </div>                                
            `;
            imagenProducto.appendChild(img);
        });
        
        console.log("Productos filtrados:", productosFiltrados);
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  }

  traerProducto();
});  