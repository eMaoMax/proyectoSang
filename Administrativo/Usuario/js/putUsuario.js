document.addEventListener("DOMContentLoaded", () => {
  const btnEditar = document.getElementById("editar"); 

  const urlParams = new URLSearchParams(window.location.search);
  const id_usuario = urlParams.get("id"); 

  // Referenciar el campo ID en el formulario
  const idUsuarioInput = document.getElementById("idUsuario");
  
  // 1. Obtener todos los campos del formulario
  const nombre = document.getElementById("nombre");
  const apellido = document.getElementById("apellido"); 
  const telefono = document.getElementById("telefono");
  const correo = document.getElementById("correo");
  const calle = document.getElementById("calle"); 
  const carrera = document.getElementById("carrera"); 
  const numero = document.getElementById("numero"); 
  const rol = document.getElementById("rol"); 
  const estado = document.getElementById("estado"); 
  const fecha_ingreso = document.getElementById("fecha_ingreso"); 

 
  // 2. Obtener datos actuales del usuario para rellenar el formulario
  fetch(`http://sang.somee.com/api/usuario/${id_usuario}`) 
    .then((response) => response.json())
    .then((data) => {
      // Mostrar el ID en el campo de solo lectura
      idUsuarioInput.value = id_usuario;
      
      data.forEach((user) => {
        // Mapeo de campos basado en la estructura de getUsuario.js y HTML
        nombre.value = user.nombre || '';
        apellido.value = user.apellido || '';
        telefono.value = user.telefono || '';
        correo.value = user.email || ''; // El backend usa 'email', el frontend usa 'correo'
        calle.value = user.calle || '';
        carrera.value = user.carrera || '';
        numero.value = user.numero || '';
        
        // Seleccionar la opción correcta en los selects
        rol.value = user.rol || '';
        estado.value = user.estado || '';
        
        if (user.fecha_ingreso) {
            fecha_ingreso.value = user.fecha_ingreso.substring(0, 10);
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
      "id_usuario": id_usuario, 
      "nombre": nombre.value,
      "apellido": apellido.value,
      "telefono": telefono.value,
      "email": correo.value,
      "calle": calle.value,
      "carrera": carrera.value,
      "numero": numero.value,
      "fecha_ingreso": fecha_ingreso.value,
      "rol": rol.value,
      "estado": estado.value
    };

    fetch(`http://sang.somee.com/api/usuario/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        
        if (response.ok) {
          alert("Usuario actualizado correctamente.");
          window.location.href = "../view/listarUsuario.html"; 
          
        } else {
          console.error("Error al enviar la solicitud:", response.status);
          alert(`Error al actualizar usuario. Status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        alert("Error de conexión al intentar actualizar el usuario.");
      });
  }); 
});