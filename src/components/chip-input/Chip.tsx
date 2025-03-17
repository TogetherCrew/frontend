import { FaX } from "react-icons/fa6";

interface ChipProps {
  label: string;
  handleRemove: (label: string) => void;
}

function ChipButton({ label, handleRemove }: ChipProps) {
  return (
    <button className="rounded-full px-2 py-2 text-xs hover:bg-white hover:text-red-500" onClick={() => handleRemove(label)}><FaX size={8} /></button>
  )
}

function clean(url: string): string {
  return url.replace(/^(https?:\/\/)/i, '').replace(/\/$/, '');
}



function Chip({ label, handleRemove }: ChipProps) {
  return (
    <div className="flex items-center pl-3 pr-1 py-1 w-fit space-x-2 rounded-full text-xs bg-black bg-gray-100 hover:bg-gray-200 cursor-pointer">
      <span>{clean(label)}</span>
      <ChipButton label={label} handleRemove={handleRemove} />
    </div>
  )
}

export default Chip;