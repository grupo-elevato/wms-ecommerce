import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Container, ScannerBox, ScanGuide, Fallback } from './styles';

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
      fps: 20,
      formatsToSupport: formats || defaultFormats,
      disableFlip: false,
      aspectRatio: 1.5,
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
        const el = document.getElementById(id);
        if (!el) return;

        // Esconder TUDO que o html5-qrcode injeta, exceto o video
        const children = el.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.tagName !== 'VIDEO') {
            child.style.display = 'none';
          }
        }

        // Garantir que o video ocupa tudo
        const video = el.querySelector('video');
        if (video) {
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'cover';
          video.style.borderRadius = '12px';
        }
      })
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
      <ScanGuide />
      <Fallback className="fallback">
        <div style={{ fontSize: 40, marginBottom: 12 }}>&#128247;</div>
        <div>Camera nao disponivel</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Use o campo abaixo para digitar</div>
      </Fallback>
    </Container>
  );
}
