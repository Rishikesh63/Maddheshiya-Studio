import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src: string;
          alt: string;
          ar?: boolean;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          autoplay?: boolean;
          'disable-zoom'?: boolean;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}