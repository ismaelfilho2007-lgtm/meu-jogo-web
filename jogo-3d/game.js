import * as THREE from 'three';

// --- CONFIGURAÇÃO DA CENA ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- PLAYER (CUBO NEON) ---
const player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true })
);
scene.add(player);

// --- CHÃO (GRADE) ---
const grid = new THREE.GridHelper(200, 40, 0xff00ff, 0x444444);
grid.position.y = -1;
scene.add(grid);

camera.position.z = 5; 
camera.position.y = 2;
camera.lookAt(player.position);

// --- VARIÁVEIS DE ESTADO ---
let moveLeft = false, moveRight = false, isGameOver = false, score = 0;
const obstacles = [];

// --- FUNÇÃO DE CRIAR OBSTÁCULOS ---
function createObstacle() {
    if (isGameOver) return;
    const obs = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    obs.position.z = -30;
    obs.position.x = (Math.random() - 0.5) * 10;
    scene.add(obs);
    obstacles.push(obs);
}
setInterval(createObstacle, 1500);

// --- CONTROLES ---
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") moveLeft = true;
    if (e.key === "ArrowRight") moveRight = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key === "ArrowLeft") moveLeft = false;
    if (e.key === "ArrowRight") moveRight = false;
});

// --- LOOP PRINCIPAL ---
function animate() {
    if (isGameOver) return; // Trava o jogo imediatamente ao bater
    requestAnimationFrame(animate);

    // Movimento do Jogador
    if (moveLeft && player.position.x > -5) player.position.x -= 0.15;
    if (moveRight && player.position.x < 5) player.position.x += 0.15;

    // Movimento da Grade
    grid.position.z += 0.2;
    if (grid.position.z > 5) grid.position.z = 0;

    // Lógica dos Obstáculos
    obstacles.forEach((obs, index) => {
        obs.position.z += 0.
