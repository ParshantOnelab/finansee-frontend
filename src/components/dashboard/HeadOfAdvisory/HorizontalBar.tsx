import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

export default function HorizontalBars({
    dataset,
    yLabel
}: {
    dataset: Array<{ name: string; value: number }>;
    yLabel: string
}) {

    console.log(dataset, "yLabel");
    // Step 1: Sort dataset (optional if you want gradient from lowest to highest)
    const sortedDataset = [...dataset].sort((a, b) => a.value - b.value);

    // Step 2: Generate color gradient
    const generateGradient = (n: number, baseColor = [66, 116, 244]) => {
        return Array.from({ length: n }, (_, i) => {
            const alpha = 0.4 + (i / n) * 0.6; // 0.4 to 1.0 intensity
            return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha.toFixed(2)})`;
        });
    };

    const barColors = generateGradient(dataset.length);

    // Step 3: Map original dataset's order to sorted color intensity
    const colorMap: Record<string, string> = {};
    sortedDataset.forEach((item, index) => {
        colorMap[item.name] = barColors[index];
    });

    const series = [
        {
            name: yLabel,
            data: dataset.map(item => item.value),
        }
    ];

    const categories = dataset.map(item => item.name);
    const orderedColors = dataset.map(item => colorMap[item.name]);

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
                borderRadius: 4,
                barHeight: '60%',
                distributed: true,
            },
        },
        colors: orderedColors, // ✅ Per-bar color assignment
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
            y: {
                formatter: (val: number) => `${val}%`,
            },
        },
        legend: {
            show: false,
        },
    };

    return (
        <div className="w-full h-[450px] md:h-[550px] lg:h-[650px]">
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                // height={400}
            />
        </div>
    );
}
