import { System } from "@/types/system";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAllSystems } from "@/api/system_repository";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<System[]>
) {
  res.status(200).json(getAllSystems());
}
