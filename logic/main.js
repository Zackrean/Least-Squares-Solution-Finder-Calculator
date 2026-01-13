let scene, camera, renderer, lineMesh, pointMeshes = [];
let dataCount = 0;
let currentSolution = null;
let displayFormat = 'decimal';

function changeFormat(format) {
    displayFormat = format;
    autoCalculate();
}

function addPoint(x = '', y = '') {
    const container = document.getElementById('dataPoints');
    const row = document.createElement('div');
    row.className = 'data-row';
    row.id = `point-${dataCount}`;
    
    row.innerHTML = `
        <input type="number" step="any" placeholder="X" value="${x}" oninput="autoCalculate()">
        <input type="number" step="any" placeholder="Y" value="${y}" oninput="autoCalculate()">
        <button class="remove-btn" onclick="removePoint('point-${dataCount}')">×</button>
    `;
    
    container.appendChild(row);
    dataCount++;
    autoCalculate();
}

function removePoint(id) {
    document.getElementById(id).remove();
    autoCalculate();
}

function clearAll() {
    document.getElementById('dataPoints').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    document.getElementById('predictionSection').style.display = 'none';
    document.getElementById('solutionSteps').style.display = 'none';
    pointMeshes.forEach(mesh => scene.remove(mesh));
    pointMeshes = [];
    if (lineMesh) scene.remove(lineMesh);
    currentSolution = null;
}

function getDataPoints() {
    const rows = document.querySelectorAll('.data-row');
    const points = [];
    
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const x = parseFloat(inputs[0].value);
        const y = parseFloat(inputs[1].value);
        
        if (!isNaN(x) && !isNaN(y)) {
            points.push({ x, y });
        }
    });
    
    return points;
}

function autoCalculate() {
    const resultsDiv = document.getElementById('results');
    const points = getDataPoints();
    
    if (points.length < 2) {
        resultsDiv.innerHTML = '<div class="info">⏳ Add at least 2 data points to start calculating...</div>';
        document.getElementById('predictionSection').style.display = 'none';
        document.getElementById('solutionSteps').style.display = 'none';
        updateVisualization(points);
        return;
    }
    
    try {
        const n = points.length;
        
        const A = points.map(p => [p.x, 1]);
        const b = points.map(p => [p.y]);
        
        const AT = transpose(A);
        
        const ATA = multiplyMatrices(AT, A);
        
        const ATAinv = invert2x2(ATA);
        
        const ATb = multiplyMatrices(AT, b);
        
        const x_hat = multiplyMatrices(ATAinv, ATb);
        
        const m = x_hat[0][0];  
        const c = x_hat[1][0];  
        
        let sumResiduals = 0;
        points.forEach(p => {
            const predicted = m * p.x + c;
            sumResiduals += Math.pow(p.y - predicted, 2);
        });
        
        const sumY = points.reduce((sum, p) => sum + p.y, 0);
        const yMean = sumY / n;
        const totalSS = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
        const rSquared = totalSS !== 0 ? 1 - (sumResiduals / totalSS) : 1;
        
        currentSolution = { m, c };
        
        const mFormatted = formatNumber(m);
        const cFormatted = formatNumber(c);
        const signStr = c >= 0 ? '+' : '';
        
        let html = '<div class="result-box">';
        html += '<strong>✨ Least Squares Solution:</strong>';
        html += `<div class="equation">y = ${mFormatted}x ${signStr} ${cFormatted}</div>`;
        html += '<div class="stats">';
        html += `<div class="stat-item"><span>Slope (m):</span><span>${formatNumber(m, 2)}</span></div>`;
        html += `<div class="stat-item"><span>Y-intercept (c):</span><span>${formatNumber(c, 2)}</span></div>`;
        html += `<div class="stat-item"><span>R² (goodness of fit):</span><span>${rSquared.toFixed(2)}</span></div>`;
        html += `<div class="stat-item"><span>Sum of squared errors:</span><span>${sumResiduals.toFixed(2)}</span></div>`;
        html += `<div class="stat-item"><span>Data points:</span><span>${n}</span></div>`;
        html += '</div></div>';
        
        resultsDiv.innerHTML = html;
        
        generateNormalEquationSteps(points, A, b, AT, ATA, ATAinv, ATb, x_hat, m, c, rSquared, sumResiduals);
        
        document.getElementById('predictionSection').style.display = 'block';
        document.getElementById('solutionSteps').style.display = 'block';
        
        updateVisualization(points);
        visualizeLine(points, m, c);
        
    } catch (error) {
        resultsDiv.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
        document.getElementById('predictionSection').style.display = 'none';
        document.getElementById('solutionSteps').style.display = 'none';
    }
}

function makePrediction() {
    const x = parseFloat(document.getElementById('predictX').value);
    const resultDiv = document.getElementById('predictionResult');
    
    if (isNaN(x) || !currentSolution) {
        resultDiv.innerHTML = '<div style="color: #F08051; margin-top: 10px; font-weight: bold;">Please enter a valid X value</div>';
        return;
    }
    
    const y = currentSolution.m * x + currentSolution.c;
    const yFormatted = formatNumber(y);
    resultDiv.innerHTML = `<div style="margin-top: 10px; font-size: 14px; font-weight: bold; color: #F08051;">Predicted Y = ${yFormatted}</div>`;
}

function loadExample() {
    clearAll();
    
    const exampleData = [
        { x: 1, y: 2.1 },
        { x: 2, y: 4 },
        { x: 3, y: 5.8 },
        { x: 4, y: 8.1 },
        { x: 5, y: 9.9 }
    ];
    
    exampleData.forEach(point => addPoint(point.x, point.y));
}

function toggleLearnMore() {
    const content = document.getElementById('learnMoreContent');
    const arrow = document.getElementById('learnMoreArrow');
    
    content.classList.toggle('open');
    arrow.classList.toggle('open');
}

function toggleAbout() {
    const content = document.getElementById('aboutContent');
    const arrow = document.getElementById('aboutArrow');
    
    content.classList.toggle('open');
    arrow.classList.toggle('open');
}

function toggleSolution() {
    const content = document.getElementById('solutionContent');
    const arrow = document.getElementById('solutionArrow');
    
    content.classList.toggle('open');
    arrow.classList.toggle('open');
}

window.onload = () => {
    initThreeJS();
    loadExample();
};
