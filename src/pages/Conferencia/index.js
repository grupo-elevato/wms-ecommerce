import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import BarcodeScanner from '../../components/BarcodeScanner';
import Toast from '../../components/Toast';
import { registrarEmbalagem, buscarEmbalagensConferidas } from '../../services/api';
import Loading from '../../components/Loading';
import useIsMobile from '../../hooks/useIsMobile';
import {
  Container,
  OrderHeader,
  ClientId,
  ClientName,
  InvoiceNumber,
  ChaveDisplay,
  ProgressSection,
  ProgressInfo,
  ProgressLabel,
  ProgressCount,
  ProgressBar,
  ProgressFill,
  ItemsSection,
  ItemsSectionTitle,
  ItemCard,
  ItemImage,
  NoImg,
  ItemInfo,
  ItemSku,
  ItemDesc,
  ItemBarcode,
  ItemStatus,
  ItemQty,
  StatusBadge,
  ScanModal,
  ScanModalContent,
  ScanModalHeader,
  ScanModalTitle,
  ScanModalClose,
  ScanModalItem,
  ScanModalItemName,
  ScanModalItemCode,
  BtnManualConfirm,
  DesktopScanInput,
  DesktopScanLabel,
  FinalizeSection,
  BtnFinalize,
  SuccessOverlay,
  SuccessContent,
  SuccessIcon,
  SuccessTitle,
  SuccessText,
  BtnNewScan,
} from './styles';

