const MAX_LENGTH = 140

const getMessages = async () => {
    const chat = document.getElementById("chat")

    const isAtBottom = chat.scrollTop + chat.clientHeight >= chat.scrollHeight - 5

    const response = await fetch("/api/messages")
    const messages = await response.json()

    chat.innerHTML = ''

    for (let i = 0; i < messages.length; i++) {
        const message = messages[i]

        const li = document.createElement('li')

        let content = message.text

        // imagen directa
        if (isImageURL(content)) {
            content = `
                <div>${message.text}</div>
                <img src="${message.text}" style="max-width:200px; border-radius:8px; margin-top:5px;">
            `
        }
        // link normal
        else if (isURL(content)) {
            content = `
                <div style="border:1px solid #334155; padding:8px; border-radius:8px; margin-top:5px;">
                    <a href="${message.text}" target="_blank" style="color:#38bdf8;">
                        ${message.text}
                    </a>
                </div>
            `
        }

        li.innerHTML = `<span class="username">${message.user}:</span> ${content}`
        chat.appendChild(li)
    }

    if (isAtBottom) {
        scrollToBottom()
    }
}

const postMessages = async (message) => {
    await fetch("/api/messages", {
        method: 'POST',
        body: JSON.stringify(message)
    })

    getMessages()
}

getMessages()

// botón enviar
document.querySelector("button").addEventListener('click', send)

// enviar con Enter
document.getElementById("message").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        send()
    }
})

function send() {
    const input = document.getElementById('message')
    let text = input.value.trim()

    if (text.length === 0) return

    if (text.length > MAX_LENGTH) {
        alert("Máximo 140 caracteres")
        return
    }

    postMessages({
        user: 'naguirrel',
        text: text
    })

    input.value = ''
}

// auto-refresh cada 3 segundos
setInterval(getMessages, 3000)

// scroll
function scrollToBottom() {
    const chat = document.getElementById("chat")
    chat.scrollTop = chat.scrollHeight
}

// detectar imágenes
function isImageURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null
}

// detectar URLs válidas
function isURL(text) {
    try {
        new URL(text)
        return true
    } catch {
        return false
    }
}