import React from 'react';
import { Container, Title, Subtitle, BackButton } from './styles';

export default function Header({ subtitle, onBack }) {
  return (
    <Container>
      {onBack && <BackButton onClick={onBack}>&larr; Voltar</BackButton>}
      <Title>WMS - Conferencia de Pacotes</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Container>
  );
}
