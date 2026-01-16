<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Neon Velocity 3D</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <style>
        body { margin: 0; background: #000; overflow: hidden; font-family: sans-serif; }
        canvas { display: block; }
        .ui { position: absolute; top: 0; left: 0; width: 100%; padding: 20px; display: flex; justify-content: space-between; box-sizing: border-box; pointer-events: none; z-index: 10; color: #0ff; }
        .btn-back { pointer-events: auto; background: red; color: white; text-decoration: none; padding: 10px; border-radius: 5px; font-weight: bold; }
        #game-over { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.9); padding: 40px; border: 2px solid red; text-align: center; color: white; z-index: 100; }
        .restart-btn { background: red; color: white; border: none; padding: 10px 20px; cursor: pointer; margin-top: 15px; }
    </style>
</head>
<body>

    <div class="ui">
        <a href="../index.html" class="btn-back">⬅ VOLTAR</a>
        <div style="font-size: 24px;">PONTOS: <span id="score">0</span></div>
    </div>

    <div id="game-over">
        <h1>FIM DE JOGO</h1>
        <p>Pontos: <span id="final-score">0</span></p>
        <button class="restart-btn" onclick="location.reload()">REINICIAR</button>
    </div>

    <script>
        // Verificação se a biblioteca carregou
        window.onload = function() {
            if (typeof THREE === 'undefined') {
                alert("Erro: Biblioteca Three.js não carregou. Verifique sua internet.");
                return;
            }

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            // Luzes
            const light = new THREE.PointLight(0xffffff, 1, 100);
            light.position.set(0, 5, 5);
            scene.add(light);
            scene.add(new THREE.AmbientLight(0x404040));

            // Player
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshLambertMaterial({ color: 0x00ffff, wireframe: true });
            const player = new THREE.Mesh(geometry, material);
            scene.add(player);

            // Grade
            const grid = new THREE.GridHelper(200, 40, 0xff00ff, 0x444444);
            grid.position.y = -1;
            scene.add(grid);

            camera.position.z = 5;
            camera.position.y = 2;
            camera.lookAt(player.position);

            let score = 0;
            let speed = 0.2;
            let isGameOver = false;
            const obstacles = [];

            // Controles
            let moveLeft = false, moveRight = false;
            window.onkeydown = (e) => {
                if(e.key === "ArrowLeft") moveLeft = true;
                if(e.key === "ArrowRight") moveRight = true;
            };
            window.onkeyup = (e) => {
                if(e.key === "ArrowLeft") moveLeft = false;
                if(e.key === "ArrowRight") moveRight = false;
            };

            function createObstacle() {
                if(isGameOver) return;
                const obs = new THREE.Mesh(
                    new THREE.BoxGeometry(0.8, 0.8, 0.8),
                    new THREE.MeshLambertMaterial({ color: 0xff0000 })
                );
                obs.position.z = -30;
                obs.position.x = (Math.random() - 0.5) * 10;
                scene.add(obs);
                obstacles.push(obs);
            }
            setInterval(createObstacle, 1500);

            function animate() {
                if(isGameOver) return;
                requestAnimationFrame(animate);

                if(moveLeft && player.position.x > -5) player.position.x -= 0.15;
                if(moveRight && player.position.x < 5) player.position.x += 0.15;

                grid.position.z += speed;
                if(grid.position.z > 5) grid.position.z = 0;

                obstacles.forEach((obs, i) => {
                    obs.position.z += speed
