/**
 * VAIRAMUTHU B. | 3D ANIMATED FULL STACK PORTFOLIO ENGINE
 * 
 * Includes:
 * 1. Theme Manager (Light Mode + Dark Mode with Real-Time Canvas Adaptation)
 * 2. Cinematic System Boot Loader
 * 3. Hardware-Accelerated 3D Background Canvas (Particle Mesh & Constellations)
 * 4. 3D Digital Engineering Core (Hero Canvas with 3D Matrix Projection)
 * 5. 3D Interactive Technology Universe (Node Constellation)
 * 6. Vanilla 3D Card Tilt Engine with Specular Glare
 * 7. Laser Timeline Progress & ScrollSpy
 * 8. Dual Cursor Tracking System
 * 9. Contact Form Handling & Copy Utilities
 */

document.addEventListener('DOMContentLoaded', () => {

  // Reduced motion preference check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // ==========================================================================
  // 1. THEME MANAGER SYSTEM (LIGHT / DARK)
  // ==========================================================================
  const ThemeManager = {
    currentTheme: 'dark',
    listeners: [],

    init() {
      const savedTheme = localStorage.getItem('portfolio-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.currentTheme = savedTheme;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        this.currentTheme = 'light';
      } else {
        this.currentTheme = 'dark';
      }
      this.applyTheme(this.currentTheme, false);

      // Listen for system theme changes if not manually set
      if (!savedTheme && window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem('portfolio-theme')) {
            this.applyTheme(e.matches ? 'dark' : 'light', true);
          }
        });
      }

      // Attach Toggle Buttons
      const desktopToggle = document.getElementById('theme-toggle-desktop');
      const mobileToggle = document.getElementById('theme-toggle-mobile-header');

      const toggleAction = () => {
        const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme, true);
        localStorage.setItem('portfolio-theme', nextTheme);
      };

      if (desktopToggle) desktopToggle.addEventListener('click', toggleAction);
      if (mobileToggle) mobileToggle.addEventListener('click', toggleAction);
    },

    applyTheme(theme, notify = true) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      if (notify) {
        this.listeners.forEach(cb => cb(theme));
      }
    },

    onThemeChange(cb) {
      this.listeners.push(cb);
    },

    isDark() {
      return this.currentTheme === 'dark';
    }
  };

  ThemeManager.init();


  // ==========================================================================
  // 2. CINEMATIC SYSTEM BOOT LOADER
  // ==========================================================================
  const systemLoader = document.getElementById('system-loader');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderFill = document.getElementById('loader-fill');
  const loaderStatus = document.getElementById('loader-status');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 8;
    if (progress > 100) progress = 100;

    if (loaderPercent) loaderPercent.textContent = `${progress}%`;
    if (loaderFill) loaderFill.style.width = `${progress}%`;

    if (progress > 40 && progress < 80 && loaderStatus) {
      loaderStatus.textContent = 'CONFIGURING SYSTEM BUS...';
    } else if (progress >= 80 && loaderStatus) {
      loaderStatus.textContent = 'SYSTEM READY.';
    }

    if (progress >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        if (systemLoader) systemLoader.classList.add('loaded');
        triggerInitialReveals();
      }, 250);
    }
  }, 45);


  // ==========================================================================
  // 3. SCROLL REVEAL OBSERVER
  // ==========================================================================
  const triggerInitialReveals = () => {
    const revealElements = document.querySelectorAll('.reveal-init, .reveal-left-init, .reveal-right-init');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  };


  // ==========================================================================
  // 4. GLOBAL 3D BACKGROUND CANVAS (THEME ADAPTIVE)
  // ==========================================================================
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas && !prefersReducedMotion) {
    const ctx = bgCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = isTouchDevice ? 35 : 70;
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 0.8 + 0.2; // Depth
        this.vx = (Math.random() - 0.5) * 0.4 * this.z;
        this.vy = (Math.random() - 0.5) * 0.4 * this.z;
        this.radius = Math.random() * 1.5 * this.z + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }
      }
      draw(isDark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = `rgba(100, 255, 218, ${this.alpha * 0.7})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(100, 255, 218, 0.4)';
        } else {
          ctx.fillStyle = `rgba(13, 148, 136, ${this.alpha * 0.5})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    if (!isTouchDevice) {
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });
    }

    const animateBg = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = ThemeManager.isDark();

      // Connect near particles with faint laser lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (1 - dist / 110) * (isDark ? 0.15 : 0.08);
            ctx.strokeStyle = isDark ? `rgba(100, 255, 218, ${lineAlpha})` : `rgba(13, 148, 136, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw(isDark);
      });

      requestAnimationFrame(animateBg);
    };
    animateBg();
  }


  // ==========================================================================
  // 5. 3D DIGITAL ENGINEERING CORE (HERO CANVAS THEME ADAPTIVE)
  // ==========================================================================
  const heroCoreCanvas = document.getElementById('hero-core-canvas');
  if (heroCoreCanvas) {
    const ctx = heroCoreCanvas.getContext('2d');
    const width = heroCoreCanvas.width;
    const height = heroCoreCanvas.height;
    const cx = width / 2;
    const cy = height / 2;

    const nodeCount = 52;
    const nodes = [];
    const radius = 135;

    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
      const phi = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      nodes.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta)
      });
    }

    let angleX = 0.2;
    let angleY = 0.3;
    let targetAngleX = 0.2;
    let targetAngleY = 0.3;

    if (!isTouchDevice) {
      window.addEventListener('mousemove', (e) => {
        const rect = heroCoreCanvas.getBoundingClientRect();
        const coreCenterX = rect.left + rect.width / 2;
        const coreCenterY = rect.top + rect.height / 2;
        targetAngleY = (e.clientX - coreCenterX) * 0.0015;
        targetAngleX = -(e.clientY - coreCenterY) * 0.0015;
      });
    }

    let ringAngle1 = 0;
    let ringAngle2 = 0;

    const renderHeroCore = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = ThemeManager.isDark();

      angleX += (targetAngleX - angleX) * 0.05 + 0.003;
      angleY += (targetAngleY - angleY) * 0.05 + 0.004;

      ringAngle1 += 0.015;
      ringAngle2 -= 0.012;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected = nodes.map(node => {
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;
        let y1 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        const fov = 320;
        const scale = fov / (fov + z2);
        return {
          x: cx + x1 * scale,
          y: cy + y1 * scale,
          z: z2,
          scale: scale
        };
      });

      // Connecting wireframe lines
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 65) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            const depthFactor = (projected[i].z + projected[j].z) / (radius * 2);
            const alpha = Math.max(0.05, (1 - dist / 65) * (0.35 + depthFactor * 0.25));
            ctx.strokeStyle = isDark ? `rgba(100, 255, 218, ${alpha})` : `rgba(13, 148, 136, ${alpha * 0.8})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      projected.sort((a, b) => a.z - b.z);
      projected.forEach(p => {
        const nodeRadius = Math.max(1, p.scale * 3.2);
        const alpha = Math.max(0.2, (p.z + radius) / (radius * 2));
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = `rgba(100, 255, 218, ${alpha})`;
          if (alpha > 0.6) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#64ffda';
          }
        } else {
          ctx.fillStyle = `rgba(13, 148, 136, ${alpha})`;
          if (alpha > 0.6) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#0d9488';
          }
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Outer Orbital Energy Rings
      const ring1Color = isDark ? '#38bdf8' : '#0284c7';
      const ring2Color = isDark ? '#64ffda' : '#0d9488';
      drawOrbitalRing(ctx, cx, cy, 185, ringAngle1, ring1Color, isDark ? 0.2 : 0.35);
      drawOrbitalRing(ctx, cx, cy, 210, ringAngle2, ring2Color, isDark ? 0.25 : 0.4);

      requestAnimationFrame(renderHeroCore);
    };

    const drawOrbitalRing = (context, x, y, r, angle, color, alpha) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.scale(1, 0.35);
      context.beginPath();
      context.arc(0, 0, r, 0, Math.PI * 2);
      context.strokeStyle = color;
      context.globalAlpha = alpha;
      context.lineWidth = 1.2;
      context.stroke();

      // Satellite beacon
      context.beginPath();
      context.arc(r * Math.cos(angle * 2), r * Math.sin(angle * 2), 3.5, 0, Math.PI * 2);
      context.fillStyle = ThemeManager.isDark() ? '#ffffff' : color;
      context.shadowBlur = 8;
      context.shadowColor = color;
      context.fill();
      context.restore();
    };

    renderHeroCore();
  }


  // ==========================================================================
  // 6. 3D INTERACTIVE TECHNOLOGY UNIVERSE (THEME ADAPTIVE)
  // ==========================================================================
  const techCanvas = document.getElementById('tech-universe-canvas');
  if (techCanvas) {
    const ctx = techCanvas.getContext('2d');
    let width, height;

    const resizeTech = () => {
      const rect = techCanvas.parentElement.getBoundingClientRect();
      width = techCanvas.width = rect.width;
      height = techCanvas.height = rect.height;
    };
    resizeTech();
    window.addEventListener('resize', resizeTech);

    const techNodes = [
      { id: 'node', label: 'Node.js', x: 0.5, y: 0.38, tier: 'backend', colorDark: '#64ffda', colorLight: '#0d9488', size: 12 },
      { id: 'nest', label: 'NestJS', x: 0.32, y: 0.28, tier: 'backend', colorDark: '#64ffda', colorLight: '#0d9488', size: 10 },
      { id: 'js', label: 'JavaScript', x: 0.68, y: 0.28, tier: 'backend', colorDark: '#64ffda', colorLight: '#0d9488', size: 10 },
      { id: 'react', label: 'React', x: 0.5, y: 0.62, tier: 'frontend', colorDark: '#38bdf8', colorLight: '#0284c7', size: 11 },
      { id: 'tailwind', label: 'Tailwind CSS', x: 0.35, y: 0.72, tier: 'frontend', colorDark: '#38bdf8', colorLight: '#0284c7', size: 8 },
      { id: 'postgres', label: 'PostgreSQL', x: 0.2, y: 0.5, tier: 'data', colorDark: '#818cf8', colorLight: '#4f46e5', size: 10 },
      { id: 'mongo', label: 'MongoDB', x: 0.8, y: 0.5, tier: 'data', colorDark: '#818cf8', colorLight: '#4f46e5', size: 10 },
      { id: 'sql', label: 'SQL', x: 0.65, y: 0.72, tier: 'data', colorDark: '#818cf8', colorLight: '#4f46e5', size: 9 },
      { id: 'powerbi', label: 'Power BI', x: 0.85, y: 0.75, tier: 'data', colorDark: '#f59e0b', colorLight: '#d97706', size: 8 },
      { id: 'excel', label: 'Excel', x: 0.15, y: 0.75, tier: 'data', colorDark: '#10b981', colorLight: '#059669', size: 8 }
    ];

    const techLinks = [
      { from: 'node', to: 'nest' },
      { from: 'node', to: 'js' },
      { from: 'node', to: 'postgres' },
      { from: 'node', to: 'mongo' },
      { from: 'node', to: 'react' },
      { from: 'react', to: 'tailwind' },
      { from: 'react', to: 'js' },
      { from: 'postgres', to: 'sql' },
      { from: 'mongo', to: 'node' },
      { from: 'sql', to: 'powerbi' },
      { from: 'sql', to: 'excel' }
    ];

    let hoveredNode = null;
    let techMouse = { x: -1000, y: -1000 };

    techCanvas.addEventListener('mousemove', (e) => {
      const rect = techCanvas.getBoundingClientRect();
      techMouse.x = e.clientX - rect.left;
      techMouse.y = e.clientY - rect.top;

      let found = null;
      techNodes.forEach(node => {
        const nx = node.x * width;
        const ny = node.y * height;
        const dist = Math.hypot(techMouse.x - nx, techMouse.y - ny);
        if (dist < node.size + 15) {
          found = node;
        }
      });
      hoveredNode = found;
    });

    techCanvas.addEventListener('mouseleave', () => {
      hoveredNode = null;
      techMouse.x = -1000;
      techMouse.y = -1000;
    });

    let frame = 0;
    const renderTechUniverse = () => {
      frame += 0.02;
      ctx.clearRect(0, 0, width, height);
      const isDark = ThemeManager.isDark();

      // Draw Links
      techLinks.forEach(link => {
        const from = techNodes.find(n => n.id === link.from);
        const to = techNodes.find(n => n.id === link.to);
        if (!from || !to) return;

        const fx = from.x * width + Math.sin(frame + from.size) * 3;
        const fy = from.y * height + Math.cos(frame + from.size) * 3;
        const tx = to.x * width + Math.sin(frame + to.size) * 3;
        const ty = to.y * height + Math.cos(frame + to.size) * 3;

        const isHighlighted = hoveredNode && (hoveredNode.id === from.id || hoveredNode.id === to.id);

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        const baseColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)';
        const activeColor = isDark ? '#64ffda' : '#0d9488';
        ctx.strokeStyle = isHighlighted ? activeColor : baseColor;
        ctx.lineWidth = isHighlighted ? 2 : 1;
        if (isHighlighted && isDark) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = activeColor;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Nodes
      techNodes.forEach(node => {
        const nx = node.x * width + Math.sin(frame + node.size) * 3;
        const ny = node.y * height + Math.cos(frame + node.size) * 3;
        const isHovered = hoveredNode && hoveredNode.id === node.id;
        const isLinked = hoveredNode && techLinks.some(l => 
          (l.from === hoveredNode.id && l.to === node.id) || (l.to === hoveredNode.id && l.from === node.id)
        );

        const currentSize = isHovered ? node.size * 1.35 : node.size;
        const alpha = (hoveredNode && !isHovered && !isLinked) ? 0.25 : 1;
        const nodeColor = isDark ? node.colorDark : node.colorLight;

        // Aura
        ctx.beginPath();
        ctx.arc(nx, ny, currentSize + 6, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}18`;
        ctx.fill();

        // Node dot
        ctx.beginPath();
        ctx.arc(nx, ny, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.globalAlpha = alpha;
        if ((isHovered || isLinked) && isDark) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = nodeColor;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Label
        ctx.font = `${isHovered ? 'bold 12px' : '500 11px'} 'Fira Code', monospace`;
        if (isDark) {
          ctx.fillStyle = isHovered ? '#ffffff' : (hoveredNode && !isHovered && !isLinked ? '#64748b' : '#cbd5e1');
        } else {
          ctx.fillStyle = isHovered ? '#0f172a' : (hoveredNode && !isHovered && !isLinked ? '#94a3b8' : '#334155');
        }
        ctx.textAlign = 'center';
        ctx.fillText(node.label, nx, ny + currentSize + 16);
      });

      requestAnimationFrame(renderTechUniverse);
    };
    renderTechUniverse();
  }


  // ==========================================================================
  // 7. VANILLA 3D CARD TILT ENGINE
  // ==========================================================================
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (!isTouchDevice && !prefersReducedMotion) {
    tiltCards.forEach(card => {
      const glare = card.querySelector('.card-glare');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

        if (glare) {
          const glareX = (x / rect.width) * 100;
          const glareY = (y / rect.height) * 100;
          const glareAlpha = ThemeManager.isDark() ? 0.15 : 0.08;
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareAlpha}) 0%, transparent 65%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        if (glare) {
          glare.style.background = 'transparent';
        }
      });
    });
  }


  // ==========================================================================
  // 8. SYSTEM TIMELINE LASER BUS & SCROLLSPY
  // ==========================================================================
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineSection = document.getElementById('experience');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Timeline Progress Calculation
    if (timelineSection && timelineProgress) {
      const start = timelineSection.offsetTop;
      const height = timelineSection.offsetHeight;
      const current = window.scrollY - start + 250;
      let percent = (current / height) * 100;
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;
      timelineProgress.style.height = `${percent}%`;
    }

    // ScrollSpy active link toggle
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (window.scrollY >= top && window.scrollY < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('data-nav') === id) {
            link.classList.remove('text-body-muted');
            link.classList.add('text-accent-teal');
          } else {
            link.classList.remove('text-accent-teal');
            link.classList.add('text-body-muted');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  // ==========================================================================
  // 9. DUAL-RING CUSTOM CURSOR (DESKTOP)
  // ==========================================================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && !isTouchDevice) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    const interactiveElements = document.querySelectorAll('a, button, [data-tilt], input, textarea, .project-tag');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });
  }


  // ==========================================================================
  // 10. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars-staggered');
        icon.classList.toggle('fa-xmark');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        const icon = menuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars-staggered');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }


  // ==========================================================================
  // 11. ONE-CLICK CLIPBOARD COPY UTILITY
  // ==========================================================================
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check text-accent-teal"></i> <span class="text-accent-teal">COPIED!</span>';
        btn.classList.add('border-glow');
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('border-glow');
        }, 2000);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  });


  // ==========================================================================
  // 12. WEB3FORMS CONTACT SUBMISSION WITH ROBUST FALLBACK
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const btnText = document.getElementById('btn-text');

  if (contactForm && formSubmitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        alert('Please fill out all fields.');
        return;
      }

      const fallbackSubmit = () => {
        contactForm.setAttribute('action', 'https://api.web3forms.com/submit');
        contactForm.setAttribute('method', 'POST');
        contactForm.submit();
      };

      formSubmitBtn.disabled = true;
      if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin mr-2"></i> TRANSMITTING...';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '680b8957-1088-400f-bce8-575a4e5eedc9',
          name: name,
          email: email,
          subject: subject,
          message: message,
          from_name: 'Vairamuthu Portfolio 3D Command Form'
        })
      })
      .then(res => res.json())
      .then(data => {
        formSubmitBtn.disabled = false;
        if (btnText) btnText.innerHTML = 'SEND MESSAGE →';

        if (data.success === 'true' || data.success === true) {
          contactForm.reset();
          if (formSuccess) {
            formSuccess.classList.remove('hidden');
            formSuccess.classList.add('flex');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            setTimeout(() => {
              formSuccess.classList.add('opacity-0');
              setTimeout(() => {
                formSuccess.classList.add('hidden');
                formSuccess.classList.remove('flex', 'opacity-0');
              }, 400);
            }, 5000);
          }
        } else {
          fallbackSubmit();
        }
      })
      .catch(err => {
        console.error('AJAX Submit Error:', err);
        fallbackSubmit();
      });
    });
  }

});
