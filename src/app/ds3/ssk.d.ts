// Sellsuki Design System 3.0 — JSX type declarations for ssk-* custom elements.
// ssk-* are Lit web components, so TS/JSX needs to be told these tags exist.
// NOTE: props are typed as `any` here for the prototype. Once the DS 3.0 MCP
// (`Sellsuki Design System3`) / Storybook is connected, tighten these to the
// real prop contracts.
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type SskElement = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  [prop: string]: any;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ssk-theme-provider": SskElement;
      "ssk-heading": SskElement;
      "ssk-text": SskElement;
      "ssk-button": SskElement;
      "ssk-input": SskElement;
      "ssk-checkbox": SskElement;
      "ssk-badge": SskElement;
      "ssk-card": SskElement;
      "ssk-icon": SskElement;
    }
  }
}
