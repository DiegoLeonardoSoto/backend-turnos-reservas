const socket = io();
const btnToggle = document.querySelector('#btn-toggle')

socket.on('available-changed', (updatedService) => {
    console.log(updatedService)
    const cardService = document.getElementById(updatedService._id)
    if(cardService) {
        cardService.classList.toggle('unavailable', !updatedService.available)
        cardService.querySelector('.available').innerHTML = updatedService.available ? `<strong>Disponible: </strong> Si` : `<strong>Disponible: </strong>No`
    }
});

if(btnToggle) {
    btnToggle.addEventListener('click', () => {
        const id = btnToggle.parentElement.id

        socket.emit('toggle-available', id)
    });
}
