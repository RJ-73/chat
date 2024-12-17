const socket = io();
let username = '', room = '';

document.getElementById('join-room').onclick = () => {
    username = document.getElementById('username').value.trim();
    room = document.getElementById('room').value.trim();
    if (username && room) {
        socket.emit('join room', { username, room });
        document.getElementById('join-room').disabled = true;
        document.getElementById('send').disabled = false;
    }
};

document.getElementById('send').onclick = sendMessage;

document.getElementById('input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = document.getElementById('input').value.trim();
    if (message) {
        const timestamp = formatTime(new Date()); // Get formatted time (hh:mm)
        socket.emit('chat message', { username, room, message, timestamp });
        appendMessage(`${message}: you`, 'self', timestamp); // Sender format with timestamp
        document.getElementById('input').value = '';
    }
}

socket.on('chat message', ({ username: sender, message, timestamp }) => {
    if (sender !== username) {
        appendMessage(`${sender}: ${message}`, 'other', timestamp); // Receiver format with timestamp
    }
});

function appendMessage(text, type, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(type);
    messageDiv.innerHTML = `
        ${text}
        <span class="timestamp">${timestamp}</span>
    `; // Add message content with timestamp
    document.getElementById('messages').appendChild(messageDiv);

    // Auto-scroll to the latest message
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}

// Helper function to format time as hh:mm
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // Returns time in "hh:mm" format
}
