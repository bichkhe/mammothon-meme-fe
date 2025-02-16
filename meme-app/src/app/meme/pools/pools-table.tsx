import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export interface PoolsTableProps {
  data: TableProps[];
}
export interface TableProps {
  coinId: string;
  coinIconUrl: string;
  allTimeVolume: number;
  volume24h: number;
  tvl: number;
  dpr: number;
}

const PoolsTable: React.FC<PoolsTableProps> = ({ data }) => {
  return (
    <Table>
      <TableCaption>POOLS.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[50px]">POOL</TableHead>
          <TableHead>ALL-TIME VOLUME</TableHead>
          <TableHead>24H VOL</TableHead>
          <TableHead>TVL</TableHead>
          <TableHead className="text-right">DPR</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.coinId}>
            <TableCell className="font-medium">
              <Image
                src={row.coinIconUrl || ""}
                alt="icon"
                width={16}
                height={16}
              />
            </TableCell>
            <TableCell>{row.allTimeVolume} APT</TableCell>
            <TableCell>{row.volume24h} APT</TableCell>
            <TableCell>{row.tvl} APT</TableCell>
            <TableCell className="text-right">{row.dpr}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PoolsTable;
