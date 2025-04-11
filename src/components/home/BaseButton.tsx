export default function BaseButton({ children, onClick, disabled }: { children: React.ReactNode, onClick: () => void, disabled: boolean }) {
  return (
    <button className="text-xs text-slate-400 font-semibold bg-gray-100 hover:text-slate-700 px-4 py-2 rounded-full w-20" onClick={onClick} disabled={disabled}>{children}</button>
  );
}