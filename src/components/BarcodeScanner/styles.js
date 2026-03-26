import styled, { keyframes } from 'styled-components';

const scanPulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

export const Container = styled.div`
  width: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  min-height: 220px;

  /* Forçar remoção de QUALQUER elemento visual do html5-qrcode */
  canvas,
  img,
  [id$="__scan_region"],
  [id$="__dashboard_section"],
  [id$="__header_message"],
  [style*="border-width"],
  [style*="position: absolute"][style*="border"] {
    display: none !important;
  }

  video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 12px;
  }

  &[data-camera-failed='true'] {
    .fallback {
      display: flex;
    }
  }
`;

export const ScannerBox = styled.div`
  width: 100%;
  min-height: 220px;
`;

export const ScanGuide = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 60px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  pointer-events: none;
  z-index: 10;
  animation: ${scanPulse} 2s ease-in-out infinite;

  &::after {
    content: 'Aponte para o codigo de barras';
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
  }
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
