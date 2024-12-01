import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: {
      widget: new (config: any) => any;
    };
  }
}

interface TradingViewChartProps {
  symbol: string;
  theme?: 'light' | 'dark';
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol = 'BTC',
  theme = 'light'
}) => {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = (ev) => {
      if (typeof window.TradingView !== 'undefined' && container.current) {
        if (widgetRef.current) {
          container.current.innerHTML = '';
        }
        
        widgetRef.current = new window.TradingView.widget({
          container_id: container.current.id,
          symbol: `BITSTAMP:${symbol}USD`,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: false,
          height: 500,
          width: '100%',
        });
      }
    };

    if (!document.querySelector(`script[src="${script.src}"]`)) {
      document.head.appendChild(script);
    } else {
      script.onload?.(new Event('load'));
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, theme]);

  return (
    <div 
      id="tradingview_widget" 
      ref={container} 
      className="w-full card"
    />
  );
};

export default TradingViewChart;