import { useState } from "react";
import { BiSearch } from "react-icons/bi";

export default function SearchWrapper({ debouncedFetchCommunities }: { debouncedFetchCommunities: (value: string) => void }) {

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`w-full sm:w-1/2 flex gap-2 items-center bg-gray-200 rounded-full py-2 px-4 border focus-within:border-green-500 focus-within:bg-white ${isFocused ? 'hover:border-green-500' : 'hover:border-gray-500'}`}>
      <BiSearch className="text-gray-400 text-md" />
      <input type="text" placeholder="Search for a community" className="w-full bg-transparent rounded-lg focus:outline-none text-sm pl-1" onFocus={() => setIsFocused(!isFocused)} onBlur={() => setIsFocused(!isFocused)} onChange={(e) => debouncedFetchCommunities(e.target.value)} />
    </div>
  );
}

