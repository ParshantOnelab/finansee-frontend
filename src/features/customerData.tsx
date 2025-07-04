import { useState, useMemo, useEffect } from 'react'
import download from '../assets/download.svg'
import roles from "../constants/roles.json"

type RoleKey = 'Relationship Manager' | 'Head of Advisory' | 'Portfolio Advisory' | 'Compliance Officer';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'

import { useNavigate, useParams } from 'react-router'
import { useGetCustomerByIdQuery } from '../store/api'
import HeatMapChart from '../components/heat-map'
import Button from '@mui/material/Button'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

type CustomerData = {
  product_id: string;
  product_name: string;
  match_score: number;
  product_interest: boolean;
  matched_biases: string[];
  reason: string;
  risk_level: string;
  knowledge_min: number;
}

function CustomerReport() {

  const { uid } = useParams<{ uid: string }>()

  const storedRole = useSelector((state: RootState) => state.userRole)
  
  const roleString : string = storedRole;

  const [customerData, setCustomerData] = useState<CustomerData[]>([]);

  const { data: apiCustomerData, isFetching, isError, isSuccess } = useGetCustomerByIdQuery(uid || '', {
    refetchOnMountOrArgChange: true
  })

  useEffect(() => {
    if (isSuccess && apiCustomerData?.results) {
      const data = apiCustomerData.results.flatMap((item: any) => item.recommendations || []);
      setCustomerData(data);
    }
  }, [apiCustomerData, isSuccess]);

  const columnHelper = createColumnHelper<CustomerData>()

  // Get columns for the current role, fallback to empty array if not found
  const roleColumns = roleString && Object.prototype.hasOwnProperty.call(roles, roleString)
    ? (roles[roleString as RoleKey] as string[])
    : [];

  const allColumns = [
    {
      id: 'product_name',
      accessor: columnHelper.accessor('product_name', {
        header: 'Product',
        cell: info => (
          <div>
            <p className='font-bold'>{info.getValue()}</p>
            <p className="text-gray-500 text-sm">{info.row.original.product_id}</p>
          </div>
        ),
      }),
    },
    {
      id: 'match_score',
      accessor: columnHelper.accessor('match_score', {
        header: 'Match Score',
        cell: info => {
          const score = info.getValue() * 100;
          const colorClass = score >= 80 ? 'text-green-600 dark:text-green-400 bg-[#4696601A] dark:bg-[#46966033]' :
            score >= 60 ? 'text-yellow-600 dark:text-yellow-400 bg-[#C88A001A] dark:bg-[#C88A0033]' :
              'text-red-600 dark:text-red-400 bg-[#C88A001A] dark:bg-[#C88A0033]';
          return (
            <div className='flex'>
              <p className={`font-medium ${colorClass} py-1.5 px-2 rounded-xl`}>{score.toFixed(1)}%</p>
            </div>
          );
        },
      }),
    },
    {
      id: 'risk_level',
      accessor: columnHelper.accessor('risk_level', {
        header: 'Risk Level',
        cell: info => (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.getValue()
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
            {info.getValue() ? 'Yes' : 'No'}
          </div>
        ),
      }),
    },
    {
      id: 'knowledge_min',
      accessor: columnHelper.accessor('knowledge_min', {
        header: 'Knowledge min',
        cell: info => (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.getValue()
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
            {info.getValue() ? 'Yes' : 'No'}
          </div>
        ),
      }),
    },
    {
      id: 'matched_biases',
      accessor: columnHelper.accessor('matched_biases', {
        header: 'Bias Method',
        cell: info => (
          <div className="flex flex-wrap gap-1">
            {info.getValue().map((bias, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
              >
                {bias}
              </span>
            ))}
          </div>
        ),
      }),
    },
    {
      id: 'reason',
      accessor: columnHelper.accessor('reason', {
        header: 'Suitable Reason',
        cell: info => (
          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            {info.getValue()}
          </div>
        ),
      }),
    },
  ];

  // Always show "Product", then filter others by role
  const columns = useMemo(() => {
    return [
      allColumns.find(col => col.id === 'product_name')!.accessor,
      ...allColumns
        .filter(col => col.id !== 'product_name' && roleColumns.includes(col.id))
        .map(col => col.accessor)
    ];
  }, [columnHelper, roleColumns]);

  const table = useReactTable({
    data: customerData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const navigate = useNavigate()
  return (
    <div className='py-6 bg-slate-100 dark:bg-gray-900 overflow-auto'>

      <div className='w-full max-w-[85%] sm:max-w-[100%] md:max-w-[100%] xl:max-w-9xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 mb-4 flex items-center justify-between gap-4'>
        <Button onClick={() => navigate("/dashboard")}>Go Back</Button>
      </div>


      <div className='w-full max-w-[85%] sm:max-w-[100%] md:max-w-[100%] xl:max-w-9xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8'>
        <div className='my-4 py-5 px-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg/10 flex gap-6'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 text-slate-800 dark:text-gray-200'>
                <p className='text-normal font-bold'>Customer-Level Product Recommendation</p>
              </div>

            </div>
            <div className='flex items-center gap-2 md:gap-3 lg:gap-6'>
              <div className='flex items-center gap-2'>
                <p className='text-sm text-slate-500 dark:text-gray-400 font-normal'>Customer ID :</p>
                <p className='font-bold  rounded-lg text-sm whitespace-nowrap'>{uid}</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-sm text-slate-500 dark:text-gray-400 font-normal'>Segment :</p>
                <span className='font-bold px-2 py-1.5 text-[#5C00D3] bg-[#5C00D31A] dark:bg-[#5C00D333] rounded-lg text-sm whitespace-nowrap'>{apiCustomerData?.results[0]?.customer_segment}</span>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-sm text-slate-500 dark:text-gray-400 font-normal'>Risk Profile :</p>
                <span className='font-bold px-2 py-1.5 text-[#C88900] dark:text-[#C88900] bg-[#C88A001A] dark:bg-[#C88A0033] rounded-lg text-sm whitespace-nowrap'>Medium</span>
              </div>
            </div>
            <div>
              <button className='flex items-center gap-2 px-4 py-2 bg-[#00B2B2] text-white rounded-xl hover:bg-blue-600 transition-colors duration-200'>
                <img src={download} alt='download' />
                <p>Export Reports</p>
              </button>
            </div>
          </div>
        </div>

        {isFetching ? (
          <div className='flex items-center justify-center h-32'>
            <p className='text-gray-500 dark:text-gray-400'>Loading...</p>
          </div>
        ) : isError ? (
          <div className='flex items-center justify-center h-32'>
            <p className='text-red-500 dark:text-red-400'>Error loading customer data</p>
          </div>
        ) : (
          <div className='mt-10 border rounded-xl overflow-hidden bg-white dark:bg-gray-800'>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-extrabold dark:text-gray-300 uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className='w-full max-w-[85%] sm:max-w-[100%] md:max-w-[100%] xl:max-w-9xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 mt-10 '>

        <HeatMapChart />
      </div>
    </div>
  )
}

export default CustomerReport;