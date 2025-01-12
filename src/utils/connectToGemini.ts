import { GoogleGenerativeAI } from "@google/generative-ai";

export async function connectToGemini(inputValue: string) {
  try {
    // Ensure API key is available
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined");
    }

    // Initialize the Gemini AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
      Parse the user's command into an EVM-compatible transaction. Identify:
      1. The recipient address (to receive ETH or tokens).
      2. The token contract address for ERC20 transfers (if applicable).
      3. The transfer amount exactly as provided by the user (in human-readable decimal format).
      4. Do not convert the amount to wei; return it as a string in its original format.

      Rules:
      - For ERC20 tokens, assume the token uses 18 decimals unless otherwise specified (no conversion to wei is required).
      - The recipient address must be distinct from the token contract address.
      - Validate the token contract address to ensure it is not a wallet address.
      - Return "INVALID" if the input format is unrecognized.
      - Return "INVALID_ADDRESS" if any address is not a valid EVM address.

      For valid commands, return the output strictly in this JSON format:
      \`{
        "recipientAddress": "0x000...",
        "amount": "0.1",  // Decimal value as provided by the user
        "isERC20": true,
        "tokenAddress": "0x345..." // Null for ETH transfers
      }\`
        `,
    });

    const prompt = inputValue;

    console.log("Sending input to Gemini AI:", prompt);

    const result = await model.generateContent(prompt);

    // Parse the response
    if (result.response) {
      let responseText = result.response.text();

      console.log("Raw response from Gemini AI:", responseText);

      // Check for special cases ("INVALID" or "INVALID_ADDRESS")
      if (responseText === "INVALID" || responseText === "INVALID_ADDRESS") {
        return responseText;
      }

      // Attempt to parse the response as JSON
      try {
        responseText = responseText
          .replaceAll("`", "")
          .replaceAll("json", "")
          .trim();
        const parsedResponse = JSON.parse(responseText);

        return parsedResponse;
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        throw new Error(
          "The response from Gemini AI is not in the expected JSON format"
        );
      }
    } else {
      throw new Error("No response received from Gemini AI");
    }
  } catch (error: unknown) {
    console.error("Error communicating with Gemini AI:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
