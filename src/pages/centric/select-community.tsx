import React from 'react';

import TcSelectCommunity from '../../components/centric/selectCommunity/TcSelectCommunity';
// import TcBoxContainer from '../../components/shared/TcBox/TcBoxContainer';
import centricLayout from '../../layouts/centricLayout';

function SelectCommunity() {
  return (
    <>
      {/* <TcBoxContainer
        data-testid='tcbox-container'
        contentContainerChildren={<TcSelectCommunity />}
      /> */}
      <TcSelectCommunity />
    </>
  );
}

SelectCommunity.pageLayout = centricLayout;

export default SelectCommunity;
