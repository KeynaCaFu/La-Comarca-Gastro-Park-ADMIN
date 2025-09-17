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
    document.getElementById('movimiento-insumo-label').textContent = `Cantidad a ${(movimiento === 'entrada' ? 'sumar' : 'restar')} para "${insumo.nombre}" (${insumo.unidad})`;
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
        insumo.cantidad += cantidad;
    } else if (tipoMovimiento === 'salida') {
        if (insumo.cantidad < cantidad) {
            alertDiv.textContent = 'No hay suficiente cantidad para realizar la salida.';
            alertDiv.className = 'movimiento-alert alert-danger';
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


// ========== GRÁFICAS DASHBOARD ==========
document.addEventListener('DOMContentLoaded', function() {
    // Pie chart productos más vendidos
    const ctxPie = document.getElementById('productosMasVendidosChart');
    if (ctxPie) {
        new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: ['Tacos al Pastor', 'Hamburguesa', 'Pizza', 'Ensalada', 'Burrito'],
                datasets: [{
                    data: [120, 90, 70, 40, 30],
                    backgroundColor: [
                        '#ff9900',
                        '#27ae60',
                        '#e74c3c',
                        '#3498db',
                        '#9b59b6'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    title: { display: false }
                }
            }
        });
    }
    // Bar chart ventas por periodo (vertical)
    const ctxBar = document.getElementById('ventasPeriodoChart');
    if (ctxBar) {
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Día', 'Semana', 'Mes'],
                datasets: [{
                    label: 'Ventas ($)',
                    data: [2350, 15800, 67200],
                    backgroundColor: [
                        '#27ae60',
                        '#ff9900',
                        '#3498db'
                    ],
                    borderRadius: 8,
                    maxBarThickness: 50
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'x',
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#181818', font: { size: 13 } }
                    },
                    x: {
                        ticks: { color: '#181818', font: { size: 13 } }
                    }
                }
            }
        });
    }
});

// ========== RESUMEN DE PRODUCTOS ==========
function actualizarResumen() {
    let productos = document.querySelectorAll(".producto");
    let resumen = document.getElementById("resumen");
    let total = 0;
    resumen.innerHTML = "";

    productos.forEach(p => {
        let precio = parseFloat(p.getAttribute("data-precio"));
        let cantidad = parseInt(p.querySelector(".cantidad").textContent);
        if (cantidad > 0) {
            let subtotal = precio * cantidad;
            total += subtotal;

            let item = document.createElement("div");
            item.style.display = "flex";
            item.style.justifyContent = "space-between";
            item.style.marginBottom = "5px";
            item.innerHTML = `<span>${p.querySelector("span").textContent.split(" - ")[0]} x${cantidad}</span>
                              <span>$${subtotal.toFixed(2)}</span>`;
            resumen.appendChild(item);
        }
    });

    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}
window.actualizarResumen = actualizarResumen;

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll(".btn-sumar").forEach(boton => {
        boton.addEventListener("click", function () {
            let cantidadEl = this.parentElement.querySelector(".cantidad");
            cantidadEl.textContent = parseInt(cantidadEl.textContent) + 1;
            actualizarResumen();
        });
    });

    document.querySelectorAll(".btn-restar").forEach(boton => {
        boton.addEventListener("click", function () {
            let cantidadEl = this.parentElement.querySelector(".cantidad");
            let cantidad = parseInt(cantidadEl.textContent);
            if (cantidad > 0) {
                cantidadEl.textContent = cantidad - 1;
            }
            actualizarResumen();
        });
    });

    actualizarResumen();
});

// ========== PREVISUALIZAR IMAGEN PRODUCTO ==========
document.addEventListener('DOMContentLoaded', function() {
    const productImagen = document.getElementById('product-imagen');
    if (productImagen) {
        productImagen.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('image-preview').src = e.target.result;
                    document.getElementById('image-preview-container').style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }

    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('productForm').reset();
            document.getElementById('image-preview-container').style.display = 'none';
        });
    }

    const saveProduct = document.getElementById('saveProduct');
    if (saveProduct) {
        saveProduct.addEventListener('click', function() {
            alert('Producto guardado correctamente');
            const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
            modal.hide();
        });
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

// Manejar el modal de empleados
document.addEventListener('DOMContentLoaded', function() {
    const empleadoModal = document.getElementById('empleadoModal');
    if (empleadoModal) {
        empleadoModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('empleadoForm').reset();
        });
    }

    const saveEmpleado = document.getElementById('saveEmpleado');
    if (saveEmpleado) {
        saveEmpleado.addEventListener('click', function() {
            // Validar el formulario
            const nombre = document.getElementById('empleado-nombre').value;
            const apellido = document.getElementById('empleado-apellido').value;
            const cedula = document.getElementById('empleado-cedula').value;
            const puesto = document.getElementById('empleado-puesto').value;
            
            if (!nombre || !apellido || !cedula || !puesto) {
                alert('Por favor complete todos los campos obligatorios');
                return;
            }
            
            // Aquí iría la lógica para guardar el empleado
            alert('Empleado guardado correctamente');
            
            // Cerrar el modal después de guardar
            const modal = bootstrap.Modal.getInstance(document.getElementById('empleadoModal'));
            modal.hide();
        });
    }
});

// Manejar el modal de pedidos
document.addEventListener('DOMContentLoaded', function() {
    const pedidoModal = document.getElementById('pedidoModal');
    if (pedidoModal) {
        pedidoModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('pedidoForm').reset();
            document.getElementById('resumen').innerHTML = '';
            document.getElementById('total').textContent = '$0.00';
        });
    }

    const savePedido = document.getElementById('savePedido');
    if (savePedido) {
        savePedido.addEventListener('click', function() {
            // Validar el formulario
            const cliente = document.getElementById('pedido-cliente').value;
            const telefono = document.getElementById('pedido-telefono').value;
            const estado = document.getElementById('pedido-estado').value;
            
            if (!cliente || !telefono || !estado) {
                alert('Por favor complete todos los campos obligatorios');
                return;
            }
            
            // Aquí iría la lógica para guardar el pedido
            alert('Pedido guardado correctamente');
            
            // Cerrar el modal después de guardar
            const modal = bootstrap.Modal.getInstance(document.getElementById('pedidoModal'));
            modal.hide();
        });
    }

});

// Variable para controlar el modo (agregar/editar)
let modoEdicionProducto = false;

