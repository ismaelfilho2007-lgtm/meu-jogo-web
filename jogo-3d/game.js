import * as THREE from 'three';

// 1. Configurações Iniciais
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Elementos do Jogo
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
const player = new THREE.Mesh(geometry, material);
scene.add(player);

const grid = new THREE.GridHelper(200, 40, 0xff00ff, 0x444444);
grid.position.y = -1;
scene.add(grid);

camera.position.z = 5;
camera.position.y = 2;
camera.lookAt(player.position);

// 3. Obstáculos
const obstacles = [];
function createObstacle() {
    const obsGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const obsMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const obs = new THREE.Mesh(obsGeo, obsMat);
    obs.position.z = -20;
    obs.position.x = (Math.random() - 0.5) * 10;
    scene.add(obs);
    obstacles.push(obs);
}

// Criar um obstáculo a cada 2 segundos
setInterval(createObstacle, 2000);

// 4. Controles
let moveLeft = false;
let moveRight = false;

document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") moveLeft = true;
    if (e.key === "ArrowRight") moveRight = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === "ArrowLeft") moveLeft = false;
    if (e.key === "ArrowRight") moveRight = false;
});

// 5. Loop de Animação e Lógica
let score = 0;
function animate() {
    requestAnimationFrame(animate);

    // Movimentação Jogador
    if (moveLeft && player.position.x > -5) player.position.x -= 0.15;
    if (moveRight && player.position.x < 5) player.position.x += 0.15;

    // Movimentação da Grade (Efeito de Velocidade)
    grid.position.z += 0.2;
    if (grid.position.z > 5) grid.position.z = 0;

    // Lógica dos Obstáculos
    obstacles.forEach((obs, index) => {
        obs.position.z += 0.2;

        // Colisão simples (Caixa de colisão)
        if (Math.abs(obs.position.z - player.position.z) < 0.8 && 
            Math.abs(obs.position.x - player.position.x) < 0.8) {
            alert("GAME OVER! Pontos: " + Math.floor(score));
            location.reload(); // Reinicia o jogo
        }

        // Remover obstáculos que passaram
        if (obs.position.z > 5) {
            scene.remove(obs);
            obstacles.splice(index, 1);
            score += 10;
            document.getElementById('score').innerText = score;
        }
    });

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
