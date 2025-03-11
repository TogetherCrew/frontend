import { useSnackbar } from "@/context/SnackbarContext";
import { setAmplitudeUserIdFromToken, trackAmplitudeEvent } from "@/helpers/amplitudeHelper";

function UpvoteButton({ eventType, eventProperties }: { eventType: string, eventProperties: Record<string, any> }) {
  const { showMessage } = useSnackbar();

  const handle = () => {
    try {
      setAmplitudeUserIdFromToken();

      trackAmplitudeEvent({
        eventType,
        eventProperties,
        callback: (res) => {
          console.log(res);
          showMessage(
            `Thank you for sharing your feedback!`,
            "success",
          );
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-fit text-xs text-gray-500 flex flex-row gap-1 items-center">
      <span>Interested?</span>
      <button
        className="hover:underline"
        onClick={handle}
      >
        <span>Upvote</span>
      </button>
    </div >
  )

}

export default UpvoteButton;