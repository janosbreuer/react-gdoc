import React from 'react';

export interface GImageProps {
  url?: string;
  base64?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export const GImage: React.FC<GImageProps> = ({ url, base64, width, height, alt }) => {
  return null;
};

