import { useRef, useState, useEffect } from 'react';
import { Sankey } from '@nivo/sankey';
import { useSankeyChatDataQuery } from '../store/api';
import { useTheme } from './theme-provider';

interface SankeyApiData {
  segment: string;
  risk: string;
  top_bias: string;
  product: string;
  segment_count: number;
}

const SankeyChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(800);
  const { data, isLoading } = useSankeyChatDataQuery({});
  const { theme } = useTheme();

  // Set width and height after short delay on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        const newHeight = containerRef.current.offsetHeight;
        if (newWidth && newHeight) {
          setWidth(newWidth);
          setHeight(newHeight);
        }
      }
    }, 100); // 100ms delay gives DOM time to mount

    return () => clearTimeout(timeout);
  }, []);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
        setHeight(containerRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!data || data.length === 0) return <div>No data to display.</div>;

  const sankeyData = transformToSankeyData(data);

  const chartBg = 'var(--color-card)';
  const chartText = 'var(--color-card-foreground)';
  const tooltipBg = 'var(--color-popover)';
  const tooltipText = 'var(--color-popover-foreground)';
  const tooltipBorder = 'var(--color-border)';

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '1000px', // You can make this dynamic if needed
        background: chartBg,
        color: chartText,
        overflow: 'hidden',
      }}
    >
      {width > 0 && height > 0 && (
        <Sankey
          data={sankeyData}
          width={width}
          height={height}
          margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
          align="justify"
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.1}
          nodeBorderWidth={1}
          nodeBorderRadius={6}
          nodeInnerPadding={8}
          nodeThickness={22}
          nodeSpacing={36}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.15}
          linkBlendMode="normal"
          enableLinkGradient={false}
          labelPosition="inside"
          labelOrientation="horizontal"
          labelPadding={14}
          labelTextColor={theme === 'dark' ? '#fff' : '#000'}
          colors={({ id }) => getColorForNode(id, theme)}
          theme={{
            labels: {
              text: {
                fontSize: 16,
                fill: theme === 'dark' ? '#fff' : '#000',
              },
            },
            tooltip: {
              container: {
                fontSize: '14px',
                padding: '10px',
                background: tooltipBg,
                color: tooltipText,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '6px',
              },
            },
          }}
        />
      )}
    </div>
  );
};

const getColorForNode = (id: string, theme?: string): string => {
  const isDark = theme === 'dark';

  if (/Segment|Starters|Professionals|Conservative|Growth/.test(id)) return isDark ? '#334155' : '#dbeafe';
  if (id === 'Low') return isDark ? '#064e3b' : '#a7f3d0';
  if (id === 'Medium') return isDark ? '#facc15' : '#fef9c3';
  if (id === 'High') return isDark ? '#2563eb' : '#bfdbfe';
  if (
    ['Overconfidence', 'Loss Aversion', 'Anchoring', 'Availability', 'Framing', 'Mental Accounting', 'Regret Aversion', 'Representativeness', 'Herding'].includes(id)
  )
    return isDark ? '#f59e42' : '#fef3c7';
  if (
    ['Smart Beta ETF', 'Capital Protection ETF', 'Robo Advisor Portfolio', 'Dividend Yield ETF', 'Liquid Fund', 'ESG Fund', 'Retirement Fund', 'Leveraged ETF'].includes(id)
  )
    return isDark ? '#0e7490' : '#ccfbf1';
  return isDark ? '#64748b' : '#ddd';
};

function transformToSankeyData(raw: SankeyApiData[]) {
  const nodesSet = new Set<string>();
  const links: { source: string; target: string; value: number }[] = [];

  raw.forEach(row => {
    nodesSet.add(row.segment);
    nodesSet.add(row.risk);
    nodesSet.add(row.top_bias);
    nodesSet.add(row.product);

    links.push({ source: row.segment, target: row.risk, value: row.segment_count });
    links.push({ source: row.risk, target: row.top_bias, value: row.segment_count });
    links.push({ source: row.top_bias, target: row.product, value: row.segment_count });
  });

  const nodes = Array.from(nodesSet).map(id => ({ id }));
  return { nodes, links };
}

export default SankeyChart;
