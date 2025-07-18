import React from 'react';
import ReactApexChart from 'react-apexcharts';
const colors = [
    '#008FFB', '#00E396', '#FEB019', '#FF4560',
    '#775DD0', '#3F51B5', '#546E7A', '#D4526E'
];

function Bar({ data }: { data: Record<string, number> }) {
    const categories = Object.keys(data);
    const values = Object.values(data);

    const [state] = React.useState({
        series: [{
            data: [...values]
        }],
        options: {
            chart: {
                height: '100%',
                width: '100%',
                type: 'bar' as const,
                events: {
                    click: function () {
                        // Click event handler (currently unused)
                    }
                },


            },
            colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: '30%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: [
                    ...categories
                ],
                labels: {
                    style: {
                        colors: colors,
                        fontSize: '12px'
                    }
                }
            },
            tooltip: {
                y: {
                    formatter: function (value: number, { dataPointIndex, w }: { dataPointIndex: number, w: { globals: { labels: string[] } } }) {
                        const category = w.globals.labels[dataPointIndex];
                        return `${category}: ${value}`;
                    }
                }
            }
        }
    });

    return (
        <div className="w-full h-[450px] md:h-[550px] lg:h-[650px] rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-3 flex flex-col">
            {/* <div className="flex items-center mb-4 gap-2">
                <img src={img2} alt={"Clients"} className='w-12 h-12' />
                <h1 className='text-lg font-bold text-gray-800 dark:text-gray-200 '>Clients by Segment</h1>
            </div> */}
            <div className="w-full h-full">
                <ReactApexChart options={state.options} series={state.series} type="bar" height="100%" width="100%" />
            </div>
        </div>

    );
}

export default Bar;