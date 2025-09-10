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

// --- INICIO FUNCIONALIDAD ENTRADAS Y SALIDAS DE INSUMOS ---
// Obtener datos de la tabla HTML y mantenerlos en memoria
let insumos = [
    {
        nombre: 'Carne de Res', cantidad: 45, unidad: 'kg', minimo: 25, maximo: 100, proveedor: 'Distribuidora Central', estado: 'Disponible', badge: 'success'
    },
    {
        nombre: 'Cebolla', cantidad: 3, unidad: 'kg', minimo: 2, maximo: 15, proveedor: 'Alimentos del Norte', estado: 'Bajo stock', badge: 'warning'
    },
    {
        nombre: 'Tortillas', cantidad: 3, unidad: 'lb', minimo: 2, maximo: 10, proveedor: 'Suministros Express', estado: 'Agotado', badge: 'danger'
    }
];

let insumoSeleccionado = null;
let tipoMovimiento = null;

function renderTablaInsumos() {
    const tbody = document.querySelector('#tabla-insumos tbody');
    tbody.innerHTML = '';
    insumos.forEach((insumo, idx) => {
        let estadoHtml = `<span class="badge badge-${insumo.badge}">${insumo.estado}</span>`;
        tbody.innerHTML += `
            <tr>
                <td>${insumo.nombre}</td>
                <td>${insumo.cantidad} ${insumo.unidad}</td>
                <td>${insumo.minimo} ${insumo.unidad}</td>
                <td>${insumo.maximo} ${insumo.unidad}</td>
                <td>${insumo.proveedor}</td>
                <td>${estadoHtml}</td>
                <td>
                    <button class='btn-edit btn-primary btn-sm'><i class='fas fa-edit'></i></button>
                    <button class='btn-edit btn-danger btn-sm'><i class='fas fa-trash'></i></button>
                    <button class='btn-entrada' onclick='mostrarMovimientoInsumo(${idx}, "entrada")'><i class='fas fa-arrow-down'></i> Entrada</button>
                    <button class='btn-salida' onclick='mostrarMovimientoInsumo(${idx}, "salida")'><i class='fas fa-arrow-up'></i> Salida</button>
                </td>
            </tr>
        `;
    });
}

function mostrarMovimientoInsumo(idx, movimiento) {
    insumoSeleccionado = idx;
    tipoMovimiento = movimiento;
    document.getElementById('movimiento-insumo-form').style.display = 'block';
    document.getElementById('movimiento-insumo-cantidad').value = '';
    document.getElementById('movimiento-insumo-titulo').textContent = (movimiento === 'entrada' ? 'Entrada' : 'Salida') + ' de Insumo';
    let insumo = insumos[idx];
    document.getElementById('movimiento-insumo-label').textContent = `Cantidad a ${(movimiento === 'entrada' ? 'sumar' : 'restar')} para "${insumo.nombre}" (${insumo.unidad})`;
    document.getElementById('btn-confirmar-movimiento').onclick = confirmarMovimientoInsumo;
}

function ocultarMovimientoInsumo() {
    document.getElementById('movimiento-insumo-form').style.display = 'none';
    insumoSeleccionado = null;
    tipoMovimiento = null;
}

function confirmarMovimientoInsumo() {
    const cantidad = parseFloat(document.getElementById('movimiento-insumo-cantidad').value);
    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Ingrese una cantidad válida.');
        return;
    }
    let insumo = insumos[insumoSeleccionado];
    if (tipoMovimiento === 'entrada') {
        insumo.cantidad += cantidad;
    } else if (tipoMovimiento === 'salida') {
        if (insumo.cantidad < cantidad) {
            alert('No hay suficiente cantidad para realizar la salida.');
            return;
        }
        insumo.cantidad -= cantidad;
    }
    // Actualizar estado visual según stock
    if (insumo.cantidad <= 0) {
        insumo.estado = 'Agotado';
        insumo.badge = 'danger';
    } else if (insumo.cantidad <= insumo.minimo) {
        insumo.estado = 'Bajo stock';
        insumo.badge = 'warning';
    } else {
        insumo.estado = 'Disponible';
        insumo.badge = 'success';
    }
    renderTablaInsumos();
    ocultarMovimientoInsumo();
}
// --- FIN FUNCIONALIDAD ENTRADAS Y SALIDAS DE INSUMOS ---
        
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
    // Inicializar tabla de insumos si existe
    if (document.getElementById('tabla-insumos')) {
        renderTablaInsumos();
    }
});