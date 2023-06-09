import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// AxesHelper
const axesHelper = new THREE.AxesHelper(5);
// axesHelper.visible = false;
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */
// Group
const house = new THREE.Group();
scene.add(house);

// Wall
const WALL_HEIGHT = 2.5;
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, WALL_HEIGHT, 4),
    new THREE.MeshStandardMaterial({ color: 0xac8e82 })
);
walls.position.y = WALL_HEIGHT / 2;
house.add(walls);

// Roof
const ROOF_HEIGHT = 1;
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, ROOF_HEIGHT, 4),
    new THREE.MeshStandardMaterial({ color: 0xb35f45 })
);
roof.position.y = WALL_HEIGHT + ROOF_HEIGHT / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const DOOR_HEIGHT = 2;
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, DOOR_HEIGHT),
    new THREE.MeshStandardMaterial({ color: 0xaa7b7b })
);
door.position.z = 2 + 0.01;
door.position.y = DOOR_HEIGHT / 2;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(1.5, 0.2, 2.5);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.3, 0.3, 0.3);
bush2.position.set(3, 0.2, 2);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.2, 0.2, 0.2);
bush3.position.set(2.1, 0.2, 2.5);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.7, 0.7, 0.7);
bush4.position.set(-1.5, 0.2, 2.5);

house.add(bush1, bush2, bush3, bush4);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()