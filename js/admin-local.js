// Función para mostrar/ocultar secciones en admin local
function showLocalSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar la sección seleccionada
    document.getElementById(sectionId).style.display = 'block';

    // Actualizar el título
    var link = document.querySelector(`.sidebar-menu a[onclick="showLocalSection('${sectionId}')"]`);
    if (link) {
        document.getElementById('local-section-title').textContent = link.textContent.trim();
    }

    // Quitar 'active' de todos los enlaces
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    // Agregar 'active' al enlace actual
    if (link) link.classList.add('active');
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
        nombre: 'Carne de Res', 
        stockActual: 45, 
        stockMinimo: 25, 
        fechaVencimiento: '2025-12-31', 
        unidadMedida: 'kg', 
        cantidad: 100, 
        precio: 350.00, 
        estado: 'Disponible', 
        badge: 'success'
    },
    {
        nombre: 'Cebolla', 
        stockActual: 3, 
        stockMinimo: 15, 
        fechaVencimiento: '2025-10-15', 
        unidadMedida: 'kg', 
        cantidad: 50, 
        precio: 25.00, 
        estado: 'Bajo stock', 
        badge: 'warning'
    },
    {
        nombre: 'Tortillas', 
        stockActual: 3, 
        stockMinimo: 10, 
        fechaVencimiento: '2025-09-30', 
        unidadMedida: 'lb', 
        cantidad: 20, 
        precio: 45.00, 
        estado: 'Agotado', 
        badge: 'danger'
    }
];

let insumoSeleccionado = null;
let tipoMovimiento = null;

