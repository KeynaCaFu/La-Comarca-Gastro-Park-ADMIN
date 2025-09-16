// Datos de ejemplo para administradores
const administradores = [
    { id: 1, nombre: "Ana", apellido: "Torrez", cedula: "705610896", telefono: "88871296", email: "ana.torrez@ejemplo.com", estado: "activo" },
    { id: 2, nombre: "Juan", apellido: "Pérez", cedula: "109680125", telefono: "85261245", email: "juan.perez@ejemplo.com", estado: "activo" },
    { id: 3, nombre: "Mariana", apellido: "Castillo", cedula: "6523896", telefono: "---", email: "mariana.castillo@ejemplo.com", estado: "inactivo" },
    { id: 4, nombre: "Carlos", apellido: "López", cedula: "12345678", telefono: "77778888", email: "carlos.lopez@ejemplo.com", estado: "activo" },
    { id: 5, nombre: "Laura", apellido: "Martínez", cedula: "87654321", telefono: "99990000", email: "laura.martinez@ejemplo.com", estado: "inactivo" }
];
// Datos de ejemplo para locales
const locales = [
    { id: 1, nombre: "Local Sur", direccion: "Av. Sur #123", telefono: "555-1001", administrador: "1", nombreAdministrador: "Ana Torrez", tipo: "comida", estado: "inactivo" },
    { id: 2, nombre: "Local Centro", direccion: "Calle Central #456", telefono: "555-1002", administrador: "2", nombreAdministrador: "Juan Pérez", tipo: "mixto", estado: "inactivo" },
    { id: 3, nombre: "Local Norte", direccion: "Av. Norte #789", telefono: "555-1003", administrador: "3", nombreAdministrador: "Marina Castillo", tipo: "bebidas", estado: "inactivo" },
    { id: 4, nombre: "Local Este", direccion: "Av. Este #101", telefono: "555-1004", administrador: "4", nombreAdministrador: "Carlos López", tipo: "comida", estado: "activo" },
    { id: 5, nombre: "Local Oeste", direccion: "Av. Oeste #202", telefono: "555-1005", administrador: "1", nombreAdministrador: "Ana Torrez", tipo: "mixto", estado: "activo" }
];

// Función para filtrar locales
function filtrarLocales() {
    const filtroLocal = document.getElementById('filtro-local').value.toLowerCase();
    const filtroAdministrador = document.getElementById('filtro-administrador').value.toLowerCase();
    const cuerpoTabla = document.getElementById('cuerpo-tabla-locales');
    const sinResultados = document.getElementById('sin-resultados');
    
    let resultadosEncontrados = 0;
    
    // Ocultar todas las filas primero
    const filas = cuerpoTabla.getElementsByTagName('tr');
    for (let i = 0; i < filas.length; i++) {
        filas[i].style.display = 'none';
    }
    
    // Mostrar solo las filas que coincidan con los filtros
    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        if (celdas.length >= 2) {
            const nombreLocal = celdas[0].textContent.toLowerCase();
            const nombreAdmin = celdas[1].textContent.toLowerCase();
            
            const coincideLocal = nombreLocal.includes(filtroLocal);
            const coincideAdmin = nombreAdmin.includes(filtroAdministrador);
            
            // Mostrar la fila si coincide con ambos filtros (si ambos están aplicados)
            if ((filtroLocal === '' || coincideLocal) && (filtroAdministrador === '' || coincideAdmin)) {
                filas[i].style.display = '';
                resultadosEncontrados++;
            }
        }
    }
    
    // Mostrar u ocultar el mensaje de sin resultados
    if (resultadosEncontrados === 0) {
        sinResultados.style.display = 'block';
    } else {
        sinResultados.style.display = 'none';
    }
}

// Función para limpiar los filtros
function limpiarFiltros() {
    document.getElementById('filtro-local').value = '';
    document.getElementById('filtro-administrador').value = '';
    filtrarLocales(); // Volver a aplicar el filtro (que ahora mostrará todos los registros)
}

