import type { User } from "firebase/auth";
import { z } from "zod";

type WithId<I> = I & { id: string }

export const circle = z.object({
  name: z.string().describe("サークル名"),
  day: z.union([z.literal("1"), z.literal("2")]),
  wing: z.union([z.literal("west"), z.literal("east"), z.literal("south")]),
  place: z.string(),

  menuImagePath: z.string().optional(),
  deleted: z.boolean().optional(),
})
/** サークル */
export type Circle = z.infer<typeof circle>
// export interface Circle {
//   /** サークル名 */
//   name: string;
//   /** サークル出店日 */
//   day: "1" | "2";
//   /** 西とか東とか */
//   wing: "west" | "east" | "south";
//   /** 場所 */
//   place: string;

//   /** お品書き画像 */
//   menuImagePath?: string;
//   /** DB用 : 削除済み */
//   deleted?: boolean;
// }

export const circleWithID = circle.extend({
  id: z.string().uuid().describe("サークルID"),
})
export type CircleWithID = z.infer<typeof circleWithID>
// export interface CircleWithID extends Circle {
//   id: string
// }


export const item = z.object({
  circleId: z.string().uuid().describe("サークルID"),
  name: z.string().describe("商品名"),
  price: z.number().int().positive().describe("価格"),

  users: z.array(z.object({
    uid: z.string().uuid().describe("購入者のUID"),
    count: z.number().int().positive().describe("個数"),
    priority: z.number().int().positive().describe("優先度"),
  })),

  deleted: z.boolean().default(false).optional(),
})

/** 商品 */
// export interface Item {
//   /** サークルID */
//   circleId: string;
//   /** 商品名 */
//   name: string;
//   /** 価格 */
//   price: number;

//   users: {
//     /** 購入者のUID */
//     uid: string;
//     /** 個数 */
//     count: number;
//     /** 優先度 */
//     priority: number;
//   }[];

//   /** DB用 : 削除済み */
//   deleted?: boolean;
// }

export type Item = z.infer<typeof item>

export interface ItemWithID extends Item {
  id: string
}

interface Buy {
  /** サークルID */
  circleId: string;
  /** 商品ID */
  itemId: string;
  /** 購入者のUID */
  uid: string;
  /** 個数 */
  count: number;
  /** 優先度 */
  priority: number;
  /** コメント */
  comment: string;
}

export const circleCondition = z.object({
  name: z.string().default("").describe("サークル名"),
  place: z.string().default("").describe("場所"),
  days: z.object({
    "1": z.boolean(),
    "2": z.boolean(),
  }).default({ "1": true, "2": true }).describe("日付"),
  wings: z.object({
    west: z.boolean(),
    east: z.boolean(),
    south: z.boolean(),
  }).default({ west: true, east: true, south: true }).describe("棟"),
}).describe("サークル検索条件")

export type CircleCondition = z.infer<typeof circleCondition>

export interface Userdata {
  name: string;
  photoURL: NonNullable<User["photoURL"]>;
}

export interface UserdataWithID extends Userdata {
  id: string;
}
