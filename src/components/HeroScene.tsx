import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 800;

/**
 * Floating particle system that reacts to mouse position.
 * Creates an abstract, ethereal atmosphere for the hero section.
 */
function Particles() {
    const meshRef = useRef<THREE.Points>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        const vel = new Float32Array(PARTICLE_COUNT * 3);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            pos[i3] = (Math.random() - 0.5) * 12;
            pos[i3 + 1] = (Math.random() - 0.5) * 12;
            pos[i3 + 2] = (Math.random() - 0.5) * 6;

            vel[i3] = (Math.random() - 0.5) * 0.003;
            vel[i3 + 1] = (Math.random() - 0.5) * 0.003;
            vel[i3 + 2] = (Math.random() - 0.5) * 0.002;
        }

        return [pos, vel];
    }, []);

    const sizes = useMemo(() => {
        const s = new Float32Array(PARTICLE_COUNT);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            s[i] = Math.random() * 2 + 0.5;
        }
        return s;
    }, []);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", onMouseMove);
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, []);

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        const positionAttr = meshRef.current.geometry.attributes.position;
        const array = positionAttr.array as Float32Array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Mouse influence
            const dx = mousePos.current.x * viewport.width * 0.5 - array[i3];
            const dy = mousePos.current.y * viewport.height * 0.5 - array[i3 + 1];
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - dist / 4) * 0.008;

            array[i3] += velocities[i3] + dx * influence;
            array[i3 + 1] += velocities[i3 + 1] + dy * influence;
            array[i3 + 2] += velocities[i3 + 2];

            // Boundary wrapping
            if (Math.abs(array[i3]) > 6) velocities[i3] *= -1;
            if (Math.abs(array[i3 + 1]) > 6) velocities[i3 + 1] *= -1;
            if (Math.abs(array[i3 + 2]) > 3) velocities[i3 + 2] *= -1;
        }

        positionAttr.needsUpdate = true;
        meshRef.current.rotation.y += delta * 0.02;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={PARTICLE_COUNT}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={PARTICLE_COUNT}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#7D5BA6"
                transparent
                opacity={0.6}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

/**
 * HeroScene — Three.js canvas with floating reactive particles.
 */
export default function HeroScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                dpr={[1, 1.5]}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: false }}
            >
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={0.5} color="#7D5BA6" />
                <Particles />
            </Canvas>
        </div>
    );
}
