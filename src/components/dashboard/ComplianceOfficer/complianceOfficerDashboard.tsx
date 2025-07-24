
import Card from './Card';
import ComplianceAlertSummary from './ComplianceAlertSummary';
import Pichart from './pichart';
import HorizontalBars from './HorizontalBar';

import img1 from '../../../assets/compliance/avg-leverage.svg';
import img2 from '../../../assets/compliance/avg-max.svg';
import img4 from '../../../assets/compliance/compliance-summary.svg';
import img5 from '../../../assets/compliance/means-rules.svg';
import img6 from '../../../assets/compliance/risk-profile.svg';
import img8 from '../../../assets/compliance/stop-loss.svg';

import { useGetDataForDifferentRolesQuery } from '../../../store/api';
import StatusMessage from '../../StatusMessage';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function ComplianceOfficerDashboard() {
    const isAdminLoggedIn = useSelector((state: RootState) => state.isAdminLoggedIn);
    const storedRole = useSelector((state: RootState) => state.userRole);
    const queryParams = isAdminLoggedIn === "Yes" && storedRole
        ? { entered_role: storedRole, refetchOnMountOrArgChange: true }
        : { refetchOnMountOrArgChange: true };
    const {
        data: dataByRoles,
        isLoading,
        isFetching: isFetchingDataForDifferentRoles, error
    } = useGetDataForDifferentRolesQuery(queryParams);
    const navigate = useNavigate();
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
    if (isLoading || isFetchingDataForDifferentRoles) {
        return <StatusMessage type="loading" message="Loading Compliance Officer Dashboard..." />;
    }
    if (!dataByRoles) {
        return <StatusMessage type="empty" message="No data available for Compliance Officer." />;
    }
    const data1 = [
        {
            title: "Client Using Stop-Loss",
            value: dataByRoles.kpis?.stop_loss_usage_rate?.value ?? "-",
            img: img8,
        },
        {
            title: "Compliance Summary",
            value: dataByRoles.compliance_summary?.overall_compliance_score ?? "-",
            img: img4,
        },
    ];
    const data2 = [
        {
            title: "Mean Rules Failed",
            value: dataByRoles.kpis?.mean_rules_failed?.value ?? "-",
            img: img5,
        },
        {
            title: "Avg. Max Drawdown",
            value: dataByRoles.kpis?.avg_max_drawdown?.value ?? "-",
            img: img2,
        },
        {
            title: "Avg. Leverage Ratio",
            value: dataByRoles.kpis?.avg_leverage_ratio?.value ?? "-",
            img: img1,
        },
    ];
    const rkaData = dataByRoles.charts?.rka_distribution?.data ?? null;
    const alertData = dataByRoles.charts?.compliance_alerts?.data ?? null;
    const riskProfileData = dataByRoles.charts?.risk_profile_distribution?.data ?? null;

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rkaData && <Pichart data={rkaData} />}
                    {alertData && <ComplianceAlertSummary data={alertData} />}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    {data1.map((item, index) => (
                        <Card key={index} title={item.title} value={item.value} img={item.img} />
                    ))}
                </div>
            </div>
            <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data2.map((item, index) => (
                        <Card key={index} title={item.title} value={item.value} img={item.img} />
                    ))}
                </div>
            </div>
            {riskProfileData && (
                <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col font-bold dark:text-gray-300">
                    <div className="flex items-center gap-2 mb-4">
                        <img src={img6} alt="Risk Profile" className="w-12 h-12" />
                        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            Risk Profile Distribution
                        </h1>
                    </div>
                    <HorizontalBars data={riskProfileData} yLabel="Risk Profiles Level" />
                </div>
            )}
        </div>
    );
}

export default ComplianceOfficerDashboard;