// Función para cargar datos del producto en el modal de edición
function cargarProductoParaEditar(id, nombre, precio, tipo, descripcion, estado) {
    modoEdicionProducto = true;
    
    // Llenar el formulario con los datos del producto
    document.getElementById('product-id').value = id;
    document.getElementById('product-nombre').value = nombre;
    document.getElementById('product-precio').value = precio;
    document.getElementById('product-tipo').value = tipo;
    document.getElementById('product-descripcion').value = descripcion;
    document.getElementById('product-estado').value = estado;
    
    // Cambiar el título del modal
    document.getElementById('productModalLabel').textContent = 'Editar Platillo';
    
    // Mostrar el botón de actualizar y ocultar el de guardar
    document.getElementById('saveProduct').style.display = 'none';
    document.getElementById('updateProduct').style.display = 'block';
    
}

// Función para resetear el modal a modo agregar
function resetearModalProducto() {
    modoEdicionProducto = false;
    document.getElementById('productForm').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('productModalLabel').textContent = 'Agregar Nuevo Platillo';
    document.getElementById('saveProduct').style.display = 'block';
    document.getElementById('updateProduct').style.display = 'none';
    document.getElementById('image-preview-container').style.display = 'none';
    document.getElementById('image-preview').src = '';
    document.getElementById('remove-image').style.display = 'none';
}

// Función para guardar producto (nuevo)
function guardarProducto() {
    // Validar formulario
    const nombre = document.getElementById('product-nombre').value;
    const precio = document.getElementById('product-precio').value;
    const tipo = document.getElementById('product-tipo').value;
    
    if (!nombre || !precio || !tipo) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Aquí iría la lógica para guardar el nuevo producto
    // Por ejemplo: enviar datos al servidor con fetch o axios
    
    alert('Producto guardado correctamente');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
    
    // Recargar o actualizar la tabla de productos
    // actualizarTablaProductos();
}

// Función para actualizar producto (edición)
function actualizarProducto() {
    const id = document.getElementById('product-id').value;
    const nombre = document.getElementById('product-nombre').value;
    const precio = document.getElementById('product-precio').value;
    const tipo = document.getElementById('product-tipo').value;
    const descripcion = document.getElementById('product-descripcion').value;
    const estado = document.getElementById('product-estado').value;
    
    if (!id || !nombre || !precio || !tipo) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Aquí iría la lógica para actualizar el producto
    // Por ejemplo: enviar datos al servidor con fetch o axios
    
    alert('Producto actualizado correctamente');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
    
    // Recargar o actualizar la tabla de productos
    // actualizarTablaProductos();
}

