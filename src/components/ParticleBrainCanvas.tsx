import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface ParticleBrainCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
  activeSectionVisible: boolean;
  logoPulseRef?: React.MutableRefObject<number>;
}

interface MorphParticleData {
  wenewPos: THREE.Vector3;
  wenewNormal: THREE.Vector3;
  popPos: THREE.Vector3;
  popDir: THREE.Vector3;
  popRot: THREE.Euler;
  logoPos: THREE.Vector3;
  logoNormal: THREE.Vector3;
  wenewQuat: THREE.Quaternion;
  logoQuat: THREE.Quaternion;
  baseScale: number;
  letterCenterX: number;
  chromeShade: number;
  logoShade: number;
  gatherDelay: number;
  swirlOffset: THREE.Vector3;
  phase: number;
}

const _vec3 = new THREE.Vector3();
const _restPos = new THREE.Vector3();
const _explodedPos = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _mouseWorld = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _deltaQuat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _scaleVec = new THREE.Vector3();
const _colorChrome = new THREE.Color();
const _colorLogo = new THREE.Color();
const _color = new THREE.Color();
const _chromeDark = new THREE.Color('#475569');
const _chromeMid = new THREE.Color('#cbd5e1');
const _chromeSilver = new THREE.Color('#e2e8f0');
const _chromeHighlight = new THREE.Color('#ffffff');
const _chromePulseGreen = new THREE.Color('#44d62c');
const _hoverGreenBright = new THREE.Color('#68e853');
const _logoWhiteShadow = new THREE.Color('#dbe1e8');
const _logoWhiteMid = new THREE.Color('#f4f6f8');
const _logoWhitePure = new THREE.Color('#ffffff');
const _up = new THREE.Vector3(0, 1, 0);

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createTriangleGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const r = 0.01;
  const h = 0.003;
  const vertices = new Float32Array([
    0, r, h,
    -r * 0.866, -r * 0.5, h,
    r * 0.866, -r * 0.5, h,
    0, r, -h,
    r * 0.866, -r * 0.5, -h,
    -r * 0.866, -r * 0.5, -h,
  ]);
  const indices = new Uint16Array([
    0, 1, 2,
    3, 4, 5,
    0, 3, 1, 1, 3, 5,
    1, 5, 2, 2, 5, 4,
    2, 4, 0, 0, 4, 3,
  ]);
  geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geom.setIndex(new THREE.BufferAttribute(indices, 1));
  geom.computeVertexNormals();
  return geom;
}

function makeShapeFromPoints(pts: [number, number][]): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    s.lineTo(pts[i][0], pts[i][1]);
  }
  s.closePath();
  return s;
}

function createLetterShapes(): { char: string; shape: THREE.Shape; centerX: number }[] {
  const makeW = () =>
    makeShapeFromPoints([
      [-0.43, 0.46],
      [-0.28, 0.46],
      [-0.18, -0.14],
      [-0.07, 0.46],
      [0.07, 0.46],
      [0.18, -0.14],
      [0.28, 0.46],
      [0.43, 0.46],
      [0.26, -0.46],
      [0.11, -0.46],
      [0.0, 0.14],
      [-0.11, -0.46],
      [-0.26, -0.46],
    ]);

  const makeE = () =>
    makeShapeFromPoints([
      [-0.28, 0.46],
      [0.28, 0.46],
      [0.28, 0.315],
      [-0.135, 0.315],
      [-0.135, 0.07],
      [0.22, 0.07],
      [0.22, -0.07],
      [-0.135, -0.07],
      [-0.135, -0.315],
      [0.28, -0.315],
      [0.28, -0.46],
      [-0.28, -0.46],
    ]);

  const makeN = () =>
    makeShapeFromPoints([
      [-0.31, 0.46],
      [-0.155, 0.46],
      [0.165, -0.14],
      [0.165, 0.46],
      [0.31, 0.46],
      [0.31, -0.46],
      [0.155, -0.46],
      [-0.165, 0.14],
      [-0.165, -0.46],
      [-0.31, -0.46],
    ]);

  return [
    { char: 'W', shape: makeW(), centerX: -1.56 },
    { char: 'E', shape: makeE(), centerX: -0.72 },
    { char: 'N', shape: makeN(), centerX: 0.0 },
    { char: 'E', shape: makeE(), centerX: 0.72 },
    { char: 'W', shape: makeW(), centerX: 1.56 },
  ];
}

