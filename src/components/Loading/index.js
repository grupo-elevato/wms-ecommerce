import React from 'react';
import { Overlay, SpinnerBox, Spinner } from './styles';

export default function Loading({ visible, text }) {
  if (!visible) return null;

  return (
    <Overlay>
      <SpinnerBox>
        <Spinner />
        <div>{text || 'Carregando...'}</div>
      </SpinnerBox>
    </Overlay>
  );
}
