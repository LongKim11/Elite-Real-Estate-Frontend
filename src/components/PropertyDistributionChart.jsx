import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';

export const PropertyDistributionChart = () => {
    const propertyData = [
        { type: 'Apartment', count: 320 },
        { type: 'House', count: 480 },
        { type: 'Land', count: 150 }
    ];

    // Chart configuration
    const chartConfig = {
        count: {
            label: 'Number of Properties',
            color: 'hsl(var(--chart-1))'
        }
    };

    // Define a color for each bar
    const barColors = ['#3b82f6', '#8b5cf6', '#10b981'];

    return (
        <div className="w-full rounded-lg border border-slate-200 p-6 shadow-md hover:shadow-lg">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-indigo-700">
                    Property Distribution
                </h2>
                <p className="text-gradient mt-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-lg font-semibold text-transparent">
                    Total Properties:{' '}
                    <span className="font-extrabold">
                        {propertyData.reduce(
                            (sum, item) => sum + item.count,
                            0
                        )}
                    </span>
                </p>
            </div>

            <ChartContainer config={chartConfig} className="min-h-[350px]">
                <BarChart
                    accessibilityLayer
                    data={propertyData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 30,
                        bottom: 10
                    }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="type"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value) => `${value} properties`}
                                labelFormatter={(label) =>
                                    `${label} Properties`
                                }
                            />
                        }
                    />
                    <Bar
                        dataKey="count"
                        radius={[4, 4, 0, 0]}
                        barSize={60}
                        animationDuration={1000}
                    >
                        {propertyData.map((entry, idx) => (
                            <Cell
                                key={entry.type}
                                fill={barColors[idx % barColors.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    );
};
