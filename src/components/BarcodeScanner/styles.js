import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  min-height: 200px;

  &[data-camera-failed='true'] {
    .fallback {
      display: flex;
    }
  }
`;

export const ScannerBox = styled.div`
  width: 100%;
  min-height: 200px;
`;

export const Fallback = styled.div`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #1a1a1a;
`;
