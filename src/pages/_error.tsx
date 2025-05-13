import { NextComponentType, NextPageContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import notFounded from '../assets/svg/404.svg';
import tcLogo from '../assets/svg/tc-logo.svg';
import TcButton from '../components/shared/TcButton';

interface ErrorPageProps {
  statusCode?: number;
}

const ErrorPage: NextComponentType<
  NextPageContext,
  ErrorPageProps,
  ErrorPageProps
> = () => {
  const router = useRouter();

  return (
    <div className='container'>
      <div className='mx-auto flex px-3 py-4 md:w-8/12 md:px-0 md:py-4'>
        <Image alt='Image Alt' src={tcLogo} />
      </div>{' '}
      <div className='flex flex-col items-center justify-center p-3 md:mt-8 md:flex-row md:space-x-8 md:p-0'>
        <div className='hidden md:relative md:block md:h-[214px] md:w-[248px]'>
          <Image
            alt='Image Alt'
            src={notFounded}
            layout='fill'
            objectFit='contain'
          />
        </div>
        <div className='space-y-8'>
          <h1 className='text-3xl font-bold'>
            Oops! We’re sorry, we couldn’t find <br /> the page you’re looking
            for.{' '}
          </h1>
          <div className='space-y-3'>
            <p className='text-md font-bold'>What could have caused this?</p>
            <div className='space-y-2'>
              <p className='text-base'>
                The link you clicked might be old and does not work anymore.
              </p>
              <p className='text-sm'>
                Or you might have accidentally typed the wrong URL in the
                address bar.
              </p>
            </div>
          </div>
          <div className='space-y-3'>
            <p className='text-md font-bold'>What you can do</p>
            <p className='text-sm'>
              You might retype the URL or try some helpful links instead:
            </p>
          </div>
          <div className='flex flex-col justify-between space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
            <TcButton
              text='Community Insights'
              variant='outlined'
              onClick={() => router.push('/')}
              className='py-2 md:w-1/2'
            />
            <TcButton
              onClick={() => router.push('/centric')}
              variant='outlined'
              text='Connect your community'
              className='py-2 md:w-1/2'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
