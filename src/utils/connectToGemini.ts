import { GoogleGenerativeAI } from "@google/generative-ai";

// Connect to Gemini AI and process the user's input to generate an EVM-compatible transaction
export async function connectToGemini(inputValue: string) {
  try {
    // Retrieve the Gemini AI API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Define the generative model configuration along with the system instruction to set the context of the application.
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
      {
        "recipientAddress": "0x000...",
        "amount": "0.1",  // Decimal value as provided by the user
        "isErc20": true,
        "tokenAddress": "0x345..." // Null for ETH transfers
      }
        `,
    });

    const prompt = inputValue;

    // Send the user input to Gemini AI for processing
    const result = await model.generateContent(prompt);

    if (result.response) {
      let responseText = result.response.text();

      // Handle special responses for invalid input or invalid addresses
      if (
        responseText.includes("INVALID") ||
        responseText.includes("INVALID_ADDRESS")
      ) {
        throw new Error(
          "Invalid input. Please provide a valid transaction request command."
        );
      }

      try {
        // Clean and parse the JSON response from Gemini AI
        responseText = responseText
          .replaceAll("`", "")
          .replaceAll("json", "")
          .trim();
        const parsedResponse = JSON.parse(responseText);

        return parsedResponse;
      } catch {
        // Throw an error if the response is not in the expected JSON format
        throw new Error(
          "The response from Gemini AI is not in the expected JSON format"
        );
      }
    } else {
      // Handle cases where no response is received
      throw new Error("No response received from Gemini AI");
    }
  } catch (error: unknown) {
    // Handle and rethrow any errors during the process
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