// Función para buscar al presionar Enter en los campos de filtro
function configurarFiltros() {
    const filtroLocal = document.getElementById('filtro-local');
    const filtroAdministrador = document.getElementById('filtro-administrador');
    
    if (filtroLocal) {
        filtroLocal.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filtrarLocales();
            }
        });
    }
    
    if (filtroAdministrador) {
        filtroAdministrador.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filtrarLocales();
            }
        });
    }
}

// Función para renderizar la tabla de locales (para uso futuro si se cargan datos dinámicamente)
function renderizarTablaLocales() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-locales');
    cuerpoTabla.innerHTML = '';
    
    locales.forEach(local => {
        const fila = document.createElement('tr');
        
        // Determinar la clase del badge según el estado
        const badgeClass = local.estado === 'activo' ? 'badge-success' : 'badge-danger';
        const estadoTexto = local.estado === 'activo' ? 'Activo' : 'Inactivo';
        
        fila.innerHTML = `
            <td>${local.nombre}</td>
            <td>${local.nombreAdministrador}</td>
            <td><span class="badge ${badgeClass}">${estadoTexto}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="showLocalModal('edit', ${local.id})"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn-action btn-delete" onclick="deleteLocal(${local.id})"><i class="fas fa-trash"></i> Eliminar</button>
                <button class="btn-action btn-asignar" onclick="asignarAdmin(${local.id})"><i class="fas fa-user-tie"></i> Asignar Admin</button>
            </td>
        `;
        
        cuerpoTabla.appendChild(fila);
    });
    
    // Aplicar filtros después de renderizar
    filtrarLocales();
}

// Función para filtrar administradores
function filtrarAdministradores() {
    const filtroNombre = document.getElementById('filtro-admin-nombre').value.toLowerCase();
    const filtroCedula = document.getElementById('filtro-admin-cedula').value.toLowerCase();
    const cuerpoTabla = document.getElementById('cuerpo-tabla-administradores');
    const sinResultados = document.getElementById('sin-resultados-admin');
    
    let resultadosEncontrados = 0;
    
    // Ocultar todas las filas primero
    const filas = cuerpoTabla.getElementsByTagName('tr');
    for (let i = 0; i < filas.length; i++) {
        filas[i].style.display = 'none';
    }
    
    // Mostrar solo las filas que coincidan con los filtros
    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        if (celdas.length >= 2) {
            const nombreCompleto = celdas[0].textContent.toLowerCase();
            const cedula = celdas[1].textContent.toLowerCase();
            
            const coincideNombre = nombreCompleto.includes(filtroNombre);
            const coincideCedula = cedula.includes(filtroCedula);
            
            // Mostrar la fila si coincide con ambos filtros (si ambos están aplicados)
            if ((filtroNombre === '' || coincideNombre) && (filtroCedula === '' || coincideCedula)) {
                filas[i].style.display = '';
                resultadosEncontrados++;
            }
        }
    }
    
    // Mostrar u ocultar el mensaje de sin resultados
    if (resultadosEncontrados === 0) {
        sinResultados.style.display = 'block';
    } else {
        sinResultados.style.display = 'none';
    }
}

// Función para limpiar los filtros de administradores
function limpiarFiltrosAdmin() {
    document.getElementById('filtro-admin-nombre').value = '';
    document.getElementById('filtro-admin-cedula').value = '';
    filtrarAdministradores(); // Volver a aplicar el filtro (que ahora mostrará todos los registros)
}

// Función para buscar al presionar Enter en los campos de filtro de administradores
function configurarFiltrosAdministradores() {
    const filtroNombre = document.getElementById('filtro-admin-nombre');
    const filtroCedula = document.getElementById('filtro-admin-cedula');
    
    if (filtroNombre) {
        filtroNombre.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filtrarAdministradores();
            }
        });
    }
    
    if (filtroCedula) {
        filtroCedula.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filtrarAdministradores();
            }
        });
    }
}

