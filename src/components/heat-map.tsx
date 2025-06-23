import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

const inputData = [
    {
        product_id: 'P001',
        product_name: 'Capital Protection ETF',
        match_score: 0.857,
        product_interest: false,
        matched_biases: ['Loss Aversion', 'Anchoring'],
        reason: 'Bias: Loss Aversion, Anchoring | Risk: Low | Knowledge Min: 30'
    },
    {
        product_id: 'P008',
        product_name: 'Liquid Fund',
        match_score: 0.807,
        product_interest: false,
        matched_biases: ['Loss Aversion'],
        reason: 'Bias: Loss Aversion | Risk: Low | Knowledge Min: 20'
    },
    {
        product_id: 'P006',
        product_name: 'Dividend Yield ETF',
        match_score: 0.717,
        product_interest: false,
        matched_biases: ['Loss Aversion'],
        reason: 'Bias: Loss Aversion | Risk: Medium | Knowledge Min: 45'
    }
];

// Step 1: Extract all unique biases (Y-axis categories)
const allBiases = Array.from(
    new Set(inputData.flatMap(item => item.matched_biases))
);

// Step 2: Extract all unique product names (X-axis categories)
const allProducts = inputData.map(item => item.product_name);

// Step 3: Create a heatmap data series for each bias
const createSeries = () => {
    return allBiases.map(bias => {
        const data = allProducts.map(product => {
            const item = inputData.find(
                d => d.product_name === product && d.matched_biases.includes(bias)
            );
            return {
                x: product,
                y: item ? item.match_score * 100 : 0
            };
        });
        return {
            name: bias,
            data
        };
    });
};

const HeatMapChart: React.FC = () => {
    const series = createSeries();

    const options: ApexOptions = {
        chart: {
            type: 'heatmap',
            height: 350,
            toolbar: {
                show: true
            },
            background: 'transparent',
            foreColor: '#9ca3af'
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#008FFB'],
        title: {
            text: 'Bias Alignment Heatmap',
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#9ca3af'
            }
        },
        subtitle: {
            text: 'Shows which biases each product addresses',
            style: {
                fontSize: '12px',
                color: '#9ca3af'
            }
        },
        xaxis: {
            categories: allProducts,
            labels: {
                show: true,
                rotate: -45,
                style: {
                    fontSize: '15px',
                    fontWeight: 600,
                    colors: '#9ca3af'
                }
            },
            axisBorder: {
                show: true,
                color: '#374151'
            },
            axisTicks: {
                show: true,
                color: '#374151'
            }
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.4,
                radius: 4,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        {
                            from: 0,
                            to: 50,
                            name: 'Low',
                            color: '#ef4444'
                        },
                        {
                            from: 51,
                            to: 75,
                            name: 'Medium',
                            color: '#f59e0b'
                        },
                        {
                            from: 76,
                            to: 100,
                            name: 'High',
                            color: '#10b981'
                        }
                    ]
                }
            }
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    fontSize: '15px',
                    fontWeight: 400,
                    colors: '#9ca3af'
                }
            },
            axisBorder: {
                show: true,
                color: '#374151'
            },
            axisTicks: {
                show: true,
                color: '#374151'
            }
        },
        grid: {
            borderColor: '#374151',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        tooltip: {
            theme: 'dark',
            style: {
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif'
            }
        }
    };

    return (
        <div className="w-full border rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-3">
            <div id="chart" className="dark:text-gray-200">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="heatmap"
                    height={350}
                    className="dark:text-white"
                />
            </div>
        </div>
    );
};

export default HeatMapChart;
