"use client";

import { useState } from "react";
import DataTable from "./../DataTable";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface TabProps {
  gainers: any[];
  losers: any[];
}

export default function TopGainersLosersTabs({ gainers, losers }: TabProps) {
  // Trạng thái tab đang hoạt động: mặc định là "gainers"
  const [activeTab, setActiveTab] = useState<"gainers" | "losers">("gainers");

  // Định nghĩa các cột cho bảng dữ liệu
  const columns = [
    {
      header: "Token",
      cell: (item: any) => (
        <Link
          href={`/coins/${item.id}`}
          className="flex items-center gap-2 hover:underline"
        >
          <Image
            src={item.image}
            alt={item.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="font-semibold text-white">
            {item.symbol.toUpperCase()}
          </span>
        </Link>
      ),
    },
    {
      header: "Price",
      cell: (item: any) => formatCurrency(item.current_price),
    },
    {
      header: "24h Change",
      cell: (item: any) => {
        const isUp = item.price_change_percentage_24h > 0;
        return (
          <span className={isUp ? "text-green-500" : "text-red-500"}>
            {formatPercentage(item.price_change_percentage_24h)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="bg-dark-300 p-4 rounded-xl border border-purple-900/10">
      {/* 🟢 Thanh chuyển Tab phong cách Shadcn/Tailwind */}
      <div className="flex gap-2 mb-4 bg-dark-400 p-1 rounded-lg w-fit mx-auto">
        <button
          onClick={() => setActiveTab("gainers")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            activeTab === "gainers"
              ? "bg-green-500/25 text-green-400 shadow-sm border border-green-500/30"
              : "text-purple-100/50 hover:text-purple-100"
          }`}
        >
          🔥 Top Gainers
        </button>
        <button
          onClick={() => setActiveTab("losers")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            activeTab === "losers"
              ? "bg-red-500/25 text-red-400 shadow-sm border border-red-500/30"
              : "text-purple-100/50 hover:text-purple-100"
          }`}
        >
          📉 Top Losers
        </button>
      </div>

      {/* 🟢 Render Bảng tương ứng với Tab được chọn */}
      <div className="transition-all duration-200">
        {activeTab === "gainers" ? (
          <DataTable
            columns={columns}
            data={gainers}
            rowKey={(row) => row.id}
            tableClassName="w-full text-sm"
          />
        ) : (
          <DataTable
            columns={columns}
            data={losers}
            rowKey={(row) => row.id}
            tableClassName="w-full text-sm"
          />
        )}
      </div>
    </div>
  );
}
