import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'mortarboard' | 'confetti';
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  tasselAngle?: number;
  scale?: number;
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Palette matching the theme
  const colors = {
    gold: ['#D4AF37', '#FFD700', '#F3E5AB', '#AA7C11'],
    confetti: ['#D4AF37', '#0F172A', '#E2E8F0', '#7F1D1D', '#94A3B8', '#B8860B'],
    cap: '#111827' // dark slate / charcoal
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial floating particles
    const initialCount = Math.min(window.innerWidth < 768 ? 20 : 45, 50);
    const initialParticles: Particle[] = [];

    // Create mixed initial floating particles
    for (let i = 0; i < initialCount; i++) {
      const isCap = Math.random() < 0.25;
      initialParticles.push(createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        isCap,
        false
      ));
    }
    particlesRef.current = initialParticles;

    let animationFrameId: number;

    const drawMortarboard = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.globalAlpha = opacity;

      // 1. Draw the cap base (the round part underneath)
      c.fillStyle = '#1e293b'; // slightly lighter than black
      c.beginPath();
      c.ellipse(0, size * 0.35, size * 0.4, size * 0.18, 0, 0, Math.PI);
      c.fill();
      
      // Draw cap base outline in fine gold
      c.strokeStyle = '#D4AF37';
      c.lineWidth = 0.5;
      c.stroke();

      // 2. Draw the main diamond top (the mortarboard)
      c.fillStyle = '#0f172a'; // main body color
      c.strokeStyle = '#D4AF37'; // gold trim
      c.lineWidth = size * 0.05;
      c.beginPath();
      c.moveTo(0, -size * 0.35); // top vertex
      c.lineTo(size * 0.75, 0);   // right vertex
      c.lineTo(0, size * 0.35);  // bottom vertex
      c.lineTo(-size * 0.75, 0);  // left vertex
      c.closePath();
      c.fill();
      c.stroke();

      // 3. Draw the center button (gold)
      c.fillStyle = '#D4AF37';
      c.beginPath();
      c.arc(0, 0, size * 0.09, 0, Math.PI * 2);
      c.fill();

      // 4. Draw the tassel
      c.strokeStyle = '#F3E5AB'; // light gold
      c.lineWidth = size * 0.04;
      c.beginPath();
      // Start slightly left of button, go over the side
      c.moveTo(-size * 0.02, 0);
      c.quadraticCurveTo(-size * 0.3, size * 0.15, -size * 0.45, size * 0.45);
      c.stroke();

      // Tassel fringe
      c.fillStyle = '#FFD700';
      c.beginPath();
      c.moveTo(-size * 0.45, size * 0.45);
      c.lineTo(-size * 0.52, size * 0.65);
      c.lineTo(-size * 0.42, size * 0.68);
      c.lineTo(-size * 0.38, size * 0.48);
      c.closePath();
      c.fill();

      c.restore();
    };

    const drawConfetti = (
      c: CanvasRenderingContext2D,
      p: Particle
    ) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.globalAlpha = p.opacity;
      c.fillStyle = p.color;

      // Random flutter shape: simple rectangle or circle
      if (p.size % 2 === 0) {
        c.fillRect(-p.size / 2, -p.size / 3, p.size, p.size / 1.5);
      } else {
        c.beginPath();
        c.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        c.fill();
      }

      c.restore();
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeParticles = particlesRef.current;

      for (let i = 0; i < activeParticles.length; i++) {
        const p = activeParticles[i];

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Apply natural drift/float forces
        if (p.type === 'mortarboard') {
          // Slow sway
          p.vx += Math.sin(p.y / 40 + p.x / 100) * 0.02;
          p.vy += 0.005; // tiny gravity pull
          // Friction limit
          p.vx *= 0.99;
          p.vy = Math.min(p.vy, 1.2); // max fall speed
        } else {
          // Confetti flutters back and forth
          p.vx += Math.sin(p.y / 20 + p.size) * 0.05;
          p.vy += 0.01; // subtle gravity
          p.vx *= 0.98;
          p.vy = Math.min(p.vy, 2.0); // max fall speed
        }

        // Screen wrap-around or recycle for natural floating background particles
        // If they were custom tossed (with negative gravity initially), let them fade out or fall
        if (p.y > canvas.height + 40) {
          // Recycle to the top
          p.y = -30;
          p.x = Math.random() * canvas.width;
          p.vy = p.type === 'mortarboard' ? 0.4 + Math.random() * 0.5 : 0.8 + Math.random() * 1.2;
          p.vx = (Math.random() - 0.5) * 0.5;
          p.opacity = 0.5 + Math.random() * 0.4;
        }

        if (p.x < -40) p.x = canvas.width + 30;
        if (p.x > canvas.width + 40) p.x = -30;

        // Draw particle
        if (p.type === 'mortarboard') {
          drawMortarboard(ctx, p.x, p.y, p.size, p.rotation, p.opacity);
        } else {
          drawConfetti(ctx, p);
        }
      }

      // Keep particles in a moderate range to avoid memory bloat
      if (activeParticles.length > 150) {
        // filter out oldest extra particles
        particlesRef.current = activeParticles.slice(activeParticles.length - 150);
      }

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    // Setup global listener to listen to clicks on the whole document for interactive toss!
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't trigger if click is on buttons/interactive elements to avoid disrupting UI
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.interactive-scroll') ||
        target.closest('.wishes-card')
      ) {
        return;
      }

      const burstX = e.clientX;
      const burstY = e.clientY;

      // Toss 4-7 mortarboards
      const capCount = 4 + Math.floor(Math.random() * 4);
      const confettiCount = 15 + Math.floor(Math.random() * 15);

      const newParticles: Particle[] = [];

      for (let i = 0; i < capCount; i++) {
        // Toss upwards with a random spread
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2; // roughly upwards
        const force = 6 + Math.random() * 8;
        newParticles.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force,
          size: 15 + Math.random() * 12,
          type: 'mortarboard',
          color: colors.cap,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          opacity: 0.95
        });
      }

      for (let i = 0; i < confettiCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const force = 2 + Math.random() * 6;
        newParticles.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force,
          size: 6 + Math.random() * 8,
          type: 'confetti',
          color: colors.confetti[Math.floor(Math.random() * colors.confetti.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          opacity: 1.0
        });
      }

      particlesRef.current = [...particlesRef.current, ...newParticles];
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('click', handleGlobalClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const createParticle = (x: number, y: number, isCap: boolean, isBurst: boolean): Particle => {
    const size = isCap 
      ? (14 + Math.random() * 12) 
      : (5 + Math.random() * 7);

    return {
      x,
      y,
      vx: isBurst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 0.6,
      vy: isBurst ? -(3 + Math.random() * 5) : 0.3 + Math.random() * 0.8,
      size,
      type: isCap ? 'mortarboard' : 'confetti',
      color: isCap 
        ? '#111827' 
        : colors.confetti[Math.floor(Math.random() * colors.confetti.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * (isCap ? 0.03 : 0.2),
      opacity: isBurst ? 1.0 : 0.4 + Math.random() * 0.4
    };
  };

  return (
    <canvas
      id="floating-particles-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
