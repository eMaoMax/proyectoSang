document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("cuerpoTabla");

  let inicioRegistros = 1;

  function obtenerUsuarios() {
    fetch(`http://sang.somee.com/api/pedido`)
      .then((response) => response.json())
      .then((data) => {
        tabla.innerHTML = "";
        data.forEach((user) => {          
          const fechaFormateada = user.fecha_ingreso ? user.fecha_ingreso.split('T')[0] : '';
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="text-center" >${user.id_pedido}</td>
            <td class="text-center" >${user.id_fkUsuario}</td>
            <td class="text-center columna-fecha" >${fechaFormateada}</td>
            <td class="text-center" >${user.estado_pedido}</td>
            <td class="text-center" >${user.sub_total}</td>
            <td class="text-center" >${user.iva}</td>
            <td class="text-center" >${user.total}</td>
            `;

          tabla.appendChild(row);
        });
        console.log(data);
      })
      .catch((error) =>
        console.error("Error al obtener datos de la API:", error)
      );
  }

  obtenerUsuarios();

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
  /* tabla.addEventListener("click", (event) => {
    const deleteTarget = event.target.closest('.icono-borrar');
    if (deleteTarget) {
      event.preventDefault();       
      const userId = deleteTarget.getAttribute('data-user-id');
      const confirmacion = confirm(
        "¿Estás seguro de que deseas eliminar este registro?"
      );

      if (confirmacion === true) {
        fetch(`http://sang.somee.com/api/producto/${userId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              if (response.status === 204) {
                 return; // Éxito sin contenido
              }
              throw new Error(`Error al eliminar el producto: Status ${response.status}`);
            }
            return response.text(); // o .json() si devuelve algo en 200/202
          })
          .then(() => {
            // Elimina la fila después de la confirmación de la API
            deleteTarget.closest("tr").remove();
          })
          .catch((error) => console.error("Error al eliminar producto:", error));
      }
    } else if (event.target.closest('.icono-editar')) {
        const editTarget = event.target.closest('.icono-editar');
        if (editTarget) {
            const userId = editTarget.getAttribute('data-user-id');
            // La redirección ya está en el HTML, pero este es un patrón más robusto
            window.location.href = `actualizarProducto.html?id=${userId}`;
        }
    } 
  }); */
});