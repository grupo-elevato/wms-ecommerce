import styled, { keyframes } from 'styled-components';
import colors from '../../assets/styles/variables/colors';

const modalIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

export const Container = styled.div`
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 100px;
`;

/* Order Header */
export const OrderHeader = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

export const ClientId = styled.div`
  font-size: 13px;
  color: ${colors.text.dark.little};
  margin-bottom: 4px;

  span {
    font-weight: 700;
    color: ${colors.primary.main};
    font-size: 15px;
  }
`;

export const ClientName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text.dark.medium};
  margin-bottom: 8px;
`;

export const InvoiceNumber = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${colors.primary.light};
  color: ${colors.primary.main};
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
`;

export const ChaveDisplay = styled.div`
  margin-top: 8px;
  font-size: 11px;
  color: #999;
  word-break: break-all;
  font-family: 'Courier New', monospace;
`;

/* Progress */
export const ProgressSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

export const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
`;

export const ProgressLabel = styled.span`
  color: ${colors.text.dark.little};
`;

export const ProgressCount = styled.span`
  font-weight: 700;
  color: ${colors.primary.main};
`;

export const ProgressBar = styled.div`
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #66bb6a);
  border-radius: 4px;
  transition: width 0.5s ease;
`;

/* Items */
export const ItemsSection = styled.div`
  margin-bottom: 16px;
`;

export const ItemsSectionTitle = styled.h3`
  font-size: 14px;
  color: ${colors.text.dark.little};
  margin-bottom: 12px;
  padding: 0 4px;
`;

export const ItemCard = styled.div`
  background: ${(props) => {
    if (props.flashing) return '#c8e6c9';
    if (props.confirmed) return '#f1f8e9';
    return 'white';
  }};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 14px;
  align-items: center;
  border-left: 4px solid ${(props) => (props.confirmed ? '#4caf50' : '#e0e0e0')};
  transition: border-color 0.3s, background 0.3s;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};

  ${(props) => props.clickable && `
    &:active {
      transform: scale(0.98);
      background: #f5f5f5;
    }
  `}
`;

export const ItemImage = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  background: #f5f5f5;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const NoImg = styled.div`
  font-size: 28px;
  color: #ccc;
`;

export const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ItemSku = styled.div`
  font-size: 12px;
  color: ${colors.primary.main};
  font-weight: 700;
  margin-bottom: 3px;
`;

export const ItemDesc = styled.div`
  font-size: 13px;
  color: ${colors.text.dark.medium};
  font-weight: 500;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemBarcode = styled.div`
  font-size: 11px;
  color: #888;
  font-family: 'Courier New', monospace;
`;

export const ItemStatus = styled.div`
  flex-shrink: 0;
  text-align: center;
`;

export const ItemQty = styled.div`
  font-size: 11px;
  color: ${colors.text.dark.little};
  margin-bottom: 4px;
`;

export const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: ${(props) => (props.confirmed ? '#e8f5e9' : '#fff3e0')};
  color: ${(props) => (props.confirmed ? colors.auxiliar.success : colors.auxiliar.warning)};
`;

/* Scan Modal */
export const ScanModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

export const ScanModalContent = styled.div`
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  animation: ${modalIn} 0.3s ease;
`;

export const ScanModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ScanModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.text.dark.medium};
`;

export const ScanModalClose = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f0f0f0;
  font-size: 16px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ScanModalItem = styled.div`
  background: ${colors.primary.light};
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
`;

export const ScanModalItemName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.dark.medium};
  margin-bottom: 4px;
`;

export const ScanModalItemCode = styled.div`
  font-size: 12px;
  color: #888;
  font-family: 'Courier New', monospace;
`;

export const BtnManualConfirm = styled.button`
  width: 100%;
  padding: 14px;
  border: 2px solid ${colors.secondary.main};
  border-radius: 12px;
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.secondary.main};
  margin-top: 12px;
  transition: all 0.2s;

  &:active {
    background: ${colors.secondary.main};
    color: white;
  }
`;

/* Finalize */
export const FinalizeSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(0deg, ${colors.bgColor} 80%, transparent);
`;

export const BtnFinalize = styled.button`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: block;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: ${(props) =>
    props.disabled
      ? '#bdbdbd'
      : `linear-gradient(135deg, ${colors.secondary.main}, ${colors.secondary.dark})`};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;

  &:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  }
`;

/* Success Modal */
export const SuccessOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SuccessContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  max-width: 320px;
  width: 90%;
  animation: ${modalIn} 0.3s ease;
`;

export const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #e8f5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 40px;
  color: ${colors.auxiliar.success};
`;

export const SuccessTitle = styled.h2`
  font-size: 20px;
  color: ${colors.auxiliar.success};
  margin-bottom: 8px;
`;

export const SuccessText = styled.p`
  font-size: 14px;
  color: ${colors.text.dark.little};
  margin-bottom: 24px;
`;

export const BtnNewScan = styled.button`
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark});
  color: white;
`;
