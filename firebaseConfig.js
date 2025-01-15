// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUVpi4NQdrnbGCG6Ij6k3W0_oVHVSnN2o",
  authDomain: "pruebaquimica-b1741.firebaseapp.com",
  databaseURL: "https://pruebaquimica-b1741-default-rtdb.firebaseio.com/",
  projectId: "pruebaquimica-b1741",
  storageBucket: "pruebaquimica-b1741.firebasestorage.app",
  messagingSenderId: "317595127918",
  appId: "1:317595127918:web:3686304192805f29cbd67f",
  measurementId: "G-KVW32PCKKB"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
