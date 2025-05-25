const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "khushichatbot.firebaseapp.com",
  databaseURL: "https://khushichatbot-default-rtdb.firebaseio.com",
  projectId: "khushichatbot",
  storageBucket: "khushichatbot.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
