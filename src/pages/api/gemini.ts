import { connectToGemini } from "@/utils/connectToGemini";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { input } = req.body;

  // Validate the input (must be a non-empty string)
  if (!input || typeof input !== "string") {
    return res.status(400).json({ success: false, message: "Invalid Input" });
  }

  try {
    // Connect to the Gemini AI API using the utils function and return its response.
    const response = await connectToGemini(input);

    // Return the AI-generated response
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
