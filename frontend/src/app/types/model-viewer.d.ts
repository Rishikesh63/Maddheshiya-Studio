declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        ar?: boolean;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: string | number;
        'environment-image'?: string;
        exposure?: string | number;
        'ios-src'?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        poster?: string;
      },
      HTMLElement
    >;
  }
}