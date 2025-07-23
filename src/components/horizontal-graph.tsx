import { BarChart } from '@mui/x-charts/BarChart';
import { valueFormatter } from '../constants/graphData';

const chartSetting = {
  height: 400,
};
export default function HorizontalBars({
  dataset, colors, yLabel
}: {
  dataset: Array<{ name: string; value: number }>;
  colors?: string[];
  yLabel: string
}) {
  return (
    <BarChart
      className='text-red-200 '
      dataset={dataset}
      colors={colors}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      hideLegend
      // width={900}
      yAxis={[
        {
          scaleType: 'band',
          dataKey: 'name',
          label: yLabel,
          // tickLabelPlacement:'tick',
          // offset: 60, // adjust as needed
          labelStyle: {
            fontSize: 14,
            fontWeight: 600,
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'initial',
          },
          tickLabelStyle: {
            fontSize: 14,
            fontWeight: 600,
            // width: '10px', // adjust width as needed
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'initial',
            fill: '#666', 
          },
          disableLine: true,
          disableTicks: true,
          fill: '#949294',
        }
      ]}
      xAxis={[
        {
          dataKey: 'value',
          valueFormatter: (value: string) => `${value}%`,  // format as percentage
          stroke: 'white',
          disableLine: true,
          disableTicks: true,                    // hide axis line (if on white background)
          fill: '#949294',
          tickLabelStyle: {
            fontSize: 12,
            fill: '#666',                          // color of % labels (adjust as needed)
          },
          label: '',                                // optional label
        },
      ]}
      series={[{ dataKey: 'value', label: 'Customer %', valueFormatter }]}
      layout="horizontal"
      {...chartSetting}
    />
  );
}

export const GraphData = ({ data }: { data: Array<{ name: string, value: number }> }) => {
  return (
    <div>
      <ul className='flex justify-around'>
        {data.map((product, index) => (
          <li key={index} className='flex flex-col items-center justify-between py-2 px-4 '>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-slate-500 tracking-wide dark:text-gray-200'>{product.name}</span>
            </div>
            <span className='text-lg font-semibold'>{product.value}%</span>

          </li>))
        }
      </ul>
    </div>
  )
}