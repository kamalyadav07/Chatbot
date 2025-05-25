const chatbox = document.getElementById("chatbox");
const input = document.getElementById("messageInput");
const status = document.getElementById("status");

let username = prompt("Apna naam likho (Kamal ya Khushi):");
username = username.trim();

if (username !== "Kamal" && username !== "Khushi") {
  alert("Sirf 'Kamal' ya 'Khushi' likho.");
  location.reload();
}

const friendName = username === "Kamal" ? "Khushi" : "Kamal";
db.ref("presence/" + friendName).on("value", (snapshot) => {
  if (snapshot.val() === "online") {
    status.textContent = `${friendName} is online 💚`;
  } else {
    status.textContent = `Waiting for ${friendName}...`;
  }
});

function sendMessage() {
  const msg = input.value.trim();
  if (msg === "") return;

  const time = Date.now();
  db.ref("messages/" + time).set({
    sender: username,
    text: msg
  }).then(() => {
    input.value = "";
  });
}

db.ref("messages").on("child_added", (snapshot) => {
  const msg = snapshot.val();
  const key = snapshot.key;

  const msgEl = document.createElement("div");
  msgEl.className = "message " + (msg.sender === username ? "sent" : "received");
  msgEl.setAttribute("data-key", key); // 👈 This is important for deletion
  msgEl.innerHTML = `
    ${msg.sender}: ${msg.text}
    ${msg.sender === username ? `<span class="delete-icon" onclick="deleteMessage('${key}')">🗑</span>` : ""}
  `;
  chatbox.appendChild(msgEl);
  chatbox.scrollTop = chatbox.scrollHeight;
});

db.ref("messages").on("child_removed", (snapshot) => {
  const key = snapshot.key;
  const msgElements = document.querySelectorAll(`[data-key="${key}"]`);
  msgElements.forEach(el => el.remove());
});
window.addEventListener("focus", () => {
  db.ref("presence/" + username).set("online");
});

window.addEventListener("blur", () => {
  db.ref("presence/" + username).set("offline");
});




function deleteMessage(key) {
  if (confirm("You Want to Delete this message?")) {
    db.ref("messages/" + key).remove();
  }
}
function deleteChat() {
  if (confirm("You want to Delete whole chat.")) {
    db.ref("messages").remove().then(() => {
      chatbox.innerHTML = "";
      alert("Chat Deleted ✅");
    });
  }
}

