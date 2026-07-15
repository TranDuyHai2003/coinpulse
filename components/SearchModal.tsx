"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react"; // Đảm bảo đã import icons

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Lắng nghe tổ hợp phím tắt Cmd+K hoặc Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch API với cơ chế chống spam (Debounce)
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetcher<any>(`/search`, { query });
        setResults(data?.coins?.slice(0, 8) || []);
      } catch (error) {
        console.error("Search API Error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelectCoin = (coinId: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/coins/${coinId}`);
  };

  return (
    <>
      {/* 🟢 NÚT TRIGGER ĐẸP MẮT TRÊN HEADER */}
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center justify-between w-64 px-4 py-2 bg-dark-300/40 hover:bg-dark-300 border border-purple-900/20 hover:border-purple-500/30 text-purple-100/50 hover:text-purple-100 text-sm rounded-xl transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-purple-100/30 group-hover:text-purple-400 transition-colors" />
          <span>Search market...</span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-md border border-purple-900/40 bg-dark-400 px-1.5 font-mono text-[10px] font-medium text-purple-100/40 shadow-sm">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* 🟢 MODAL TÌM KIẾM CHI TIẾT */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="bg-dark-200 text-white rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl shadow-purple-950/40">
          <CommandInput
            placeholder="Type a coin name or symbol to search..."
            value={query}
            onValueChange={setQuery}
            className="h-14 px-4 bg-transparent border-b border-purple-900/20 text-white placeholder:text-purple-100/30 focus:outline-none"
          />

          <CommandList className="max-h-[360px] overflow-y-auto custom-scrollbar p-2">
            {loading && (
              <div className="flex items-center justify-center py-10 gap-2 text-purple-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching CoinGecko...</span>
              </div>
            )}

            {!loading && results.length === 0 && query && (
              <CommandEmpty className="py-10 text-center text-sm text-purple-100/40">
                No tokens found for{" "}
                <span className="text-purple-400 font-semibold">"{query}"</span>
              </CommandEmpty>
            )}

            {results.length > 0 && (
              <CommandGroup
                heading="Cryptocurrencies"
                className="px-2 py-1 text-xs font-bold text-purple-100/40 uppercase tracking-wider"
              >
                <div className="mt-2 space-y-1">
                  {results.map((coin) => (
                    <CommandItem
                      key={coin.id}
                      value={coin.name}
                      onSelect={() => handleSelectCoin(coin.id)}
                      // style hover khi di chuyển bàn phím bằng data-[selected=true] của cmdk
                      className="flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all duration-150 data-[selected=true]:bg-purple-500/10 data-[selected=true]:text-white hover:bg-purple-500/5 group"
                    >
                      <div className="relative w-8 h-8 flex-shrink-0 bg-dark-300 rounded-lg p-1 border border-purple-900/10 group-data-[selected=true]:border-purple-500/30 transition-colors">
                        <Image
                          src={coin.thumb}
                          alt={coin.name}
                          fill
                          className="rounded-md object-contain"
                        />
                      </div>

                      <div className="flex flex-col">
                        <span className="font-semibold text-white group-data-[selected=true]:text-purple-300 transition-colors">
                          {coin.name}
                        </span>
                        <span className="text-xs text-purple-100/50 uppercase font-mono">
                          {coin.symbol}
                        </span>
                      </div>

                      {coin.market_cap_rank && (
                        <span className="ml-auto text-xs px-2 py-0.5 bg-dark-400 border border-purple-900/20 text-purple-100/40 rounded-md font-mono">
                          #{coin.market_cap_rank}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
}