function renderTablaInsumos() {
    const tbody = document.querySelector('#tabla-insumos-body');
    tbody.innerHTML = '';
    insumos.forEach((insumo, idx) => {
        let estadoHtml = `<span class="badge badge-${insumo.badge}">${insumo.estado}</span>`;
        tbody.innerHTML += `
            <tr>
                <td>${insumo.nombre}</td>
                <td>${insumo.stockActual} ${insumo.unidadMedida}</td>
                <td>${insumo.stockMinimo} ${insumo.unidadMedida}</td>
                <td>${insumo.fechaVencimiento}</td>
                <td>${insumo.unidadMedida}</td>
                <td>${insumo.cantidad}</td>
                <td>$${insumo.precio.toFixed(2)}</td>
                <td>${estadoHtml}</td>
                <td>
                    <button class='btn-edit btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#insumoModal' onclick='cargarInsumoParaEditar(${idx})'><i class='fas fa-edit'></i></button>
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
    // Limpiar campo y alerta
    document.getElementById('movimiento-insumo-cantidad').value = '';
    document.getElementById('movimiento-alert').textContent = '';
    // Cambiar título y label
    let insumo = insumos[idx];
    document.getElementById('movimientoInsumoModalLabel').textContent = (movimiento === 'entrada' ? 'Entrada' : 'Salida') + ' de Insumo';
    document.getElementById('movimiento-insumo-label').textContent = `Cantidad a ${(movimiento === 'entrada' ? 'sumar' : 'restar')} para "${insumo.nombre}" (${insumo.unidadMedida})`;
    // Asignar handler
    document.getElementById('btn-confirmar-movimiento').onclick = confirmarMovimientoInsumo;
    // Mostrar modal Bootstrap
    const movimientoModal = new bootstrap.Modal(document.getElementById('movimientoInsumoModal'));
    movimientoModal.show();
}

function ocultarMovimientoInsumo() {
    // Cerrar el modal de movimiento si está abierto
    const modalEl = document.getElementById('movimientoInsumoModal');
    if (modalEl) {
        const movimientoModal = bootstrap.Modal.getInstance(modalEl);
        if (movimientoModal) movimientoModal.hide();
    }
    insumoSeleccionado = null;
    tipoMovimiento = null;
}

function confirmarMovimientoInsumo() {
    const cantidad = parseFloat(document.getElementById('movimiento-insumo-cantidad').value);
    const alertDiv = document.getElementById('movimiento-alert');
    alertDiv.textContent = '';
    if (isNaN(cantidad) || cantidad <= 0) {
        alertDiv.textContent = 'Ingrese una cantidad válida.';
        alertDiv.className = 'movimiento-alert alert-danger';
        return;
    }
    let insumo = insumos[insumoSeleccionado];
    if (tipoMovimiento === 'entrada') {
        insumo.stockActual += cantidad;
    } else if (tipoMovimiento === 'salida') {
        if (insumo.stockActual < cantidad) {
            alertDiv.textContent = 'No hay suficiente stock para realizar la salida.';
            alertDiv.className = 'movimiento-alert alert-danger';
            return;
        }
        insumo.stockActual -= cantidad;
    }
    // Actualizar estado visual según stock
    if (insumo.stockActual <= 0) {
        insumo.estado = 'Agotado';
        insumo.badge = 'danger';
    } else if (insumo.stockActual <= insumo.stockMinimo) {
        insumo.estado = 'Bajo stock';
        insumo.badge = 'warning';
    } else {
        insumo.estado = 'Disponible';
        insumo.badge = 'success';
    }
    actualizarInsumosOriginales();
    renderTablaInsumos();
    ocultarMovimientoInsumo();
}
// --- FIN FUNCIONALIDAD ENTRADAS Y SALIDAS DE INSUMOS ---

// --- INICIO FUNCIONALIDAD FILTRADO DE INSUMOS ---
// Array para mantener los insumos originales sin filtrar
let insumosOriginales = [...insumos];

// Función para filtrar insumos
function filtrarInsumos() {
    const busqueda = document.getElementById('buscar-insumo').value.toLowerCase();
    const filtroFecha = document.getElementById('filtro-fecha-vencimiento').value;
    const filtroEstado = document.getElementById('filtro-estado').value;
    
    let insumosFiltrados = [...insumosOriginales];
    
    // Filtrar por nombre
    if (busqueda.trim() !== '') {
        insumosFiltrados = insumosFiltrados.filter(insumo => 
            insumo.nombre.toLowerCase().includes(busqueda)
        );
    }
    
    // Filtrar por fecha de vencimiento
    if (filtroFecha !== '') {
        const hoy = new Date();
        const treintaDias = new Date();
        treintaDias.setDate(hoy.getDate() + 30);
        
        insumosFiltrados = insumosFiltrados.filter(insumo => {
            const fechaVenc = new Date(insumo.fechaVencimiento);
            
            switch(filtroFecha) {
                case 'vencido':
                    return fechaVenc < hoy;
                case 'proximo-vencer':
                    return fechaVenc >= hoy && fechaVenc <= treintaDias;
                case 'vigente':
                    return fechaVenc > treintaDias;
                default:
                    return true;
            }
        });
    }
    
    // Filtrar por estado
    if (filtroEstado !== '') {
        insumosFiltrados = insumosFiltrados.filter(insumo => 
            insumo.estado === filtroEstado
        );
    }
    
    // Actualizar la variable global insumos para la renderización
    insumos = insumosFiltrados;
    renderTablaInsumos();
    
    // Mostrar mensaje si no hay resultados
    const tbody = document.querySelector('#tabla-insumos-body');
    if (insumosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    No se encontraron insumos que coincidan con los filtros aplicados
                </td>
            </tr>
        `;
    }
}

// Función para limpiar todos los filtros
function limpiarFiltros() {
    document.getElementById('buscar-insumo').value = '';
    document.getElementById('filtro-fecha-vencimiento').value = '';
    document.getElementById('filtro-estado').value = '';
    
    // Restaurar todos los insumos
    insumos = [...insumosOriginales];
    renderTablaInsumos();
}



// Función para actualizar los insumos originales cuando se agrega/edita/elimina
function actualizarInsumosOriginales() {
    insumosOriginales = [...insumos];
}
// --- FIN FUNCIONALIDAD FILTRADO DE INSUMOS ---



// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar la sección de insumos por defecto
    showLocalSection('gestion-insumos');
    // Inicializar tabla de insumos si existe
    if (document.getElementById('tabla-insumos')) {
        actualizarInsumosOriginales();
        renderTablaInsumos();
    }
});


// ========== VALIDAR STOCK INSUMOS ==========
function validarStock() {
    const cantidad = parseFloat(document.getElementById('insumo-cantidad').value) || 0;
    const minimo = parseFloat(document.getElementById('insumo-minimo').value) || 0;
    const maximo = parseFloat(document.getElementById('insumo-maximo').value) || 0;
    const unidad = document.getElementById('insumo-unidad').value;

    if (maximo > 0 && minimo > 0 && maximo <= minimo) {
        document.getElementById('maximo-alert').innerHTML = '<span class="stock-low">El stock máximo debe ser mayor al mínimo</span>';
    } else {
        document.getElementById('maximo-alert').innerHTML = '';
    }

    const statusElement = document.getElementById('stock-status');
    if (minimo > 0 && maximo > 0) {
        if (cantidad <= 0) {
            statusElement.innerHTML = '<span class="stock-low">¡STOCK AGOTADO! Es necesario reponer urgentemente</span>';
        } else if (cantidad <= minimo) {
            statusElement.innerHTML = `<span class="stock-low">¡STOCK BAJO! Quedan ${cantidad} ${unidad}. Se recomienda reponer</span>`;
        } else if (cantidad >= maximo) {
            statusElement.innerHTML = `<span class="stock-ok">Stock completo (${cantidad} ${unidad}). No es necesario reponer</span>`;
        } else {
            statusElement.innerHTML = `<span class="stock-ok">Stock adecuado (${cantidad} ${unidad})</span>`;
        }
    }
}
window.validarStock = validarStock;

