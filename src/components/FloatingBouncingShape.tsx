import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingShape() {
    const meshRef = useRef<THREE.Mesh>(null);
    // Ensure non-zero initial direction
    const direction = useRef(new THREE.Vector3(Math.random() - 0.5 || 0.1, Math.random() - 0.5 || 0.1, 0).normalize());
    const speed = 0.002; // Slower speed

    useFrame((state) => {
        if (meshRef.current) {
            const { viewport } = state;
            const x = meshRef.current.position.x;
            const y = meshRef.current.position.y;
            
            // Adjust bounds based on object size (approx 2 units radius now)
            const radius = 0.3; 
            const widthBound = viewport.width / 2 - radius;
            const heightBound = viewport.height / 2 - radius;

            // Update position
            meshRef.current.position.add(direction.current.clone().multiplyScalar(speed));

            // Rotation
            meshRef.current.rotation.x += 0.002;
            meshRef.current.rotation.y += 0.002;

            // Bounce logic
            if (x > widthBound || x < -widthBound) {
                direction.current.x = -direction.current.x;
                // Clamp to avoid sticking
                meshRef.current.position.x = x > 0 ? widthBound : -widthBound;
            }
            if (y > heightBound || y < -heightBound) {
                direction.current.y = -direction.current.y;
                meshRef.current.position.y = y > 0 ? heightBound : -heightBound;
            }
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <torusKnotGeometry args={[0.4, 0.15, 100, 16]} /> {/* Smaller size */}
            <meshStandardMaterial 
                color="#57FE1E" 
                wireframe 
                transparent 
                opacity={0.1} 
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

export default function FloatingBouncingShape({ className = "" }: { className?: string }) {
    return (
        <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}> {/* z-index -1 */}
            <Canvas camera={{ position: [0, 0, 15] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <FloatingShape />
            </Canvas>
        </div>
    );
}