function createLogoShapes(): { shape: THREE.Shape; weight: number }[] {
  const body = new THREE.Shape();
  body.moveTo(0, 0.33);
  body.lineTo(0.11, 0.35);
  body.lineTo(0.24, 0.68);
  body.quadraticCurveTo(0.262, 0.705, 0.285, 0.68);
  body.lineTo(0.415, 0.14);
  body.lineTo(0.56, -0.35);
  body.lineTo(0.69, 0.31);
  body.quadraticCurveTo(0.768, 0.34, 0.845, 0.31);
  body.lineTo(1.035, -0.27);
  body.lineTo(1.18, 0.31);
  body.quadraticCurveTo(1.26, 0.33, 1.315, 0.25);
  body.lineTo(1.13, -0.64);
  body.quadraticCurveTo(1.035, -0.695, 0.945, -0.665);
  body.lineTo(0.765, 0.02);
  body.lineTo(0.575, -0.69);
  body.lineTo(-0.575, -0.69);
  body.lineTo(-0.765, 0.02);
  body.lineTo(-0.945, -0.665);
  body.quadraticCurveTo(-1.035, -0.695, -1.13, -0.64);
  body.lineTo(-1.315, 0.25);
  body.quadraticCurveTo(-1.26, 0.33, -1.18, 0.31);
  body.lineTo(-1.035, -0.27);
  body.lineTo(-0.845, 0.31);
  body.quadraticCurveTo(-0.768, 0.34, -0.69, 0.31);
  body.lineTo(-0.56, -0.35);
  body.lineTo(-0.415, 0.14);
  body.lineTo(-0.285, 0.68);
  body.quadraticCurveTo(-0.262, 0.705, -0.24, 0.68);
  body.lineTo(-0.11, 0.35);
  body.closePath();

  const upperHole = new THREE.Path();
  upperHole.moveTo(-0.175, 0.165);
  upperHole.lineTo(0.175, 0.165);
  upperHole.lineTo(0.215, -0.06);
  upperHole.lineTo(-0.215, -0.06);
  upperHole.closePath();
  body.holes.push(upperHole);

  const lowerHole = new THREE.Path();
  lowerHole.moveTo(-0.25, -0.23);
  lowerHole.lineTo(0.25, -0.23);
  lowerHole.lineTo(0.31, -0.54);
  lowerHole.lineTo(-0.31, -0.54);
  lowerHole.closePath();
  body.holes.push(lowerHole);

  const leftDot = new THREE.Shape();
  leftDot.absarc(-0.55, 0.54, 0.135, 0, Math.PI * 2, false);

  const rightDot = new THREE.Shape();
  rightDot.absarc(0.55, 0.54, 0.135, 0, Math.PI * 2, false);

  return [
    { shape: body, weight: 12100 },
    { shape: leftDot, weight: 700 },
    { shape: rightDot, weight: 700 },
  ];
}