// Función para renderizar la tabla de administradores (para uso futuro si se cargan datos dinámicamente)
function renderizarTablaAdministradores() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-administradores');
    cuerpoTabla.innerHTML = '';
    
    administradores.forEach(admin => {
        const fila = document.createElement('tr');
        
        // Determinar la clase del badge según el estado
        const badgeClass = admin.estado === 'activo' ? 'badge-success' : 'badge-danger';
        const estadoTexto = admin.estado === 'activo' ? 'Activo' : 'Inactivo';
        
        fila.innerHTML = `
            <td>${admin.nombre} ${admin.apellido}</td>
            <td>${admin.cedula}</td>
            <td>${admin.telefono}</td>
            <td><span class="badge ${badgeClass}">${estadoTexto}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="showAdminModal('edit', ${admin.id})"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn-action btn-delete" onclick="deleteAdmin(${admin.id})"><i class="fas fa-trash"></i> Eliminar</button>
            </td>
        `;
        
        cuerpoTabla.appendChild(fila);
    });
    
    // Aplicar filtros después de renderizar
    filtrarAdministradores();
}

// Función para mostrar/ocultar secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar la sección seleccionada
    document.getElementById(sectionId).style.display = 'block';

    // Actualizar el título

    var link = document.querySelector('.sidebar-menu a[onclick="showSection(\'' + sectionId + '\')"]');
    if (link) {
        document.getElementById('section-title').textContent = link.textContent.trim();
    }

    // Quitar 'active' de todos los enlaces
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    // Agregar 'active' al enlace actual
    if (link) link.classList.add('active');
}

// Funciones para el modal de administrador
function showAdminModal(mode, adminId = null) {
    const modal = document.getElementById('admin-modal');
    const title = document.getElementById('admin-modal-title');
    const submitBtn = document.getElementById('admin-modal-submit');
    const form = document.getElementById('admin-form');
    
    if (mode === 'new') {
        // Modo agregar
        title.textContent = 'Agregar Nuevo Administrador';
        submitBtn.textContent = 'Guardar Administrador';
        form.reset();
        document.getElementById('admin-id').value = '';
    } else if (mode === 'edit' && adminId) {
        // Modo editar
        title.textContent = 'Editar Administrador';
        submitBtn.textContent = 'Actualizar Administrador';
        
        // Buscar administrador por ID
        const admin = administradores.find(a => a.id === adminId);
        if (admin) {
            document.getElementById('admin-id').value = admin.id;
            document.getElementById('admin-nombre').value = admin.nombre;
            document.getElementById('admin-apellido').value = admin.apellido;
            document.getElementById('admin-cedula').value = admin.cedula;
            document.getElementById('admin-telefono').value = admin.telefono;
            document.getElementById('admin-email').value = admin.email;
            document.getElementById('admin-estado').value = admin.estado;
        }
    }
    
    modal.style.display = 'block';
}

function hideAdminModal() {
    document.getElementById('admin-modal').style.display = 'none';
}

// Función para eliminar administrador
function deleteAdmin(adminId) {
    if (confirm('¿Está seguro de que desea eliminar este administrador?')) {
        // Aquí iría el código para eliminar el administrador
        console.log('Eliminando administrador con ID:', adminId);
        alert('Administrador eliminado correctamente!');
        
        // En una aplicación real, aquí actualizarías la tabla
    }
}

