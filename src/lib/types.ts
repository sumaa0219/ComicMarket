/** サークル */
interface Circle {
  /** サークル名 */
  name: string;
  /** サークル出店日 */
  day: "1" | "2";
  /** 西とか東とか */
  wing: "west" | "east" | "south";
  /** 場所 */
  place: string;

  /** DB用 : 削除済み */
  deleted?: boolean;
}

interface CircleWithID extends Circle {
  id: string
}

/** 購入物 */
interface Item {
  /** サークルID */
  circleId: string;
  /** 商品名 */
  name: string;
  /** 価格 */
  price: number;
  /** 個数 */
  count: number;
  /** 優先度 */
  priority: number;

  /** DB用 : 購入物ID */
  id?: string;
  /** DB用 : 削除済み */
  deleted?: boolean;
}
