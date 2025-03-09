import { useState } from 'react';
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  Switch,
} from '@mui/material';
import router from 'next/router';

import TcButton from '../../shared/TcButton';
import { IPlatformProps } from '../../../utils/interfaces';
interface TcHivemindWebsiteProps {
  isLoading: boolean;
  defaultWebsiteHivemindConfig: any;
  handlePatchHivemindWebsite: (data: any) => void;
}

function TcHivemindWebsite({
  isLoading,
  defaultWebsiteHivemindConfig,
  handlePatchHivemindWebsite,
}: TcHivemindWebsiteProps) {

  console.log(defaultWebsiteHivemindConfig);

  const [activatedAt, setActivatedAt] = useState<Date | null>(
    defaultWebsiteHivemindConfig.activatedAt || null
  );

  const handleWebsiteHivemind = () => {
    handlePatchHivemindWebsite({ activatedAt });
  };

  return (
    <>
      <div className='flex flex-col items-center justify-between space-y-3'>
        <FormControl fullWidth className='flex flex-row items-center'>
          <FormControlLabel
            control={
              <Switch
                checked={activatedAt !== null}
                onChange={(e) => setActivatedAt(e.target.checked ? new Date() : null)}
              />
            }
            label='Enable the AI assistant to use the selected website as a source of information.'
          />
        </FormControl>
      </div>
      <div className='mt-6 flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0'>
        <TcButton
          text='Cancel'
          variant='outlined'
          className='md:w-1/4'
          onClick={() => router.push('/community-settings')}
        />
        <TcButton
          text={
            isLoading ? (
              <CircularProgress size={20} color='inherit' />
            ) : (
              'Save Changes'
            )
          }
          variant='contained'
          className='md:w-1/4'
          onClick={() => handleWebsiteHivemind()}
        />
      </div>
    </>
  );
}

export default TcHivemindWebsite;