// Event listeners para el modal de productos
document.addEventListener('DOMContentLoaded', function() {
    const productModal = document.getElementById('productModal');
    if (productModal) {
        // Evento cuando se abre el modal
        productModal.addEventListener('show.bs.modal', function () {
            // No hacer nada especial al abrir
        });
        
        // Evento cuando se cierra el modal
        productModal.addEventListener('hidden.bs.modal', function () {
            resetearModalProducto();
        });
        
        // Evento para el botón de guardar (nuevo producto)
        const saveProduct = document.getElementById('saveProduct');
        if (saveProduct) {
            saveProduct.addEventListener('click', guardarProducto);
        }
        
        // Evento para el botón de actualizar (editar producto)
        const updateProduct = document.getElementById('updateProduct');
        if (updateProduct) {
            updateProduct.addEventListener('click', actualizarProducto);
        }
 
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
    document.getElementById('insumo-cantidad').value = insumo.cantidad;
    document.getElementById('insumo-unidad').value = insumo.unidad;
    document.getElementById('insumo-minimo').value = insumo.minimo;
    document.getElementById('insumo-maximo').value = insumo.maximo;
    
    // Establecer el proveedor (necesitarías mapear el nombre a un valor)
    const proveedorSelect = document.getElementById('insumo-proveedor');
    for (let i = 0; i < proveedorSelect.options.length; i++) {
        if (proveedorSelect.options[i].text === insumo.proveedor) {
            proveedorSelect.value = proveedorSelect.options[i].value;
            break;
        }
    }
    
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
    const cantidad = parseFloat(document.getElementById('insumo-cantidad').value);
    const unidad = document.getElementById('insumo-unidad').value;
    const minimo = parseFloat(document.getElementById('insumo-minimo').value);
    const maximo = parseFloat(document.getElementById('insumo-maximo').value);
    const proveedorId = document.getElementById('insumo-proveedor').value;
    
    if (!nombre || isNaN(cantidad) || !unidad || isNaN(minimo) || isNaN(maximo) || !proveedorId) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    if (maximo <= minimo) {
        alert('El stock máximo debe ser mayor al stock mínimo');
        return;
    }
    
    // Obtener el nombre del proveedor
    const proveedorSelect = document.getElementById('insumo-proveedor');
    const proveedorNombre = proveedorSelect.options[proveedorSelect.selectedIndex].text;
    
    // Determinar el estado según la cantidad
    let estado, badge;
    if (cantidad <= 0) {
        estado = 'Agotado';
        badge = 'danger';
    } else if (cantidad <= minimo) {
        estado = 'Bajo stock';
        badge = 'warning';
    } else {
        estado = 'Disponible';
        badge = 'success';
    }
    
    // Crear nuevo insumo
    const nuevoInsumo = {
        nombre,
        cantidad,
        unidad,
        minimo,
        maximo,
        proveedor: proveedorNombre,
        estado,
        badge
    };
    
    // Agregar al array (en una aplicación real, aquí harías una petición al servidor)
    insumos.push(nuevoInsumo);
    
    // Actualizar la tabla
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
    const cantidad = parseFloat(document.getElementById('insumo-cantidad').value);
    const unidad = document.getElementById('insumo-unidad').value;
    const minimo = parseFloat(document.getElementById('insumo-minimo').value);
    const maximo = parseFloat(document.getElementById('insumo-maximo').value);
    const proveedorId = document.getElementById('insumo-proveedor').value;
    
    if (!nombre || isNaN(cantidad) || !unidad || isNaN(minimo) || isNaN(maximo) || !proveedorId) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    if (maximo <= minimo) {
        alert('El stock máximo debe ser mayor al stock mínimo');
        return;
    }
    
    // Obtener el nombre del proveedor
    const proveedorSelect = document.getElementById('insumo-proveedor');
    const proveedorNombre = proveedorSelect.options[proveedorSelect.selectedIndex].text;
    
    // Determinar el estado según la cantidad
    let estado, badge;
    if (cantidad <= 0) {
        estado = 'Agotado';
        badge = 'danger';
    } else if (cantidad <= minimo) {
        estado = 'Bajo stock';
        badge = 'warning';
    } else {
        estado = 'Disponible';
        badge = 'success';
    }
    
    // Actualizar el insumo
    insumos[index] = {
        nombre,
        cantidad,
        unidad,
        minimo,
        maximo,
        proveedor: proveedorNombre,
        estado,
        badge
    };
    
    // Actualizar la tabla
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

// Array para almacenar los proveedores (similar a como tienes con insumos)
let proveedores = [
    {
        nombre: 'Distribuidora Central',
        contacto: 'contacto@central.com - 555-1234',
        ventas: '$12,500 MXN'
    },
    {
        nombre: 'Alimentos del Norte',
        contacto: 'ventas@norte.com - 555-5678',
        ventas: '$8,200 MXN'
    },
    {
        nombre: 'Suministros Express',
        contacto: 'info@express.com - 555-9012',
        ventas: '$5,900 MXN'
    }
];

// Variable para controlar el modo (agregar/editar) de proveedores
let modoEdicionProveedor = false;

// Función para cargar datos del proveedor en el modal de edición
function cargarProveedorParaEditar(index) {
    modoEdicionProveedor = true;
    
    // Obtener el proveedor del array
    const proveedor = proveedores[index];
    
    // Guardar el índice para referencia posterior
    document.getElementById('proveedor-id').value = index;
    
    // Llenar el formulario con los datos del proveedor
    document.getElementById('proveedor-nombre').value = proveedor.nombre;
    
    // Extraer datos de contacto (email y teléfono)
    const contactoParts = proveedor.contacto.split(' - ');
    if (contactoParts.length === 2) {
        document.getElementById('proveedor-email').value = contactoParts[0];
        document.getElementById('proveedor-telefono').value = contactoParts[1];
    }
    
    // Aquí podrías cargar más campos si los tuvieras en tu estructura de datos
    // Por ejemplo: categoría, dirección, productos, etc.
    
    // Cambiar el título del modal
    document.getElementById('proveedorModalLabel').textContent = 'Editar Proveedor';
    
    // Mostrar el botón de actualizar y ocultar el de guardar
    document.getElementById('saveProveedor').style.display = 'none';
    document.getElementById('updateProveedor').style.display = 'block';
}

// Función para resetear el modal a modo agregar
function resetearModalProveedor() {
    modoEdicionProveedor = false;
    document.getElementById('proveedorForm').reset();
    document.getElementById('proveedor-id').value = '';
    document.getElementById('proveedorModalLabel').textContent = 'Agregar Nuevo Proveedor';
    document.getElementById('saveProveedor').style.display = 'block';
    document.getElementById('updateProveedor').style.display = 'none';
}

// Función para guardar proveedor (nuevo)
function guardarProveedor() {
    // Validar formulario
    const nombre = document.getElementById('proveedor-nombre').value;
    const telefono = document.getElementById('proveedor-telefono').value;
    const email = document.getElementById('proveedor-email').value;
    const pago = document.getElementById('proveedor-pago').value;
    
    if (!nombre || !telefono || !email || !pago) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Crear nuevo proveedor
    const nuevoProveedor = {
        nombre: nombre,
        contacto: `${email} - ${telefono}`,
        ventas: '$0 MXN' // Valor inicial
    };
    
    // Agregar al array (en una aplicación real, aquí harías una petición al servidor)
    proveedores.push(nuevoProveedor);
    
    // Actualizar la tabla
    actualizarTablaProveedores();
    
    alert('Proveedor guardado correctamente');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('proveedorModal'));
    modal.hide();
}

// Función para actualizar proveedor (edición)
function actualizarProveedor() {
    const index = document.getElementById('proveedor-id').value;
    const nombre = document.getElementById('proveedor-nombre').value;
    const telefono = document.getElementById('proveedor-telefono').value;
    const email = document.getElementById('proveedor-email').value;
    const pago = document.getElementById('proveedor-pago').value;
    
    if (!nombre || !telefono || !email || !pago) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Actualizar el proveedor
    proveedores[index] = {
        nombre: nombre,
        contacto: `${email} - ${telefono}`,
        ventas: proveedores[index].ventas // Mantener el valor de ventas existente
    };
    
    // Actualizar la tabla
    actualizarTablaProveedores();
    
    alert('Proveedor actualizado correctamente');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('proveedorModal'));
    modal.hide();
}

// Función para actualizar la tabla de proveedores
function actualizarTablaProveedores() {
    const tbody = document.querySelector('#gestion-proveedores table tbody');
    tbody.innerHTML = '';
    
    proveedores.forEach((proveedor, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${proveedor.nombre}</td>
                <td>${proveedor.contacto}</td>
                <td>${proveedor.ventas}</td>
                <td>
                    <button class="btn-edit btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#proveedorModal" onclick="cargarProveedorParaEditar(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-edit btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                    <button class="btn-detalle btn-info btn-sm"><i class="fas fa-eye"></i> Detalles</button>
                </td>
            </tr>
        `;
    });
}

// Event listeners para el modal de proveedores
document.addEventListener('DOMContentLoaded', function() {
    const proveedorModal = document.getElementById('proveedorModal');
    if (proveedorModal) {
        // Evento cuando se abre el modal
        proveedorModal.addEventListener('show.bs.modal', function () {
            // No hacer nada especial al abrir
        });
        
        // Evento cuando se cierra el modal
        proveedorModal.addEventListener('hidden.bs.modal', function () {
            resetearModalProveedor();
        });
        
        // Evento para el botón de guardar (nuevo proveedor)
        const saveProveedor = document.getElementById('saveProveedor');
        if (saveProveedor) {
            saveProveedor.addEventListener('click', guardarProveedor);
        }
        
        // Evento para el botón de actualizar (editar proveedor)
        const updateProveedor = document.getElementById('updateProveedor');
        if (updateProveedor) {
            updateProveedor.addEventListener('click', actualizarProveedor);
        }
    }
    
    // Inicializar la tabla de proveedores
    actualizarTablaProveedores();
});

// Array para almacenar los empleados
let empleados = [
    {
        nombre: 'Ana',
        apellido: 'Torrez',
        cedula: '705610896',
        telefono: '88871296',
        email: 'ctorrez@gmail.com',
        puesto: 'Mesera',
        salario: '',
        fechaContratacion: '',
        direccion: ''
    },
    {
        nombre: 'Juan',
        apellido: 'Pérez',
        cedula: '109680125',
        telefono: '85261245',
        email: 'juanP13@gmail.com',
        puesto: 'Cocinero',
        salario: '',
        fechaContratacion: '',
        direccion: ''
    },
    {
        nombre: 'Mariana',
        apellido: 'Castillo',
        cedula: '6523896',
        telefono: '---',
        email: 'mcastillo@hotmail.com',
        puesto: 'Cajera',
        salario: '',
        fechaContratacion: '',
        direccion: ''
    }
];

// Variable para controlar el modo (agregar/editar) de empleados
let modoEdicionEmpleado = false;

// Función para cargar datos del empleado en el modal de edición
function cargarEmpleadoParaEditar(index) {
    modoEdicionEmpleado = true;
    
    // Obtener el empleado del array
    const empleado = empleados[index];
    
    // Guardar el índice para referencia posterior
    document.getElementById('empleado-id').value = index;
    
    // Llenar el formulario con los datos del empleado
    document.getElementById('empleado-nombre').value = empleado.nombre;
    document.getElementById('empleado-apellido').value = empleado.apellido;
    document.getElementById('empleado-cedula').value = empleado.cedula;
    document.getElementById('empleado-telefono').value = empleado.telefono;
    document.getElementById('empleado-email').value = empleado.email;
    document.getElementById('empleado-puesto').value = empleado.puesto.toLowerCase();
    document.getElementById('empleado-salario').value = empleado.salario;
    document.getElementById('empleado-fecha').value = empleado.fechaContratacion;
    document.getElementById('empleado-direccion').value = empleado.direccion;
    
    // Cambiar el título del modal
    document.getElementById('empleadoModalLabel').textContent = 'Editar Empleado';
    
    // Mostrar el botón de actualizar y ocultar el de guardar
    document.getElementById('saveEmpleado').style.display = 'none';
    document.getElementById('updateEmpleado').style.display = 'block';
}

// Función para resetear el modal a modo agregar
function resetearModalEmpleado() {
    modoEdicionEmpleado = false;
    document.getElementById('empleadoForm').reset();
    document.getElementById('empleado-id').value = '';
    document.getElementById('empleadoModalLabel').textContent = 'Agregar Nuevo Empleado';
    document.getElementById('saveEmpleado').style.display = 'block';
    document.getElementById('updateEmpleado').style.display = 'none';
}

// Función para guardar empleado (nuevo)
function guardarEmpleado() {
    // Validar formulario
    const nombre = document.getElementById('empleado-nombre').value;
    const apellido = document.getElementById('empleado-apellido').value;
    const cedula = document.getElementById('empleado-cedula').value;
    const telefono = document.getElementById('empleado-telefono').value;
    const email = document.getElementById('empleado-email').value;
    const puesto = document.getElementById('empleado-puesto').value;
    
    if (!nombre || !apellido || !cedula || !telefono || !email || !puesto) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Crear nuevo empleado
    const nuevoEmpleado = {
        nombre,
        apellido,
        cedula,
        telefono,
        email,
        puesto: puesto.charAt(0).toUpperCase() + puesto.slice(1),
        salario: document.getElementById('empleado-salario').value,
        fechaContratacion: document.getElementById('empleado-fecha').value,
        direccion: document.getElementById('empleado-direccion').value
    };
    
    // Agregar al array (en una aplicación real, aquí harías una petición al servidor)
    empleados.push(nuevoEmpleado);
    
    // Actualizar la tabla
    actualizarTablaEmpleados();
    
    alert('Empleado guardado correctamente');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('empleadoModal'));
    modal.hide();
}

// Función para actualizar empleado (edición)
function actualizarEmpleado() {
    const index = document.getElementById('empleado-id').value;
    const nombre = document.getElementById('empleado-nombre').value;
    const apellido = document.getElementById('empleado-apellido').value;
    const cedula = document.getElementById('empleado-cedula').value;
    const telefono = document.getElementById('empleado-telefono').value;
    const email = document.getElementById('empleado-email').value;
    const puesto = document.getElementById('empleado-puesto').value;
    
    if (!nombre || !apellido || !cedula || !telefono || !email || !puesto) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Actualizar el empleado
    empleados[index] = {
        nombre,
        apellido,
        cedula,
        telefono,
        email,
        puesto: puesto.charAt(0).toUpperCase() + puesto.slice(1),
        salario: document.getElementById('empleado-salario').value,
        fechaContratacion: document.getElementById('empleado-fecha').value,
        direccion: document.getElementById('empleado-direccion').value
    };
    
    // Actualizar la tabla
    actualizarTablaEmpleados();
    
    alert('Empleado actualizado correctamente');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('empleadoModal'));
    modal.hide();
}

// Función para actualizar la tabla de empleados
function actualizarTablaEmpleados() {
    const tbody = document.querySelector('#lista-empleados table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    empleados.forEach((empleado, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${empleado.nombre} ${empleado.apellido}</td>
                <td>${empleado.cedula}</td>
                <td>${empleado.telefono}</td>
                <td>${empleado.email}</td>
                <td>${empleado.puesto}</td>
                <td>
                    <button class="btn-edit btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#empleadoModal" onclick="cargarEmpleadoParaEditar(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-edit btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

// Event listeners para el modal de empleados
document.addEventListener('DOMContentLoaded', function() {
    const empleadoModal = document.getElementById('empleadoModal');
    if (empleadoModal) {
        // Evento cuando se abre el modal
        empleadoModal.addEventListener('show.bs.modal', function () {
            // No hacer nada especial al abrir
        });
        
        // Evento cuando se cierra el modal
        empleadoModal.addEventListener('hidden.bs.modal', function () {
            resetearModalEmpleado();
        });
        
        // Evento para el botón de guardar (nuevo empleado)
        const saveEmpleado = document.getElementById('saveEmpleado');
        if (saveEmpleado) {
            saveEmpleado.addEventListener('click', guardarEmpleado);
        }
        
        // Evento para el botón de actualizar (editar empleado)
        const updateEmpleado = document.getElementById('updateEmpleado');
        if (updateEmpleado) {
            updateEmpleado.addEventListener('click', actualizarEmpleado);
        }
    }
    
    // Inicializar la tabla de empleados
    actualizarTablaEmpleados();
});

// Array para almacenar los pedidos
let pedidos = [
    {
        id: "#1023",
        cliente: "Carlos Pérez",
        productos: "3x Tacos, 2x Enchiladas",
        estado: "Recibido",
        hora: "12:34",
        total: 350.00,
        telefono: "555-1234",
        mesa: "5",
        notas: "",
        productosDetalle: [
            { nombre: "Tacos", precio: 50, cantidad: 3 },
            { nombre: "Enchiladas", precio: 100, cantidad: 2 }
        ]
    },
    {
        id: "#1024",
        cliente: "Axel López",
        productos: "1x Hamburguesa (3x Queso)",
        estado: "En preparación",
        hora: "12:36",
        total: 150.00,
        telefono: "555-5678",
        mesa: "3",
        notas: "Extra queso",
        productosDetalle: [
            { nombre: "Hamburguesa", precio: 120, cantidad: 1 },
            { nombre: "Queso extra", precio: 10, cantidad: 3 }
        ]
    },
    {
        id: "#1025",
        cliente: "Carlos Alcántara",
        productos: "3x Tostadas",
        estado: "En preparación",
        hora: "12:40",
        total: 95.00,
        telefono: "555-9012",
        mesa: "7",
        notas: "",
        productosDetalle: [
            { nombre: "Tostadas", precio: 95, cantidad: 1 }
        ]
    }
];

// Variable para controlar el pedido actual en edición
let pedidoEditando = null;

// Función para cargar datos del pedido en el modal de edición
function cargarPedidoParaEditar(index) {
    pedidoEditando = index;
    
    // Obtener el pedido del array
    const pedido = pedidos[index];
    
    // Llenar el formulario con los datos del pedido
    document.getElementById('pedido-edit-id').value = index;
    document.getElementById('pedido-edit-cliente').value = pedido.cliente;
    document.getElementById('pedido-edit-telefono').value = pedido.telefono;
    document.getElementById('pedido-edit-mesa').value = pedido.mesa;
    document.getElementById('pedido-edit-estado').value = pedido.estado.toLowerCase().replace(" ", "");
    document.getElementById('pedido-edit-hora').value = pedido.hora;
    document.getElementById('pedido-edit-total').value = pedido.total;
    document.getElementById('pedido-edit-notas').value = pedido.notas;
    document.getElementById('pedido-edit-total-display').textContent = `$${pedido.total.toFixed(2)}`;
    
    // Cargar productos
    const productosContainer = document.getElementById('pedido-edit-productos');
    productosContainer.innerHTML = '';
    
    pedido.productosDetalle.forEach((producto, idx) => {
        const productoHtml = `
            <div class="producto-edit mb-2 p-2 border rounded" data-precio="${producto.precio}" data-index="${idx}">
                <div class="d-flex justify-content-between align-items-center">
                    <span>${producto.nombre} - $${producto.precio.toFixed(2)}</span>
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-sm btn-danger btn-restar-edit me-2">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="cantidad-edit mx-2">${producto.cantidad}</span>
                        <button type="button" class="btn btn-sm btn-success btn-sumar-edit me-3">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-producto">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        productosContainer.innerHTML += productoHtml;
    });
    
    // Actualizar resumen
    actualizarResumenEdicion();
    
    // Agregar event listeners a los botones de productos
    setTimeout(() => {
        document.querySelectorAll('.btn-sumar-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const cantidadEl = this.parentElement.querySelector('.cantidad-edit');
                cantidadEl.textContent = parseInt(cantidadEl.textContent) + 1;
                actualizarResumenEdicion();
            });
        });
        
        document.querySelectorAll('.btn-restar-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const cantidadEl = this.parentElement.querySelector('.cantidad-edit');
                let cantidad = parseInt(cantidadEl.textContent);
                if (cantidad > 1) {
                    cantidadEl.textContent = cantidad - 1;
                    actualizarResumenEdicion();
                }
            });
        });
        
        document.querySelectorAll('.btn-eliminar-producto').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.producto-edit').remove();
                actualizarResumenEdicion();
            });
        });
    }, 100);
}

