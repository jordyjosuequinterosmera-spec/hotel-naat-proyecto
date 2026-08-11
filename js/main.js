document.addEventListener('DOMContentLoaded', () => {
    cargarHabitaciones();
    configurarFormularioReserva();
});

// 1. Obtener dinámicamente las habitaciones registradas en la BD MySQL
async function cargarHabitaciones() {
    const gridContainer = document.querySelector('.rooms-grid');
    if (!gridContainer) return;

    try {
        const response = await fetch('/api/habitaciones');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            gridContainer.innerHTML = ''; // Limpiar tarjetas estáticas

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

// 2. Enviar los datos de la reserva hacia el backend/MySQL
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

        const reservaData = {
            fecha_checkin: checkIn,
            adultos: parseInt(adults),
            ninos: parseInt(children) || 0,
            habitacion_id: 1 // Asignado por defecto a la habitación principal
        };

        try {
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservaData)
            });

            const data = await response.json();

            if (data.success) {
                alert(`¡Reserva registrada correctamente en el sistema! ID: ${data.reservaId}`);
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