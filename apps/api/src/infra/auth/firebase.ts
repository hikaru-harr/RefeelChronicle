// src/infra/auth/firebase.ts
import "dotenv/config";
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const app = initializeApp({
    credential: applicationDefault(),
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
})

export const auth = getAuth(app)
