'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type TreasuryEventType =
  | 'treasury.updated'
  | 'payment.completed'
  | 'payment.failed'
  | 'proposal.approved'
  | 'proposal.rejected'
  | 'batch.completed'
  | 'policy.triggered'
  | 'approval.required'
  | 'signer.added'
  | 'signer.removed'
  | 'threshold.updated';

export interface TreasuryEvent {
  id: string;
  type: TreasuryEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

interface RealtimeState {
  isConnected: boolean;
  events: TreasuryEvent[];
  lastEvent: TreasuryEvent | null;
}

/**
 * Hook for subscribing to real-time treasury events via Server-Sent Events (SSE).
 * In production, this connects to a backend event stream.
 * Currently simulates events for demo purposes.
 */
export function useRealtimeEvents() {
  const [state, setState] = useState<RealtimeState>({
    isConnected: false,
    events: [],
    lastEvent: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // In production, connect to a real SSE endpoint:
    // const es = new EventSource('/api/events?treasuryId=xxx');
    // eventSourceRef.current = es;
    // es.onmessage = (event) => { ... };

    setState((prev) => ({ ...prev, isConnected: true }));

    // Simulate periodic events for demo
    const simulatedEvents: TreasuryEvent[] = [
      { id: 'evt-1', type: 'treasury.updated', timestamp: new Date().toISOString(), data: { balance: 2847350, change: '+0.2%' } },
      { id: 'evt-2', type: 'approval.required', timestamp: new Date().toISOString(), data: { txId: 'tx-6', amount: 15000, currency: 'USDC' } },
      { id: 'evt-3', type: 'payment.completed', timestamp: new Date().toISOString(), data: { txHash: 'simulated...', amount: 3200, currency: 'XLM' } },
    ];

    let idx = 0;
    simulationRef.current = setInterval(() => {
      const event = simulatedEvents[idx % simulatedEvents.length];
      idx++;
      setState((prev) => ({
        ...prev,
        lastEvent: { ...event, id: `evt-${Date.now()}`, timestamp: new Date().toISOString() },
        events: [...prev.events.slice(-50), { ...event, id: `evt-${Date.now()}`, timestamp: new Date().toISOString() }],
      }));
    }, 15000);
  }, []);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
    setState({ isConnected: false, events: [], lastEvent: null });
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
  };
}
