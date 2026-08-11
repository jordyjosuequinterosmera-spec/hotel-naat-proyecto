document.addEventListener('DOMContentLoaded', () => {
    cargarHabitaciones();
    configurarFormularioReserva();
    configurarSistemaAuth();
    actualizarInterfazUsuario();
});

// 1. Obtener dinámicamente las habitaciones desde MySQL
async function cargarHabitaciones() {
    const gridContainer = document.querySelector('.rooms-grid');
    if (!gridContainer) return;

    try {
        const response = await fetch('/api/habitaciones');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            gridContainer.innerHTML = ''; // Limpiar placeholders

            result.data.forEach(room => {
                const card = document.createElement('div');
                card.className = 'room-card';
                card.innerHTML = `
                    <div class="card-image-wrapper">
                        <img src="${room.imagen_url}" alt="${room.nombre}">
                    </div>
                    <div class="card-content">
                        <h3>${room.nombre}</h3>
                        <p style="color: #666; font-size: 0.9rem; margin-top: 5px;">
                           ${room.descripcion || ''}
                        </p>
                        <p style="font-weight: bold; color: #0088cc; margin-top: 10px;">
                           $${room.precio_noche} / noche
                        </p>
                    </div>
                `;
                gridContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error al cargar habitaciones desde el backend:', error);
    }
}

// 2. Control del Modal y Autenticación (Login / Registro)
function configurarSistemaAuth() {
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.querySelector('.close-btn');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    // Cambiar de pestañas (Tabs)
    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            formLogin.classList.remove('hidden');
            formRegister.classList.add('hidden');
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            formRegister.classList.remove('hidden');
            formLogin.classList.add('hidden');
        });
    }

    // Cerrar modal
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    // Procesar Registro
    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('reg-nombre').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            try {
                const res = await fetch('/api/auth/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, password })
                });

                const data = await res.json();
                if (data.success) {
                    alert('¡Cuenta creada con éxito! Por favor inicia sesión.');
                    tabLogin.click(); // Cambiar a pestaña login
                    formRegister.reset();
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (err) {
                console.error('Error en registro:', err);
            }
        });
    }

    // Procesar Login
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (data.success) {
                    // Guardar token y datos del usuario en localStorage
                    localStorage.setItem('naat_token', data.token);
                    localStorage.setItem('naat_user', JSON.stringify(data.usuario));
                    
                    alert(`¡Bienvenido de nuevo, ${data.usuario.nombre}!`);
                    if (modal) modal.classList.add('hidden');
                    formLogin.reset();
                    actualizarInterfazUsuario();
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (err) {
                console.error('Error en login:', err);
            }
        });
    }
}

// 3. Actualizar la interfaz si el usuario ha iniciado sesión
function actualizarInterfazUsuario() {
    const user = JSON.parse(localStorage.getItem('naat_user'));
    const navUl = document.querySelector('.main-nav ul');

    if (!navUl) return;

    // Buscar si ya existe un elemento de sesión
    let userLi = document.getElementById('nav-user-item');

    if (user) {
        if (!userLi) {
            userLi = document.createElement('li');
            userLi.id = 'nav-user-item';
            navUl.appendChild(userLi);
        }
        userLi.innerHTML = `
            <span style="color: #0088cc; font-weight: 600;">Hola, ${user.nombre.split(' ')[0]}</span>
            <a href="#" id="btn-logout" style="margin-left: 10px; color: #d9534f; font-size: 0.85rem;">(Cerrar Sesión)</a>
        `;

        document.getElementById('btn-logout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('naat_token');
            localStorage.removeItem('naat_user');
            alert('Sesión cerrada.');
            actualizarInterfazUsuario();
        });
    } else {
        if (userLi) userLi.remove();
        
        // Agregar botón para abrir modal de login en el menú si no existe
        let loginNavBtn = document.getElementById('nav-login-btn');
        if (!loginNavBtn) {
            const li = document.createElement('li');
            li.id = 'nav-login-btn';
            li.innerHTML = `<a href="#" id="open-auth-btn" style="color: #0088cc; font-weight: bold;">ingresar</a>`;
            navUl.appendChild(li);

            document.getElementById('open-auth-btn').addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('auth-modal').classList.remove('hidden');
            });
        }
    }
}

// 4. Procesar el Formulario de Reserva enviando la referencia del usuario
function configurarFormularioReserva() {
    const bookingForm = document.querySelector('.booking-form');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const checkIn = bookingForm.querySelector('input[name="check-in"]').value;
        const adults = bookingForm.querySelector('select[name="adults"]').value;
        const children = bookingForm.querySelector('select[name="children"]').value;

        if (!checkIn) {
            alert('Por favor, selecciona una fecha de llegada.');
            return;
        }

        if (!adults) {
            alert('Por favor, selecciona la cantidad de adultos.');
            return;
        }

        const user = JSON.parse(localStorage.getItem('naat_user'));

        const reservaData = {
            fecha_checkin: checkIn,
            adultos: parseInt(adults),
            ninos: parseInt(children) || 0,
            habitacion_id: 1, // Por defecto la primera
            usuario_id: user ? user.id : null // Asocia la reserva si el usuario inició sesión
        };

        try {
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservaData)
            });

            const data = await response.json();

            if (data.success) {
                alert(`¡Reserva registrada con éxito! ID: ${data.reservaId}`);
                bookingForm.reset();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al enviar la reserva:', error);
            alert('Ocurrió un problema al conectar con el servidor.');
        }
    });
}