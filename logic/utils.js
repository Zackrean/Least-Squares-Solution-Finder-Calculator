function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function decimalToFraction(decimal, maxDenominator = 10000) {
    if (decimal === 0) return '0';
    
    const sign = decimal < 0 ? '-' : '';
    decimal = Math.abs(decimal);
    
    const wholePart = Math.floor(decimal);
    const fractionalPart = decimal - wholePart;
    
    if (fractionalPart < 0.0001) {
        return sign + wholePart;
    }
    
    let bestNumerator = 1;
    let bestDenominator = 1;
    let minError = Math.abs(fractionalPart - bestNumerator / bestDenominator);
    
    for (let denominator = 2; denominator <= maxDenominator; denominator++) {
        const numerator = Math.round(fractionalPart * denominator);
        const error = Math.abs(fractionalPart - numerator / denominator);
        
        if (error < minError) {
            minError = error;
            bestNumerator = numerator;
            bestDenominator = denominator;
            
            if (error < 0.0001) break;
        }
    }
    
    const divisor = gcd(bestNumerator, bestDenominator);
    bestNumerator /= divisor;
    bestDenominator /= divisor;
    
    if (wholePart === 0) {
        return sign + bestNumerator + '/' + bestDenominator;
    } else {
        return sign + wholePart + ' ' + bestNumerator + '/' + bestDenominator;
    }
}

function formatNumber(num, decimals = 2) {
    if (displayFormat === 'fraction') {
        return decimalToFraction(num);
    } else {
        return num.toFixed(decimals);
    }
}

function formatNumberForDisplay(num, decimals = 2) {
    if (displayFormat === 'fraction') {
        if (num === 0) return '0';
        
        const sign = num < 0 ? '−' : '';
        num = Math.abs(num);
        
        const wholePart = Math.floor(num);
        const fractionalPart = num - wholePart;
        
        if (fractionalPart < 0.0001) {
            return sign + wholePart;
        }
        
        let bestNumerator = 1;
        let bestDenominator = 1;
        let minError = Math.abs(fractionalPart - bestNumerator / bestDenominator);
        
        for (let denominator = 2; denominator <= 10000; denominator++) {
            const numerator = Math.round(fractionalPart * denominator);
            const error = Math.abs(fractionalPart - numerator / denominator);
            
            if (error < minError) {
                minError = error;
                bestNumerator = numerator;
                bestDenominator = denominator;
                
                if (error < 0.0001) break;
            }
        }
        
        const divisor = gcd(bestNumerator, bestDenominator);
        bestNumerator /= divisor;
        bestDenominator /= divisor;
        
        let result = '';
        if (wholePart > 0) {
            result = sign + wholePart + ' ';
        } else if (sign === '−') {
            result = '−';
        }
        
        result += '<span class="fraction"><sup>' + bestNumerator + '</sup><span class="frac-line"></span><sub>' + bestDenominator + '</sub></span>';
        
        return result;
    } else {
        return num.toFixed(decimals);
    }
}

// FIXED: Proper HTML structure with brackets on left and right
function formatMatrix(matrix) {
    let html = '<div class="matrix-display">';
    // LEFT BRACKET
    html += '<span class="matrix-bracket left"></span>';
    // MATRIX CONTENT
    html += '<div class="matrix-content">';
    for (let i = 0; i < matrix.length; i++) {
        html += '<div class="matrix-row">';
        for (let j = 0; j < matrix[i].length; j++) {
            html += '<div class="matrix-cell">' + formatNumberForDisplay(matrix[i][j], 2) + '</div>';
        }
        html += '</div>';
    }
    html += '</div>';
    // RIGHT BRACKET
    html += '<span class="matrix-bracket right"></span>';
    html += '</div>';
    return html;
}