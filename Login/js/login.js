document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login"); // O el ID real de tu botón
    if (loginButton) {
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            const email = document.getElementById("correo").value;
            const password = document.getElementById("contrasena").value;

            const data = {
                email: email,
                password: password
            }
            if (!email || !password ) {
                console.error("Por favor, complete todos los campos.");
                alert("Por favor, ingrese su correo electrónico y contraseña.");
                return;
            }
            fetch("http://sang.somee.com/api/usuario/login", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error de red o del servidor: ' + response.statusText);
                }
                return response.json();
            })
            .then(loginResult => {
                if (loginResult.id_usuario !== 0 && loginResult.rol !== null) {
                    // --- LOGIN EXITOSO ---
                    console.log("Login Exitoso. Rol:", loginResult.rol, "ID:", loginResult.id_usuario);
                    alert("¡Bienvenido a SAN GABRIEL CAFÉ KARAOKE!");
                    sessionStorage.setItem('userId', loginResult.id_usuario);
                    sessionStorage.setItem('userRole', loginResult.rol);
                    if (loginResult.rol === "administrador") {
                        window.location.href = "../../Administrativo/Inicio/sangAdmi.html";
                    } else if (loginResult.rol === "mesero" || loginResult.rol === "cliente") {
                        window.location.href = "../../EntornoWeb/index.html";
                    } else {
                        window.location.href = "../../EntornoWeb/index.html";
                    }

                } else {
                    console.error("Autenticación Fallida.");
                    alert("Credenciales inválidas. Verifique su correo y contraseña.");
                }
            })
            .catch(error => {
                console.error("Hubo un problema con la operación fetch:", error);
                alert("Error de conexión. No se pudo contactar al servidor.");
            });
        });
    }
});

