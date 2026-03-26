import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SpinnerBox = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #1a237e;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto 12px;
`;
