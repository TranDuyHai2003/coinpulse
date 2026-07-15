"use client";

import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import DataTable from "./DataTable";

interface ExchangeListingsProps {
  tickers: any[]; // Bạn có thể định nghĩa kiểu dữ liệu chặt chẽ hơn nếu muốn
}

export default function ExchangeListings({ tickers }: ExchangeListingsProps) {
  // 1. Định nghĩa các cột cho bảng sàn giao dịch
  const columns = [
    {
      header: "Exchange",
      cellClassName: "font-semibold text-white flex items-center gap-2",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          {item.market?.logo && (
            <Image
              src={item.market.logo}
              alt={item.market.name}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span>{item.market?.name}</span>
        </div>
      ),
    },
    {
      header: "Pair",
      cellClassName: "text-purple-100/70",
      cell: (item: any) => `${item.base}/${item.target}`,
    },
    {
      header: "Price",
      cellClassName: "text-right font-medium text-white",
      cell: (item: any) => formatCurrency(item.last),
    },
    {
      header: "Volume (24h)",
      cellClassName: "text-right text-purple-100/70",
      cell: (item: any) => formatCurrency(item.volume),
    },
  ];

  // Lọc lấy 5-10 sàn giao dịch uy tín nhất (CoinGecko thường sắp xếp theo độ tin cậy trust_score)
  const topTickers = tickers?.slice(0, 5) || [];

  return (
    <div id="exchange-listings" className="mt-6">
      <h4 className="text-lg font-bold text-white mb-3">Exchange Listings</h4>
      <DataTable
        columns={columns}
        data={topTickers}
        rowKey={(row, index) => `${row.market?.identifier}-${index}`}
        tableClassName="w-full bg-dark-300 rounded-lg overflow-hidden border border-purple-900/20"
      />
    </div>
  );
}
