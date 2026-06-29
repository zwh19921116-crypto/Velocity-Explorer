class VelocityExplorer {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.loadPresets();
        this.calculate();
        this.updateAnimationButtons();
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
        this.playheadDisplay = document.getElementById('playheadDisplay');
        this.compareStatus = document.getElementById('compareStatus');
        this.practiceQuestion = document.getElementById('practiceQuestion');
        this.practiceFeedback = document.getElementById('practiceFeedback');

        this.motionCanvas = document.getElementById('motionCanvas');
        this.positionCanvas = document.getElementById('positionCanvas');
        this.velocityCanvas = document.getElementById('velocityCanvas');
        this.accelerationCanvas = document.getElementById('accelerationCanvas');

        this.resetBtn = document.getElementById('resetBtn');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.replayBtn = document.getElementById('replayBtn');
        this.stepBackBtn = document.getElementById('stepBackBtn');
        this.stepForwardBtn = document.getElementById('stepForwardBtn');
        this.stepBigBtn = document.getElementById('stepBigBtn');
        this.captureRunBtn = document.getElementById('captureRunBtn');
        this.clearRunBtn = document.getElementById('clearRunBtn');
        this.newQuestionBtn = document.getElementById('newQuestionBtn');
        this.answerBtns = document.querySelectorAll('.answer-btn');
        this.presetBtns = document.querySelectorAll('.preset-btn');

        this.formulaToggle = document.getElementById('formulaToggle');
        this.formulaClose = document.getElementById('formulaClose');
        this.formulaSidebar = document.getElementById('formulaSidebar');
        this.formulaOverlay = document.getElementById('formulaOverlay');
        this.tourOverlay = document.getElementById('tourOverlay');
        this.tourCloseBtn = document.getElementById('tourCloseBtn');

        this.presets = {
            uniform: { acceleration: 0.0 },
            speedup: { acceleration: 1.5 },
            braking: { acceleration: -1.5 }
        };

        this.playheadTime = parseFloat(this.time.value);
        this.isAnimating = false;
        this.animationFrameId = null;
        this.lastTimestamp = null;
        this.followTargetWhenIdle = true;
        this.compareSnapshot = null;
        this.currentQuestion = null;
    }

    initializeEventListeners() {
        this.initialVelocity.addEventListener('input', (e) => this.syncFromSlider('initialVelocity', e.target.value));
        this.acceleration.addEventListener('input', (e) => this.syncFromSlider('acceleration', e.target.value));
        this.time.addEventListener('input', (e) => this.syncFromSlider('time', e.target.value));

        this.initialVelocityInput.addEventListener('input', (e) => this.syncFromInput('initialVelocity', e.target.value));
        this.accelerationInput.addEventListener('input', (e) => this.syncFromInput('acceleration', e.target.value));
        this.timeInput.addEventListener('input', (e) => this.syncFromInput('time', e.target.value));

        this.resetBtn.addEventListener('click', () => this.reset());

        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.startAnimation(false));
        }

        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pauseAnimation());
        }

        if (this.replayBtn) {
            this.replayBtn.addEventListener('click', () => this.startAnimation(true));
        }

        if (this.stepBackBtn) {
            this.stepBackBtn.addEventListener('click', () => this.stepTime(-0.1));
        }

        if (this.stepForwardBtn) {
            this.stepForwardBtn.addEventListener('click', () => this.stepTime(0.1));
        }

        if (this.stepBigBtn) {
            this.stepBigBtn.addEventListener('click', () => this.stepTime(1.0));
        }

        if (this.captureRunBtn) {
            this.captureRunBtn.addEventListener('click', () => this.captureComparisonRun());
        }

        if (this.clearRunBtn) {
            this.clearRunBtn.addEventListener('click', () => this.clearComparisonRun());
        }

        if (this.newQuestionBtn) {
            this.newQuestionBtn.addEventListener('click', () => this.generatePracticeQuestion());
        }

        if (this.answerBtns && this.answerBtns.length > 0) {
            this.answerBtns.forEach((btn) => {
                btn.addEventListener('click', () => this.checkPracticeAnswer(btn.dataset.answer));
            });
        }

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

        if (this.tourCloseBtn) {
            this.tourCloseBtn.addEventListener('click', () => this.closeTour());
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
        this.pauseAnimation();
        this.followTargetWhenIdle = true;

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
        this.pauseAnimation();
        this.followTargetWhenIdle = true;

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
        this.followTargetWhenIdle = true;
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

    updateAnimationButtons() {
        if (this.playBtn) {
            this.playBtn.disabled = this.isAnimating;
        }
        if (this.pauseBtn) {
            this.pauseBtn.disabled = !this.isAnimating;
        }
    }

    stepTime(delta) {
        this.pauseAnimation();
        this.followTargetWhenIdle = false;
        const maxTime = parseFloat(this.time.value);
        this.playheadTime = this.clamp(this.playheadTime + delta, 0, maxTime);
        this.calculate();
    }

    startAnimation(fromStart) {
        const targetTime = parseFloat(this.time.value);
        if (targetTime <= 0) {
            this.playheadTime = 0;
            this.calculate();
            return;
        }

        if (fromStart || this.playheadTime >= targetTime) {
            this.playheadTime = 0;
        }

        this.followTargetWhenIdle = false;
        this.isAnimating = true;
        this.lastTimestamp = null;
        this.updateAnimationButtons();

        const tick = (timestamp) => {
            if (!this.isAnimating) return;

            if (this.lastTimestamp === null) {
                this.lastTimestamp = timestamp;
            }

            const dt = (timestamp - this.lastTimestamp) / 1000;
            this.lastTimestamp = timestamp;

            this.playheadTime += dt;

            if (this.playheadTime >= targetTime) {
                this.playheadTime = targetTime;
                this.isAnimating = false;
            }

            this.calculate();

            if (this.isAnimating) {
                this.animationFrameId = requestAnimationFrame(tick);
            } else {
                this.updateAnimationButtons();
                this.animationFrameId = null;
            }
        };

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = requestAnimationFrame(tick);
    }

    pauseAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.isAnimating = false;
        this.lastTimestamp = null;
        this.updateAnimationButtons();
    }

    reset() {
        this.pauseAnimation();

        this.initialVelocity.value = -0.5;
        this.initialVelocityInput.value = -0.5;
        this.acceleration.value = 0.5;
        this.accelerationInput.value = 0.5;
        this.time.value = 5;
        this.timeInput.value = 5;
        this.playheadTime = 5;
        this.followTargetWhenIdle = true;

        this.presetBtns.forEach((btn) => btn.classList.remove('active'));
        this.loadPresets();
        this.updateDisplay();
        this.calculate();
        this.generatePracticeQuestion();
    }

    captureComparisonRun() {
        this.compareSnapshot = {
            vi: parseFloat(this.initialVelocity.value),
            a: parseFloat(this.acceleration.value),
            t: parseFloat(this.time.value)
        };
        this.compareStatus.textContent = `Run A stored: v_i=${this.compareSnapshot.vi.toFixed(1)}, a=${this.compareSnapshot.a.toFixed(1)}, t=${this.compareSnapshot.t.toFixed(1)}.`;
        this.calculate();
    }

    clearComparisonRun() {
        this.compareSnapshot = null;
        this.compareStatus.textContent = 'No comparison run stored.';
        this.calculate();
    }

    generatePracticeQuestion() {
        const vi = parseFloat(this.initialVelocity.value);
        const a = parseFloat(this.acceleration.value);
        const t = parseFloat(this.time.value);
        const vf = vi + a * t;

        const bank = [
            {
                prompt: `At t = ${t.toFixed(1)} s, what is the sign of final velocity v_f?`,
                answer: vf > 0 ? 'positive' : vf < 0 ? 'negative' : 'zero'
            },
            {
                prompt: 'What is the sign of acceleration a?',
                answer: a > 0 ? 'positive' : a < 0 ? 'negative' : 'zero'
            },
            {
                prompt: `At the current playhead t = ${this.playheadTime.toFixed(1)} s, what is the sign of velocity v(t)?`,
                answer: (vi + a * this.playheadTime) > 0 ? 'positive' : (vi + a * this.playheadTime) < 0 ? 'negative' : 'zero'
            }
        ];

        const selected = bank[Math.floor(Math.random() * bank.length)];
        this.currentQuestion = selected;
        this.practiceQuestion.textContent = selected.prompt;
        this.practiceFeedback.textContent = 'Choose an answer: Positive, Negative, or Zero.';
    }

    checkPracticeAnswer(choice) {
        if (!this.currentQuestion) {
            this.practiceFeedback.textContent = 'Generate a question first.';
            return;
        }

        if (choice === this.currentQuestion.answer) {
            this.practiceFeedback.textContent = 'Correct. Great work!';
            return;
        }

        this.practiceFeedback.textContent = `Not yet. Correct answer: ${this.currentQuestion.answer}.`;
    }

    showTourIfNeeded() {
        const viewed = localStorage.getItem('velocityExplorerTourSeen');
        if (viewed) {
            this.tourOverlay.hidden = true;
            return;
        }
        this.tourOverlay.hidden = false;
    }

    closeTour() {
        this.tourOverlay.hidden = true;
        localStorage.setItem('velocityExplorerTourSeen', 'true');
    }

    calculate() {
        const vi = parseFloat(this.initialVelocity.value);
        const a = parseFloat(this.acceleration.value);
        const targetTime = parseFloat(this.time.value);

        if (!this.isAnimating && this.followTargetWhenIdle) {
            this.playheadTime = targetTime;
        }

        const t = this.playheadTime;

        const vf = vi + a * t;
        const x = vi * t + 0.5 * a * t * t;
        const vAvg = (vi + vf) / 2;
        const zeroCrossingTime = a === 0 ? null : (-vi / a);
        const zeroCrossingInWindow = zeroCrossingTime !== null && zeroCrossingTime >= 0 && zeroCrossingTime <= t;

        this.finalVelocity.textContent = `${vf.toFixed(2)} m/s`;
        this.displacement.textContent = `${x.toFixed(2)} m`;
        this.averageVelocity.textContent = `${vAvg.toFixed(2)} m/s`;
        this.substitutionText.textContent = `v_f = (${vi.toFixed(1)}) + (${a.toFixed(1)})(${t.toFixed(1)}) = ${vf.toFixed(2)} m/s`;
        this.playheadDisplay.textContent = `t = ${t.toFixed(2)} s (target ${targetTime.toFixed(1)} s)`;
        this.directionState.textContent = vf > 0 ? 'Positive' : vf < 0 ? 'Negative' : 'At Rest';
        this.slopeInsight.textContent = a > 0
            ? 'Positive acceleration means v(t) slopes upward.'
            : a < 0
                ? 'Negative acceleration means v(t) slopes downward.'
                : 'Zero acceleration means v(t) is flat.';
        this.zeroCrossingInsight.textContent = zeroCrossingInWindow
            ? `Velocity crosses zero at t = ${zeroCrossingTime.toFixed(2)} s.`
            : 'No direction change in this displayed time window.';

        this.drawMotionStrip(vi, a, t, targetTime);
        this.drawAllGraphs(vi, a, t, zeroCrossingTime, targetTime);
    }

    drawMotionStrip(vi, a, tCurrent, tMaxInput) {
        const canvas = this.motionCanvas;
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

        const margin = { left: 50, right: 28, top: 20, bottom: 22 };
        const width = displayWidth - margin.left - margin.right;
        const centerY = displayHeight * 0.62;

        const xCurrent = vi * tCurrent + 0.5 * a * tCurrent * tCurrent;
        const xMaxMag = Math.max(
            20,
            Math.abs(vi * tMaxInput + 0.5 * a * tMaxInput * tMaxInput),
            Math.abs(vi * (tMaxInput * 0.5) + 0.5 * a * (tMaxInput * 0.5) * (tMaxInput * 0.5))
        );

        const mapX = (x) => margin.left + ((x + xMaxMag) / (2 * xMaxMag)) * width;

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin.left, centerY);
        ctx.lineTo(displayWidth - margin.right, centerY);
        ctx.stroke();

        const zeroX = mapX(0);
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(zeroX, margin.top);
        ctx.lineTo(zeroX, centerY + 24);
        ctx.stroke();
        ctx.setLineDash([]);

        const objectX = mapX(xCurrent);
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(objectX, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();

        const vCurrent = vi + a * tCurrent;
        const arrowLength = this.clamp(Math.abs(vCurrent) * 8, 18, 90);
        const direction = vCurrent >= 0 ? 1 : -1;
        const arrowStartX = objectX;
        const arrowEndX = objectX + direction * arrowLength;
        const arrowY = centerY - 20;

        this.drawArrow(ctx, arrowStartX, arrowY, arrowEndX, arrowY, '#ef4444');

        ctx.fillStyle = '#334155';
        ctx.font = '12px Arial';
        ctx.fillText(`x(t) = ${xCurrent.toFixed(2)} m`, 10, 16);
        ctx.fillText(`v(t) = ${vCurrent.toFixed(2)} m/s`, 10, 34);
        ctx.fillText('-x', margin.left - 16, centerY + 18);
        ctx.fillText('+x', displayWidth - margin.right + 3, centerY + 18);
    }

    drawArrow(ctx, fromX, fromY, toX, toY, color) {
        const headlen = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.4;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }

    drawAllGraphs(vi, a, tCurrent, zeroCrossingTime, targetTime) {
        const tMax = Math.max(1, targetTime);
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

        if (this.compareSnapshot) {
            const compareTSeries = Array.from({ length: points + 1 }, (_, i) => (i / points) * tMax);
            const compareVSeries = compareTSeries.map((tau) => this.compareSnapshot.vi + this.compareSnapshot.a * tau);
            this.drawComparisonOverlay(this.velocityCanvas, {
                tMax,
                tSeries: compareTSeries,
                series: compareVSeries,
                color: '#7c3aed',
                range: { min: -150, max: 150 }
            });
        }

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

    drawComparisonOverlay(canvas, config) {
        const ctx = canvas.getContext('2d');
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        const margin = { left: 58, right: 16, top: 14, bottom: 34 };
        const width = displayWidth - margin.left - margin.right;
        const height = displayHeight - margin.top - margin.bottom;

        const minV = config.range.min;
        const maxV = config.range.max;
        const mapX = (t) => margin.left + (t / config.tMax) * width;
        const mapY = (v) => margin.top + ((maxV - v) / (maxV - minV || 1)) * height;

        ctx.save();
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        config.series.forEach((value, i) => {
            const x = mapX(config.tSeries[i]);
            const y = mapY(value);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = config.color;
        ctx.font = '11px Arial';
        ctx.fillText('Run A', margin.left + 6, margin.top + 12);
        ctx.restore();
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
    const app = new VelocityExplorer();
    app.generatePracticeQuestion();
    app.showTourIfNeeded();
});
