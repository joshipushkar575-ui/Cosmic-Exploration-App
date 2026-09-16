import '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      color: any;
      group: any;
      line: any;
      lineBasicMaterial: any;
      mesh: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      pointLight: any;
      ringGeometry: any;
      sphereGeometry: any;
    }
  }
}

export {};
