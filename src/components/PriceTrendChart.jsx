import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { format, subMonths } from 'date-fns';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';

export const PriceTrendChart = ({ currentPrice = 100 }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const generatePriceData = () => {
            const currentDate = new Date();
            const priceData = [];

            for (let i = 0; i < 12; i++) {
                const dataPointDate = subMonths(currentDate, i * 3);
                const fluctuationFactor = 0.15 * (1 + i / 12);
                const randomFluctuation =
                    (Math.random() * 2 - 1) * fluctuationFactor;

                const minPricePercentage = 0.3;
                const calculatedPrice =
                    currentPrice * (1 - (randomFluctuation * i) / 3);

                const price = Math.max(
                    calculatedPrice,
                    currentPrice * minPricePercentage
                );
                const formattedDate = format(dataPointDate, 'MM/yyyy');

                priceData.unshift({
                    date: dataPointDate.toISOString(),
                    price: Math.round(price * 100) / 100,
                    formattedDate
                });
            }

            return priceData;
        };

        setData(generatePriceData());
    }, [currentPrice]);

    const calculatePriceChange = () => {
        if (data.length < 2) return { value: 0, percentage: 0 };
        const oldestPrice = data[0].price;
        const currentPriceValue = data[data.length - 1].price;
        const change = currentPriceValue - oldestPrice;
        const percentage = ((change / oldestPrice) * 100).toFixed(1);
        return { value: change, percentage };
    };

    const priceChange = calculatePriceChange();
    const isPriceUp = priceChange.value >= 0;

    return (
        <div className="rounded-lg border border-blue-400 p-4 shadow-sm hover:shadow-lg">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">
                    Property Price Changes Over Time
                </h3>
                <p className="text-sm text-gray-500">
                    Historical quarterly price data (3 years)
                </p>
            </div>

            <ChartContainer
                config={{
                    price: {
                        label: 'Price',
                        color: '#007FFF'
                    }
                }}
                className="h-[300px] w-full"
            >
                <LineChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        left: 20,
                        bottom: 20
                    }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="formattedDate"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        padding={{ left: 30, right: 20 }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) =>
                            value >= 1000
                                ? `$${(value / 1000).toFixed(value % 1000 ? 1 : 0)}K`
                                : `$${value}`
                        }
                        padding={{ left: 0, right: 10 }}
                        domain={['auto', 'auto']}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                formatter={(value) =>
                                    `$${value.toLocaleString()}`
                                }
                            />
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#007FFF"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ChartContainer>

            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-lg font-bold">
                        ${currentPrice.toLocaleString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">3 Year Change</p>
                    <p
                        className={`text-lg font-bold ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {isPriceUp ? '+' : ''}
                        {priceChange.percentage}%
                    </p>
                </div>
            </div>
        </div>
    );
};
