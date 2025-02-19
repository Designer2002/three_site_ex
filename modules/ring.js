import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
scene.background = null;
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 12, 18);
camera.lookAt(0, 0, 0);
export const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 15;

// Create canvas texture with text
function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    // Create gradient background with very light colors
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#c4a7f7');   // Very light purple
    gradient.addColorStop(0.5, '#f7c2ff');  // Very light pink
    gradient.addColorStop(1, '#c7b7e0');    // Very light purple-gray
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Add text with shadow for better visibility
    context.font = 'bold 32px Arial';  // Increased font size
    context.fillStyle = '#ffffff';     // Pure white
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Add shadow to make text more visible
    context.shadowColor = 'rgba(0, 0, 0, 1)';
    context.shadowBlur = 0;
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 2;
    
    // Split text into lines and draw
    const lines = text.split('\n');
    const lineHeight = 60;
    lines.forEach((line, i) => {
        context.fillText(
            line, 
            canvas.width / 2,
            canvas.height / 2 + (i - lines.length/2 + 0.5) * lineHeight
        );
    });

    return new THREE.CanvasTexture(canvas);
}

// Create three separate torus segments
const segments = [];
const colors = ['#8347d6', '#e17ef0', '#56ff77'];  // Lighter colors matching gradient
const texts = ['Добавить Студента', 'Добавить Преподавателя', 'Добавить Курс'];
const segmentAngle = (2 * Math.PI) / 3;

for (let i = 0; i < 3; i++) {
    const geometry = new THREE.TorusGeometry(
        8,    // increased radius from 6 to 8
        1.5,  // increased tube radius from 1.2 to 1.5
        16,   // radial segments
        32,   // tubular segments
        segmentAngle + 0.1
    );
    
    const texture = createTextTexture(texts[i]);
    //texture.center.set(0.5, 0.5);
    
    //texture.rotation = Math.PI; // Rotate texture 180 degrees
    
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 100,
        transparent: true,
        opacity: 1
    });
    
    const segment = new THREE.Mesh(geometry, material);
    
    // Create a container for segment
    const container = new THREE.Object3D();
    container.add(segment);
    
    // Position the segment
    segment.rotation.x = Math.PI / 2;
    
    // Rotate the container to position each segment
    container.rotation.y = i * segmentAngle;
    
    segment.userData = { 
        originalColor: colors[i],
        isHovered: false,
        index: i
    };
    
    segments.push(segment);
    scene.add(container);
}

// Adjust lights for better text visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Add second point light for better text illumination
const pointLight2 = new THREE.PointLight(0xffffff, 1);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

// Adjust scene rotation
scene.rotation.x = -0.2;

// Add hover effect
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(segments);
    
    if (intersects.length > 0) {
        const segment = intersects[0].object;
        switch(segment.userData.index) {
            case 0:
                document.getElementById('addS').click();
                break;
            case 1:
                document.getElementById('addP').click();
                break;
            case 2:
                document.getElementById('addC').click();
                break;
        }
    }
});

export function animate() {
    requestAnimationFrame(animate);
    
    // Update raycaster and handle hover effects
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(segments);
    
    // Reset all segments to original color
    segments.forEach(segment => {
        if (!segment.userData.isHovered) {
            segment.material.color.setStyle(segment.userData.originalColor);
            segment.material.opacity = 0.8;
            segment.material.emissive.setHex(0x000000);
        }
    });
    
    // Highlight hovered segment
    if (intersects.length > 0) {
        const segment = intersects[0].object;
        segment.material.emissive.setHex(0x331177);
        segment.material.opacity = 1;
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
    
    // Add subtle continuous rotation
    scene.rotation.y += 0.01;
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

