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


/**
 * Galaxy
 */
const parameters = {
    count: 50000,
    size: 0.02,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 2,
    innerColor: 0xff6030,
    outerColor: 0x1b3984
}

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
    
    // Destroy old galaxy
    if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    // Geometry
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const innerColor = new THREE.Color(parameters.innerColor);
    const outerColor = new THREE.Color(parameters.outerColor);

    for (let i = 0; i < parameters.count; i++) {
        
        // Position
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
        
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? -1 : 1);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? -1 : 1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? -1 : 1);

        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = 0 + randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        colors[i3 + 0] = 1
        colors[i3 + 1] = 0
        colors[i3 + 2] = 0
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    // Points
    points = new THREE.Points(geometry, material);
    scene.add(points);
}

// Debug UI
gui.add(parameters, 'count', 100, 100000, 100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size', 0.001, 0.1, 0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius', 0.1, 20, 0.1).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches', 2, 20, 1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin', -5, 5, 0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness', 0, 2, 0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower', 1, 4, 0.1).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'innerColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outerColor').onFinishChange(generateGalaxy);

generateGalaxy();


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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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