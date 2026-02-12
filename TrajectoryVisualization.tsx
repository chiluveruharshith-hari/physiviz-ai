import React, { useRef, useEffect, useState } from 'react';
import { PhysicsProblem } from '../types';

interface Props {
  problem: PhysicsProblem;
  selectedPoint?: number; // index of selected point on trajectory
}

const TrajectoryVisualization: React.FC<Props> = ({ problem, selectedPoint }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef.current);
    }
  }, []);

  useEffect(() => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Get physics parameters
    const gravity = problem.initial_conditions.gravity || 9.8;
    const velocity = problem.initial_conditions.velocity || 10;
    const angle = (problem.initial_conditions.angle || 45) * (Math.PI / 180);
    const initialHeight = problem.initial_conditions.height || 0;

    const vx = velocity * Math.cos(angle);
    const vy = velocity * Math.sin(angle);

    // Calculate trajectory bounds
    const timeOfFlight =
      (vy + Math.sqrt(vy * vy + 2 * gravity * initialHeight)) / gravity;
    const maxRange = vx * timeOfFlight;
    const maxHeight = (vy * vy) / (2 * gravity) + initialHeight;

    // Calculate scaling factors
    const scaleX = graphWidth / (maxRange * 1.1);
    const scaleY = graphHeight / (maxHeight * 1.1);

    const origin = {
      x: padding,
      y: height - padding - initialHeight * scaleY,
    };

    // Helper function to convert world coordinates to canvas coordinates
    const worldToCanvas = (x: number, y: number) => ({
      x: origin.x + x * scaleX,
      y: origin.y - y * scaleY,
    });

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = origin.x + (i * graphWidth) / 10;
      const y = origin.y - (i * graphHeight) / 10;
      ctx.beginPath();
      ctx.moveTo(x, origin.y);
      ctx.lineTo(x, origin.y - graphHeight);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(origin.x, y);
      ctx.lineTo(origin.x + graphWidth, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x + graphWidth, origin.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x, origin.y - graphHeight);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#1e293b';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x (m)', origin.x + graphWidth / 2, height - 10);
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('y (m)', 0, 0);
    ctx.restore();

    // Draw axis ticks and labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    for (let i = 1; i <= 10; i++) {
      const x = origin.x + (i * graphWidth) / 10;
      const xValue = ((i * maxRange) / 10).toFixed(1);
      ctx.beginPath();
      ctx.moveTo(x, origin.y);
      ctx.lineTo(x, origin.y + 5);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(xValue, x, origin.y + 20);

      const y = origin.y - (i * graphHeight) / 10;
      const yValue = ((i * maxHeight) / 10).toFixed(1);
      ctx.beginPath();
      ctx.moveTo(origin.x - 5, y);
      ctx.lineTo(origin.x, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(yValue, origin.x - 10, y + 5);
    }

    // Draw trajectory path
    const trajectoryPoints: { x: number; y: number; t: number }[] = [];
    const dt = timeOfFlight / 100;
    for (let t = 0; t <= timeOfFlight; t += dt) {
      const x = vx * t;
      const y = initialHeight + vy * t - 0.5 * gravity * t * t;
      if (y >= 0) {
        trajectoryPoints.push({ x, y, t });
      }
    }

    // Draw trajectory curve
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (trajectoryPoints.length > 0) {
      const firstPoint = worldToCanvas(trajectoryPoints[0].x, trajectoryPoints[0].y);
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < trajectoryPoints.length; i++) {
        const point = worldToCanvas(trajectoryPoints[i].x, trajectoryPoints[i].y);
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();

    // Draw starting point
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Draw initial velocity vector
    const velocityScale = 30; // pixels per m/s
    const velX = vx * velocityScale;
    const velY = -vy * velocityScale;
    const arrowSize = 12;

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x + velX, origin.y + velY);
    ctx.stroke();

    // Draw arrowhead for velocity
    const velAngle = Math.atan2(velY, velX);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(origin.x + velX, origin.y + velY);
    ctx.lineTo(
      origin.x + velX - arrowSize * Math.cos(velAngle - Math.PI / 6),
      origin.y + velY - arrowSize * Math.sin(velAngle - Math.PI / 6)
    );
    ctx.lineTo(
      origin.x + velX - arrowSize * Math.cos(velAngle + Math.PI / 6),
      origin.y + velY - arrowSize * Math.sin(velAngle + Math.PI / 6)
    );
    ctx.fill();

    // Draw velocity label
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`u₀ = ${velocity.toFixed(1)} m/s`, origin.x + velX + 10, origin.y + velY - 5);

    // Draw gravity force arrow
    const gravityArrowX = origin.x + graphWidth - 40;
    const gravityArrowY = origin.y - 80;
    const gravityArrowLength = 40;

    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(gravityArrowX, gravityArrowY - gravityArrowLength);
    ctx.lineTo(gravityArrowX, gravityArrowY);
    ctx.stroke();

    // Draw arrowhead for gravity
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(gravityArrowX, gravityArrowY);
    ctx.lineTo(gravityArrowX - 6, gravityArrowY - arrowSize);
    ctx.lineTo(gravityArrowX + 6, gravityArrowY - arrowSize);
    ctx.fill();

    // Draw gravity label
    ctx.fillStyle = '#7c2d12';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('g', gravityArrowX, gravityArrowY + 20);

    // Draw max height marker
    const maxHeightY = initialHeight + (vy * vy) / (2 * gravity);
    if (maxHeightY > 0) {
      const maxHeightPoint = worldToCanvas(vx * (vy / gravity), maxHeightY);
      ctx.strokeStyle = '#d946ef';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(origin.x, maxHeightPoint.y);
      ctx.lineTo(maxHeightPoint.x, maxHeightPoint.y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(maxHeightPoint.x, maxHeightPoint.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`h = ${maxHeightY.toFixed(2)} m`, maxHeightPoint.x, maxHeightPoint.y - 12);
    }

    // Draw range marker
    const rangePoint = worldToCanvas(maxRange, 0);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(rangePoint.x, origin.y);
    ctx.lineTo(rangePoint.x, origin.y + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#6d28d9';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Range = ${maxRange.toFixed(2)} m`, rangePoint.x, origin.y + 35);

    // Highlight selected point
    if (selectedPoint !== undefined && selectedPoint < trajectoryPoints.length) {
      const point = trajectoryPoints[selectedPoint];
      const canvasPoint = worldToCanvas(point.x, point.y);
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvasPoint.x, canvasPoint.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }, [canvas, problem, selectedPoint]);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Projectile Trajectory</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full border border-gray-200 rounded-lg bg-white"
      />
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Initial velocity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>Gravity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-cyan-500"></div>
          <span>Trajectory path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 border-t-2 border-purple-600" style={{ borderTopStyle: 'dashed' }}></div>
          <span>Key markers</span>
        </div>
      </div>
    </div>
  );
};

export default TrajectoryVisualization;
