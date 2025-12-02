document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("cuerpoTabla");

  let inicioRegistros = 1;

  function obtenerCategoria() {
    fetch(`http://sang.somee.com/api/categoria `)
      .then((response) => response.json())
      .then((data) => {
        tabla.innerHTML = "";
        data.forEach((user) => {
          
          const fechaFormateada = user.fecha_ingreso ? user.fecha_ingreso.split('T')[0] : '';

          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="text-center" >${user.id_categoria}</td>
            <td class="text-center" >${user.nombre_categoria}</td>
            <td class="text-center">
                <img src="${user.imagen}" class="producto-imagen-mini"/>
            </td>
            <td class="text-center columna-operacion-editar"> 
                <a href="actualizarCategoria.html?id=${user.id_categoria}">
                    <img src="../img/editar.png" alt="editar" class="icono-tabla icono-editar" 
                    data-user-id="${user.id_categoria}">
                </a>
            </td>
            
            <td class="text-center columna-operacion-borrar"> 
                <a href="#">
                    <img src="../img/eliminar.png" alt="borrar" class="icono-tabla icono-borrar" 
                    data-user-id="${user.id_categoria}">
                </a>
            </td>
          `;

          tabla.appendChild(row);
        });
        console.log(data);
      })
      .catch((error) =>
        console.error("Error al obtener datos de la API:", error)
      );
  }

  obtenerCategoria();

  //------------------------------------------paginacion--------------------------------------------------//
  document.getElementById("paginaAnterior").addEventListener("click", () => {
    if (inicioRegistros > 1) {
      inicioRegistros--;
      obtenerUsuarios(inicioRegistros);
    }
  });
  //-----------------------------------------------------------------------------------------------------//

  document.getElementById("paginaSiguiente").addEventListener("click", () => {
    inicioRegistros++;
    obtenerUsuarios(inicioRegistros);
  });

  //-------------------------------------------eliminar-----------------------------------------------------//
  tabla.addEventListener("click", (event) => {
    const deleteTarget = event.target.closest('.icono-borrar');
    if (deleteTarget) {
      event.preventDefault();       
      const userId = deleteTarget.getAttribute('data-user-id');
      const confirmacion = confirm(
        "¿Estás seguro de que deseas eliminar este registro?"
      );

      if (confirmacion === true) {
        fetch(`http://sang.somee.com/api/categoria/${userId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              if (response.status === 204) {
                 return; // Éxito sin contenido
              }
              throw new Error(`Error al eliminar la categoria: Status ${response.status}`);
            }
            return response.text(); // o .json() si devuelve algo en 200/202
          })
          .then(() => {
            // Elimina la fila después de la confirmación de la API
            deleteTarget.closest("tr").remove();
          })
          .catch((error) => console.error("Error al eliminar la categoria:", error));
      }
    } else if (event.target.closest('.icono-editar')) {
        const editTarget = event.target.closest('.icono-editar');
        if (editTarget) {
            const userId = editTarget.getAttribute('data-user-id');
            // La redirección ya está en el HTML, pero este es un patrón más robusto
            window.location.href = `actualizarCategoria.html?id=${userId}`;
        }
    } 
  });
});
  