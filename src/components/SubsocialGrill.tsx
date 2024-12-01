import React, { useEffect, useRef } from 'react';
import grill from '@subsocial/grill-widget';

interface SubsocialGrillProps {
  config?: {
    theme?: 'light' | 'dark';
    customCss?: string;
    [key: string]: any;
  };
}

const SubsocialGrill: React.FC<SubsocialGrillProps> = ({ config = {} }) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      grill.init({
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        ...config
      });
      initialized.current = true;
    }

    return () => {
      const grillElement = document.getElementById('grill');
      if (grillElement) {
        grillElement.innerHTML = '';
      }
      initialized.current = false;
    };
  }, [config]);

  return <div id="grill" className="w-full min-h-[500px] card" />;
};

export default SubsocialGrill;