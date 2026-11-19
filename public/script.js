const input = document.getElementById("user-input");

const sendBtn = document.getElementById("send-btn");

const chatBox = document.getElementById("chat-box");

let messages = [];

async function sendMessage() {

    const question = input.value.trim();

    if (question === "") return;

    addMessage(question, "user-message");

    messages.push({
        role: "user",
        content: question
    });

    input.value = "";

    sendBtn.disabled = true;

    const loading = addMessage("Thinking...", "bot-message");

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                messages: messages
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed");
        }

        loading.textContent = data.reply;

        messages.push({
            role: "assistant",
            content: data.reply
        });

    }

    catch (error) {

        loading.textContent = "Error: " + error.message;

    }

    finally {

        sendBtn.disabled = false;

        chatBox.scrollTop = chatBox.scrollHeight;

    }

}

function addMessage(text, className) {

    const message = document.createElement("div");

    message.className = className;

    message.textContent = text;

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;

    return message;

}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});