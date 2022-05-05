import type { NextApiRequest, NextApiResponse } from "next";

type Data = { id: number; name: string; description: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  res.status(200).json([
    {
      id: 1,
      name: "InterSCity",
      description:
        "InterSCity platform, an open-source, microservices-based middleware to support the development of smart city applications and to enable novel, reproducible research, and experiments in this field.",
    },
  ]);
}
