import React, { useState, useEffect } from 'react'
import productBias from "../constants/productBias.json"
import { useNavigate } from 'react-router'
import { useGetCustomersQuery } from '../store/api'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
} from '@tanstack/react-table'
import Button from '@mui/material/Button'

interface Customer {
  customer_id: string;
  match_score: number;
}

const columnHelper = createColumnHelper<Customer>()

const Segments = [
  "Capital Protection ETF",
  "Nifty50 Index Fund",
  "Smart Beta ETF",
  "Sectoral/Thematic Fund",
  "Quant-based Fund",
  "Dividend Yield ETF",
  "International ETF",
  "Liquid Fund"
]

function Customers() {
  const [segmentOptions, setSegmentOptions] = useState("Capital Protection ETF");
  const [biasOptions, setBiasOptions] = useState("Loss Aversion");
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const columns = React.useMemo(() => [
    columnHelper.accessor('customer_id', {
      header: 'Customer ID',
      cell: info => (
        <div className='flex items-center gap-4 cursor-pointer' onClick={() => navigate(`/dashboard/${info.getValue()}`)}>
          <div className='flex flex-col'>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Customer ID : {info.getValue()}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('match_score', {
      header: 'Match Score',
      cell: info => (
        <div className='flex items-center justify-center'>
          <span className='font-medium dark:text-gray-300'>{info.getValue()}</span>
        </div>
      ),
    }),
  ], [navigate]);

  const { data: apiCustomersData, isFetching, isError, isSuccess, error } = useGetCustomersQuery({ product_name: segmentOptions, bias: biasOptions }, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && apiCustomersData?.matched_customers) {
      setCustomersData(apiCustomersData.matched_customers);
    }
  }, [isSuccess, apiCustomersData, segmentOptions, biasOptions]);

  const table = useReactTable({
    data: customersData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex,
          pageSize,
        });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      }
    },
  })

  return (
    <div className='py-6 bg-slate-100 dark:bg-gray-900 overflow-auto'>
      <div className='w-full max-w-[85%] sm:max-w-[100%] md:max-w-[100%] xl:max-w-9xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8'>

        <Button onClick={()=>navigate("/dashboard")}>Go Back</Button>
        {/* Table */}
        <div className='mt-4 py-5 px-3'>
          <h1 className='font-bold dark:text-white mb-4 text-lg'>Segments</h1>
          <div>
            <div className=''>
              <div className='flex justify-between'>
                {
                  Segments.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center text-gray-500 dark:text-gray-400 justify-between p-3 cursor-pointer ${segmentOptions === item ? 'bg-white dark:bg-gray-800 rounded-t-lg' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      onClick={() => {
                        setSegmentOptions(item);
                        setBiasOptions(productBias[item as keyof typeof productBias][0]);
                      }}
                    >
                      <p className='text-gray-500 dark:text-gray-400 font-bold flex'>{item}</p>
                    </div>
                  ))
                }
              </div>
              <div className='bg-white dark:bg-gray-800 flex flex-col p-4 gap-2'>
                <div className='flex w-full items-center rounded-2xl p-4 justify-between gap-4'>
                  <div className='flex items-center justify-center gap-4 border rounded-2xl w-full dark:border-gray-700 p-3'>
                    {
                      productBias[segmentOptions as keyof typeof productBias]?.map((item: string, index: number) => (
                        <span
                          key={index}
                          className={`w-full flex items-center justify-center font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 ${biasOptions === item ? 'text-blue-500 bg-blue-200 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}
                          onClick={() => setBiasOptions(item)}
                        >
                          {item}
                        </span>
                      ))
                    }
                  </div>
                  <div className='flex items-center justify-between border rounded-2xl w-1/4 dark:border-gray-700 p-3'>
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
                        className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
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
                        <tr>
                          <th className='text-center p-4 font-semibold text-gray-500 dark:text-gray-400'>Customer ID</th>
                          <th className='text-center p-4 font-semibold text-gray-500 dark:text-gray-400'>Match Score</th>
                          <th className='text-center p-4 font-semibold text-gray-500 dark:text-gray-400'>Segment</th>
                          <th className='text-center p-4 font-semibold text-gray-500 dark:text-gray-400'>Risk Profile</th>
                          <th className='text-center p-4 font-semibold text-gray-500 dark:text-gray-400'>Matched Biases</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.getRowModel().rows.map(row => (
                          <tr key={row.id} className='border-t border-gray-200 dark:border-gray-700'>
                            {row.getVisibleCells().map(cell => (
                              <td key={cell.id} className='p-4'>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            ))}
                            <td className='p-4'>
                              <div className='flex flex-wrap items-center justify-center gap-2'>
                                <span className='font-medium dark:text-gray-300 whitespace-nowrap'>Segment :</span>
                                <span className='text-[#5C00D3] bg-[#5C00D31A] dark:bg-[#5C00D333] whitespace-nowrap px-2 py-1.5 rounded-xl text-sm break-words min-w-0'>
                                  {segmentOptions}
                                </span>
                              </div>
                            </td>
                            <td className='p-4'>
                              <div className='flex flex-wrap items-center justify-center gap-2'>
                                <span className='font-medium dark:text-gray-300 whitespace-nowrap'>Risk Profile :</span>
                                <span className={`px-2 py-1.5 rounded-xl text-sm break-words min-w-0 ${row.original.match_score > 0.5 ? 'bg-[#4696601A] dark:bg-[#46966033] text-[#469660] dark:text-[#469660]' : 'text-[#C88900] dark:text-[#C88900] bg-[#C88A001A] dark:bg-[#C88A0033]'}`}>
                                  {row.original.match_score > 0.5 ? "Medium" : "Low"}
                                </span>
                              </div>
                            </td>
                            <td className='p-4'>
                              <div className='flex flex-wrap gap-2 items-center justify-center'>
                                <span className='font-medium text-sm text-[#2E2E2E] dark:text-gray-300 bg-[#F2F2F2] dark:bg-gray-700 px-2 py-1.5 rounded-xl whitespace-nowrap'>
                                  {biasOptions}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
          </div>
        </div>

        {/* <HeatMapChart /> */}
      </div>
    </div>
  )
}

export default Customers;
