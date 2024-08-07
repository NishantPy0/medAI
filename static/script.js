document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const chatWindow = document.getElementById('chat-window');
    const promptInput = document.getElementById('prompt');
    const pdfUpload = document.getElementById('pdf-upload');

    sendBtn.addEventListener('click', async () => {
        const formData = new FormData();
        const prompt = promptInput.value;
        const pdfFile = pdfUpload.files[0];
        let userMessage = '';

        if (prompt) {
            formData.append('prompt', prompt);
            userMessage += `<div class="user-message"><strong>You:</strong> ${prompt}</div>`;
        }

        if (pdfFile) {
            formData.append('pdf', pdfFile);
            userMessage += `<div class="user-message"><strong>You:</strong> (Document Attached)</div>`;
        }

        if (prompt || pdfFile) {
            chatWindow.innerHTML += userMessage;

            const response = await fetch('/generate', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                const botMessage = `<div class="bot-message"><strong>Bot:</strong> ${formatResponse(data.response)}</div>`;
                chatWindow.innerHTML += botMessage;
                chatWindow.scrollTop = chatWindow.scrollHeight;
            } else {
                const error = await response.json();
                const errorMessage = `<div class="bot-message"><strong>Bot:</strong> ${error.error}</div>`;
                chatWindow.innerHTML += errorMessage;
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }

            promptInput.value = ''; // Clear the text input
            pdfUpload.value = ''; // Clear the file input
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
