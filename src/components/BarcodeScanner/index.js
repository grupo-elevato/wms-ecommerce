import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Container, ScannerBox, ScanGuide, Fallback } from './styles';

function cleanScannerUI(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Esconder tudo exceto o video
  Array.from(el.querySelectorAll('*')).forEach((child) => {
    if (child.tagName === 'VIDEO') return;
    // Manter o container do video
    if (child.contains(el.querySelector('video'))) return;
    child.style.cssText = 'display:none!important;';
  });

  const video = el.querySelector('video');
  if (video) {
    video.style.cssText =
      'width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;border-radius:12px;';
  }
}

export default function BarcodeScanner({ id, onScan, formats }) {
  const scannerRef = useRef(null);
  const containerRef = useRef(null);
  const lastScanRef = useRef('');
  const lastScanTimeRef = useRef(0);

  useEffect(() => {
    const scanner = new Html5Qrcode(id, { verbose: false });
    scannerRef.current = scanner;

    const defaultFormats = [0, 2, 3, 4, 6, 7, 11];

    const config = {
      fps: 25,
      formatsToSupport: formats || defaultFormats,
      disableFlip: false,
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
      videoConstraints: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    const onSuccess = (decodedText) => {
      const now = Date.now();
      if (decodedText === lastScanRef.current && now - lastScanTimeRef.current < 2000) {
        return;
      }
      lastScanRef.current = decodedText;
      lastScanTimeRef.current = now;
      if (onScan) onScan(decodedText);
    };

    scanner
      .start(
        { facingMode: 'environment' },
        config,
        onSuccess,
        () => {}
      )
      .then(() => {
        // Limpar UI imediatamente
        cleanScannerUI(id);

        // Observer para remover qualquer elemento que a lib injete depois
        const targetEl = document.getElementById(id);
        if (targetEl) {
          const observer = new MutationObserver(() => {
            cleanScannerUI(id);
          });
          observer.observe(targetEl, { childList: true, subtree: true });

          // Guardar referencia para cleanup
          scannerRef.current._observer = observer;
        }
      })
      .catch((err) => {
        console.warn('Camera nao disponivel:', err);
        if (containerRef.current) {
          containerRef.current.dataset.cameraFailed = 'true';
        }
      });

    return () => {
      if (scannerRef.current?._observer) {
        scannerRef.current._observer.disconnect();
      }
      if (scanner.isScanning) {
        scanner.stop().catch(() => {});
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container ref={containerRef}>
      <ScannerBox id={id} />
      <ScanGuide>
        <span />
        <span />
        <span />
        <span />
      </ScanGuide>
      <Fallback className="fallback">
        <div style={{ fontSize: 40, marginBottom: 12 }}>&#128247;</div>
        <div>Camera nao disponivel</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Use o campo abaixo para digitar</div>
      </Fallback>
    </Container>
  );
}
