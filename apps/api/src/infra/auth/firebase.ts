import { FIREBASE_ADMIN_CREDENTIAL_PATH, FIREBASE_ADMIN_CREDENTIAL_JSON } from "../../config/env";
import fs from "node:fs";
import admin from "firebase-admin";

function loadServiceAccount() {
  if (FIREBASE_ADMIN_CREDENTIAL_PATH) {
    return JSON.parse(fs.readFileSync(FIREBASE_ADMIN_CREDENTIAL_PATH, "utf8"));
  }
  if (FIREBASE_ADMIN_CREDENTIAL_JSON) {
    return JSON.parse(FIREBASE_ADMIN_CREDENTIAL_JSON);
  }
  throw new Error("Missing FIREBASE_ADMIN_CREDENTIAL_PATH or _JSON");
}

if (admin.apps.length === 0) {
  const cred = loadServiceAccount();
  admin.initializeApp({ credential: admin.credential.cert(cred) });
}

export const auth = admin.auth();
