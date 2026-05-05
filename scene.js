// Three.js 3D background — Arc-themed: navy → purple → magenta orbs with peach accents
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  // ── Arc brand palette ──────────────────────────────────
  const ARC_NAVY    = new THREE.Color(0x1B3158);
  const ARC_PURPLE  = new THREE.Color(0x3E2B63);
  const ARC_MAGENTA = new THREE.Color(0x942753);
  const ARC_PEACH   = new THREE.Color(0xF3966F);
  const ARC_CREAM   = new THREE.Color(0xF3CA94);

  // ── Particle field — interpolates across Arc gradient ──
  const PARTICLE_COUNT = 700;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;

    // Mix between two random Arc-palette colors for variety
    const palette = [ARC_NAVY, ARC_PURPLE, ARC_MAGENTA, ARC_PEACH, ARC_CREAM];
    const c1 = palette[Math.floor(Math.random() * palette.length)];
    const c2 = palette[Math.floor(Math.random() * palette.length)];
    const t = Math.random();
    colors[i * 3 + 0] = c1.r * t + c2.r * (1 - t);
    colors[i * 3 + 1] = c1.g * t + c2.g * (1 - t);
    colors[i * 3 + 2] = c1.b * t + c2.b * (1 - t);
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.022,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Main orb (deep navy, matte) ────────────────────────
  const orbGeo = new THREE.SphereGeometry(1.7, 64, 64);
  const orbMat = new THREE.MeshStandardMaterial({
    color: 0x1B3158,
    roughness: 0.65,
    metalness: 0.35,
    transparent: true,
    opacity: 0.42,
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  orb.position.set(3.6, -0.5, -2.2);
  scene.add(orb);

  // Wireframe overlay — magenta tinted
  const wireGeo = new THREE.SphereGeometry(1.72, 18, 18);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x942753,
    wireframe: true,
    transparent: true,
    opacity: 0.10,
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  wire.position.copy(orb.position);
  scene.add(wire);

  // ── Second orb (purple, smaller) ───────────────────────
  const orb2Geo = new THREE.SphereGeometry(0.72, 40, 40);
  const orb2Mat = new THREE.MeshStandardMaterial({
    color: 0x3E2B63,
    roughness: 0.7,
    metalness: 0.3,
    transparent: true,
    opacity: 0.55,
  });
  const orb2 = new THREE.Mesh(orb2Geo, orb2Mat);
  orb2.position.set(-4.2, 1.6, -3);
  scene.add(orb2);

  const wire2Geo = new THREE.SphereGeometry(0.74, 12, 12);
  const wire2Mat = new THREE.MeshBasicMaterial({
    color: 0xF3966F,
    wireframe: true,
    transparent: true,
    opacity: 0.10,
  });
  const wire2 = new THREE.Mesh(wire2Geo, wire2Mat);
  wire2.position.copy(orb2.position);
  scene.add(wire2);

  // ── Ambient ring — peach accent ────────────────────────
  const ringGeo = new THREE.TorusGeometry(3.0, 0.005, 2, 128);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xF3966F,
    transparent: true,
    opacity: 0.14,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(0, 0, -4);
  ring.rotation.x = Math.PI * 0.18;
  scene.add(ring);

  // Second ring (navy, larger)
  const ring2Geo = new THREE.TorusGeometry(4.5, 0.003, 2, 128);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0x1B3158,
    transparent: true,
    opacity: 0.22,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.position.set(0, 0, -5);
  ring2.rotation.x = -Math.PI * 0.1;
  scene.add(ring2);

  // ── Lighting ───────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.18);
  scene.add(ambientLight);

  // Magenta key light — orbits and gives the magenta glow
  const magentaLight = new THREE.PointLight(0x942753, 3.0, 14);
  magentaLight.position.set(2, 2, 2);
  scene.add(magentaLight);

  // Peach fill light — warmth on the right side
  const peachLight = new THREE.PointLight(0xF3966F, 1.5, 10);
  peachLight.position.set(4, -1, 1);
  scene.add(peachLight);

  // Navy rim light — depth
  const navyLight = new THREE.PointLight(0x1B3158, 1.2, 12);
  navyLight.position.set(-3, -2, 1);
  scene.add(navyLight);

  // ── Mouse parallax ─────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ─────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation loop ─────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.03;
    targetY += (mouseY - targetY) * 0.03;

    // Particles drift
    particles.rotation.y = t * 0.018;
    particles.rotation.x = t * 0.006;

    // Orbs float
    orb.position.y = -0.5 + Math.sin(t * 0.4) * 0.2;
    orb.rotation.y = t * 0.08;
    wire.position.y = orb.position.y;
    wire.rotation.y = -t * 0.06;

    orb2.position.y = 1.6 + Math.sin(t * 0.3 + 1) * 0.14;
    orb2.rotation.x = t * 0.05;
    wire2.position.y = orb2.position.y;
    wire2.rotation.z = t * 0.04;

    // Ring pulse + rotation
    ringMat.opacity = 0.10 + Math.sin(t * 0.5) * 0.04;
    ring.rotation.z = t * 0.03;
    ring2.rotation.z = -t * 0.02;
    ring2Mat.opacity = 0.18 + Math.sin(t * 0.4 + 2) * 0.06;

    // Camera parallax
    camera.position.x = targetX * 0.35;
    camera.position.y = targetY * 0.22;
    camera.lookAt(0, 0, 0);

    // Magenta light orbit
    magentaLight.position.x = Math.cos(t * 0.3) * 3;
    magentaLight.position.z = Math.sin(t * 0.3) * 3 + 1;

    // Peach light slow sway
    peachLight.position.y = -1 + Math.sin(t * 0.25) * 0.8;

    renderer.render(scene, camera);
  }

  animate();
})();
