document.addEventListener("DOMContentLoaded", () => {
  const imagenCategoria = document.getElementById("imagenCategoria");

  function traerCategoria() {
    fetch(`http://sang.somee.com/api/categoria `)
      .then((response) => response.json())
      .then((data) => {
        imagenCategoria.innerHTML = "";
        data.forEach((user) => {
          const img = document.createElement("card");
          img.innerHTML = `
            <div class="col">                        
                <div class="card h-100">                    
                    <a href="productos.html?id=${user.id_categoria}">
                        <img src="${user.imagen}" class="card-img-top" alt="...">
                    </a>
                    <div class="card-body mx-auto">
                        <h5 class="card-title">${user.nombre_categoria}</h5>
                    </div>                             
                </div> 
            </div>                                
          `;
          imagenCategoria.appendChild(img);
        });
        console.log(data);
      })
      .catch((error) =>
        console.error("Error al obtener datos de la API:", error)
      );
  }

  traerCategoria();
});  