// Funciones para el modal de local
function showLocalModal(mode, localId = null) {
    const modal = document.getElementById('local-modal');
    const title = document.getElementById('local-modal-title');
    const submitBtn = document.getElementById('local-modal-submit');
    const form = document.getElementById('local-form');
    
    if (mode === 'new') {
        // Modo agregar
        title.textContent = 'Agregar Nuevo Local';
        submitBtn.textContent = 'Guardar Local';
        form.reset();
        document.getElementById('local-id').value = '';
    } else if (mode === 'edit' && localId) {
        // Modo editar
        title.textContent = 'Editar Local';
        submitBtn.textContent = 'Actualizar Local';
        
        // Buscar local por ID
        const local = locales.find(l => l.id === localId);
        if (local) {
            document.getElementById('local-id').value = local.id;
            document.getElementById('local-nombre').value = local.nombre;
            document.getElementById('local-direccion').value = local.direccion;
            document.getElementById('local-telefono').value = local.telefono;
            document.getElementById('local-administrador').value = local.administrador;
            document.getElementById('local-tipo').value = local.tipo;
            document.getElementById('local-estado').value = local.estado;
        }
    }
    
    modal.style.display = 'block';
}

function hideLocalModal() {
    document.getElementById('local-modal').style.display = 'none';
}

// Función para eliminar local
function deleteLocal(localId) {
    if (confirm('¿Está seguro de que desea eliminar este local?')) {
        // Aquí iría el código para eliminar el local
        console.log('Eliminando local con ID:', localId);
        alert('Local eliminado correctamente!');
        
        // En una aplicación real, aquí actualizarías la tabla
    }
}

// Funciones para el modal de asignar administrador
function asignarAdmin(localId) {
    const modal = document.getElementById('asignar-admin-modal');
    const form = document.getElementById('asignar-admin-form');
    
    // Buscar local por ID
    const local = locales.find(l => l.id === localId);
    if (local) {
        document.getElementById('asignar-local-id').value = local.id;
        document.getElementById('asignar-local-nombre').value = local.nombre;
        document.getElementById('asignar-administrador').value = local.administrador || '';
    }
    
    modal.style.display = 'block';
}

function hideAsignarAdminModal() {
    document.getElementById('asignar-admin-modal').style.display = 'none';
}

// Funciones para mostrar/ocultar formularios de reseñas
function showAddResenaForm() {
    document.getElementById('add-resena-form').style.display = 'block';
}

function hideAddResenaForm() {
    document.getElementById('add-resena-form').style.display = 'none';
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
    let tabs = document.querySelectorAll('.tabs .tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(tabId)) {
            tab.classList.add('active');
        }
    });
}

// // Función para cerrar sesión
// function logout() {
//     alert('Cerrando sesión...');
//     // Redirigir al login
//     window.location.href = 'index.html';
// }

