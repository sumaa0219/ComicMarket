import { User } from "firebase/auth";
import {
  type Firestore,
  collection as _collection,
  doc as _doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from "firebase/firestore";
import { getDownloadURL, ref as _ref, uploadBytes, type FirebaseStorage } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage } from "./firebase";
import { Circle, CircleWithID, Item, ItemWithID, Userdata, UserdataWithID, circle, circleWithID, item, itemWithID } from "./types";
import { z } from "zod";

function isDev() {
  return false
  const condition = process.env.NODE_ENV === "development"
  if (condition) {
    console.log("[db] firestore now dev mode")
  }
  return condition
}

async function measure<R>(func: () => Promise<R>, name: string): Promise<R> {
  const start = Date.now()
  const result = await func()
  console.log(`[db] [${name}] took ${Date.now() - start}ms`)
  return result
}

function doc(firestore: Firestore, path: string, ...pathSegments: string[]): ReturnType<typeof _doc> {
  return _doc(firestore, (isDev() ? "dev_" : "") + path, ...pathSegments)
}
function collection(firestore: Firestore, path: string, ...pathSegments: string[]): ReturnType<typeof _collection> {
  try {
    return _collection(firestore, (isDev() ? "dev_" : "") + path, ...pathSegments)
  } catch (e) {
    console.error("collection", path, pathSegments, e)
    throw e
  }
}
function ref(storage: FirebaseStorage, url?: string | undefined): ReturnType<typeof _ref> {
  // \/?(dev_)?[URL] -> [URL]
  const pureURL = url?.match(/\/?(dev_)?(.*)/)?.[2]
  return _ref(storage, "/" + (isDev() ? "dev_" : "") + pureURL)
}

/**
 * サークルをDBに追加
 */
export async function addCircle(circleArg: Circle, id: string = uuidv4()) {
  const pCircle = circle.parse(circleArg)
  if (!id) {
    id = uuidv4()
  }
  const data = {
    deleted: false,
    ...pCircle,
  }
  await setDoc(doc(firestore, "circles", id), data)
  return { ...data, id }
}

/** サークル情報を更新 */
export const updateCircle = addCircle

/**
 * IDからサークル情報を取得
 * @param id サークルID
 */
export async function _getCircle(id: string) {
  const docRef = await getDoc(doc(firestore, "circles", id))

  const data = circleWithID.parse({
    ...docRef.data(),
    id: docRef.id,
  })
  console.log("getCircle", data)
  return data
}

export const getCircle = (id: string) => measure(() => _getCircle(id), `getCircle:${id}`)

/**
 * 全てのサークル情報を取得
 */
export async function _getAllCircles(): Promise<CircleWithID[]> {
  const data = (await getDocs(collection(firestore, "circles"))).docs.map(doc => ({
    ...(doc.data() as Circle),
    id: doc.id,
  }))
  return data
}

export const getAllCircles = () => measure(_getAllCircles, "getAllCircles")

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
export async function addItem(itemArg: Item, idArg?: string): Promise<ItemWithID> {
  const pItem = item.parse(itemArg)

  const id = idArg ?? uuidv4()
  const data = {
    deleted: false,
    ...pItem,
  }
  await setDoc(doc(firestore, "items", id), data)
  return { ...data, id }
}

export const updateItem = addItem

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

export async function updatePriority(itemId: ItemWithID["id"], userId: string, priorityArg: Item["users"][0]["priority"]) {
  const priority = z.number().min(1).max(5).parse(priorityArg)
  const itemRef = doc(firestore, "items", itemId)
  const itemDoc = await getDoc(itemRef)
  const itemData = item.parse(itemDoc.data())
  itemData.users = itemData.users.map(user => user.uid === userId ? {
    ...user,
    priority,
  } : user)
  await setDoc(itemRef, itemData)
}

/**
 * 全ての購入物情報を取得
 */
export async function _getAllItems(circleId?: Item["circleId"]): Promise<ItemWithID[]> {
  if (circleId) {
    const data: ItemWithID[] = (await getDocs(query(collection(firestore, "items"), where("circleId", "==", circleId)))).docs.map(doc => ({
      ...(doc.data() as Item),
      id: doc.id,
    }))
    return data
  } else {
    const data: ItemWithID[] = (await getDocs(collection(firestore, "items"))).docs.map(doc => ({
      ...(doc.data() as Item),
      id: doc.id,
    }))
    return data
  }
}

export const getAllItems = (circleId?: Item["circleId"]) => measure(() => _getAllItems(circleId), "getAllItems")

/**
 * IDから購入物情報を取得
 * @param id 購入物ID
 */
export async function getItem(id: string): Promise<ItemWithID> {
  const docRef = await getDoc(doc(firestore, "items", id))
  return itemWithID.parse({
    ...docRef.data(),
    id: docRef.id,
  })
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
export async function _getUser(id: string): Promise<UserdataWithID> {
  const docRef = await getDoc(doc(firestore, "users", id))
  return {
    ...docRef.data() as Userdata,
    id,
  }
}

export const getUser = (id: string) => measure(() => _getUser(id), "getUser")

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
