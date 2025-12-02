document.addEventListener("DOMContentLoaded", () => {
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

    const registrar = document.getElementById("registrar");

    registrar.addEventListener("click", (e) => {
        e.preventDefault(); 
        const categoria = document.getElementById("categoria").value;
        const producto = document.getElementById("nombre_producto").value;
        const precio = document.getElementById("precio").value;
        const cantidad = document.getElementById("cantidad").value;
        const imagen = document.getElementById("imagen").value;
        const descripcion = document.getElementById("descripcion").value;

        const data = {
            id_fkCategoria: categoria,
            nombre_producto: producto,
            precio: precio,
            cantidad: cantidad,
            imagen: imagen,
            descripcion: descripcion
        }
        
        // Opcional: Validar que todos los campos requeridos estén llenos antes de enviar
        if (!categoria || !producto || !precio || !cantidad || !imagen || !descripcion) {
            console.error("Por favor, complete todos los campos requeridos.");
            alert("Por favor, complete todos los campos requeridos.");
            return;
        }

        fetch("http://sang.somee.com/api/producto", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
          .then((response) => {
            // Verificar si la respuesta es exitosa (código de estado 200, 201, etc.)
            if (response.ok) {
              console.log("Producto registrado correctamente");

              // Redirigir al usuario
              window.location.href = "../view/listarProducto.html";

            } else {
              // Si la respuesta no es exitosa, puedes intentar leer el mensaje de error del servidor
              return response.json().then(err => {
                console.error("Error al registrar producto:", response.status, err);
                alert(`Error al registrar: ${err.message || response.statusText}`);
              });
            }
          })
          .catch((error) => {
            console.error("Error de conexión o solicitud:", error);
            alert("Error de conexión. Intente más tarde.");
          });
      });
});