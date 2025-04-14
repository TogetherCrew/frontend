import { useState } from "react";
import { FaCaretUp } from "react-icons/fa6";

import { useSnackbar } from "@/context/SnackbarContext";
import { setAmplitudeUserIdFromToken, trackAmplitudeEvent } from "@/helpers/amplitudeHelper";

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
    <div className="tooltip tooltip-left" data-tip="Upvote">
      <button onClick={handleClick} disabled={loading} className="btn btn-sm btn-square">
        {loading ? <span className="loading loading-spinner loading-sm"></span> : <FaCaretUp />}
      </button>
    </div>
  );
}