// Manejar el envío del formulario de administrador
document.addEventListener('DOMContentLoaded', function() {
    // Formulario de administrador
    const adminForm = document.getElementById('admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formulario
            const id = document.getElementById('admin-id').value;
            const nombre = document.getElementById('admin-nombre').value.trim();
            const apellido = document.getElementById('admin-apellido').value.trim();
            const cedula = document.getElementById('admin-cedula').value.trim();
            const telefono = document.getElementById('admin-telefono').value.trim();
            const email = document.getElementById('admin-email').value.trim();
            const estado = document.getElementById('admin-estado').value;
            
            if (!nombre || !apellido || !cedula || !telefono || !email || !estado) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }
            
            // Determinar si es creación o edición
            if (id) {
                // Modo edición
                console.log('Actualizando administrador:', { id, nombre, apellido, cedula, telefono, email, estado });
                alert('Administrador actualizado correctamente!');
            } else {
                // Modo creación
                console.log('Creando administrador:', { nombre, apellido, cedula, telefono, email, estado });
                alert('Administrador creado correctamente!');
            }
            
            // Cerrar el modal
            hideAdminModal();
        });
    }
    
    // Formulario de local
    const localForm = document.getElementById('local-form');
    if (localForm) {
        localForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formulario
            const id = document.getElementById('local-id').value;
            const nombre = document.getElementById('local-nombre').value.trim();
            const direccion = document.getElementById('local-direccion').value.trim();
            const telefono = document.getElementById('local-telefono').value.trim();
            const tipo = document.getElementById('local-tipo').value;
            const estado = document.getElementById('local-estado').value;
            
            if (!nombre || !direccion || !telefono || !tipo || !estado) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }
            
            // Determinar si es creación o edición
            if (id) {
                // Modo edición
                console.log('Actualizando local:', { id, nombre, direccion, telefono, tipo, estado });
                alert('Local actualizado correctamente!');
            } else {
                // Modo creación
                console.log('Creando local:', { nombre, direccion, telefono, tipo, estado });
                alert('Local creado correctamente!');
            }
            
            // Cerrar el modal
            hideLocalModal();
        });
    }
    
    // Formulario de asignar administrador
    const asignarAdminForm = document.getElementById('asignar-admin-form');
    if (asignarAdminForm) {
        asignarAdminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formulario
            const localId = document.getElementById('asignar-local-id').value;
            const administradorId = document.getElementById('asignar-administrador').value;
            
            if (!administradorId) {
                alert('Por favor, seleccione un administrador.');
                return;
            }
            
            // Aquí iría el código para asignar el administrador al local
            console.log('Asignando administrador:', { localId, administradorId });
            alert('Administrador asignado correctamente!');
            
            // Cerrar el modal
            hideAsignarAdminModal();
        });
    }
    
    // Cerrar modales si se hace clic fuera de ellos
    window.addEventListener('click', function(event) {
        const adminModal = document.getElementById('admin-modal');
        if (event.target === adminModal) {
            hideAdminModal();
        }
        
        const localModal = document.getElementById('local-modal');
        if (event.target === localModal) {
            hideLocalModal();
        }
        
        const asignarAdminModal = document.getElementById('asignar-admin-modal');
        if (event.target === asignarAdminModal) {
            hideAsignarAdminModal();
        }
    });
    // Configurar eventos para los filtros de administradores
    configurarFiltrosAdministradores();
    // Configurar eventos para los filtros
    configurarFiltros();
    // Mostrar la sección del dashboard por defecto
    showSection('dashboard-global');
});


// Datos de ejemplo para eventos
const eventos = [
    { 
        id: 1, 
        nombre: "Noche de Tapas Españolas", 
        fecha: "2023-10-15", 
        hora: "19:00", 
        descripcion: "Disfruta de una noche especial con las mejores tapas españolas acompañadas de vinos seleccionados.", 
        imagen: "img/eventos/tapas.jpg",
        estado: "activo" 
    },
    { 
        id: 2, 
        nombre: "Festival de Cervezas Artesanales", 
        fecha: "2023-11-05", 
        hora: "17:00", 
        descripcion: "Prueba más de 20 variedades de cervezas artesanales locales e internacionales con food pairing especial.", 
        imagen: "img/eventos/cervezas.jpg",
        estado: "activo" 
    },
    { 
        id: 3, 
        nombre: "Cena de Degustación 5 Tiempos", 
        fecha: "2023-09-28", 
        hora: "20:00", 
        descripcion: "Una experiencia culinaria exclusiva con 5 tiempos maridados con vinos premium.", 
        imagen: "img/eventos/cena.jpg",
        estado: "inactivo" 
    }
];

