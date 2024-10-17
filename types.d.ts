declare module "*.svg" {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
declare module "*.png" {
  const value: any;
  export = value;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare const require: {
  context(directory: string, useSubdirectories?: boolean, regExp?: RegExp): {
    keys: () => string[];
    (key: string): any;
  };
};
