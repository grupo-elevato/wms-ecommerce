import styled from 'styled-components';
import colors from '../../assets/styles/variables/colors';

export const Container = styled.div`
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark});
  color: white;
  padding: 16px 20px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

export const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const Subtitle = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-top: 2px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px 8px;
`;
