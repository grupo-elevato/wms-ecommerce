import styled, { keyframes } from 'styled-components';
import colors from '../../assets/styles/variables/colors';

const pulseLine = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export const Container = styled.div`
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
`;

export const ScanSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  color: ${colors.primary.main};
  margin-bottom: 12px;
  text-align: center;
`;

export const Instruction = styled.p`
  font-size: 13px;
  color: ${colors.text.dark.little};
  text-align: center;
  margin-bottom: 16px;
`;

export const ScannerWrapper = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
`;

export const ScannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
`;

export const ScannerFrame = styled.div`
  position: absolute;
  top: 25%;
  left: 5%;
  right: 5%;
  bottom: 25%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-color: #4caf50;
    border-style: solid;
  }

  &::before {
    top: -2px;
    left: -2px;
    border-width: 3px 0 0 3px;
    border-radius: 4px 0 0 0;
  }

  &::after {
    top: -2px;
    right: -2px;
    border-width: 3px 3px 0 0;
    border-radius: 0 4px 0 0;
  }
`;

export const CornerBL = styled.div`
  position: absolute;
  bottom: -2px;
  left: -2px;
  width: 20px;
  height: 20px;
  border-color: #4caf50;
  border-style: solid;
  border-width: 0 0 3px 3px;
  border-radius: 0 0 0 4px;
`;

export const CornerBR = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-color: #4caf50;
  border-style: solid;
  border-width: 0 3px 3px 0;
  border-radius: 0 0 4px 0;
`;

export const GuideLine = styled.div`
  position: absolute;
  left: 10%;
  right: 10%;
  height: 3px;
  background: #ff1744;
  box-shadow: 0 0 8px rgba(255, 23, 68, 0.6);
  animation: ${pulseLine} 1.5s ease-in-out infinite;
  top: ${(props) => props.top};
`;

export const GuideLabel = styled.span`
  position: absolute;
  left: 10%;
  color: #ff1744;
  font-size: 10px;
  font-weight: bold;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  top: ${(props) => props.top};
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  gap: 12px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ddd;
  }

  span {
    font-size: 13px;
    color: #999;
    font-weight: 500;
  }
`;

export const ManualInputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${colors.primary.main};
  }

  &::placeholder {
    letter-spacing: 0;
    font-family: 'Segoe UI', sans-serif;
    font-size: 13px;
  }
`;

export const BtnPrimary = styled.button`
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark});
  color: white;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
  }
`;

export const CharCount = styled.div`
  text-align: right;
  font-size: 11px;
  color: #999;
  margin-top: 4px;
`;
