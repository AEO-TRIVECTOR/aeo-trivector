'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from 'recharts';

const PHI = (1 + Math.sqrt(5)) / 2;

function buildPlotData() {
  const points: { mu: number; xstar: number | null }[] = [];
  for (let i = 0; i <= 100; i++) {
    const mu = (i / 100) * 0.78;
    const denom = PHI * Math.sqrt(1 - mu * mu) - 1;
    if (denom > 0.01) {
      points.push({ mu: parseFloat(mu.toFixed(4)), xstar: parseFloat((1 / denom).toFixed(4)) });
    } else {
      points.push({ mu: parseFloat(mu.toFixed(4)), xstar: null });
    }
  }
  return points;
}

const plotData = buildPlotData();

function DimTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { mu: number } }>;
}) {
  if (active && payload && payload.length && payload[0].value != null) {
    return (
      <div
        style={{
          background: 'rgba(0,0,0,0.85)',
          border: '1px solid rgba(252,211,77,0.3)',
          padding: '8px 12px',
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#E5E5E5',
        }}
      >
        <div>μ = {payload[0].payload.mu.toFixed(4)}</div>
        <div style={{ color: '#FCD34D' }}>x* = {payload[0].value.toFixed(4)}</div>
      </div>
    );
  }
  return null;
}

export default function DimensionPlot() {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(252,211,77,0.15)' }}
    >
      <p className="font-mono text-xs text-[#9CA3AF] mb-4 text-center">
        x*(μ) for μ ∈ [0, 0.78] — W(1) marked at x* ≈ 3.006
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={plotData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="mu"
            type="number"
            domain={[0, 0.78]}
            tickCount={8}
            tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'monospace' }}
            tickFormatter={(v: number) => v.toFixed(2)}
          >
            <Label
              value="μ"
              offset={-10}
              position="insideBottom"
              style={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'monospace' }}
            />
          </XAxis>
          <YAxis
            domain={[1, 10]}
            tickCount={6}
            tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'monospace' }}
          >
            <Label
              value="x*(μ)"
              angle={-90}
              position="insideLeft"
              style={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'monospace' }}
            />
          </YAxis>
          <Tooltip content={<DimTooltip />} />
          <ReferenceLine
            x={0.567143}
            stroke="#FCD34D"
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{
              value: 'W(1)',
              position: 'top',
              fill: '#FCD34D',
              fontSize: 11,
              fontFamily: 'monospace',
            }}
          />
          <ReferenceLine
            y={3.006}
            stroke="#3B82F6"
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{
              value: 'x*=3.006',
              position: 'right',
              fill: '#3B82F6',
              fontSize: 11,
              fontFamily: 'monospace',
            }}
          />
          <Line
            type="monotone"
            dataKey="xstar"
            stroke="#FCD34D"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
