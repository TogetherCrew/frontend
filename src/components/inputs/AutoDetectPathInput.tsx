import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface AutoDetectPathInputProps {
  name: string;
  baseUrl?: string;
  guessPaths: string[];
  detectTest: (fullUrl: string) => Promise<boolean>;
  label?: string;
  helperText?: string;
}

export function AutoDetectPathInput({
  name,
  baseUrl,
  guessPaths,
  detectTest,
  label = "API Path",
  helperText,
}: AutoDetectPathInputProps) {
  const { register, setValue, watch } = useFormContext();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "fail">("idle");
  const currentValue = watch(name);

  useEffect(() => {
    if (!baseUrl) return;

    const tryDetect = async () => {
      setStatus("loading");
      for (const path of guessPaths) {
        const fullUrl = new URL(path, baseUrl).toString();
        const isValid = await detectTest(fullUrl);
        if (isValid) {
          setValue(name, path, { shouldValidate: true });
          setStatus("success");
          return;
        }
      }
      setStatus("fail");
    };

    tryDetect();
  }, [baseUrl]);

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-semibold text-xs">{label}</span>
        {status === "loading" && <span className="loading loading-spinner loading-xs ml-2" />}
        {status === "success" && <span className="text-success text-xs ml-2">Detected</span>}
        {status === "fail" && <span className="text-error text-xs ml-2">Failed</span>}
      </label>
      <input
        type="text"
        placeholder="/w/api.php"
        className="input input-bordered w-full"
        {...register(name, { required: true })}
        defaultValue={currentValue}
        disabled={status === "success" || status === "loading"}
      />
      {helperText && (
        <label className="label">
          <span className="label-text-alt">{helperText}</span>
        </label>
      )}
      {status === "fail" && (
        <label className="label">
          <span className="label-text-alt text-warning">Couldn't auto-detect. Please enter manually.</span>
        </label>
      )}
    </div>
  );
}
