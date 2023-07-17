import type { User } from "firebase/auth";

type WithId<I> = I & { id: string }

/** サークル */
export interface Circle {
  /** サークル名 */
  name: string;
  /** サークル出店日 */
  day: "1" | "2";
  /** 西とか東とか */
  wing: "west" | "east" | "south";
  /** 場所 */
  place: string;

  /** お品書き画像 */
  menuImagePath?: string;
  /** DB用 : 削除済み */
  deleted?: boolean;
}

export interface CircleWithID extends Circle {
  id: string
}

/** 商品 */
export interface Item {
  /** サークルID */
  circleId: string;
  /** 商品名 */
  name: string;
  /** 価格 */
  price: number;

  users: {
    /** 購入者のUID */
    uid: string;
    /** 個数 */
    count: number;
    /** 優先度 */
    priority: number;
  }[];

  /** DB用 : 購入物ID */
  id?: string;
  /** DB用 : 削除済み */
  deleted?: boolean;
}

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

/** サークル検索条件 */
export interface CircleCondition {
  name: string;
  place: string;
  days: {
    "1": boolean;
    "2": boolean;
  };
  wings: {
    west: boolean;
    east: boolean;
    south: boolean;
  };
}

export interface Userdata {
  name: string;
  photoURL: NonNullable<User["photoURL"]>;
}

export interface UserdataWithID extends Userdata {
  id: string;
}