// Función para actualizar el resumen en edición
function actualizarResumenEdicion() {
    const resumen = document.getElementById('pedido-edit-resumen');
    let total = 0;
    resumen.innerHTML = '';
    
    document.querySelectorAll('.producto-edit').forEach(productoEl => {
        const precio = parseFloat(productoEl.getAttribute('data-precio'));
        const cantidad = parseInt(productoEl.querySelector('.cantidad-edit').textContent);
        const nombre = productoEl.querySelector('span').textContent.split(' - ')[0];
        const subtotal = precio * cantidad;
        total += subtotal;
        
        const item = document.createElement('div');
        item.className = 'd-flex justify-content-between mb-1';
        item.innerHTML = `<span>${nombre} x${cantidad}</span><span>$${subtotal.toFixed(2)}</span>`;
        resumen.appendChild(item);
    });
    
    document.getElementById('pedido-edit-total').value = total;
    document.getElementById('pedido-edit-total-display').textContent = `$${total.toFixed(2)}`;
}

// Función para resetear el modal de edición
function resetearModalPedidoEdit() {
    pedidoEditando = null;
    document.getElementById('pedidoEditForm').reset();
    document.getElementById('pedido-edit-productos').innerHTML = '';
    document.getElementById('pedido-edit-resumen').innerHTML = '';
    document.getElementById('pedido-edit-total-display').textContent = '$0.00';
}

