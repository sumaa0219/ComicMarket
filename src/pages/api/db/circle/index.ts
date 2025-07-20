import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllCircles } from "@/lib/db";
import { CircleWithID } from '@/lib/types';

type ResponseData = {
  [key: string]: CircleWithID
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const circles = await getAllCircles();

  const circleRes = Object.fromEntries(circles.map((circle) => [circle.id, circle]));
  res
    .status(200)
    .json(circleRes)
}