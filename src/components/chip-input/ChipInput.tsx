import { useState } from "react";
import { Button } from "@mui/material";
import { BsPlus } from "react-icons/bs";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

interface ChipInputProps {
  handleAdd: (input: string) => void;
}

function ChipInput({ handleAdd }: ChipInputProps) {
  const [input, setInput] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateUrl = (url: string): boolean => {
    const urlRegex = /^(https?:\/\/)([\w.-]+)(\.[a-zA-Z]{2,})(:\d+)?(\/[^\s]*)?$/;
    const isValidUrl = urlRegex.test(url);
    setIsValid(isValidUrl);
    return isValidUrl;
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    // validateUrl(value);
  }

  const handleAddClick = () => {
    if (validateUrl(input)) {
      handleAdd(input);
      setInput('');
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddClick();
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="w-1/2 flex gap-2 items-center bg-gray-200 rounded-full py-2 px-4 border focus-within:border-green-500 focus-within:bg-white">
        {/* <BiSearch className="text-gray-400 text-md" /> */}
        <input type="text" placeholder="https://example.com" className="w-full bg-transparent rounded-lg focus:outline-none text-sm pl-1" value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} />
        {isValid ? <FaCheckCircle className="text-green-500" /> : <FaExclamationCircle className="text-gray-500" />}
      </div>
      <Button
        variant="contained"
        color="primary"
        className="px-5 py-2 rounded-full flex gap-1 items-center hover:opacity-80 shadow-none"
        onClick={handleAddClick}>
        <BsPlus className="text-lg" />
        <span>Add</span>
      </Button>
    </div>
  )
}

export default ChipInput;