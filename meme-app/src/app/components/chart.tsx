"use client";
import { useEffect, useRef } from "react";
import { createChart, IChartApi, CandlestickSeries } from "lightweight-charts";

interface DecodedData {
  sender: string;
  eth: string;
  amount: string;
  time: string;
  t_type: string;
  price: string;
}

interface TransactionsProps {
  decodedDataArray: DecodedData[];
}

export default function Chart({ decodedDataArray }: TransactionsProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const convertToChartData = (decodedDataArray: DecodedData[]) => {
    const groupedData = decodedDataArray.reduce(
      (acc, curr) => {
        const date = new Date(parseFloat(curr.time) * 1000)
          .toISOString()
          .split("T")[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(curr);
        return acc;
      },
      {} as Record<string, DecodedData[]>
    );

    const chartData = Object.keys(groupedData).map((date) => {
      const dayData = groupedData[date];
      const open = parseFloat(dayData[0].price);
      const close = parseFloat(dayData[dayData.length - 1].price);
      const high = Math.max(...dayData.map((d) => parseFloat(d.price)));
      const low = Math.min(...dayData.map((d) => parseFloat(d.price)));

      return {
        time: date,
        open,
        high,
        low,
        close,
      };
    });

    return chartData;
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: "#0d0d0d" },
          textColor: "#FFFFFF",
        },
        grid: {
          vertLines: { color: "#444" },
          horzLines: { color: "#444" },
        },
        crosshair: {
          mode: 0,
        },
        rightPriceScale: {
          borderColor: "#666",
        },
        timeScale: {
          borderColor: "#666",
        },
      });

      const candlestickSeries = chartRef.current.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });

      const data = convertToChartData(decodedDataArray);
      candlestickSeries.setData(data);

      chartRef.current.timeScale().fitContent();

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartRef.current?.remove();
      };
    }
  }, [decodedDataArray]);

  return (
    <div className="bg-black mb-4 rounded-lg p-4">
      <div
        ref={chartContainerRef}
        className="w-full"
        style={{ height: "400px" }}
      />
    </div>
  );
}
