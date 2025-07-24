import { useSelector } from 'react-redux';
import PortfolioCardSection from './CardSection';
import { useGetDataForDifferentRolesQuery } from '../../../store/api';
import img from '../../../assets/advisory/clients.svg';
import Bar from './Bar';
import PortfolioHeatMap from './PortfolioHeatMap';
import StatusMessage from '../../StatusMessage';
import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function PortfolioAdviserDashboard() {
    const isAdminLoggedIn = useSelector((state: RootState) => state.isAdminLoggedIn);
    const storedRole = useSelector((state: RootState) => state.userRole);
    const navigate = useNavigate();
    console.log("PortfolioAdviserDashboard mounted");
    console.log("isAdminLoggedIn:", isAdminLoggedIn, "storedRole:", storedRole);
    const queryParams = isAdminLoggedIn === "Yes" && storedRole
        ? { entered_role: storedRole, refetchOnMountOrArgChange: true }
        : { refetchOnMountOrArgChange: true };

    const {
        data: dataByRoles,
        isLoading,
        isFetching,
        isSuccess,
        error
    } = useGetDataForDifferentRolesQuery(queryParams);

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

    if (isLoading || isFetching || !isSuccess) {
        return <StatusMessage type="loading" message="Loading Portfolio Adviser dashboard..." />;
    }

    if (!dataByRoles) {
        return <StatusMessage type="empty" message="No data available for Portfolio Adviser." />;
    }

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

    console.log("PortfolioAdviserDashboard mounted");
    console.log("isAdminLoggedIn:", isAdminLoggedIn, "storedRole:", storedRole, "queryParams:", queryParams);
    console.log("useGetDataForDifferentRolesQuery result:", { dataByRoles, isLoading, isFetching, isSuccess, error });

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
            <PortfolioCardSection role="Portfolio Adviser" data={dataByRoles.kpis} />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-6'>
                <div className="h-full">
                    {dataByRoles.kpis?.clients_in_segment?.value ? (
                        <div className='w-full h-full border rounded-xl overflow-hidden bg-white dark:bg-gray-800 flex flex-col p-3'>
                            <div className="flex items-center mb-4 gap-2">
                                <img src={img} alt={"Active Biases"} className='w-12 h-12' />
                                <h1 className='text-lg font-bold text-gray-800 dark:text-gray-200 '>Clients by Segment</h1>
                            </div>
                            <Bar data={dataByRoles.kpis.clients_in_segment.value} />
                        </div>
                    ) : (
                        <StatusMessage type="empty" message="No segment data available." />
                    )}
                </div>
                <div className="h-full">
                    {dataByRoles.charts?.bias_prevalence?.data ? (
                        <PortfolioHeatMap data={dataByRoles.charts.bias_prevalence.data} />
                    ) : (
                        <StatusMessage type="empty" message="No heatmap data available." />
                    )}
                </div>
            </div>
        </div>
    );
}

export default PortfolioAdviserDashboard;