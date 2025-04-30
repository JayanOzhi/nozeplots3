export function mean(arrays) {
  if (!arrays || arrays.length === 0 || !arrays[0]) return [];
  const length = arrays[0].length;
  return Array.from({ length }, (_, i) =>
    arrays.reduce((sum, row) => sum + (row[i] || 0), 0) / arrays.length
  );
}

export function stddev(arrays, means) {
  if (!arrays || arrays.length === 0 || !arrays[0]) return [];
  const length = arrays[0].length;
  return Array.from({ length }, (_, i) => {
    const variance = arrays.reduce((sum, row) => sum + Math.pow((row[i] || 0) - means[i], 2), 0) / arrays.length;
    return Math.sqrt(variance);
  });
}

export function movingAverage(data, windowSize) {
  const smoothed = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const window = data.slice(start, end);
    const avg = window.reduce((sum, val) => sum + (val || 0), 0) / window.length;
    smoothed.push(avg);
  }
  return smoothed;
}

export function medianFilter(data, windowSize) {
  const smoothed = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const window = data.slice(start, end).sort((a, b) => a - b);
    const median = window.length % 2 === 0
      ? (window[window.length / 2 - 1] + window[window.length / 2]) / 2
      : window[Math.floor(window.length / 2)];
    smoothed.push(median);
  }
  return smoothed;
}

export function savitzkyGolay(data, windowSize, polynomialOrder) {
  if (windowSize % 2 === 0 || windowSize < 3 || windowSize < polynomialOrder + 1) {
    console.warn('Savitzky-Golay: Window size must be odd, >= 3, and >= polynomial order + 1. Returning original data.');
    return [...data];
  }

  const smoothed = [];
  const halfWindow = Math.floor(windowSize / 2);

  // Precompute coefficients for the polynomial fit
  const coefficients = [];
  for (let i = -halfWindow; i <= halfWindow; i++) {
    let row = [];
    for (let j = 0; j <= polynomialOrder; j++) {
      row.push(Math.pow(i, j));
    }
    coefficients.push(row);
  }

  // Transpose for matrix operations
  const transpose = (matrix) => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  const matrixMultiply = (A, B) => {
    return A.map(row =>
      B[0].map((_, j) =>
        row.reduce((sum, val, i) => sum + val * B[i][j], 0)
      )
    );
  };
  const matrixInverse = (matrix) => {
    // Simplified 3x3 inverse for polynomialOrder <= 2 (common case)
    if (matrix.length !== 3 || matrix[0].length !== 3) {
      console.warn('Savitzky-Golay: Matrix inverse only implemented for 3x3. Returning original data.');
      return [...data];
    }
    const [a, b, c] = matrix[0];
    const [d, e, f] = matrix[1];
    const [g, h, i] = matrix[2];
    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    if (det === 0) return [...data];
    const invDet = 1 / det;
    return [
      [(e * i - f * h) * invDet, (c * h - b * i) * invDet, (b * f - c * e) * invDet],
      [(f * g - d * i) * invDet, (a * i - c * g) * invDet, (c * d - a * f) * invDet],
      [(d * h - e * g) * invDet, (b * g - a * h) * invDet, (a * e - b * d) * invDet],
    ];
  };

  const At = transpose(coefficients);
  const AtA = matrixMultiply(At, coefficients);
  const AtA_inv = matrixInverse(AtA);
  const AtA_inv_At = matrixMultiply(AtA_inv, At);

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(data.length, i + halfWindow + 1);
    const window = data.slice(start, end);
    const windowIndices = Array.from({ length: window.length }, (_, idx) => idx - (i - start));

    // Fit polynomial
    let smoothedValue = 0;
    for (let j = 0; j <= polynomialOrder; j++) {
      const coef = AtA_inv_At[j].reduce((sum, val, idx) => sum + val * window[idx], 0);
      smoothedValue += coef * Math.pow(0, j); // Evaluate at center (x=0)
    }
    smoothed.push(smoothedValue);
  }

  return smoothed;
}