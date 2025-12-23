import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseClient";

export const auth = getAuth(firebaseApp);
