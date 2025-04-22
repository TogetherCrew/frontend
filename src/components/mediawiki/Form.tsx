import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";

import { AutoDetectPathInput } from "../inputs/AutoDetectPathInput";
import { WebsiteInput } from "../inputs/WebsiteInput";
type FormValues = {
  baseUrl: string;
};

export default function MediaWikiForm() {
  const methods = useForm<FormValues>({
    defaultValues: {
      baseUrl: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        <WebsiteInput
          name="baseUrl"
          label="MediaWiki Domain"
          allowPath={false}
          placeholder="e.g., wikipedia.org"
          helperText="Please enter the root domain of your MediaWiki instance."
        />
        <AutoDetectPathInput
          name="path"
          label="API Path"
          baseUrl={methods.getValues("baseUrl")}
          guessPaths={["/w/api.php", "/api.php"]}
          detectTest={(url: string) => fetch(url).then((res) => res.ok)}
          helperText="Please enter the path to the MediaWiki API."
        />

        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </FormProvider>
  );
}
