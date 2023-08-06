import { CircleCondition, CircleWithID, circleCondition, circleWithID } from "./types"

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
      condition.name.length !== 0 && circle.name.includes(condition.name)
    ) &&
    (
      condition.days[circle.day]
    ) &&
    (
      condition.wings[circle.wing]
    ) &&
    (
      condition.place.length !== 0 && circle.place.includes(condition.place)
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