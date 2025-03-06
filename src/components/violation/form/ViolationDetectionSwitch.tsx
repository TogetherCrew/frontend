import { FormControl, FormControlLabel, FormHelperText, Switch } from "@mui/material";

interface ViolationDetectionSwitchProps {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}

export function ViolationDetectionSwitch({ isChecked, setIsChecked }: ViolationDetectionSwitchProps) {
  return (
    <FormControl fullWidth>
      <FormControlLabel
        control={
          <Switch
            checked={isChecked}
            onChange={(event) =>
              setIsChecked(event.target.checked)
            }
          />
        }
        label="Violation Detection"
      />
      <FormHelperText>
        Activate/Deactivate the violation detection module.
      </FormHelperText>
    </FormControl>
  );
}
