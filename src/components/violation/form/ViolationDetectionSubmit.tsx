import { CircularProgress } from "@mui/material";
import router from "next/router";

import TcButton from "@/components/shared/TcButton";

interface ViolationDetectionSubmitProps {
  isSubmitting: boolean;
  formError: string | null;
  handleSubmit: () => void;
}

export function ViolationDetectionSubmit({ isSubmitting, formError, handleSubmit }: ViolationDetectionSubmitProps) {
  return (
    <div className="mt-6 flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0">
      <TcButton
        text="Cancel"
        variant="outlined"
        className="md:w-1/4"
        onClick={() => router.push("/community-settings")}
      />
      <TcButton
        text={
          isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Save Changes"
          )
        }
        disabled={isSubmitting || !!formError}
        variant="contained"
        className="md:w-1/4"
        onClick={handleSubmit}
      />
    </div>
  )
}
