import Loading from "@/components/global/Loading";
import SEO from "@/components/global/SEO";
import ReputationItem from "@/components/reputation/ReputationItem";

import { useToken } from "@/context/TokenContext";
import { defaultLayout } from "@/layouts/defaultLayout";
import { withRoles } from "@/utils/withRoles";

function ReputationScore() {

  const { community } = useToken()

  if (!community) return <Loading />

  return (
    <div className="flex flex-col gap-4 bg-gray-100 w-full h-screen p-8">
      <SEO titleTemplate='Reputation Score' />
      <h1 className="text-4xl font-semibold">Reputation Score</h1>
      <p className="text-sm text-gray-500 border-b border-gray-200 pb-4">Reputation Score is a number between 0 and 100 that represents how involved in the community a member is. It is calculated based on a user's interactions with other community members on the community platforms.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {community?.platforms.map((platform, index) => <ReputationItem key={index} platform={platform} />)}
      </div>
    </div>
  )
}


ReputationScore.pageLayout = defaultLayout;

export default withRoles(ReputationScore, ['view', 'admin']);
