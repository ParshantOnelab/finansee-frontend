import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

export default function HorizontalBars({
    data,
    yLabel
}: {
    data: Record<string | number, number>;
    yLabel?: string
}) {
    // Convert data object to array for plotting
    const categories = Object.keys(data);
    const values = Object.values(data);

    // Generate color gradient for bars
    const generateGradient = (n: number, baseColor = [45, 116, 144]) => {
        return Array.from({ length: n }, (_, i) => {
            const alpha = 0.4 + (i / n) * 0.6; // 0.4 to 1.0 intensity
            return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha.toFixed(2)})`;
        });
    };
    const barColors = generateGradient(categories.length);

    const series = [
        {
            data: values,
        }
    ];

    const options: ApexOptions = {
        chart: {
            type: 'bar',
            height: 400,
            toolbar: { show: false },
            background: 'transparent',
            foreColor: '#9ca3af',
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 0,
                barHeight: '60%',
                distributed: true,
            },
        },
        colors: barColors,
        dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val}%`,
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                colors: ['#333']
            }
        },
        xaxis: {
            categories,
            labels: {
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    colors: '#666',
                },
            },
        },
        yaxis: {
            title: {
                text: yLabel,
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                },

            },
            labels: {
                show: false, // Hide y-axis labels only
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                },
            },
        },
        grid: {
            show: false,
        },
        tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex }) {
                const level = categories[dataPointIndex];
                const value = series[seriesIndex][dataPointIndex];
                return `<div style="padding:8px;">
                    <strong>Level: ${level}</strong>,Value: ${value}%
                </div>`;
            }
        },
        legend: {
            show: false,
        },
    };

    return (
        <div className="w-full">
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={400}
            />
        </div>
    );
}
