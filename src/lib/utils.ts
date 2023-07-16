import { CircleCondition, CircleWithID } from "./types"

export function isMatchCondition(condition: CircleCondition, data: CircleWithID): boolean {
  return (
    Object.keys(condition).length >= 4 &&
    (
      condition.name.length === 0 || data.name.includes(condition.name)
    ) &&
    (
      condition.days[data.day]
    ) &&
    (
      condition.wings[data.wing]
    ) &&
    (
      condition.place.length === 0 || data.place.includes(condition.place)
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