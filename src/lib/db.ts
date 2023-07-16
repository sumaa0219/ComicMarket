import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "./firebase";
import { User } from "firebase/auth";
import { Circle, CircleWithID, Item, ItemWithID, Userdata, UserdataWithID } from "./types";

/**
 * サークルをDBに追加
 */
export async function addCircle(circle: Circle) {
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
  return docRef.data()
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
      count: parseInt(user.count as unknown as string) + parseInt(buyData.count as unknown as string),
    } : user)
  }
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
  return docRef.data()
}

/**
 * 購入物をDBに追加
 * @returns UID
 */
export async function addUser(user: User) {
  const userData: Userdata = {
    name: user.displayName ?? user.uid,
    photoURL: user.photoURL ?? "",
  }
  await setDoc(doc(firestore, "users", user.uid), userData)
  return user.uid
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