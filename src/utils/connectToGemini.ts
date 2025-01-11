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
        1. The recipient address (to receive ETH/tokens).
        2. The token address for ERC20 transfers, if applicable.
        3. The transfer amount in wei.

        Rules:
        - Exclude the sender's wallet address (e.g., "from me") from being treated as recipient or token.
        - Return "INVALID" if the input is invalid or "INVALID_ADDRESS" if any address is not valid EVM.
        - For ERC20 transfers, validate the token address is not a wallet.

        Output strictly in this JSON format:
        \`{"recipientAddress": "0x000...", "amountInWei": 123, "isERC20": true, "tokenAddress": "0x345..." }\`.
      `,
    });

    // Send the user's input as a prompt to the model
    const prompt = inputValue;
    const result = await model.generateContent(prompt);

    // Parse the response
    if (result.response) {
      let responseText = result.response.text();

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
