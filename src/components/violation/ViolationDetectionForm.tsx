import { useEffect, useState } from "react";
import { pl } from "date-fns/locale";
import router from "next/router";

import useAppStore from "@/store/useStore";

import { IPlatformProps } from "@/utils/interfaces";

import { ViolationDetectionEmailInput } from "./form/ViolationDetectionEmailInput";
import { ViolationDetectionSubmit } from "./form/ViolationDetectionSubmit";
import { ViolationDetectionSwitch } from "./form/ViolationDetectionSwitch";

interface ViolationDetectionFormProps {
  platform: IPlatformProps;
  module: any;
}

export function ViolationDetectionForm({ platform, module }: ViolationDetectionFormProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const { showMessage, patchModule } = useAppStore();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const updatedEmails = isActive ? selectedEmails : [];

    console.log("platform", platform);

    const payload = {
      platforms: [
        {
          platform: platform.id || (platform as any)._id,
          name: platform.name,
          metadata: {
            selectedEmails: updatedEmails,
            fromDate: platform.metadata.period,
            toDate: null,
            selectedResources: [],
          },
        },
      ],
    };

    try {
      const data = await patchModule({
        moduleId: module.id,
        payload,
      });

      if (data) {
        router.push("/community-settings");
        showMessage(
          "Violation detection settings updated successfully",
          "success",
        );
      }
    } catch (error) {
      console.error("Error updating violation module:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const selectedEmails = module.options?.platforms[0]?.metadata?.selectedEmails || [];
    setSelectedEmails(selectedEmails);
    if (selectedEmails.length > 0) {
      setIsActive(true);
    }
  }, [module]);

  return (
    <div>
      <ViolationDetectionSwitch isChecked={isActive} setIsChecked={setIsActive} />
      {isActive &&
        <ViolationDetectionEmailInput
          selectedEmails={selectedEmails}
          setSelectedEmails={setSelectedEmails}
          setFormError={setFormError}
        />
      }
      <ViolationDetectionSubmit
        isSubmitting={isSubmitting}
        formError={formError}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
