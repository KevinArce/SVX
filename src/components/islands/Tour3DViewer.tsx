import { useEffect, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initTour3DScene, type MonumentAnchor } from '../../lib/three/tourScene';
import { TRANSLATIONS, type Language, getStoredLanguage } from '../../lib/i18n';

export interface TourStopData {
  slug: string;
  order: number;
  title: string;
  architecturalStyle?: string;
  lat: number;
  lng: number;
  walkingTip?: string;
  estimatedMinutes?: number;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
}

interface Props {
  stops: TourStopData[];
  tourTitle?: string;
}

export default function Tour3DViewer({ stops, tourTitle }: Props) {
  const [lang, setLang] = useState<Language>('es');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeOrder, setActiveOrder] = useState<number | null>(1);
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const [isOverview, setIsOverview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // References for the 3D loop and transitions
  const transitionRef = useRef<{
    active: boolean;
    targetPos: THREE.Vector3;
    targetLook: THREE.Vector3;
  }>({
    active: false,
    targetPos: new THREE.Vector3(36, 46, 36),
    targetLook: new THREE.Vector3(8, 0, 0),
  });

  const anchorsRef = useRef<MonumentAnchor[]>([]);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Focus on a specific stop or overview
  const focusStop = (order: number | null) => {
    setActiveOrder(order);
    if (order === null) {
      setIsOverview(true);
      transitionRef.current = {
        active: true,
        targetPos: new THREE.Vector3(44, 52, 44),
        targetLook: new THREE.Vector3(12, 0, 0),
      };
      return;
    }

    setIsOverview(false);
    const anchor = anchorsRef.current.find((a) => a.order === order);
    if (anchor) {
      const targetLook = anchor.position.clone();
      const targetPos = anchor.position.clone().add(anchor.cameraOffset);
      transitionRef.current = {
        active: true,
        targetPos,
        targetLook,
      };
    }
  };

  const handleNext = () => {
    if (activeOrder === null) {
      focusStop(1);
    } else {
      const next = activeOrder >= stops.length ? 1 : activeOrder + 1;
      focusStop(next);
    }
  };

  const handlePrev = () => {
    if (activeOrder === null) {
      focusStop(stops.length);
    } else {
      const prev = activeOrder <= 1 ? stops.length : activeOrder - 1;
      focusStop(prev);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    setLang(getStoredLanguage());
    const handleLang = (e: Event) => {
      const custom = e as CustomEvent<{ lang: Language }>;
      if (custom.detail?.lang) {
        setLang(custom.detail.lang);
      }
    };
    window.addEventListener('svx:lang', handleLang);
    return () => window.removeEventListener('svx:lang', handleLang);
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark');

    // Dimensions
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    // Setup Three.js scene from our modular engine
    const sceneSetup = initTour3DScene(isDark);
    anchorsRef.current = sceneSetup.anchors;

    // Perspective Camera with low FOV for isometric axonometric feel
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.5, 500);
    // Initial camera position framing the first monument (Palacio Nacional)
    const firstAnchor = sceneSetup.anchors[0];
    if (firstAnchor) {
      camera.position.copy(firstAnchor.position.clone().add(firstAnchor.cameraOffset));
    } else {
      camera.position.set(38, 48, 38);
    }
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.prepend(canvas);

    // Orbit Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.05; // Do not go below ground
    controls.minDistance = 10;
    controls.maxDistance = 90;
    if (firstAnchor) {
      controls.target.copy(firstAnchor.position);
    } else {
      controls.target.set(8, 0, 0);
    }
    controlsRef.current = controls;

    // Interrupt auto-transition if user grabs controls
    controls.addEventListener('start', () => {
      transitionRef.current.active = false;
    });

    setIsLoaded(true);

    // Raycaster for clicking markers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getRaycastHits = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const markerRoots = sceneSetup.anchors.map((a) => a.markerMesh);
      return raycaster.intersectObjects(markerRoots, true);
    };

    const handlePointerMove = (e: MouseEvent) => {
      const hits = getRaycastHits(e);
      if (hits.length > 0) {
        canvas.style.cursor = 'pointer';
        let cur = hits[0].object;
        while (cur.parent && !cur.userData?.order) {
          cur = cur.parent;
        }
        if (cur.userData?.title) {
          setHoveredTitle(cur.userData.title);
        }
      } else {
        canvas.style.cursor = 'grab';
        setHoveredTitle(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const hits = getRaycastHits(e);
      if (hits.length > 0) {
        let cur = hits[0].object;
        while (cur.parent && !cur.userData?.order) {
          cur = cur.parent;
        }
        if (cur.userData?.order) {
          focusStop(cur.userData.order);
        }
      }
    };

    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('click', handleClick);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // Theme Observer
    const themeWatcher = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains('dark');
      sceneSetup.updateTheme(darkNow);
    });
    themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Animate pulsing route beacon
      sceneSetup.updatePulse(elapsedTime);

      // Animate hovering markers
      sceneSetup.anchors.forEach((anchor, i) => {
        const floatY = Math.sin(elapsedTime * 2.5 + i * 1.5) * 0.35;
        anchor.markerMesh.position.y = anchor.position.y + 11.5 + floatY;
      });

      // Smooth camera interpolation
      if (transitionRef.current.active) {
        const { targetPos, targetLook } = transitionRef.current;
        camera.position.lerp(targetPos, 0.05);
        controls.target.lerp(targetLook, 0.05);

        if (camera.position.distanceTo(targetPos) < 0.1 && controls.target.distanceTo(targetLook) < 0.1) {
          camera.position.copy(targetPos);
          controls.target.copy(targetLook);
          transitionRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(sceneSetup.scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      themeWatcher.disconnect();
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('click', handleClick);
      controls.dispose();
      sceneSetup.cleanup();
      renderer.dispose();
      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
      }
    };
  }, []);

  const currentStop = stops.find((s) => s.order === activeOrder);
  const t = TRANSLATIONS[lang].ui;

  const currentStopStyle = currentStop?.slug
    ? (TRANSLATIONS[lang].monuments[currentStop.slug]?.architecturalStyle ?? currentStop.architecturalStyle)
    : currentStop?.architecturalStyle;

  const currentStopTip = currentStop
    ? (TRANSLATIONS[lang].tours['ruta-del-corazon-historico']?.waypoints[currentStop.order - 1]?.walkingTip ?? currentStop.walkingTip)
    : undefined;

  return (
    <div
      ref={containerRef}
      class={`relative w-full overflow-hidden border-2 sm:border-4 border-border bg-card shadow-[8px_8px_0px_0px_var(--color-border)] sm:shadow-[12px_12px_0px_0px_var(--color-border)] ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen border-none shadow-none' : 'h-[580px] sm:h-[640px]'
      }`}
    >
      {/* Loading Overlay */}
      {!isLoaded && (
        <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface/90 font-mono text-sm font-bold uppercase tracking-wider text-text">
          <div class="size-8 animate-spin border-4 border-bauhaus-red border-t-transparent" />
          <span class="mt-4">{t['tour.viewerLoading']}</span>
        </div>
      )}

      {/* Top Bar Controls */}
      <div class="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
        {/* Title Tag */}
        <div class="pointer-events-auto flex items-center gap-2 border-2 border-border bg-surface px-3 py-1.5 font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider text-text shadow-[2px_2px_0px_0px_var(--color-border)]">
          <span class="size-2.5 bg-bauhaus-red" aria-hidden="true" />
          <span>{tourTitle ? `${lang === 'en' ? '3D Guide' : 'Guía 3D'} • ${tourTitle}` : (lang === 'en' ? '3D Isometric Guide' : 'Guía 3D Isométrica')}</span>
          {hoveredTitle && (
            <span class="hidden sm:inline-block text-bauhaus-blue font-bold">
              • {hoveredTitle}
            </span>
          )}
        </div>

        {/* View Controls */}
        <div class="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => focusStop(null)}
            class={`border-2 border-border px-3 py-1.5 font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
              isOverview
                ? 'bg-bauhaus-blue text-pure-white shadow-[2px_2px_0px_0px_var(--color-border)]'
                : 'bg-card text-text hover:bg-surface shadow-[2px_2px_0px_0px_var(--color-border)]'
            }`}
          >
            {t['tour.viewerOverview']}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? t['tour.viewerExitFullscreen'] : t['tour.viewerFullscreen']}
            class="border-2 border-border bg-card px-3 py-1.5 font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider text-text shadow-[2px_2px_0px_0px_var(--color-border)] hover:bg-surface transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            {isFullscreen ? t['tour.viewerExitFullscreen'] : t['tour.viewerFullscreen']}
          </button>
        </div>
      </div>

      {/* Waypoints Selection Pills (Top Centered / Scrollable) */}
      <div class="pointer-events-none absolute inset-x-0 top-14 sm:top-16 z-10 flex justify-center px-3">
        <div class="pointer-events-auto flex max-w-full overflow-x-auto border-2 border-border bg-surface p-1 shadow-[4px_4px_0px_0px_var(--color-border)] scrollbar-none">
          {stops.map((stop) => {
            const isActive = activeOrder === stop.order;
            return (
              <button
                key={stop.slug}
                type="button"
                onClick={() => focusStop(stop.order)}
                class={`flex items-center gap-1.5 whitespace-nowrap px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-bauhaus-red text-pure-white shadow-[2px_2px_0px_0px_var(--color-border)]'
                    : 'text-text hover:bg-card'
                }`}
              >
                <span class={`size-2 inline-block ${isActive ? 'bg-pure-white' : 'bg-border'}`} />
                <span>{stop.order}. {stop.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating HUD Card: Active Waypoint Details */}
      {currentStop && (
        <div class="pointer-events-none absolute inset-x-3 bottom-3 sm:inset-x-auto sm:left-4 sm:bottom-4 z-10 max-w-md">
          <div class="pointer-events-auto border-2 sm:border-4 border-border bg-card p-4 sm:p-5 shadow-[6px_6px_0px_0px_var(--color-border)]">
            <div class="flex items-center justify-between gap-2 border-b-2 border-border pb-2">
              <div class="flex items-center gap-2 font-mono text-[10px] sm:text-xs font-black uppercase tracking-widest text-text-muted">
                <span class="inline-block size-2 bg-bauhaus-yellow border border-border" />
                <span>
                  {t['tour.viewerStopOf']
                    .replace('{order}', String(currentStop.order))
                    .replace('{total}', String(stops.length))}
                </span>
              </div>
              {currentStop.estimatedMinutes && (
                <span class="bg-surface border border-border px-1.5 py-0.5 font-mono text-[10px] sm:text-xs font-bold text-text">
                  ~{currentStop.estimatedMinutes} min
                </span>
              )}
            </div>

            <h3 class="mt-2.5 font-sans text-xl sm:text-2xl font-black uppercase tracking-tight text-text leading-tight">
              {currentStop.title}
            </h3>

            {currentStopStyle && (
              <p class="mt-1 font-mono text-[11px] font-bold uppercase tracking-wider text-bauhaus-blue">
                {t['tour.viewerStylePrefix']}{currentStopStyle}
              </p>
            )}

            {currentStopTip && (
              <p class="mt-2.5 text-xs sm:text-sm font-medium leading-snug text-text-muted border-l-2 border-bauhaus-red pl-2.5">
                "{currentStopTip}"
              </p>
            )}

            {/* Actions */}
            <div class="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-border/40">
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label={lang === 'en' ? 'Previous stop' : 'Parada anterior'}
                  class="border-2 border-border bg-surface px-2.5 py-1 font-mono text-xs font-black uppercase tracking-wider text-text hover:bg-card transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  {t['tour.viewerPrev']}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={lang === 'en' ? 'Next stop' : 'Siguiente parada'}
                  class="border-2 border-border bg-surface px-2.5 py-1 font-mono text-xs font-black uppercase tracking-wider text-text hover:bg-card transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  {t['tour.viewerNext']}
                </button>
              </div>

              <a
                href={currentStop.href}
                class="inline-flex items-center gap-1 border-2 border-border bg-bauhaus-red px-3 py-1 font-mono text-xs font-black uppercase tracking-wider text-pure-white shadow-[2px_2px_0px_0px_var(--color-border)] hover:bg-primary-light transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>{t['tour.viewerDetails']}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Interaction Hint (Bottom-Right) */}
      <div class="pointer-events-none absolute right-3 bottom-3 hidden sm:block z-10 border-2 border-border bg-surface/95 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted shadow-[2px_2px_0px_0px_var(--color-border)]">
        {t['tour.viewerHint']}
      </div>
    </div>
  );
}
