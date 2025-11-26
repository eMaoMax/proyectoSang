document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("cuerpoTabla");

  let inicioRegistros = 1;

  function obtenerCategoria() {
    fetch(`http://sang.somee.com/api/categoria `)
      .then((response) => response.json())
      .then((data) => {
        tabla.innerHTML = "";
        data.forEach((categoria) => {
          
          const fechaFormateada = categoria.fecha_ingreso ? categoria.fecha_ingreso.split('T')[0] : '';

          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="text-center" >${categoria.id_categoria}</td>
            <td class="text-center" >${categoria.nombre_categoria}</td>
            <td class="text-center" >${categoria.imagen}</td>
            <td class="text-center columna-fecha" >${fechaFormateada}</td>

            <td class="text-center columna-operacion-editar"> 
                <a href="actualizarUsuario.html?id=${categoria.id_categoria}">
                    <img src="../imgUsuario/editar.png" alt="editar" class="icono-tabla icono-editar" 
                    data-categoria-id="${categoria.id_categoria}">
                </a>
            </td>
            
            <td class="text-center columna-operacion-borrar"> 
                <a href="#">
                    <img src="../imgUsuario/eliminar.png" alt="borrar" class="icono-tabla icono-borrar" 
                    data-categoria-id="${categoria.id_categoria}">
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
  tabla.addEventListener("click", (event) => {
    const deleteTarget = event.target.closest('.icono-borrar');
    if (deleteTarget) {
      event.preventDefault();       
      const categoriaId = deleteTarget.getAttribute('data-categoria-id');
      const confirmacion = confirm(
        "¿Estás seguro de que deseas eliminar este registro?"
      );

      if (confirmacion === true) {
        fetch(`http://sang.somee.com/api/categoria/${categoriaId}`, {
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
          .catch((error) => console.error("Error al eliminar categoria:", error));
      }
    } else if (event.target.closest('.icono-editar')) {
        const editTarget = event.target.closest('.icono-editar');
        if (editTarget) {
            const userId = editTarget.getAttribute('data-user-id');
            // La redirección ya está en el HTML, pero este es un patrón más robusto
            window.location.href = `actualizarCategoria.html?id=${categoriaId}`;
        }
    } 
  });
});
  