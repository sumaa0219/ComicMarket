import { getAllItems } from "@/lib/db";
import { ItemWithID } from '@/lib/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  [key: string]: ItemWithID
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const items = await getAllItems();

  const itemRes = Object.fromEntries(items.map((item) => [item.id, item]));
  res
    .status(200)
    .json(itemRes)
}