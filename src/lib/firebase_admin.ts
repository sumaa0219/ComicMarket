import admin, { type ServiceAccount } from "firebase-admin";
import { firebaseConfig } from "./firebase";

function env(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var ${name}`)
  return value
}

// サービスアカウント情報を取得
let credential: ServiceAccount;
try {
  const credentialData = JSON.parse(
    Buffer
      .from(
        env("FIREBASE_ADMIN_CREDENTIAL_BASE64"),
        "base64"
      )
      .toString("utf-8")
  );
  
  // 必要なフィールドの確認
  if (!credentialData.projectId || !credentialData.privateKey || !credentialData.clientEmail) {
    throw new Error("Invalid service account: missing required fields");
  }
  
  credential = credentialData as ServiceAccount;
} catch (error) {
  console.error("Failed to parse Firebase Admin credentials:", error);
  throw error;
}

export const adminApp = admin.apps.length === 0
  ? admin.initializeApp({
    credential: admin.credential.cert(credential),
    projectId: firebaseConfig.projectId
  })
  : admin.app();
export const firestore = admin.firestore(adminApp)

// Storage設定を追加
export const storage = admin.storage(adminApp)
export const bucket = storage.bucket() // デフォルトバケットを使用

// Storage操作用のヘルパー関数
export const getStorageFile = (filePath: string) => {
  try {
    return bucket.file(filePath)
  } catch (error) {
    console.error(`Failed to access storage file ${filePath}:`, error)
    throw error
  }
}

// 署名付きURLの生成
export const getSignedUrl = async (filePath: string, action: 'read' | 'write' = 'read') => {
  try {
    const file = bucket.file(filePath)
    const [url] = await file.getSignedUrl({
      action,
      expires: Date.now() + 15 * 60 * 1000, // 15分後に期限切れ
    })
    return url
  } catch (error) {
    console.error(`Failed to generate signed URL for ${filePath}:`, error)
    throw error
  }
}

// デバッグ用: ファイル存在確認
export const checkFileExists = async (filePath: string) => {
  try {
    const file = bucket.file(filePath)
    const [exists] = await file.exists()
    console.log(`File ${filePath} exists: ${exists}`)
    return exists
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error)
    return false
  }
}
