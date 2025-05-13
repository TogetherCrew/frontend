import { useFormContext } from "react-hook-form";

interface ToggleInputProps {
  name: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

export function ToggleInput({
  name,
  label,
  helperText,
  disabled = false,
  required = false,
}: ToggleInputProps) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="form-control w-full">
      <label className="label cursor-pointer justify-start gap-2">
        <input
          type="checkbox"
          className="toggle toggle-success"
          disabled={disabled}
          {...register(name)}
        />
        <span className="label-text">
          {label}
          {required && <span className="text-error">*</span>}
        </span>
      </label>
      {helperText && (
        <label className="label">
          <span className="label-text-alt">{helperText}</span>
        </label>
      )}
      {errors[name] && (
        <label className="label">
          <span className="label-text-alt text-error">{errors[name]?.message as string}</span>
        </label>
      )}
    </div>
  );
} 