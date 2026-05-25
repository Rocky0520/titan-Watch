import React, { useEffect, useRef } from 'react';

export default function MechanicalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let scrollY = 0;
    let targetScrollY = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Definition of gears floating in 3D-space
    interface Gear {
      x: number;
      y: number;
      z: number; // depth
      radius: number;
      teeth: number;
      speed: number;
      color: string;
      angle: number;
    }

    const gears: Gear[] = [
      { x: width * 0.1, y: height * 0.2, z: 2, radius: 100, teeth: 16, speed: 0.002, color: 'rgba(197, 160, 89, 0.06)', angle: 0 },
      { x: width * 0.85, y: height * 0.4, z: 3, radius: 140, teeth: 24, speed: -0.0015, color: 'rgba(255, 255, 255, 0.04)', angle: 0 },
      { x: width * 0.2, y: height * 0.75, z: 1.5, radius: 80, teeth: 12, speed: 0.003, color: 'rgba(197, 160, 89, 0.05)', angle: 0 },
      { x: width * 0.75, y: height * 0.85, z: 4, radius: 180, teeth: 32, speed: -0.0008, color: 'rgba(255, 255, 255, 0.03)', angle: 0 },
    ];

    // Starry gold dust particles
    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
      alpha: number;
      speedY: number;
    }

    const stars: Star[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 3 + 1,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      speedY: Math.random() * 0.15 + 0.05,
    }));

    const drawGear = (ctx: CanvasRenderingContext2D, gear: Gear, offsetX: number, offsetY: number) => {
      const { radius, teeth, color, angle } = gear;
      
      // Depth projection scale
      const scale = 3 / (3 + gear.z);
      const pr = radius * scale;
      const px = gear.x + offsetX * (1 / gear.z);
      const py = gear.y + offsetY * (1 / gear.z);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5 * scale;
      ctx.fillStyle = color;

      // Draw gear outer ring & teeth
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const theta = (i * 2 * Math.PI) / teeth;
        const xOuter1 = Math.cos(theta - 0.08) * (pr + 8 * scale);
        const yOuter1 = Math.sin(theta - 0.08) * (pr + 8 * scale);
        const xOuter2 = Math.cos(theta + 0.08) * (pr + 8 * scale);
        const yOuter2 = Math.sin(theta + 0.08) * (pr + 8 * scale);

        const xInner1 = Math.cos(theta - 0.15) * pr;
        const yInner1 = Math.sin(theta - 0.15) * pr;
        const xInner2 = Math.cos(theta + 0.15) * pr;
        const yInner2 = Math.sin(theta + 0.15) * pr;

        if (i === 0) ctx.moveTo(xInner1, yInner1);
        ctx.lineTo(xInner1, yInner1);
        ctx.lineTo(xOuter1, yOuter1);
        ctx.lineTo(xOuter2, yOuter2);
        ctx.lineTo(xInner2, yInner2);
      }
      ctx.closePath();
      ctx.stroke();

      // Inner details
      ctx.beginPath();
      ctx.arc(0, 0, pr * 0.75, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, pr * 0.25, 0, Math.PI * 2);
      ctx.stroke();

      // Spokes
      for (let i = 0; i < 4; i++) {
        const theta = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(theta) * pr * 0.25, Math.sin(theta) * pr * 0.25);
        ctx.lineTo(Math.cos(theta) * pr * 0.75, Math.sin(theta) * pr * 0.75);
        ctx.stroke();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Dampened inertia tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      scrollY += (targetScrollY - scrollY) * 0.08;

      const parallaxX = (mouse.x - width / 2) * 0.04;
      const parallaxY = (mouse.y - height / 2) * 0.04;

      // Draw starry constellations
      stars.forEach((star) => {
        // Move star with drift speed and scroll parallax
        star.y -= star.speedY + (targetScrollY - scrollY) * 0.02 * (1 / star.z);
        if (star.y < -10) {
          star.y = height + 10;
          star.x = Math.random() * width;
        }

        const scale = 3 / (3 + star.z);
        const sx = star.x + parallaxX * (1 / star.z);
        const sy = (star.y - scrollY * 0.1) % (height + 20);

        ctx.fillStyle = star.z > 2.5 ? 'rgba(197, 160, 89, 0.3)' : 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(sx, sy, star.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw mechanical gears
      gears.forEach((gear) => {
        // Gears rotate based on elapsed time and page scroll momentum
        const scrollFactor = (targetScrollY - scrollY) * 0.01;
        gear.angle += gear.speed + scrollFactor * (gear.speed > 0 ? 1 : -1);

        const adjustedY = gear.y - scrollY * 0.2 * (1 / gear.z);
        
        // Wrap screen
        let renderedY = adjustedY;
        if (renderedY < -300) gear.y += height + 500;
        if (renderedY > height + 300) gear.y -= height + 500;

        drawGear(ctx, { ...gear, y: renderedY }, parallaxX, parallaxY);
      });

      // Draw subtle grid mesh lines connecting gears
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.02)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < gears.length; i++) {
        for (let j = i + 1; j < gears.length; j++) {
          const g1 = gears[i];
          const g2 = gears[j];
          const x1 = g1.x + parallaxX * (1 / g1.z);
          const y1 = g1.y - scrollY * 0.2 * (1 / g1.z);
          const x2 = g2.x + parallaxX * (1 / g2.z);
          const y2 = g2.y - scrollY * 0.2 * (1 / g2.z);
          
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#040404]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
