import admin, { type ServiceAccount } from "firebase-admin";
import { firebaseConfig } from "./firebase";
import { z } from "zod";

function env(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var ${name}`)
  return value
}

const serviceAccount = z.object({
  projectId: z.string().optional(),
  privateKey: z.string().optional(),
  clientEmail: z.string().optional(),
}).transform(data => data as ServiceAccount)

const credential = serviceAccount.parse(
  JSON.parse(
    Buffer
      .from(
        env("FIREBASE_ADMIN_CREDENTIAL_BASE64"),
        "base64"
      )
      .toString("utf-8")
  )
)
export const adminApp = admin.apps.length === 0
  ? admin.initializeApp({
    ...firebaseConfig,
    credential: admin.credential.cert(credential)
  })
  : admin.app();
export const firestore = admin.firestore(adminApp)
export const storage = admin.storage(adminApp)
