const chatbox = document.getElementById("chatbox");
const input = document.getElementById("messageInput");
const status = document.getElementById("status");

let username = prompt("Tumhara naam likho (Kamal ya Khushi):");
username = username.trim();

if (username !== "Kamal" && username !== "Khushi") {
  alert("Sirf 'Kamal' ya 'Khushi' likho.");
  location.reload();
}

const friendName = username === "Kamal" ? "Khushi" : "Kamal";

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
  const msgEl = document.createElement("div");
  msgEl.className = "message " + (msg.sender === username ? "sent" : "received");
  msgEl.innerText = msg.sender + ": " + msg.text;
  chatbox.appendChild(msgEl);
  chatbox.scrollTop = chatbox.scrollHeight;
});

// Track user online/offline
window.addEventListener("focus", () => {
  db.ref("presence/" + username).set("online");
});
window.addEventListener("blur", () => {
  db.ref("presence/" + username).set("offline");
});

// Show other person's status
db.ref("presence/" + friendName).on("value", (snapshot) => {
  if (snapshot.val() === "online") {
    status.textContent = `${friendName} is online 💚`;
  } else {
    status.textContent = `Waiting for ${friendName}...`;
  }
});
