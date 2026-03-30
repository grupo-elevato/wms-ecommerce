import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarPedidoPorChave } from '../../services/api';
import Header from '../../components/Header';
import BarcodeScanner from '../../components/BarcodeScanner';
import Loading from '../../components/Loading';
import Toast from '../../components/Toast';
import useIsMobile from '../../hooks/useIsMobile';
import {
  Container,
  ScanSection,
  SectionTitle,
  ScannerWrapper,
  Divider,
  ManualInputGroup,
  Input,
  BtnPrimary,
  CharCount,
} from './styles';

export default function DanfeScan() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [inputChave, setInputChave] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const scanBufferRef = useRef([]);
  const lastScanTimeRef = useRef(0);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  const processarChave = useCallback(
    async (chave) => {
      setLoading(true);
      try {
        const pedido = await buscarPedidoPorChave(chave);
        navigate('/conferencia', { state: { pedido, chave } });
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [navigate, showToast]
  );

  const handleDanfeScan = useCallback(
    (code) => {
      const cleanCode = code.replace(/\D/g, '');
      const now = Date.now();

      if (cleanCode.length === 22) {
        if (now - lastScanTimeRef.current > 3000) {
          scanBufferRef.current = [];
        }
        scanBufferRef.current.push(cleanCode);
        lastScanTimeRef.current = now;

        if (scanBufferRef.current.length >= 2) {
          const chave = scanBufferRef.current[0] + scanBufferRef.current[1];
          scanBufferRef.current = [];
          processarChave(chave);
        } else {
          showToast('Primeira linha lida. Posicione a segunda linha.', 'warning');
        }
      } else if (cleanCode.length === 44) {
        processarChave(cleanCode);
      } else if (cleanCode.length > 30) {
        processarChave(cleanCode.substring(0, 44));
      }
    },
    [processarChave, showToast]
  );

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setInputChave(value);
  };

  const handleBuscar = () => {
    if (inputChave.length !== 44) {
      showToast('A chave deve conter exatamente 44 digitos', 'error');
      return;
    }
    processarChave(inputChave);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBuscar();
  };

  return (
    <>
      <Header subtitle="Escaneie a DANFE para iniciar" />
      <Container>
        {isMobile && (
          <ScanSection>
            <SectionTitle>Escanear DANFE Simplificada</SectionTitle>
            <ScannerWrapper>
              <BarcodeScanner
                id="danfe-scanner"
                onScan={handleDanfeScan}
              />
            </ScannerWrapper>
          </ScanSection>
        )}

        {isMobile && (
          <Divider>
            <span>ou digite manualmente</span>
          </Divider>
        )}

        <ScanSection>
          {!isMobile && (
            <SectionTitle>Escaneie ou digite a chave da DANFE</SectionTitle>
          )}
          <ManualInputGroup>
            <Input
              type="text"
              maxLength={44}
              placeholder={isMobile ? "Digite os 44 digitos da chave" : "Aguardando leitura ou digite os 44 digitos..."}
              inputMode="numeric"
              value={inputChave}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus={!isMobile}
            />
            <BtnPrimary onClick={handleBuscar}>Buscar</BtnPrimary>
          </ManualInputGroup>
          <CharCount>{inputChave.length}/44 digitos</CharCount>
        </ScanSection>
      </Container>

      <Loading visible={loading} text="Buscando pedido..." />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />
    </>
  );
}
