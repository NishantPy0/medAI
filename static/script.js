document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const chatWindow = document.getElementById('chat-window');
    const promptInput = document.getElementById('prompt');

    sendBtn.addEventListener('click', async () => {
        const prompt = promptInput.value;
        if (prompt) {
            const userMessage = `<div class="user-message"><strong>You:</strong> ${prompt}</div>`;
            chatWindow.innerHTML += userMessage;
            promptInput.value = '';

            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            const data = await response.json();
            const formattedResponse = formatResponse(data.response);
            const botMessage = `<div class="bot-message"><strong>Bot:</strong> ${formattedResponse}</div>`;
            chatWindow.innerHTML += botMessage;
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    });

    promptInput.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            sendBtn.click();
        }
    });

    function formatResponse(response) {
        return response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }
});
