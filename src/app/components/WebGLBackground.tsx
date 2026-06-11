import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function WebGLBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    
    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.z = 75;

    // Renderer (transparent background to lay over var(--canvas-bone))
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 2. Grid Particles & Connecting Lines Configuration
    const cols = 65;
    const rows = 45;
    const particleCount = cols * rows;
    const spacingX = 2.4;
    const spacingY = 1.8;

    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const homePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const baseColors = new Float32Array(particleCount * 3);

    // Brand color vectors
    const colorGold = new THREE.Color('#D4AF37'); // Meridian Gold
    const colorInk = new THREE.Color('#334155');  // Slate/Abyss Ink

    // Initialize positions, home positions, and colors (with 3D depth noise)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        
        // Center the grid in 3D space
        const x = (c - (cols - 1) / 2) * spacingX;
        const y = (r - (rows - 1) / 2) * spacingY;
        // Add subtle Z depth noise for 3D parallax effect inside the grid
        const z = (Math.random() - 0.5) * 4.0; 

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        homePositions[i * 3] = x;
        homePositions[i * 3 + 1] = y;
        homePositions[i * 3 + 2] = z;

        // Color distribution: ~20% gold nodes, ~80% slate/ink nodes
        const isGold = Math.random() < 0.20;
        const nodeColor = isGold ? colorGold : colorInk;
        
        colors[i * 3] = nodeColor.r;
        colors[i * 3 + 1] = nodeColor.g;
        colors[i * 3 + 2] = nodeColor.b;

        baseColors[i * 3] = nodeColor.r;
        baseColors[i * 3 + 1] = nodeColor.g;
        baseColors[i * 3 + 2] = nodeColor.b;
      }
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Signal Pulses (Active Data Flows traversing the network paths)
    interface SignalPulse {
      currentIdx: number;
      targetIdx: number;
      progress: number;
      speed: number;
    }
    
    const maxPulses = 12; // 12 concurrent data flow sparks
    const pulses: SignalPulse[] = [];
    
    const getNeighbors = (idx: number) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const neighbors: number[] = [];
      if (c > 0) neighbors.push(idx - 1);
      if (c < cols - 1) neighbors.push(idx + 1);
      if (r > 0) neighbors.push(idx - cols);
      if (r < rows - 1) neighbors.push(idx + cols);
      return neighbors;
    };
    
    for (let p = 0; p < maxPulses; p++) {
      const startIdx = Math.floor(Math.random() * particleCount);
      const neighbors = getNeighbors(startIdx);
      const targetIdx = neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : startIdx;
      pulses.push({
        currentIdx: startIdx,
        targetIdx: targetIdx,
        progress: Math.random(),
        speed: 0.015 + Math.random() * 0.02,
      });
    }

    // Dynamic anti-aliased circular particle texture
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    // Particles Material
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      map: createCircleTexture(),
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Build line segments to connect neighbors in a network grid
    const lineIndices: number[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        // Connect to right neighbor
        if (c < cols - 1) {
          lineIndices.push(idx, idx + 1);
        }
        // Connect to bottom neighbor
        if (r < rows - 1) {
          lineIndices.push(idx, idx + cols);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    // Share position array buffer directly with points geometry
    lineGeometry.setAttribute('position', pointsGeometry.getAttribute('position'));
    lineGeometry.setIndex(lineIndices);

    // Faint connection lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: '#D1D5DB', // stone-ridge
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // 3. Mouse Interaction, Raycasting & Parallax Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Raycast to Z=0 plane
    
    // Initially place the mouse intersection point infinitely far away
    const intersection = new THREE.Vector3(9999, 9999, 9999);
    let isMouseActive = false;

    // Camera parallax offset targets
    const targetCameraPos = new THREE.Vector3(0, 0, 75);

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      isMouseActive = true;

      // Calculate camera parallax offsets
      targetCameraPos.x = mouse.x * 8.0;
      targetCameraPos.y = mouse.y * 6.0;
    };

    const onMouseLeave = () => {
      isMouseActive = false;
      intersection.set(9999, 9999, 9999);
      targetCameraPos.x = 0;
      targetCameraPos.y = 0;
    };

    // Click Ripple / Clock Edge Wave
    let clickTime = -999;
    const clickPosition = new THREE.Vector3();
    let isClickActive = false;

    const onMouseDown = (event: MouseEvent) => {
      // Don't trigger ripple if clicking interactive GUI elements
      const target = event.target as HTMLElement;
      if (
        target.closest('button') || 
        target.closest('a') || 
        target.closest('input') || 
        target.closest('select') || 
        target.closest('textarea')
      ) {
        return;
      }

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, clickPosition);
      clickTime = clock.getElapsedTime();
      isClickActive = true;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onMouseDown);

    // 4. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const posAttr = pointsGeometry.attributes.position;
      const positions = posAttr.array as Float32Array;
      const colorAttr = pointsGeometry.attributes.color;
      const colorsArr = colorAttr.array as Float32Array;

      // Update camera position with smooth LERP inertia (tilting parallax)
      camera.position.x += (targetCameraPos.x - camera.position.x) * 0.04;
      camera.position.y += (targetCameraPos.y - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Update raycast intersection target if mouse is active
      if (isMouseActive) {
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, intersection);
      }

      // Update active signal pulses
      for (let p = 0; p < maxPulses; p++) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1.0) {
          pulse.currentIdx = pulse.targetIdx;
          const neighbors = getNeighbors(pulse.currentIdx);
          pulse.targetIdx = neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : pulse.currentIdx;
          pulse.progress = 0.0;
          pulse.speed = 0.012 + Math.random() * 0.018;
        }
      }

      // Compute pulse node color boosts
      const pulseBoosts = new Float32Array(particleCount);
      for (let p = 0; p < maxPulses; p++) {
        const pulse = pulses[p];
        pulseBoosts[pulse.currentIdx] += (1.0 - pulse.progress) * 1.5;
        pulseBoosts[pulse.targetIdx] += pulse.progress * 1.5;
      }

      // Click ripple wavefront calculations
      const elapsedSinceClick = time - clickTime;
      const rippleSpeed = 35.0; 
      const rippleWidth = 7.0;
      const rippleStrength = 4.0;
      const clickLifetime = 2.0;
      const clickDecay = Math.max(0, 1 - elapsedSinceClick / clickLifetime);

      for (let i = 0; i < particleCount; i++) {
        const homeX = homePositions[i * 3];
        const homeY = homePositions[i * 3 + 1];
        const homeZ = homePositions[i * 3 + 2];

        // 1. Slow diagonal organic wave swell
        const waveX = Math.sin(time * 0.5 + homeX * 0.04 + homeY * 0.04) * 1.0;
        const waveY = Math.cos(time * 0.5 + homeX * 0.04 + homeY * 0.04) * 1.0;
        const waveZ = Math.sin(time * 0.8 + homeX * 0.06 + homeY * 0.06) * 1.5;

        const targetX = homeX + waveX;
        const targetY = homeY + waveY;
        const targetZ = homeZ + waveZ;

        // 2. Cursor repulsion math
        const currentX = positions[i * 3];
        const currentY = positions[i * 3 + 1];
        const currentZ = positions[i * 3 + 2];

        const dx = targetX - intersection.x;
        const dy = targetY - intersection.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let repelX = 0;
        let repelY = 0;
        let repelZ = 0;

        const influenceRadius = 16;
        if (dist < influenceRadius) {
          const force = (1 - dist / influenceRadius) * 5.5; 
          const angle = Math.atan2(dy, dx);
          
          repelX = Math.cos(angle) * force;
          repelY = Math.sin(angle) * force;
          repelZ = -force * 0.8;
        }

        // 3. Click ripple physical Z offset and color boost
        let clickRippleZ = 0;
        let rippleColorBoost = 0;
        if (isClickActive && clickDecay > 0) {
          const dxClick = targetX - clickPosition.x;
          const dyClick = targetY - clickPosition.y;
          const distClick = Math.sqrt(dxClick * dxClick + dyClick * dyClick);
          
          const waveFrontDist = elapsedSinceClick * rippleSpeed;
          const distFromFront = Math.abs(distClick - waveFrontDist);
          
          if (distFromFront < rippleWidth) {
            const rippleFactor = (1 - distFromFront / rippleWidth) * clickDecay;
            clickRippleZ = Math.sin(distClick * 0.4 - time * 12) * rippleStrength * rippleFactor;
            rippleColorBoost = rippleFactor * 1.5;
          }
        }

        const finalTargetX = targetX + repelX;
        const finalTargetY = targetY + repelY;
        const finalTargetZ = targetZ + repelZ + clickRippleZ;

        // 4. Smooth LERP interpolation
        positions[i * 3] += (finalTargetX - currentX) * 0.08;
        positions[i * 3 + 1] += (finalTargetY - currentY) * 0.08;
        positions[i * 3 + 2] += (finalTargetZ - currentZ) * 0.08;

        // 5. Dynamic Color boost combination & LERP
        const baseR = baseColors[i * 3];
        const baseG = baseColors[i * 3 + 1];
        const baseB = baseColors[i * 3 + 2];

        const totalBoost = pulseBoosts[i] + rippleColorBoost;
        const targetR = baseR + totalBoost * (1.0 - baseR);
        const targetG = baseG + totalBoost * (0.92 - baseG);
        const targetB = baseB + totalBoost * (0.5 - baseB);

        colorsArr[i * 3] += (targetR - colorsArr[i * 3]) * 0.1;
        colorsArr[i * 3 + 1] += (targetG - colorsArr[i * 3 + 1]) * 0.1;
        colorsArr[i * 3 + 2] += (targetB - colorsArr[i * 3 + 2]) * 0.1;
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // 5. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onMouseDown);

      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }

      // Dispose webgl resources
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: -1 }} 
    />
  );
}
