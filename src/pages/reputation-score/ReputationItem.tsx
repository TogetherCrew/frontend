import { useApi } from "@/hooks/useApi";

import TcCommunityPlatformIcon from "@/components/communitySettings/communityPlatforms/TcCommunityPlatformIcon";
import Loading from "@/components/global/Loading";
import { UpvoteButton } from "@/components/UpvoteButton";

import { conf } from "@/configs";
import { useToken } from "@/context/TokenContext";
import { ICommunityPlatfromProps } from "@/utils/interfaces"

interface IReputationItemProps {
  platform: ICommunityPlatfromProps
}

function CardHeader({ platform }: IReputationItemProps) {
  return (
    <div className="flex flex-row gap-2 items-center text-gray-500">
      <TcCommunityPlatformIcon platform={platform.name} size={24} />
      <h3 className='text-sm font-semibold text-left capitalize'>{platform.metadata.name ? platform.metadata.name : platform.name}</h3>
    </div>
  )
}

function DisabledCard({ platform }: IReputationItemProps) {
  const { community } = useToken()
  const eventType = 'upvote_reputation_score'
  const eventProperties = {
    communityId: community?.id,
    communityName: community?.name,
    platform: platform.name,
  }

  return (
    <div className="bg-white rounded-2xl min-h-[180px] p-8 flex flex-col justify-between gap-8 opacity-50">
      <CardHeader platform={platform} />
      <UpvoteButton eventType={eventType} eventProperties={eventProperties} />
    </div>
  )
}

export function ReputationItem({ platform }: IReputationItemProps) {
  const { data, loading, error } = useApi<ICommunityPlatfromProps>(`/platforms/${platform.id}/reputation-score`);

  if (loading) return <Loading />

  if (error) return <DisabledCard platform={platform} />

  return (
    <div className="bg-white rounded-2xl min-h-[180px] p-8 flex flex-col justify-between gap-8">
      <CardHeader platform={platform} />
      <div className="flex flex-row items-end gap-2">
        <p className="text-5xl font-semibold text-left">{data?.reputationScore.toFixed(0)}</p>
      </div>
    </div>
  )
}