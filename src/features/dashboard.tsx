import { useState, useEffect, useTransition } from 'react'
import userCard from '../assets/user_card.svg'
import productBias from "../constants/productBias.json"
import { useNavigate } from 'react-router'
import { useGetCustomersQuery, useGetTopInsightsQuery } from '../store/api'
import HorizontalBars, { GraphData } from '../components/horizontal-graph'
import { topBiases, topProducts } from '../constants/graphData'
import { useDispatch, useSelector } from 'react-redux'
import { setCustomersData } from '../store/reducers'
import React, { Suspense } from 'react'
import { type RootState } from '../store/store'

const SankeyChart = React.lazy(() => import('../components/SankeyChart'))


import ComplianceOfficerDashboard from '../components/dashboard/ComplianceOfficer/complianceOfficerDashboard'


import HeadOfAdvisoryDashboard from '../components/dashboard/HeadOfAdvisory/headOfAdvisoryDashboard'
import RMDashboard from '../components/dashboard/RM/RMDashboard'
import PortfolioAdviserDashboard from '../components/dashboard/PortfolioAdviser/PortfolioAdviserDashboard'

interface Customer {
    customer_id: string;
    match_score: number;
}


function Dashboard() {
    const [segmentOptions, setSegmentOptions] = useState("Capital Protection ETF");
    const [biasOptions, setBiasOptions] = useState("Loss Aversion");
    const [topInsightsData] = useState({
        top_products: topProducts,
        top_biases: topBiases
    });

    const storedRole = useSelector((state: RootState) => state.userRole)

    const dispatch = useDispatch();
    const { data: apiCustomersData, isFetching, isError, isSuccess, error } = useGetCustomersQuery({ product_name: segmentOptions, bias: biasOptions }, {
        refetchOnMountOrArgChange: true,
        skip: storedRole !== 'Admin'
    });

    const { data: topInsights, isFetching: insightsFetching, isError: errorFetchingInsight, isSuccess: isFetchingInsightSuccess, error: insightError } = useGetTopInsightsQuery({
        refetchOnMountOrArgChange: true,
        skip: storedRole !== 'Admin'
    });
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (isSuccess && apiCustomersData?.matched_customers) {
            dispatch(setCustomersData(apiCustomersData.matched_customers));
        }
    }, [isSuccess, apiCustomersData, dispatch]);

    const navigate = useNavigate();

    const Segments = [
        "Capital Protection ETF",
        "Nifty50 Index Fund",
        "Smart Beta ETF",
        "Sectoral/Thematic Fund",
        "Quant-based Fund",
        "Dividend Yield ETF",
        "International ETF",
        "Liquid Fund"
    ];

    return (
        <div className='py-6 bg-slate-100 dark:bg-gray-900 flex-1'>
            <div className='w-full max-w-[85%] sm:max-w-[100%] md:max-w-[100%]  mx-auto px-2 sm:px-4 md:px-6 lg:px-8 h-full'>
                <h1 className='text-3xl font-bold mb-4'>Dashboard</h1>
                {
                    storedRole === 'Relationship Manager' ? (
                        <RMDashboard />
                    ) : storedRole === "Portfolio Adviser" ? (
                        <PortfolioAdviserDashboard />
                    ) : storedRole === "Head of Advisory" ? (
                        <HeadOfAdvisoryDashboard />
                    ) : storedRole === "Compliance Officer" ? (
                        <ComplianceOfficerDashboard />
                    ) : (
                        <>
                            <div className='min-w-[300px] w-1/3'>
                                <div className="relative">
                                    <svg
                                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search customer"
                                        className="w-full pl-10 pr-4 py-2 border shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C00D3] focus:border-transparent dark:text-white dark:placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Segment section */}
                            <div className='mt-4 py-5 px-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg/10 flex gap-6'>
                                <div className='flex items-center w-full'>
                                    <div className='flex items-center gap-6 flex-1'>
                                        <div className='flex items-center gap-2 text-slate-800 dark:text-gray-200'>
                                            <img src={userCard} alt="userCard" />
                                            <p className='text-normal font-bold'>Segment Product Recommendation</p>
                                        </div>
                                        <div className='flex flex-1 justify-center items-center gap-2'>
                                            <p className='text-sm text-slate-500 dark:text-gray-400 font-normal'>Segment :</p>
                                            <span className='font-bold px-2 py-1.5 text-[#5C00D3] bg-[#5C00D31A] dark:bg-[#5C00D333] rounded-lg text-sm whitespace-nowrap'>{segmentOptions}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className='mt-4 py-5 px-3'>
                                <h1 className='font-bold dark:text-white'>Segments</h1>
                                <div>
                                    <div className=''>
                                        <div className='flex justify-between'>
                                            {
                                                Segments.map((item: string, index: number) => (
                                                    <div
                                                        key={index}
                                                        className={`flex items-center text-gray-500 dark:text-gray-400 justify-between p-3 cursor-pointer ${segmentOptions === item ? 'bg-white dark:bg-gray-800 rounded-t-lg' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                                        onClick={() => {
                                                            startTransition(() => {
                                                                setSegmentOptions(item);
                                                                setBiasOptions(productBias[item as keyof typeof productBias][0]);
                                                            });
                                                        }}
                                                    >
                                                        <p className='text-gray-500 dark:text-gray-400 font-bold flex'>{item}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className='bg-white dark:bg-gray-800 flex p-4 gap-2'>
                                            <div className='flex flex-col w-1/4 border border-gray-200 dark:border-gray-700 rounded-2xl p-4'>
                                                <div className='flex flex-col items-center justify-center gap-4'>
                                                    {
                                                        productBias[segmentOptions as keyof typeof productBias]?.map((item: string, index: number) => (
                                                            <span
                                                                key={index}
                                                                className={`w-full flex items-center justify-center font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 ${biasOptions === item ? 'text-blue-500 bg-blue-200 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}
                                                                onClick={() => startTransition(() => setBiasOptions(item))}
                                                            >
                                                                {item}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            </div>

                                            <div className='w-3/4'>
                                                {
                                                    isFetching ? (
                                                        <div className='flex items-center justify-center h-full'>
                                                            <p className='text-gray-500 dark:text-gray-400'>Loading...</p>
                                                        </div>
                                                    ) : isError ? (
                                                        <div className='flex items-center justify-center h-full'>
                                                            <p className='text-red-500 dark:text-red-400'>Error: {error && 'status' in error ? error.status : 'Unknown error'}</p>
                                                        </div>
                                                    ) : isSuccess && apiCustomersData ? (
                                                        <div className='overflow-x-auto'>
                                                            <div className='flex items-center justify-between mb-4 px-2'>
                                                                <div className="relative">
                                                                    <svg
                                                                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                        />
                                                                    </svg>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search customer"
                                                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                                                    />
                                                                </div>
                                                                <button className='cursor-pointer px-4 py-2 text-pink-400 dark:text-pink-300 border-b-2 font-semibold hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-2xl hover:font-bold transition-all duration-300 ease-in-out' onClick={() => navigate('/dashboard/customers_list')}>
                                                                    View All
                                                                </button>
                                                            </div>
                                                            {
                                                                apiCustomersData?.matched_customers?.map((user: Customer, index: number) => index < 4 && (
                                                                    <div key={index} className='mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg/10 hover:shadow-xl transition-shadow duration-200'>
                                                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                                                                            {/* User Info */}
                                                                            <div className='flex items-center gap-4 cursor-pointer' onClick={() => {

                                                                                navigate(`/dashboard/${user.customer_id}`)
                                                                            }}>
                                                                                <div className='flex flex-col'>
                                                                                    <p className='text-gray-500 dark:text-gray-400 text-sm'>Customer ID : {user.customer_id}</p>
                                                                                </div>
                                                                            </div>

                                                                            {/* Match Score */}
                                                                            <div className='flex items-center justify-center'>
                                                                                <span className='font-medium dark:text-gray-300'>{user.match_score}</span>
                                                                            </div>

                                                                            {/* Segment */}
                                                                            <div className='flex flex-wrap items-center justify-start gap-2'>
                                                                                <span className='font-medium dark:text-gray-300 whitespace-nowrap'>Segment :</span>
                                                                                <span className='text-[#5C00D3] bg-[#5C00D31A] dark:bg-[#5C00D333] whitespace-nowrap px-2 py-1.5 rounded-xl text-sm break-words min-w-0'>
                                                                                    {segmentOptions}
                                                                                </span>
                                                                            </div>

                                                                            {/* Risk Profile */}
                                                                            <div className='flex flex-wrap items-center justify-start gap-2'>
                                                                                <span className='font-medium dark:text-gray-300 whitespace-nowrap'>Risk Profile :</span>
                                                                                <span className={`px-2 py-1.5 rounded-xl text-sm break-words min-w-0 ${user.match_score > 0.5 ? 'bg-[#4696601A] dark:bg-[#46966033] text-[#469660] dark:text-[#469660]' : 'text-[#C88900] dark:text-[#C88900] bg-[#C88A001A] dark:bg-[#C88A0033]'}`}>
                                                                                    {user.match_score > 0.5 ? "Medium" : "Low"}
                                                                                </span>
                                                                            </div>

                                                                            {/* Matched Biases */}
                                                                            <div className='flex flex-wrap gap-2 items-center'>
                                                                                <span className='font-medium text-sm text-[#2E2E2E] dark:text-gray-300 bg-[#F2F2F2] dark:bg-gray-700 px-2 py-1.5 rounded-xl whitespace-nowrap'>
                                                                                    {biasOptions}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    ) : (
                                                        <div className='flex items-center justify-center h-full'>
                                                            <p className='text-gray-500 dark:text-gray-400'>No data available</p>
                                                        </div>
                                                    )
                                                }


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6'>
                                {insightsFetching ? (
                                    <div className="flex items-center justify-center h-32">
                                        <p className="text-gray-500 dark:text-gray-400">Loading insights...</p>
                                    </div>
                                ) : errorFetchingInsight ? (
                                    <div className="flex items-center justify-center h-32">
                                        <p className="text-red-500 dark:text-red-400">
                                            Failed to load insights: {
                                                typeof insightError === 'object' && insightError !== null
                                                    ? // Try to get a message property if it exists, else fallback to stringified error
                                                    ('message' in insightError
                                                        ? (insightError as { message?: string }).message
                                                        : JSON.stringify(insightError))
                                                    : 'Unknown error'
                                            }
                                        </p>
                                    </div>
                                ) : isFetchingInsightSuccess && topInsights ? (
                                    <>
                                        <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg/10'>
                                            <h1 className='font-bold text-xl mb-4'>Top 5 Products by Match Score</h1>
                                            <HorizontalBars dataset={topInsightsData.top_products} colors={['#00B2B2']} yLabel='Products' />
                                            <GraphData data={topInsightsData.top_products} />
                                        </div>

                                        <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg/10'>
                                            <h1 className='font-bold text-xl mb-4'>Top 5 Biases Triggered in Customer Base</h1>
                                            <HorizontalBars dataset={topInsightsData.top_biases} colors={['#4174F4']} yLabel='Biases' />
                                            <GraphData data={topInsightsData.top_biases} />
                                        </div>
                                    </>
                                ) : null}

                            </div>

                            <div className='flex justify-center content-center dark:bg-gray-400'>
                                <Suspense fallback={<div className="text-gray-400 mt-4">Loading Sankey Chart...</div>}>
                                    <SankeyChart />
                                </Suspense>
                            </div>
                        </>
                    )
                }

            </div>
            {/* <Outlet /> */}
            {isPending && <div className="text-gray-400">Updating...</div>}
        </div>
    )
}

export default Dashboard;
