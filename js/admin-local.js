// Función para mostrar/ocultar secciones en admin local
function showLocalSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionId).style.display = 'block';
    
    // Actualizar el título
    document.getElementById('local-section-title').textContent = document.querySelector(`a[onclick="showLocalSection('${sectionId}')"]`).textContent.trim();
}

// Funciones para mostrar/ocultar formularios
function showAddProductForm() {
    document.getElementById('add-product-form').style.display = 'block';
}

function hideAddProductForm() {
    document.getElementById('add-product-form').style.display = 'none';
}


// Funciones para mostrar/ocultar formularios

        function showAddInsumoForm() {
            document.getElementById('add-insumo-form').style.display = 'block';
        }
        
        function hideAddInsumoForm() {
            document.getElementById('add-insumo-form').style.display = 'none';
        }
        
        function showAddProveedorForm() {
            document.getElementById('add-proveedor-form').style.display = 'block';
        }
        
        function hideAddProveedorForm() {
            document.getElementById('add-proveedor-form').style.display = 'none';
        }
        
        function showAddEmpleadoForm() {
            document.getElementById('add-empleado-form').style.display = 'block';
        }
        
        function hideAddEmpleadoForm() {
            document.getElementById('add-empleado-form').style.display = 'none';
        }
        
        function showNuevoPedidoForm() {
            document.getElementById('nuevo-pedido-form').style.display = 'block';
        }
        
        function hideNuevoPedidoForm() {
            document.getElementById('nuevo-pedido-form').style.display = 'none';
        }


function showAddResenaForm() {
    document.getElementById('add-resena-form').style.display = 'block';
}

function hideAddResenaForm() {
    document.getElementById('add-resena-form').style.display = 'none';
}


function changePedidoTab(tabId) {
            changeTab(tabId);
}
        
 function changeEditTab(tabId) {
  changeTab(tabId);
}



// Función para cambiar pestañas

function changeTab(tabId) {
    // Ocultar todos los contenidos de pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    // Desactivar todas las pestañas
    document.querySelectorAll('.tabs .tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar el contenido de la pestaña seleccionada
    document.getElementById(tabId).style.display = 'block';

    // Activar la pestaña seleccionada
    // event.target puede fallar si el evento viene de otro lado, mejor buscar el tab por id
    let tabs = document.querySelectorAll('.tabs .tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(tabId)) {
            tab.classList.add('active');
        }
    });
}

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar la sección del dashboard por defecto
    showLocalSection('dashboard-local');
});