import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { AutoDetectPathInput } from "../inputs/AutoDetectPathInput";
import { MultiCheckboxSelector } from "../inputs/MultiCheckboxSelector";
import { WebsiteInput } from "../inputs/WebsiteInput";
type FormValues = {
  baseUrl: string;
  path: string;
  namespaces: any[];
};

interface MediaWikiNamespace {
  id: number;
  canonical?: string;
}

export default function MediaWikiForm() {
  const methods = useForm<FormValues>({
    defaultValues: {
      baseUrl: "",
      path: "",
      namespaces: [],
    },
  });

  const { handleSubmit, getValues, watch } = methods;

  const path = watch("path")

  const [namespaces, setNamespaces] = useState<any[]>([]);

  const guessPaths = ["/w/api.php", "/api.php"]

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
  };

  const getNamespaces = useCallback(async (url: string) => {
    setNamespaces([])
    const params = new URLSearchParams({
      action: "query",
      meta: "siteinfo",
      siprop: "namespaces",
      format: "json",
      origin: "*",
    })
    const res = await fetch(url.concat("?", params.toString()))
    const data = await res.json()
    console.log(data)
    Object.values(data?.query?.namespaces || {}).forEach((value: unknown) => {
      const namespace = value as MediaWikiNamespace;
      if (namespace.id !== 0) {
        setNamespaces((prev) => [...prev, { label: namespace.canonical, value: namespace.id }]);
      } else {
        setNamespaces((prev) => [...prev, { label: "Articles", value: namespace.id }]);
      }
    });
  }, [])

  const detectTest = useCallback(async (url: string) => {
    try {
      await getNamespaces(url)
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  useEffect(() => {
    if (path) {
      const url = new URL(path, getValues("baseUrl"))
      getNamespaces(url.toString())
    }
  }, [path])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <WebsiteInput
          name="baseUrl"
          label="MediaWiki Website"
          allowPath={false}
          placeholder="e.g., https://en.wikipedia.org"
          helperText="Please enter the website of your MediaWiki instance."
        />
        <AutoDetectPathInput
          name="path"
          label="API Path"
          baseUrl={getValues("baseUrl")}
          guessPaths={guessPaths}
          detectTest={detectTest}
          helperText="Please enter the path to the MediaWiki API."
        />
        <MultiCheckboxSelector
          name="namespaces"
          options={namespaces}
          label="Namespaces"
          helperText="Please select the namespaces you want to monitor. We suggest only selecting the Articles namespace."
        />

        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </FormProvider>
  );
}
