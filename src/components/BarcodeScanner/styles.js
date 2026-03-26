import styled, { keyframes } from 'styled-components';

const scanLine = keyframes`
  0% { top: 20%; }
  50% { top: 75%; }
  100% { top: 20%; }
`;

export const Container = styled.div`
  width: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  min-height: 240px;

  &[data-camera-failed='true'] {
    .fallback {
      display: flex;
    }
  }
`;

export const ScannerBox = styled.div`
  width: 100%;
  min-height: 240px;
  visibility: hidden;

  video {
    visibility: visible !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 12px;
    z-index: 1;
  }
`;

export const ScanGuide = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 70px;
  pointer-events: none;
  z-index: 10;

  & > span {
    position: absolute;
    width: 20px;
    height: 20px;
    border-color: rgba(255, 255, 255, 0.8);
    border-style: solid;
  }

  & > span:nth-child(1) {
    top: 0; left: 0;
    border-width: 3px 0 0 3px;
    border-radius: 4px 0 0 0;
  }
  & > span:nth-child(2) {
    top: 0; right: 0;
    border-width: 3px 3px 0 0;
    border-radius: 0 4px 0 0;
  }
  & > span:nth-child(3) {
    bottom: 0; left: 0;
    border-width: 0 0 3px 3px;
    border-radius: 0 0 0 4px;
  }
  & > span:nth-child(4) {
    bottom: 0; right: 0;
    border-width: 0 3px 3px 0;
    border-radius: 0 0 4px 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: 5%;
    width: 90%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(46, 125, 50, 0.9), transparent);
    top: 50%;
    animation: ${scanLine} 2s ease-in-out infinite;
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(46, 125, 50, 0.5);
  }

  &::after {
    content: 'Aponte para o codigo de barras';
    position: absolute;
    bottom: -22px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
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
  z-index: 5;
`;