// Función para actualizar pedido
function actualizarPedido() {
    if (pedidoEditando === null) return;
    
    const cliente = document.getElementById('pedido-edit-cliente').value;
    const telefono = document.getElementById('pedido-edit-telefono').value;
    const estado = document.getElementById('pedido-edit-estado').value;
    const notas = document.getElementById('pedido-edit-notas').value;
    const total = parseFloat(document.getElementById('pedido-edit-total').value);
    
    if (!cliente || !telefono || !estado) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Recopilar productos actualizados
    const productosDetalle = [];
    let productosDesc = '';
    
    document.querySelectorAll('.producto-edit').forEach(productoEl => {
        const precio = parseFloat(productoEl.getAttribute('data-precio'));
        const cantidad = parseInt(productoEl.querySelector('.cantidad-edit').textContent);
        const nombre = productoEl.querySelector('span').textContent.split(' - ')[0];
        
        productosDetalle.push({ nombre, precio, cantidad });
        
        if (productosDesc) productosDesc += ', ';
        productosDesc += `${cantidad}x ${nombre}`;
    });
    
    // Actualizar el pedido
    pedidos[pedidoEditando] = {
        ...pedidos[pedidoEditando],
        cliente,
        telefono,
        estado: estado.charAt(0).toUpperCase() + estado.slice(1),
        total,
        notas,
        productos: productosDesc,
        productosDetalle
    };
    
    // Actualizar la tabla
    actualizarTablaPedidos();
    
    alert('Pedido actualizado correctamente');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('pedidoEditModal'));
    modal.hide();
}

