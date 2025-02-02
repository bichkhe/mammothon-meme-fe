"use client";
import { useEffect, useRef } from "react";
import { createChart, IChartApi, CandlestickSeries } from "lightweight-charts";

export default function Chart() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

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

      const data = [
        { open: 10, high: 10.63, low: 9.49, close: 9.55, time: "2022-01-17" },
        { open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: "2022-01-18" },
        { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: "2022-01-19" },
        { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: "2022-01-20" },
        { open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: "2022-01-21" },
        {
          open: 10.17,
          high: 10.96,
          low: 10.16,
          close: 10.47,
          time: "2022-01-22",
        },
        {
          open: 10.47,
          high: 11.39,
          low: 10.4,
          close: 10.81,
          time: "2022-01-23",
        },
        {
          open: 10.81,
          high: 11.6,
          low: 10.3,
          close: 10.75,
          time: "2022-01-24",
        },
        {
          open: 10.75,
          high: 11.6,
          low: 10.49,
          close: 10.93,
          time: "2022-01-25",
        },
        {
          open: 10.93,
          high: 11.53,
          low: 10.76,
          close: 10.96,
          time: "2022-01-26",
        },
      ];

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
  }, []);

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
