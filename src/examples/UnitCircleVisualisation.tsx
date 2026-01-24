import { useState, useRef, useEffect } from 'react';

export default function UnitCircleVisualisation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(Math.PI / 4); // 45 degrees
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<{x: number, sin: number, cos: number}[]>([]);
  
  const centerX = 200;
  const centerY = 200;
  const radius = 120;
  const graphStartX = 400;
  const maxHistoryLength = 300;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw unit circle
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw axes for circle
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    // X axis
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 20, centerY);
    ctx.lineTo(centerX + radius + 20, centerY);
    ctx.stroke();
    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX, centerY + radius + 20);
    ctx.stroke();

    // Calculate point on circle
    const pointX = centerX + radius * Math.cos(angle);
    const pointY = centerY - radius * Math.sin(angle);

    // Draw radius line
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointX, pointY);
    ctx.stroke();

    // Draw projections
    ctx.strokeStyle = '#ff4444';
    ctx.setLineDash([5, 5]);
    // Cosine (x projection)
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(pointX, centerY);
    ctx.stroke();
    
    ctx.strokeStyle = '#4444ff';
    // Sine (y projection)
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(centerX, pointY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw point on circle
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw graph axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    // Horizontal axis
    ctx.beginPath();
    ctx.moveTo(graphStartX, centerY);
    ctx.lineTo(canvas.width - 20, centerY);
    ctx.stroke();
    // Vertical axis
    ctx.beginPath();
    ctx.moveTo(graphStartX, centerY - radius - 20);
    ctx.lineTo(graphStartX, centerY + radius + 20);
    ctx.stroke();

    // Draw sine wave
    ctx.strokeStyle = '#4444ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (history.length > 0) {
      ctx.moveTo(history[0].x, centerY - history[0].sin * radius);
      for (let i = 1; i < history.length; i++) {
        ctx.lineTo(history[i].x, centerY - history[i].sin * radius);
      }
    }
    ctx.stroke();

    // Draw cosine wave
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (history.length > 0) {
      ctx.moveTo(history[0].x, centerY - history[0].cos * radius);
      for (let i = 1; i < history.length; i++) {
        ctx.lineTo(history[i].x, centerY - history[i].cos * radius);
      }
    }
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText('sin(θ)', graphStartX + 10, centerY - radius - 25);
    ctx.fillStyle = '#4444ff';
    ctx.fillText(`sin = ${Math.sin(angle).toFixed(3)}`, graphStartX + 10, 30);
    ctx.fillStyle = '#ff4444';
    ctx.fillText(`cos = ${Math.cos(angle).toFixed(3)}`, graphStartX + 10, 50);
    ctx.fillStyle = '#fff';
    ctx.fillText(`θ = ${(angle * 180 / Math.PI).toFixed(1)}°`, centerX - 60, 30);

  }, [angle, history]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dx = x - centerX;
    const dy = y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < radius + 20) {
      setIsDragging(true);
      setHistory([]);
      updateAngle(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    updateAngle(x, y);
  };

  const updateAngle = (x: number, y: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const newAngle = Math.atan2(-dy, dx);
    
    setAngle(newAngle);
    
    setHistory(prev => {
      const newHistory = [...prev, {
        x: graphStartX + prev.length * 2,
        sin: Math.sin(newAngle),
        cos: Math.cos(newAngle)
      }];
      
      if (newHistory.length > maxHistoryLength) {
        return newHistory.slice(newHistory.length - maxHistoryLength);
      }
      return newHistory;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setHistory([]);
    setAngle(Math.PI / 4);
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ marginBottom: '10px', color: 'white' }}>
        Unit Circle & Trigonometric Functions
      </h2>
      <p style={{ marginBottom: '20px', color: '#aaa' }}>
        Drag the green point around the circle to see how sine and cosine values trace out waves.
      </p>
      
      <div style={{ 
        marginBottom: '15px',
        padding: '15px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <button
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            background: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
        <span style={{ color: '#888', fontSize: '12px' }}>
          <span style={{ color: '#4444ff' }}>Blue: sine</span> | {' '}
          <span style={{ color: '#ff4444' }}>Red: cosine</span>
        </span>
      </div>
      
      <canvas
        ref={canvasRef}
        width={900}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          border: '1px solid #333',
          borderRadius: '8px',
          cursor: isDragging ? 'grabbing' : 'grab',
          background: '#1a1a1a',
          display: 'block'
        }}
      />
    </div>
  );
}