import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Textures
 */
const image = new Image()
// const texture = new THREE.Texture(image)
// texture.colorSpace = THREE.SRGBColorSpace

// image.onload  = () =>
// {
//     texture.needsUpdate = true
// }
// image.src = 'door.jpg'

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('door.jpg')
texture.colorSpace = THREE.SRGBColorSpace
texture.magFilter = THREE.NearestFilter

/**
 * Debug
 */
const gui = new GUI({
    width: 300,
    title: 'Fucking debug UI',
    closeFolders: true
})
// gui.close()
gui.hide()

window.addEventListener('keydown', () =>
{
    if(event.key == 'h')
        gui.show(gui._hidden)
})

const debugObject = {}

const sphereTweaks = gui.addFolder('Fucking sphere')
// sphereTweaks.close()

// Cursor
const cursor ={
    x:0,
    y:0
}
window.addEventListener('mousemove', (event) => 
{
    cursor.x = event.clientX / sizes.width -0.5
    cursor.y = event.clientY / sizes.height -0.5

}) 

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Group
 */
const group = new THREE.Group()
group.position.set(1.1,1,1)
// scene.add(group)

/**
 * Mesh
 */
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'red' })
)
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.8, 1),
    new THREE.MeshBasicMaterial({ color: 'green' })
)
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'blue' })
)
group.add(cube3)

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'yellow' })
const mesh = new THREE.Mesh(geometry, material)
// mesh.position.x = 1
// mesh.position.y = -0.1
// mesh.position.z = -2

// scene.add(mesh) 

// mesh.position.set(2, -0.6, 0.5)
mesh.scale.set(1,1,1)

// Rotation
// mesh.rotation.reorder('YXZ')
// mesh.rotation.set(0.2,Math.PI,Math.PI*0.25)


// Sphere
debugObject.color = '#ffffff'

const geometry2 = new THREE.SphereGeometry(1, 32, 32)
// const material2 = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
// const material2 = new THREE.MeshBasicMaterial({ map: texture, wireframe: false })
// const material2 = new THREE.MeshNormalMaterial()
// material2.flatShading = true
// const material2 = new THREE.MeshLambertMaterial({ map: texture, wireframe: false })
const material2 = new THREE.MeshStandardMaterial()
material2.metalness = 0.45
material2.roughness = 0.65


const mesh2 = new THREE.Mesh(geometry2, material2)
scene.add(mesh2) 


gui.add(material2, 'metalness').min(0).max(1).step(0.0001)
gui.add(material2, 'roughness').min(0).max(1).step(0.0001)

/**
 * Lights
 */

// const ambientLigh = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLigh)

// const pointLight = new THREE.PointLight(0xffffff, 50)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)


/**
 * Environment map
 */
const rgbeLoader = new RGBELoader()
rgbeLoader.load('textures/environmentMap/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})


// gui.add(mesh2.position, 'x', - 3, 3, 0.01)
sphereTweaks
    .add(mesh2.position, 'y')
    .min(- 3)
    .max(3)
    .step(0.01)
    .name('elevation')
// gui.add(mesh2.position, 'z', - 3, 3, 0.01)
sphereTweaks.add(mesh2, 'visible')
sphereTweaks.add(material2, 'wireframe')
sphereTweaks
    .addColor(debugObject, 'color')
    .onChange(() =>
    {
        material2.color.set(debugObject.color)
    })

// Button function
debugObject.spin = () =>
{
    gsap.to(mesh2.rotation, { duration: 1, y: mesh2.rotation.y + Math.PI * 2 })
}
sphereTweaks.add(debugObject, 'spin')

// Segments gui
debugObject.subdivision = 2
sphereTweaks 
    .add(debugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() =>
    {
        mesh2.geometry.dispose()
        mesh2.geometry = new THREE.SphereGeometry(
            1, 32, 32,
            debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
        )
    })

// Create an empty BufferGeometry
const geometry3 = new THREE.BufferGeometry()

// Create a Float32Array containing the vertices position (3 by 3)
const positionsArray = new Float32Array([
    0, 0, 0, // First vertex
    0, 1, 0, // Second vertex
    1, 0, 0  // Third vertex
])

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry3.setAttribute('position', positionsAttribute)
const material3 = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true })
const mesh3 = new THREE.Mesh(geometry3, material3)
// scene.add(mesh3) 

// Axes helper
const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
    // width: 800,
    // height: 600
}

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 100)
const aspectRatio =  sizes.width / sizes.height 
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRatio, 
//     1 * aspectRatio, 
//     1 * aspectRatio, 
//     -1 * aspectRatio, 0.1, 100
//     )
camera.position.z = 3
scene.add(camera)
camera.lookAt(mesh.position)


// Controls
const controls = new OrbitControls(camera, canvas )
controls.enableDamping = true
// controls.target.y = 1
// controls.update()

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

console.log(mesh.position.distanceTo(camera.position))

// fucking time
let time = Date.now()
// const currentTime = Date.now()
// const deltaTime = currentTime - time 
// time = currentTime

// Cock
const clock = new THREE.Clock()

// Gsap fuckers 
// gsap.to(mesh.position, { duration: 1, delay: 1, x: Math.sin(0.4)})
// gsap.to(mesh.position, { duration: 1, delay: 2, x: Math.cos(0.4)})


// Animation 
const tick = () =>
{
    // Fucking time
    const elapsedTime = clock.getElapsedTime()

    // Update object
    // mesh2.rotation.y += 0.01 * Math.cos(elapsedTime)
    // mesh2.rotation.x += 0.01 * Math.sin(elapsedTime)

    // // Update camera
    // camera.position.x = Math.sin(cursor.x * 10) * 2
    // camera.position.z = Math.cos(cursor.x * 10) * 2
    // camera.position.y = cursor.y * 5

    // Fucking important !! Center the fucking object
    // camera.lookAt(mesh.position)

    // Update fucking controls
    // controls.target = (mesh.position)
    controls.update()

    // Render
    renderer.render(scene, camera)

    // console.log('tick')

    window.requestAnimationFrame(tick)
}

tick()