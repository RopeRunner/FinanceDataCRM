import React from 'react';
import './HeaderComponent.css';

import { PulseLoader } from 'react-loaders-spinners';

const HeaderComponent = () => {
  return (
    <header>
      <img src="https://image.ibb.co/c15rh8/moonface.png" alt="" />
      <h2>EQUINOX FIN.</h2>
      <PulseLoader
        width={150}
        height={40}
        pColor="dodgerblue"
        sColor="#FF711E"
        thickness={11}
        rows={2}
        lineHeight={2}
      />
    </header>
  );
};

export default HeaderComponent;
