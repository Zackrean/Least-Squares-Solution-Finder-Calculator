// calculations.js - Core mathematical operations for least squares

/**
 * Multiply two matrices
 */
function multiplyMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < a[0].length; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

/**
 * Transpose a matrix (flip rows and columns)
 */
function transpose(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
    for (let j = 0; j < cols; j++) {
        result[j] = [];
        for (let i = 0; i < rows; i++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}

/**
 * Invert a 2x2 matrix
 */
function invert2x2(matrix) {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];
    
    const det = a * d - b * c;
    if (Math.abs(det) < 1e-10) {
        throw new Error("Matrix is singular and cannot be inverted");
    }
    
    return [
        [d / det, -b / det],
        [-c / det, a / det]
    ];
}

/**
 * Generate detailed step-by-step solution using Normal Equation method
 */
function generateNormalEquationSteps(points, A, b, AT, ATA, ATAinv, ATb, x_hat, m, c, rSquared, sse) {
    const solutionDiv = document.getElementById('solutionContent');
    const n = points.length;
    
    let html = '';
    
    // Step 1: Understanding the Problem
    html += '<div class="solution-step">';
    html += '<h4>Step 1: Understanding the Problem</h4>';
    html += '<p>We want to solve <strong>Ax = b</strong> using the Normal Equation:</p>';
    html += '<div class="formula-box">A<sup>T</sup>A x̂ = A<sup>T</sup>b</div>';
    html += '<p><strong>Given:</strong></p>';
    html += '<p style="font-size: 11px; margin-left: 10px;">Matrix <strong>A</strong> (shape: ' + n + ' × 2):</p>';
    html += formatMatrix(A);
    html += '<p style="font-size: 11px; margin-left: 10px; margin-top: 10px;">Vector <strong>b</strong> (shape: ' + n + ' × 1):</p>';
    html += formatMatrix(b);
    html += '</div>';
    
    // Step 2: Calculate A^T (Transpose)
    html += '<div class="solution-step">';
    html += '<h4>Step 2: Calculate A<sup>T</sup> (Transpose of A)</h4>';
    html += '<p>The transpose flips rows and columns:</p>';
    html += '<p style="font-size: 11px; margin-left: 10px;">Shape: (' + n + ', 2) → (2, ' + n + ')</p>';
    html += formatMatrix(AT);
    html += '</div>';
    
    // Step 3: Calculate A^T * A
    html += '<div class="solution-step">';
    html += '<h4>Step 3: Calculate A<sup>T</sup>A (Matrix Multiplication)</h4>';
    html += '<p>Multiply A<sup>T</sup> by A:</p>';
    html += '<div class="calculation-box">';
    html += 'A<sup>T</sup>A = A<sup>T</sup> · A';
    html += '</div>';
    html += '<p style="font-size: 11px; margin-left: 10px;">Result (shape: 2 × 2, square matrix):</p>';
    html += formatMatrix(ATA);
    html += '<div class="calculation-box" style="margin-top: 8px;">';
    html += `[[${formatNumber(ATA[0][0])}, ${formatNumber(ATA[0][1])}], [${formatNumber(ATA[1][0])}, ${formatNumber(ATA[1][1])}]]`;
    html += '</div>';
    html += '</div>';
    
    // Step 4: Calculate (A^T A)^-1 (Inverse)
    html += '<div class="solution-step">';
    html += '<h4>Step 4: Calculate (A<sup>T</sup>A)<sup>-1</sup> (Inverse)</h4>';
    html += '<p>Find the inverse of A<sup>T</sup>A:</p>';
    html += '<div class="calculation-box">';
    const det = ATA[0][0] * ATA[1][1] - ATA[0][1] * ATA[1][0];
    html += 'Determinant = ' + formatNumber(det, 6);
    html += '</div>';
    html += '<p style="font-size: 11px; color: #666; margin-left: 10px;">Matrix is invertible ✓</p>';
    html += formatMatrix(ATAinv);
    html += '<div class="calculation-box" style="margin-top: 8px; background: rgba(240, 128, 81, 0.3);">';
    html += `[[${formatNumber(ATAinv[0][0])}, ${formatNumber(ATAinv[0][1])}], [${formatNumber(ATAinv[1][0])}, ${formatNumber(ATAinv[1][1])}]]`;
    html += '</div>';
    html += '</div>';
    
    // Step 5: Calculate A^T * b
    html += '<div class="solution-step">';
    html += '<h4>Step 5: Calculate A<sup>T</sup>b</h4>';
    html += '<p>Multiply A<sup>T</sup> by b:</p>';
    html += '<div class="calculation-box">';
    html += 'A<sup>T</sup>b = A<sup>T</sup> · b';
    html += '</div>';
    html += formatMatrix(ATb);
    html += '<div class="calculation-box" style="margin-top: 8px;">';
    html += `[[${formatNumber(ATb[0][0])}], [${formatNumber(ATb[1][0])}]]`;
    html += '</div>';
    html += '</div>';
    
    // Step 6: Calculate x̂ = (A^T A)^-1 * A^T * b
    html += '<div class="solution-step">';
    html += '<h4>Step 6: Calculate x̂ = (A<sup>T</sup>A)<sup>-1</sup>A<sup>T</sup>b</h4>';
    html += '<p>Multiply (A<sup>T</sup>A)<sup>-1</sup> by A<sup>T</sup>b to get our solution:</p>';
    html += '<div class="calculation-box">';
    html += 'x̂ = (A<sup>T</sup>A)<sup>-1</sup> · A<sup>T</sup>b';
    html += '</div>';
    html += formatMatrix(x_hat);
    html += '<div class="calculation-box" style="margin-top: 8px; background: rgba(240, 128, 81, 0.3); font-weight: bold;">';
    html += `x̂ = [[${formatNumber(x_hat[0][0])}], [${formatNumber(x_hat[1][0])}]]`;
    html += '</div>';
    html += '</div>';
    
    // Final Solution
    html += '<div class="solution-step">';
    html += '<h4>Final Solution</h4>';
    html += '<p><strong>Solution vector x̂:</strong></p>';
    html += formatMatrix(x_hat);
    html += '<p style="margin-top: 10px;"><strong>Best-Fit Line Equation:</strong></p>';
    const signStr = c >= 0 ? '+' : '';
    html += '<div class="formula-box" style="font-size: 16px;">';
    html += `y = (${formatNumber(m)})x ${signStr} (${formatNumber(c)})`;
    html += '</div>';
    html += '<p style="font-size: 11px; color: #666; margin-top: 8px;">Where m = ' + formatNumber(m) + ' is the slope and c = ' + formatNumber(c) + ' is the y-intercept.</p>';
    html += '</div>';
    
    // Quality metrics
    html += '<div class="solution-step">';
    html += '<h4>Quality of Fit</h4>';
    html += '<p><strong>R² (Coefficient of Determination):</strong> ' + rSquared.toFixed(2) + '</p>';
    html += '<p style="font-size: 11px; color: #666;">R² measures how well the line fits the data (0 = poor, 1 = perfect).</p>';
    html += '<p><strong>Sum of Squared Errors (SSE):</strong> ' + sse.toFixed(2) + '</p>';
    html += '<p style="font-size: 11px; color: #666;">SSE measures the total deviation of data points from the line (lower is better).</p>';
    html += '</div>';
    
    solutionDiv.innerHTML = html;
}