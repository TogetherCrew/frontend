import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BsPlusLg } from "react-icons/bs";
import { IoSaveOutline } from "react-icons/io5";

import { usePlatformActions } from "@/hooks/platforms/usePlatformActions";

import { useToken } from "@/context/TokenContext";
import { IPlatformProps } from "@/utils/interfaces";

import { AutoDetectPathInput } from "../inputs/AutoDetectPathInput";
import { MultiCheckboxSelector } from "../inputs/MultiCheckboxSelector";
import { WebsiteInput } from "../inputs/WebsiteInput";
type FormValues = {
  baseURL: string;
  path: string;
  namespace: number[];
};

interface MediaWikiNamespace {
  id: number;
  canonical?: string;
}

export default function MediaWikiForm({ edit }: { edit?: IPlatformProps }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { community } = useToken();

  const methods = useForm<FormValues>({
    defaultValues: {
      baseURL: edit?.metadata?.baseURL || "",
      path: edit?.metadata?.path || "",
      namespace: edit?.metadata?.namespace || [],
    },
  });

  const { handleSubmit, getValues, watch } = methods;
  const { updatePlatform, createPlatform } = usePlatformActions();

  const path = watch("path")

  const [namespaces, setNamespaces] = useState<any[]>([]);

  const guessPaths = ["/w/api.php", "/api.php"]

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (edit) {
        await updatePlatform.mutateAsync({ platformId: edit.id, update: { metadata: data } })
      } else {
        const platform = { name: "mediaWiki", metadata: data, community: community?.id }
        await createPlatform.mutateAsync({ platform })
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNamespaces = useCallback(async (url: string) => {
    const params = new URLSearchParams({
      action: "query",
      meta: "siteinfo",
      siprop: "namespaces",
      format: "json",
      origin: "*",
    })
    const res = await fetch(url.concat("?", params.toString()))
    const data = await res.json()
    setNamespaces([])
    Object.values(data?.query?.namespaces || {}).forEach((value: unknown) => {
      const namespace = value as MediaWikiNamespace;
      let obj = { label: namespace.canonical, value: namespace.id }
      if (namespace.id === 0) {
        obj = { label: "Articles", value: namespace.id };
      }
      setNamespaces((prev) => [...prev, obj]);
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
      const url = new URL(path, getValues("baseURL"))
      getNamespaces(url.toString())
    }
  }, [path])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <WebsiteInput
          name="baseURL"
          label="MediaWiki Website"
          allowPath={false}
          placeholder="e.g., https://en.wikipedia.org"
          helperText="Please enter the website of your MediaWiki instance."
        />
        <AutoDetectPathInput
          name="path"
          label="API Path"
          baseUrl={getValues("baseURL")}
          guessPaths={guessPaths}
          detectTest={detectTest}
          helperText="Please enter the path to the MediaWiki API."
        />
        <MultiCheckboxSelector
          name="namespace"
          options={namespaces}
          label="Namespaces"
          helperText="Please select the namespaces you want to monitor. We suggest only selecting the Articles namespace."
        />

        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm mr-2"></span>
          ) : edit ? (
            <IoSaveOutline className="mr-2" size={18} />
          ) : (
            <BsPlusLg className="mr-2" size={18} />
          )}
          {edit ? "Update" : "Create"}
        </button>
      </form>
    </FormProvider>
  );
}
