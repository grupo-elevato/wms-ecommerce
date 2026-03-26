import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Container, ScannerBox, Fallback } from './styles';

export default function BarcodeScanner({ id, onScan, width, height, formats }) {
  const scannerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5Qrcode(id);
    scannerRef.current = scanner;

    const defaultFormats = [0, 2, 3, 4, 6, 7, 11]; // ITF, CODE_128, CODE_39, CODABAR, EAN_13, EAN_8, UPC_A

    const config = {
      fps: 10,
      qrbox: { width: width || 280, height: height || 120 },
      formatsToSupport: formats || defaultFormats,
    };

    scanner
      .start({ facingMode: 'environment' }, config, (decodedText) => {
        if (onScan) onScan(decodedText);
      }, () => {})
      .catch((err) => {
        console.warn('Camera nao disponivel:', err);
        if (containerRef.current) {
          containerRef.current.dataset.cameraFailed = 'true';
        }
      });

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(() => {});
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container ref={containerRef}>
      <ScannerBox id={id} />
      <Fallback className="fallback">
        <div style={{ fontSize: 40, marginBottom: 12 }}>&#128247;</div>
        <div>Camera nao disponivel</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Use o campo abaixo para digitar</div>
      </Fallback>
    </Container>
  );
}
