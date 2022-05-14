import { SystemMetrics } from "@/types/system";
import type { NextApiRequest, NextApiResponse } from "next";
import { findSystemById, getSystemMetrics } from "@/api/system_repository";

type ErrorMessage = { error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SystemMetrics | ErrorMessage>
) {
  const id = req.query.id as unknown as string;
  const system = findSystemById(parseInt(id));

  if (!system) {
    res.status(404).json({ error: `system with id ${id} not found.` });
    return;
  }

  res.status(200).json(getSystemMetrics(parseInt(id))!);
}