// Función para cancelar pedido
function cancelarPedido() {
    if (pedidoEditando === null) return;
    
    if (confirm('¿Está seguro de que desea cancelar este pedido?')) {
        // Cambiar estado a cancelado
        pedidos[pedidoEditando].estado = 'Cancelado';
        
        // Actualizar la tabla
        actualizarTablaPedidos();
        
        alert('Pedido cancelado correctamente');
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('pedidoEditModal'));
        modal.hide();
    }
}

// Función para actualizar la tabla de pedidos
function actualizarTablaPedidos() {
    const tbody = document.querySelector('#pedidos-activos table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    pedidos.forEach((pedido, index) => {
        // Determinar clase badge según estado
        let badgeClass = 'badge-warning';
        if (pedido.estado.toLowerCase().includes('preparacion')) badgeClass = 'badge-success';
        if (pedido.estado.toLowerCase().includes('completado')) badgeClass = 'badge-info';
        if (pedido.estado.toLowerCase().includes('cancelado')) badgeClass = 'badge-danger';
        
        tbody.innerHTML += `
            <tr>
                <td>${pedido.id}</td>
                <td>${pedido.cliente}</td>
                <td>${pedido.productos}</td>
                <td><span class="badge ${badgeClass}">${pedido.estado}</span></td>
                <td>${pedido.hora}</td>
                <td>$${pedido.total.toFixed(2)}</td>
                <td>
                    <button class="btn-edit btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#pedidoEditModal" onclick="cargarPedidoParaEditar(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-edit btn-success btn-sm"><i class="fas fa-check"></i></button>
                </td>
            </tr>
        `;
    });
}

// Event listeners para el modal de edición de pedidos
document.addEventListener('DOMContentLoaded', function() {
    const pedidoEditModal = document.getElementById('pedidoEditModal');
    if (pedidoEditModal) {
        // Evento cuando se cierra el modal
        pedidoEditModal.addEventListener('hidden.bs.modal', function () {
            resetearModalPedidoEdit();
        });
        
        // Evento para el botón de actualizar pedido
        const updatePedido = document.getElementById('updatePedido');
        if (updatePedido) {
            updatePedido.addEventListener('click', actualizarPedido);
        }
        
        // Evento para el botón de cancelar pedido
        const cancelPedido = document.getElementById('cancelPedido');
        if (cancelPedido) {
            cancelPedido.addEventListener('click', cancelarPedido);
        }
    }
    
    // Inicializar la tabla de pedidos
    actualizarTablaPedidos();
});
// Arrays para almacenar las reseñas de clientes
let resenasLocal = [
    {
        cliente: "Juan Pérez",
        calificacion: 5,
        comentario: "Excelente ambiente y servicio. Volveré pronto.",
        respuesta: "",
        fecha: "2025-08-24"
    },
    {
        cliente: "María González",
        calificacion: 4,
        comentario: "Buen lugar pero la música estaba muy alta.",
        respuesta: "Agradecemos tu comentario. Ajustaremos el volumen.",
        fecha: "2025-08-23"
    }
];

let resenasPedido = [
    {
        pedido: "#1023",
        cliente: "Ana Torrez",
        calificacion: 4,
        comentario: "Rápido y delicioso. Los tacos al pastor excelentes.",
        respuesta: "¡Gracias por tu comentario! Nos alegra que hayas disfrutado.",
        fecha: "2025-08-23"
    },
    {
        pedido: "#1025",
        cliente: "Carlos López",
        calificacion: 2,
        comentario: "El pedido llegó frío y faltó un ingrediente.",
        respuesta: "",
        fecha: "2025-08-22"
    }
];

// Función para generar estrellas de calificación
function generarEstrellas(calificacion) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= calificacion) {
            estrellas += '<i class="fas fa-star"></i>';
        } else {
            estrellas += '<i class="far fa-star"></i>';
        }
    }
    return estrellas;
}

// Función para obtener texto de calificación
function obtenerTextoCalificacion(calificacion) {
    const textos = {
        1: "Malo",
        2: "Regular",
        3: "Bueno",
        4: "Muy Bueno",
        5: "Excelente"
    };
    return textos[calificacion] || "";
}

// Función para cargar reseña para responder
function cargarResenaParaResponder(index, tipo) {
    const resena = tipo === 'local' ? resenasLocal[index] : resenasPedido[index];
    
    // Guardar el tipo e índice para referencia posterior
    document.getElementById('resena-tipo').value = tipo;
    document.getElementById('resena-index').value = index;
    
    // Llenar los campos de solo lectura
    document.getElementById('resena-tipo-display').value = tipo === 'local' ? 'Reseña sobre el Local' : 'Reseña sobre Pedido';
    document.getElementById('resena-cliente').value = resena.cliente;
    document.getElementById('resena-referencia').value = tipo === 'local' ? 'Local Centro' : resena.pedido;
    document.getElementById('resena-calificacion').innerHTML = generarEstrellas(resena.calificacion);
    document.getElementById('resena-calificacion-text').value = `${resena.calificacion}/5 - ${obtenerTextoCalificacion(resena.calificacion)}`;
    document.getElementById('resena-comentario').value = resena.comentario;
    document.getElementById('resena-fecha').value = resena.fecha;
    document.getElementById('resena-respuesta').value = resena.respuesta || '';
    
    // Actualizar contador de caracteres
    document.getElementById('resena-respuesta-contador').textContent = resena.respuesta ? resena.respuesta.length : 0;
    
    // Mostrar u ocultar botón de eliminar respuesta
    if (resena.respuesta) {
        document.getElementById('eliminarRespuesta').style.display = 'block';
        document.getElementById('guardarRespuesta').textContent = 'Actualizar Respuesta';
        document.getElementById('responderResenaModalLabel').textContent = 'Editar Respuesta a Reseña';
    } else {
        document.getElementById('eliminarRespuesta').style.display = 'none';
        document.getElementById('guardarRespuesta').textContent = 'Guardar Respuesta';
        document.getElementById('responderResenaModalLabel').textContent = 'Responder Reseña';
    }
}

// Función para guardar respuesta
function guardarRespuesta() {
    const tipo = document.getElementById('resena-tipo').value;
    const index = document.getElementById('resena-index').value;
    const respuesta = document.getElementById('resena-respuesta').value;
    
    if (!respuesta.trim()) {
        alert('Por favor escribe una respuesta');
        return;
    }
    
    // Actualizar la respuesta según el tipo
    if (tipo === 'local') {
        resenasLocal[index].respuesta = respuesta;
    } else {
        resenasPedido[index].respuesta = respuesta;
    }
    
    // Actualizar las tablas
    actualizarTablaResenasLocal();
    actualizarTablaResenasPedido();
    
    alert('Respuesta guardada correctamente');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('responderResenaModal'));
    modal.hide();
}

