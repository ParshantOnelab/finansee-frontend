import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import img from '../../../assets/compliance/compliance-alert-summary.svg'

interface ComplianceAlertSummaryProps {
    data: {
        clients_failing_rka: number;
        clients_with_high_leverage: number;
        high_risk_clients: number;
    }
}

const categories = [
    'Clients Failing RKA',
    'High Risk Clients',
    'Clients with High Leverage',
];

const options: ApexOptions = {
    chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
        background: 'transparent',
        foreColor: '#333',
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '80%',
            distributed: true,
            borderRadius: 0,
        },
    },
    colors: ['#00C2B8', '#379392', '#1D4C57'],
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        categories: categories,
        labels: {
            style: {
                fontSize: '13px',
                fontWeight: 500,
                colors: ['#00C2B8', '#379392', '#1D4C57'],
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: {
            style: {
                fontSize: '13px',
                fontWeight: 500,
                colors: '#999',
            },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    grid: {
        show: false,
    },
    tooltip: {
        y: {
            formatter: (val: number) => `${val}`,
        },
    },
    legend: {
        show: false,
    },
};

export default function ComplianceAlertSummary({ data }: ComplianceAlertSummaryProps) {
    const chartData = [
        data.clients_failing_rka,
        data.high_risk_clients,
        data.clients_with_high_leverage
    ];
    return (
        <div className="w-full border rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-3 flex flex-col">
            <div className="flex  items-center mb-4 gap-2">
                <img src={img} alt={"Compliance Alerts Summary"} className='w-12 h-12' />
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 ">
                    Compliance Alerts Summary
                </h2>
            </div>
            <ReactApexChart
                options={options}
                series={[{ name: 'Count', data: chartData }]}
                type="bar"
                height={400}
            />
        </div>
    );
}
