# Blink labs take-home assignment

## Overview
You are to implement a simple frontend app for a natural language web3 assistant, where the user is able to give a simple task, and the site will help the user perform the web3 transaction.
The platform should reject answering any irrelevant questions or command.

## Tech requirements
- The frontend is to be written in NextJS/typescript, and the AI functions are to written as a nextJS api.
- The frontend should make an API call, and the api should respond with relevant instruction to be performed directly on the frontend, as well as a user readable explanation.
- The frontend should authenticate the user through a web3 wallet connect button.

You have flexibility on the specific packages you want to use.
Please include as much comments as possible, to explain what you are trying to achieve.

## Code hint
You may use the following code snippet for interpreting natural language input(`userMessage`) to json web3 instruction, as part of the NextJS api endpoint (free-tier openai API key should be sufficient):
```javascript
import OpenAI from 'openai';
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const completion = await openai.chat.completions.create({
    model: "gpt-3.5",
    messages: [
    {
        role: "system",
        content: `
        interpret the user's command and decode it into evm instruction that is either a native eth transfer or erc20 transfer.
        return "INVALID" if the user's command is invalid or "INVALID_ADDRESS" if the address is not in evm format.
        otherwise, return only in the following json format without any other text:
        \`{"recipient": "0x000...", "amount_in_wei": 123, "isERC20": true, "tokenAddress" :"0x345..." }\``,
    },
    {
        role: "user",
        content: userMessage
    }
    ],
    response_format: { type: "json_object" }
});
const content = completion.choices[0].message.content;
if(content == "INVALID"){
    //TODO
}else if(content == "INVALID_ADDRESS"){
    //TODO
}
const result = JSON.parse(completion.choices[0].message.content);
```

## Evaluation criteria
Since this is an open-ended question, besides the basic functionality of the end-to-end, try to demonstrate your skills and knowledge in writing 
- ways to improve performance of AI code generation,
- *good code structure*, quality and conformance to best practices, 
- considerations for completeness of use-case, 
- production-readiness, and 
- security. 

You will *not* be evaluated on the aesthetic of the frontend, but on having a good code structure that is in-line with *modern nextjs/react best-practices*.

The system is expected to understand simple web3 transfer transaction. Complex routing of multiple transaction swaps, interacting with complex contracts, complicated defi transactions, etc are not expected.

## Some example inputs:

input: send 1 ETH to my friend at address 0xXXXXXXXXXXXXXXX
action: frontend should send 1 ETH from the user's connected wallet to recipient

input: are you a boy
action: frontend should throw an error

input: 0xYYYYYYYYYYYYYYYYY to receive 10 token at 0xZZZZZZZZZZ from me
action: frontend should send 10 0xZZZZZZZZZZ tokens from user's connected wallet to recipient

The instruction payload can be any data format that will be parsed correctly by the frontend to trigger the transaction.

## Submission

Please send us a github repo of your completed assignment.
We will schedule a quick session for you to present your code.
