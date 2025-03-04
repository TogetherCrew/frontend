import Chip from "./Chip";
import ChipInput from "./ChipInput";

interface ChipListProps {
  items: string[];
  handleChange: (items: string[]) => void;
}

function ChipList({ items, handleChange }: ChipListProps) {

  const handleAdd = (item: string) => {
    handleChange([...items, item]);
  }

  const handleRemove = (item: string) => {
    handleChange(items.filter((url) => url !== item));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Chip key={item} label={item} handleRemove={handleRemove} />
        ))}
      </div>
      <ChipInput handleAdd={handleAdd} />
    </div>
  )
}

export default ChipList;
