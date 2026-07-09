import React from "react";
import DataTable from "@/components/DataTable";

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header">
        <div className="header-image animate-pulse bg-dark-400" />
        <div className="info">
          <div className="header-line-sm animate-pulse bg-dark-400 rounded-md" />
          <div className="header-line-lg animate-pulse bg-dark-400 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="period-button-skeleton animate-pulse bg-dark-400"
          />
        ))}
      </div>
      <div className="chart">
        <div className="chart-skeleton animate-pulse bg-dark-400" />
      </div>
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  const dummyData = Array.from({ length: 6 }, (_, i) => ({ id: i }));

  const columns: DataTableColumn<{ id: number }>[] = [
    {
      header: <div className="h-4 w-12 animate-pulse bg-dark-500 rounded-md" />,
      cellClassName: "name-cell",
      cell: () => (
        <div className="name-link">
          <div className="name-image animate-pulse bg-dark-400" />
          <div className="name-line animate-pulse bg-dark-400 rounded-md" />
        </div>
      ),
    },
    {
      header: <div className="h-4 w-16 animate-pulse bg-dark-500 rounded-md" />,
      cellClassName: "change-cell",
      cell: () => (
        <div className="price-change">
          <div className="change-icon animate-pulse bg-dark-400" />
          <div className="change-line animate-pulse bg-dark-400 rounded-md" />
        </div>
      ),
    },
    {
      header: <div className="h-4 w-12 animate-pulse bg-dark-500 rounded-md" />,
      cellClassName: "price-cell",
      cell: () => (
        <div className="price-line animate-pulse bg-dark-400 rounded-md" />
      ),
    },
  ];

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={dummyData}
        columns={columns}
        rowKey={(row) => row.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
};
