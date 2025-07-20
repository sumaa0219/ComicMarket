import admin, { type ServiceAccount } from "firebase-admin";
import { z } from "zod";

function env(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var ${name}`)
  return value
}

const serviceAccount = z.object({
  projectId: z.string(),
  privateKey: z.string(),
  clientEmail: z.string(),
}).transform((data: any) => data as ServiceAccount)

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
    credential: admin.credential.cert(credential),
    projectId: credential.projectId
  })
  : admin.app();
export const firestore = admin.firestore(adminApp)
export const storage = admin.storage(adminApp)
