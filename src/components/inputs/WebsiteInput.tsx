import { useEffect } from "react";
import { useFormContext, ValidateResult } from "react-hook-form";

interface WebsiteInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  allowPath?: boolean;
}

export function WebsiteInput({
  name,
  label = "Website / Domain",
  placeholder = "https://example.com",
  helperText,
  required = true,
  allowPath = false,
}: WebsiteInputProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const rawValue = watch(name);

  useEffect(() => {
    if (!rawValue) return;

    let normalized = rawValue.trim();

    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    try {
      const url = new URL(normalized);

      if (!allowPath) {
        url.pathname = "/";
        url.search = "";
        url.hash = "";
      }

      const clean = url.toString().replace(/\/$/, ""); // remove trailing slash
      setValue(name, clean, { shouldValidate: true });
    } catch {
      // leave it alone if not valid
    }
  }, [rawValue, name, setValue, allowPath]);

  const validate = (value: string): ValidateResult | Promise<ValidateResult> => {
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      if (!allowPath && (url.pathname !== "/" || url.search || url.hash)) {
        return "Please enter a root domain only (no path, query, or hash)";
      }
      return true;
    } catch {
      return "Invalid URL format";
    }
  }
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text font-semibold text-xs">{label}</span>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className={`input input-bordered w-full ${errors[name] ? 'input-error' : ''}`}
        {...register(name, { required, validate })}
      />
      {
        helperText && (
          <div className="label">
            <span className="label-text-alt">{helperText}</span>
          </div>
        )
      }
      {
        errors[name] && (
          <div className="label">
            <span className="label-text-alt text-error">{errors[name]?.message as string}</span>
          </div>
        )
      }
    </label >
  );
}
