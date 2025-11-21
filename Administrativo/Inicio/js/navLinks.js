document.addEventListener('DOMContentLoaded', function() {
    // 1. Selecciona todos los enlaces del sidebar
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    // 2. Selecciona todos los contenedores de contenido
    const contentSections = document.querySelectorAll('.main-content > div');

    /**
     * Función que carga la estructura de la tabla de usuarios, llama a la API y maneja la paginación/edición.
     */
    function cargarUsuarios() {
        const contentDiv = document.getElementById("contenidoUsuario"); 
        
        // Variables locales para la paginación y la tabla
        let inicioRegistros = 1;
        
        // 1. INYECTAR la estructura de la tabla si es la primera vez que se carga
        if (!contentDiv.querySelector('#tablaUsuarios')) {
            contentDiv.innerHTML = `
                <h2 class="mb-3">Datos de Usuarios</h2>

                <a href="registrarUsuario.html" class="btn btn-primary" >Registrar_usuario</a> <br> <br>
                                
                <div class="table-responsive border">
                    <table id="tablaUsuarios" class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th class="text-center">ID</th>
                                <th class="text-center">Nombre</th>
                                <th class="text-center">Apellido</th>
                                <th class="text-center">Teléfono</th>
                                <th class="text-center">Email</th>
                                <th class="text-center">Calle</th>
                                <th class="text-center">Carrera</th>
                                <th class="text-center">Número</th>
                                <th class="text-center">Fecha Ingreso</th>
                                <th class="text-center">Rol</th>
                                <th class="text-center">Estado</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="cuerpoTabla">
                        </tbody>
                    </table>
                </div>
                <br>
                <div class="text-center" >
                    <button class="btn btn-primary" id="paginaAnterior">Anterior</button>
                    <button class="btn btn-primary ms-5 " id="paginaSiguiente">Siguiente</button>
                </div>
            `;
        }
        
        // 2. Obtener el cuerpo de la tabla después de inyectar el HTML
        const tabla = document.getElementById("cuerpoTabla");
        if (!tabla) return; 

        // ------------------ LÓGICA DE FETCH Y RENDERIZADO ------------------
        function obtenerUsuarios() {
            fetch(`http://sang.somee.com/api/usuario`) 
                .then((response) => response.json())
                .then((data) => {
                    tabla.innerHTML = ""; 
                    data.forEach((user) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td class="text-center">${user.id_usuario}</td>
                            <td class="text-center">${user.nombre}</td>
                            <td class="text-center">${user.apellido}</td>
                            <td class="text-center">${user.telefono}</td>
                            <td class="text-center">${user.email}</td>
                            <td class="text-center">${user.calle}</td>
                            <td class="text-center">${user.carrera}</td>
                            <td class="text-center">${user.numero}</td>
                            <td class="text-center">${user.fecha_ingreso}</td>
                            <td class="text-center">${user.rol}</td>
                            <td class="text-center">${user.estado}</td>
                            <td> <button value=${user.id_usuario} class="btn btn-warning btn-editar" >editar</button> </td>
                            <td> <button value=${user.id_usuario} class="btn btn-danger btn-borrar" >eliminar</button> </td>
                        `;
                        tabla.appendChild(row);
                    });
                })
                .catch((error) =>
                    console.error("Error al obtener datos de la API:", error)
                );
        }

        obtenerUsuarios(); 

        // ------------------ LÓGICA DE EVENTOS (Paginación y Botones) ------------------
        
        // Listener para paginación anterior
        document.getElementById("paginaAnterior").addEventListener("click", () => {
            if (inicioRegistros > 1) {
                inicioRegistros--;
                obtenerUsuarios(inicioRegistros);
            }
        });

        // Listener para paginación siguiente
        document.getElementById("paginaSiguiente").addEventListener("click", () => {
            inicioRegistros++;
            obtenerUsuarios(inicioRegistros);
        });
        
        // Listener para los botones de editar/eliminar
        tabla.addEventListener("click", (e) => {
            if (e.target && e.target.classList.contains('btn-editar')) {
                const userId = e.target.value; 
                window.location.href = `actualizarUsuario.html?id=${userId}`;
            }
        });
    }

    // -------------------------------------------------------------
    // LÓGICA PRINCIPAL DE NAVEGACIÓN DEL SIDEBAR
    // -------------------------------------------------------------
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 
            const targetId = this.getAttribute('data-target');

            // --- 1. LÓGICA DE ACTIVACIÓN DE CONTENIDO ---

            // a. Remover 'active' de todos los enlaces y ocultar contenido
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(c => c.classList.add('d-none'));

            // b. Activar el enlace y mostrar el div de contenido
            this.classList.add('active');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.classList.remove('d-none');
            }

            // --- 2. LLAMADA A FUNCIONES ESPECÍFICAS DE CARGA ---

            if (targetId === 'contenidoUsuario') {
                // Se llama a cargarUsuarios() al hacer clic (además de la carga inicial)
                cargarUsuarios();
            } else {
                // Aquí irían otras funciones de carga
            }
        });
    });

    // -------------------------------------------------------------
    // LLAMADA DE INICIALIZACIÓN (CARGA AUTOMÁTICA)
    // -------------------------------------------------------------
    cargarUsuarios();
});