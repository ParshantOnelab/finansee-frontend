
import Card from './Card'

import Active from "../../../assets/card/active.svg"
import Book from "../../../assets/card/book.svg"
import Clients from "../../../assets/card/clients.svg"
import Login_Gap from "../../../assets/card/login_gap.svg"
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

// Add types for props
type CardSectionProps = {
    data: Array<{
        slog: string;
        value: number | Array<{ label: string; value: number }>;
    }>;
};

// Color mapping for RingChart
const colorMap: Record<string, string> = {
    Cash: "#00B2B2",
    ETF: "#206374",
    Stocks: "#A8FFFF",
};

// Update RingChart to accept segments as prop
type RingChartProps = {
    segments: Array<{ percent: number; color: string; label: string }>;
};

// Remove the custom RingChart and replace with ApexCharts version

function ApexRingChart({ segments }: RingChartProps) {
  const series = segments.map(seg => seg.percent);
  const labels = segments.map(seg => seg.label);
  const colors = segments.map(seg => seg.color);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      height: 140,
      width: 140,
      sparkline: { enabled: true }
    },
    stroke: {
      width: 0
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      y: {
        formatter: (val: number) => `${val}%`,
        title: {
          formatter: (_seriesName: string, { seriesIndex }) => labels[seriesIndex]
        }
      }
    },
    labels,
    colors,
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center w-[140px] h-[140px]">
      <ReactApexChart options={options} series={series} type="donut" height={140} width={140} />
    </div>
  );
}



function CardSection({ data }: CardSectionProps) {

    // Map incoming data to cards
    const cardMeta = [
        { slog: "clients_in_book", title: "No. of Clients", img: Clients },
        { slog: "avg_login_gap", title: "Avg. Login Gap", img: Login_Gap },
        { slog: "clients_with_bias", title: "Clients With Active Biases", img: Active },
    ];

    const cardData = cardMeta.map(meta => {
        const found = data.find(d => d.slog === meta.slog);
        let value: string | number = "-";
        if (found) {
            if (Array.isArray(found.value)) {
                value = "-"; // fallback, shouldn't happen for these cards
            } else {
                value = found.value;
            }
        }
        return {
            title: meta.title,
            value,
            img: meta.img,
        };
    });

    // Extract book_avg for the ring chart
    const bookAvg = data.find(d => d.slog === "book_avg");
    const bookAvgValues = Array.isArray(bookAvg?.value) ? bookAvg.value : [];

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
            {cardData.map((card, index) => (
                <Card key={index} {...card} />
            ))}

            <div className='p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col gap-4 font-bold dark:text-gray-300'>
                <div className='flex items-center gap-2'>
                    <img src={Book} alt="Book" className='w-12 h-12' />
                    <h1 className='text-xl'>My Book Avg.</h1>
                </div>

                <div className="flex items-center justify-between px-2">
                    <ul className='gap-2 flex flex-col text-sm font-medium'>
                        {bookAvgValues.map((item) => (
                            <li className='flex items-center gap-2' key={item.label}>
                                <span className='rounded-full w-4 h-4' style={{ backgroundColor: colorMap[item.label] || "#ccc" }}></span>
                                <p className='text-lg font-semibold'>{item.label}</p>
                            </li>
                        ))}
                    </ul>

                    <ApexRingChart
                        segments={bookAvgValues.map(item => ({
                            percent: item.value,
                            color: colorMap[item.label] || "#ccc",
                            label: item.label,
                        }))}
                    />
                </div>
            </div>
        </div>
    );
}

export default CardSection
