document.addEventListener("DOMContentLoaded", () => {

    const registrar = document.getElementById("registrar");

    registrar.addEventListener("click", (e) => {
        e.preventDefault(); 
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const telefono = document.getElementById("telefono").value;
        const email = document.getElementById("correo").value;
        const password = document.getElementById("contrasena").value;
        const calle = document.getElementById("calle").value;
        const carrera = document.getElementById("carrera").value;
        const numero = document.getElementById("numero").value;
        const rol = document.getElementById("rol").value; 
        let estado = "Activo";

        const data = {
            nombre: nombre,
            apellido: apellido,
            telefono: telefono,
            email: email,
            password: password,
            calle: calle,
            carrera: carrera,
            numero: numero,
            rol: rol,
            estado: estado 
        }
        
        // Opcional: Validar que todos los campos requeridos estén llenos antes de enviar
        if (!nombre || !apellido || !telefono || !email || !password || !calle || !carrera || !numero || !rol) {
            console.error("Por favor, complete todos los campos requeridos.");
            // Aquí puedes agregar una alerta o mensaje al usuario en el HTML
            return;
        }

        fetch("http://sang.somee.com/api/usuario", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
          .then((response) => {
            // Verificar si la respuesta es exitosa (código de estado 200, 201, etc.)
            if (response.ok) {
              console.log("Usuario registrado correctamente");

              // Redirigir al usuario
              window.location.href = "../view/listarUsuario.html";

            } else {
              // Si la respuesta no es exitosa, puedes intentar leer el mensaje de error del servidor
              return response.json().then(err => {
                console.error("Error al registrar usuario:", response.status, err);
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