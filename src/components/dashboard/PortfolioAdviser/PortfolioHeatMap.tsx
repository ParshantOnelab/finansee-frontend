import  { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import img from '../../../assets/portfolio/heat-map.svg';
type HeatMapData = Record<string, Record<string, number>>;

function useResponsiveHeight() {
    const [height, setHeight] = useState(650);
    useEffect(() => {
        function updateHeight() {
            if (window.innerWidth >= 1024) {
                setHeight(650); // lg
            } else if (window.innerWidth >= 768) {
                setHeight(550); // md
            } else {
                setHeight(450); // base
            }
        }
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);
    return height;
}

function PortfolioHeatMap({ data }: { data: HeatMapData }) {
    // X-axis: segment names
    const allSegments = Object.keys(data);

    // Y-axis: all unique biases
    const allBiasesSet = new Set<string>();
    allSegments.forEach(segment => {
        Object.keys(data[segment] || {}).forEach(bias => allBiasesSet.add(bias));
    });
    const allBiases = Array.from(allBiasesSet);

    // Build series: one for each bias (Y), with data for each segment (X)
    const series = allBiases.map(bias => ({
        name: bias,
        data: allSegments.map(segment => ({
            x: segment,
            y: (data[segment]?.[bias] ?? 0) * 100, // scale to 0-100
        })),
    }));

    const options: ApexOptions = {
        chart: {
            type: 'heatmap',
            toolbar: { show: true },
            background: 'transparent',
            foreColor: '#9ca3af'
        },
        dataLabels: { enabled: false },
        colors: ['#008FFB'],
        title: {
            // text: 'Bias Prevalence Heat-map',
            align: 'left',
            style: { fontSize: '16px', fontWeight: 'bold', color: '#9ca3af' }
        },
        xaxis: {
            categories: allSegments,
            labels: {
                show: true,
                rotate: -45,
                style: { fontSize: '15px', fontWeight: 600, colors: '#9ca3af' }
            },
            axisBorder: { show: true, color: '#374151' },
            axisTicks: { show: true, color: '#374151' }
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.4,
                radius: 4,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        { from: 0, to: 30, name: 'Low', color: '#ef4444' },
                        { from: 31, to: 65, name: 'Medium', color: '#f59e0b' },
                        { from: 66, to: 100, name: 'High', color: '#10b981' }
                    ]
                }
            }
        },
        yaxis: {
            labels: {
                show: true,
                style: { fontSize: '15px', fontWeight: 400, colors: '#9ca3af' }
            },
            axisBorder: { show: true, color: '#374151' },
            axisTicks: { show: true, color: '#374151' }
        },
        grid: {
            borderColor: '#374151',
            strokeDashArray: 4,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } }
        },
        tooltip: {
            theme: 'dark',
            style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' }
        }
    };

    const chartHeight = useResponsiveHeight();

    return (
        <div className="w-full  border rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-3">
            <div className="flex items-center mb-4 gap-2">
                <img src={img} alt={"Clients"} className='w-12 h-12' />
                <h1 className='text-lg font-bold text-gray-800 dark:text-gray-200 '>Clients by Segment</h1>
            </div>
            <div id="chart" className="dark:text-gray-200 h-full">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="heatmap"
                    height={chartHeight}
                    className="dark:text-white"
                />
            </div>
        </div>
    );
}

export default PortfolioHeatMap;