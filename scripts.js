document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const loginForm = document.getElementById('loginForm');
    const messageSection = document.getElementById('messageSection');
    const messageForm = document.getElementById('messageForm');
    const messagesContainer = document.getElementById('messagesContainer');
    const nameInput = document.getElementById('name');

    // Check if the user is already logged in
    const storedName = localStorage.getItem('userName');
    if (storedName) {
        showMessageSection(storedName);
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const loginName = document.getElementById('loginName').value;
        localStorage.setItem('userName', loginName);
        showMessageSection(loginName);
    });

    function showMessageSection(name) {
        loginSection.style.display = 'none';
        messageSection.style.display = 'block';
        nameInput.value = name;
        fetchMessages(); // Fetch messages when showing the message section
    }

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = nameInput.value;
        const message = document.getElementById('message').value;
        const imageInput = document.getElementById('image');

        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageBase64 = event.target.result;
                const newMessage = { name, message, image: imageBase64 };
                saveMessage(newMessage);
                displayMessage(newMessage, name);
                messageForm.reset();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            const newMessage = { name, message };
            saveMessage(newMessage);
            displayMessage(newMessage, name);
            messageForm.reset();
        }
    });

    function saveMessage(message) {
        let messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
        console.log('Saved message:', message);
    }

    function fetchMessages() {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        const userName = localStorage.getItem('userName');
        console.log('Fetched messages:', messages);
        messagesContainer.innerHTML = ''; // Clear previous messages
        messages.forEach(message => displayMessage(message, userName));
    }

    function displayMessage(message, userName) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(message.name === userName ? 'self' : 'others');
        messageDiv.innerHTML = `<strong>${message.name}</strong>: ${message.message}`;
        if (message.image) {
            const img = document.createElement('img');
            img.src = message.image;
            messageDiv.appendChild(img);
        }
        messagesContainer.appendChild(messageDiv);
        console.log('Displayed message:', message);
    }

    // Initial fetch to display messages if the user is already logged in
    if (storedName) {
        fetchMessages();
    }
});
