import { useState } from "react";

import Loading from "@/components/global/Loading";

import { useSnackbar } from "@/context/SnackbarContext";
import { setAmplitudeUserIdFromToken, trackAmplitudeEvent } from "@/helpers/amplitudeHelper";

import BaseButton from "./BaseButton";
import { Spinner } from "./Spinner";

export function UpvoteButton({ community, datasource }: { community: any, datasource: any }) {
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
          platform: datasource,
        },
        callback: () => {
          showMessage(
            `Thank you for upvoting ${datasource}! We will consider adding it soon.`,
            "success",
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