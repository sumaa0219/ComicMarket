import { getCircle } from "./db"
import { CircleCondition, CircleWithID, ItemWithID, circleCondition, circleWithID } from "./types"

/**
 * サークルが検索条件にマッチするかどうかを判定
 * @param conditionArg 検索条件
 * @param circleArg サークル情報
 */
export function isMatchCondition(conditionArg: CircleCondition, circleArg: CircleWithID): boolean {
  const condition = circleCondition.parse(conditionArg)
  const circleParse = circleWithID.safeParse(circleArg)
  if (!circleParse.success) {
    console.error(circleParse.error, circleArg)
    return false
  }
  const { data: circle } = circleParse
  return (
    (
      condition.name.length === 0 || circle.name.includes(condition.name)
    ) &&
    (
      condition.place.length === 0 || circle.place.includes(condition.place)
    ) &&
    (
      condition.days[circle.day]
    ) &&
    (
      condition.wings[circle.wing]
    ) && (
      condition.excludeDeleted ? !circle.deleted : true
    )
  )
}

export function circleWingToString(wing: "west" | "east" | "south") {
  return ({
    west: "西",
    east: "東",
    south: "南",
  } as const)[wing]
}

/**
 * 削除済みサークルを除外
 */
export function filterDeleted(circle: CircleWithID): boolean
export function filterDeleted(circle: CircleWithID[], enable?: boolean): CircleWithID[]
export function filterDeleted(circle: CircleWithID | CircleWithID[], enable: boolean | undefined = true): boolean | CircleWithID[] {
  if (Array.isArray(circle)) {
    return circle.filter(filterDeleted)
  } else {
    if (enable) {
      return !circle.deleted
    } else {
      return true
    }
  }
}

/**
 * 削除済みサークルの購入物を除外
 */
export async function filterDeletedCircleItem(item: ItemWithID): Promise<boolean>
export function filterDeletedCircleItem(item: ItemWithID, circle: CircleWithID | CircleWithID[]): boolean
export function filterDeletedCircleItem(item: ItemWithID, circle?: CircleWithID | CircleWithID[]): Promise<boolean> | boolean {
  if (Array.isArray(circle)) {
    const cid = item.circleId
    const c = circle.find(c => c.id === cid)
    if (c) {
      return filterDeletedCircleItem(item, c)
    } else {
      throw new Error(`circle not found: ${cid}`)
    }
  } else if (circle) {
    return filterDeleted(circle)
  } else {
    return getCircle(item.circleId).then(c => filterDeleted(c))
  }
}

/**
 * サークルIDからサークル情報を取得
 */
export function getCircleById(id: CircleWithID["id"], circle: CircleWithID[]): CircleWithID | undefined {
  return circle.find(c => c.id === id)
}

/**
 * サークル情報を日付と場所に変換
 */
export function circleToDatePlaceString(circle: CircleWithID): string {
  return `${circle.day}日目 ${circleWingToString(circle.wing)}${circle.place}`
}

/**
 * サークルを日付と場所でソート
 */
export function sortCircleByDP(circles: CircleWithID[]): CircleWithID[] {
  return circles.sort((a, b) => {
    return (a && b)
      ? circleToDatePlaceString(a).localeCompare(circleToDatePlaceString(b))
      : 0
  })
}

/**
 * 購入物をサークルの日付と場所でソート
 */
export function sortItemByDP(items: ItemWithID[], circles: CircleWithID[]): ItemWithID[] {
  return items.sort((a, b) => {
    const circlesCompare = {
      a: getCircleById(a.circleId, circles),
      b: getCircleById(b.circleId, circles)
    }
    return (circlesCompare.a && circlesCompare.b)
      ? circleToDatePlaceString(circlesCompare.a).localeCompare(circleToDatePlaceString(circlesCompare.b))
      : 0
  })
}

/**
 * 購入物を購入者の優先度でソート
 */
export function sortItemByPriority(items: ItemWithID[], uid: ItemWithID["users"][0]["uid"], reverse = false): ItemWithID[] {
  return items.sort((a, b) => {
    const usersF = {
      a: a.users.find(u => u.uid === uid),
      b: b.users.find(u => u.uid === uid)
    }
    return (usersF.a && usersF.b)
      ? reverse
        ? usersF.a.priority - usersF.b.priority
        : usersF.b.priority - usersF.a.priority
      : 0
  })
}

/**
 * 
 */
export function filterItemsByCircles(items: ItemWithID[], circles: CircleWithID[]): ItemWithID[] {
  return items.filter(i => circles.map(c => i.circleId === c.id).includes(true))
  // return items.filter(i => {
  //   const circle = getCircleById(i.circleId, circles)
  //   return !!circle
  // })
}