function sampleUniformSurfacePoints(
  geo: THREE.BufferGeometry,
  count: number,
  rand: () => number
): { pos: THREE.Vector3; normal: THREE.Vector3 }[] {
  const posAttr = geo.attributes.position;
  const normAttr = geo.attributes.normal;
  const index = geo.index;
  const triCount = index ? index.count / 3 : posAttr.count / 3;

  const areas = new Float64Array(triCount);
  let totalArea = 0;

  const v0 = new THREE.Vector3();
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  const cross = new THREE.Vector3();

  for (let t = 0; t < triCount; t++) {
    const i0 = index ? index.getX(t * 3) : t * 3;
    const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    v0.fromBufferAttribute(posAttr, i0);
    v1.fromBufferAttribute(posAttr, i1);
    v2.fromBufferAttribute(posAttr, i2);
    e1.subVectors(v1, v0);
    e2.subVectors(v2, v0);
    cross.crossVectors(e1, e2);
    totalArea += cross.length() * 0.5;
    areas[t] = totalArea;
  }

  const n0 = new THREE.Vector3();
  const n1 = new THREE.Vector3();
  const n2 = new THREE.Vector3();
  const results: { pos: THREE.Vector3; normal: THREE.Vector3 }[] = [];

  for (let s = 0; s < count; s++) {
    const r = rand() * totalArea;
    let lo = 0;
    let hi = triCount - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (areas[mid] < r) lo = mid + 1;
      else hi = mid;
    }

    const i0 = index ? index.getX(lo * 3) : lo * 3;
    const i1 = index ? index.getX(lo * 3 + 1) : lo * 3 + 1;
    const i2 = index ? index.getX(lo * 3 + 2) : lo * 3 + 2;

    v0.fromBufferAttribute(posAttr, i0);
    v1.fromBufferAttribute(posAttr, i1);
    v2.fromBufferAttribute(posAttr, i2);
    n0.fromBufferAttribute(normAttr, i0);
    n1.fromBufferAttribute(normAttr, i1);
    n2.fromBufferAttribute(normAttr, i2);

    const sq = Math.sqrt(rand());
    const u = 1 - sq;
    const v = sq * (1 - rand());
    const w = 1 - u - v;

    const pos = new THREE.Vector3(
      v0.x * u + v1.x * v + v2.x * w,
      v0.y * u + v1.y * v + v2.y * w,
      v0.z * u + v1.z * v + v2.z * w
    );
    const normal = new THREE.Vector3(
      n0.x * u + n1.x * v + n2.x * w,
      n0.y * u + n1.y * v + n2.y * w,
      n0.z * u + n1.z * v + n2.z * w
    ).normalize();

    results.push({ pos, normal });
  }

  return results;
}

