import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "./firebase";

/**
 * サークルをDBに追加
 */
export async function addCircle(circle: Circle) {
  // gen uuid
  const id = uuidv4()
  await setDoc(doc(firestore, "circles", id), {
    deleted: false,
    ...circle,
  })
  return id
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
  // console.log(data)
  return data
}
