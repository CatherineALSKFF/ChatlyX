declare module 'react-link-preview' {
    import { FC } from 'react';
  
    interface LinkPreviewProps {
      url: string;
      width?: string;
      height?: string;
      description?: boolean;
      image?: boolean;
    }
  
    const LinkPreview: FC<LinkPreviewProps>;
  
    export default LinkPreview;
  }
  