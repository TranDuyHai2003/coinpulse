import React from "react";
import fetcher from "@/lib/coingecko.actions";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { CoinOverviewFallback } from "@/components/home/fallback";
import CandleStickChart from "@/components/CandleStickChart";

const CoinOverview = async () => {
  // 1. Khai báo biến (và kiểu dữ liệu) ở ngoài scope để dùng cho việc render bên dưới
  let coin: CoinDetailsData;
  let coinOHLCData: OHLCData[];

  try {
    // 2. Gọi API và gán trực tiếp vào biến đã khai báo (KHÔNG dùng thêm const/let ở đây nữa)
    [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>("coins/bitcoin", {
        dex_pair_format: "symbol",
      }),
      fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: 1,
        // interval: "hourly",
        precisionL: "full",
      }),
    ]);
  } catch (error) {
    // 3. Nếu lỗi, bắt và return Fallback ngay lập tức
    console.error("Error fetching coin details:", error);
    return <CoinOverviewFallback />;
  }

  // 4. Render JSX bình thường vì lúc này coin và coinOHLCData chắc chắn đã có data
  return (
    <div id="coin-overview">
      <CandleStickChart data={coinOHLCData} coinId="bitcoin">
        <div className="header pt-2">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={56}
            height={56}
          />
          <div className="info">
            <p>
              {coin.name}/{coin.symbol.toUpperCase()}
            </p>
            <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </CandleStickChart>
    </div>
  );
};

export default CoinOverview;