document.addEventListener('DOMContentLoaded', function() {
    const insumoCantidad = document.getElementById('insumo-cantidad');
    const insumoMinimo = document.getElementById('insumo-minimo');
    const insumoMaximo = document.getElementById('insumo-maximo');
    const insumoUnidad = document.getElementById('insumo-unidad');
    if (insumoCantidad && insumoMinimo && insumoMaximo && insumoUnidad) {
        insumoCantidad.addEventListener('input', validarStock);
        insumoMinimo.addEventListener('input', validarStock);
        insumoMaximo.addEventListener('input', validarStock);
        insumoUnidad.addEventListener('change', validarStock);
    }

    const insumoModal = document.getElementById('insumoModal');
    if (insumoModal) {
        insumoModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('insumoForm').reset();
            document.getElementById('minimo-alert').innerHTML = '';
            document.getElementById('maximo-alert').innerHTML = '';
            document.getElementById('stock-status').innerHTML = 'Complete los campos de stock para ver el estado del inventario';
        });
    }

    const saveInsumo = document.getElementById('saveInsumo');
    if (saveInsumo) {
        saveInsumo.addEventListener('click', function() {
            const minimo = parseFloat(document.getElementById('insumo-minimo').value);
            const maximo = parseFloat(document.getElementById('insumo-maximo').value);

            if (maximo <= minimo) {
                alert('El stock máximo debe ser mayor al stock mínimo');
                return;
            }

            alert('Insumo guardado correctamente');
            const modal = bootstrap.Modal.getInstance(document.getElementById('insumoModal'));
            modal.hide();
        });
    }
});







// Variable para controlar el modo (agregar/editar) de insumos
let modoEdicionInsumo = false;

// Función para cargar datos del insumo en el modal de edición
function cargarInsumoParaEditar(index) {
    modoEdicionInsumo = true;
    
    // Obtener el insumo del array
    const insumo = insumos[index];
    
    // Guardar el índice para referencia posterior
    document.getElementById('insumo-id').value = index;
    
    // Llenar el formulario con los datos del insumo
    document.getElementById('insumo-nombre').value = insumo.nombre;
    document.getElementById('insumo-stock-actual').value = insumo.stockActual;
    document.getElementById('insumo-stock-minimo').value = insumo.stockMinimo;
    document.getElementById('insumo-fecha-vencimiento').value = insumo.fechaVencimiento;
    document.getElementById('insumo-unidad-medida').value = insumo.unidadMedida;
    document.getElementById('insumo-cantidad').value = insumo.cantidad;
    document.getElementById('insumo-precio').value = insumo.precio;
    document.getElementById('insumo-estado').value = insumo.estado;
    
    // Cambiar el título del modal
    document.getElementById('insumoModalLabel').textContent = 'Editar Insumo';
    
    // Mostrar el botón de actualizar y ocultar el de guardar
    document.getElementById('saveInsumo').style.display = 'none';
    document.getElementById('updateInsumo').style.display = 'block';
    
    // Actualizar el estado del stock
    validarStock();
}

// Función para resetear el modal a modo agregar
function resetearModalInsumo() {
    modoEdicionInsumo = false;
    document.getElementById('insumoForm').reset();
    document.getElementById('insumo-id').value = '';
    document.getElementById('insumoModalLabel').textContent = 'Agregar Nuevo Insumo';
    document.getElementById('saveInsumo').style.display = 'block';
    document.getElementById('updateInsumo').style.display = 'none';
    document.getElementById('minimo-alert').innerHTML = '';
    document.getElementById('maximo-alert').innerHTML = '';
    document.getElementById('stock-status').innerHTML = 'Complete los campos de stock para ver el estado del inventario';
}