// Función para eliminar respuesta
function eliminarRespuesta() {
    const tipo = document.getElementById('resena-tipo').value;
    const index = document.getElementById('resena-index').value;
    
    if (confirm('¿Está seguro de que desea eliminar esta respuesta?')) {
        // Eliminar la respuesta según el tipo
        if (tipo === 'local') {
            resenasLocal[index].respuesta = '';
        } else {
            resenasPedido[index].respuesta = '';
        }
        
        // Actualizar las tablas
        actualizarTablaResenasLocal();
        actualizarTablaResenasPedido();
        
        alert('Respuesta eliminada correctamente');
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('responderResenaModal'));
        modal.hide();
    }
}

// Función para actualizar la tabla de reseñas de local
function actualizarTablaResenasLocal() {
    const tbody = document.querySelector('#reseñas-local table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    resenasLocal.forEach((resena, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${resena.cliente}</td>
                <td>
                    <div class="rating-stars">
                        ${generarEstrellas(resena.calificacion)}
                    </div>
                </td>
                <td>${resena.comentario}</td>
                <td>${resena.respuesta || ''}</td>
                <td>${resena.fecha}</td>
                <td>
                    <button class="btn-responder btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#responderResenaModal" onclick="cargarResenaParaResponder(${index}, 'local')">
                        <i class="fas ${resena.respuesta ? 'fa-edit' : 'fa-reply'}"></i> 
                        ${resena.respuesta ? 'Editar Respuesta' : 'Responder'}
                    </button>
                </td>
            </tr>
        `;
    });
}

// Función para actualizar la tabla de reseñas de pedido
function actualizarTablaResenasPedido() {
    const tbody = document.querySelector('#reseñas-pedido table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    resenasPedido.forEach((resena, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${resena.pedido}</td>
                <td>${resena.cliente}</td>
                <td>
                    <div class="rating-stars">
                        ${generarEstrellas(resena.calificacion)}
                    </div>
                </td>
                <td>${resena.comentario}</td>
                <td>${resena.respuesta || ''}</td>
                <td>${resena.fecha}</td>
                <td>
                    <button class="btn-responder btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#responderResenaModal" onclick="cargarResenaParaResponder(${index}, 'pedido')">
                        <i class="fas ${resena.respuesta ? 'fa-edit' : 'fa-reply'}"></i> 
                        ${resena.respuesta ? 'Editar Respuesta' : 'Responder'}
                    </button>
                </td>
            </tr>
        `;
    });
}

// Event listeners para el modal de responder reseñas
document.addEventListener('DOMContentLoaded', function() {
    const responderResenaModal = document.getElementById('responderResenaModal');
    if (responderResenaModal) {
        // Evento cuando se cierra el modal
        responderResenaModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('responderResenaForm').reset();
            document.getElementById('resena-tipo').value = '';
            document.getElementById('resena-index').value = '';
        });
        
        // Evento para el botón de guardar respuesta
        const guardarRespuesta = document.getElementById('guardarRespuesta');
        if (guardarRespuesta) {
            guardarRespuesta.addEventListener('click', guardarRespuesta);
        }
        
        // Evento para el botón de eliminar respuesta
        const eliminarRespuesta = document.getElementById('eliminarRespuesta');
        if (eliminarRespuesta) {
            eliminarRespuesta.addEventListener('click', eliminarRespuesta);
        }
        
        // Evento para contar caracteres en la respuesta
        const respuestaTextarea = document.getElementById('resena-respuesta');
        if (respuestaTextarea) {
            respuestaTextarea.addEventListener('input', function() {
                document.getElementById('resena-respuesta-contador').textContent = this.value.length;
            });
        }
    }
    
    // Inicializar las tablas de reseñas
    actualizarTablaResenasLocal();
    actualizarTablaResenasPedido();
    
    // Ocultar el botón de agregar reseña ya que no se necesita
    const addResenaButton = document.querySelector('button[onclick*="Resena"]');
    if (addResenaButton) {
        addResenaButton.style.display = 'none';
    }
});

// ========== FUNCIONALIDAD PARA REPORTES ==========

// Variables para el control de reportes
let filtroActual = 'dia';
let datosReportePedidos = [];
let datosReporteInsumos = [];

// Función para cambiar entre pestañas de reportes
function changeReportTab(tabId) {
    // Ocultar todos los contenidos de pestañas de reportes
    document.querySelectorAll('#reportes .tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    // Desactivar todas las pestañas de reportes
    document.querySelectorAll('#reportes .tabs .tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar el contenido de la pestaña seleccionada
    document.getElementById(tabId).style.display = 'block';

    // Activar la pestaña seleccionada
    let tabs = document.querySelectorAll('#reportes .tabs .tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(tabId)) {
            tab.classList.add('active');
        }
    });
}

// Función para filtrar reportes por período
function filtrarReportes(periodo) {
    filtroActual = periodo;
    ocultarFiltroRango();
    
    // Obtener fechas según el período
    const hoy = new Date();
    let fechaInicio, fechaFin, textoPeriodo;
    
    switch(periodo) {
        case 'dia':
            fechaInicio = new Date(hoy);
            fechaInicio.setHours(0, 0, 0, 0);
            fechaFin = new Date(hoy);
            fechaFin.setHours(23, 59, 59, 999);
            textoPeriodo = `Hoy: ${formatearFecha(hoy)}`;
            break;
        case 'semana':
            // Obtener el primer día de la semana (lunes)
            fechaInicio = new Date(hoy);
            fechaInicio.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1));
            fechaInicio.setHours(0, 0, 0, 0);
            
            // Obtener el último día de la semana (domingo)
            fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaInicio.getDate() + 6);
            fechaFin.setHours(23, 59, 59, 999);
            
            textoPeriodo = `Semana: ${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`;
            break;
        case 'mes':
            // Obtener el primer día del mes
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            fechaInicio.setHours(0, 0, 0, 0);
            
            // Obtener el último día del mes
            fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
            fechaFin.setHours(23, 59, 59, 999);
            
            textoPeriodo = `Mes: ${obtenerNombreMes(hoy.getMonth())} ${hoy.getFullYear()}`;
            break;
    }
    
    // Actualizar el texto del período
    document.getElementById('periodo-actual').textContent = textoPeriodo;
    document.getElementById('periodo-actual-insumos').textContent = textoPeriodo;
    
    // Aquí iría la lógica para filtrar los datos del servidor
    // Por ahora, simulamos la carga de datos
    cargarDatosReporte(fechaInicio, fechaFin);
}

