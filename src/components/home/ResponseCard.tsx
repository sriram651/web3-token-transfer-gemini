import { GeminiResponse } from "@/hooks/useGeminiHandler";
import TransactionSuccessful from "@/components/TransactionSuccessful";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";

interface ResponseCardProps {
  response: GeminiResponse; // Response data to display in the card
}

// Component to display AI responses in a styled card
export const ResponseCard: React.FC<ResponseCardProps> = ({ response }) => {
  if (!response) return null; // Render nothing if the response is null

  return (
    <Card className="w-full max-w-4xl text-lg font-semibold text-left px-4 py-2">
      <ResponseCardHeader timestamp={response.timestamp} />

      <ResponseCardBody response={response} />
    </Card>
  );
};

function ResponseCardHeader({ timestamp }: { timestamp: string }) {
  return (
    <CardHeader className="w-full border-b-2 border-default">
      <div className="w-full flex justify-start items-center gap-2 text-lg font-semibold text-left">
        <Image
          src="/gemini-logo.png"
          alt="Gemini AI"
          width={45}
          height={45}
          className="rounded-full"
        />

        <div className="w-max flex flex-col items-start justify-center gap-0">
          <h3 className="text-xl font-semibold">Gemini</h3>
          <p className="text-xs font-light">{timestamp}</p>
        </div>
      </div>
    </CardHeader>
  );
}

function ResponseCardBody({ response }: { response: GeminiResponse }) {
  return (
    <CardBody>
      <div className="w-full text-lg font-semibold text-left">
        <p className="w-full text-base font-normal text-left">
          {response.text}
          {response.url && (
            <>
              {" "}
              <TransactionSuccessful url={response.url} />
            </>
          )}
        </p>
      </div>
    </CardBody>
  );
}
