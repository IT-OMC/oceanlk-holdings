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
    const atmosphereRef = useRef<THREE.Mesh | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const logoSpriteRef = useRef<THREE.Sprite | null>(null);
    const glassBackgroundRef = useRef<THREE.Sprite | null>(null);
    const globeGroupRef = useRef<THREE.Group | null>(null);

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
        camera.position.z = 3.5; // Further view for smaller initial globe
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.minDistance = 1.5;
        controls.maxDistance = 4;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.1;
        controlsRef.current = controls;

        // Add Background Stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.7,
            transparent: true,
            opacity: 0.8
        });

        const starsVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        // Enhanced Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Main directional light (Sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(5, 3, 5);
        scene.add(sunLight);

        // Rim light for edge highlighting
        const rimLight = new THREE.DirectionalLight(0x6699ff, 0.3);
        rimLight.position.set(-5, 0, -5);
        scene.add(rimLight);

        // Helper to convert Lat/Lon to 3D position
        const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);

            const x = -(radius * Math.sin(phi) * Math.cos(theta));
            const z = (radius * Math.sin(phi) * Math.sin(theta));
            const y = (radius * Math.cos(phi));

            return new THREE.Vector3(x, y, z);
        };

        // Create a group to hold globe, clouds, and markers
        const globeGroup = new THREE.Group();
        globeGroupRef.current = globeGroup;
        scene.add(globeGroup);

        // Initial scale for animation - start large
        globeGroup.scale.set(2.5, 2.5, 2.5);

        // Create Earth globe
        const geometry = new THREE.SphereGeometry(1, 128, 128);

        // Load Enhanced Earth textures
        const textureLoader = new THREE.TextureLoader();

        // Use high-quality 8K earth texture
        const earthTexture = textureLoader.load(
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg'
        );

        // Specular map for ocean reflections
        const specularMap = textureLoader.load(
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_specular_2048.jpg'
        );

        // Normal map for terrain details
        const normalMap = textureLoader.load(
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_normal_2048.jpg'
        );

        // City lights for the night side
        const lightsTexture = textureLoader.load(
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_lights_2048.png'
        );

        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            specularMap: specularMap,
            specular: new THREE.Color(0x333333),
            shininess: 25,
            normalMap: normalMap,
            normalScale: new THREE.Vector2(0.85, 0.85),
            emissive: new THREE.Color(0x000000),
            emissiveMap: lightsTexture,
            emissiveIntensity: 1.0
        });

        const globe = new THREE.Mesh(geometry, material);
        globeGroup.add(globe);
        globeRef.current = globe;

        // Create enhanced clouds layer
        const cloudsGeometry = new THREE.SphereGeometry(1.005, 128, 128);
        const cloudsTexture = textureLoader.load(
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_clouds_1024.png'
        );

        const cloudsMaterial = new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
            side: THREE.FrontSide
        });

        const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        globeGroup.add(clouds);
        cloudsRef.current = clouds;

        // Create Atmospheric Glow using custom shader
        const atmosphereGeometry = new THREE.SphereGeometry(1.15, 64, 64);

        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    
                    // Beautiful blue atmospheric glow
                    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
                    
                    gl_FragColor = vec4(atmosphere, 1.0) * intensity;
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        globeGroup.add(atmosphere);
        atmosphereRef.current = atmosphere;


        // Global Ports Data
        const globalPorts = [
            { name: 'Singapore', country: 'Singapore', lat: 1.29, lon: 103.85 },
            { name: 'Rotterdam', country: 'Netherlands', lat: 51.92, lon: 4.48 },
            { name: 'Dubai', country: 'UAE', lat: 25.20, lon: 55.27 },
            { name: 'Durban', country: 'South Africa', lat: -29.85, lon: 31.02 },
            { name: 'London', country: 'UK', lat: 51.50, lon: -0.12 },
            { name: 'Shanghai', country: 'China', lat: 31.23, lon: 121.47 },
            { name: 'Los Angeles', country: 'USA', lat: 33.74, lon: -118.24 },
            { name: 'New York', country: 'USA', lat: 40.71, lon: -74.00 },
            { name: 'Santos', country: 'Brazil', lat: -23.96, lon: -46.33 },
            { name: 'Melbourne', country: 'Australia', lat: -37.81, lon: 144.96 },
            { name: 'Tokyo', country: 'Japan', lat: 35.67, lon: 139.65 }
        ];

        // Label Helper for Global Ports
        // Label Helper for Global Ports
        const createLabel = (text: string, country: string) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 128;

            if (context) {
                context.fillStyle = 'rgba(0, 0, 0, 0)';
                context.fillRect(0, 0, canvas.width, canvas.height);

                // City Name
                context.font = 'bold 48px Arial';
                context.fillStyle = 'white';
                context.shadowColor = 'rgba(0, 0, 0, 0.8)';
                context.shadowBlur = 10;
                context.textAlign = 'center';
                context.fillText(text, canvas.width / 2, 55);

                // Country Name
                context.font = '32px Arial';
                context.fillStyle = '#cccccc';
                context.fillText(country, canvas.width / 2, 100);
            }

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(0.4, 0.1, 1);
            return sprite;
        };

        // Draw enhanced curves
        // const createCurve = (p1: THREE.Vector3, p2: THREE.Vector3, curvatureScale: number = 0.7) => {
        //     const distance = p1.distanceTo(p2);
        //     const mid = p1.clone().add(p2).multiplyScalar(0.5);
        //     const midLength = mid.length();
        //     mid.normalize().multiplyScalar(midLength + distance * curvatureScale);

        //     const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        //     const points = curve.getPoints(50);
        //     const geometry = new THREE.BufferGeometry().setFromPoints(points);

        //     const material = new THREE.LineBasicMaterial({
        //         color: 0x00ffff, // Brighter Cyan
        //         transparent: true,
        //         opacity: 0.9,     // Increased opacity
        //         linewidth: 3      // Thicker lines (note: WebGL linewidth support is limited, but this intent helps)
        //     });

        //     return new THREE.Line(geometry, material);
        // };

        // Render Global Ports - Markers and Labels only (no connection lines)
        globalPorts.forEach(port => {
            const portPos = latLongToVector3(port.lat, port.lon, 1.01);

            // Add marker for global port
            const portMarkerGeom = new THREE.SphereGeometry(0.005, 12, 12);
            const portMarkerMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                opacity: 0.9,
                transparent: true
            });
            const portMarker = new THREE.Mesh(portMarkerGeom, portMarkerMat);
            portMarker.position.copy(portPos);
            globeGroup.add(portMarker);

            // Add Label
            const label = createLabel(port.name, port.country);
            const labelPos = portPos.clone().multiplyScalar(1.06);
            label.position.copy(labelPos);
            globeGroup.add(label);
        });

        // Add OCH logo with glass background west of Sri Lanka
        const sriLankaPos = latLongToVector3(7.8731, 77.0, 1.01); // West of Sri Lanka

        // Create glass/frosted rectangle background for logo
        const glassCanvas = document.createElement('canvas');
        const glassContext = glassCanvas.getContext('2d');
        glassCanvas.width = 300;
        glassCanvas.height = 300;

        if (glassContext) {
            // Rounded rectangle helper function
            const roundRect = (x: number, y: number, width: number, height: number, radius: number) => {
                glassContext.beginPath();
                glassContext.moveTo(x + radius, y);
                glassContext.lineTo(x + width - radius, y);
                glassContext.quadraticCurveTo(x + width, y, x + width, y + radius);
                glassContext.lineTo(x + width, y + height - radius);
                glassContext.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                glassContext.lineTo(x + radius, y + height);
                glassContext.quadraticCurveTo(x, y + height, x, y + height - radius);
                glassContext.lineTo(x, y + radius);
                glassContext.quadraticCurveTo(x, y, x + radius, y);
                glassContext.closePath();
            };

            // Draw glass background
            roundRect(20, 20, 260, 260, 15);
            glassContext.fillStyle = 'rgba(255, 255, 255, 1.0)';
            glassContext.fill();

            // Draw border
            roundRect(20, 20, 260, 260, 15);
            glassContext.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            glassContext.lineWidth = 3;
            glassContext.stroke();
        }

        const glassTexture = new THREE.CanvasTexture(glassCanvas);
        const glassMaterial = new THREE.SpriteMaterial({
            map: glassTexture,
            transparent: true
        });
        const glassBackground = new THREE.Sprite(glassMaterial);
        glassBackground.scale.set(0.2, 0.2, 1);
        const glassPos = sriLankaPos.clone().multiplyScalar(1.08);
        glassBackground.position.copy(glassPos);
        glassBackgroundRef.current = glassBackground;
        globeGroup.add(glassBackground);

        // Add OCH logo on top of glass
        const logoTexture = textureLoader.load('/och-logo.png');
        const logoMaterial = new THREE.SpriteMaterial({
            map: logoTexture,
            transparent: true,
            opacity: 1.0
        });
        const logoSprite = new THREE.Sprite(logoMaterial);
        logoSprite.scale.set(0.16, 0.16, 1);
        const logoPos = sriLankaPos.clone().multiplyScalar(1.085);
        logoSprite.position.copy(logoPos);
        logoSpriteRef.current = logoSprite;
        globeGroup.add(logoSprite);

        // Create a raycaster for interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Handle mouse movement for smart zoom
        const handleMouseMove = (event: MouseEvent) => {
            if (!containerRef.current || !rendererRef.current) return;

            const rect = rendererRef.current.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        // Lower the globe position to visible bottom area
        // We move the entire group down
        globeGroup.position.y = -0.4;

        // Initial rotation
        const colomboRotationPos = latLongToVector3(6.9271, 79.8612, 1);
        const angle = Math.atan2(colomboRotationPos.x, colomboRotationPos.z);
        globeGroup.rotation.y = -angle;
        globeGroup.rotation.x = 0.2;

        window.addEventListener('mousemove', handleMouseMove);

        // Scale-down animation on load
        const startTime = Date.now();
        const animationDuration = 4000; // 4 seconds for smoother animation
        const startScale = 2.5;
        const endScale = 1.0;

        // Animation loop
        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Scale-down animation
            const elapsed = Date.now() - startTime;
            if (elapsed < animationDuration && globeGroupRef.current) {
                const progress = elapsed / animationDuration;
                // Ease-out cubic function for smooth deceleration
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentScale = startScale - (startScale - endScale) * easeProgress;
                globeGroupRef.current.scale.set(currentScale, currentScale, currentScale);
            } else if (globeGroupRef.current) {
                globeGroupRef.current.scale.set(endScale, endScale, endScale);
            }

            if (controlsRef.current && cameraRef.current) {
                // Raycast to check if mouse is over globe
                raycaster.setFromCamera(mouse, cameraRef.current);

                // Allow intersection with globe sphere AND atmosphere for generous hit target
                const intersects = raycaster.intersectObjects([globe, atmosphere, clouds]);

                // Smart Zoom Logic
                if (intersects.length > 0) {
                    controlsRef.current.enableZoom = true;
                    // Optional: change cursor to indicate zoom availability
                    if (containerRef.current) containerRef.current.style.cursor = 'grab';
                } else {
                    controlsRef.current.enableZoom = false;
                    if (containerRef.current) containerRef.current.style.cursor = 'default';
                }

                controlsRef.current.update();

                // Dynamic Visibility based on Zoom (Camera Distance)
                const distance = cameraRef.current.position.distanceTo(new THREE.Vector3(0, 0, 0));

                // Zoom Thresholds: Close ~1.5, Far ~4.0
                // We want to fade out clouds/atmos when closer than 2.2
                const fadeStart = 2.2;
                const fadeEnd = 1.6;

                // Calculate visibility factor (0 = invisible, 1 = fully visible)
                // smoothstep-like logic
                let visibilityFactor = (distance - fadeEnd) / (fadeStart - fadeEnd);
                visibilityFactor = Math.max(0, Math.min(1, visibilityFactor));

                // Apply to Clouds
                if (cloudsRef.current && cloudsRef.current.material instanceof THREE.Material) {
                    // @ts-ignore
                    cloudsRef.current.material.opacity = 0.35 * visibilityFactor + 0.05; // Keep slightly visible
                }

                // Apply to Atmosphere
                if (atmosphereRef.current && atmosphereRef.current.material instanceof THREE.ShaderMaterial) {
                    atmosphereRef.current.material.uniforms = {
                        ...atmosphereRef.current.material.uniforms // preserve existing if any
                    };
                    // Note: ShaderMaterial roughly handles opacity via transparent prop, but visual density works better with scale or color mix.
                    // Simple opacity approach for standard meshes:
                    atmosphereRef.current.material.opacity = visibilityFactor;
                }

                // Logo scaling and position based on zoom
                // When zoomed in (distance closer to 1.5), logo gets smaller and moves left
                // When zoomed out (distance closer to 4.0), logo stays at normal size
                if (logoSpriteRef.current && glassBackgroundRef.current) {
                    // Calculate zoom factor (0 = zoomed in, 1 = zoomed out)
                    const zoomFactor = (distance - 1.5) / (4.0 - 1.5);
                    const clampedZoom = Math.max(0, Math.min(1, zoomFactor));

                    // Scale: from 50% when zoomed in to 100% when zoomed out
                    const logoScale = 0.5 + (0.5 * clampedZoom);
                    logoSpriteRef.current.scale.set(0.16 * logoScale, 0.16 * logoScale, 1);
                    glassBackgroundRef.current.scale.set(0.2 * logoScale, 0.2 * logoScale, 1);

                    // Position offset: move left when zoomed in
                    // When zoomed in, move further west (decrease longitude)
                    const lonOffset = -10 * (1 - clampedZoom); // Move up to 10 degrees west when fully zoomed in
                    const adjustedPos = latLongToVector3(7.8731, 77.0 + lonOffset, 1.01);

                    const logoPos = adjustedPos.clone().multiplyScalar(1.085);
                    logoSpriteRef.current.position.copy(logoPos);

                    const glassPos = adjustedPos.clone().multiplyScalar(1.08);
                    glassBackgroundRef.current.position.copy(glassPos);
                }
            }

            // Independent cloud rotation for realism
            if (cloudsRef.current) {
                cloudsRef.current.rotation.y += 0.0003;
            }

            // Gentle atmosphere pulse
            if (atmosphereRef.current) {
                const scale = 1 + Math.sin(Date.now() * 0.001) * 0.01;
                atmosphereRef.current.scale.set(scale, scale, scale);
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
            window.removeEventListener('mousemove', handleMouseMove);
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
