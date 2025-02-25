"use client";
import { useEffect, useState } from "react";
import MarketInfo from "@/app/components/market-info";
import Chart from "@/app/components/chart";
import Transactions from "@/app/components/transactions";
import BuyAndSell from "@/app/components/buy-and-sell";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import axios from "axios";

interface CelestiaResponse {
  namespace: string;
  data: string;
  share_version: number;
  commitment: string;
  index: number;
}

interface DecodedData {
  sender: string;
  eth: string;
  amount: string;
  time: string;
  t_type: string;
  price: string;
}

// Function to decode base64 data
const decodeBase64 = (base64: string): DecodedData => {
  const decodedString = atob(base64);
  return JSON.parse(decodedString);
};

// Function to send a request to Celestia Node with JSON-RPC
const getAllFromCelestia = async (
  block_height: number
): Promise<DecodedData[]> => {
  try {
    const requestData = {
      id: 1,
      jsonrpc: "2.0",
      method: "blob.GetAll",
      params: [block_height, ["AAAAAAAAAAAAAAAAAAAAAAAAAAECAwQFBgcICRA="]],
    };

    const response = await axios.post<{ result: CelestiaResponse[] }>(
      `/api/celestia`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Data from Celestia:", response);
    const resultArray = response.data.result;
    const decodedDataArray: DecodedData[] = resultArray.map(
      (item: CelestiaResponse) => {
        const decodedData = decodeBase64(item.data);
        console.log("Data:", decodedData);
        return decodedData;
      }
    );
    return decodedDataArray;
  } catch (error) {
    console.error("Error when send a request to Celestia:", error);
    return [];
  }
};

const MemeMarketPage = () => {
  const searchParams = useSearchParams();
  const addr = searchParams.get("addr");
  const meme = useQuery(api.meme.getMeme, {
    addr: Array.isArray(addr) ? addr[0] : (addr ?? ""),
  });
  const [buyOrSellEvent, setBuyOrSellEvent] = useState(false);
  const getTransaction = useMutation(api.meme.getTransaction);
  const [decodedDataArray, setDecodedDataArray] = useState<DecodedData[]>([]);

  useEffect(() => {
    if (addr) {
      console.log("Component mounted, triggering get transaction event.");
      (async () => {
        const response = await getTransaction({ address: addr });
        console.log("Get transactions response:", response);
        const allDecodedData: DecodedData[] = [];
        for (const transaction of response) {
          console.log("Transaction:", transaction);
          const decodedData = await getAllFromCelestia(
            transaction.block_height
          );
          allDecodedData.push(...decodedData);
          setDecodedDataArray((prevData) => [...prevData, ...decodedData]);
        }
      })();
    }
  }, [addr, getTransaction]);

  useEffect(() => {
    if (buyOrSellEvent && addr) {
      // Thực hiện hành động khi sự kiện từ Buy or Sell kết thúc
      console.log("Buy or Sell event ended, triggering get transaction event.");
      (async () => {
        const response = await getTransaction({ address: addr });
        console.log("Get transactions response:", response);
        const allDecodedData: DecodedData[] = [];
        for (const transaction of response) {
          console.log("Transaction:", transaction);
          const decodedData = await getAllFromCelestia(
            transaction.block_height
          );
          allDecodedData.push(...decodedData);
          setDecodedDataArray((prevData) => [...prevData, ...decodedData]);
        }
      })();
      // Reset lại buyOrSellEvent
      setBuyOrSellEvent(false);
    }
  }, [buyOrSellEvent, addr, getTransaction]);

  if (!meme) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col md:flex-row gap-4 p-4">
        <div className="w-full md:w-3/4">
          <MarketInfo
            icon={meme.icon}
            name={meme.name}
            marketCap={meme.market_cap ?? ""}
            dailyVolume={meme.volume ?? ""}
            allTimeVolume={meme.all_time_vol ?? ""}
          />
          <Chart />
          <Transactions decodedDataArray={decodedDataArray} />
        </div>
        <div className="w-full md:w-1/4">
          <BuyAndSell
            addr={addr ?? ""}
            onEventEnd={() => {
              setBuyOrSellEvent(true);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default MemeMarketPage;
