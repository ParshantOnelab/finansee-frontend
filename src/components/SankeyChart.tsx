import { Sankey } from '@nivo/sankey';
import fullData from './fullSankeyData.json';

const SankeyChart = () => {
  const sankeyData = transformToSankeyData(fullData);

  return (
    <div style={{ width: '100%', height: '1200px', background: '#ffffff',overflow:'hidden' }}>
      <Sankey
        data={sankeyData}
        width={window.innerWidth}
        height={1000}
        margin={{ top: 40, right: 300, bottom: 40, left: 120 }}
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
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        colors={({ id }) => getColorForNode(id)}
        theme={{
          labels: {
            text: {
              fontSize: 16,
              fill: '#000',
            },
          },
          tooltip: {
            container: {
              fontSize: '14px',
              padding: '10px',
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '6px',
            },
          },
        }}
      />
    </div>
  );
};

// Hard-coded consistent colors per category
const getColorForNode = (id: string): string => {
  if (id.includes('Segment') || id.match(/Starters|Professionals|Conservative|Growth/)) return '#dbeafe'; // Light Blue
  if (id === 'Low') return '#a7f3d0';
  if (id === 'Medium') return '#fef9c3';
  if (id === 'High') return '#bfdbfe';
  if ([
    'Overconfidence', 'Loss Aversion', 'Anchoring', 'Availability',
    'Framing', 'Mental Accounting', 'Regret Aversion', 'Representativeness', 'Herding'
  ].includes(id)) return '#fef3c7'; // Soft Yellow
  if ([
    'Smart Beta ETF', 'Capital Protection ETF', 'Robo Advisor Portfolio',
    'Dividend Yield ETF', 'Liquid Fund', 'ESG Fund', 'Retirement Fund', 'Leveraged ETF'
  ].includes(id)) return '#ccfbf1'; // Light Teal
  return '#ddd';
};

function transformToSankeyData(raw: any[]) {
  const nodesSet = new Set<string>();
  const links: { source: string, target: string, value: number }[] = [];

  raw.forEach(row => {
    nodesSet.add(row.segment);
    nodesSet.add(row.risk);
    nodesSet.add(row.bias);
    nodesSet.add(row.product);

    links.push({ source: row.segment, target: row.risk, value: row.segment_count });
    links.push({ source: row.risk, target: row.bias, value: row.segment_count });
    links.push({ source: row.bias, target: row.product, value: row.segment_count });
  });

  const nodes = Array.from(nodesSet).map(id => ({ id }));

  return { nodes, links };
}

export default SankeyChart;

