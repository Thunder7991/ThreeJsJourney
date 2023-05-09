import * as dat from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
	width: 400,
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// GLTF loader
const gltfLoader = new GLTFLoader();

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg');
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;
/**
 * Materials
 */

const bakedMaterial = new THREE.MeshBasicMaterial({
	map: bakedTexture,
});

const poleLightMaterial = new THREE.MeshBasicMaterial({
	color: 0xfffbe2,
});

const portalLightMaterial = new THREE.MeshBasicMaterial({
	color: 0xfffdc3,
	side: THREE.DoubleSide,
});

/**
 * Model
 */

gltfLoader.load('portal.glb', (gltf) => {
	const bakedMesh = gltf.scene.children.find(
		(child) => child.name === 'Baked'
	);

	const poleLight1 = gltf.scene.children.find(
		(child) => child.name === 'Light001'
	);

	const poleLight2 = gltf.scene.children.find(
		(child) => child.name === 'Light002'
	);
	const portalLight = gltf.scene.children.find(
		(child) => child.name === 'PortalLight'
	);

	bakedMesh.material = bakedMaterial;
	poleLight1.material = poleLightMaterial;
	poleLight2.material = poleLightMaterial;
	portalLight.material = portalLightMaterial;
	scene.add(gltf.scene);
});

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();