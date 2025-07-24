

import Bar from '../PortfolioAdviser/Bar';
import HorizontalBars from './HorizontalBar';
import FullBarChart from '../../../components/dashboard/HeadOfAdvisory/BarChart';

import { useGetDataForDifferentRolesQuery } from '../../../store/api';
import StatusMessage from '../../StatusMessage';

import Card from '../PortfolioAdviser/Card';
import CardWithSubTitle from './CardWithSubTitle';

import img1 from '../../../assets/advisory/account-tenure.svg';
import img2 from '../../../assets/advisory/active-biases.svg';
import img3 from '../../../assets/advisory/bias-severity.svg';
import img4 from '../../../assets/advisory/client.svg';
import img5 from '../../../assets/advisory/clients.svg';
import img6 from '../../../assets/advisory/country.svg';
import img7 from '../../../assets/advisory/knowledge-quiz.svg';
import img8 from '../../../assets/advisory/risk-tolerance.svg';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function HeadOfAdvisoryDashboard() {

    const isAdminLoggedIn = useSelector((state: RootState) => state.isAdminLoggedIn);
    const storedRole = useSelector((state: RootState) => state.userRole);

    const roleQueryParam = isAdminLoggedIn === "Yes" && storedRole
        ? { entered_role: storedRole }
        : undefined;

    const {
        data: dataByRoles,
        isLoading,
        isFetching: isFetchingDataForDifferentRoles,
        error,
    } = useGetDataForDifferentRolesQuery(roleQueryParam, {
        skip: !storedRole,
        refetchOnMountOrArgChange: true,
    });

    const navigate = useNavigate()


    useEffect(() => {
        if (!error || typeof error !== 'object' || !('status' in error)) return;

        const statusCode = error.status;

        if (statusCode === 401 || statusCode === 403) {
            console.warn(`Redirecting due to ${statusCode} error`);
            navigate('/login');
        } else {
            console.error("Unhandled API Error:", error);
        }
    }, [error, navigate]);

    // useEffect(() => {
    //     if (error) {
    //         console.error("API Error:", error);
    //         navigate('/login');
    //     }
    // }, [error, navigate]);
    // const {
    //     data: dataByRoles,
    //     isLoading,
    //     isFetching: isFetchingDataForDifferentRoles,
    // } = useGetDataForDifferentRolesQuery({ refetchOnMountOrArgChange: true });

    if (isLoading || isFetchingDataForDifferentRoles) {
        return <StatusMessage type="loading" message="Loading Head of Advisory Dashboard..." />;
    }

    if (!dataByRoles) {
        return <StatusMessage type="empty" message="No data available for Head of Advisory." />;
    }

    const KnowledgeAssets = dataByRoles?.charts?.top_countries?.data
        ? Object.entries(dataByRoles.charts.top_countries.data).map(([name, value]) => ({
            name,
            value: Number(value),
        }))
        : [];

    const data1 = [
        {
            title: 'Total Active Clients',
            value: dataByRoles?.kpis?.clients_with_bias?.value ?? '-',
            img: img4,
        },
        {
            title: 'Average Account Tenure',
            value: dataByRoles?.kpis?.avg_account_tenure?.value ?? '-',
            img: img1,
        },
        {
            title: 'Average Risk Tolerance Score',
            value: dataByRoles?.kpis?.avg_risk_tolerance?.value ?? '-',
            img: img8,
        },
    ];

    const data2 = [
        {
            title: 'Clients with Active Biases',
            value: dataByRoles?.kpis?.clients_with_bias?.value ?? '-',
            img: img2,
        },
        {
            title: 'Average Bias Severity',
            value: dataByRoles?.kpis?.avg_bias_severity?.value ?? '-',
            img: img3,
        },
    ];

    const handleExport = () => {
        if (!dataByRoles) return;
        const objectToCSV = (obj: Record<string, unknown>): string => {
            if (!obj || typeof obj !== 'object') return '';
            const flatten = (data: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
                return Object.keys(data).reduce((acc: Record<string, unknown>, k: string) => {
                    const pre = prefix.length ? prefix + '.' : '';
                    const value = data[k];
                    if (Array.isArray(value)) {
                        acc[pre + k] = JSON.stringify(value);
                    } else if (typeof value === 'object' && value !== null) {
                        Object.assign(acc, flatten(value as Record<string, unknown>, pre + k));
                    } else {
                        acc[pre + k] = value;
                    }
                    return acc;
                }, {} as Record<string, unknown>);
            };
            const flat = flatten(obj);
            const headers = Object.keys(flat);
            const values = headers.map(h => JSON.stringify(flat[h]));
            return headers.join(',') + '\n' + values.join(',');
        };
        const csv = objectToCSV(dataByRoles);
        const downloadCSV = (csv: string, filename = 'dashboard_data.csv') => {
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        };
        downloadCSV(csv);
    };

    const handleExportPDF = () => {
        if (!dataByRoles) return;
        const flatten = (data: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
            return Object.keys(data).reduce((acc: Record<string, unknown>, k: string) => {
                const pre = prefix.length ? prefix + '.' : '';
                const value = data[k];
                if (Array.isArray(value)) {
                    acc[pre + k] = JSON.stringify(value);
                } else if (typeof value === 'object' && value !== null) {
                    Object.assign(acc, flatten(value as Record<string, unknown>, pre + k));
                } else {
                    acc[pre + k] = value;
                }
                return acc;
            }, {} as Record<string, unknown>);
        };
        const flat = flatten(dataByRoles);
        const rows = Object.entries(flat).map(([key, value]) => [key, typeof value === 'string' ? value : JSON.stringify(value)]);
        const doc = new jsPDF();
        autoTable(doc, {
            head: [['Field', 'Value']],
            body: rows,
        });
        doc.save('dashboard_data.pdf');
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex gap-2">
                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Export CSV
                </button>
                <button
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                    Export PDF
                </button>
            </div>
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
                {data1.map((card, index) => (
                    <Card key={index} {...card} />
                ))}
            </div>

            {/* Middle Charts */}
            <div className="flex flex-col gap-6 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-xl bg-white dark:bg-gray-800 p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={img5} alt="Clients by Segment" className="w-12 h-12" />
                            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">Clients by Segment</h1>
                        </div>
                        <Bar data={dataByRoles.charts?.clients_by_segment?.data ?? []} />
                    </div>

                    <div className="border rounded-xl bg-white dark:bg-gray-800 p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={img6} alt="Top Countries" className="w-12 h-12" />
                            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">Top-5 Countries by Client Count</h1>
                        </div>
                        <HorizontalBars dataset={KnowledgeAssets} yLabel="Countries" />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data2.map((card, index) => (
                            <CardWithSubTitle key={index} title={card.title} value={card.value} img={card.img} />
                        ))}
                    </div>

                    <div className="border rounded-xl bg-white dark:bg-gray-800 p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={img7} alt="Quiz Score Distribution" className="w-12 h-12" />
                            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                Knowledge Quiz Score Distribution
                            </h1>
                        </div>
                        <FullBarChart data={dataByRoles.charts?.knowledge_quiz_distribution?.data ?? []} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeadOfAdvisoryDashboard;
