import { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { Water } from 'three-stdlib';

extend({ Water });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            water: any;
        }
    }
}

const Ocean = () => {
    const ref = useRef<any>();
    const gl = useThree((state) => state.gl);

    // Water geometry
    const waterGeom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);

    // Water configuration
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('/images/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: false,
            format: gl.outputColorSpace === THREE.SRGBColorSpace ? THREE.RGBAFormat : THREE.UnsignedByteType // Fix for color space compatibility
        }),
        [gl.outputColorSpace]
    );

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.material.uniforms.time.value += delta * 0.5;
        }
    });

    return (
        <water
            ref={ref}
            args={[waterGeom, config]}
            rotation-x={-Math.PI / 2}
        />
    );
};

const InteractiveWaterCanvas = () => {
    return (
        <div className="w-full h-full min-h-[500px]">
            <Canvas camera={{ position: [0, 30, 100], fov: 55, near: 1, far: 20000 }}>
                {/* Environment and Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[100, 100, 100]} intensity={1} />
                <pointLight position={[-100, -100, -100]} intensity={1} color="#00ffff" />

                {/* The Water Surface */}
                <Ocean />

                {/* Skybox for reflections */}
                <Sky distance={10000} sunPosition={[500, 150, -1000]} turbidity={0.1} rayleigh={2} inclination={0.6} azimuth={0.1} />

                {/* Controls to "look around" slightly but restricted to keep the view focused */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 2.2}
                />
            </Canvas>
        </div>
    );
};

export default InteractiveWaterCanvas;
