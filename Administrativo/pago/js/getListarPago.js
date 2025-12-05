document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("cuerpoTabla");

  let inicioRegistros = 1;

  function obtenerCategoria() {
    fetch(`http://sang.somee.com/api/pago `)
      .then((response) => response.json())
      .then((data) => {
        tabla.innerHTML = "";
        data.forEach((user) => {
          
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="text-center" >${user.id_pago}</td>
            <td class="text-center" >${user.id_kfUsuario}</td>
            <td class="text-center" >${user.id_kfPedido}</td>
            <td class="text-center" >${user.forma_pago}</td>
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

});