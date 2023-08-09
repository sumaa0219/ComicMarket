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

export function getCircleById(id: CircleWithID["id"], circle: CircleWithID[]): CircleWithID | undefined {
  return circle.find(c => c.id === id)
}

export function circleToDatePlaceString(circle: CircleWithID): string {
  return `${circle.day}日目 ${circleWingToString(circle.wing)}${circle.place}`
}
