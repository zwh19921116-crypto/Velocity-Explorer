class VelocityExplorer {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.loadPresets();
        this.calculate();
    }

    initializeElements() {
        this.initialVelocity = document.getElementById('initialVelocity');
        this.acceleration = document.getElementById('acceleration');
        this.time = document.getElementById('time');

        this.initialVelocityInput = document.getElementById('initialVelocityInput');
        this.accelerationInput = document.getElementById('accelerationInput');
        this.timeInput = document.getElementById('timeInput');

        this.velocityDisplay = document.getElementById('velocityDisplay');
        this.accelerationDisplay = document.getElementById('accelerationDisplay');
        this.timeDisplay = document.getElementById('timeDisplay');

        this.finalVelocity = document.getElementById('finalVelocity');
        this.displacement = document.getElementById('displacement');
        this.averageVelocity = document.getElementById('averageVelocity');
        this.directionState = document.getElementById('directionState');
        this.substitutionText = document.getElementById('substitutionText');
        this.slopeInsight = document.getElementById('slopeInsight');
        this.zeroCrossingInsight = document.getElementById('zeroCrossingInsight');

        this.positionCanvas = document.getElementById('positionCanvas');
        this.velocityCanvas = document.getElementById('velocityCanvas');
        this.accelerationCanvas = document.getElementById('accelerationCanvas');

        this.resetBtn = document.getElementById('resetBtn');
        this.presetBtns = document.querySelectorAll('.preset-btn');

        this.formulaToggle = document.getElementById('formulaToggle');
        this.formulaClose = document.getElementById('formulaClose');
        this.formulaSidebar = document.getElementById('formulaSidebar');
        this.formulaOverlay = document.getElementById('formulaOverlay');

        this.presets = {
            uniform: { acceleration: 0.0 },
            speedup: { acceleration: 1.5 },
            braking: { acceleration: -1.5 }
        };
    }

    initializeEventListeners() {
        this.initialVelocity.addEventListener('input', (e) => this.syncFromSlider('initialVelocity', e.target.value));
        this.acceleration.addEventListener('input', (e) => this.syncFromSlider('acceleration', e.target.value));
        this.time.addEventListener('input', (e) => this.syncFromSlider('time', e.target.value));

        this.initialVelocityInput.addEventListener('input', (e) => this.syncFromInput('initialVelocity', e.target.value));
        this.accelerationInput.addEventListener('input', (e) => this.syncFromInput('acceleration', e.target.value));
        this.timeInput.addEventListener('input', (e) => this.syncFromInput('time', e.target.value));

        this.resetBtn.addEventListener('click', () => this.reset());

        this.presetBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.applyPreset(preset);
            });
        });

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

        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.calculate(), 120);
        });
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    syncFromSlider(key, rawValue) {
        const value = parseFloat(rawValue);
        if (key === 'initialVelocity') {
            this.initialVelocityInput.value = value;
        } else if (key === 'acceleration') {
            this.accelerationInput.value = value;
        } else {
            this.timeInput.value = value;
        }
        this.updateDisplay();
        this.calculate();
    }

    syncFromInput(key, rawValue) {
        const value = parseFloat(rawValue) || 0;
        if (key === 'initialVelocity') {
            const clamped = this.clamp(value, -20, 20);
            this.initialVelocity.value = clamped;
            this.initialVelocityInput.value = clamped;
        } else if (key === 'acceleration') {
            const clamped = this.clamp(value, -10, 10);
            this.acceleration.value = clamped;
            this.accelerationInput.value = clamped;
        } else {
            const clamped = this.clamp(value, 0, 12);
            this.time.value = clamped;
            this.timeInput.value = clamped;
        }
        this.updateDisplay();
        this.calculate();
    }

    loadPresets() {
        this.presetBtns.forEach((btn) => {
            if (btn.dataset.preset === 'speedup') {
                btn.classList.add('active');
            }
        });
    }

    applyPreset(presetKey) {
        const preset = this.presets[presetKey];
        if (!preset) return;

        this.acceleration.value = preset.acceleration;
        this.accelerationInput.value = preset.acceleration;

        this.presetBtns.forEach((btn) => {
            btn.classList.remove('active');
            if (btn.dataset.preset === presetKey) {
                btn.classList.add('active');
            }
        });

        this.updateDisplay();
        this.calculate();
    }

    openFormulaSidebar() {
        this.formulaSidebar.classList.add('open');
        this.formulaSidebar.setAttribute('aria-hidden', 'false');
        this.formulaOverlay.hidden = false;
        this.formulaToggle.setAttribute('aria-expanded', 'true');
        this.formulaToggle.textContent = 'Hide Formulas';
        document.body.style.overflow = 'hidden';
    }

    closeFormulaSidebar() {
        this.formulaSidebar.classList.remove('open');
        this.formulaSidebar.setAttribute('aria-hidden', 'true');
        this.formulaOverlay.hidden = true;
        this.formulaToggle.setAttribute('aria-expanded', 'false');
        this.formulaToggle.textContent = 'Open Formulas';
        document.body.style.overflow = '';
    }

    updateDisplay() {
        this.velocityDisplay.textContent = `${parseFloat(this.initialVelocity.value).toFixed(1)} m/s`;
        this.accelerationDisplay.textContent = `${parseFloat(this.acceleration.value).toFixed(1)} m/s²`;
        this.timeDisplay.textContent = `${parseFloat(this.time.value).toFixed(1)} s`;
    }

    reset() {
        this.initialVelocity.value = -0.5;
        this.initialVelocityInput.value = -0.5;
        this.acceleration.value = 0.5;
        this.accelerationInput.value = 0.5;
        this.time.value = 5;
        this.timeInput.value = 5;

        this.presetBtns.forEach((btn) => btn.classList.remove('active'));
        this.loadPresets();
        this.updateDisplay();
        this.calculate();
    }

    calculate() {
        const vi = parseFloat(this.initialVelocity.value);
        const a = parseFloat(this.acceleration.value);
        const t = parseFloat(this.time.value);

        const vf = vi + a * t;
        const x = vi * t + 0.5 * a * t * t;
        const vAvg = (vi + vf) / 2;
        const zeroCrossingTime = a === 0 ? null : (-vi / a);
        const zeroCrossingInWindow = zeroCrossingTime !== null && zeroCrossingTime >= 0 && zeroCrossingTime <= t;

        this.finalVelocity.textContent = `${vf.toFixed(2)} m/s`;
        this.displacement.textContent = `${x.toFixed(2)} m`;
        this.averageVelocity.textContent = `${vAvg.toFixed(2)} m/s`;
        this.substitutionText.textContent = `v_f = (${vi.toFixed(1)}) + (${a.toFixed(1)})(${t.toFixed(1)}) = ${vf.toFixed(2)} m/s`;
        this.directionState.textContent = vf > 0 ? 'Positive' : vf < 0 ? 'Negative' : 'At Rest';
        this.slopeInsight.textContent = a > 0
            ? 'Positive acceleration means v(t) slopes upward.'
            : a < 0
                ? 'Negative acceleration means v(t) slopes downward.'
                : 'Zero acceleration means v(t) is flat.';
        this.zeroCrossingInsight.textContent = zeroCrossingInWindow
            ? `Velocity crosses zero at t = ${zeroCrossingTime.toFixed(2)} s.`
            : 'No direction change in this displayed time window.';

        this.drawAllGraphs(vi, a, t, zeroCrossingTime);
    }

    drawAllGraphs(vi, a, tCurrent, zeroCrossingTime) {
        const tMax = Math.max(1, tCurrent);
        const points = 90;
        const tSeries = Array.from({ length: points + 1 }, (_, i) => (i / points) * tMax);

        const xSeries = tSeries.map((t) => vi * t + 0.5 * a * t * t);
        const vSeries = tSeries.map((t) => vi + a * t);
        const aSeries = tSeries.map(() => a);

        this.drawGraph(this.positionCanvas, {
            label: 'x (m)',
            color: '#2f80ff',
            tMax,
            tCurrent,
            series: xSeries,
            currentValue: vi * tCurrent + 0.5 * a * tCurrent * tCurrent,
            tSeries,
            fixedRange: { min: -1000, max: 1000 }
        });

        this.drawGraph(this.velocityCanvas, {
            label: 'v (m/s)',
            color: '#2563eb',
            tMax,
            tCurrent,
            series: vSeries,
            currentValue: vi + a * tCurrent,
            tSeries,
            fixedRange: { min: -150, max: 150 },
            zeroCrossingTime
        });

        this.drawGraph(this.accelerationCanvas, {
            label: 'a (m/s²)',
            color: '#12b981',
            tMax,
            tCurrent,
            series: aSeries,
            currentValue: a,
            tSeries,
            fixedRange: { min: -10, max: 10 }
        });
    }

    drawGraph(canvas, config) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, displayWidth, displayHeight);

        const margin = { left: 58, right: 16, top: 14, bottom: 34 };
        const width = displayWidth - margin.left - margin.right;
        const height = displayHeight - margin.top - margin.bottom;

        const range = config.fixedRange || this.getRange(config.series, config.currentValue);
        const minV = range.min;
        const maxV = range.max;

        const mapX = (t) => margin.left + (t / config.tMax) * width;
        const mapY = (v) => margin.top + ((maxV - v) / (maxV - minV || 1)) * height;

        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;

        for (let i = 0; i <= 4; i++) {
            const x = margin.left + (width / 4) * i;
            ctx.beginPath();
            ctx.moveTo(x, margin.top);
            ctx.lineTo(x, margin.top + height);
            ctx.stroke();
        }

        for (let i = 0; i <= 4; i++) {
            const y = margin.top + (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(margin.left + width, y);
            ctx.stroke();
        }

        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(margin.left, margin.top, width, height);

        ctx.strokeStyle = config.color;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        config.series.forEach((value, i) => {
            const x = mapX(config.tSeries[i]);
            const y = mapY(value);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        const pX = mapX(config.tCurrent);
        const pY = mapY(config.currentValue);
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.arc(pX, pY, 4, 0, 2 * Math.PI);
        ctx.fill();

        if (
            typeof config.zeroCrossingTime === 'number' &&
            config.zeroCrossingTime >= 0 &&
            config.zeroCrossingTime <= config.tMax &&
            minV <= 0 &&
            maxV >= 0
        ) {
            const zeroX = mapX(config.zeroCrossingTime);
            const zeroY = mapY(0);

            ctx.save();
            ctx.strokeStyle = '#f59e0b';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(zeroX, margin.top);
            ctx.lineTo(zeroX, margin.top + height);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(zeroX, zeroY, 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.font = '11px Arial';
            ctx.fillText('v=0', zeroX + 6, Math.max(margin.top + 12, zeroY - 8));
            ctx.restore();
        }

        ctx.fillStyle = '#334155';
        ctx.font = '12px Arial';
        ctx.fillText(config.label, 8, margin.top + 12);
        ctx.fillText(maxV.toFixed(1), 10, margin.top + 26);
        ctx.fillText(minV.toFixed(1), 10, margin.top + height - 2);

        ctx.fillStyle = '#6b7280';
        ctx.font = '11px Arial';
        ctx.fillText('0', margin.left, displayHeight - 10);
        ctx.fillText((config.tMax * 0.5).toFixed(1), margin.left + width * 0.5 - 8, displayHeight - 10);
        ctx.fillText(config.tMax.toFixed(1), margin.left + width - 16, displayHeight - 10);
        ctx.fillText('t (s)', margin.left + width / 2 - 10, displayHeight - 22);
    }

    getRange(series, current) {
        const values = [...series, current];
        let min = Math.min(...values);
        let max = Math.max(...values);

        if (Math.abs(max - min) < 1e-6) {
            min -= 1;
            max += 1;
        }

        const pad = (max - min) * 0.15;
        return { min: min - pad, max: max + pad };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VelocityExplorer();
});
