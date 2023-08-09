import { z } from "zod";

export const circle = z.object({
  name: z.string().nonempty().describe("サークル名"),
  day: z.union([z.literal("1"), z.literal("2")]),
  wing: z.union([z.literal("west"), z.literal("east"), z.literal("south")]),
  place: z.string().nonempty(),

  menuImagePath: z.string().optional(),
  deleted: z.boolean().default(false).optional(),
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
  name: z.string().nonempty().describe("商品名"),
  price: z.number().int().min(0).describe("価格"),

  users: z.array(z.object({
    uid: z.string().describe("購入者のUID"),
    count: z.number().int().positive().describe("個数"),
    priority: z.number().int().positive().describe("優先度"),
  })).default([]).describe("購入者"),

  deleted: z.boolean().default(false).optional(),
})

export type Item = z.infer<typeof item>

export const itemWithID = item.extend({
  id: z.string().uuid().describe("商品ID"),
})
export type ItemWithID = z.infer<typeof itemWithID>

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
  excludeDeleted: z.boolean().default(true).describe("削除済みを除外するか"),
}).describe("サークル検索条件")

export type CircleCondition = z.infer<typeof circleCondition>

export const userdata = z.object({
  name: z.string().describe("ユーザー名"),
  photoURL: z.string().url().describe("プロフィール画像URL"),
})

export type Userdata = z.infer<typeof userdata>

export const userdataWithID = userdata.extend({
  id: z.string().uuid().describe("ユーザーID"),
})
export type UserdataWithID = z.infer<typeof userdataWithID>
