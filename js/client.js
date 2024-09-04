const socket = io('http://localhost:8000'); // Corrected port

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('level-up-191997.mp3');

const append = (message, position, specialClass = '') => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position); 
    if (specialClass) {
        messageElement.classList.add(specialClass);
    }
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
}

// Corrected event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''; // Clear the input field after sending the message
});

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    console.log(`User joined: ${name}`); // Debugging line
    append(`${name} joined the chat`, 'center', 'user-notification');
});

socket.on('receive', data => { // Corrected data handling
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'center', 'user-notification');
});
