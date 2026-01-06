import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {
	FIREBASE_CLIENT_EMAIL,
	FIREBASE_PRIVATE_KEY,
	FIREBASE_PROJECT_ID,
} from "../../config/env";

if (!FIREBASE_PRIVATE_KEY) {
	throw new Error("Missing FIREBASE_PRIVATE_KEY");
}

export const firebaseAdmin =
	getApps()[0] ??
	initializeApp({
		credential: cert({
			projectId: FIREBASE_PROJECT_ID,
			clientEmail: FIREBASE_CLIENT_EMAIL,
			privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
		}),
	});

export const auth = getAuth(firebaseAdmin);
