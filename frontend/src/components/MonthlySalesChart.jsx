import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';

export const MonthlySalesChart = () => {
    // Sample monthly revenue data
    const revenueData = [
        { month: 'Jan', revenue: 12500 },
        { month: 'Feb', revenue: 18200 },
        { month: 'Mar', revenue: 15800 },
        { month: 'Apr', revenue: 22000 },
        { month: 'May', revenue: 19500 },
        { month: 'Jun', revenue: 24800 },
        { month: 'Jul', revenue: 28000 },
        { month: 'Aug', revenue: 25600 },
        { month: 'Sep', revenue: 30200 },
        { month: 'Oct', revenue: 27800 },
        { month: 'Nov', revenue: 32500 },
        { month: 'Dec', revenue: 38000 }
    ];

    // Chart configuration
    const chartConfig = {
        revenue: {
            label: 'Revenue',
            color: '#4ade80'
        }
    };

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="w-full rounded-lg border border-slate-200 p-6 shadow-md hover:shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-green-500">
                Monthly Revenue
            </h2>
            <ChartContainer
                config={chartConfig}
                className="max-h-[300px] w-full"
            >
                <LineChart
                    accessibilityLayer
                    data={revenueData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 30,
                        bottom: 10
                    }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        padding={{ left: 30 }}
                    />
                    <YAxis
                        tickFormatter={formatCurrency}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value) => formatCurrency(value)}
                            />
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#4ade80"
                        strokeWidth={2}
                        dot={{
                            r: 4,
                            strokeWidth: 2,
                            fill: 'white',
                            stroke: '#4ade80'
                        }}
                        activeDot={{
                            r: 6,
                            strokeWidth: 2,
                            fill: 'white',
                            stroke: '#4ade80'
                        }}
                    />
                </LineChart>
            </ChartContainer>
        </div>
    );
};
