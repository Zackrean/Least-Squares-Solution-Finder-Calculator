let sharedSphereGeometry = null;
let sharedSphereMaterial = null;

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    const canvas = document.getElementById('threejs-canvas');
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFF9E6);
    
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(12, 10, 12);
    camera.lookAt(0, 0, 0);
    
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    const axesHelper = new THREE.AxesHelper(8);
    scene.add(axesHelper);
    
    const gridHelper = new THREE.GridHelper(20, 20, 0xF0B451, 0xF5DE9D);
    scene.add(gridHelper);
    
    sharedSphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    sharedSphereMaterial = new THREE.MeshPhongMaterial({ color: 0xF08051 });
    
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let theta = Math.atan2(camera.position.x, camera.position.z);
    let phi = Math.acos(camera.position.y / camera.position.length());
    let radius = camera.position.length();
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            theta -= deltaX * 0.005;
            phi -= deltaY * 0.005;
            
            phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));
            
            camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
            camera.position.y = radius * Math.cos(phi);
            camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
            
            camera.lookAt(0, 0, 0);
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });
    
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);
    
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        radius += e.deltaY * 0.05;
        radius = Math.max(5, Math.min(50, radius));
        
        camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
        camera.position.y = radius * Math.cos(phi);
        camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
        
        camera.lookAt(0, 0, 0);
    });
    
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function updateVisualization(points) {
    pointMeshes.forEach(mesh => scene.remove(mesh));
    pointMeshes = [];
    
    points.forEach(point => {
        const sphere = new THREE.Mesh(sharedSphereGeometry, sharedSphereMaterial);
        sphere.position.set(point.x, point.y, 0);
        scene.add(sphere);
        pointMeshes.push(sphere);
    });
}

function visualizeLine(points, m, c) {
    if (lineMesh) {
        scene.remove(lineMesh);
        lineMesh.geometry.dispose(); // Prevent memory leak
    }
    
    const xMin = Math.min(...points.map(p => p.x)) - 2;
    const xMax = Math.max(...points.map(p => p.x)) + 2;
    
    const linePoints = [];
    for (let x = xMin; x <= xMax; x += (xMax - xMin) / 100) {
        const y = m * x + c;
        linePoints.push(new THREE.Vector3(x, y, 0));
    }
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xF0B451, 
        linewidth: 3 
    });
    lineMesh = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(lineMesh);
}