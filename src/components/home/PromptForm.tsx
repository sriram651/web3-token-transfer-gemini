import { Form, Input, Button, Spinner } from "@nextui-org/react";

interface PromptFormProps {
  inputValue: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

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
  );
};
