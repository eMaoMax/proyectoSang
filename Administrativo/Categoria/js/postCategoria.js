document.addEventListener("DOMContentLoaded", () => {

    const registrar = document.getElementById("registrar");

    registrar.addEventListener("click", (e) => {
        e.preventDefault(); 
        const nombre = document.getElementById("nombre").value;
        const imagen = document.getElementById("imagen").value;

        const data = {
            nombre_categoria: nombre,
            imagen: imagen
        }
        
        // Opcional: Validar que todos los campos requeridos estén llenos antes de enviar
        if (!nombre || !imagen) {
            console.error("Por favor, complete todos los campos requeridos.");
            // Aquí puedes agregar una alerta o mensaje al usuario en el HTML
            return;
        }

        fetch("http://sang.somee.com/api/categoria", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
          .then((response) => {
            // Verificar si la respuesta es exitosa (código de estado 200, 201, etc.)
            if (response.ok) {
              console.log("Categoria creada correctamente");

              // Redirigir al usuario
              window.location.href = "../view/listarCategoria.html";

            } else {
              // Si la respuesta no es exitosa, puedes intentar leer el mensaje de error del servidor
              return response.json().then(err => {
                console.error("Error al registrar categoria:", response.status, err);
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