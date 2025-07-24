



import { useSelector } from 'react-redux';
import CardSection from '../../../components/dashboard/RM/CardSection';
import Table from '../../../components/dashboard/RM/Table';
import { useGetDataForDifferentRolesQuery } from '../../../store/api';
import StatusMessage from '../../StatusMessage';
import type { RootState } from '../../../store/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Utility function to convert object to CSV
function objectToCSV(obj: Record<string, unknown>): string {
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
}

function downloadCSV(csv: string, filename = 'dashboard_data.csv') {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function RMDashboard() {
    const isAdminLoggedIn = useSelector((state: RootState) => state.isAdminLoggedIn);
    const storedRole = useSelector((state: RootState) => state.userRole);
    const navigate = useNavigate();
    const queryParams = isAdminLoggedIn === "Yes" && storedRole
        ? { entered_role: storedRole, refetchOnMountOrArgChange: true }
        : { refetchOnMountOrArgChange: true };

    const {
        data: dataByRoles,
        isLoading,
        isFetching: isFetchingDataForDifferentRoles,
        error
    } = useGetDataForDifferentRolesQuery(queryParams);

    console.log(dataByRoles, 'dataByRoles')
    // 🔁 Redirect on API error
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
        return <StatusMessage type="loading" message="Loading Relationship Manager Dashboard..." />;
    }

    if (!dataByRoles) {
        return <StatusMessage type="empty" message="No data available for Relationship Manager." />;
    }

    const handleExport = () => {
        const csv = objectToCSV(dataByRoles);
        downloadCSV(csv);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        // Flatten the data as in CSV
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
        autoTable(doc, {
            head: [['Field', 'Value']],
            body: rows,
        });
        doc.save('dashboard_data.pdf');
    };

    const cardData = [
        {
            slog: 'clients_in_book',
            value: dataByRoles.kpis?.clients_in_book?.value ?? '-',
        },
        {
            slog: 'clients_with_bias',
            value: dataByRoles.kpis?.clients_with_bias?.value ?? '-',
        },
        {
            slog: 'avg_login_gap',
            value: dataByRoles.kpis?.avg_login_gap?.value ?? '-',
        },
        {
            slog: 'book_avg',
            value: dataByRoles.charts?.portfolio_mix?.data ?? [],
        },
    ];

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
            <CardSection data={cardData} />
            <Table />
        </div>
    );
}

export default RMDashboard;
