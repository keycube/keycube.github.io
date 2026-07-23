import * as THREE from 'three';
import {OrbitControls} from 'three/oc';
import {RoundedBoxGeometry} from 'three/rgb';

export class Keycube {
    constructor(container, isReachabilityMode, currentScoreFormat) {
        // External const
        this.maxPixelRatio = 2.5;
        this.container = container;

        // Track current mode for score formatting
        this.isReachabilityMode = isReachabilityMode;
        this.currentScoreFormat = currentScoreFormat;

        this.lastComputedDistance = null;

        // Store score labels for each key
        this.scoreLabels = {};

        // Face layout — keyed to the paper's Figure 6 numbering on each face.
        this.faces = [
            {axis: 'y', sign: 1, prefix: 'R', color: 'red', colAxis: 'x', colSign: 1, rowAxis: 'z', rowSign: 1},
            {axis: 'z', sign: -1, prefix: 'B', color: 'blue', colAxis: 'x', colSign: 1, rowAxis: 'y', rowSign: 1},
            {axis: 'x', sign: 1, prefix: 'Y', color: 'yellow', colAxis: 'y', colSign: -1, rowAxis: 'z', rowSign: 1},
            {axis: 'x', sign: -1, prefix: 'W', color: 'white', colAxis: 'y', colSign: 1, rowAxis: 'z', rowSign: 1},
            {axis: 'z', sign: 1, prefix: 'G', color: 'green', colAxis: 'x', colSign: 1, rowAxis: 'y', rowSign: -1}
        ];

        // Scene Setup
        this.scene = new THREE.Scene();

        // Camera — slightly above center, looking at the cube from behind.
        // User stands BEHIND the cube, sees Yellow (right hand) on left, Blue (left hand) on right.
        this.camera = new THREE.PerspectiveCamera(25, 1, 0.1, 1000);
        this.camera.position.set(0, 2, -4);
        this.initialCameraPosition = this.camera.position.clone();

        // Renderer
        this.renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: 'high-performance', alpha: true});
        this.renderer.setClearColor('#000000', 0)

        this.initialSize = this.getContainerSize();
        this.renderer.setSize(this.initialSize.width, this.initialSize.height);

        if (this.container) {
            this.container.appendChild(this.renderer.domElement);
            this.camera.aspect = this.initialSize.width / this.initialSize.height;
        } else {
            document.body.appendChild(this.renderer.domElement);
            this.camera.aspect = this.initialSize.width / this.initialSize.height;
        }
        this.camera.updateProjectionMatrix();
        this.renderer.domElement.style.touchAction = 'none';
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.maxTextureAnisotropy = this.renderer.capabilities.getMaxAnisotropy();

        // Controls — smooth rotation like Playdate
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;  // Slightly stronger inertia keeps movement deliberate
        this.controls.rotateSpeed = 0.36;    // Slightly slower manual orbit

        // Keep the interaction object-centric: orbit only, with a tightly bounded zoom.
        this.controls.enablePan = false;
        const fixedDistance = this.camera.position.length();
        this.controls.enableZoom = false;
        this.controls.minDistance = fixedDistance * 0.74;
        this.controls.maxDistance = fixedDistance * 1.26;

        // Keep the cube upright while leaving every face reachable.
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI;

        // Autorotation settings (integrated with OrbitControls)
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5  // Slightly slower idle rotation
        this.autoRotateStoppedByUser = false;

        this.renderer.domElement.addEventListener('touchmove', this.captureViewerGesture, {passive: false});
        this.renderer.domElement.addEventListener('gesturestart', this.captureViewerGesture, {passive: false});
        this.renderer.domElement.addEventListener('gesturechange', this.captureViewerGesture, {passive: false});
        this.controls.addEventListener('start', this.stopAutoRotate);

        // Lighting
        this.ambientLight = new THREE.AmbientLight(0xffffff);
        this.directionalLight = new THREE.DirectionalLight(0xffffff);
        this.directionalLight.position.set(5, 5, 5);
        this.scene.add(this.ambientLight, this.directionalLight);

        // Main cube
        this.cubeGeometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.1);
        this.cubeMaterial = new THREE.MeshStandardMaterial({color: 0xF5F5F5});
        this.cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);

        // Keycube group
        this.keycubeGroup = new THREE.Group();
        this.keycubeGroup.add(this.cube);

        // Key configuration
        this.keySize = 0.15;
        this.keyGeometry = new THREE.BoxGeometry(this.keySize, this.keySize, this.keySize);
        this.spacing = 0.20;
        this.offset = 0.5;

        // Create keys
        this.faces.forEach((face) => {
            const {axis, sign, prefix, color} = face;
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const key = new THREE.Mesh(this.keyGeometry, new THREE.MeshStandardMaterial({color}));
                    const keyIndex = row * 4 + col + 1;
                    const keyID = `${prefix}${keyIndex}`;

                    key.userData = {
                        id: keyID,
                        face: prefix,
                        index: keyIndex,
                        originalColor: color,
                        axis,
                        sign,
                        gridRow: row,
                        gridCol: col
                    };
                    key.name = keyID;

                    const pos = this.getLabelPosition(face, row, col, 0);
                    key.position.set(pos.x, pos.y, pos.z);
                    key.userData.originalPosition = key.position.clone();
                    this.keycubeGroup.add(key);

                    // Add text label
                    const label = this.createTextLabel(keyID, axis, sign);
                    label.userData.parentKeyId = keyID;
                    const labelPos = this.getLabelPosition(face, row, col, 0.078);
                    label.position.set(labelPos.x, labelPos.y, labelPos.z);
                    label.userData.originalPosition = label.position.clone();
                    this.keycubeGroup.add(label);

                    // Add score label (hidden by default)
                    const scoreLabel = this.createScoreLabel(axis, sign);
                    scoreLabel.userData.parentKeyId = keyID;
                    const scorePos = this.getLabelPosition(face, row, col, 0.079);
                    scoreLabel.position.set(scorePos.x, scorePos.y, scorePos.z);
                    scoreLabel.userData.originalPosition = scoreLabel.position.clone();
                    this.keycubeGroup.add(scoreLabel);
                    this.scoreLabels[keyID] = scoreLabel;
                }
            }
        });

        // ─── Diagonal holding position (Figure 4, left photo) ───
        this.keycubeGroup.rotation.y = -Math.PI * 3 / 4;  // -135° to show G and W faces
        this.DIAGONAL_ROTATION = -Math.PI * 3 / 4;

        // ─── Auto-rotation control ───
        ['pointerdown', 'touchstart'].forEach(evt =>
            this.renderer.domElement.addEventListener(evt, this.stopAutoRotate)
        );

        this.scene.add(this.keycubeGroup);

        this.fitCameraToObject(this.keycubeGroup, this.camera, this.controls);

        window.addEventListener('resize', this.handleResize);
        window.addEventListener('orientationchange', () => setTimeout(this.handleResize, 100));

        if (this.container && window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => this.handleResize());
            resizeObserver.observe(this.container);
        }

        // Animation loop
        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    };

    // getting container's dimensions, then format them to square dimension (w = h)
    getContainerSize() {
        if (this.container) {
            const width = Math.max(1, this.container.clientWidth);
            const height = Math.max(1, this.container.clientHeight);
            const size = Math.min(width, height);
            return {
                width: size,
                height: size
            };
        }
        const width = Math.max(1, window.innerWidth);
        const height = Math.max(1, window.innerHeight);
        const size = Math.min(width, height);
        return {
            width: size,
            height: size
        };
    }

    stopAutoRotate = () => {
        this.autoRotateStoppedByUser = true;
        this.controls.autoRotate = false;
    }

    captureViewerGesture = (event) => {
        event.preventDefault();
        this.stopAutoRotate();
    }

    // Orient a plane to face outward from a surface
    orientPlane(mesh, axis, sign) {
        if (axis === 'y') mesh.rotation.x = sign > 0 ? -Math.PI / 2 : Math.PI / 2;
        else if (axis === 'x') mesh.rotation.y = sign > 0 ? Math.PI / 2 : -Math.PI / 2;
        else if (sign < 0) mesh.rotation.y = Math.PI;
    }

    // Create a label plane with canvas texture
    createLabelPlane(size, canvasSize, axis, sign) {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = canvasSize;
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = Math.min(8, this.maxTextureAnisotropy);
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(size, size),
            new THREE.MeshBasicMaterial({map: texture, transparent: true, depthTest: true, depthWrite: false})
        );
        this.orientPlane(mesh, axis, sign);
        return {mesh, canvas, texture};
    }

    // Create text label as a small plane decal stuck on the key surface
    createTextLabel(text, axis, sign) {
        const {mesh, canvas, texture} = this.createLabelPlane(0.13, 256, axis, sign);
        const ctx = canvas.getContext('2d');
        ctx.font = 'bold 112px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        ctx.lineWidth = 16;
        ctx.strokeText(text, 128, 128);
        ctx.fillStyle = 'white';
        ctx.fillText(text, 128, 128);
        texture.needsUpdate = true;
        mesh.userData = {isLabel: true};
        return mesh;
    }

    // Create dynamic score label (initially hidden)
    createScoreLabel(axis, sign) {
        const {mesh, canvas, texture} = this.createLabelPlane(0.14, 256, axis, sign);
        mesh.userData = {isScoreLabel: true, canvas, texture, lastScore: null};
        mesh.visible = false;
        return mesh;
    }

    // Update score label text - shows both key ID and score
    updateScoreLabelText(mesh, score, keyID) {
        if (mesh.userData.lastScore === score) {
            mesh.visible = true;
            return;
        }

        const {canvas, texture} = mesh.userData;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 256, 256);

        ctx.font = 'bold 56px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 6;
        ctx.strokeText(keyID, 128, 75);
        ctx.fillStyle = '#FFFF00';
        ctx.fillText(keyID, 128, 75);

        // Draw score
        const scoreText = this.currentScoreFormat === 'ratio'
            ? (score === 1 ? '1' : String(score).replace(/^0/, ''))
            : String(Math.round(score));
        const fontSize = this.currentScoreFormat === 'ratio'
            ? 356
            : (this.isReachabilityMode && score >= 100 ? 71 : 100);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.lineWidth = 7;
        ctx.strokeText(scoreText, 128, 175);
        ctx.fillStyle = 'white';
        ctx.fillText(scoreText, 128, 175);

        texture.needsUpdate = true;
        mesh.userData.lastScore = score;
        mesh.visible = true;
    }

    // Helper to calculate label position
    getGridValue(index, sign) {
        return (index - 1.5) * this.spacing * sign;
    }

    getLabelPosition(face, row, col, lift) {
        const pos = {x: 0, y: 0, z: 0};
        pos[face.axis] = (this.offset + lift) * face.sign;
        pos[face.colAxis] = this.getGridValue(col, face.colSign);
        pos[face.rowAxis] = this.getGridValue(row, face.rowSign);
        return pos;
    }

    computeBoundingSphere(object) {
        // Force update des matrices et calcul de la bounding box
        const bbox = new THREE.Box3().setFromObject(object);
        const sphere = new THREE.Sphere();
        bbox.getBoundingSphere(sphere);
        return sphere;
    }

    /**
     * Fit the perspective camera so the given object fits in view.
     * - camera: THREE.PerspectiveCamera
     * - controls: OrbitControls (optional) to update target and distances
     * - object: THREE.Object3D to fit
     * - options: { margin: 1.0, offset: 0.736, preserveDirection: true }
     **/
    fitCameraToObject(object, camera, controls, options = {}) {
        const {margin = 1.0, offset = 0.736, preserveDirection = true} = options;
        const sphere = this.computeBoundingSphere(object);
        if (!sphere || sphere.radius === 0) return;

        // aspect and fov half-angle
        const aspect = this.renderer.domElement.clientWidth / Math.max(1, this.renderer.domElement.clientHeight);
        const fov = (camera.fov * Math.PI) / 180;
        const halfFov = fov / 2;

        // distances needed to fit sphere vertically/horizontally
        const distanceV = sphere.radius / Math.tan(halfFov);
        const distanceH = sphere.radius / Math.tan(halfFov) / aspect;
        const distance = Math.max(distanceV, distanceH) * margin;

        // if distance = last distance, don't recompute
        if (this.lastComputedDistance !== null && Math.abs(distance - this.lastComputedDistance) < 0.001) {
            return;
        }
        this.lastComputedDistance = distance;

        // Decide the direction from target to camera.
        // Prefer preserving current camera direction relative to target so rotation is preserved.
        let dir = new THREE.Vector3(0, 0, 1);
        if (preserveDirection) {
            dir.copy(camera.position).sub(controls?.target || new THREE.Vector3(0, 0, 0));
            if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
        }

        dir.normalize();

        // New camera position = center + dir * distance * offsetFactor
        const newPos = new THREE.Vector3().copy(sphere.center).add(dir.multiplyScalar(distance * offset));

        // Update camera and controls
        camera.position.copy(newPos);
        camera.near = Math.max(0.01, distance * 0.001); // small near plane but relative to distance
        camera.far = Math.max(camera.far, distance * 10); // extend far if needed
        camera.updateProjectionMatrix();

        // Force camera to look at object's bounding sphere center (assure centrage visuel)
        camera.lookAt(sphere.center);

        if (controls) {
            controls.target.copy(sphere.center);
            // Update sensible min/max distances relative to computed distance
            controls.minDistance = Math.max(0.01, distance * 0.4);
            controls.maxDistance = Math.max(distance * 1.8, controls.minDistance + 0.1);
            controls.update();
        }

        this.initialCameraPosition = camera.position.clone();
    }

    // Window resize handler
    handleResize = () => {
        const size = this.getContainerSize();
        const w = size.width;
        const h = size.height;

        if (w === 0 || h === 0) return; // Ignored if hidden

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.maxPixelRatio));
        this.renderer.setSize(w, h);

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.fitCameraToObject(this.keycubeGroup, this.camera, this.controls);
    }

    // Update model function
    updateModel(data) {
        console.log('Updating model with data:', data);

        if (data.handedness) {
            this.keycubeGroup.scale.x = data.handedness === 'left' ? -1 : 1;
        }

        if (data.reset) {
            // Reset all colors and positions to original
            this.keycubeGroup.children.forEach(child => {
                if (child.userData?.originalColor) {
                    child.material.color.set(child.userData.originalColor);
                    child.material.emissive?.set(0x000000);
                    child.material.map = null;
                    child.material.needsUpdate = true;
                    child.scale.set(1, 1, 1);
                    if (child.userData.originalPosition) {
                        child.position.copy(child.userData.originalPosition);
                    }
                } else if (child.userData?.isLabel) {
                    child.visible = true; // Show text labels on reset
                    if (child.userData.originalPosition) {
                        child.position.copy(child.userData.originalPosition);
                    }
                } else if (child.userData?.isScoreLabel) {
                    child.visible = false; // Hide score labels on reset
                }
            });
            // Reset cube scale
            this.keycubeGroup.scale.setScalar(1);
            this.keycubeGroup.scale.x = 1;
            // Preserve diagonal holding rotation (never reset it)
            this.keycubeGroup.rotation.set(0, this.DIAGONAL_ROTATION, 0);
            return;
        }

        // Show/hide score labels
        if (data.showScores !== undefined) {
            Object.values(this.scoreLabels).forEach(l => l.visible = data.showScores);
            this.keycubeGroup.children.forEach(c => {
                if (c.userData?.isLabel) c.visible = !data.showScores;
            });
        }

        if (data.isReachability !== undefined) this.isReachabilityMode = data.isReachability;
        if (data.scoreFormat !== undefined) this.currentScoreFormat = data.scoreFormat;

        // Update score values
        if (data.scores) {
            ['R', 'B', 'G', 'W', 'Y'].forEach(face => {
                data.scores[face]?.forEach((score, idx) => {
                    const label = this.scoreLabels[`${face}${idx + 1}`];
                    if (label) this.updateScoreLabelText(label, score, `${face}${idx + 1}`);
                });
            });
        }

        // Hide scores and restore text labels
        if (data.hideScores) {
            Object.values(this.scoreLabels).forEach(l => l.visible = false);
            this.keycubeGroup.children.forEach(c => {
                if (c.userData?.isLabel) c.visible = true;
            });
        }

        if (data.wireframe !== undefined) {
            this.scene.traverse(c => {
                if (c.isMesh && !c.userData?.isLabel) c.material.wireframe = data.wireframe;
            });
        }

        if (data.resetView) {
            this.camera.position.copy(this.initialCameraPosition);
            this.autoRotateStoppedByUser = false;
            this.controls.autoRotate = true;
            this.fitCameraToObject(this.keycubeGroup, this.camera, this.controls);
        }

        if (data.lightingIntensity !== undefined) this.directionalLight.intensity = data.lightingIntensity;

        // Heatmap color: invert=true → low=green (preference), invert=false → high=green (reachability)
        const heatmapColor = (norm, invert) => new THREE.Color().setHSL((invert ? 1 - norm : norm) * 0.33, 1, 0.5);

        // Apply heatmap to keys
        const applyHeatmap = (heatmapData, min, max, invert, dimOthers) => {
            const range = max - min || 1;
            this.keycubeGroup.children.forEach(child => {
                if (!child.userData?.face || !child.userData?.index) return;
                child.scale.set(1, 1, 1);
                if (heatmapData[child.userData.face]) {
                    const val = heatmapData[child.userData.face][child.userData.index - 1];
                    child.material.color.set(heatmapColor(Math.max(0, Math.min(1, (val - min) / range)), invert));
                } else if (dimOthers) {
                    child.material.color.set(new THREE.Color(child.userData.originalColor).multiplyScalar(0.3));
                } else if (child.userData.originalColor) {
                    child.material.color.set(child.userData.originalColor);
                }
            });
        };

        if (data.heatmap) {
            applyHeatmap(data.heatmap, data.heatmapMin ?? 0, data.heatmapMax ?? 1, !!data.heatmapInvert, false);
        }
        if (data.heatmapSingleFace) {
            applyHeatmap(data.heatmapSingleFace, data.heatmapMin ?? 0, data.heatmapMax ?? 1, !!data.heatmapInvert, true);
        }

        if (data.figure6View) {
            this.controls.autoRotate = !this.autoRotateStoppedByUser;
        } else if (data.figure6View === false) {
            this.controls.autoRotate = !this.autoRotateStoppedByUser;
        }

        this.fitCameraToObject(this.keycubeGroup, this.camera, this.controls);
    };
}