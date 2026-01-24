import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeDScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        // Scene setup
        const scene = new THREE.Scene()

        // Create cube
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: "red" })
        const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
        scene.add(cubeMesh)

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            30
        )
        camera.position.z = 5

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate)

            // Rotate cube
            cubeMesh.rotation.x += 0.01
            cubeMesh.rotation.y += 0.01

            renderer.render(scene, camera)
        }
        animate()

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
            renderer.dispose()
            cubeGeometry.dispose()
            cubeMaterial.dispose()
        }
    }, [])

    return (
        <canvas ref={canvasRef} className="threejs" />
    )
}