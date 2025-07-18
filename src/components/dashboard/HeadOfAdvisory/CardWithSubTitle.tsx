import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

function CardWithSubTitle({
    title,
    value,
    img,
}: {
    title: string;
    value: number | string;
    img?: string;
}) {
    const isGauge = title === "Average Bias Severity";

    // Convert to % for gauge
    const numericValue =
        typeof value === "number" ? Math.min(Math.max(value * 100, 0), 100) : 50;

    const severityLabel = getLabelFromValue(numericValue);

    const gaugeOptions: ApexOptions = {
        chart: {
            type: "radialBar",
            offsetY: 0,
            sparkline: { enabled: true },
            toolbar: { show: false },
        },
        tooltip: {
            enabled: true,
            theme: 'dark',
            y: {
                formatter: (val: number) => `${val.toFixed(1)}%`,
                title: {
                    formatter: () => 'Score'
                }
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: {
                    margin: 0,
                    size: "65%",
                },
                track: {
                    background: "#eee",
                    strokeWidth: "100%",
                },
                dataLabels: {
                    name: { show: false },
                    value: {
                        offsetY: 10,
                        fontSize: "26px",
                        color: "#111",
                        show: true,
                        formatter: () => severityLabel,
                    },
                },
            },
        },
        fill: {
            colors: [getGaugeColor(numericValue)],
        },
        stroke: {
            lineCap: "round",
        },
        labels: [title],
    };

    // Utility: get color class for severity label
    function getSeverityColorClass(val: number): string {
        if (val < 35) return "text-red-500";    // Low: Red
        if (val < 70) return "text-yellow-500"; // Medium: Yellow
        return "text-green-500";                // High: Green
    }

    return (
        <div className="p-5 bg-white dark:bg-gray-800 shadow-md rounded-xl flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300 font-bold dark:text-gray-300">
            {/* Header */}
            <div className="flex items-center gap-2">
                {img && <img src={img} alt={title} className="w-12 h-12" />}
                <h1 className="text-sm md:text-lg font-bold text-gray-800 dark:text-gray-200">
                    {title}
                </h1>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center justify-center w-full h-full">
                {isGauge ? (
                    <>
                        <p
                            className={`text-lg md:text-2xl lg:text-4xl font-semibold mb-2 ${getSeverityColorClass(numericValue)} drop-shadow`}
                        >
                            {numericValue < 20 ? "Low" : numericValue < 60 ? "Medium" : "High"}
                        </p>
                        <ReactApexChart
                            options={gaugeOptions}
                            series={[numericValue]}
                            type="radialBar"
                            height={240}
                        />
                    </>
                ) : (
                    <>
                        <p className="text-sm md:text-xl dark:text-gray-400 mb-1">Total</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white">
                            {value}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

// Utility: convert percentage to label
function getLabelFromValue(val: number): string {
    if (val < 35) return "Low";
    if (val < 70) return "Medium";
    return "High";
}

function getGaugeColor(val: number): string {
    if (val < 35) return "#e74c3c";   // Red
    if (val < 70) return "#f1c40f";   // Yellow
    return "#2ecc71";                 // Green
}

export default CardWithSubTitle;