// Función para mostrar el filtro de rango personalizado
function mostrarFiltroRango() {
    document.getElementById('filtro-rango').style.display = 'block';
    
    // Establecer fechas por defecto (últimos 7 días)
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaFin.getDate() - 7);
    
    document.getElementById('fecha-inicio').value = formatearFechaInput(fechaInicio);
    document.getElementById('fecha-fin').value = formatearFechaInput(fechaFin);
}

// Función para ocultar el filtro de rango personalizado
function ocultarFiltroRango() {
    document.getElementById('filtro-rango').style.display = 'none';
}

// Función para filtrar por rango de fechas personalizado
function filtrarPorRango() {
    const fechaInicio = new Date(document.getElementById('fecha-inicio').value);
    const fechaFin = new Date(document.getElementById('fecha-fin').value);
    
    if (fechaInicio > fechaFin) {
        alert('La fecha de inicio no puede ser mayor a la fecha final');
        return;
    }
    
    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(23, 59, 59, 999);
    
    filtroActual = 'rango';
    const textoPeriodo = `Período: ${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`;
    
    // Actualizar el texto del período
    document.getElementById('periodo-actual').textContent = textoPeriodo;
    document.getElementById('periodo-actual-insumos').textContent = textoPeriodo;
    
    // Cargar datos para el rango seleccionado
    cargarDatosReporte(fechaInicio, fechaFin);
    ocultarFiltroRango();
}

// Función para cargar datos de reporte (simulada)
function cargarDatosReporte(fechaInicio, fechaFin) {
    // Simular carga de datos de pedidos
    setTimeout(() => {
        // En una aplicación real, aquí harías una petición al servidor
        // con las fechas de inicio y fin para obtener los datos
        
        // Datos de ejemplo para pedidos
        const pedidosFiltrados = [
            {
                id: "#12345",
                cliente: "Juan Pérez",
                productos: "Tacos al Pastor, Agua de Horchata",
                total: 90.50,
                estado: "Pagado",
                fecha: "2024-06-12 13:45"
            },
            {
                id: "#12347",
                cliente: "Carlos Ruiz",
                productos: "Enchiladas Verdes, Refresco",
                total: 78.00,
                estado: "Pagado",
                fecha: "2024-06-12 11:10"
            }
        ];
        
        // Actualizar tabla de pedidos
        actualizarTablaPedidosReporte(pedidosFiltrados);
        
        // Datos de ejemplo para insumos
        const insumosFiltrados = [
            {
                insumo: "Carne de Res",
                movimiento: "Entrada",
                cantidad: "10 kg",
                fecha: "2024-06-12 09:30",
                responsable: "Admin Local"
            },
            {
                insumo: "Cebolla",
                movimiento: "Salida",
                cantidad: "2 kg",
                fecha: "2024-06-12 11:45",
                responsable: "Chef Juan"
            },
            {
                insumo: "Tortillas",
                movimiento: "Entrada",
                cantidad: "5 lb",
                fecha: "2024-06-12 08:15",
                responsable: "Admin Local"
            }
        ];
        
        // Actualizar tabla de insumos
        actualizarTablaInsumosReporte(insumosFiltrados);
        
    }, 500);
}

// Función para actualizar la tabla de reporte de pedidos
function actualizarTablaPedidosReporte(pedidos) {
    const tbody = document.getElementById('tabla-pedidos-reporte');
    tbody.innerHTML = '';
    
    let totalPedidos = 0;
    
    pedidos.forEach(pedido => {
        tbody.innerHTML += `
            <tr>
                <td>${pedido.id}</td>
                <td>${pedido.cliente}</td>
                <td>${pedido.productos}</td>
                <td>$${pedido.total.toFixed(2)}</td>
                <td><span class="badge badge-success">${pedido.estado}</span></td>
                <td>${pedido.fecha}</td>
            </tr>
        `;
        
        totalPedidos += pedido.total;
    });
    
    // Actualizar totales
    document.getElementById('total-pedidos').textContent = `$${totalPedidos.toFixed(2)}`;
    document.getElementById('cantidad-pedidos').textContent = pedidos.length;
    document.getElementById('total-ventas').textContent = `$${totalPedidos.toFixed(2)}`;
}

// Función para actualizar la tabla de reporte de insumos
function actualizarTablaInsumosReporte(insumos) {
    const tbody = document.getElementById('tabla-insumos-reporte');
    tbody.innerHTML = '';
    
    let totalEntradas = 0;
    let totalSalidas = 0;
    
    insumos.forEach(insumo => {
        const esEntrada = insumo.movimiento === "Entrada";
        const badgeClass = esEntrada ? "badge-success" : "badge-danger";
        
        tbody.innerHTML += `
            <tr>
                <td>${insumo.insumo}</td>
                <td><span class="badge ${badgeClass}">${insumo.movimiento}</span></td>
                <td>${insumo.cantidad}</td>
                <td>${insumo.fecha}</td>
                <td>${insumo.responsable}</td>
            </tr>
        `;
        
        // Extraer el valor numérico de la cantidad (ej: "10 kg" -> 10)
        const valorCantidad = parseFloat(insumo.cantidad);
        
        if (esEntrada) {
            totalEntradas += valorCantidad;
        } else {
            totalSalidas += valorCantidad;
        }
    });
    
    // Actualizar totales
    document.getElementById('total-entradas').textContent = totalEntradas;
    document.getElementById('total-salidas').textContent = totalSalidas;
}

// Función para exportar a PDF (simulada)
function exportarPDF(tipo) {
    alert(`Exportando reporte de ${tipo} a PDF para el período: ${filtroActual}`);
    // Aquí iría la lógica real para generar el PDF
}

// Función para exportar a Excel (simulada)
function exportarExcel(tipo) {
    alert(`Exportando reporte de ${tipo} a Excel para el período: ${filtroActual}`);
    // Aquí iría la lógica real para generar el Excel
}

// Funciones auxiliares para formato de fechas
function formatearFecha(fecha) {
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatearFechaInput(fecha) {
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

function obtenerNombreMes(numeroMes) {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[numeroMes];
}

// Inicializar reportes al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar reportes con el filtro de día por defecto
    filtrarReportes('dia');
});