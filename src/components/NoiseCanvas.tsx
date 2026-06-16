import { useRef, useEffect } from 'react';
import { simplex3D } from '../utils/simplexNoise';

// ── Flow‑field config ─────────────────────────────────────────────
const LINE_COUNT = 30;
const STEPS = 300;
const STEP_SIZE = 4;
const NOISE_SCALE = 0.003;
const SPEED = 0.0001;
const LINE_WIDTH = 0.5;
const ALPHA = 0.035;
const ACCENT_ALPHA = 0.045;
const ACCENT_RATIO = 0.2;

// ── Film‑grain config ──────────────────────────────────────────────
const GRAIN_ALPHA = 0.02;
const GRAIN_DENSITY = 0.08;

export default function NoiseCanvas() {
  const flowRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const flowCanvas = flowRef.current;
    const grainCanvas = grainRef.current;
    if (!flowCanvas || !grainCanvas) return;

    const ctxFlow = flowCanvas.getContext('2d');
    const ctxGrain = grainCanvas.getContext('2d');
    if (!ctxFlow || !ctxGrain) return;

    let w = 0;
    let h = 0;
    let time = 0;
    let animating = true;
    let frameId = 0;

    // ── Resize ───────────────────────────────────────────────────
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      [flowCanvas!, grainCanvas!].forEach((c) => {
        c.width = w * dpr;
        c.height = h * dpr;
        c.style.width = `${w}px`;
        c.style.height = `${h}px`;
      });
      ctxFlow!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxGrain!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // ── Flow‑field render (smooth quadratic bezier curves) ──────
    function drawFlowField() {
      ctxFlow!.clearRect(0, 0, w, h);

      for (let i = 0; i < LINE_COUNT; i++) {
        // Deterministic seed point per line
        const sx = simplex3D(i * 7.1, 0, 0) * 0.5 + 0.5;
        const sy = simplex3D(0, i * 7.1, 0) * 0.5 + 0.5;

        // Generate path points by stepping through the noise field
        const points: { x: number; y: number }[] = [];
        let px = sx * w;
        let py = sy * h;

        points.push({ x: px, y: py });

        for (let step = 1; step < STEPS; step++) {
          const angle =
            simplex3D(px * NOISE_SCALE, py * NOISE_SCALE, time) *
            Math.PI *
            2.2;

          px += Math.cos(angle) * STEP_SIZE;
          py += Math.sin(angle) * STEP_SIZE;

          // Wrap
          if (px < -20) px += w + 40;
          if (px > w + 20) px -= w + 40;
          if (py < -20) py += h + 40;
          if (py > h + 20) py -= h + 40;

          points.push({ x: px, y: py });
        }

        // Draw smooth curve through the points using quadraticCurveTo
        const isAccent = i / LINE_COUNT < ACCENT_RATIO;
        const alpha = isAccent ? ACCENT_ALPHA : ALPHA;
        const color = isAccent
          ? `rgba(180,0,160,${alpha})`
          : `rgba(210,220,240,${alpha})`;

        ctxFlow!.beginPath();
        ctxFlow!.moveTo(points[0].x, points[0].y);

        for (let p = 1; p < points.length - 1; p++) {
          // Midpoint between current and next point
          const midX = (points[p].x + points[p + 1].x) / 2;
          const midY = (points[p].y + points[p + 1].y) / 2;
          // Use current point as control, midpoint as anchor
          ctxFlow!.quadraticCurveTo(
            points[p].x,
            points[p].y,
            midX,
            midY,
          );
        }

        // Connect last two points
        const last = points[points.length - 1];
        ctxFlow!.lineTo(last.x, last.y);

        ctxFlow!.strokeStyle = color;
        ctxFlow!.lineWidth = LINE_WIDTH;
        ctxFlow!.stroke();
      }
    }

    // ── Film‑grain render ────────────────────────────────────────
    function drawGrain() {
      ctxGrain!.clearRect(0, 0, w, h);

      const imageData = ctxGrain!.createImageData(w, h);
      const data = imageData.data;
      const totalPixels = w * h;
      const targetCount = Math.floor(totalPixels * GRAIN_DENSITY);

      for (let i = 0; i < targetCount; i++) {
        const idx = (Math.random() * totalPixels) | 0;
        const v = (Math.random() * 255) | 0;
        const p = idx * 4;
        data[p] = v;
        data[p + 1] = v;
        data[p + 2] = v;
        data[p + 3] = (GRAIN_ALPHA * 255) | 0;
      }

      ctxGrain!.putImageData(imageData, 0, 0);
    }

    // ── Frame loop ───────────────────────────────────────────────
    let flowFrameCounter = 0;
    const FLOW_EVERY_N = 5;  // Update flow field every 5 frames (~12fps)
    const GRAIN_EVERY_N = 3;  // Update grain every 3 frames (~20fps)

    function tick() {
      if (!animating) return;
      time += SPEED;

      if (flowFrameCounter % FLOW_EVERY_N === 0) {
        drawFlowField();
      }
      if (flowFrameCounter % GRAIN_EVERY_N === 0) {
        drawGrain();
      }
      flowFrameCounter++;

      frameId = requestAnimationFrame(tick);
    }

    resize();
    tick();

    window.addEventListener('resize', resize);
    return () => {
      animating = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* Flow‑field — smooth bezier curves */}
      <canvas
        ref={flowRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />
      {/* Film grain */}
      <canvas
        ref={grainRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
}
