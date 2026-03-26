import styled, { keyframes } from 'styled-components';
import colors from '../../assets/styles/variables/colors';

const slideUp = keyframes`
  from { transform: translateX(-50%) translateY(100px); opacity: 0; }
  to { transform: translateX(-50%) translateY(0); opacity: 1; }
`;

const typeColors = {
  success: colors.auxiliar.success,
  error: colors.auxiliar.danger,
  warning: colors.auxiliar.warning,
};

export const Container = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  z-index: 2000;
  white-space: nowrap;
  max-width: 90%;
  text-align: center;
  background: ${(props) => typeColors[props.type] || typeColors.success};
  animation: ${slideUp} 0.3s ease forwards;
`;
