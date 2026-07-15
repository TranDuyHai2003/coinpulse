import { useEffect, useRef, useState } from "react";

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

export const useCoinGeckoWebSocket = ({
  coinId,
  poolId,
  liveInterval,
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribed = useRef(<Set<string>>new Set());
  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    const send = (payload: Record<string, unknown>) =>
      ws.send(JSON.stringify(payload));
    const handleMessage = (event: MessageEvent) => {
      const msg: WebSocketMessage = JSON.parse(event.data);

      if (msg.type === "ping") {
        send({ type: "pong" });
        return;
      }

      if (msg.type === "confirm_subscription") {
        const { channel } = JSON.parse(msg.identifier ?? "");
        subscribed.current.add(channel);
      }
      if (msg.c === "C1") {
        usd: msg.p ?? 0;
        coin: msg.i;
        price: msg.p;
        change24h: msg.pp;
        marketCap: msg.m;
        volume24h: msg.v;
        timestamp: msg.t;
      }
      if (msg.c === "G2") {
        const newTrade: Trade = {
          price: msg.pu,
          value: msg.vo,
          timestamp: msg.t ?? 0,
          amount: msg.to,
        };
      }
      if (msg.ch === "G3") {
        const timestamp = msg.t ?? 0;
        const candle: OHLCData = [
          timestamp,
          Number(msg.o ?? 0),
          Number(msg.h ?? 0),
          Number(msg.l ?? 0),
          Number(msg.c ?? 0),
        ];
      }
    };

    ws.onopen = () => {
      setIsWsReady(true);
      ws.onmessage = handleMessage;
      ws.onclose = () => {
        setIsWsReady(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsWsReady(false);
      };

      return () => ws.close();
    };
  });

  useEffect(() => {
    if (!isWsReady) return;
    const ws = wsRef.current;
    if (!ws) return;
    const send = (payload: Record<string, unknown>) =>
      ws.send(JSON.stringify(payload));

    const unsubscribeAll = () => {
      subscribed.current.forEach((channel) => {
        send({
          command: "unsubscribe",
          identifier: JSON.stringify({ channel }),
        });
      });
    };

    const subscribe = (channel: string, data?: Record<string, unknown>) => {
      if (subscribed.current.has(channel)) return;
      send({
        command: "subscribe",
        identifier: JSON.stringify({ channel, ...data }),
      });
      if (data) {
        send({
          command: "message",
          identifier: JSON.stringify({ channel }),
          data: JSON.stringify(data),
        });
      }
    };

    queueMicrotask(() => {
      setPrice(null);
      setTrades([]);
      setOhlcv(null);
      unsubscribeAll();
      subscribe("CGSimplePrice", { coin_id: [coinId], action: "set_tokens" });
    });

    const poolAdress = poolId.replace("_", ":") ?? "";
    if (poolAdress) {
      queueMicrotask(() => {
        subscribe("OnchainTrade", {
          "network_id:pool_address": [poolAdress],
          action: "set_pools",
        });
        subscribe("OnchainOHLCV", {
          "network_id:pool_address": [poolAdress],
          interval: liveInterval,
          action: "set_pools",
        });
      });
    }
  }, [coinId, poolId, liveInterval, isWsReady]);

  return { price, trades, ohlcv, isConnected: isWsReady };
};