export default function Conferencia() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const { pedido, chave } = location.state || {};

  const [itensQtdConfirmada, setItensQtdConfirmada] = useState(() => {
    if (!pedido) return {};
    const initial = {};
    pedido.itens.forEach((_, idx) => {
      initial[idx] = 0;
    });
    return initial;
  });

  const [toast, setToast] = useState({ message: '', type: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [flashIndex, setFlashIndex] = useState(null);
  const [scanningIndex, setScanningIndex] = useState(null);
  const [loadingConferidos, setLoadingConferidos] = useState(true);
  const [desktopScanValue, setDesktopScanValue] = useState('');
  const desktopInputRef = useRef(null);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!pedido) return;

    const verificarItensConferidos = async () => {
      try {
        const resultado = await buscarEmbalagensConferidas(pedido.cabecalho.numnota);
        console.log('[WMS] Resposta embalagens:', JSON.stringify(resultado));

        // Tentar extrair array de diferentes formatos de resposta
        let embalagens = [];
        if (Array.isArray(resultado)) {
          embalagens = resultado;
        } else if (resultado && Array.isArray(resultado.data)) {
          embalagens = resultado.data;
        } else if (resultado && Array.isArray(resultado.results)) {
          embalagens = resultado.results;
        } else if (resultado && typeof resultado === 'object') {
          // Se for objeto com chaves numericas ou outro formato
          const values = Object.values(resultado);
          if (values.length > 0 && Array.isArray(values[0])) {
            embalagens = values[0];
          }
        }

        console.log('[WMS] Embalagens encontradas:', embalagens.length, embalagens);

        if (embalagens.length > 0) {
          const contagemPorSku = {};
          embalagens.forEach((emb) => {
            // Tentar todas as variações possíveis do campo
            const sku = String(
              emb.idproduto || emb.IDPRODUTO || emb.id_produto ||
              emb.sku || emb.SKU || emb.produto || emb.PRODUTO || ''
            ).trim();
            if (sku) {
              contagemPorSku[sku] = (contagemPorSku[sku] || 0) + 1;
            }
          });

          console.log('[WMS] Contagem por SKU:', contagemPorSku);
          console.log('[WMS] SKUs do pedido:', pedido.itens.map(i => String(i.sku).trim()));

          setItensQtdConfirmada((prev) => {
            const updated = { ...prev };
            pedido.itens.forEach((item, idx) => {
              const skuItem = String(item.sku).trim();
              const qtdJaConferida = contagemPorSku[skuItem] || 0;
              if (qtdJaConferida > 0) {
                updated[idx] = Math.min(qtdJaConferida, item.quantidade);
              }
            });
            return updated;
          });

          const totalRegistros = embalagens.length;
          if (totalRegistros > 0) {
            showToast(`${totalRegistros} item(ns) ja conferido(s) anteriormente`, 'warning');
          }
        }
      } catch (err) {
        console.error('[WMS] Erro ao verificar itens conferidos:', err);
        showToast('Erro ao verificar conferencias anteriores', 'error');
      } finally {
        setLoadingConferidos(false);
      }
    };

    verificarItensConferidos();
  }, [pedido, showToast]);

  // Auto-focus desktop input when modal opens
  useEffect(() => {
    if (scanningIndex !== null && !isMobile && desktopInputRef.current) {
      desktopInputRef.current.focus();
      setDesktopScanValue('');
    }
  }, [scanningIndex, isMobile]);

  if (!pedido) {
    navigate('/', { replace: true });
    return null;
  }

  const { cabecalho, itens } = pedido;

  const totalItens = itens.length;

  const itensConfirmados = Object.entries(itensQtdConfirmada).filter(
    ([idx, qtd]) => qtd >= itens[idx].quantidade
  ).length;

  const todosConfirmados = itensConfirmados === totalItens && totalItens > 0;
  const progressPct = totalItens > 0 ? (itensConfirmados / totalItens) * 100 : 0;

  const confirmarItemPorIndex = (index, method) => {
    const item = itens[index];

    setItensQtdConfirmada((prev) => {
      const updated = { ...prev };
      if (updated[index] < item.quantidade) {
        updated[index] = updated[index] + 1;
        setFlashIndex(index);
        setTimeout(() => setFlashIndex(null), 400);
        showToast('Item conferido!', 'success');
      } else {
        showToast('Este item ja foi conferido', 'warning');
        return prev;
      }
      return updated;
    });

    registrarEmbalagem({
      idproduto: String(item.sku),
      method,
      numnota: String(cabecalho.numnota),
      user: 'operador',
      chavenota: chave || null,
    }).catch(() => {
      showToast('Erro ao salvar conferencia', 'error');
    });

    setScanningIndex(null);
  };

  const handleProductScan = (code) => {
    if (scanningIndex === null) return;
    const trimmed = code.trim();
    const item = itens[scanningIndex];

    if (item.codigoBarras === trimmed) {
      confirmarItemPorIndex(scanningIndex, 'camera');
    } else {
      showToast('Codigo de barras nao corresponde a este item', 'error');
    }
  };

  const handleManualConfirm = () => {
    if (scanningIndex === null) return;
    confirmarItemPorIndex(scanningIndex, 'manual');
  };

  const handleDesktopScanKeyDown = (e) => {
    if (e.key === 'Enter' && desktopScanValue.trim()) {
      const trimmed = desktopScanValue.trim();
      if (scanningIndex === null) return;
      const item = itens[scanningIndex];

      if (item.codigoBarras === trimmed) {
        confirmarItemPorIndex(scanningIndex, 'leitor');
      } else {
        showToast('Codigo de barras nao corresponde a este item', 'error');
      }
      setDesktopScanValue('');
    }
  };

  const handleFinalizar = () => {
    setShowSuccess(true);
  };

  const handleNovaConferencia = () => {
    setShowSuccess(false);
    navigate('/', { replace: true });
  };

  const handleVoltar = () => {
    navigate('/', { replace: true });
  };

  const scanningItem = scanningIndex !== null ? itens[scanningIndex] : null;

  return (
    <>
      <Header subtitle="Conferencia em andamento" onBack={handleVoltar} />

      <Loading visible={loadingConferidos} text="Verificando itens conferidos..." />

      <Container>
        {/* Cabecalho do pedido */}
        <OrderHeader>
          <ClientId>
            Codigo Cliente: <span>{cabecalho.idclifor}</span>
          </ClientId>
          <ClientName>{cabecalho.nomeCliente}</ClientName>
          <InvoiceNumber>
            <span>Nota:</span>
            <span>{cabecalho.numnota}</span>
          </InvoiceNumber>
          <ChaveDisplay>Chave: {chave}</ChaveDisplay>
        </OrderHeader>

        {/* Progresso */}
        <ProgressSection>
          <ProgressInfo>
            <ProgressLabel>Progresso da conferencia</ProgressLabel>
            <ProgressCount>
              {itensConfirmados} / {totalItens}
            </ProgressCount>
          </ProgressInfo>
          <ProgressBar>
            <ProgressFill style={{ width: `${progressPct}%` }} />
          </ProgressBar>
        </ProgressSection>

        {/* Lista de itens */}
        <ItemsSection>
          <ItemsSectionTitle>Itens do Pedido</ItemsSectionTitle>

          {itens.map((item, index) => {
            const qtdConf = itensQtdConfirmada[index] || 0;
            const isConfirmed = qtdConf >= item.quantidade;
            const isFlashing = flashIndex === index;

            return (
              <ItemCard
                key={index}
                confirmed={isConfirmed}
                flashing={isFlashing}
                clickable={!isConfirmed}
                onClick={() => !isConfirmed && setScanningIndex(index)}
              >
                <ItemImage>
                  <NoImg>&#128230;</NoImg>
                </ItemImage>

                <ItemInfo>
                  <ItemSku>SKU: {item.sku}</ItemSku>
                  <ItemDesc title={item.descricao}>{item.descricao}</ItemDesc>
                  <ItemBarcode>COD: {item.codigoBarras}</ItemBarcode>
                </ItemInfo>

                <ItemStatus>
                  <ItemQty>
                    {qtdConf}/{item.quantidade}
                  </ItemQty>
                  <StatusBadge confirmed={isConfirmed}>
                    {isConfirmed ? 'Conferido' : 'Pendente'}
                  </StatusBadge>
                </ItemStatus>
              </ItemCard>
            );
          })}
        </ItemsSection>

        {/* Botao finalizar */}
        <FinalizeSection>
          <BtnFinalize disabled={!todosConfirmados} onClick={handleFinalizar}>
            {todosConfirmados
              ? 'Confirmar e Finalizar Pacote'
              : `Confirmar e Finalizar (${itensConfirmados}/${totalItens})`}
          </BtnFinalize>
        </FinalizeSection>
      </Container>

      {/* Modal de scanner */}
      {scanningIndex !== null && scanningItem && (
        <ScanModal>
          <ScanModalContent>
            <ScanModalHeader>
              <ScanModalTitle>
                {isMobile ? 'Escanear Item' : 'Leitura de Codigo de Barras'}
              </ScanModalTitle>
              <ScanModalClose onClick={() => setScanningIndex(null)}>
                &#10005;
              </ScanModalClose>
            </ScanModalHeader>

            <ScanModalItem>
              <ScanModalItemName>{scanningItem.descricao}</ScanModalItemName>
              <ScanModalItemCode>COD: {scanningItem.codigoBarras}</ScanModalItemCode>
            </ScanModalItem>

            {isMobile ? (
              <BarcodeScanner
                id="product-scanner"
                onScan={handleProductScan}
              />
            ) : (
              <>
                <DesktopScanLabel>
                  Escaneie o codigo de barras com o leitor USB
                </DesktopScanLabel>
                <DesktopScanInput
                  ref={desktopInputRef}
                  type="text"
                  value={desktopScanValue}
                  onChange={(e) => setDesktopScanValue(e.target.value)}
                  onKeyDown={handleDesktopScanKeyDown}
                  placeholder="Aguardando leitura do codigo de barras..."
                  autoFocus
                />
              </>
            )}

            <BtnManualConfirm onClick={handleManualConfirm}>
              Confirmar Manualmente
            </BtnManualConfirm>
          </ScanModalContent>
        </ScanModal>
      )}

      {/* Modal de sucesso */}
      {showSuccess && (
        <SuccessOverlay>
          <SuccessContent>
            <SuccessIcon>&#10003;</SuccessIcon>
            <SuccessTitle>Pacote Finalizado!</SuccessTitle>
            <SuccessText>
              Todos os itens foram conferidos com sucesso.
            </SuccessText>
            <BtnNewScan onClick={handleNovaConferencia}>
              Nova Conferencia
            </BtnNewScan>
          </SuccessContent>
        </SuccessOverlay>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />
    </>
  );
}
