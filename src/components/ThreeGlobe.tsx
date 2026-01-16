import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ThreeGlobe = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const globeRef = useRef<THREE.Mesh | null>(null);
    const cloudsRef = useRef<THREE.Mesh | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            45,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 2.5;
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.minDistance = 1.5;
        controls.maxDistance = 4;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.1; // Very slow rotation
        controlsRef.current = controls;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // Helper to convert Lat/Lon to 3D position
        const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);

            // Standard mapping adjustment: 
            // In Three.js SphereGeometry, the texture seam is usually at x axis (theta = 0) 
            // but standard earth textures might be offset.
            // Using standard spherical conversion:
            const x = -(radius * Math.sin(phi) * Math.cos(theta));
            const z = (radius * Math.sin(phi) * Math.sin(theta));
            const y = (radius * Math.cos(phi));

            return new THREE.Vector3(x, y, z);
        };

        // Create a group to hold globe, clouds, and markers
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // Create Earth globe
        const geometry = new THREE.SphereGeometry(1, 64, 64);

        // Load Earth texture
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load(
            'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
        );

        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            bumpMap: earthTexture,
            bumpScale: 0.05,
            specular: new THREE.Color(0x333333),
            shininess: 15
        });

        const globe = new THREE.Mesh(geometry, material);
        globeGroup.add(globe); // Add to group
        globeRef.current = globe;

        // Create clouds layer
        const cloudsGeometry = new THREE.SphereGeometry(1.01, 64, 64);
        const cloudsTexture = textureLoader.load(
            'https://unpkg.com/three-globe/example/img/earth-clouds.png'
        );

        const cloudsMaterial = new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.4,
            depthWrite: false
        });

        const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        globeGroup.add(clouds); // Add to group
        cloudsRef.current = clouds;

        // Add Markers for Harbors
        // Coordinates:
        // Colombo: 6.9271° N, 79.8612° E
        // Trincomalee: 8.5874° N, 81.2152° E
        // Hambantota: 6.1429° N, 81.1212° E

        const harbors = [
            { name: 'Colombo', lat: 6.9271, lon: 79.8612, color: 0xff0000 },
            { name: 'Trincomalee', lat: 8.5874, lon: 81.2152, color: 0xff0000 },
            { name: 'Hambantota', lat: 6.1429, lon: 81.1212, color: 0xff0000 }
        ];

        harbors.forEach(harbor => {
            const position = latLongToVector3(harbor.lat, harbor.lon, 1.02); // Slightly above clouds/surface
            const markerGeometry = new THREE.SphereGeometry(0.006, 16, 16); // Small dot
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff3300 }); // Red-Orange
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.copy(position);
            globeGroup.add(marker);
        });

        // Global Ports Data
        const globalPorts = [
            { name: 'Singapore', country: 'Singapore', lat: 1.29, lon: 103.85 },
            { name: 'Rotterdam', country: 'Netherlands', lat: 51.92, lon: 4.48 }, // Netherlands
            { name: 'Dubai', country: 'UAE', lat: 25.20, lon: 55.27 }, // UAE
            { name: 'Durban', country: 'South Africa', lat: -29.85, lon: 31.02 }, // South Africa
            { name: 'London', country: 'UK', lat: 51.50, lon: -0.12 }, // UK
            { name: 'Shanghai', country: 'China', lat: 31.23, lon: 121.47 }, // China
            { name: 'Los Angeles', country: 'USA', lat: 33.74, lon: -118.24, curvature: 0.9 }, // USA West - Higher curvature
            { name: 'New York', country: 'USA', lat: 40.71, lon: -74.00, curvature: 0.9 }, // USA East
            { name: 'Santos', country: 'Brazil', lat: -23.96, lon: -46.33 }, // Brazil
            { name: 'Melbourne', country: 'Australia', lat: -37.81, lon: 144.96 }, // Australia
            { name: 'Tokyo', country: 'Japan', lat: 35.67, lon: 139.65 } // Japan
        ];

        // Label Helper
        const createLabel = (text: string, country: string) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 128; // Wider to fit text

            if (context) {
                context.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent background
                context.fillRect(0, 0, canvas.width, canvas.height);

                // City Name
                context.font = 'bold 36px Arial';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.fillText(text, canvas.width / 2, 50);

                // Country Name
                context.font = '24px Arial';
                context.fillStyle = '#cccccc'; // Greyish
                context.fillText(country, canvas.width / 2, 90);
            }

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(0.2, 0.05, 1); // Aspect ratio matching canvas
            return sprite;
        };

        // Draw curves
        const createCurve = (p1: THREE.Vector3, p2: THREE.Vector3, curvatureScale: number = 0.7) => {
            const distance = p1.distanceTo(p2);
            // Midpoint
            const mid = p1.clone().add(p2).multiplyScalar(0.5);
            // Normalize midpoint to project it to surface, then extend it out
            const midLength = mid.length();
            mid.normalize().multiplyScalar(midLength + distance * curvatureScale);

            const curve = new THREE.QuadraticBezierCurve3(
                p1,
                mid,
                p2
            );

            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0x4dd0e1, // Cyan-ish
                transparent: true,
                opacity: 0.8, // High visibility
                linewidth: 2 // Note: Windows/WebGL often ignores linewidth > 1 for lines
            });

            return new THREE.Line(geometry, material);
        };

        // Render Connections

        const slHarborVectors = harbors.map(h => latLongToVector3(h.lat, h.lon, 1.02));

        globalPorts.forEach(port => {
            const portPos = latLongToVector3(port.lat, port.lon, 1.02);

            // Add marker for global port
            const portMarkerGeom = new THREE.SphereGeometry(0.004, 8, 8);
            const portMarkerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.8, transparent: true });
            const portMarker = new THREE.Mesh(portMarkerGeom, portMarkerMat);
            portMarker.position.copy(portPos);
            globeGroup.add(portMarker);

            // Add Label
            const label = createLabel(port.name, port.country);
            // Position label slightly above the marker
            const labelPos = portPos.clone().multiplyScalar(1.05);
            label.position.copy(labelPos);
            globeGroup.add(label);

            // Connect ALL SL harbors to this global port
            slHarborVectors.forEach(slPos => {
                const curve = createCurve(slPos, portPos, port.curvature);
                globeGroup.add(curve);
            });
        });

        // Set initial rotation to face Sri Lanka
        // Calculate the position of Colombo (our main hub) in local space
        const colomboPos = latLongToVector3(6.9271, 79.8612, 1);

        // We want to rotate the globe so that colomboPos aligns with the Camera's view axis (Positive Z)
        // In spherical coords, Sri Lanka is at ~80 deg East.
        // The camera is at Z=2.5 looking at (0,0,0).
        // So we want the longitude of 80 to rotate to 90? (Positive Z) or 270?
        // Let's use atan2 to find the angle of colomboPos in the XZ plane
        const angle = Math.atan2(colomboPos.x, colomboPos.z);
        // We want this angle to become 0 (facing +Z) after rotation
        // globalRotationY + angle = 0  => globalRotationY = -angle
        // Let's adjust slightly for offset

        globeGroup.rotation.y = -angle;

        // Add a small offset if needed, or stick to calculated. 
        // Based on previous 4.75 (approx 1.5PI), let's compare.
        // If x is negative and z is positive (Quad 2/3?)
        // Let's just trust the vector math. Rotating by -atan2(x,z) should bring it to Z axis.

        globeGroup.rotation.x = 0.2; // Slight tilt

        // Animation loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            if (controlsRef.current) {
                controlsRef.current.update();
            }

            // Independent cloud rotation for realism
            if (cloudsRef.current) {
                cloudsRef.current.rotation.y += 0.0002;
            }

            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);

            if (controlsRef.current) {
                controlsRef.current.dispose();
            }

            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }

            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object instanceof THREE.Mesh) {
                        object.geometry.dispose();
                        if (object.material instanceof THREE.Material) {
                            object.material.dispose();
                        }
                    }
                });
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{ minHeight: '400px' }}
        />
    );
};

export default ThreeGlobe;
