import { fetcher } from "@/lib/coingecko.actions";
import TopGainersLosersTabs from "./TopGainersLosersTabs"; // 🟢 Import component Tab vào đây

export default async function TopGainersLosers() {
  let coins: any[] = [];
  try {
    // Gọi API lấy 50 đồng coin hàng đầu
    coins = await fetcher<any[]>("coins/markets", {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 50,
      page: 1,
    });
  } catch (error) {
    console.error("Failed to fetch markets for gainers/losers:", error);
    return <div className="text-red-500">Failed to load market movers.</div>;
  }

  // Sắp xếp lấy Top 5 tăng mạnh nhất
  const gainers = [...coins]
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
    )
    .slice(0, 5);

  // Sắp xếp lấy Top 5 giảm mạnh nhất
  const losers = [...coins]
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h,
    )
    .slice(0, 5);

  // 🟢 Trả về Component Tab và truyền dữ liệu đã xử lý vào
  return <TopGainersLosersTabs gainers={gainers} losers={losers} />;
}
