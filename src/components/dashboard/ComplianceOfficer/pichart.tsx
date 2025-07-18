import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts';
import img from '../../../assets/compliance/rka.svg'

interface PichartProps {
    data: {
        Pass: number;
        Fail: number;
    }
}

function Pichart({ data }: PichartProps) {
    const series = [
        data.Pass,
        data.Fail
    ];
    const options: ApexOptions = {
        chart: {
            type: 'pie' as const,
        },
        labels: ['Pass', 'Fail'],
        colors: ['#00B2B2', '#F4B400'],
        legend: {
            position: 'bottom',
        },
        dataLabels: {
            enabled: true,
        },
    };

    return (
        <div className='w-full border rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-3 flex flex-col'>
            <div className="flex  items-center mb-4 gap-2">
                <img src={img} alt={"Compliance Alerts Summary"} className='w-12 h-12' />
                <h1 className='text-lg font-bold text-gray-800 dark:text-gray-200 '>RKA Pass/Fail Distribution</h1>
            </div>
            <div className='flex justify-center items-center h-full'>
                <Chart options={options} series={series} type="pie" width={320} />
            </div>
        </div>
    )
}

export default Pichart