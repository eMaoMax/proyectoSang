const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('contrasena');
const toggleIcon = document.getElementById('toggleIcon');

togglePassword.addEventListener('click', function (e) {
    // Cambia el tipo de input entre 'password' y 'text'
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Cambia el icono: 'bi-eye-slash' (cerrado) por 'bi-eye' (abierto)
    if (type === 'text') {
        toggleIcon.classList.remove('bi-eye-slash');
        toggleIcon.classList.add('bi-eye');
    } else {
        toggleIcon.classList.remove('bi-eye');
        toggleIcon.classList.add('bi-eye-slash');
    }
});