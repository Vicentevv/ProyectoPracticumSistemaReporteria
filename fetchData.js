import { database } from './firebaseConfig.js';
import { ref, get, child } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

export class FirebaseService {
  constructor(databaseRef) {
    this.dbRef = ref(databaseRef);
  }

  async fetchData(path) {
    try {
      const snapshot = await get(child(this.dbRef, path));
      if (snapshot.exists()) {
        console.log("Datos obtenidos:", snapshot.val());
        return snapshot.val();
      } else {
        console.log("No se encontraron datos en la ruta especificada.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      throw error;
    }
  }
}

const firebaseService = new FirebaseService(database);

export { firebaseService };
