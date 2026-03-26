import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  min-height: 200px;

  /* Esconder linhas vermelhas e overlays do html5-qrcode */
  video {
    object-fit: cover !important;
    border-radius: 12px;
  }

  /* Remover shaded regions (overlay escuro) */
  [style*="border-width"] {
    display: none !important;
  }

  /* Remover scan line e imagens de marcação */
  img[alt="end"],
  img[alt="start"],
  img[src*="data:image"] {
    display: none !important;
  }

  /* Remover dashboard e header */
  [id$="__dashboard_section"],
  [id$="__header_message"] {
    display: none !important;
  }

  /* Remover bordas vermelhas da scan region */
  [id$="__scan_region"] > img {
    display: none !important;
  }

  &[data-camera-failed='true'] {
    .fallback {
      display: flex;
    }
  }
`;

export const ScannerBox = styled.div`
  width: 100%;
  min-height: 200px;
`;

export const Fallback = styled.div`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #1a1a1a;
`;
