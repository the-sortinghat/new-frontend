import type { NextApiRequest, NextApiResponse } from "next";
import { System } from "../domain/model";
import { getAllSystems } from "../system_repository";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<System[]>
) {
  res.status(200).json(getAllSystems());
}
