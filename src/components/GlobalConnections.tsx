import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, TrendingUp, Clock } from 'lucide-react';
import { shippingRoutes, latLngToVector3, COLOMBO, TRINCOMALEE, HAMBANTOTA, ShippingRoute } from '../data/globalData';

// Earth Globe Component with realistic texture
function Globe() {
    const globeRef = useRef<THREE.Mesh>(null);
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    // Load Earth texture
    useState(() => {
        const loader = new THREE.TextureLoader();
        // Using a public Earth texture map
        loader.load(
            'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg',
            (loadedTexture) => {
                setTexture(loadedTexture);
            },
            undefined,
            // Fallback to solid color if texture fails to load
            () => {
                console.warn('Earth texture failed to load, using fallback');
            }
        );
    });

    // Rotate globe to focus on Sri Lanka (around 80°E, 7°N)
    // Sri Lanka longitude: ~80°E, rotate to center it
    const rotation = [-0.12, -1.4, 0]; // [x, y, z] - adjusted to show Sri Lanka prominently

    return (
        <group rotation={rotation as any}>
            <Sphere ref={globeRef} args={[2, 64, 64]}>
                {texture ? (
                    <meshStandardMaterial
                        map={texture}
                        roughness={0.7}
                        metalness={0.1}
                        emissive="#0a1628"
                        emissiveIntensity={0.2}
                    />
                ) : (
                    <meshStandardMaterial
                        color="#0a1628"
                        roughness={0.7}
                        metalness={0.3}
                        emissive="#1a2942"
                        emissiveIntensity={0.2}
                    />
                )}
                {/* Globe wireframe overlay - subtle and darker like reference */}
                <Sphere args={[2.01, 32, 32]}>
                    <meshBasicMaterial
                        color="#1e3a5f"
                        wireframe
                        opacity={0.08}
                        transparent
                    />
                </Sphere>
            </Sphere>

            {/* Atmospheric glow */}
            <Sphere args={[2.15, 32, 32]}>
                <meshBasicMaterial
                    color="#3b82f6"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </Sphere>
        </group>
    );
}

// Sri Lankan Port Markers (Colombo, Trincomalee, Hambantota)
function PortMarkers() {
    const ports = [
        { ...COLOMBO, color: '#fbbf24', name: 'Colombo' }, // Bright yellow
        { ...TRINCOMALEE, color: '#fb923c', name: 'Trincomalee' }, // Orange
        { ...HAMBANTOTA, color: '#facc15', name: 'Hambantota' }, // Yellow
    ];

    return (
        <>
            {ports.map((port, index) => {
                const position = latLngToVector3(port.lat, port.lng, 2.1);
                return (
                    <group key={index} position={[position.x, position.y, position.z]}>
                        {/* Large outer glow - most prominent */}
                        <mesh>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshBasicMaterial color={port.color} transparent opacity={0.15} />
                        </mesh>
                        {/* Medium glow */}
                        <mesh>
                            <sphereGeometry args={[0.1, 16, 16]} />
                            <meshBasicMaterial color={port.color} transparent opacity={0.3} />
                        </mesh>
                        {/* Inner glow */}
                        <mesh>
                            <sphereGeometry args={[0.06, 16, 16]} />
                            <meshBasicMaterial color={port.color} transparent opacity={0.6} />
                        </mesh>
                        {/* Core marker - bright and solid */}
                        <mesh>
                            <sphereGeometry args={[0.04, 16, 16]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                    </group>
                );
            })}
        </>
    );
}

// Shipping Route Curve
interface RouteProps {
    route: ShippingRoute;
    isHovered: boolean;
    onHover: (hovered: boolean) => void;
}

function ShippingRouteCurve({ route, isHovered, onHover }: RouteProps) {
    const particlesRef = useRef<THREE.Points>(null);

    // Create curve path
    const points = useMemo(() => {
        const start = latLngToVector3(route.from.lat, route.from.lng, 2.05);
        const end = latLngToVector3(route.to.lat, route.to.lng, 2.05);

        // Calculate control point for arc (higher altitude in the middle)
        const midpoint = {
            x: (start.x + end.x) / 2,
            y: (start.y + end.y) / 2,
            z: (start.z + end.z) / 2,
        };

        // Normalize and extend for arc effect
        const length = Math.sqrt(midpoint.x ** 2 + midpoint.y ** 2 + midpoint.z ** 2);
        const arcHeight = 0.8;
        const control = {
            x: (midpoint.x / length) * (length + arcHeight),
            y: (midpoint.y / length) * (length + arcHeight),
            z: (midpoint.z / length) * (length + arcHeight),
        };

        // Create quadratic bezier curve
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(start.x, start.y, start.z),
            new THREE.Vector3(control.x, control.y, control.z),
            new THREE.Vector3(end.x, end.y, end.z)
        );

        return curve.getPoints(50);
    }, [route]);

    // Animate particles along the route
    useFrame((state) => {
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position;
            const time = state.clock.elapsedTime;

            for (let i = 0; i < 8; i++) {
                const progress = ((time * 0.1 + i * 0.125) % 1);
                const index = Math.floor(progress * (points.length - 1));
                const point = points[index];

                positions.setXYZ(i, point.x, point.y, point.z);
            }

            positions.needsUpdate = true;
        }
    });

    // Particle positions
    const particlePositions = useMemo(() => {
        const positions = new Float32Array(8 * 3);
        points.slice(0, 8).forEach((point, i) => {
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
        });
        return positions;
    }, [points]);

    return (
        <group
            onPointerEnter={() => onHover(true)}
            onPointerLeave={() => onHover(false)}
        >
            {/* Route line - thicker and brighter */}
            <Line
                points={points}
                color={isHovered ? '#ffffff' : route.color}
                lineWidth={isHovered ? 4 : 2.5}
                transparent
                opacity={isHovered ? 1 : 0.8}
            />

            {/* Animated particles - larger and more visible */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[particlePositions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.08}
                    color={route.color}
                    transparent
                    opacity={1}
                    sizeAttenuation
                />
            </points>

            {/* Destination marker - larger and brighter */}
            <mesh position={[points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].z]}>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshBasicMaterial color={route.color} />
            </mesh>
            {/* Destination glow */}
            <mesh position={[points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].z]}>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshBasicMaterial color={route.color} transparent opacity={0.4} />
            </mesh>
        </group>
    );
}

