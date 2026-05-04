// Three.js 3D background — floating orbs and particle field
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

  // ── Particle field ──────────────────────────────────────
  const PARTICLE_COUNT = 600;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  const goldR = 201 / 255, goldG = 168 / 255, goldB = 76 / 255;
  const creamR = 240 / 255, creamG = 232 / 255, creamB = 216 / 255;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;

    const t = Math.random();
    colors[i * 3 + 0] = goldR * t + creamR * (1 - t);
    colors[i * 3 + 1] = goldG * t + creamG * (1 - t);
    colors[i * 3 + 2] = goldB * t + creamB * (1 - t);
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Main orb ────────────────────────────────────────────
  const orbGeo = new THREE.SphereGeometry(1.6, 64, 64);
  const orbMat = new THREE.MeshStandardMaterial({
    color: 0x1a1510,
    roughness: 0.6,
    metalness: 0.4,
    transparent: true,
    opacity: 0.45,
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  orb.position.set(3.5, -0.5, -2);
  scene.add(orb);

  // Wireframe overlay on orb
  const wireGeo = new THREE.SphereGeometry(1.62, 18, 18);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xC9A84C,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  wire.position.copy(orb.position);
  scene.add(wire);

  // Second smaller orb
  const orb2Geo = new THREE.SphereGeometry(0.7, 40, 40);
  const orb2Mat = new THREE.MeshStandardMaterial({
    color: 0x120f0a,
    roughness: 0.7,
    metalness: 0.3,
    transparent: true,
    opacity: 0.6,
  });
  const orb2 = new THREE.Mesh(orb2Geo, orb2Mat);
  orb2.position.set(-4, 1.5, -3);
  scene.add(orb2);

  const wire2Geo = new THREE.SphereGeometry(0.72, 12, 12);
  const wire2Mat = new THREE.MeshBasicMaterial({
    color: 0xC9A84C,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const wire2 = new THREE.Mesh(wire2Geo, wire2Mat);
  wire2.position.copy(orb2.position);
  scene.add(wire2);

  // ── Ambient ring ────────────────────────────────────────
  const ringGeo = new THREE.TorusGeometry(2.8, 0.004, 2, 128);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xC9A84C,
    transparent: true,
    opacity: 0.12,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(0, 0, -4);
  ring.rotation.x = Math.PI * 0.15;
  scene.add(ring);

  // ── Lighting ────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
  scene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xC9A84C, 2.5, 12);
  goldLight.position.set(2, 2, 2);
  scene.add(goldLight);

  const coldLight = new THREE.PointLight(0xffffff, 0.8, 10);
  coldLight.position.set(-3, -2, 1);
  scene.add(coldLight);

  // ── Mouse parallax ──────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ──────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation loop ──────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.03;
    targetY += (mouseY - targetY) * 0.03;

    // Rotate particles slowly
    particles.rotation.y = t * 0.018;
    particles.rotation.x = t * 0.006;

    // Orbs float
    orb.position.y = -0.5 + Math.sin(t * 0.4) * 0.18;
    orb.rotation.y = t * 0.08;
    wire.position.y = orb.position.y;
    wire.rotation.y = -t * 0.06;

    orb2.position.y = 1.5 + Math.sin(t * 0.3 + 1) * 0.12;
    orb2.rotation.x = t * 0.05;
    wire2.position.y = orb2.position.y;

    // Ring pulse opacity
    ringMat.opacity = 0.08 + Math.sin(t * 0.5) * 0.04;
    ring.rotation.z = t * 0.03;

    // Camera parallax
    camera.position.x = targetX * 0.3;
    camera.position.y = targetY * 0.2;
    camera.lookAt(0, 0, 0);

    // Gold light orbit
    goldLight.position.x = Math.cos(t * 0.3) * 3;
    goldLight.position.z = Math.sin(t * 0.3) * 3 + 1;

    renderer.render(scene, camera);
  }

  animate();
})();
