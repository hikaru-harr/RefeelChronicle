import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FIREBASE_PROJECT_ID, FIREBASE_ADMIN_CREDENTIAL_JSON } from "../../config/env";

// 環境変数に JSON を1行で入れておく想定
if (!FIREBASE_ADMIN_CREDENTIAL_JSON) {
  throw new Error("Missing FIREBASE_ADMIN_CREDENTIAL_JSON");
}

const cred = JSON.parse(FIREBASE_ADMIN_CREDENTIAL_JSON);

const app =
  getApps().length > 0
    ? getApps()[0]!
    : initializeApp({
        credential: cert(cred),
        projectId: FIREBASE_PROJECT_ID,
      });

export const auth = getAuth(app);
