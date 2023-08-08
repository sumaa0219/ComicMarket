import { User } from "firebase/auth";
import {
  Firestore,
  collection as _collection,
  doc as _doc,
  getDoc,
  getDocs,
  setDoc
} from "firebase/firestore";
import { getDownloadURL, ref as _ref, uploadBytes, FirebaseStorage } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage } from "./firebase";
import { Circle, CircleWithID, Item, ItemWithID, Userdata, UserdataWithID } from "./types";

function isDev() {
  // return false
  const condition = process.env.NODE_ENV === "development"
  if (condition) {
    console.log("[db] firestore now dev mode")
  }
  return condition
}

function doc(firestore: Firestore, path: string, ...pathSegments: string[]): ReturnType<typeof _doc> {
  return isDev() ? _doc(firestore, "dev_"+path, ...pathSegments) : _doc(firestore, path, ...pathSegments)
}
function collection(firestore: Firestore, path: string, ...pathSegments: string[]): ReturnType<typeof _collection> {
  try {
    return isDev() ? _collection(firestore, "dev_"+path, ...pathSegments) : _collection(firestore, path, ...pathSegments)
  } catch (e) {
    console.error("collection", path, pathSegments, e)
    throw e
  }
}
function ref(storage: FirebaseStorage, url?: string | undefined): ReturnType<typeof _ref> {
  return isDev() ? _ref(storage, "dev_"+url) : _ref(storage, url)
}

/**
 * サークルをDBに追加
 */
export async function addCircle(circle: Circle, admin = false) {
  const id = uuidv4()
  const data = {
    deleted: false,
    ...circle,
  }
  await setDoc(doc(firestore, "circles", id), data)
  return {...data, id}
}

/** サークル情報を更新 */
export const updateCircle = addCircle

/**
 * IDからサークル情報を取得
 * @param id サークルID
 */
export async function getCircle(id: string) {
  const docRef = await getDoc(doc(firestore, "circles", id))
  return {
    ...docRef.data(),
    id: docRef.id,
  } as CircleWithID
}

/**
 * 全てのサークル情報を取得
 */
export async function getAllCircles(): Promise<CircleWithID[]> {
  const data = (await getDocs(collection(firestore, "circles"))).docs.map(doc => ({
    ...(doc.data() as Circle),
    id: doc.id,
  }))
  return data
}

export async function removeCircle(id: string) {
  const circle = await getCircle(id)
  await setDoc(doc(firestore, "circles", id), {
    ...circle,
    deleted: true,
  })
}

/**
 * 購入物をDBに追加
 */
export async function addItem(item: Item): Promise<ItemWithID> {
  const id = uuidv4()
  const data = {
    deleted: false,
    ...item,
  }
  await setDoc(doc(firestore, "items", id), data)
  return {...data, id}
}

/**
 * 購入物に購入者を追加
 */
export async function addBuyer(itemId: string, buyData: Item["users"][0]): Promise<ItemWithID> {
  const itemRef = doc(firestore, "items", itemId)
  const itemDoc = await getDoc(itemRef)
  const itemData = itemDoc.data() as Item
  if (!itemData?.users.find(user => user.uid === buyData.uid)) {
    itemData?.users.push(buyData)
  } else {
    // overwrite
    itemData.users = itemData.users.map(user => user.uid === buyData.uid ? {
      ...buyData,
      // count: parseInt(user.count as unknown as string) + parseInt(buyData.count as unknown as string),
    } : user)
  }
  await setDoc(itemRef, itemData)
  return {
    ...itemData,
    id: itemId,
  }
}

export async function removeBuyer(itemId: string, uid: string) {
  const itemRef = doc(firestore, "items", itemId)
  const itemDoc = await getDoc(itemRef)
  const itemData = itemDoc.data() as Item
  itemData.users = itemData.users.filter(user => user.uid !== uid)
  await setDoc(itemRef, itemData)
  return {
    ...itemData,
    id: itemId,
  }
}

/**
 * 全ての購入物情報を取得
 */
export async function getAllItems(): Promise<ItemWithID[]> {
  const data: ItemWithID[] = (await getDocs(collection(firestore, "items"))).docs.map(doc => ({
    ...(doc.data() as Item),
    id: doc.id,
  }))
  return data
}

/**
 * IDから購入物情報を取得
 * @param id 購入物ID
 */
export async function getItem(id: string) {
  const docRef = await getDoc(doc(firestore, "items", id))
  return {
    ...docRef.data(),
    id: docRef.id,
  }
}

/**
 * ユーザーを追加
 * @returns UID
 */
export async function addUser(user: User, overwrite = false) {
  const userData: Userdata = {
    name: user.displayName ?? user.uid,
    photoURL: user.photoURL ?? "",
  }
  if (!overwrite) {
    const docRef = await getDoc(doc(firestore, "users", user.uid))
    if (docRef.exists()) {
      return user.uid
    }
  }
  await setDoc(doc(firestore, "users", user.uid), userData)
  return user.uid
}

export async function updateUserName(id: string, name: string) {
  const docRef = await getDoc(doc(firestore, "users", id))
  const data = docRef.data() as Userdata
  data.name = name
  await setDoc(doc(firestore, "users", id), data)
  return data
}

/**
 * IDから購入物情報を取得
 * @param id 購入物ID
 */
export async function getUser(id: string): Promise<UserdataWithID> {
  const docRef = await getDoc(doc(firestore, "users", id))
  return {
    ...docRef.data() as Userdata,
    id,
  }
}

/**
 * 全ての購入物情報を取得
 */
export async function getAllUsers(): Promise<UserdataWithID[]> {
  const data = (await getDocs(collection(firestore, "users"))).docs.map(doc => ({
    ...(doc.data() as Userdata),
    id: doc.id,
  }))
  return data
}

/**
 * 画像をfirebase storageにアップロード
 * @returns fullPath
 */
export async function uploadImage(file: File, circleId: string): Promise<string> {
  const imageRef = ref(storage, `/${circleId}/${file.name}`);
  const snapshot = await uploadBytes(imageRef, file)
  return snapshot.ref.fullPath
}

/**
 * ダウンロードURLを取得
 */
export async function getURL(path: string): Promise<string> {
  const url = await getDownloadURL(ref(storage, path))
  return url
}
