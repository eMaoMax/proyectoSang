document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("cuerpoTabla");

  let inicioRegistros = 1;

  function obtenerUsuarios() {
    fetch(`http://sang.somee.com/api/detalle_pedido`)
      .then((response) => response.json())
      .then((data) => {
        tabla.innerHTML = "";
        data.forEach((user) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="text-center" >${user.id_detalle}</td>
            <td class="text-center" >${user.id_pedido}</td>
            <td class="text-center" >${user.id_producto}</td>
            <td class="text-center" >${user.cantidad}</td>
            <td class="text-center" >${user.valor_total}</td>
            <td class="text-center">
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
});