import { useGeminiHandler } from "@/hooks/useGeminiHandler";
import { ResponseCard } from "./ResponseCard";
import { PromptForm } from "./PromptForm";

export default function HomePage() {
  return (
    <>
      <main className="w-full max-w-screen-2xl mx-auto flex flex-col justify-center items-center flex-1 text-center">
        <ResponseList />
      </main>

      <Footer />
    </>
  );
}

function ResponseList() {
  const { responses } = useGeminiHandler();

  return (
    <div className="w-full max-w-4xl flex flex-col justify-center items-center gap-4 p-4">
      {responses.map((response, index) => (
        <ResponseCard key={index} response={response} />
      ))}
    </div>
  );
}

function Footer() {
  const { inputValue, isLoading, handleInputChange, handleSubmit } =
    useGeminiHandler();

  return (
    <footer className="w-full max-w-screen-2xl mx-auto p-4 md:px-10 fixed bottom-0 left-0 right-0 px-4 py-3 bg-transparent flex flex-row justify-between items-center gap-3">
      <PromptForm
        inputValue={inputValue}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </footer>
  );
}
