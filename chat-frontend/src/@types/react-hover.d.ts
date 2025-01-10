declare module 'react-hover' {
    import { ComponentType, ReactNode } from 'react';
  
    interface HoverOptions {
      followCursor?: boolean;
      shiftX?: number;
      shiftY?: number;
    }
  
    interface HoverProps {
      options?: HoverOptions;
      hoverContent: ReactNode;
      children: ReactNode;
    }
  
    const Hover: ComponentType<HoverProps>;
  
    export default Hover;
  }
  