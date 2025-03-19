class TextAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.currentYear = 2011;
        this.textOpacity = 1;
        this.textScale = 0.9;
        this.textRadius = 100;
        this.glowIntensity = 0;
        this.glowDirection = 0.1;
        this.co2Data = {
            2011: "33.2 Gt",
            2012: "34.0 Gt",
            2013: "34.5 Gt",
            2014: "35.0 Gt",
            2015: "36.0 Gt",
            2016: "36.5 Gt",
            2017: "37.0 Gt",
            2018: "37.5 Gt",
            2019: "38.0 Gt",
            2020: "34.0 Gt",
            2021: "36.0 Gt",
            2022: "37.0 Gt",
            2023: "38.0 Gt",
            2024: "39.0 Gt"
        };
        this.startAnimation();

        // 觸控事件
        canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            // 在這裡處理觸控事件，例如更新年份或二氧化碳數據
            this.currentYear = (this.currentYear < 2024) ? this.currentYear + 1 : 2011; // 示例：點擊時增加年份
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // 防止滾動
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            // 在這裡處理觸控移動事件
        });
    }

    drawTextWithEffects(text, x, y) {
        // 繪製外光暈
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        const gradient = this.ctx.createRadialGradient(
            x, y, 0,
            x, y, 200
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0.2)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillText(text, x, y);
        this.ctx.restore();

        // 繪製主文字
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;

        // 使用漸變顏色
        const textGradient = this.ctx.createLinearGradient(x - 50, y - 50, x + 50, y + 50);
        textGradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        textGradient.addColorStop(1, 'rgba(255, 255, 0, 1)');
        this.ctx.fillStyle = textGradient;

        this.ctx.font = `${this.textScale * 60}px Arial`; // 調整字體大小
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    animate(currentTime) {
        // 使用 requestAnimationFrame 的時間戳來控制更新頻率
        if (currentTime - this.lastTime < 66) { // 降低到約15fps
            requestAnimationFrame((time) => this.animate(time));
            return;
        }
        this.lastTime = currentTime;

        // 清除畫布
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 繪製年份和二氧化碳排放量
        const xPosition = this.canvas.width * 0.2; // 20% 的位置
        const yPosition = this.canvas.height / 2; // 垂直居中
        this.drawTextWithEffects(`${this.currentYear}年`, xPosition, yPosition);
        const co2Emission = this.co2Data[this.currentYear] || "數據不可用";
        this.drawTextWithEffects(`二氧化碳排放量: ${co2Emission}`, xPosition, yPosition + 50); // 向下移動50像素

        // 請求下一幀動畫
        requestAnimationFrame((time) => this.animate(time));
    }
}

// 調整畫布大小
function resizeCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// 在窗口大小改變時調用
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // 初始調用

// 初始化文字動畫系統
const canvas = document.getElementById('canvas');
const textAnimation = new TextAnimation(canvas); 