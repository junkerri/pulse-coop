import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

export default function ThreeJSCubes() {
  const mountRef = useRef(null);

  useEffect(() => {
    let camera, scene, renderer, timer, mesh;
    const mount = mountRef.current;

    // Responsive cube count based on screen size
    const getCubeAmount = () => {
      if (window.innerWidth < 768) return 50; // Mobile: 50x50 = 2,500 cubes
      if (window.innerWidth < 1024) return 75; // Tablet: 75x75 = 5,625 cubes
      return 100; // Desktop: 100x100 = 10,000 cubes
    };

    let amount = getCubeAmount();
    let count = Math.pow(amount, 2);
    const dummy = new THREE.Object3D();
    const seeds = [];
    const baseColors = [];
    const color = new THREE.Color();
    const colors = [new THREE.Color(0x00ffff), new THREE.Color(0xffff00), new THREE.Color(0xff00ff)];
    const animation = { t: 0 };
    let currentColorIndex = 0;
    let nextColorIndex = 1;
    const maxDistance = 75;
    const cameraTarget = new THREE.Vector3();

    function init() {
      renderer = new THREE.WebGLRenderer({ 
        antialias: window.innerWidth >= 768, // Only use antialiasing on larger screens
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for mobile
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.setAnimationLoop(animate);
      mount.appendChild(renderer.domElement);

      // Responsive camera positioning
      const isMobile = window.innerWidth < 768;
      const cameraDistance = isMobile ? 15 : 10;
      const cameraHeight = isMobile ? 12 : 10;
      
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(cameraDistance, cameraHeight, cameraDistance);
      camera.lookAt(0, 0, 0);

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xadd8e6);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

      timer = new THREE.Timer();
      timer.connect(document);

      // Create texture pattern
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(0, 0, 64, 4);
      ctx.fillRect(0, 60, 64, 4);
      ctx.fillRect(0, 0, 4, 64);
      ctx.fillRect(60, 0, 4, 64);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshStandardMaterial({ map: texture });

      mesh = new THREE.InstancedMesh(geometry, material, count);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(mesh);

      let i = 0;
      const offset = (amount - 1) / 2;

      for (let x = 0; x < amount; x++) {
        for (let z = 0; z < amount; z++) {
          dummy.position.set(offset - x, 0, offset - z);
          dummy.scale.set(1, 2, 1);
          dummy.updateMatrix();

          color.setHSL(1, 0.5 + (Math.random() * 0.5), 0.5 + (Math.random() * 0.5));
          baseColors.push(color.getHex());

          mesh.setMatrixAt(i, dummy.matrix);
          mesh.setColorAt(i, color.multiply(colors[0]));
          i++;
          seeds.push(Math.random());
        }
      }

      window.addEventListener('resize', onWindowResize);
      setInterval(startTween, 3000);
    }

    function startTween() {
      new TWEEN.Tween(animation)
        .to({ t: 1 }, 2000)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onComplete(() => {
          animation.t = 0;
          currentColorIndex = nextColorIndex;
          nextColorIndex++;
          if (nextColorIndex >= colors.length) nextColorIndex = 0;
        })
        .start();
    }

    function onWindowResize() {
      // Recalculate cube count for new screen size
      const newAmount = getCubeAmount();
      if (newAmount !== amount) {
        // Recreate scene with new cube count
        amount = newAmount;
        count = Math.pow(amount, 2);
        
        // Remove old mesh
        if (mesh) {
          scene.remove(mesh);
          mesh.dispose();
        }
        
        // Clear old arrays
        seeds.length = 0;
        baseColors.length = 0;
        
        // Create new mesh
        mesh = new THREE.InstancedMesh(geometry, material, count);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(mesh);
        
        // Repopulate with new cube count
        let i = 0;
        const offset = (amount - 1) / 2;
        
        for (let x = 0; x < amount; x++) {
          for (let z = 0; z < amount; z++) {
            dummy.position.set(offset - x, 0, offset - z);
            dummy.scale.set(1, 2, 1);
            dummy.updateMatrix();

            color.setHSL(1, 0.5 + (Math.random() * 0.5), 0.5 + (Math.random() * 0.5));
            baseColors.push(color.getHex());

            mesh.setMatrixAt(i, dummy.matrix);
            mesh.setColorAt(i, color.multiply(colors[0]));
            i++;
            seeds.push(Math.random());
          }
        }
      }
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Update camera positioning for new screen size
      const isMobile = window.innerWidth < 768;
      const cameraDistance = isMobile ? 15 : 10;
      const cameraHeight = isMobile ? 12 : 10;
      camera.position.set(cameraDistance, cameraHeight, cameraDistance);
    }

    function animate() {
      timer.update();
      const time = timer.getElapsed();
      TWEEN.update();

      // Responsive camera animation
      const isMobile = window.innerWidth < 768;
      const baseDistance = isMobile ? 15 : 10;
      const baseHeight = isMobile ? 12 : 10;
      const animationSpeed = isMobile ? 6 : 4; // Slower animation on mobile for better performance
      
      camera.position.x = Math.sin(time / animationSpeed) * baseDistance;
      camera.position.z = Math.cos(time / animationSpeed) * baseDistance;
      camera.position.y = baseHeight + Math.cos(time / 2) * 2;

      cameraTarget.x = Math.sin(time / animationSpeed) * -8;
      cameraTarget.z = Math.cos(time / 2) * -8;
      camera.lookAt(cameraTarget);
      camera.up.x = Math.sin(time / 400);

      for (let i = 0; i < mesh.count; i++) {
        mesh.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

        dummy.position.y = Math.abs(Math.sin((time + seeds[i]) * 2 + seeds[i]));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        if (animation.t > 0) {
          const currentColor = colors[currentColorIndex];
          const nextColor = colors[nextColorIndex];
          const f = dummy.position.length() / maxDistance;

          if (f <= animation.t) {
            color.set(baseColors[i]).multiply(nextColor);
          } else {
            color.set(baseColors[i]).multiply(currentColor);
          }
          mesh.setColorAt(i, color);
        }
      }

      mesh.instanceMatrix.needsUpdate = true;
      if (animation.t > 0) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
      renderer.render(scene, camera);
    }

    init();

    return () => {
      if (mount && renderer) {
        mount.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div>
      <div ref={mountRef} />
    </div>
  );
}