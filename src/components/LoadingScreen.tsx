import tcLogo from '../assets/svg/tc-logo.svg';
import Image from 'next/image';
export default function LoadingScreen() {
  return (
    <div className="flex flex-col gap-4 h-screen w-screen items-center justify-center">
      <Image src={tcLogo} alt="Logo" width={100} height={100} />
      <div>
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    </div>
  )
}