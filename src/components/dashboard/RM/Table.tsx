import React, { useState, useEffect } from 'react';
import { useGetRMRoleDataQuery } from '../../../store/api';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import type { Row } from '@tanstack/react-table';
import HorizontalBars from './Horizontal-bar';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router';

interface Product {
    product_name: string;
    product_id: string;
    knowledge_quiz_score: number;
    knowledge_min_required: number;
    meets_knowledge_requirement: boolean;
}

interface Customer {
    customer_id: string;
    base_knowledge_score: number;
    bias: string;
    products: Product[];
}

const columnHelper = createColumnHelper<Customer>();

function Table() {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState(0);
    const [customersData, setCustomersData] = useState<Customer[]>([]);

    const columns = React.useMemo(() => [
        columnHelper.accessor('customer_id', {
            header: 'Customer ID',
            cell: info => <span>{info.getValue()}</span>,
        }),
        columnHelper.accessor('base_knowledge_score', {
            header: 'Knowledge Score',
            cell: info => (
                <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg text-center">
                    <span className="font-medium dark:text-gray-300">{info.getValue()}</span>
                </div>
            ),
        }),
        {
            id: 'expand',
            header: '',
            cell: ({ row }: { row: Row<Customer> }) => (
                <button
                    onClick={() =>
                        setExpandedRow(
                            expandedRow === row.original.customer_id ? null : row.original.customer_id
                        )
                    }
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label={expandedRow === row.original.customer_id ? 'Collapse' : 'Expand'}
                >
                    <svg
                        className={`w-5 h-5 transition-transform ${expandedRow === row.original.customer_id ? 'rotate-180' : ''
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            ),
            enableSorting: false,
        },
    ], [expandedRow]);

    const navigate = useNavigate()

    const isAdminLoggedIn = useSelector((state: RootState) => state.isAdminLoggedIn);
    const storedRole = useSelector((state: RootState) => state.userRole);

    // Build queryParams for useGetRMRoleDataQuery
    const queryParams = isAdminLoggedIn === "Yes" && storedRole
        ? { pageIndex, entered_role: storedRole }
        : { pageIndex };

    const { data: apiCustomersData, isFetching, isError, isSuccess, error } = useGetRMRoleDataQuery(queryParams, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (error) {
            console.error("API Error:", error);
            navigate('/login');
        }
    }, [error, navigate]);

    useEffect(() => {
        if (isSuccess && apiCustomersData?.charts?.knowledge_quiz_scores?.data) {
            setCustomersData(apiCustomersData.charts.knowledge_quiz_scores.data);
            setTotalPageCount(apiCustomersData.charts.knowledge_quiz_scores.pagination.total_pages || 0);
        }
    }, [isSuccess, apiCustomersData]);

    const table = useReactTable({
        data: customersData || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: totalPageCount,
        state: {
            pagination: {
                pageIndex: pageIndex - 1,
                pageSize: 10,
            },
        },
        onPaginationChange: updater => {
            const newState = typeof updater === 'function' ? updater({ pageIndex: pageIndex - 1, pageSize: 10 }) : updater;
            setPageIndex(newState.pageIndex + 1);
        },
    });

    return (
        <div className='py-6 bg-slate-100 dark:bg-gray-900 overflow-auto'>
            <div className='w-full rounded-lg mx-auto px-2 sm:px-4 md:px-6 lg:px-8'>
                <div className='mt-4 py-5'>
                    <h1 className='font-bold dark:text-white text-gray-700 mb-6 text-2xl'>Segments</h1>
                    <div className='bg-white dark:bg-gray-800 flex flex-col p-4 gap-2'>
                        <div className='flex items-center justify-between border rounded-2xl w-1/4 dark:border-gray-700 p-1'>
                            <div className="relative w-full">
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
                                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className='w-full overflow-x-auto'>
                            {isFetching ? (
                                <div className='flex items-center justify-center h-32'>
                                    <p className='text-gray-500 dark:text-gray-400'>Loading...</p>
                                </div>
                            ) : isError ? (
                                <div className='flex items-center justify-center h-32'>
                                    <p className='text-red-500 dark:text-red-400'>Error: {error && 'status' in error ? error.status : 'Unknown error'}</p>
                                </div>
                            ) : (
                                <table className='w-full'>
                                    <thead>
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id} className='bg-[#00B2B21A]'>
                                                {headerGroup.headers.map(header => (
                                                    <th
                                                        key={header.id}
                                                        className='text-center p-4 font-semibold text-[#206374] dark:text-gray-400'
                                                    >
                                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.map(row => (
                                            <React.Fragment key={row.id}>
                                                <tr className='border-t border-gray-200 dark:border-gray-700'>
                                                    {row.getVisibleCells().map(cell => (
                                                        <td key={cell.id} className='p-4'>
                                                            <div className='flex flex-wrap gap-2 items-center justify-center'>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                                {expandedRow === row.original.customer_id && (
                                                    <tr>
                                                        <td colSpan={row.getVisibleCells().length}>
                                                            <HorizontalBars
                                                                dataset={row.original.products.map(product => ({
                                                                    name: product.product_name,
                                                                    value: product.knowledge_quiz_score
                                                                }))}
                                                                yLabel="Knowledge Assets"
                                                            />
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <button
                            onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
                            disabled={pageIndex === 1 || isFetching}
                            className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
                            disabled={pageIndex >= totalPageCount || isFetching}
                            className="ml-3 px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Page {pageIndex} of {totalPageCount}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;
