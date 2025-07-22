import { useEffect, useState } from 'react'
import PortfolioCardSection from './CardSection'
import { useGetDataForDifferentRolesQuery } from '../../../store/api';
import img from '../../../assets/advisory/clientS.svg'

import Bar from './Bar'
import PortfolioHeatMap from './PortfolioHeatMap'
import StatusMessage from '../../StatusMessage';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

interface PortfolioUserData {
    kpis: {
        mean_active_biases: string | number;
        clients_trading_complex: string | number;
    };
    clientsInSegment: Record<string, number>;
    chart: Record<string, Record<string, number>>;
}

function PortfolioAdviserDashboard() {


    const [portfolioUserData, setPortfolioUserData] = useState<PortfolioUserData>({
        kpis: {
            mean_active_biases: '',
            clients_trading_complex: '',
        },
        clientsInSegment: {},
        chart: {},
    });

    const isAdminLoggedIn = useSelector((state: RootState) => state.isAdminLoggedIn);
    const storedRole = useSelector((state: RootState) => state.userRole);

    const queryParams = isAdminLoggedIn === "Yes" && storedRole
        ? { entered_role: storedRole, refetchOnMountOrArgChange: true }
        : { refetchOnMountOrArgChange: true };

    const {
        data: dataByRoles,
        isLoading,
        isFetching: isFetchingDataForDifferentRoles,
        isSuccess
    } = useGetDataForDifferentRolesQuery(queryParams);
    // const { data: dataByRoles, isLoading, isFetching: isFetchingDataForDifferentRoles,isSuccess } = useGetDataForDifferentRolesQuery({}, {
    //     refetchOnMountOrArgChange: true,
    // });

    useEffect(() => {
        const data = {
            kpis: {
                mean_active_biases: dataByRoles?.kpis.mean_active_biases,
                clients_trading_complex: dataByRoles?.kpis.clients_trading_complex,
            },
            clientsInSegment: dataByRoles?.kpis.clients_in_segment?.value,
            chart: dataByRoles?.charts.bias_prevalence?.data
        }
        setPortfolioUserData(data)

    }, [dataByRoles, isSuccess]);

    if (isLoading || isFetchingDataForDifferentRoles) {
        return <StatusMessage type="loading" message="Loading Portfolio Adviser dashboard..." />;
    }

    return (
        <div>
            <>
                <PortfolioCardSection role="Portfolio Adviser" data={portfolioUserData?.kpis} />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-6'>
                    <div className="h-full">
                        {portfolioUserData?.clientsInSegment ? (
                            <div className='w-full h-full border rounded-xl overflow-hidden bg-white dark:bg-gray-800 flex flex-col'>
                            <div className="flex items-center mb-4 gap-2">
                                <img src={img} alt={"Active Biases"} className='w-12 h-12' />
                                <h1 className='text-lg font-bold text-gray-800 dark:text-gray-200 '>Clients by Segment</h1>
                            </div>
                            <Bar data={portfolioUserData.clientsInSegment} />
                            </ div>
                        ) : (
                            <StatusMessage type="empty" message="No segment data available." />
                        )}
                    </div>
                    <div className="h-full">
                        {portfolioUserData?.chart ? (
                            <PortfolioHeatMap data={portfolioUserData.chart} />
                        ) : (
                            <StatusMessage type="empty" message="No heatmap data available." />
                        )}
                    </div>
                </div>
            </>
        </div>
    )
}

export default PortfolioAdviserDashboard