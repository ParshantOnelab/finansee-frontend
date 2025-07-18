import ReactApexChart from 'react-apexcharts';

// Accepts a prop: { data: Record<string, number> }
interface KnowledgeQuizBarProps {
    data: Record<string, number>;
}

export default function KnowledgeQuizBar({ data }: KnowledgeQuizBarProps) {
    // Extract and sort categories by the starting number
    const sortedCategories = Object.keys(data).sort((a, b) => {
        const aStart = parseInt(a.split('-')[0], 10);
        const bStart = parseInt(b.split('-')[0], 10);
        return aStart - bStart;
    });
    const values = sortedCategories.map(key => data[key]);

    // Generate gradient based on the number of bars
    const generateGradient = (baseColor = [66, 116, 244], count = values.length) => {
        return Array.from({ length: count }, (_, i) => {
            const alpha = 1 - i * (0.08); // darker to lighter
            return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha.toFixed(2)})`;
        });
    };

    const options = {
        chart: {
            type: 'bar' as const,
            height: 300,
            toolbar: { show: false },
            background: 'transparent',
            foreColor: '#333',
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '100%',
                borderRadius: 0,
                distributed: true,
            }
        },
        colors: generateGradient(),
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: sortedCategories,
            labels: { show: true },
            axisBorder: { show: false },
            axisTicks: { show: false },
            title: {
                text: 'Knowledge Quiz',
                offsetY: 10,
                style: {
                    fontWeight: 600,
                    fontSize: '14px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '14px',
                    fontWeight: 500,
                    colors: '#555'
                }
            },
            title: {
                text: 'Score',
                style: {
                    fontWeight: 600,
                    fontSize: '14px'
                }
            }
        },
        grid: {
            show: false
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val}`
            }
        },
        legend: { show: false }
    };

    return (
        <div className="rounded-xl bg-white shadow-md p-4">
            <div className="flex items-center mb-4">
                <div className="text-2xl text-blue-600 mr-2">🔔</div>
                <h2 className="text-lg font-semibold text-gray-800">
                    Knowledge Quiz Score Distribution
                </h2>
            </div>
            <ReactApexChart
                options={options}
                series={[{ name: 'Score', data: values }]}
                type="bar"
                height={300}
            />
        </div>
    );
}
