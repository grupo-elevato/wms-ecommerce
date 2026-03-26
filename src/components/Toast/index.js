import React, { useEffect } from 'react';
import { Container } from './styles';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <Container type={type} className="show">
      {message}
    </Container>
  );
}
