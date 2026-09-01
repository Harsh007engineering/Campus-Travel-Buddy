import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * High-Impact Interactive Cursor Physics & Sparkle Engine
 * 1. Foreground Canvas (z-40): Emits luminous 4-point star sparkles and sparks trailing the cursor
 * 2. Background Canvas (z-0): Interactive floating starfield repelled by cursor
 * 3. Cursor Glow Spotlight: Smooth lerped radial aura illuminating cards
 */
const InteractiveBackground = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const fgCanvasRef = useRef(null);
    const bgCanvasRef = useRef(null);

    // Mouse coordinates with spring lerp
    const mouse = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000, speed: 0 });
    const smoothMouse = useRef({ x: -1000, y: -1000 });
    const [cursorVisible, setCursorVisible] = useState(false);

    // Palette for vibrant glowing sparkles
    const colors = isDark 
        ? ['#38bdf8', '#60a5fa', '#34d399', '#a78bfa', '#f472b6', '#fbbf24']
        : ['#2563eb', '#06b6d4', '#059669', '#7c3aed', '#e11d48', '#d97706'];

    // Helper: Draw 4-point glowing star
    const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha) => {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.fill();

        // Bright center core
        ctx.beginPath();
        ctx.arc(cx, cy, innerRadius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.9));
        ctx.fill();

        ctx.restore();
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            const dx = e.clientX - mouse.current.x;
            const dy = e.clientY - mouse.current.y;
            mouse.current.speed = Math.hypot(dx, dy);
            mouse.current.prevX = mouse.current.x;
            mouse.current.prevY = mouse.current.y;
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            if (!cursorVisible) setCursorVisible(true);
        };

        const handleMouseLeave = () => {
            setCursorVisible(false);
            mouse.current.x = -1000;
            mouse.current.y = -1000;
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [cursorVisible]);

    // MAIN PHYSICS & SPARKLE LOOP
    useEffect(() => {
        const fgCanvas = fgCanvasRef.current;
        const bgCanvas = bgCanvasRef.current;
        if (!fgCanvas || !bgCanvas) return;

        const fgCtx = fgCanvas.getContext('2d');
        const bgCtx = bgCanvas.getContext('2d');
        let animationId;

        const resize = () => {
            fgCanvas.width = window.innerWidth;
            fgCanvas.height = window.innerHeight;
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Active sparkles list
        const sparkles = [];

        // Ambient floating background particles
        const ambientCount = 50;
        const ambientStars = Array.from({ length: ambientCount }, () => ({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            size: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.5 + 0.2,
            pulse: Math.random() * Math.PI * 2,
        }));

        let frame = 0;

        const render = () => {
            frame++;

            // Smooth lerp for cursor spotlight
            smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.12;
            smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.12;

            // Clear canvases
            fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

            // ====================
            // 1. SPAWN SPARKLES ON MOUSE MOVE
            // ====================
            if (mouse.current.x > 0 && mouse.current.y > 0 && mouse.current.speed > 1.5) {
                const count = Math.min(5, Math.floor(mouse.current.speed / 4) + 1);
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const velocity = Math.random() * 3 + 1;
                    sparkles.push({
                        x: mouse.current.x + (Math.random() - 0.5) * 16,
                        y: mouse.current.y + (Math.random() - 0.5) * 16,
                        vx: Math.cos(angle) * velocity,
                        vy: Math.sin(angle) * velocity - 0.8, // gentle upward drift
                        size: Math.random() * 7 + 4,
                        maxLife: Math.random() * 25 + 25,
                        life: 0,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        spikes: 4,
                        rotation: Math.random() * Math.PI,
                        rotSpeed: (Math.random() - 0.5) * 0.15,
                    });
                }
            }

            // ====================
            // 2. RENDER FOREGROUND SPARKLES (z-40)
            // ====================
            fgCtx.globalCompositeOperation = 'lighter';

            for (let i = sparkles.length - 1; i >= 0; i--) {
                const s = sparkles[i];
                s.life++;
                s.x += s.vx;
                s.y += s.vy;
                s.vx *= 0.95; // air friction
                s.vy *= 0.95;
                s.vy += 0.04; // subtle gravity
                s.rotation += s.rotSpeed;

                const progress = s.life / s.maxLife;
                const alpha = Math.sin(progress * Math.PI); // fade in then out
                const currentRadius = s.size * (1 - progress * 0.3);

                if (progress >= 1) {
                    sparkles.splice(i, 1);
                    continue;
                }

                drawStar(
                    fgCtx, 
                    s.x, 
                    s.y, 
                    s.spikes, 
                    currentRadius, 
                    currentRadius * 0.35, 
                    s.color, 
                    alpha
                );
            }

            // ====================
            // 3. RENDER BACKGROUND AMBIENT PARTICLES (z-0)
            // ====================
            for (let i = 0; i < ambientStars.length; i++) {
                const star = ambientStars[i];
                star.x += star.vx;
                star.y += star.vy;
                star.pulse += 0.03;

                // Screen Wrap
                if (star.x < 0) star.x = bgCanvas.width;
                if (star.x > bgCanvas.width) star.x = 0;
                if (star.y < 0) star.y = bgCanvas.height;
                if (star.y > bgCanvas.height) star.y = 0;

                // Repulsion when cursor comes near
                const dx = smoothMouse.current.x - star.x;
                const dy = smoothMouse.current.y - star.y;
                const dist = Math.hypot(dx, dy);
                const maxRange = 160;

                if (dist < maxRange && dist > 0) {
                    const force = (1 - dist / maxRange) * 3.5;
                    star.x -= (dx / dist) * force;
                    star.y -= (dy / dist) * force;
                }

                const alpha = (Math.sin(star.pulse) * 0.3 + 0.7) * star.opacity;
                bgCtx.save();
                bgCtx.beginPath();
                bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                bgCtx.fillStyle = star.color;
                bgCtx.globalAlpha = isDark ? alpha : alpha * 0.6;
                bgCtx.shadowBlur = 8;
                bgCtx.shadowColor = star.color;
                bgCtx.fill();
                bgCtx.restore();
            }

            animationId = requestAnimationFrame(render);
        };

        animationId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [isDark]);

    return (
        <>
            {/* LAYER 1: Deep Background Glow Spotlight (z-0) */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div
                    className="absolute inset-0 transition-opacity duration-300 ease-out"
                    style={{
                        opacity: cursorVisible ? 1 : 0,
                        background: isDark
                            ? `radial-gradient(600px circle at ${smoothMouse.current.x}px ${smoothMouse.current.y}px, rgba(37, 99, 235, 0.22), rgba(6, 182, 212, 0.1), transparent 70%)`
                            : `radial-gradient(600px circle at ${smoothMouse.current.x}px ${smoothMouse.current.y}px, rgba(37, 99, 235, 0.12), rgba(6, 182, 212, 0.06), transparent 70%)`,
                    }}
                />

                {/* Tech Dot Matrix Grid (Lights up under cursor) */}
                <div 
                    className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
                    style={{
                        backgroundImage: isDark
                            ? `radial-gradient(#ffffff 1.2px, transparent 1.2px)`
                            : `radial-gradient(#000000 1.2px, transparent 1.2px)`,
                        backgroundSize: '24px 24px',
                    }}
                />

                {/* Background Ambient Stars Canvas */}
                <canvas ref={bgCanvasRef} className="absolute inset-0 block w-full h-full" />
            </div>

            {/* LAYER 2: Foreground Cursor Sparkle Trail (z-40, above cards and text!) */}
            <canvas 
                ref={fgCanvasRef} 
                className="pointer-events-none fixed inset-0 z-40 block w-full h-full" 
            />

            {/* LAYER 3: Magnetic Glowing Cursor Ring (z-50) */}
            {cursorVisible && (
                <div 
                    className="pointer-events-none fixed z-50 w-8 h-8 rounded-full border border-blue-400/50 dark:border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: `${smoothMouse.current.x}px`,
                        top: `${smoothMouse.current.y}px`,
                    }}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                </div>
            )}
        </>
    );
};

export default InteractiveBackground;