// Main Scene
function GlobeScene({ onRouteHover }: { onRouteHover: (route: ShippingRoute | null) => void }) {
    const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

    const handleHover = (route: ShippingRoute, hovered: boolean) => {
        setHoveredRoute(hovered ? route.id : null);
        onRouteHover(hovered ? route : null);
    };

    return (
        <>
            {/* Enhanced lighting for better visibility */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <directionalLight position={[-10, -10, -5]} intensity={0.8} />
            <pointLight position={[5, 0, 5]} intensity={1} color="#60a5fa" />
            <pointLight position={[-5, 0, -5]} intensity={0.8} color="#a78bfa" />

            <Globe />
            <PortMarkers />

            {shippingRoutes.map((route) => (
                <ShippingRouteCurve
                    key={route.id}
                    route={route}
                    isHovered={hoveredRoute === route.id}
                    onHover={(hovered) => handleHover(route, hovered)}
                />
            ))}

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.5}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={(3 * Math.PI) / 4}
            />
        </>
    );
}

// Route Stats Overlay
interface RouteStatsProps {
    route: ShippingRoute;
}

function RouteStats({ route }: RouteStatsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 min-w-[320px] shadow-2xl"
        >
            <h3 className="text-xl font-semibold text-white mb-4">{route.name}</h3>

            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Ship className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Weekly Sailings</p>
                        <p className="text-lg font-bold text-white">{route.weeklySailings}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Tonnage Moved</p>
                        <p className="text-lg font-bold text-white">{route.tonnageMoved}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Transit Time</p>
                        <p className="text-lg font-bold text-white">{route.transitTime}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Main Component
export default function GlobalConnections() {
    const [hoveredRoute, setHoveredRoute] = useState<ShippingRoute | null>(null);

    return (
        <section className="relative min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] py-24 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block"
                    >
                        <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-semibold mb-4">
                            Global Network
                        </span>
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Connecting Sri Lanka
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            To The World
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Strategic location at the crossroads of global trade routes. Explore our shipping network
                        spanning across continents and oceans.
                    </p>
                </motion.div>

                {/* Interactive Globe */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative h-[800px]"
                >
                    <Canvas
                        camera={{ position: [0, 0, 5], fov: 45 }}
                        gl={{ antialias: true, alpha: true }}
                        style={{ background: 'transparent' }}
                    >
                        <GlobeScene onRouteHover={setHoveredRoute} />
                    </Canvas>

                    {/* Route Stats Overlay */}
                    <AnimatePresence>
                        {hoveredRoute && <RouteStats route={hoveredRoute} />}
                    </AnimatePresence>

                    {/* Interaction Hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute top-6 right-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2"
                    >
                        <p className="text-sm text-gray-400">
                            <span className="text-blue-400 font-semibold">Drag</span> to rotate •{' '}
                            <span className="text-purple-400 font-semibold">Hover</span> routes for details
                        </p>
                    </motion.div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12"
                >
                    {[
                        { label: 'Active Routes', value: '6+', color: 'blue' },
                        { label: 'Weekly Sailings', value: '103', color: 'purple' },
                        { label: 'Annual Tonnage', value: '8.7M TEU', color: 'pink' },
                        { label: 'Global Ports', value: '50+', color: 'emerald' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
                        >
                            <p className={`text-4xl font-bold bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 bg-clip-text text-transparent mb-2`}>
                                {stat.value}
                            </p>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
