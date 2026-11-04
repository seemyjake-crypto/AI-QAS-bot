<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Answer Hub</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f7f6;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .chat-card {
      background: #ffffff;
      width: 90%;
      max-width: 500px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .chat-header {
      background: #0070f3;
      color: white;
      padding: 16px;
      text-align: center;
    }
    .chat-header h2 { margin: 0; font-size: 1.2rem; }
    .chat-header p { margin: 4px 0 0; font-size: 0.85rem; opacity: 0.9; }
    .chat-body {
      padding: 16px;
      height: 350px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .msg {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 0.95rem;
      line-height: 1.4;
    }
    .bot {
      background: #eef2f5;
      color: #333;
      align-self: flex-start;
    }
    .user {
      background: #0070f3;
      color: white;
      align-self: flex-end;
    }
    .chat-footer {
      display: flex;
      padding: 12px;
      border-top: 1px solid #eee;
      gap: 8px;
    }
    input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 0.95rem;
      outline: none;
    }
    button {
      background: #0070f3;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }
    button:disabled { opacity: 0.6; }
  </style>
</head>
<body>

  <div class="chat-card">
    <div class="chat-header">
      <h2>AI Q&A Assistant</h2>
      <p>Ask any question and get instant answers</p>
    </div>
    
    <div class="chat-body" id="chatBox">
      <div class="msg bot">Hello! Ask me anything, and I will help you find an answer.</div>
    </div>

    <div class="chat-footer">
      <input type="text" id="userInput" placeholder="Type your question..." onkeypress="handleKey(event)" />
      <button onclick="askQuestion()" id="sendBtn">Ask</button>
    </div>
  </div>

  <script>
    async function askQuestion() {
      const input = document.getElementById("userInput");
      const chatBox = document.getElementById("chatBox");
      const btn = document.getElementById("sendBtn");
      const question = input.value.trim();

      if (!question) return;

      // Append user message
      chatBox.innerHTML += `<div class="msg user">${question}</div>`;
      input.value = "";
      btn.disabled = true;

      // Add temporary loading indicator
      const loadingId = "loading-" + Date.now();
      chatBox.innerHTML += `<div class="msg bot" id="${loadingId}">Thinking...</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;

      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: question })
        });

        const data = await response.json();
        const botMsg = document.getElementById(loadingId);

        if (response.ok) {
          botMsg.innerText = data.reply;
        } else {
          botMsg.innerText = "Error: " + (data.error || "Failed to fetch response.");
        }
      } catch (err) {
        document.getElementById(loadingId).innerText = "Connection error. Please try again.";
      }

      btn.disabled = false;
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function handleKey(e) {
      if (e.key === "Enter") askQuestion();
    }
  </script>
</body>
</html>
