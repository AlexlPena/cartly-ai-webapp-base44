import React, { useRef, useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

const THRESHOLD = 72; // px to pull before triggering refresh

export default function PullToRefresh({ onRefresh, children, className = "" }) {
  const containerRef = useRef(null);
  const startY = useRef(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const isAtTop = () => {
    const el = containerRef.current;
    return !el || el.scrollTop <= 0;
  };

  const handleTouchStart = (e) => {
    if (!isAtTop()) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (startY.current === null || refreshing) return;
    if (!isAtTop()) { startY.current = null; return; }
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.5, THRESHOLD + 20));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      await onRefresh();
      setRefreshing(false);
    }
    setPullDistance(0);
    startY.current = null;
  };

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const showIndicator = pullDistance > 8;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-y-auto h-full ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center z-10 pointer-events-none transition-all"
        style={{
          top: showIndicator ? 0 : -40,
          height: 40,
          opacity: showIndicator ? progress : 0,
        }}
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100">
          <RefreshCw
            className={`w-4 h-4 text-green-500 ${refreshing ? "animate-spin" : ""}`}
            style={{ transform: !refreshing ? `rotate(${progress * 360}deg)` : undefined }}
          />
        </div>
      </div>

      {/* Content shifted down during pull */}
      <div
        style={{ transform: `translateY(${pullDistance}px)`, transition: pullDistance === 0 ? "transform 0.25s ease" : "none" }}
      >
        {children}
      </div>
    </div>
  );
}