import { CircleCondition, CircleWithID, circleCondition, circleWithID } from "./types"

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
export function filterDeleted(circle: CircleWithID[]): CircleWithID[]
export function filterDeleted(circle: CircleWithID | CircleWithID[]): boolean | CircleWithID[] {
  if (Array.isArray(circle)) {
    return circle.filter(filterDeleted)
  } else {
    return !circle.deleted
  }
}
