class TextAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.emissionsData = {
            2011: 34.7, 2012: 35.1, 2013: 35.7, 2014: 35.9,
            2015: 35.8, 2016: 36.2, 2017: 36.7, 2018: 37.1,
            2019: 36.8, 2020: 34.8, 2021: 36.3, 2022: 36.8,
            2023: 37.2, 2024: 37.5
        };
        this.currentYear = 2011;
        this.isAnimating = false;
        this.textOpacity = 0;
        this.textScale = 0.5;
        this.textRadius = 100;
        this.lastUpdate = 0;
        this.updateInterval = 1000 / 30; // 降低更新頻率到30fps
        this.startAnimation();
    }

    startAnimation() {
        this.isAnimating = true;
        this.animate();
    }

    animate(currentTime) {
        if (!this.isAnimating) return;

        // 控制更新頻率
        if (currentTime - this.lastUpdate < this.updateInterval) {
            requestAnimationFrame((time) => this.animate(time));
            return;
        }
        this.lastUpdate = currentTime;

        // 清除文字區域
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 設置文字樣式
        this.ctx.font = `${60 * this.textScale}px "Microsoft JhengHei", Arial, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // 繪製年份
        const yearText = `${this.currentYear}年`;
        this.drawTextWithEffects(yearText, this.canvas.width / 2, this.canvas.height / 2 - 40);

        // 繪製排放量
        this.ctx.font = `${45 * this.textScale}px "Microsoft JhengHei", Arial, sans-serif`;
        const emissionText = `全球二氧化碳排放量：${this.emissionsData[this.currentYear]} 億噸`;
        this.drawTextWithEffects(emissionText, this.canvas.width / 2, this.canvas.height / 2 + 40);

        // 更新動畫參數
        this.textOpacity += 0.02;
        this.textScale += 0.01;

        if (this.textOpacity >= 1) {
            this.textOpacity = 1;
            this.textScale = 1;
        }

        // 請求下一幀動畫
        requestAnimationFrame((time) => this.animate(time));
    }

    drawTextWithEffects(text, x, y) {
        // 簡化文字效果
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 5;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.textOpacity})`;
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    nextYear() {
        if (this.currentYear < 2024) {
            this.currentYear++;
            this.textOpacity = 0;
            this.textScale = 0.8;
        } else {
            this.currentYear = 2011;
            this.textOpacity = 0;
            this.textScale = 0.8;
        }
    }

    getTextCircle() {
        return {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: this.textRadius
        };
    }
} 