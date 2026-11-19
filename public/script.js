const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

let messages = [];
let isLoading = false;

// SEND MESSAGE FUNCTION

async function sendMessage() {

    const question = input.value.trim();

    if (question === "" || isLoading) return;

    // Show user message
    addMessage(question, "user-message");

    messages.push({
        role: "user",
        content: question
    });

    // Clear input
    input.value = "";

    // Loading state
    isLoading = true;
    sendBtn.disabled = true;
    input.disabled = true;

    // Thinking message
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

        // Show AI response
        loading.textContent = data.reply;

        // Save conversation
        messages.push({
            role: "assistant",
            content: data.reply
        });

    }

    catch (error) {

        loading.textContent = "Sorry! " + error.message;

        console.error("Chat Error:", error);

    }

    finally {

        isLoading = false;

        sendBtn.disabled = false;
        input.disabled = false;

        input.focus();

        scrollToBottom();

    }

}


// ADD MESSAGE FUNCTION

function addMessage(text, className) {

    const message = document.createElement("div");

    message.className = className;

    message.textContent = text;

    chatBox.appendChild(message);

    scrollToBottom();

    return message;

}


// AUTO SCROLL

function scrollToBottom() {

    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
    });

}


// SEND BUTTON CLICK

sendBtn.addEventListener("click", sendMessage);


// ENTER KEY

input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();

    }

});