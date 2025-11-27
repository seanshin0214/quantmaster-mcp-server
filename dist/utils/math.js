// Mathematical helper functions
/**
 * Error function (erf) approximation
 * Based on Abramowitz and Stegun formula 7.1.26
 */
export function erf(x) {
    // Constants
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    // Save the sign of x
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    // Approximation
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 -
        ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
}
/**
 * Standard normal CDF (cumulative distribution function)
 */
export function normalCDF(x) {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
}
/**
 * Inverse error function approximation
 */
export function erfInv(x) {
    const a = 0.147;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const ln = Math.log(1 - x * x);
    const t1 = 2 / (Math.PI * a) + ln / 2;
    const t2 = ln / a;
    return sign * Math.sqrt(Math.sqrt(t1 * t1 - t2) - t1);
}
/**
 * Inverse standard normal CDF (quantile function)
 */
export function normalQuantile(p) {
    return Math.sqrt(2) * erfInv(2 * p - 1);
}
/**
 * Power calculation for two-sample t-test
 */
export function calculatePower(n, effectSize, alpha = 0.05) {
    const zAlpha = normalQuantile(1 - alpha / 2);
    const ncp = effectSize * Math.sqrt(n / 2);
    const power = 1 - normalCDF(zAlpha - ncp);
    return Math.min(Math.max(power, 0), 1);
}
/**
 * Sample size calculation for two-sample t-test
 */
export function calculateSampleSize(effectSize, alpha = 0.05, power = 0.80) {
    const zAlpha = normalQuantile(1 - alpha / 2);
    const zBeta = normalQuantile(power);
    const n = 2 * Math.pow((zAlpha + zBeta) / effectSize, 2);
    return Math.ceil(n);
}
//# sourceMappingURL=math.js.map