// Función para renderizar las tarjetas de eventos
function renderizarEventos(eventosMostrar = eventos) {
    const contenedor = document.getElementById('contenedor-eventos');
    const sinResultados = document.getElementById('sin-resultados-eventos');
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    if (eventosMostrar.length === 0) {
        sinResultados.style.display = 'block';
        return;
    }
    
    sinResultados.style.display = 'none';
    
    eventosMostrar.forEach(evento => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'evento-card';
        
        // Formatear fecha para mostrar
        const fechaObj = new Date(evento.fecha + 'T' + evento.hora);
        const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opcionesFecha);
        const horaFormateada = evento.hora.substring(0, 5);
        
        // Determinar clase según estado
        const claseEstado = evento.estado === 'activo' ? 'estado-activo' : 'estado-inactivo';
        const textoEstado = evento.estado === 'activo' ? 'Activo' : 'Inactivo';
        
        tarjeta.innerHTML = `
            <img src="${evento.imagen}" alt="${evento.nombre}" class="evento-imagen" onerror="this.src='img/eventos/default.jpg'">
            <div class="evento-contenido">
                <h3 class="evento-titulo">${evento.nombre}</h3>
                <div class="evento-fecha-hora">
                    <span><i class="far fa-calendar-alt"></i> ${fechaFormateada}</span>
                    <span><i class="far fa-clock"></i> ${horaFormateada}</span>
                </div>
                <div class="evento-estado ${claseEstado}">${textoEstado}</div>
                <p class="evento-descripcion">${evento.descripcion}</p>
                <div class="evento-acciones">
                    <button class="btn-evento btn-editar-evento" onclick="showEventoModal('edit', ${evento.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-evento btn-eliminar-evento" onclick="eliminarEvento(${evento.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        
        contenedor.appendChild(tarjeta);
    });
}

// Función para filtrar eventos
function filtrarEventos() {
    const filtroNombre = document.getElementById('filtro-evento-nombre').value.toLowerCase();
    const filtroFecha = document.getElementById('filtro-evento-fecha').value;
    
    const eventosFiltrados = eventos.filter(evento => {
        const coincideNombre = evento.nombre.toLowerCase().includes(filtroNombre);
        const coincideFecha = filtroFecha ? evento.fecha === filtroFecha : true;
        
        return coincideNombre && coincideFecha;
    });
    
    renderizarEventos(eventosFiltrados);
}

// Función para limpiar filtros de eventos
function limpiarFiltrosEventos() {
    document.getElementById('filtro-evento-nombre').value = '';
    document.getElementById('filtro-evento-fecha').value = '';
    renderizarEventos();
}

// Funciones para el modal de evento
function showEventoModal(mode, eventoId = null) {
    const modal = document.getElementById('evento-modal');
    const title = document.getElementById('evento-modal-title');
    const submitBtn = document.getElementById('evento-modal-submit');
    const form = document.getElementById('evento-form');
    const preview = document.getElementById('preview-imagen');
    
    // Ocultar preview inicialmente
    preview.style.display = 'none';
    
    if (mode === 'new') {
        // Modo agregar
        title.textContent = 'Agregar Nuevo Evento';
        submitBtn.textContent = 'Guardar Evento';
        form.reset();
        document.getElementById('evento-id').value = '';
        document.getElementById('evento-fecha').valueAsDate = new Date();
        document.getElementById('evento-hora').value = '19:00';
    } else if (mode === 'edit' && eventoId) {
        // Modo editar
        title.textContent = 'Editar Evento';
        submitBtn.textContent = 'Actualizar Evento';
        
        // Buscar evento por ID
        const evento = eventos.find(e => e.id === eventoId);
        if (evento) {
            document.getElementById('evento-id').value = evento.id;
            document.getElementById('evento-nombre').value = evento.nombre;
            document.getElementById('evento-fecha').value = evento.fecha;
            document.getElementById('evento-hora').value = evento.hora;
            document.getElementById('evento-descripcion').value = evento.descripcion;
            document.getElementById('evento-estado').value = evento.estado;
            
            // Mostrar preview de imagen existente
            const previewImg = document.getElementById('preview-img');
            previewImg.src = evento.imagen;
            preview.style.display = 'block';
        }
    }
    
    modal.style.display = 'block';
}

function hideEventoModal() {
    document.getElementById('evento-modal').style.display = 'none';
}

// Función para previsualizar imagen seleccionada
function setupImagePreview() {
    const inputImagen = document.getElementById('evento-imagen');
    const preview = document.getElementById('preview-imagen');
    const previewImg = document.getElementById('preview-img');
    
    inputImagen.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
            }
            
            reader.readAsDataURL(this.files[0]);
        }
    });
}

// Función para eliminar evento
function eliminarEvento(eventoId) {
    if (confirm('¿Está seguro de que desea eliminar este evento?')) {
        // Aquí iría el código para eliminar el evento
        console.log('Eliminando evento con ID:', eventoId);
        alert('Evento eliminado correctamente!');
        
        // En una aplicación real, aquí actualizarías la lista de eventos
        const index = eventos.findIndex(e => e.id === eventoId);
        if (index !== -1) {
            eventos.splice(index, 1);
            renderizarEventos();
        }
    }
}

// Actualiza la función DOMContentLoaded para incluir la configuración de eventos
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Configurar eventos para los filtros de eventos
    const filtroNombreEvento = document.getElementById('filtro-evento-nombre');
    const filtroFechaEvento = document.getElementById('filtro-evento-fecha');
    
    if (filtroNombreEvento) {
        filtroNombreEvento.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filtrarEventos();
            }
        });
    }
    
    if (filtroFechaEvento) {
        filtroFechaEvento.addEventListener('change', function() {
            filtrarEventos();
        });
    }
    
    // Configurar previsualización de imagen
    setupImagePreview();
    
    // Formulario de evento
    const eventoForm = document.getElementById('evento-form');
    if (eventoForm) {
        eventoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formulario
            const id = document.getElementById('evento-id').value;
            const nombre = document.getElementById('evento-nombre').value.trim();
            const fecha = document.getElementById('evento-fecha').value;
            const hora = document.getElementById('evento-hora').value;
            const descripcion = document.getElementById('evento-descripcion').value.trim();
            const estado = document.getElementById('evento-estado').value;
            const imagenInput = document.getElementById('evento-imagen');
            
            if (!nombre || !fecha || !hora || !descripcion || !estado) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }
            
            // En una aplicación real, aquí procesarías la imagen
            let imagenUrl = '';
            if (imagenInput.files.length > 0) {
                // Aquí iría el código para subir la imagen al servidor
                console.log('Imagen seleccionada:', imagenInput.files[0].name);
                imagenUrl = 'img/eventos/' + imagenInput.files[0].name;
            } else if (id) {
                // Si estamos editando y no se seleccionó nueva imagen, mantener la existente
                const eventoExistente = eventos.find(e => e.id == id);
                if (eventoExistente) {
                    imagenUrl = eventoExistente.imagen;
                }
            }
            
            // Determinar si es creación o edición
            if (id) {
                // Modo edición
                console.log('Actualizando evento:', { id, nombre, fecha, hora, descripcion, imagenUrl, estado });
                alert('Evento actualizado correctamente!');
                
                // Actualizar en el array (en una app real, sería una llamada al servidor)
                const index = eventos.findIndex(e => e.id == id);
                if (index !== -1) {
                    eventos[index] = { 
                        ...eventos[index], 
                        nombre, 
                        fecha, 
                        hora, 
                        descripcion, 
                        imagen: imagenUrl, 
                        estado 
                    };
                    renderizarEventos();
                }
            } else {
                // Modo creación
                console.log('Creando evento:', { nombre, fecha, hora, descripcion, imagenUrl, estado });
                alert('Evento creado correctamente!');
                
                // Agregar al array (en una app real, sería una llamada al servidor)
                const nuevoId = eventos.length > 0 ? Math.max(...eventos.map(e => e.id)) + 1 : 1;
                eventos.push({
                    id: nuevoId,
                    nombre,
                    fecha,
                    hora,
                    descripcion,
                    imagen: imagenUrl || 'img/eventos/default.jpg',
                    estado
                });
                renderizarEventos();
            }
            
            // Cerrar el modal
            hideEventoModal();
        });
    }
    
    // Renderizar eventos al cargar la página
    renderizarEventos();
});