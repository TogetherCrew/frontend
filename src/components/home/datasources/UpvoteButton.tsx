import { useState } from "react";

import Loading from "@/components/global/Loading";

import { useSnackbar } from "@/context/SnackbarContext";
import { setAmplitudeUserIdFromToken, trackAmplitudeEvent } from "@/helpers/amplitudeHelper";

import { Spinner } from "./Spinner";
import BaseButton from "../BaseButton";

export function UpvoteButton({ community, name }: { community: any, name: string }) {
  const [loading, setLoading] = useState(false);
  const { showMessage } = useSnackbar();

  const handleClick = () => {
    setLoading(true);
    try {
      setAmplitudeUserIdFromToken();

      trackAmplitudeEvent({
        eventType: "Upvote Data Source",
        eventProperties: {
          communityId: community?.id,
          communityName: community?.name,
          upvote: name,
        },
        callback: () => {
          showMessage(
            'Thank you for voting!',
            'success',
          );
          setLoading(false);
        }
      });
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <BaseButton onClick={handleClick}>
      <div className="flex items-center justify-center gap-2">
        {loading ? <Spinner /> : "Upvote"}
      </div>
    </BaseButton>
  );
}