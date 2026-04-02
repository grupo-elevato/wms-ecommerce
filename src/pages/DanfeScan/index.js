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
  const [loadingText, setLoadingText] = useState('Buscando pedido...');
  const [toast, setToast] = useState({ message: '', type: '' });
  const scanBufferRef = useRef([]);
  const lastScanTimeRef = useRef(0);
  const processandoRef = useRef(false);
  const inputRef = useRef(null);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  const processarChave = useCallback(
    async (chave) => {
      if (processandoRef.current) return;
      processandoRef.current = true;
      setLoading(true);
      setLoadingText('Buscando pedido...');
      try {
        const pedido = await buscarPedidoPorChave(chave);
        navigate('/conferencia', { state: { pedido, chave } });
        return;
      } catch (err) {
        // Primeira tentativa falhou
      }
      // Tenta ordem invertida
      const parte1 = chave.substring(0, 22);
      const parte2 = chave.substring(22, 44);
      const invertida = parte2 + parte1;
      setLoadingText('Invertendo ordem e tentando novamente...');
      try {
        const pedido = await buscarPedidoPorChave(invertida);
        navigate('/conferencia', { state: { pedido, chave: invertida } });
      } catch (err2) {
        showToast('Nenhum pedido encontrado para esta chave', 'error');
      } finally {
        setLoading(false);
        processandoRef.current = false;
      }
    },
    [navigate, showToast]
  );

  // Camera (mobile) - usa buffer para acumular duas leituras de 22 dígitos
  const handleDanfeScan = useCallback(
    (code) => {
      const cleanCode = code.replace(/\D/g, '');
      const now = Date.now();

      if (cleanCode.length === 22) {
        if (now - lastScanTimeRef.current > 3000) {
          scanBufferRef.current = [];
        }
        lastScanTimeRef.current = now;

        if (!scanBufferRef.current.includes(cleanCode)) {
          scanBufferRef.current.push(cleanCode);
        }

        if (scanBufferRef.current.length >= 2) {
          const chave = scanBufferRef.current[0] + scanBufferRef.current[1];
          scanBufferRef.current = [];
          processarChave(chave);
        } else {
          showToast('Uma linha lida. Posicione a outra linha.', 'warning');
        }
      } else if (cleanCode.length === 44) {
        processarChave(cleanCode);
      } else if (cleanCode.length > 30) {
        processarChave(cleanCode.substring(0, 44));
      }
    },
    [processarChave, showToast]
  );

  // Desktop (USB scanner) - acumula dígitos no input, ignora Enter até ter 44
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 44);
    // Detecta linha duplicada (mesmos 22 dígitos repetidos)
    if (value.length === 44) {
      const primeira = value.substring(0, 22);
      const segunda = value.substring(22, 44);
      if (primeira === segunda) {
        // Mesma linha lida 2x — descarta a duplicata, mantém só a primeira
        setInputChave(primeira);
        showToast('Mesma linha lida 2x. Leia a outra linha.', 'warning');
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }
      setInputChave(value);
      processarChave(value);
      setTimeout(() => setInputChave(''), 0);
      return;
    }
    setInputChave(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      // Lê valor direto do DOM (state pode estar defasado com scanner rápido)
      const raw = (inputRef.current?.value || '').replace(/\D/g, '');
      if (raw.length === 44 && !processandoRef.current) {
        setInputChave('');
        processarChave(raw);
      }
      // Menos de 44 — ignora Enter, mantém foco para acumular
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleBuscar = () => {
    if (inputChave.length !== 44) {
      showToast('A chave deve conter exatamente 44 digitos', 'error');
      return;
    }
    processarChave(inputChave);
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
              ref={inputRef}
              type="text"
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

      <Loading visible={loading} text={loadingText} />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />
    </>
  );
}
