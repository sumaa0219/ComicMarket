/**
 * サークルごとに最も優先度の高い購入者
 */

import { getAllCircles, getAllItems } from "@/lib/db";
import { CircleWithID } from '@/lib/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = /*{
  [x: string]: */{
    circleId: string;
    itemId: string;
    uid: string;
    count: number;
    priority: number;
  }[]
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const circles = await getAllCircles();
  const items = await getAllItems();
  const data = (circles.flatMap(circle => {
    /** そのサークルの購入物 */
    const circleItems = items.filter(item => item.circleId === circle.id)
    /** そのサークルの購入物の最高優先度の購入者 */
    const circleItemUsers = circleItems.flatMap(item => {
      /** その購入物の最高優先度の購入者 */
      const mostHighPriorityUser = item.users.sort((a, b) => a.priority - b.priority)[0]
      return {
        ...mostHighPriorityUser,
        circleId: circle.id,
        itemId: item.id,
      }
    })
    /** そのサークルの最高優先度の購入者 */
    const mostHighPriorityUser = circleItemUsers.sort((a, b) => a.priority - b.priority)[0]
    return mostHighPriorityUser
  }))
  // const resData = Object.fromEntries(data.map(d => [
  //   d.circleId,
  //   d
  // ]))

  res
    .status(200)
    .json(data)
}