import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface ShippingRoute {
    id: string;
    name: string;
    from: { lat: number; lng: number };
    to: { lat: number; lng: number };
    color: number;
    weeklySailings: number;
    tonnageMoved: string;
    transitTime: string;
}

const GlobalConnections = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveredRoute] = useState<ShippingRoute | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Port coordinates
        const COLOMBO = { lat: 6.9271, lng: 79.8612 };
        const TRINCOMALEE = { lat: 8.5874, lng: 81.2152 };
        const HAMBANTOTA = { lat: 6.1241, lng: 81.1185 };

        // Shipping routes
        const shippingRoutes: ShippingRoute[] = [
            {
                id: 'colombo-singapore',
                name: 'Colombo → Singapore',
                from: COLOMBO,
                to: { lat: 1.3521, lng: 103.8198 },
                color: 0xec4899,
                weeklySailings: 14,
                tonnageMoved: '520K TEU',
                transitTime: '4-5 days'
            },
            {
                id: 'colombo-dubai',
                name: 'Colombo → Dubai',
                from: COLOMBO,
                to: { lat: 25.2048, lng: 55.2708 },
                color: 0x8b5cf6,
                weeklySailings: 18,
                tonnageMoved: '680K TEU',
                transitTime: '7-9 days'
            },
            {
                id: 'hambantota-shanghai',
                name: 'Hambantota → Shanghai',
                from: HAMBANTOTA,
                to: { lat: 31.2304, lng: 121.4737 },
                color: 0x10b981,
                weeklySailings: 12,
                tonnageMoved: '450K TEU',
                transitTime: '12-14 days'
            },
            {
                id: 'trincomalee-singapore',
                name: 'Trincomalee → Singapore',
                from: TRINCOMALEE,
                to: { lat: 1.3521, lng: 103.8198 },
                color: 0xf59e0b,
                weeklySailings: 16,
                tonnageMoved: '520K TEU',
                transitTime: '4-5 days'
            },
            {
                id: 'colombo-mumbai',
                name: 'Colombo → Mumbai',
                from: COLOMBO,
                to: { lat: 19.0760, lng: 72.8777 },
                color: 0x3b82f6,
                weeklySailings: 21,
                tonnageMoved: '780K TEU',
                transitTime: '3-4 days'
            },
            {
                id: 'colombo-rotterdam',
                name: 'Colombo → Rotterdam',
                from: COLOMBO,
                to: { lat: 51.9225, lng: 4.47917 },
                color: 0xef4444,
                weeklySailings: 8,
                tonnageMoved: '350K TEU',
                transitTime: '18-21 days'
            },
            {
                id: 'hambantota-hongkong',
                name: 'Hambantota → Hong Kong',
                from: HAMBANTOTA,
                to: { lat: 22.3193, lng: 114.1694 },
                color: 0x06b6d4,
                weeklySailings: 10,
                tonnageMoved: '420K TEU',
                transitTime: '10-12 days'
            },
            {
                id: 'trincomalee-chennai',
                name: 'Trincomalee → Chennai',
                from: TRINCOMALEE,
                to: { lat: 13.0827, lng: 80.2707 },
                color: 0xa855f7,
                weeklySailings: 14,
                tonnageMoved: '380K TEU',
                transitTime: '2-3 days'
            },
            {
                id: 'colombo-tokyo',
                name: 'Colombo → Tokyo',
                from: COLOMBO,
                to: { lat: 35.6762, lng: 139.6503 },
                color: 0xff6b6b,
                weeklySailings: 9,
                tonnageMoved: '320K TEU',
                transitTime: '15-17 days'
            },
            {
                id: 'hambantota-losangeles',
                name: 'Hambantota → Los Angeles',
                from: HAMBANTOTA,
                to: { lat: 34.0522, lng: -118.2437 },
                color: 0x4ecdc4,
                weeklySailings: 6,
                tonnageMoved: '280K TEU',
                transitTime: '22-25 days'
            },
            {
                id: 'trincomalee-sydney',
                name: 'Trincomalee → Sydney',
                from: TRINCOMALEE,
                to: { lat: -33.8688, lng: 151.2093 },
                color: 0xffe66d,
                weeklySailings: 8,
                tonnageMoved: '290K TEU',
                transitTime: '16-18 days'
            },
            {
                id: 'colombo-london',
                name: 'Colombo → London',
                from: COLOMBO,
                to: { lat: 51.5074, lng: -0.1278 },
                color: 0x95e1d3,
                weeklySailings: 7,
                tonnageMoved: '310K TEU',
                transitTime: '20-22 days'
            },
            {
                id: 'hambantota-newyork',
                name: 'Hambantota → New York',
                from: HAMBANTOTA,
                to: { lat: 40.7128, lng: -74.0060 },
                color: 0xf38181,
                weeklySailings: 5,
                tonnageMoved: '240K TEU',
                transitTime: '24-27 days'
            },
            {
                id: 'colombo-capetown',
                name: 'Colombo → Cape Town',
                from: COLOMBO,
                to: { lat: -33.9249, lng: 18.4241 },
                color: 0xaa96da,
                weeklySailings: 6,
                tonnageMoved: '210K TEU',
                transitTime: '14-16 days'
            },
            {
                id: 'trincomalee-jeddah',
                name: 'Trincomalee → Jeddah',
                from: TRINCOMALEE,
                to: { lat: 21.5433, lng: 39.1728 },
                color: 0xfcbad3,
                weeklySailings: 11,
                tonnageMoved: '390K TEU',
                transitTime: '8-10 days'
            }
        ];

        // Major locations for labels
        const MAJOR_LOCATIONS = [
            { name: 'Sri Lanka', lat: 7.8731, lng: 80.7718 },
            { name: 'India', lat: 20.5937, lng: 78.9629 },
            { name: 'China', lat: 35.8617, lng: 104.1954 },
            { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
            { name: 'UAE', lat: 23.4241, lng: 53.8478 },
            { name: 'Europe', lat: 51.9225, lng: 4.47917 }
        ];

        // Convert lat/lng to 3D coordinates
        function latLngToVector3(lat: number, lng: number, radius: number) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);

            return new THREE.Vector3(
                -(radius * Math.sin(phi) * Math.cos(theta)),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
        }

        // Create canvas for text labels
        function createTextTexture(text: string, color = '#ffffff', isSriLanka = false) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            const fontSize = isSriLanka ? 48 : 40;
            canvas.width = 512;
            canvas.height = 128;

            context.fillStyle = 'rgba(0, 0, 0, 0)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.font = `bold ${fontSize}px Arial`;
            context.fillStyle = color;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.strokeStyle = '#000000';
            context.lineWidth = 4;
            context.strokeText(text, canvas.width / 2, canvas.height / 2);
            context.fillText(text, canvas.width / 2, canvas.height / 2);

            return new THREE.CanvasTexture(canvas);
        }

        // Initialize Three.js scene
        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            45,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight1.position.set(10, 5, 5);
        scene.add(directionalLight1);

        const pointLight1 = new THREE.PointLight(0x60a5fa, 0.8, 100);
        pointLight1.position.set(5, 0, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xa78bfa, 0.6, 100);
        pointLight2.position.set(-5, 0, -5);
        scene.add(pointLight2);

        // Create Earth globe
        const globeGroup = new THREE.Group();
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';

        const globeGeometry = new THREE.SphereGeometry(1.5, 128, 128);
        const globeMaterial = new THREE.MeshPhongMaterial({
            color: 0x0a1628,
            emissive: 0x112240,
            emissiveIntensity: 0.5,
            specular: 0x333333,
            shininess: 25
        });

        loader.load(
            'https://unpkg.com/three-globe/example/img/earth-night.jpg',
            (texture) => {
                globeMaterial.map = texture;
                globeMaterial.emissiveMap = texture;
                globeMaterial.emissive = new THREE.Color(0xffff88);
                globeMaterial.emissiveIntensity = 0.8;
                globeMaterial.needsUpdate = true;
            }
        );

        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        globeGroup.add(globe);

        // Atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(1.51, 64, 64);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a90e2,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        globeGroup.add(atmosphere);

        // Grid overlay
        const gridGeometry = new THREE.SphereGeometry(1.502, 64, 64);
        const gridMaterial = new THREE.MeshBasicMaterial({
            color: 0x60a5fa,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        });
        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        globeGroup.add(grid);

        // Position globe to show Sri Lanka initially
        // Sri Lanka is at approximately 80° longitude, 7° latitude
        globeGroup.rotation.y = -(80 * Math.PI / 180) - Math.PI / 2; // Convert longitude to radians and adjust
        globeGroup.rotation.x = -(7 * Math.PI / 180); // Convert latitude to radians

        scene.add(globeGroup);

        // Add location labels
        MAJOR_LOCATIONS.forEach(location => {
            const position = latLngToVector3(location.lat, location.lng, 1.65);
            const isSriLanka = location.name === 'Sri Lanka';
            const color = isSriLanka ? '#fbbf24' : '#ffffff';

            const texture = createTextTexture(location.name, color, isSriLanka);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.copy(position);
            sprite.scale.set(isSriLanka ? 0.6 : 0.5, isSriLanka ? 0.15 : 0.125, 1);
            globeGroup.add(sprite);

            if (isSriLanka) {
                const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
                const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
                const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                marker.position.copy(position);
                globeGroup.add(marker);
            }
        });

        // Add port markers
        const ports = [
            { ...COLOMBO, color: 0xfbbf24, name: 'Colombo' },
            { ...TRINCOMALEE, color: 0xfb923c, name: 'Trincomalee' },
            { ...HAMBANTOTA, color: 0xfacc15, name: 'Hambantota' }
        ];

        ports.forEach(port => {
            const position = latLngToVector3(port.lat, port.lng, 1.58);

            // Multi-layered glow effect
            [
                { size: 0.11, opacity: 0.15 },
                { size: 0.075, opacity: 0.3 },
                { size: 0.045, opacity: 0.6 }
            ].forEach(({ size, opacity }) => {
                const glow = new THREE.Mesh(
                    new THREE.SphereGeometry(size, 16, 16),
                    new THREE.MeshBasicMaterial({ color: port.color, transparent: true, opacity })
                );
                glow.position.copy(position);
                globeGroup.add(glow);
            });

            // Core marker
            const core = new THREE.Mesh(
                new THREE.SphereGeometry(0.03, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );
            core.position.copy(position);
            globeGroup.add(core);
        });

        // Create shipping routes
        const routeObjects: THREE.Object3D[] = [];
        shippingRoutes.forEach(route => {
            const start = latLngToVector3(route.from.lat, route.from.lng, 1.54);
            const end = latLngToVector3(route.to.lat, route.to.lng, 1.54);

            const midpoint = new THREE.Vector3(
                (start.x + end.x) / 2,
                (start.y + end.y) / 2,
                (start.z + end.z) / 2
            );

            const length = midpoint.length();
            const arcHeight = 0.6;
            const control = midpoint.normalize().multiplyScalar(length + arcHeight);

            const curve = new THREE.QuadraticBezierCurve3(start, control, end);
            const points = curve.getPoints(50);

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: route.color,
                transparent: true,
                opacity: 0.8
            });
            const line = new THREE.Line(geometry, material);
            line.userData = { route, originalColor: route.color };
            globeGroup.add(line);
            routeObjects.push(line);

            // Animated particles
            const particleCount = 8;
            const particleGeometry = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            points.slice(0, particleCount).forEach((point, i) => {
                particlePositions[i * 3] = point.x;
                particlePositions[i * 3 + 1] = point.y;
                particlePositions[i * 3 + 2] = point.z;
            });
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

            const particleMaterial = new THREE.PointsMaterial({
                color: route.color,
                size: 0.08,
                transparent: true,
                opacity: 1,
                sizeAttenuation: true
            });
            const particles = new THREE.Points(particleGeometry, particleMaterial);
            particles.userData = { points, startTime: Math.random() * 10 };
            globeGroup.add(particles);
            routeObjects.push(particles);

            // Destination marker
            const destGeo = new THREE.SphereGeometry(0.05, 12, 12);
            const destMat = new THREE.MeshBasicMaterial({ color: route.color });
            const dest = new THREE.Mesh(destGeo, destMat);
            dest.position.copy(end);
            globeGroup.add(dest);

            const destGlowGeo = new THREE.SphereGeometry(0.08, 12, 12);
            const destGlowMat = new THREE.MeshBasicMaterial({
                color: route.color,
                transparent: true,
                opacity: 0.4
            });
            const destGlow = new THREE.Mesh(destGlowGeo, destGlowMat);
            destGlow.position.copy(end);
            globeGroup.add(destGlow);
        });

        // Camera setup
        camera.position.set(0, 0, 4.5);

        // Mouse interaction
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const handleMouseDown = (e: MouseEvent) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;

                globeGroup.rotation.y += deltaX * 0.005;
                globeGroup.rotation.x += deltaY * 0.005;

                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY * -0.001;
            camera.position.z = Math.max(3, Math.min(7, camera.position.z + delta));
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('wheel', handleWheel);

        // Animation loop
        let animationId: number;
        const clock = new THREE.Clock();

        function animate() {
            animationId = requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Auto-rotation removed - user can drag to rotate

            // Animate particles
            routeObjects.forEach(obj => {
                if (obj instanceof THREE.Points && obj.userData.points) {
                    const positions = obj.geometry.attributes.position.array as Float32Array;
                    const points = obj.userData.points;
                    const offset = (elapsedTime + obj.userData.startTime) * 0.1;

                    for (let i = 0; i < positions.length / 3; i++) {
                        const index = Math.floor((i + offset * 10) % points.length);
                        const point = points[index];
                        positions[i * 3] = point.x;
                        positions[i * 3 + 1] = point.y;
                        positions[i * 3 + 2] = point.z;
                    }
                    obj.geometry.attributes.position.needsUpdate = true;
                }
            });

            renderer.render(scene, camera);
        }

        animate();

        // Handle resize
        const handleResize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('wheel', handleWheel);

            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (object.material instanceof THREE.Material) {
                        object.material.dispose();
                    }
                }
            });

            renderer.dispose();
        };
    }, []);

    return (
        <section className="relative py-20 lg:py-32 bg-gradient-to-b from-navy via-navy to-slate-900 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        Connecting Sri Lanka
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            To The World
                        </span>
                    </h2>
                    <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                        Strategic location at the crossroads of global trade routes. Explore our shipping network
                        spanning across continents and oceans.
                    </p>
                </motion.div>

                {/* Globe Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative mb-16"
                >
                    <div className="relative h-[500px] lg:h-[700px] rounded-2xl overflow-hidden">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full cursor-grab active:cursor-grabbing"
                        />

                        {/* Interaction Hint */}
                        <div className="absolute top-6 right-6 glass px-4 py-2 rounded-lg text-sm text-slate-300">
                            <span className="text-blue-400 font-semibold">Drag</span> to rotate •{' '}
                            <span className="text-purple-400 font-semibold">Scroll</span> to zoom
                        </div>

                        {/* Route Stats Popup */}
                        {hoveredRoute && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 glass p-6 rounded-2xl min-w-[320px] shadow-2xl"
                            >
                                <h3 className="text-white text-xl font-bold mb-4">{hoveredRoute.name}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            ⛴
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400">Weekly Sailings</div>
                                            <div className="text-white font-bold">{hoveredRoute.weeklySailings}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            📈
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400">Tonnage Moved</div>
                                            <div className="text-white font-bold">{hoveredRoute.tonnageMoved}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            ⏱
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400">Transit Time</div>
                                            <div className="text-white font-bold">{hoveredRoute.transitTime}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Stats Grid */}
                {/* Stats Grid Removed - Moved to HoldingDescription */}
            </div>
        </section>
    );
};

export default GlobalConnections;
