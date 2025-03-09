import { useApi } from "@/hooks/useApi";

import TcCommunityPlatformIcon from "@/components/communitySettings/communityPlatforms/TcCommunityPlatformIcon";
import Loading from "@/components/global/Loading";
import UpvoteButton from "@/components/UpvoteButton";

import { useToken } from "@/context/TokenContext";
import { ICommunityPlatfromProps } from "@/utils/interfaces"

const ALLOW_LIST = [
  'discord',
  'telegram',
  // 'twitter',
  // 'github',
  // 'linkedin',
  // 'instagram',
  // 'youtube',
]

interface IReputationItemProps {
  platform: ICommunityPlatfromProps
}

function name(platform: ICommunityPlatfromProps) {
  switch (platform.name) {
    case 'discord':
      return platform.metadata.name || platform.name
    case 'telegram':
      return platform.metadata.chat?.title || platform.name
    default:
      return platform.name
  }
}

function CardHeader({ platform }: IReputationItemProps) {
  return (
    <div className="flex flex-row gap-2 items-center text-gray-500">
      <TcCommunityPlatformIcon platform={platform.name} size={24} />
      <h3 className='text-sm font-semibold text-left capitalize'>{name(platform)}</h3>
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

function ActiveCard({ platform }: IReputationItemProps) {

  const platformId = platform.id || platform._id

  const { data, loading, error } = useApi<ICommunityPlatfromProps>(`/platforms/${platformId}/reputation-score`);

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

function ReputationItem({ platform }: IReputationItemProps) {
  console.log(platform)

  if (!ALLOW_LIST.includes(platform.name)) return <DisabledCard platform={platform} />;
  return <ActiveCard platform={platform} />
}

export default ReputationItem;