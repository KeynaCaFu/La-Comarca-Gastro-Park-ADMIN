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
                    <button class='btn-edit btn-addNew btn-sm'><i class='fas fa-edit'></i></button>
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


document.addEventListener('DOMContentLoaded', function() {
    // Limpiar el formulario cuando se cierra el modal de proveedores
    document.getElementById('proveedorModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById('proveedorForm').reset();
    });
    
    // Manejar el guardado del proveedor
    document.getElementById('saveProveedor').addEventListener('click', function() {
        // Validar el formulario
        const nombre = document.getElementById('proveedor-nombre').value;
        const telefono = document.getElementById('proveedor-telefono').value;
        const email = document.getElementById('proveedor-email').value;
        const pago = document.getElementById('proveedor-pago').value;
        
        if (!nombre || !telefono || !email || !pago) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }
        
        // Aquí iría la lógica para guardar el proveedor
        alert('Proveedor guardado correctamente');
        
        // Cerrar el modal después de guardar
        const modal = bootstrap.Modal.getInstance(document.getElementById('proveedorModal'));
        modal.hide();
    });
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

    // Manejar el modal de reseñas
    const resenaModal = document.getElementById('resenaModal');
    if (resenaModal) {
        resenaModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('resenaForm').reset();
        });
    }

    const saveResena = document.getElementById('saveResena');
    if (saveResena) {
        saveResena.addEventListener('click', function() {
            // Validar el formulario
            const tipo = document.getElementById('resena-tipo').value;
            const referencia = document.getElementById('resena-referencia').value;
            const cliente = document.getElementById('resena-cliente').value;
            const calificacion = document.getElementById('resena-calificacion').value;
            const comentario = document.getElementById('resena-comentario').value;
            
            if (!tipo || !referencia || !cliente || !calificacion || !comentario) {
                alert('Por favor complete todos los campos obligatorios');
                return;
            }
            
            // Aquí iría la lógica para guardar la reseña
            alert('Reseña guardada correctamente');
            
            // Cerrar el modal después de guardar
            const modal = bootstrap.Modal.getInstance(document.getElementById('resenaModal'));
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
    
    // Aquí podrías cargar la imagen si tuvieras una URL
    // document.getElementById('image-preview').src = urlImagen;
    // document.getElementById('image-preview-container').style.display = 'block';
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