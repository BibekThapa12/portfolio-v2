// Interactive 3D background: a field of dots rolling like a wave. The camera follows the pointer,
// the dots swell where the pointer touches the field, and the wave drifts and fades as the page scrolls.
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uSize;
  uniform float uDpr;
  varying float vLift;
  varying float vDepth;

  void main() {
    vec3 p = position;
    float t = uTime * 0.35 + uScroll * 1.2;
    float wave = sin(p.x * 0.28 + t) * 0.45 + cos(p.z * 0.22 + t * 0.8) * 0.45;
    float d = distance(p.xz, uPointer);
    float lift = exp(-d * d * 0.05) * uPointerStrength; // a wider pool, to match the cursor spotlight
    p.y += wave + lift * 0.9;
    vLift = lift;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mvPosition.z;
    gl_PointSize = uSize * uDpr * (12.0 / vDepth);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying float vLift;
  varying float vDepth;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float fade = 1.0 - smoothstep(8.0, 42.0, vDepth);
    float alpha = uOpacity * fade * (1.0 - smoothstep(0.2, 0.5, r)) * (1.0 + vLift * 2.2);
    gl_FragColor = vec4(mix(uColor, uAccent, clamp(vLift, 0.0, 1.0)), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function startBackground(canvas: HTMLCanvasElement) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch {
    return; // no WebGL: the page works without the background
  }
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const dark = matchMedia('(prefers-color-scheme: dark)');
  const small = innerWidth < 700;
  const dpr = Math.min(devicePixelRatio, 1.75);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  const lookAt = new THREE.Vector3(0, 0, -6);

  // The field: a grid of points on the ground plane
  const cols = small ? 70 : 140;
  const rows = small ? 50 : 80;
  const spacing = 0.42;
  const positions = new Float32Array(cols * rows * 3);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const k = (i * rows + j) * 3;
      positions[k] = (i - cols / 2) * spacing;
      positions[k + 2] = (j - rows / 2) * spacing - 6;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const uniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uPointer: { value: new THREE.Vector2(999, 999) },
    uPointerStrength: { value: 0 },
    uSize: { value: small ? 2.2 : 2.6 },
    uDpr: { value: dpr },
    uColor: { value: new THREE.Color() },
    uAccent: { value: new THREE.Color() },
    uOpacity: { value: 0.5 },
  };
  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false });
  scene.add(new THREE.Points(geometry, material));

  // Colours come from the page's own tokens so light and dark mode both match
  const applyTheme = () => {
    const css = getComputedStyle(document.documentElement);
    uniforms.uColor.value.set(css.getPropertyValue('--fg').trim());
    uniforms.uAccent.value.set(css.getPropertyValue('--accent').trim());
    uniforms.uOpacity.value = dark.matches ? 0.42 : 0.32;
  };
  applyTheme();

  // A window can report zero size while it loads or is hidden; never divide by it.
  const vw = () => Math.max(innerWidth, 1);
  const vh = () => Math.max(innerHeight, 1);
  const resize = () => {
    renderer.setSize(vw(), vh(), false);
    camera.aspect = vw() / vh();
    camera.updateProjectionMatrix();
  };
  resize();

  // Pointer: tilt the camera towards it and find where it touches the field
  const ndc = new THREE.Vector2(0, 0);
  const target = new THREE.Vector2(999, 999);
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const raycaster = new THREE.Raycaster();
  const hit = new THREE.Vector3();
  let pointerActive = false;
  const onPointer = (e: PointerEvent) => {
    ndc.set((e.clientX / vw()) * 2 - 1, -(e.clientY / vh()) * 2 + 1);
    pointerActive = e.pointerType === 'mouse';
  };
  addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('pointerleave', () => (pointerActive = false));

  const timer = new THREE.Timer();
  timer.connect(document);
  const camPos = new THREE.Vector3(0, 5.5, 12);
  camera.position.copy(camPos); // start in place, so the single still frame is framed correctly

  const frame = () => {
    timer.update();
    const scroll = scrollY / vh();
    uniforms.uTime.value = timer.getElapsed();
    uniforms.uScroll.value = scroll;
    // fade the field after the first screen so long sections of text stay calm
    const opacity = Math.max(0.35, 1 - scroll * 0.5).toFixed(2);
    if (canvas.style.opacity !== opacity) canvas.style.opacity = opacity;

    camPos.set(ndc.x * 1.6, 5.5 + ndc.y * 0.8 - Math.min(scroll, 2) * 0.8, 12);
    camera.position.lerp(camPos, 0.05);
    camera.lookAt(lookAt);

    raycaster.setFromCamera(ndc, camera);
    if (pointerActive && raycaster.ray.intersectPlane(ground, hit)) target.set(hit.x, hit.z);
    uniforms.uPointer.value.lerp(target, 0.12);
    uniforms.uPointerStrength.value += ((pointerActive ? 1 : 0) - uniforms.uPointerStrength.value) * 0.06;

    renderer.render(scene, camera);
  };

  const play = () => renderer.setAnimationLoop(still.matches || document.hidden ? null : frame);
  addEventListener('resize', () => { resize(); if (still.matches) frame(); });
  document.addEventListener('visibilitychange', play);
  still.addEventListener('change', () => { play(); frame(); });
  dark.addEventListener('change', () => { applyTheme(); frame(); });

  frame(); // one still frame always, so reduced-motion visitors see the field without movement
  play();
}
