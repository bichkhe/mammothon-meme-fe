"use client";
import { useEffect, useRef } from "react";
import { createChart, IChartApi, CandlestickSeries } from "lightweight-charts";
import { ethers } from "ethers";

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
    // console.log("Decoded data array:", decodedDataArray);
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
      const open = parseFloat(
        ethers.formatEther(parseFloat(dayData[0].price || "0"))
      );
      const close = parseFloat(
        ethers.formatEther(parseFloat(dayData[dayData.length - 1].price || "0"))
      );
      const high = parseFloat(
        ethers.formatEther(
          Math.max(...dayData.map((d) => parseFloat(d.price || "0")))
        )
      );
      const low = parseFloat(
        ethers.formatEther(
          Math.min(...dayData.map((d) => parseFloat(d.price || "0")))
        )
      );

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
        priceFormat: {
          type: "custom",
          formatter: (price: number) => price.toFixed(20), // Hiển thị 20 chữ số thập phân
        },
      });

      const data = convertToChartData(decodedDataArray);
      // console.log("Data for chart:", data);
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
