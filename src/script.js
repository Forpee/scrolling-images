import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import gsap from 'gsap'
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
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uTexture: { value: null }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
})
let materials = []
let meshes = []
let groups = []

let images = [...document.querySelectorAll('img')]
images.forEach((image, i) => {
    let mat = material.clone()
    materials.push(mat)
    let group = new THREE.Group()
    mat.uniforms.uTexture.value = new THREE.TextureLoader().load(image.src)
    let geo = new THREE.PlaneBufferGeometry(1.777, 1, 32, 32)
    let mesh = new THREE.Mesh(geo, mat)
    meshes.push(mesh)
    group.add(mesh)
    groups.push(group)
    scene.add(group)
    mesh.position.y = i * 1.2

    group.rotation.y = -0.3
    group.rotation.x = -0.3
    group.rotation.z = -0.2
})



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
// Orthographic camera
// const camera = new THREE.OrthographicCamera(-1/2, 1/2, 1/2, -1/2, 0.1, 100)

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 2)
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xEEEEEE, 1)
/**
 * Animate
 */
const clock = new THREE.Clock()

let speed = 0
let position = 0
let rounded = 0

let block = document.getElementById('block')
let wrap = document.getElementById('wrap')
let elems = [...document.querySelectorAll('.n')]

window.addEventListener('wheel', (event) => {
    speed += event.deltaY * 0.0003
})

let objs = Array(5).fill({ dist: 0 })
const raf = () => {
    position += speed
    speed *= 0.8

    objs.forEach((o, i) => {
        o.dist = Math.min(Math.abs(position - i), 1)
        o.dist = 1 - o.dist ** 2
        elems[i].style.transform = `scale(${1 + 0.4 * o.dist})`
        let scale = 1 + 0.1 * o.dist
        if (meshes.length) {
            meshes[i].position.y = i * 1.2 - position * 1.2

            meshes[i].scale.set(scale, scale, scale)
        }
    })

    rounded = Math.round(position)

    let diff = (rounded - position)
    position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;
    wrap.style.transform = `translateY(${-position * 100 + 50}px)`

    window.requestAnimationFrame(raf)

}
const tick = () => {




    // Update controls
    // controls.update()

    // Get elapsedtime
    const elapsedTime = clock.getElapsedTime()

    // Update uniforms
    if (materials.length) {
        materials.forEach((mat, i) => {
            mat.uniforms.uTime.value = elapsedTime
        })
    }
    // material.uniforms.uTime.value = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
raf()