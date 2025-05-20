import React from 'react';
import { Cell, Legend, Pie, PieChart } from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';

export const UserQuotaDistribution = ({ userQuotasCount }) => {
    const quotaData = [
        { name: 'VIP', value: userQuotasCount.VIP, color: '#2a9d90' },
        { name: 'Standard', value: userQuotasCount.STANDARD, color: '#e76e50' },
        { name: 'Basic', value: userQuotasCount.BASIC, color: '#274754' }
    ];
    // Chart configuration
    const chartConfig = {
        VIP: {
            label: 'VIP Users',
            color: quotaData[0].color
        },
        Standard: {
            label: 'Standard Users',
            color: quotaData[1].color
        },
        Basic: {
            label: 'Basic Users',
            color: quotaData[2].color
        }
    };

    // Custom renderer for the legend
    const renderLegend = (props) => {
        const { payload } = props;

        return (
            <ul className="mt-4 flex flex-wrap justify-center gap-6">
                {payload.map((entry, index) => (
                    <li
                        key={`legend-${index}`}
                        className="flex items-center gap-2"
                    >
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm font-medium">
                            {entry.value}
                        </span>
                        <span className="text-muted-foreground text-sm">
                            (
                            {
                                quotaData.find(
                                    (item) => item.name === entry.value
                                )?.value
                            }{' '}
                            users)
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    // Format for tooltip
    const formatTooltip = (value) => {
        return `${value} users`;
    };

    // Calculate total users
    const totalUsers = quotaData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="w-full rounded-lg border border-slate-200 p-6 shadow-md hover:shadow-lg">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-teal-700">
                    User Quota Distribution
                </h2>
                <p className="text-gradient mt-1 bg-gradient-to-r from-yellow-400 via-teal-500 to-gray-400 bg-clip-text text-lg font-semibold text-transparent">
                    Total Users:{' '}
                    <span className="font-extrabold">{totalUsers}</span>
                </p>
            </div>
            <ChartContainer config={chartConfig} className="min-h-[350px]">
                <PieChart>
                    <Pie
                        data={quotaData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        innerRadius={60}
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={2}
                    >
                        {quotaData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <ChartTooltip
                        content={
                            <ChartTooltipContent formatter={formatTooltip} />
                        }
                    />
                    <Legend
                        content={renderLegend}
                        verticalAlign="bottom"
                        align="center"
                    />
                </PieChart>
            </ChartContainer>
        </div>
    );
};
