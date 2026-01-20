class Particle {
    constructor(x, y, char) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.size = 16;
        this.distance;
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = 0;
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.font = '18px "Times New Roman"';
        ctx.fillText(this.char, this.x, this.y);
    }

    update(mouse) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        //blackhole effect
        const maxDistance = 200;
        const minDistance = 5;
        const gravitationalPull = 2;
        
        if (distance < maxDistance) {
            // Calculate gravitational force
            let force = (1 - distance / maxDistance) * gravitationalPull;
            
            // Add spiral effect
            this.angle += 0.05 * force;
            
            if (distance > minDistance) {
                // Move towards the mouse (black hole center)
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                
                this.x += forceDirectionX * force * this.density;
                this.y += forceDirectionY * force * this.density;
                
                // Add spiral motion
                this.x += Math.cos(this.angle) * force;
                this.y += Math.sin(this.angle) * force;
            } else {
                // Particles very close to the center spiral more dramatically
                this.x += Math.cos(this.angle) * 2;
                this.y += Math.sin(this.angle) * 2;
            }
        } else {
            // Return to original position
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/20;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/20;
            }
        }
    }
}

const text = ` mish mosh mish mosh mish mosh mish mosh mish mosh 
mish mosh mish mosh mish mosh mish mosh mish mosh mish mosh mish 
mish mosh mish mosh mish mosh mish mosh mish mosh mish mosh mish 
mish mosh mish mosh mish mosh mish mosh mish mosh mish mosh mish 
mish mosh mish mosh mish mosh mish mosh mish mosh mish mosh mish 
mosh mish mosh mish mosh mish mosh mish mosh mish mosh mosh mish
mish mosh mish mosh mish mosh mish mosh mish mosh mish mosh mish
mosh mish mosh mish mosh mish mosh mish mosh mish mosh mish mosh

zoll zill zilla zoll zill zilla zoll zill zilla zoll zill zilla 
zoll zill zilla zoll zill zilla zoll zill zilla zoll zill zilla 
zoll zill zilla zoll zill zilla zoll zill zilla zoll zill zilla 
zoll zill zilla zoll zill zilla zoll zill zilla zoll zill zilla  
zoll zill zilla zoll zill zilla zoll zill zilla zoll zill zilla 
zoll zill zilla zoll zill zilla zoll zill zilla zoll zill zilla 
zoll zill zilla zoll zill zilla zoll zill zilla zoll zill zilla 
zoll zill zilla zoll zill zilla zoll zill zilla zoll zill zilla  

mishas moshiz mishad mishum mum uhuh testo test test aaahehhehhhe
random radnom lang bala anay testo testo hahahhahahhahahahahha sige
sige ahwsaxnjsnkasjhcnsn ok sige hi po mga beshh whats up kamo tanan
hey how r u nihonggo wakarimasuka hahahahhaha cirney corney cringe`; ;


let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 100
};

let squareSize = 800;

function drawBlackHoleEffect(ctx, x, y) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 200);
    gradient.addColorStop(0, 'rgba(192, 206, 68, 0.59)');
    gradient.addColorStop(0.5, 'rgba(255, 230, 0, 0.38)');
    gradient.addColorStop(1, 'rgba(255, 208, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 200, 0, Math.PI * 2);
    ctx.fill();
}

function init() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const squareX = canvas.width/2 - squareSize/2;
    const squareY = canvas.height/2 - squareSize/2;

    ctx.textAlign = 'left';
    const textLines = text.split('\n');
    const lineHeight = 32;
    const startY = canvas.height/2 - (textLines.length * lineHeight)/2;

    const charWidth = 11;

    textLines.forEach((line, lineIndex) => {
        const characters = line.split('');
        const lineWidth = characters.length * charWidth;
        const lineX = squareX + (squareSize - lineWidth) / 2;

        characters.forEach((char, i) => {
            const x = lineX + (i * charWidth);
            const y = squareY + (lineIndex * lineHeight) + 40;
            if (x < squareX + squareSize && y < squareY + squareSize) {
                particles.push(new Particle(x, y, char));
            }
        });
    });
}

function animate() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const squareX = canvas.width/2 - squareSize/2;
    const squareY = canvas.height/2 - squareSize/2;
    
    // Draw black hole effect
    if (mouse.x !== null && mouse.y !== null) {
        drawBlackHoleEffect(ctx, mouse.x, mouse.y);
    }

    // Draw the square boundary
    ctx.strokeStyle = 'rgba(241, 226, 12, 0.07)';
    ctx.lineWidth = 2;
    ctx.strokeRect(squareX, squareY, squareSize, squareSize);

    particles.forEach(particle => {
        particle.x = Math.max(squareX, Math.min(squareX + squareSize, particle.x));
        particle.y = Math.max(squareY, Math.min(squareY + squareSize, particle.y));
        
        particle.update(mouse);
        particle.draw(ctx);
    });
    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', () => {
    particles = [];
    init();
});

init();
animate();