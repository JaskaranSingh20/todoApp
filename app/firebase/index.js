
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth ,GoogleAuthProvider} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCiWul-HxdEm1gXVOvagu1gy45A80t_i4I",
  authDomain: "todo-518ea.firebaseapp.com",
  projectId: "todo-518ea",
  storageBucket: "todo-518ea.appspot.com",
  messagingSenderId: "801007854267",
  appId: "1:801007854267:web:7874f4249c7a7a618a3f9e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export {auth, provider, storage};
export default db;