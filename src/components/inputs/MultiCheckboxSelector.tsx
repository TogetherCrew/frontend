import { useFormContext } from "react-hook-form";

interface Option {
  label: string;
  value: string | number;
  description?: string;
}

interface MultiCheckboxSelectorProps {
  name: string;
  options: Option[];
  label?: string;
  helperText?: string;
}


export function MultiCheckboxSelector({ name, options, label, helperText }: MultiCheckboxSelectorProps) {
  const { watch, setValue } = useFormContext();
  const selected = watch(name) || [];

  const toggle = (value: string | number) => {
    const newValue = selected.includes(value)
      ? selected.filter((v: string | number) => v !== value)
      : [...selected, value];
    setValue(name, newValue, { shouldValidate: true });
  };

  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text font-semibold text-xs">{label}</span>
        </label>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {options.map((opt, i) => (
          <label
            key={i}
            className="flex text-xs items-start gap-2 cursor-pointer p-2  rounded-lg hover:bg-base-200 transition"
          >
            <input
              type="checkbox"
              className="checkbox checkbox-xs"
              checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)}
            />
            <div>
              <span className="font-medium">{opt.label}</span>
              {opt.description && (
                <p className="text-xs text-base-content/70">{opt.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {helperText && (
        <label className="label">
          <span className="label-text-alt">{helperText}</span>
        </label>
      )}
    </div>
  );
}
