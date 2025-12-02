document.addEventListener("DOMContentLoaded", () => {
  const btnEditar = document.getElementById("editar"); 

  const urlParams = new URLSearchParams(window.location.search);
  const id_producto = urlParams.get("id"); 

  // Referenciar el campo ID en el formulario
  const idProductoInput = document.getElementById("id_producto");

  const optionCategoria = document.getElementById("categoria");

  function obtenerCategoria() {
    optionCategoria.innerHTML = '<option value="" disabled selected>Cargando categorías...</option>';
    fetch(`http://sang.somee.com/api/categoria `)
      .then((response) => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        optionCategoria.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
        data.forEach((categoria) => {
          const option = document.createElement("option");
          option.value = categoria.id_categoria;
          option.textContent = categoria.nombre_categoria;
          optionCategoria.appendChild(option);
        });
        console.log("Categorías obtenidas:", data);
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
        optionCategoria.innerHTML = '<option value="" disabled selected>Error al cargar categorías</option>';
      });
  }

  obtenerCategoria();
  
  // 1. Obtener todos los campos del formulario
  const id_fkCategoria = document.getElementById("categoria");
  const nombre_producto = document.getElementById("nombre_producto"); 
  const precio = document.getElementById("precio");
  const cantidad = document.getElementById("cantidad");
  const imagen = document.getElementById("imagen"); 
  const descripcion = document.getElementById("descripcion"); 
 
  // 2. Obtener datos actuales del usuario para rellenar el formulario
  fetch(`http://sang.somee.com/api/producto/${id_producto}`) 
    .then((response) => response.json())
    .then((data) => {
      // Mostrar el ID en el campo de solo lectura
      idProductoInput.value = id_producto;
      
      data.forEach((user) => {
        // Mapeo de campos basado en la estructura de getProducto.js y HTML
        id_fkCategoria.value = user.id_fkCategoria || '';
        nombre_producto.value = user.nombre_producto || '';
        precio.value = user.precio || '';
        cantidad.value = user.cantidad || ''; 
        imagen.value = user.imagen || '';
        descripcion.value = user.descripcion || '';
      });
    })
    .catch((error) =>
      console.error("Error al obtener datos de la API:", error)
    );

  // 3. Manejar la actualización de datos (evento click del botón)
  btnEditar.addEventListener("click", () => {

    // Crear el objeto de datos con los campos disponibles
    const data = {
      // El ID debe ser el mismo que se pasó por la URL
      "id_producto": id_producto,
      "id_fkCategoria": id_fkCategoria.value, 
      "nombre_producto": nombre_producto.value,
      "descripcion": descripcion.value,
      "precio": precio.value,
      "cantidad": cantidad.value,
      "imagen": imagen.value
    };

    fetch(`http://sang.somee.com/api/producto/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        
        if (response.ok) {
          alert("Producto actualizado correctamente.");
          window.location.href = "../view/listarProducto.html"; 
          
        } else {
          console.error("Error al enviar la solicitud:", response.status);
          alert(`Error al actualizar producto. Status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        alert("Error de conexión al intentar actualizar el producto.");
      });
  }); 
});