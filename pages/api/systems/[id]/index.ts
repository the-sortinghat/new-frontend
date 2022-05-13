import type { NextApiRequest, NextApiResponse } from "next";
import { System } from "../../../../types/system";
import { findSystemById } from "../../system_repository";

type ErrorMessage = { error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<System | ErrorMessage>
) {
  const id = req.query.id as unknown as string;
  const system = findSystemById(parseInt(id));

  if (!system) {
    res.status(404).json({ error: `system with id ${id} not found.` });
    return;
  }

  res.status(200).json(system);
}
