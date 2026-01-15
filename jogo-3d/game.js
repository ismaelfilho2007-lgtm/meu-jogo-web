// 5. Loop de Animação e Lógica
let score = 0;
let gameOver = false; // Variável de controle para evitar alertas infinitos

function animate() {
    if (gameOver) return; // Para a animação se o jogo acabou

    requestAnimationFrame(animate);

    // Movimentação Jogador
    if (moveLeft && player.position.x > -5) player.position.x -= 0.15;
    if (moveRight && player.position.x < 5) player.position.x += 0.15;

    // Movimentação da Grade
    grid.position.z += 0.2;
    if (grid.position.z > 5) grid.position.z = 0;

    obstacles.forEach((obs, index) => {
        obs.position.z += 0.2;

        // --- CORREÇÃO DA COLISÃO ---
        if (Math.abs(obs.position.z - player.position.z) < 0.7 && 
            Math.abs(obs.position.x - player.position.x) < 0.7) {
            
            gameOver = true; // Impede que o loop continue rodando
            
            // Pequeno atraso para garantir que o navegador processe o reinício
            setTimeout(() => {
                alert("GAME OVER! Pontos: " + Math.floor(score));
                location.reload(); 
            }, 10);
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
