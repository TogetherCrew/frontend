import Chip from "./Chip";
import ChipInput from "./ChipInput";

interface ChipListProps {
  items: string[];
  handleChange: (items: string[]) => void;
}

function ChipList({ items, handleChange }: ChipListProps) {

  const handleAdd = (item: string) => {
    // check if the item is already in the list
    console.log(items, item);
    if (items.includes(item) || item === '') {
      return;
    }
    handleChange([...items, item]);
  }

  const handleRemove = (item: string) => {
    handleChange(items.filter((url) => url !== item));
  }

  return (
    <div className="flex flex-col gap-2">
      <ChipInput handleAdd={handleAdd} />
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Chip key={item} label={item} handleRemove={handleRemove} />
        ))}
      </div>
    </div>
  )
}

export default ChipList;
