import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

};

// poistetaan virhe, joka koskee asynstoragea, koska halutaan, että jokaisella kerralla kirjaudutaan sisään
console.warn = (message) => {
  if (
    !message.includes(
      " You are initializing Firebase Auth for React Native without providing AsyncStorage. Auth state will default to memory persistence and will not persist between sessions. In order to persist auth state, install the package"
    )
  ) {
  }
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
