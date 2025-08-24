// Función para mostrar/ocultar secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionId).style.display = 'block';
    
    // Actualizar el título
    document.getElementById('section-title').textContent = document.querySelector(`a[onclick="showSection('${sectionId}')"]`).textContent.trim();
}

// Funciones para mostrar/ocultar formularios
function showAddAdminForm() {
    document.getElementById('add-admin-form').style.display = 'block';
}

function hideAddAdminForm() {
    document.getElementById('add-admin-form').style.display = 'none';
}

function showAddLocalForm() {
    document.getElementById('add-local-form').style.display = 'block';
}

function hideAddLocalForm() {
    document.getElementById('add-local-form').style.display = 'none';
}

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar la sección del dashboard por defecto
    showSection('dashboard-global');
});