function buildMorphingParticles(): MorphParticleData[] {
  let seed = 4219;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // 1. Sample 13,500 points across Chrome WENEW letters
  const wordExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.24,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.028,
    bevelSegments: 4,
    curveSegments: 10,
    steps: 3,
  };
  const samplesPerLetter = [3000, 2400, 2700, 2400, 3000];
  const wenewSamples: { pos: THREE.Vector3; normal: THREE.Vector3; centerX: number }[] = [];

  createLetterShapes().forEach((item, idx) => {
    const geo = new THREE.ExtrudeGeometry(item.shape, wordExtrudeSettings);
    geo.translate(item.centerX, 0, -0.12);
    geo.computeVertexNormals();

    const samples = sampleUniformSurfacePoints(geo, samplesPerLetter[idx] ?? 2400, rand);
    geo.dispose();

    for (const s of samples) {
      wenewSamples.push({
        pos: s.pos,
        normal: s.normal,
        centerX: item.centerX,
      });
    }
  });

  // 2. Sample 13,500 points across White WENEW Logo
  const logoExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.036,
    bevelSize: 0.024,
    bevelSegments: 4,
    curveSegments: 14,
    steps: 2,
  };
  const logoSamples: { pos: THREE.Vector3; normal: THREE.Vector3 }[] = [];

  createLogoShapes().forEach((part) => {
    const geo = new THREE.ExtrudeGeometry(part.shape, logoExtrudeSettings);
    geo.translate(0, 0, -0.11);
    geo.computeVertexNormals();

    const samples = sampleUniformSurfacePoints(geo, part.weight, rand);
    geo.dispose();

    for (const s of samples) {
      logoSamples.push(s);
    }
  });

  // Shuffle logo sample indices cleanly so dispersed WENEW particles fly from all angles to build every logo detail
  for (let i = logoSamples.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = logoSamples[i];
    logoSamples[i] = logoSamples[j];
    logoSamples[j] = tmp;
  }

  // 3. Pair every particle 1:1 -> WENEW -> Popped Dispersion Cloud -> Assembled 3D Logo
  const particles: MorphParticleData[] = [];
  const totalCount = Math.min(wenewSamples.length, logoSamples.length);

  for (let i = 0; i < totalCount; i++) {
    const w = wenewSamples[i];
    const l = logoSamples[i];

    // Pre-scale logo coordinates slightly taller/bolder to stand proud behind Beat 4
    const logoPos = l.pos.clone().multiplyScalar(1.32);
    const logoNormal = l.normal.clone();

    const chromeHorizon =
      0.5 +
      w.normal.y * 0.28 +
      Math.abs(w.normal.z) * 0.22 +
      Math.sin(w.pos.y * 5.2 + w.pos.x * 0.6) * 0.14;
    const chromeShade = Math.max(0.05, Math.min(1.0, chromeHorizon));

    const logoHorizon =
      0.55 +
      logoNormal.y * 0.24 +
      Math.abs(logoNormal.z) * 0.22 +
      Math.sin(logoPos.y * 3.8 + logoPos.x * 0.7) * 0.1;
    const logoShade = Math.max(0.14, Math.min(1.0, logoHorizon));

    const wenewQuat = new THREE.Quaternion().setFromUnitVectors(_up, w.normal);
    wenewQuat.multiply(
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler((rand() - 0.5) * 0.45, rand() * Math.PI * 2, (rand() - 0.5) * 0.45)
      )
    );

    const logoQuat = new THREE.Quaternion().setFromUnitVectors(_up, logoNormal);
    logoQuat.multiply(
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler((rand() - 0.5) * 0.35, rand() * Math.PI * 2, (rand() - 0.5) * 0.35)
      )
    );

    const expRadius = 2.4 + rand() * 4.4;
    const expTheta = rand() * Math.PI * 2;
    const expPhi = Math.acos(2 * rand() - 1);
    const popDir = new THREE.Vector3(
      Math.sin(expPhi) * Math.cos(expTheta) * 1.18,
      Math.cos(expPhi) * 0.88,
      Math.sin(expPhi) * Math.sin(expTheta) * 0.82 + (rand() - 0.35) * 0.35
    ).normalize();

    const popPos = new THREE.Vector3(
      w.pos.x * 1.15 + popDir.x * expRadius,
      w.pos.y + popDir.y * expRadius,
      popDir.z * expRadius
    );

    const swirlOffset = new THREE.Vector3(
      (rand() - 0.5) * 1.4,
      (rand() - 0.5) * 1.1,
      (rand() - 0.5) * 1.4
    );

    particles.push({
      wenewPos: w.pos,
      wenewNormal: w.normal,
      popPos,
      popDir,
      popRot: new THREE.Euler(rand() * 6, rand() * 6, rand() * 6),
      logoPos,
      logoNormal,
      wenewQuat,
      logoQuat,
      baseScale: 0.72 + rand() * 0.4,
      letterCenterX: w.centerX,
      chromeShade,
      logoShade,
      gatherDelay: rand(),
      swirlOffset,
      phase: rand() * Math.PI * 2,
    });
  }

  return particles;
}

