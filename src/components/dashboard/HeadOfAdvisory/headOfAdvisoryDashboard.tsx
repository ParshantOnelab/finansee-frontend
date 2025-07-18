

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

function HeadOfAdvisoryDashboard() {

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

    return (
        <div>
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
