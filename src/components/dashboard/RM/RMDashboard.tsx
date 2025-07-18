

import { useSelector } from 'react-redux';
import CardSection from '../../../components/dashboard/RM/CardSection';
import Table from '../../../components/dashboard/RM/Table';
import { useGetDataForDifferentRolesQuery } from '../../../store/api';
import StatusMessage from '../../StatusMessage';
import type { RootState } from '../../../store/store';

function RMDashboard() {

    const isAdminLoggedIn = useSelector((state: RootState) => state.isAdminLoggedIn);
    const storedRole = useSelector((state: RootState) => state.userRole);

    const queryParams = isAdminLoggedIn === "Yes" && storedRole
        ? { entered_role: storedRole, refetchOnMountOrArgChange: true }
        : { refetchOnMountOrArgChange: true };

    const {
        data: dataByRoles,
        isLoading,
        isFetching: isFetchingDataForDifferentRoles,
    } = useGetDataForDifferentRolesQuery(queryParams);

    if (isLoading || isFetchingDataForDifferentRoles) {
        return <StatusMessage type="loading" message="Loading Relationship Manager Dashboard..." />;
    }

    if (!dataByRoles) {
        return <StatusMessage type="empty" message="No data available for Relationship Manager." />;
    }

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
            <CardSection data={cardData} />
            <Table />
        </div>
    );
}

export default RMDashboard;
