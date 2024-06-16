import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import getStarfield from './utils/stars';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const fov = 75;
const aspect = width / height;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
  map: loader.load('/textures/00_earthmap1k.jpg'),
});

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);
scene.add(earthGroup);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const sunlight = new THREE.DirectionalLight(0xffffff);
sunlight.position.set(-2, -0.5, 1.5);
scene.add(sunlight);

function animate(t = 0) {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.002;
  renderer.render(scene, camera);
  controls.update();
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
