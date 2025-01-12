import { useGeminiHandler } from "@/hooks/useGeminiHandler";
import { ResponseCard } from "./ResponseCard";
import { PromptForm } from "./PromptForm";

export default function HomePage() {
  const { inputValue, isLoading, responses, handleInputChange, handleSubmit } =
    useGeminiHandler();

  return (
    <>
      <main className="w-full max-w-screen-2xl mx-auto flex flex-col justify-center items-center flex-1 text-center">
        <div className="responses-container w-full grid grid-flow-row gap-3 p-4 pb-20 md:px-10">
          {responses &&
            responses.map((response, index) => (
              <ResponseCard key={index} response={response} />
            ))}
        </div>
      </main>

      <footer className="w-full max-w-screen-2xl mx-auto p-4 md:px-10 fixed bottom-0 left-0 right-0 px-4 py-3 bg-transparent flex flex-row justify-between items-center gap-3">
        <PromptForm
          inputValue={inputValue}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </footer>
    </>
  );
}
