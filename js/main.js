document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.querySelector('.booking-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita la recarga de página por defecto

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

            console.log('Datos capturados para reserva:', {
                fecha: checkIn,
                adultos: adults,
                ninos: children || '0'
            });

            alert(`¡Búsqueda iniciada! Fecha: ${checkIn} | Adultos: ${adults}`);
        });
    }
});