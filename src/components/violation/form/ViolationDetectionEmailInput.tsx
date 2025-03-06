import { useState } from "react";
import { Autocomplete, Chip, FormControl, FormHelperText, FormLabel, TextField } from "@mui/material";

interface ViolationDetectionEmailInputProps {
  selectedEmails: string[];
  setSelectedEmails: (emails: string[]) => void;
  setFormError: (error: string | null) => void;
}

export function ViolationDetectionEmailInput({ selectedEmails, setSelectedEmails, setFormError }: ViolationDetectionEmailInputProps) {

  const [emailError, setEmailError] = useState<string | null>(null);

  const setErrors = (error: string | null) => {
    setEmailError(error)
    setFormError(error)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event: any, newValue: string[] | null) => {
    if (newValue) {
      const invalidEmail = newValue.find((email) => !validateEmail(email));
      if (invalidEmail) {
        setErrors(`Invalid email: ${invalidEmail}`);
      } else {
        setErrors(null);
        setSelectedEmails(newValue);
      }
    }
  };

  return (
    <FormControl fullWidth error={!!emailError}>
      <FormLabel>Moderator Emails</FormLabel>
      <Autocomplete
        multiple
        freeSolo
        value={selectedEmails}
        onChange={handleEmailChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label="Moderator Emails"
            placeholder="Enter Moderator Emails"
            error={!!emailError}
            helperText={
              emailError || "Enter valid moderator emails."
            }
          />
        )}
        options={[]}
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "4px",
                borderColor: "#D1D1D1",
                backgroundColor: "white",
                color: "black",
              }}
            />
          ));
        }}
      />
      <FormHelperText>
        Enter the email addresses of the moderators who should be
        notified when a violation is detected.
      </FormHelperText>
    </FormControl>
  );
}