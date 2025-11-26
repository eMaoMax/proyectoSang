document.addEventListener("DOMContentLoaded", () => {
  const btnEditar = document.getElementById("editar"); 

  const urlParams = new URLSearchParams(window.location.search);
  const id_categoria = urlParams.get("id"); 

  // Referenciar el campo ID en el formulario
  const idcategoriaInput = document.getElementById("idcategoria");
  
  // 1. Obtener todos los campos del formulario
  const nombre_categoria = document.getElementById("nombre_categoria");
  const imagen = document.getElementById("imagen"); 
  const fecha_ingreso = document.getElementById("fecha_ingreso"); 

 
  // 2. Obtener datos actuales del usuario para rellenar el formulario
  fetch(`http://sang.somee.com/api/categoria/${id_categoria}`) 
    .then((response) => response.json())
    .then((data) => {
      // Mostrar el ID en el campo de solo lectura
      idcategoriaInput.value = id_categoria;
      
      data.forEach((categoria) => {
        // Mapeo de campos basado en la estructura de getUsuario.js y HTML
        nombre_categoria.value = categoria.nombre_categoria || '';
        imagen.value = categoria.imagen || '';

        if (categoria.fecha_ingreso) {
            fecha_ingreso.value = categoria.fecha_ingreso.substring(0, 10);
        } else {
            fecha_ingreso.value = '';
        }
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
      "id_categoria": id_categoria, 
      "nombre_categoria": nombre_categoria.value,
      "imagen": imagen.value,
      "fecha_ingreso": fecha_ingreso.value,
    };

    fetch(`http://sang.somee.com/api/categoria/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        
        if (response.ok) {
          alert("categoria actualizado correctamente.");
          window.location.href = "../view/listarCategoria.html"; 
          
        } else {
          console.error("Error al enviar la solicitud:", response.status);
          alert(`Error al actualizar categoria. Status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        alert("Error de conexión al intentar actualizar el categoria.");
      });
  }); 
});