export default function ParticleBrainCanvas({
  scrollProgressRef,
  activeSectionVisible,
  logoPulseRef,
}: ParticleBrainCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(activeSectionVisible);

  useEffect(() => {
    visibleRef.current = activeSectionVisible;
  }, [activeSectionVisible]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareWebGL();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.0, 5.15);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTex = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTex;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 1.6);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(2.5, 5.5, 5.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 2.0);
    fillLight.position.set(-4.5, 1.2, 4.0);
    scene.add(fillLight);

    const rimGreenLight = new THREE.DirectionalLight(0x44d62c, 1.05);
    rimGreenLight.position.set(-4.0, -3.0, -3.0);
    scene.add(rimGreenLight);

    const chromeSpecSpot = new THREE.PointLight(0xffffff, 3.4, 12);
    chromeSpecSpot.position.set(0, 0.8, 3.2);
    scene.add(chromeSpecSpot);

    const morphGroup = new THREE.Group();
    scene.add(morphGroup);

    const cursorGreenLight = new THREE.PointLight(0x44d62c, 0, 2.8, 1.8);
    cursorGreenLight.position.set(0, 0, 0.9);
    morphGroup.add(cursorGreenLight);

    const triGeo = createTriangleGeometry();
    const morphMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.92,
      emissive: 0x343a44,
      emissiveIntensity: 0.0,
      envMapIntensity: 2.0,
    });

    const particles = buildMorphingParticles();
    const mesh = new THREE.InstancedMesh(triGeo, morphMat, particles.length);
    mesh.frustumCulled = false;

    const disp = new Float32Array(particles.length * 3);
    const vel = new Float32Array(particles.length * 3);

    for (let i = 0; i < particles.length; i++) {
      const shade = particles[i].chromeShade;
      if (shade < 0.38) {
        _color.copy(_chromeDark).lerp(_chromeMid, shade / 0.38);
      } else if (shade < 0.72) {
        _color.copy(_chromeMid).lerp(_chromeSilver, (shade - 0.38) / 0.34);
      } else {
        _color.copy(_chromeSilver).lerp(_chromeHighlight, (shade - 0.72) / 0.28);
      }
      mesh.setColorAt(i, _color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    morphGroup.add(mesh);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const pointerNdc = new THREE.Vector2(99, 99);
    const smoothPointerNdc = new THREE.Vector2(99, 99);
    let pointerActive = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointerActive = true;
    };

    const handlePointerLeave = () => {
      pointerActive = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let frameId = 0;
    let isDisposed = false;
    let smoothScroll = scrollProgressRef.current;
    let lastHandledPulseStamp = logoPulseRef?.current ?? 0;
    let pulseStartElapsed = -10;
    const clock = new THREE.Clock();

    const updateScene = (delta: number, elapsed: number) => {
      if (logoPulseRef && logoPulseRef.current > lastHandledPulseStamp) {
        lastHandledPulseStamp = logoPulseRef.current;
        pulseStartElapsed = elapsed;
      }

      const pulseAge = elapsed - pulseStartElapsed;
      const pulseWaveActive = !prefersReducedMotion && pulseAge >= 0 && pulseAge < 1.1;
      const pulseRadius = pulseAge * 4.6;

      const targetScroll = scrollProgressRef.current;
      smoothScroll = prefersReducedMotion
        ? targetScroll
        : THREE.MathUtils.damp(smoothScroll, targetScroll, 4.8, delta);

      const curW = container.clientWidth || window.innerWidth;
      const curH = container.clientHeight || window.innerHeight;
      const aspect = curW / Math.max(1, curH);
      const isMobile = curW < 1024;

      // Continuous 4-Beat Particle Morph Phases:
      // 1) Beat 1 -> 2 (0.10..0.28): WENEW descends cleanly & widens letter distance across screen
      // 2) Beat 2 -> 3 (0.30..0.58): WENEW completes take-apart dispersion to the end & POPS outward
      // 3) Beat 3 -> 4 (0.60..0.89): All popped particles pull closer back together & form the radiant white WENEW Logo
      const spreadProgress = THREE.MathUtils.smoothstep(smoothScroll, 0.10, 0.28);
      const popProgress = THREE.MathUtils.smoothstep(smoothScroll, 0.30, 0.58);
      const gatherProgress = THREE.MathUtils.smoothstep(smoothScroll, 0.60, 0.89);

      // Peak burst energy right during the Beat 2 -> Beat 3 pop
      const popSurge = Math.sin(Math.PI * popProgress) * (1 - gatherProgress);

      // Transition surface material smoothly from glossy dark metallic chrome (WENEW) -> radiant white (Logo)
      morphMat.metalness = THREE.MathUtils.lerp(0.92, 0.32, gatherProgress);
      morphMat.roughness = THREE.MathUtils.lerp(0.08, 0.18, gatherProgress);
      morphMat.emissiveIntensity = 0.42 * gatherProgress + 0.16 * popSurge;
      morphMat.envMapIntensity = THREE.MathUtils.lerp(2.1, 1.5, gatherProgress);

      const mobileScale = Math.min(0.62, Math.max(0.36, aspect * 0.72));
      const desktopScale = Math.min(0.84, Math.max(0.62, aspect * 0.52));
      const baseScale = isMobile ? mobileScale : desktopScale;

      if (!prefersReducedMotion) {
        chromeSpecSpot.position.x = Math.sin(elapsed * 0.75) * 2.4;
      }

      if (pointerActive) {
        smoothPointerNdc.x = THREE.MathUtils.damp(smoothPointerNdc.x, pointerNdc.x, 36, delta);
        smoothPointerNdc.y = THREE.MathUtils.damp(smoothPointerNdc.y, pointerNdc.y, 36, delta);
      } else {
        smoothPointerNdc.x = THREE.MathUtils.damp(smoothPointerNdc.x, 99, 10, delta);
        smoothPointerNdc.y = THREE.MathUtils.damp(smoothPointerNdc.y, 99, 10, delta);
      }

      const hoverActive =
        pointerActive &&
        Math.abs(smoothPointerNdc.x) <= 1.05 &&
        Math.abs(smoothPointerNdc.y) <= 1.05;

      // Fast, responsive repel + green hover aura + spring return physics
      const repelRadius = 0.42;
      const greenGlowRadius = 0.68;
      const greenGlowRadiusSq = greenGlowRadius * greenGlowRadius;
      const repelStrength = 11.2;
      const springStiffness = 34.0;
      const dampFactor = Math.exp(-8.2 * delta);

      const halfViewH = Math.tan(THREE.MathUtils.degToRad(20)) * camera.position.z;
      const halfViewW = halfViewH * aspect;

      const restingY = isMobile ? 0.42 : 0.38;
      const loweredY = isMobile ? 0.38 : 0.34;
      const popCenterY = 0.04;
      const logoUpperY = isMobile ? 0.56 : 0.50;
      let groupY = THREE.MathUtils.lerp(restingY, loweredY, spreadProgress);
      groupY = THREE.MathUtils.lerp(groupY, popCenterY, popProgress * 0.75);
      groupY = THREE.MathUtils.lerp(groupY, logoUpperY, gatherProgress);

      const spreadScale = baseScale;
      const burstScale = baseScale * (1.08 + 0.08 * popSurge);
      const logoFinalScale = baseScale * (isMobile ? 0.94 : 0.96);
      let groupScale = THREE.MathUtils.lerp(spreadScale, burstScale, popProgress);
      groupScale = THREE.MathUtils.lerp(groupScale, logoFinalScale, gatherProgress);

      morphGroup.position.set(0, groupY, 0);
      morphGroup.scale.setScalar(groupScale);

      // Compute WENEW letter distance to fit screen width cleanly
      const targetHalfSpanLocal = Math.min(3.15, (halfViewW * 0.87) / Math.max(0.25, groupScale));
      const maxSpreadFactor = Math.max(0.22, (targetHalfSpanLocal - 1.99) / 1.56);
      const activeSpread = maxSpreadFactor * spreadProgress * (1 - popProgress) * (1 - gatherProgress);

      const idleYaw = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.45) * 0.075;
      const spreadYaw = 0.06 * spreadProgress * (1 - popProgress) * (1 - gatherProgress);
      morphGroup.rotation.y = spreadYaw + idleYaw;
      morphGroup.rotation.x =
        THREE.MathUtils.lerp(0.04, 0.0, gatherProgress) +
        (prefersReducedMotion ? 0 : Math.cos(elapsed * 0.36) * 0.032);
      morphGroup.rotation.z = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.28) * 0.016;

      _mouseWorld.set(smoothPointerNdc.x, smoothPointerNdc.y, 0.5).unproject(camera);
      _vec3.copy(_mouseWorld).sub(camera.position).normalize();
      const distToPlane = -camera.position.z / _vec3.z;
      _mouseWorld.copy(camera.position).addScaledVector(_vec3, distToPlane);
      morphGroup.updateMatrixWorld();
      morphGroup.worldToLocal(_mouseWorld);

      if (hoverActive && !prefersReducedMotion) {
        cursorGreenLight.position.set(_mouseWorld.x, _mouseWorld.y, 0.85);
        cursorGreenLight.intensity = THREE.MathUtils.damp(cursorGreenLight.intensity, 4.2, 16, delta);
      } else {
        cursorGreenLight.intensity = THREE.MathUtils.damp(cursorGreenLight.intensity, 0, 10, delta);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const i3 = i * 3;
        const breath = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.48 + p.phase) * 0.006;

        // Per-particle staggered smooth gather when flying back together to form the logo
        const rawLocalGather = Math.max(
          0,
          Math.min(1, (gatherProgress - p.gatherDelay * 0.22) / 0.78)
        );
        const easedGather = rawLocalGather * rawLocalGather * (3 - 2 * rawLocalGather);

        // Stage A -> B: WENEW widened -> Popped out 3D cloud
        _vec3.copy(p.wenewPos);
        _vec3.x += p.letterCenterX * activeSpread;
        _explodedPos.lerpVectors(_vec3, p.popPos, popProgress);

        // Radial POP surge that flares particles outward cleanly as WENEW breaks apart
        if (popSurge > 0.001) {
          _explodedPos.addScaledVector(p.popDir, popSurge * 0.95);
        }

        // Stage B -> C: All exploded particles stream inward and snap into the 3D Logo shape
        _restPos.lerpVectors(_explodedPos, p.logoPos, easedGather);

        // Organic orbital swirl mid-flight so coalescing feels fluid and intentional
        if (easedGather > 0.001 && easedGather < 0.999) {
          const arc = Math.sin(Math.PI * easedGather);
          _restPos.addScaledVector(p.swirlOffset, arc);
        }

        // Subtle surface breathing along active normal
        _restPos.addScaledVector(p.wenewNormal, breath * (1 - easedGather));
        _restPos.addScaledVector(p.logoNormal, breath * easedGather);

        let vx = vel[i3];
        let vy = vel[i3 + 1];
        let vz = vel[i3 + 2];
        let dx = disp[i3];
        let dy = disp[i3 + 1];
        let dz = disp[i3 + 2];

        let waveCrest = 0;
        let hoverGlow = 0;
        if (!prefersReducedMotion) {
          if (hoverActive) {
            const rx = _restPos.x + dx - _mouseWorld.x;
            const ry = _restPos.y + dy - _mouseWorld.y;
            const rz = _restPos.z + dz - _mouseWorld.z;
            const distSq = rx * rx + ry * ry + rz * rz;
            if (distSq < greenGlowRadiusSq) {
              const dist = Math.sqrt(distSq) || 0.001;
              const glowFalloff = 1 - dist / greenGlowRadius;
              hoverGlow = Math.pow(glowFalloff, 1.35);

              if (dist < repelRadius) {
                const falloff = 1 - dist / repelRadius;
                const push = falloff * falloff * repelStrength * delta;
                vx += (rx / dist) * push + p.wenewNormal.x * push * 0.35;
                vy += (ry / dist) * push + p.wenewNormal.y * push * 0.35;
                vz += (rz / dist) * push * 0.4 + p.wenewNormal.z * push * 0.55;
              }
            }
          }

          if (pulseWaveActive) {
            const ox = _restPos.x;
            const oy = _restPos.y - 0.52 * (1 - gatherProgress);
            const radialDist = Math.sqrt(ox * ox + oy * oy);
            const band = Math.abs(radialDist - pulseRadius);
            if (band < 0.36) {
              waveCrest = (1 - band / 0.36) * Math.max(0, 1 - pulseAge / 1.1);
              const invR = radialDist > 0.001 ? 1 / radialDist : 0;
              const pulseForce = waveCrest * 3.8 * delta;
              vx += ox * invR * pulseForce;
              vy += oy * invR * pulseForce;
              vz += (p.wenewNormal.z * 0.5 + 0.85) * pulseForce;
            }
          }

          vx += -springStiffness * dx * delta;
          vy += -springStiffness * dy * delta;
          vz += -springStiffness * dz * delta;

          vx *= dampFactor;
          vy *= dampFactor;
          vz *= dampFactor;

          dx += vx * delta;
          dy += vy * delta;
          dz += vz * delta;

          disp[i3] = dx;
          disp[i3 + 1] = dy;
          disp[i3 + 2] = dz;
          vel[i3] = vx;
          vel[i3 + 1] = vy;
          vel[i3 + 2] = vz;
        }

        _targetPos.set(_restPos.x + dx, _restPos.y + dy, _restPos.z + dz);
        const driftMag = Math.min(1, Math.sqrt(dx * dx + dy * dy + dz * dz) * 3.2);

        _quat.copy(p.wenewQuat).slerp(p.logoQuat, easedGather);
        const tumbleAmount = popProgress * (1 - easedGather);
        if (tumbleAmount > 0.001) {
          _euler.set(
            p.popRot.x * tumbleAmount + (prefersReducedMotion ? 0 : elapsed * 0.25 * tumbleAmount),
            p.popRot.y * tumbleAmount,
            p.popRot.z * tumbleAmount
          );
          _deltaQuat.setFromEuler(_euler);
          _quat.multiply(_deltaQuat);
        }
        if (driftMag > 0.01) {
          _euler.set(driftMag * 0.55, driftMag * 0.85, 0);
          _deltaQuat.setFromEuler(_euler);
          _quat.multiply(_deltaQuat);
        }

        const scaleMult =
          p.baseScale *
          (1 + driftMag * 0.32 + popSurge * 0.42) *
          THREE.MathUtils.lerp(1.0, 0.94, tumbleAmount) *
          THREE.MathUtils.lerp(1.0, 0.96, easedGather);
        _scaleVec.setScalar(scaleMult);

        _mat4.compose(_targetPos, _quat, _scaleVec);
        mesh.setMatrixAt(i, _mat4);

        const sweep = prefersReducedMotion
          ? 0.5
          : 0.5 + 0.5 * Math.cos(_restPos.x * 1.2 - elapsed * 1.2 + _restPos.y * 1.5);

        const chromeIntensity = Math.min(
          1,
          Math.max(0.06, p.chromeShade * 0.72 + sweep * 0.34 + driftMag * 0.28 + popSurge * 0.35)
        );
        if (chromeIntensity < 0.38) {
          _colorChrome.copy(_chromeDark).lerp(_chromeMid, chromeIntensity / 0.38);
        } else if (chromeIntensity < 0.72) {
          _colorChrome.copy(_chromeMid).lerp(_chromeSilver, (chromeIntensity - 0.38) / 0.34);
        } else {
          _colorChrome.copy(_chromeSilver).lerp(_chromeHighlight, (chromeIntensity - 0.72) / 0.28);
        }

        const logoIntensity = Math.min(
          1,
          Math.max(0.16, p.logoShade * 0.72 + sweep * 0.3 + driftMag * 0.25)
        );
        if (logoIntensity < 0.45) {
          _colorLogo.copy(_logoWhiteShadow).lerp(_logoWhiteMid, logoIntensity / 0.45);
        } else {
          _colorLogo.copy(_logoWhiteMid).lerp(_logoWhitePure, (logoIntensity - 0.45) / 0.55);
        }

        _color.copy(_colorChrome).lerp(_colorLogo, easedGather);

        const greenHoverMix = Math.min(1, Math.max(hoverGlow * 0.95, driftMag * 0.85));
        if (greenHoverMix > 0.01) {
          _color.lerp(_chromePulseGreen, Math.min(0.92, greenHoverMix));
          if (hoverGlow > 0.45) {
            _color.lerp(_hoverGreenBright, (hoverGlow - 0.45) * 0.7);
          }
        }

        if (waveCrest > 0.01) {
          _color.lerp(_chromePulseGreen, Math.min(0.78, waveCrest * 0.8));
        }
        mesh.setColorAt(i, _color);
      }

      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (isDisposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (visibleRef.current) {
        updateScene(delta, elapsed);
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    updateScene(0.016, 0);
    renderer.render(scene, camera);

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      triGeo.dispose();
      morphMat.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollProgressRef, logoPulseRef]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
