import { FormProvider, useForm } from 'react-hook-form';
import { IoSaveOutline } from 'react-icons/io5';

import { ToggleInput } from '@/components/inputs/ToggleInput';

import { IMediaWikiModuleFormPayload } from '@/utils/interfaces';


interface IMediaWikiModuleFormProps {
  isLoading: boolean;
  payload: IMediaWikiModuleFormPayload;
  patch: (payload: IMediaWikiModuleFormPayload) => void;
}

export function MediaWikiModuleForm({ isLoading, payload, patch }: IMediaWikiModuleFormProps) {
  const methods = useForm<IMediaWikiModuleFormPayload>({
    defaultValues: payload,
  });

  const onSubmit = (data: IMediaWikiModuleFormPayload) => {
    patch(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ToggleInput
          name="activated"
          label="Activate MediaWiki Module"
          helperText="Enable or disable the MediaWiki module"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? <span className="loading loading-spinner loading-sm mr-2" /> : <IoSaveOutline className="mr-2" size={18} />}
          <span>Update</span>
        </button>
      </form>
    </FormProvider>
  );
}