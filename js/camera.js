class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 150 // 擴大滑鼠影響範圍
        };
        
        // 設定畫布大小
        this.canvas.width = 1280;
        this.canvas.height = 720;
        
        // 初始化粒子
        this.initParticles();
        
        // 綁定滑鼠事件
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        
        // 初始化文字動畫系統
        this.textAnimation = new TextAnimation(this.canvas);
        
        // 開始動畫
        this.lastTime = 0;
        this.animate();
        
        // 設置定時器，每15秒更新一次年份
        setInterval(() => {
            this.textAnimation.nextYear();
        }, 15000);
    }

    initParticles() {
        // 將粒子數量設置為8000個
        for (let i = 0; i < 8000; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                color: this.getInitialColor(), // 使用藍色系顏色
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                shape: Math.floor(Math.random() * 2),
                originalSpeedX: (Math.random() - 0.5) * 0.3,
                originalSpeedY: (Math.random() - 0.5) * 0.3,
                originalSize: Math.random() * 2 + 1
            });
        }
    }

    getInitialColor() {
        const colors = [
            'rgba(0, 0, 255, 0.5)', // 藍色
            'rgba(0, 102, 204, 0.5)', // 深藍色
            'rgba(51, 153, 255, 0.4)', // 淺藍色
            'rgba(0, 204, 255, 0.4)', // 天藍色
            'rgba(0, 51, 102, 0.4)' // 深海藍
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getHoverColor() {
        const colors = [
            'rgba(255, 0, 0, 0.5)', // 紅色
            'rgba(255, 192, 203, 0.5)', // 粉紅色
            'rgba(255, 255, 0, 0.4)', // 黃色
            'rgba(255, 255, 224, 0.4)' // 淡黃色
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;

        // 檢查滑鼠是否在粒子範圍內
        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.mouse.radius) { // 使用擴大的範圍
                particle.color = this.getHoverColor(); // 隨機變成紅色、粉紅色、黃色或淡黃色
            } else {
                particle.color = this.getInitialColor(); // 恢復為藍色系顏色
            }
        });
    }

    handleMouseLeave() {
        this.mouse.x = null;
        this.mouse.y = null;
        // 當滑鼠離開時，恢復所有粒子的顏色
        this.particles.forEach(particle => {
            particle.color = this.getInitialColor();
        });
    }

    animate(currentTime) {
        // 使用 requestAnimationFrame 的時間戳來控制更新頻率
        if (currentTime - this.lastTime < 32) { // 降低到約30fps
            requestAnimationFrame((time) => this.animate(time));
            return;
        }
        this.lastTime = currentTime;

        // 清除畫布
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 獲取文字圓形範圍
        const textCircle = this.textAnimation.getTextCircle();
        
        // 更新和繪製粒子
        this.particles.forEach(particle => {
            // 計算粒子到滑鼠的距離
            let dx = 0;
            let dy = 0;
            let distance = 0;
            let force = 0;
            
            // 計算粒子到文字圓心的距離
            const dxToText = particle.x - textCircle.x;
            const dyToText = particle.y - textCircle.y;
            const distanceToText = Math.sqrt(dxToText * dxToText + dyToText * dyToText);
            
            // 計算環繞力
            let orbitForce = 0;
            if (distanceToText < textCircle.radius * 1.5) {
                orbitForce = (textCircle.radius * 1.5 - distanceToText) / (textCircle.radius * 1.5);
                const angle = Math.atan2(dyToText, dxToText);
                const orbitSpeed = 0.3; // 進一步降低環繞速度
                particle.speedX += Math.cos(angle + Math.PI/2) * orbitForce * orbitSpeed;
                particle.speedY += Math.sin(angle + Math.PI/2) * orbitForce * orbitSpeed;
            }
            
            if (this.mouse.x != null && this.mouse.y != null) {
                dx = this.mouse.x - particle.x;
                dy = this.mouse.y - particle.y;
                distance = Math.sqrt(dx * dx + dy * dy);
                
                // 計算影響力
                if (distance < this.mouse.radius) {
                    force = (this.mouse.radius - distance) / this.mouse.radius;
                    
                    // 根據距離調整粒子行為
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * 1.2; // 進一步降低推動力
                    const pushY = Math.sin(angle) * force * 1.2;
                    
                    // 更新粒子速度和位置
                    particle.speedX = particle.originalSpeedX + pushX;
                    particle.speedY = particle.originalSpeedY + pushY;
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    
                    // 根據距離調整大小
                    particle.size = particle.originalSize * (1 + force * 1.2); // 進一步降低大小變化
                    
                    // 根據距離調整旋轉
                    particle.rotation += particle.rotationSpeed * (1 + force * 0.3); // 進一步降低旋轉變化
                } else {
                    // 恢復原始行為
                    particle.speedX = particle.originalSpeedX;
                    particle.speedY = particle.originalSpeedY;
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    particle.size = particle.originalSize;
                    particle.rotation += particle.rotationSpeed;
                }
            } else {
                // 沒有滑鼠互動時的默認行為
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.rotation += particle.rotationSpeed;
            }
            
            // 邊界檢查（環繞效果）
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // 限制粒子速度
            const maxSpeed = 1.2; // 進一步降低最大速度
            const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (currentSpeed > maxSpeed) {
                particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
                particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
            }
            
            this.drawParticle(particle);
        });
        
        // 請求下一幀動畫
        requestAnimationFrame((time) => this.animate(time));
    }

    drawParticle(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        
        // 簡化光暈效果
        this.ctx.shadowColor = particle.color;
        this.ctx.shadowBlur = 3; // 進一步降低光暈模糊度
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // 繪製幾何圖形
        this.ctx.beginPath();
        switch (particle.shape) {
            case 0: // 圓形
                this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                break;
            case 1: // 簡單曲線
                this.ctx.moveTo(-particle.size, 0);
                this.ctx.quadraticCurveTo(0, -particle.size, particle.size, 0);
                break;
        }
        
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        
        // 移除內部光暈效果
        
        this.ctx.restore();
    }
}

// 初始化粒子系統
const particleSystem = new ParticleSystem(); 