// Función para guardar insumo (nuevo)
function guardarInsumo() {
    // Validar formulario
    const nombre = document.getElementById('insumo-nombre').value;
    const stockActual = parseFloat(document.getElementById('insumo-stock-actual').value);
    const stockMinimo = parseFloat(document.getElementById('insumo-stock-minimo').value);
    const fechaVencimiento = document.getElementById('insumo-fecha-vencimiento').value;
    const unidadMedida = document.getElementById('insumo-unidad-medida').value;
    const cantidad = parseFloat(document.getElementById('insumo-cantidad').value);
    const precio = parseFloat(document.getElementById('insumo-precio').value);
    const estado = document.getElementById('insumo-estado').value;
    
    if (!nombre || isNaN(stockActual) || isNaN(stockMinimo) || !fechaVencimiento || !unidadMedida || isNaN(cantidad) || isNaN(precio) || !estado) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    if (stockActual < 0 || stockMinimo < 0 || cantidad < 0 || precio < 0) {
        alert('Los valores numéricos no pueden ser negativos');
        return;
    }
    
    // Determinar el badge según el estado
    let badge;
    switch(estado) {
        case 'Disponible':
            badge = 'success';
            break;
        case 'Bajo stock':
            badge = 'warning';
            break;
        case 'Agotado':
        case 'Vencido':
            badge = 'danger';
            break;
        default:
            badge = 'secondary';
    }
    
    // Crear nuevo insumo
    const nuevoInsumo = {
        nombre,
        stockActual,
        stockMinimo,
        fechaVencimiento,
        unidadMedida,
        cantidad,
        precio,
        estado,
        badge
    };
    
    // Agregar al array (en una aplicación real, aquí harías una petición al servidor)
    insumos.push(nuevoInsumo);
    
    // Actualizar la tabla
    actualizarInsumosOriginales();
    renderTablaInsumos();
    
    alert('Insumo guardado correctamente');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('insumoModal'));
    modal.hide();
}

// Función para actualizar insumo (edición)
function actualizarInsumo() {
    const index = document.getElementById('insumo-id').value;
    const nombre = document.getElementById('insumo-nombre').value;
    const stockActual = parseFloat(document.getElementById('insumo-stock-actual').value);
    const stockMinimo = parseFloat(document.getElementById('insumo-stock-minimo').value);
    const fechaVencimiento = document.getElementById('insumo-fecha-vencimiento').value;
    const unidadMedida = document.getElementById('insumo-unidad-medida').value;
    const cantidad = parseFloat(document.getElementById('insumo-cantidad').value);
    const precio = parseFloat(document.getElementById('insumo-precio').value);
    const estado = document.getElementById('insumo-estado').value;
    
    if (!nombre || isNaN(stockActual) || isNaN(stockMinimo) || !fechaVencimiento || !unidadMedida || isNaN(cantidad) || isNaN(precio) || !estado) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    if (stockActual < 0 || stockMinimo < 0 || cantidad < 0 || precio < 0) {
        alert('Los valores numéricos no pueden ser negativos');
        return;
    }
    
    // Determinar el badge según el estado
    let badge;
    switch(estado) {
        case 'Disponible':
            badge = 'success';
            break;
        case 'Bajo stock':
            badge = 'warning';
            break;
        case 'Agotado':
        case 'Vencido':
            badge = 'danger';
            break;
        default:
            badge = 'secondary';
    }
    
    // Actualizar el insumo
    insumos[index] = {
        nombre,
        stockActual,
        stockMinimo,
        fechaVencimiento,
        unidadMedida,
        cantidad,
        precio,
        estado,
        badge
    };
    
    // Actualizar la tabla
    actualizarInsumosOriginales();
    renderTablaInsumos();
    
    alert('Insumo actualizado correctamente');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('insumoModal'));
    modal.hide();
}

// Event listeners para el modal de insumos
document.addEventListener('DOMContentLoaded', function() {
    const insumoModal = document.getElementById('insumoModal');
    if (insumoModal) {
        // Evento cuando se abre el modal
        insumoModal.addEventListener('show.bs.modal', function () {
            // No hacer nada especial al abrir
        });
        
        // Evento cuando se cierra el modal
        insumoModal.addEventListener('hidden.bs.modal', function () {
            resetearModalInsumo();
        });
        
        // Evento para el botón de guardar (nuevo insumo)
        const saveInsumo = document.getElementById('saveInsumo');
        if (saveInsumo) {
            saveInsumo.addEventListener('click', guardarInsumo);
        }
        
        // Evento para el botón de actualizar (editar insumo)
        const updateInsumo = document.getElementById('updateInsumo');
        if (updateInsumo) {
            updateInsumo.addEventListener('click', actualizarInsumo);
        }
    }
});








