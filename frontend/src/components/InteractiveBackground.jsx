import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Interactive Background:
 * 1. Fluid cursor-following radial spotlight with buttery-smooth physics (lerp)
 * 2. Interactive canvas particles/sparkles that react to mouse proximity
 * 3. Dot-matrix grid that illuminates under the spotlight
 */
const InteractiveBackground = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // Mouse coordinates with lerping for smooth inertia
    const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
    const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
    const [spotlightStyle, setSpotlightStyle] = useState({ x: 0, y: 0, opacity: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            targetPos.current = { x: e.clientX, y: e.clientY };
            setSpotlightStyle(prev => ({ ...prev, opacity: 1 }));
        };

        const handleMouseLeave = () => {
            setSpotlightStyle(prev => ({ ...prev, opacity: 0 }));
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Canvas particle simulation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class for floating sparkles
        const PARTICLE_COUNT = 45;
        const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseX: Math.random() * canvas.width,
            baseY: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.8,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.2,
            pulseSpeed: Math.random() * 0.02 + 0.008,
            pulseOffset: Math.random() * Math.PI * 2,
        }));

        // Interactive cursor sparkles trail
        const trailSparkles = [];

        let lastTrailTime = 0;
        const updateParticles = (time) => {
            // Lerp mouse position for smooth spotlight inertia
            mousePos.current.x += (targetPos.current.x - mousePos.current.x) * 0.08;
            mousePos.current.y += (targetPos.current.y - mousePos.current.y) * 0.08;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Periodically emit micro sparkles near cursor when moving
            const distMoved = Math.hypot(targetPos.current.x - mousePos.current.x, targetPos.current.y - mousePos.current.y);
            if (distMoved > 2 && time - lastTrailTime > 60) {
                lastTrailTime = time;
                trailSparkles.push({
                    x: targetPos.current.x + (Math.random() - 0.5) * 40,
                    y: targetPos.current.y + (Math.random() - 0.5) * 40,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2 - 0.5,
                    size: Math.random() * 2.5 + 1.2,
                    life: 1.0,
                    decay: Math.random() * 0.03 + 0.02,
                });
            }

            // Draw and update ambient particles
            const particleColor = isDark ? 'rgba(96, 165, 250, ' : 'rgba(37, 99, 235, ';
            const sparkleColor = isDark ? 'rgba(56, 189, 248, ' : 'rgba(16, 185, 129, ';

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                // Screen bounce
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Interactive repulsion/attraction to cursor
                const dx = mousePos.current.x - p.x;
                const dy = mousePos.current.y - p.y;
                const dist = Math.hypot(dx, dy);
                const maxDist = 180;

                if (dist < maxDist) {
                    const force = (1 - dist / maxDist) * 1.5;
                    p.x -= (dx / dist) * force;
                    p.y -= (dy / dist) * force;
                }

                // Shimmer pulse
                const shimmer = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.25 + 0.5;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${particleColor}${p.opacity * shimmer})`;
                ctx.fill();

                // Sparkle cross star flare for larger particles
                if (p.size > 2.0 && dist < maxDist * 1.2) {
                    ctx.save();
                    ctx.strokeStyle = `${sparkleColor}${shimmer * 0.4})`;
                    ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(p.x - p.size * 2, p.y);
                    ctx.lineTo(p.x + p.size * 2, p.y);
                    ctx.moveTo(p.x, p.y - p.size * 2);
                    ctx.lineTo(p.x, p.y + p.size * 2);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // Draw and update trail sparkles
            for (let i = trailSparkles.length - 1; i >= 0; i--) {
                const s = trailSparkles[i];
                s.x += s.vx;
                s.y += s.vy;
                s.life -= s.decay;

                if (s.life <= 0) {
                    trailSparkles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
                ctx.fillStyle = `${sparkleColor}${s.life * 0.7})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(updateParticles);
        };

        animationFrameId = requestAnimationFrame(updateParticles);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [isDark]);

    return (
        <div ref={containerRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            {/* Interactive Cursor Spotlight Glow */}
            <div
                className="absolute inset-0 transition-opacity duration-500 ease-out"
                style={{
                    opacity: spotlightStyle.opacity,
                    background: isDark
                        ? `radial-gradient(650px circle at ${mousePos.current.x}px ${mousePos.current.y}px, rgba(37, 99, 235, 0.18), rgba(6, 182, 212, 0.08), transparent 75%)`
                        : `radial-gradient(650px circle at ${mousePos.current.x}px ${mousePos.current.y}px, rgba(37, 99, 235, 0.09), rgba(6, 182, 212, 0.05), transparent 75%)`,
                }}
            />

            {/* Subtle Tech Grid / Matrix Mask (Illuminated by spotlight) */}
            <div 
                className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
                style={{
                    backgroundImage: isDark
                        ? `radial-gradient(#ffffff 1px, transparent 1px)`
                        : `radial-gradient(#000000 1px, transparent 1px)`,
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Canvas Sparkles & Constellation Physics */}
            <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
        </div>
    );
};

export default InteractiveBackground;
