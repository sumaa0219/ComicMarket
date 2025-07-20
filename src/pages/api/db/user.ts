import { getAllUsers } from "@/lib/db";
import { UserdataWithID } from '@/lib/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  [key: string]: UserdataWithID
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const users = await getAllUsers();

  const userRes = Object.fromEntries(users.map((user) => [user.id, user]));
  res
    .status(200)
    .json(userRes)
}