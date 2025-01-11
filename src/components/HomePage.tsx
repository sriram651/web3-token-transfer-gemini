import { useCallback, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const getCurrentDateTime = useCallback(() => {
    const date = new Date();

    const day = date.toLocaleString("en-US", { day: "2-digit" });

    const month = date.toLocaleString("en-US", { month: "short" });

    const year = date.toLocaleString("en-US", { year: "numeric" });

    const time = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${day} ${month} ${year} ${time}`;
  }, [response]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim()) {
      setIsLoading(true);
      setResponse(""); // Clear any previous responses
      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: inputValue }),
        });
        const { data, success } = await res.json();
        console.log(data);
        if (success) {
          setResponse(
            `Please wait while we initiate the ${
              data.isERC20 ? "ERC20" : "ETH"
            } transfer to ${data.recipientAddress}`
          );
        } else {
          setResponse("Invalid input or error processing your request.");
        }
      } catch (error) {
        console.error("Error:", error);
        setResponse("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
        setInputValue("");
      }
    }
  };

  return (
    <>
      <main className="w-full max-w-screen-2xl mx-auto flex flex-col justify-center items-center flex-1 text-center">
        <div className="responses-container w-full grid grid-flow-row gap-3 p-4 pb-20 md:px-10">
          {response && (
            <Card className="w-full max-w-4xl text-lg font-semibold text-left px-4 py-2">
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
                    <p className="text-xs font-light">{getCurrentDateTime()}</p>
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                <div className="w-full text-lg font-semibold text-left">
                  <p className="w-full text-base font-normal text-left">
                    {response}
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </main>

      <footer className="w-full max-w-screen-2xl mx-auto p-4 md:px-10 fixed bottom-0 left-0 right-0 px-4 py-3 bg-transparent flex flex-row justify-between items-center gap-3">
        <Form
          className="w-full flex flex-row justify-between items-center gap-3"
          onSubmit={handleSubmit}
        >
          <Input
            fullWidth
            size="lg"
            radius="md"
            isClearable
            variant="flat"
            color="default"
            value={inputValue}
            isDisabled={isLoading}
            onChange={handleInputChange}
            placeholder="Type your query and press Enter"
          />
          <Button
            size="lg"
            radius="md"
            type="submit"
            color="primary"
            isDisabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? <Spinner size="sm" color="white" /> : "Submit"}
          </Button>
        </Form>
      </footer>
    </>
  );
};

export default HomePage;
