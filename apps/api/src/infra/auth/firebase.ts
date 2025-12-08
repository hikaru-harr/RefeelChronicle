// src/infra/auth/firebase.ts
import "dotenv/config";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FIREBASE_PROJECT_ID } from "../../config/env";

const app = initializeApp({
	credential: applicationDefault(),
	projectId: FIREBASE_PROJECT_ID,
});

export const auth = getAuth(app);
