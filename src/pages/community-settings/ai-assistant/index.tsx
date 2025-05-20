import React from 'react';

import TcHivemindSettings from '../../../components/communitySettings/HivemindSettings';
import SEO from '../../../components/global/SEO';
import TcBoxContainer from '../../../components/shared/TcBox/TcBoxContainer';
import TcBreadcrumbs from '../../../components/shared/TcBreadcrumbs';
import TcButton from '../../../components/shared/TcButton';
import TcText from '../../../components/shared/TcText';
import { conf } from '../../../configs';
import { defaultLayout } from '../../../layouts/defaultLayout';
import { withRoles } from '../../../utils/withRoles';

function Index() {
  return (
    <>
      <SEO titleTemplate='AI assistant Settings' />
      <div className='container flex flex-col space-y-3 px-4 py-4 md:px-12'>
        <TcBreadcrumbs
          items={[
            {
              label: 'Community Settings',
              path: '/community-settings',
            },
            {
              label: 'AI assistant Settings',
              path: '/community-settings/ai-assistant',
            },
          ]}
        />
        <TcBoxContainer
          className='bg-base-100 rounded-lg'
          contentContainerChildren={
            <div className='space-y-4'>
              <div className='space-y-4 px-4 pt-4 pb-[1rem] md:px-10'>
                <TcText
                  text='AI assistant Settings'
                  variant='h6'
                  fontWeight='bold'
                />
                <div className='flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0'>
                  <TcText
                    className='md:w-2/3'
                    text={
                      <>
                        Our AI assistant retrieves answers from your
                        documentation, website, and live chats. It supports your
                        members by answering their questions.{' '}
                        <a
                          href='https://www.togethercrew.com/ai-assistant'
                          style={{
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                          }}
                          target='_blank'
                          rel='noreferrer'
                        >
                          Learn More
                        </a>
                        .
                      </>
                    }
                    variant='body2'
                  />
                  <TcButton
                    text='Permissions?'
                    variant='outlined'
                    onClick={() =>
                      window.open(
                        `${conf.GITBOOK_URL}features/smart-announcements#how-to-set-permissions-for-the-smart-announcements-to-work`
                      )
                    }
                  />
                </div>
                <TcHivemindSettings />
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}

Index.pageLayout = defaultLayout;

export default withRoles(Index, ['admin']);
