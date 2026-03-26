import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Container, ScannerBox, Fallback } from './styles';

export default function BarcodeScanner({ id, onScan, width, height, formats }) {
  const scannerRef = useRef(null);
  const containerRef = useRef(null);
  const lastScanRef = useRef('');
  const lastScanTimeRef = useRef(0);

  useEffect(() => {
    const scanner = new Html5Qrcode(id);
    scannerRef.current = scanner;

    const defaultFormats = [0, 2, 3, 4, 6, 7, 11]; // ITF, CODE_128, CODE_39, CODABAR, EAN_13, EAN_8, UPC_A

    const config = {
      fps: 15,
      qrbox: { width: width || 320, height: height || 150 },
      formatsToSupport: formats || defaultFormats,
      disableFlip: false,
      aspectRatio: 1.777,
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
        // Remove linhas vermelhas e shaded regions
        const el = document.getElementById(id);
        if (el) {
          // Remover shaded regions (overlay escuro ao redor da qrbox)
          const shadedRegions = el.querySelectorAll('[style*="border-width"]');
          shadedRegions.forEach((region) => {
            region.style.display = 'none';
          });

          // Remover a borda da scan region (linha vermelha)
          const scanRegion = el.querySelector('#' + id + '__scan_region');
          if (scanRegion) {
            const imgs = scanRegion.querySelectorAll('img');
            imgs.forEach((img) => {
              img.style.display = 'none';
            });
          }

          // Esconder qualquer elemento com borda vermelha/colorida
          const allElements = el.querySelectorAll('*');
          allElements.forEach((child) => {
            const style = child.style;
            if (style.borderColor === 'rgb(255, 0, 0)' || style.border?.includes('red')) {
              style.border = 'none';
            }
          });

          // Remover o texto de "Scanning" e a dash animation
          const dashAnimation = el.querySelector('#' + id + '__dashboard_section');
          if (dashAnimation) {
            dashAnimation.style.display = 'none';
          }

          // Remover header section
          const headerSection = el.querySelector('#' + id + '__header_message');
          if (headerSection) {
            headerSection.style.display = 'none';
          }
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
      <Fallback className="fallback">
        <div style={{ fontSize: 40, marginBottom: 12 }}>&#128247;</div>
        <div>Camera nao disponivel</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Use o campo abaixo para digitar</div>
      </Fallback>
    </Container>
  );
}
