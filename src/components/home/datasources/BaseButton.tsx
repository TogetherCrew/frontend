export default function BaseButton({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <button className="text-xs text-slate-400 font-semibold bg-gray-100 hover:text-slate-700 px-4 py-2 rounded-full w-20" onClick={onClick}>{children}</button>
  );
}