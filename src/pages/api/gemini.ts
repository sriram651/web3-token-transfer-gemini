import { connectToGemini } from "@/utils/connectToGemini";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { input } = req.body;

  if (!input || typeof input !== "string") {
    return res.status(400).json({ success: false, message: "Invalid Input" });
  }

  try {
    const response = await connectToGemini(input);

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Error communicating with Gemini AI:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
