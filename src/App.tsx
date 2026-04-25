import { useState, useEffect, useRef } from "react";

function App() {
  const [targetDate, setTargetDate] = useState<string>(
    localStorage.getItem("targetDate") ?? ""
  );
  const [countdown, setCountdown] = useState<string>("这里会显示倒计时");
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const vel = useRef({ vx: 3, vy: 2 });

  // 倒计时
  useEffect(() => {
    const interval = setInterval(() => {
      if (!targetDate) return;
      const now = new Date();
      const diff = new Date(targetDate).getTime() - now.getTime();
      if (diff <= 0) { setCountdown("时间到！"); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`还剩 ${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // 飘窗弹跳
  useEffect(() => {
    const boxW = 160;
    const boxH = 60;
    const move = setInterval(() => {
      setPos(prev => {
        let { x, y } = prev;
        let { vx, vy } = vel.current;
        x += vx;
        y += vy;
        if (x <= 0 || x >= window.innerWidth - boxW) vx = -vx;
        if (y <= 0 || y >= window.innerHeight - boxH) vy = -vy;
        vel.current = { vx, vy };
        return { x, y };
      });
    }, 16);
    return () => clearInterval(move);
  }, []);

  function handleStart(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTargetDate(value);
    localStorage.setItem("targetDate", value);
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>倒计时</h1>
      <input type="date" onChange={handleStart} defaultValue={targetDate} />
      <h2>{countdown}</h2>
      <div style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        backgroundColor: "#f5a623",
        padding: "12px 20px",
        borderRadius: "12px",
        fontSize: "18px",
        fontWeight: "bold",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}>
        🔥 倒计时中
      </div>
    </div>
  );
}

export default App;