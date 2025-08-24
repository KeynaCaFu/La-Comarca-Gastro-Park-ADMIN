// Función para el login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulación de login
            const cedula = document.getElementById('cedula').value;
            const password = document.getElementById('password').value;
            
            // Validación simple (en un sistema real esto sería una llamada a un servidor)
            if (cedula === 'admin' && password === 'admin') {
                // Redirigir a admin global
                window.location.href = 'admin-global.html';
            } else if (cedula === 'local' && password === 'local') {
                // Redirigir a admin local
                window.location.href = 'admin-local.html';
            } else {
                alert('Cédula o contraseña incorrectos');
            }
        });
    }
});

// Función para resetear el formulario de login
function resetForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.reset();
    }
}

// Función para cerrar sesión
function logout() {
    // Redirigir a la página de login
    window.location.href = 'index.html';
}

// Funciones para el modal de recuperación de contraseña
function openForgotPasswordModal(e) {
    e.preventDefault();
    document.getElementById('forgotPasswordModal').style.display = 'flex';
}

function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
}

function sendRecoveryInstructions() {
    const recoveryInput = document.getElementById('recoveryInput').value;
    if (recoveryInput) {
        alert('Instrucciones de recuperación enviadas a ' + recoveryInput);
        closeForgotPasswordModal();
    } else {
        alert('Por favor, ingresa tu cédula o correo electrónico');
    }
}