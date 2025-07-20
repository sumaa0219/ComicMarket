import type { CircleWithID, ItemWithID } from "@/lib/types";
import { createContext } from "react";

interface CircleItemContextValue {
  circles: CircleWithID[],
  items: ItemWithID[],
  addNewCircle: (circle: CircleWithID) => void,
  addNewItem: (item: ItemWithID) => void,
}
export const CircleItemContext = createContext<CircleItemContextValue>({
  circles: [],
  items: [],
  addNewCircle: () => { },
  addNewItem: () => { },
})
