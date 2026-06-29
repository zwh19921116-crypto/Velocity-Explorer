// Velocity Explorer - Physics Calculator

class VelocityExplorer {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.loadPresets();
        this.calculate();
    }

    initializeElements() {
        // Sliders
        this.initialVelocity = document.getElementById('initialVelocity');
        this.angle = document.getElementById('angle');
        this.gravity = document.getElementById('gravity');
        this.height = document.getElementById('height');

        // Number inputs
        this.initialVelocityInput = document.getElementById('initialVelocityInput');
        this.angleInput = document.getElementById('angleInput');
        this.gravityInput = document.getElementById('gravityInput');
        this.heightInput = document.getElementById('heightInput');

        // Display elements
        this.velocityDisplay = document.getElementById('velocityDisplay');
        this.angleDisplay = document.getElementById('angleDisplay');
        this.gravityDisplay = document.getElementById('gravityDisplay');
        this.heightDisplay = document.getElementById('heightDisplay');

        // Result elements
        this.horizontalVelocity = document.getElementById('horizontalVelocity');
        this.verticalVelocity = document.getElementById('verticalVelocity');
        this.maxHeight = document.getElementById('maxHeight');
        this.range = document.getElementById('range');
        this.timeOfFlight = document.getElementById('timeOfFlight');
        this.impactVelocity = document.getElementById('impactVelocity');

        // Canvas
        this.canvas = document.getElementById('trajectoryCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Buttons
        this.resetBtn = document.getElementById('resetBtn');
        this.presetBtns = document.querySelectorAll('.preset-btn');

        // Formulas sidebar controls
        this.formulaToggle = document.getElementById('formulaToggle');
        this.formulaClose = document.getElementById('formulaClose');
        this.formulaSidebar = document.getElementById('formulaSidebar');
        this.formulaOverlay = document.getElementById('formulaOverlay');

        // Preset data
        this.presets = {
            earth: { gravity: 9.8, name: 'Earth' },
            moon: { gravity: 1.62, name: 'Moon' },
            mars: { gravity: 3.7, name: 'Mars' }
        };
    }

    initializeEventListeners() {
        // Slider input handlers
        this.initialVelocity.addEventListener('input', (e) => {
            this.initialVelocityInput.value = e.target.value;
            this.updateDisplay();
            this.calculate();
        });

        this.angle.addEventListener('input', (e) => {
            this.angleInput.value = e.target.value;
            this.updateDisplay();
            this.calculate();
        });

        this.gravity.addEventListener('input', (e) => {
            this.gravityInput.value = e.target.value;
            this.updateDisplay();
            this.calculate();
        });

        this.height.addEventListener('input', (e) => {
            this.heightInput.value = e.target.value;
            this.updateDisplay();
            this.calculate();
        });

        // Number input handlers
        this.initialVelocityInput.addEventListener('input', (e) => {
            const value = Math.max(0, Math.min(50, parseFloat(e.target.value) || 0));
            this.initialVelocity.value = value;
            this.initialVelocityInput.value = value;
            this.updateDisplay();
            this.calculate();
        });

        this.angleInput.addEventListener('input', (e) => {
            const value = Math.max(0, Math.min(90, parseFloat(e.target.value) || 0));
            this.angle.value = value;
            this.angleInput.value = value;
            this.updateDisplay();
            this.calculate();
        });

        this.gravityInput.addEventListener('input', (e) => {
            const value = Math.max(1, Math.min(30, parseFloat(e.target.value) || 1));
            this.gravity.value = value;
            this.gravityInput.value = value;
            this.updateDisplay();
            this.calculate();
        });

        this.heightInput.addEventListener('input', (e) => {
            const value = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
            this.height.value = value;
            this.heightInput.value = value;
            this.updateDisplay();
            this.calculate();
        });

        // Reset button
        this.resetBtn.addEventListener('click', () => this.reset());

        // Preset buttons
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.applyPreset(preset);
            });
        });

        // Formulas sidebar
        if (this.formulaToggle && this.formulaSidebar && this.formulaOverlay) {
            this.formulaToggle.addEventListener('click', () => {
                if (this.formulaSidebar.classList.contains('open')) {
                    this.closeFormulaSidebar();
                    return;
                }
                this.openFormulaSidebar();
            });
        }

        if (this.formulaClose) {
            this.formulaClose.addEventListener('click', () => this.closeFormulaSidebar());
        }

        if (this.formulaOverlay) {
            this.formulaOverlay.addEventListener('click', () => this.closeFormulaSidebar());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeFormulaSidebar();
            }
        });
    }

    openFormulaSidebar() {
        if (!this.formulaSidebar || !this.formulaOverlay || !this.formulaToggle) return;

        this.formulaSidebar.classList.add('open');
        this.formulaSidebar.setAttribute('aria-hidden', 'false');
        this.formulaOverlay.hidden = false;
        this.formulaToggle.setAttribute('aria-expanded', 'true');
        this.formulaToggle.textContent = 'Hide Formulas';
        document.body.style.overflow = 'hidden';
    }

    closeFormulaSidebar() {
        if (!this.formulaSidebar || !this.formulaOverlay || !this.formulaToggle) return;

        this.formulaSidebar.classList.remove('open');
        this.formulaSidebar.setAttribute('aria-hidden', 'true');
        this.formulaOverlay.hidden = true;
        this.formulaToggle.setAttribute('aria-expanded', 'false');
        this.formulaToggle.textContent = 'Open Formulas';
        document.body.style.overflow = '';
    }

    loadPresets() {
        this.presetBtns.forEach(btn => {
            if (btn.dataset.preset === 'earth') {
                btn.classList.add('active');
            }
        });
    }

    updateDisplay() {
        this.velocityDisplay.textContent = `${parseFloat(this.initialVelocity.value).toFixed(1)} m/s`;
        this.angleDisplay.textContent = `${parseFloat(this.angle.value).toFixed(1)}°`;
        this.gravityDisplay.textContent = `${parseFloat(this.gravity.value).toFixed(2)} m/s²`;
        this.heightDisplay.textContent = `${parseFloat(this.height.value).toFixed(1)} m`;
    }

    applyPreset(presetKey) {
        const preset = this.presets[presetKey];
        if (!preset) return;

        this.gravity.value = preset.gravity;
        this.gravityInput.value = preset.gravity;

        // Update active button
        this.presetBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.preset === presetKey) {
                btn.classList.add('active');
            }
        });

        this.updateDisplay();
        this.calculate();
    }

    reset() {
        this.initialVelocity.value = 20;
        this.initialVelocityInput.value = 20;
        this.angle.value = 45;
        this.angleInput.value = 45;
        this.gravity.value = 9.8;
        this.gravityInput.value = 9.8;
        this.height.value = 0;
        this.heightInput.value = 0;

        this.loadPresets();
        this.updateDisplay();
        this.calculate();
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    calculate() {
        const v0 = parseFloat(this.initialVelocity.value);
        const angleRad = this.degreesToRadians(parseFloat(this.angle.value));
        const g = parseFloat(this.gravity.value);
        const h0 = parseFloat(this.height.value);

        // Calculate velocity components
        const vx = v0 * Math.cos(angleRad);
        const vy = v0 * Math.sin(angleRad);

        // Maximum height
        const maxHeightAboveStart = (vy * vy) / (2 * g);
        const maxHeightAboveGround = h0 + maxHeightAboveStart;

        // Total time of flight (solving: -0.5*g*t^2 + vy*t + h0 = 0)
        const discriminant = vy * vy + 2 * g * h0;
        const totalTime = (vy + Math.sqrt(discriminant)) / g;

        // Range (horizontal distance)
        const range = vx * totalTime;

        // Impact velocity
        const vyAtImpact = -Math.sqrt(vy * vy + 2 * g * h0);
        const impactSpeed = Math.sqrt(vx * vx + vyAtImpact * vyAtImpact);

        // Update result displays
        this.horizontalVelocity.textContent = `${vx.toFixed(2)} m/s`;
        this.verticalVelocity.textContent = `${vy.toFixed(2)} m/s`;
        this.maxHeight.textContent = `${maxHeightAboveGround.toFixed(2)} m`;
        this.range.textContent = `${range.toFixed(2)} m`;
        this.timeOfFlight.textContent = `${totalTime.toFixed(2)} s`;
        this.impactVelocity.textContent = `${impactSpeed.toFixed(2)} m/s`;

        // Draw trajectory
        this.drawTrajectory(v0, angleRad, g, h0, vx, vy, totalTime, maxHeightAboveGround);
    }

    drawTrajectory(v0, angleRad, g, h0, vx, vy, totalTime, maxHeight) {
        // Get device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;

        // Set canvas resolution
        this.canvas.width = displayWidth * dpr;
        this.canvas.height = displayHeight * dpr;

        // Scale context to match device pixel ratio without stacking transforms.
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);

        // Clear canvas with white background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, displayWidth, displayHeight);

        // Set up chart margins so axis titles/ticks stay outside the plot area.
        const plotMargin = {
            left: 74,
            right: 36,
            top: 30,
            bottom: 54
        };
        const width = displayWidth - plotMargin.left - plotMargin.right;
        const height = displayHeight - plotMargin.top - plotMargin.bottom;

        // Calculate scales
        const totalRange = vx * totalTime;
        const maxHeightValue = maxHeight + h0 * 0.5;

        const scaleX = width / (totalRange * 1.1 || 1);
        const scaleY = height / (maxHeightValue * 1.1 || 1);

        // Draw grid with axis labels so students can estimate values visually.
        this.drawGrid(plotMargin, width, height, displayWidth, displayHeight, totalRange, maxHeightValue);

        // Draw ground
        this.ctx.strokeStyle = '#92400e';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(plotMargin.left, displayHeight - plotMargin.bottom);
        this.ctx.lineTo(displayWidth - plotMargin.right, displayHeight - plotMargin.bottom);
        this.ctx.stroke();

        // Draw initial position marker
        if (h0 > 0) {
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.beginPath();
            this.ctx.arc(plotMargin.left, displayHeight - plotMargin.bottom - h0 * scaleY, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Label
            this.ctx.fillStyle = '#92400e';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillText('Start', plotMargin.left + 10, displayHeight - plotMargin.bottom - h0 * scaleY);
        }

        // Draw trajectory
        this.ctx.strokeStyle = '#2563eb';
        this.ctx.lineWidth = 3.5;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.beginPath();

        const steps = Math.max(1, Math.ceil(totalTime * 100));
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * totalTime;
            const x = vx * t;
            const y = h0 + vy * t - 0.5 * g * t * t;

            const canvasX = plotMargin.left + x * scaleX;
            const canvasY = displayHeight - plotMargin.bottom - y * scaleY;

            if (i === 0) {
                this.ctx.moveTo(canvasX, canvasY);
            } else {
                this.ctx.lineTo(canvasX, canvasY);
            }
        }
        this.ctx.stroke();

        const launchX = plotMargin.left;
        const launchY = displayHeight - plotMargin.bottom - h0 * scaleY;

        // Draw velocity vector at launch
        // Draw using a fixed pixel length to preserve on-screen launch angle.
        const arrowLength = Math.max(42, Math.min(95, width * 0.18));
        const arrowEndX = launchX + arrowLength * Math.cos(angleRad);
        const arrowEndY = launchY - arrowLength * Math.sin(angleRad);
        this.drawArrow(
            launchX,
            launchY,
            arrowEndX,
            arrowEndY,
            '#dc2626'
        );

        // Draw launch angle arc
        this.drawAngleArc(launchX, launchY, 50, angleRad);

        // Draw impact point
        const impactX = vx * totalTime;
        const impactY = 0;
        this.ctx.fillStyle = '#dc2626';
        this.ctx.beginPath();
        this.ctx.arc(
            plotMargin.left + impactX * scaleX,
            displayHeight - plotMargin.bottom,
            8,
            0,
            2 * Math.PI
        );
        this.ctx.fill();

        // Draw max height marker
        const maxHeightX = vx * (vy / g);
        this.ctx.fillStyle = '#059669';
        this.ctx.beginPath();
        this.ctx.arc(
            plotMargin.left + maxHeightX * scaleX,
            displayHeight - plotMargin.bottom - maxHeight * scaleY,
            6,
            0,
            2 * Math.PI
        );
        this.ctx.fill();

        // Draw axes
        this.ctx.strokeStyle = '#d1d5db';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);

        // Vertical axis
        this.ctx.beginPath();
        this.ctx.moveTo(plotMargin.left, plotMargin.top);
        this.ctx.lineTo(plotMargin.left, displayHeight - plotMargin.bottom);
        this.ctx.stroke();

        // Horizontal axis
        this.ctx.beginPath();
        this.ctx.moveTo(plotMargin.left, displayHeight - plotMargin.bottom);
        this.ctx.lineTo(displayWidth - plotMargin.right, displayHeight - plotMargin.bottom);
        this.ctx.stroke();

        this.ctx.setLineDash([]);

        // Draw labels
        this.ctx.fillStyle = '#374151';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText('Range (m)', plotMargin.left + width / 2 - 36, displayHeight - 12);
        
        this.ctx.save();
        this.ctx.translate(22, plotMargin.top + height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Height (m)', 0, 0);
        this.ctx.restore();

        // Draw legend
        this.drawLegend(displayWidth, displayHeight);
    }

    drawGrid(plotMargin, width, height, displayWidth, displayHeight, maxRangeValue, maxHeightValue) {
        this.ctx.strokeStyle = 'rgba(209, 213, 219, 0.5)';
        this.ctx.lineWidth = 0.5;
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#6b7280';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        // Vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = plotMargin.left + (width / 10) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, plotMargin.top);
            this.ctx.lineTo(x, plotMargin.top + height);
            this.ctx.stroke();

            // X-axis ticks (range values)
            if (i % 2 === 0) {
                const rangeTick = (maxRangeValue * i) / 10;
                this.ctx.fillText(`${rangeTick.toFixed(1)}`, x, displayHeight - plotMargin.bottom + 8);
            }
        }

        // Horizontal grid lines
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        for (let i = 0; i <= 10; i++) {
            const y = plotMargin.top + (height / 10) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(plotMargin.left, y);
            this.ctx.lineTo(plotMargin.left + width, y);
            this.ctx.stroke();

            // Y-axis ticks (height values), displayed bottom-to-top.
            if (i % 2 === 0) {
                const heightTick = (maxHeightValue * (10 - i)) / 10;
                this.ctx.fillText(`${heightTick.toFixed(1)}`, plotMargin.left - 12, y);
            }
        }

        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'alphabetic';
    }

    drawArrow(fromX, fromY, toX, toY, color) {
        const headlen = 15;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 2.5;
        this.ctx.lineCap = 'round';

        // Draw line
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.stroke();

        // Draw arrowhead
        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawAngleArc(x, y, radius, angle) {
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 2;

        // Canvas Y increases downward, so we manually trace the arc with -sin(t)
        // to show a positive launch angle curving upward from the horizontal axis.
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        const steps = 48;
        for (let i = 1; i <= steps; i++) {
            const t = (angle * i) / steps;
            const arcX = x + radius * Math.cos(t);
            const arcY = y - radius * Math.sin(t);
            this.ctx.lineTo(arcX, arcY);
        }
        this.ctx.stroke();

        // Angle label
        const labelX = x + radius * 1.5 * Math.cos(angle / 2);
        const labelY = y - radius * 1.5 * Math.sin(angle / 2);
        this.ctx.fillStyle = '#d97706';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`${this.radiansToDegrees(angle).toFixed(0)}°`, labelX, labelY);
    }

    drawLegend(displayWidth, displayHeight) {
        const legendX = displayWidth - 180;
        const legendY = 20;

        // Background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.fillRect(legendX - 10, legendY - 10, 170, 90);

        // Border
        this.ctx.strokeStyle = '#d1d5db';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(legendX - 10, legendY - 10, 170, 90);

        // Trajectory line
        this.ctx.strokeStyle = '#2563eb';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(legendX, legendY + 10);
        this.ctx.lineTo(legendX + 20, legendY + 10);
        this.ctx.stroke();
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('Trajectory', legendX + 30, legendY + 15);

        // Velocity vector
        this.ctx.strokeStyle = '#dc2626';
        this.ctx.fillStyle = '#dc2626';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(legendX, legendY + 35);
        this.ctx.lineTo(legendX + 20, legendY + 35);
        this.ctx.stroke();
        this.ctx.fillText('Velocity Vector', legendX + 30, legendY + 40);

        // Max height
        this.ctx.fillStyle = '#059669';
        this.ctx.beginPath();
        this.ctx.arc(legendX + 10, legendY + 60, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.fillStyle = '#1f2937';
        this.ctx.fillText('Max Height', legendX + 30, legendY + 65);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VelocityExplorer();
});
