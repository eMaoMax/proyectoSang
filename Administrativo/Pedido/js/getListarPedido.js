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
            <td class="text-center" >${user.fecha_pedido}</td>
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
});