// Type declarations for the @lottiefiles/lottie-player web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lottie-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          background?: string;
          speed?: string | number;
          loop?: boolean | string;
          autoplay?: boolean | string;
          mode?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

export {};
