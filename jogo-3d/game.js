import * as THREE from 'three';

// --- CONFIGURAÇÃO DA CENA ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- VARIÁVEIS DE JOGO (Com Dificuldade Progressiva) ---
let moveLeft = false, moveRight = false, isGameOver = false, score = 0;
let gameSpeed = 0.25; // Velocidade inicial
const obstacles = [];
let animationId;

// --- ELEMENTOS VISUAIS ---
const player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true })
);
scene.add(player);

const grid = new THREE.GridHelper(200, 40, 0xff00ff, 0x444444);
grid.position.y = -1;
scene.add(grid);

camera.position.set(0, 2, 5);
camera.lookAt(player.position);

// --- FUNÇÃO DE OBSTÁCULOS ---
function createObstacle() {
    if (isGameOver) return;
    const obs = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    obs.position.z = -40;
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
    if (isGameOver) return;
    animationId = requestAnimationFrame(animate);

    // Movimentação suave
    if (moveLeft && player.position.x > -5) player.position.x -= 0.15;
    if (moveRight && player.position.x < 5) player.position.x += 0.15;

    // Movimento do cenário baseado na velocidade atual
    grid.position.z += gameSpeed;
    if (grid.position.z > 5) grid.position.z = 0;

    obstacles.forEach((obs, index) => {
        obs.position.z += gameSpeed;

        // Detecção de Colisão
        if (Math.abs(obs.position.z - player.position.z) < 0.8 && 
            Math.abs(obs.position.x - player.position.x) < 0.8) {
            finalizarJogo();
        }

        // Pontuação e Dificuldade
        if (obs.position.z > 5) {
            scene.remove(obs);
            obstacles.splice(index, 1);
            score += 10;
            
            // Melhoria: Aumenta a velocidade a cada 50 pontos
            if (score % 50 === 0) {
                gameSpeed += 0.05;
            }
            
            const scoreEl = document.getElementById('score');
            if(scoreEl) scoreEl.innerText = score;
        }
    });

    renderer.render(scene, camera);
}

function finalizarJogo() {
    isGameOver = true;
    cancelAnimationFrame(animationId);
    
    const finalScoreEl = document.getElementById('final-score');
    const gameOverScreen = document.getElementById('game-over-screen');
    
    if (finalScoreEl) finalScoreEl.innerText = score;
    if (gameOverScreen) gameOverScreen.style.display = 'block';
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Inicia o loop
animate();
