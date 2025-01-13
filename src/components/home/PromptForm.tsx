import { Form, Input, Button, Spinner } from "@nextui-org/react";

interface PromptFormProps {
  inputValue: string;
  isLoading: boolean; // Loading state to disable form interactions
  onInputChange: (value: string) => void; // Callback for handling input changes
  onSubmit: () => void; // Callback for handling form submission
}

// Functional component for the prompt input form
export const PromptForm: React.FC<PromptFormProps> = ({
  inputValue,
  isLoading,
  onInputChange,
  onSubmit,
}) => {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Form
      className="w-full flex flex-row justify-between items-center gap-3"
      onSubmit={handleFormSubmit}
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
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Ask away! Let’s make magic happen ✨"
      />
      <Button
        size="lg"
        radius="md"
        type="submit"
        color="primary"
        isDisabled={isLoading || !inputValue.trim()} // Disable button when loading or input is empty
      >
        {isLoading ? <Spinner size="sm" color="white" /> : "Go for it 🚀"}
      </Button>
    </Form>
  );
};
