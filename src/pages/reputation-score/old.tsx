import { Alert, Button, Stack, Typography } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Abi } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { engagementContracts } from '@/lib/contracts/engagement/contracts';

import SimpleBackdrop from '@/components/global/LoadingBackdrop';
import SEO from '@/components/global/SEO';
import TcBoxContainer from '@/components/shared/TcBox/TcBoxContainer';

import useAppStore from '@/store/useStore';

import dynamicNft from '@/assets/dynamic-nft.webp';
import { defaultLayout } from '@/layouts/defaultLayout';
import { withRoles } from '@/utils/withRoles';

function ReputationScore() {
  const { isConnected, address, chainId } = useAccount();
  const { dynamicNFTModuleInfo } = useAppStore();
  const router = useRouter();

  const engagementContract = engagementContracts.find(
    (contract) => contract.chainId === chainId
  );

  const { data: hasMinted, isLoading } = useReadContract({
    address: engagementContract?.address as `0x${string}`,
    abi: engagementContract?.abi as Abi,
    functionName: 'balanceOf',
    args: [address, dynamicNFTModuleInfo?.metadata[0]?.tokenId],
  });

  if(isConnected && isLoading) {
    return <SimpleBackdrop />
  }

  return (
    <>
      <SEO titleTemplate='Reputation Score' />
      <div className='container flex flex-col px-4 py-4 md:px-12'>
        <TcBoxContainer
          contentContainerChildren={
            <div className='flex flex-col justify-between space-y-4 p-4 md:p-10'>
              <Stack
                display='flex'
                flexDirection={{
                  xs: 'column',
                  md: 'row',
                }}
                justifyContent='space-between'
                alignItems={{ xs: 'flex-start', md: 'center' }}
                gap={2}
              >
                <Typography variant='h5' fontWeight='bold'>
                  Reputation Score
                </Typography>
                <ConnectButton />
              </Stack>
              <Typography variant='body2'>
                Reputation Score is a number between 0 and 100 that represents
                how involved in the community a member is. It is calculated
                based on a user's interactions with other community members on
                the community platforms. The higher the score the more involved
                a member is.
              </Typography>
              <div className='relative'>
                {!isConnected && (
                  <Stack className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm'>
                    <Alert severity='warning' className='rounded-md'>
                      <Typography variant='body2'>
                        Please connect your wallet to view this section.
                      </Typography>
                    </Alert>
                  </Stack>
                )}
                <Stack className='mx-auto p-2 md:w-1/3' spacing={2}>
                  <Image
                    src={dynamicNft}
                    width={500}
                    height={300}
                    alt='dynamic-nft'
                    className='rounded-xl shadow-xl'
                  />
                  {typeof hasMinted === 'bigint' && hasMinted >= BigInt(1) ? (
                    <>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() =>
                          router.push(
                            `/reputation-score/score?tokenId=${dynamicNFTModuleInfo?.metadata[0]?.tokenId}&address=${address}`
                          )
                        }
                        disabled={!isConnected}
                      >
                        See Score
                      </Button>
                      <Button
                        variant='outlined'
                        onClick={() => router.push('/reputation-score/mint')}
                        disabled={!isConnected}
                      >
                        Mint NFT
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => router.push('/reputation-score/mint')}
                      disabled={!isConnected}
                    >
                      Mint NFT
                    </Button>
                  )}
                </Stack>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}

ReputationScore.pageLayout = defaultLayout;

export default withRoles(ReputationScore, ['view', 'admin']);
