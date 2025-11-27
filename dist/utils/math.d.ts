/**
 * Error function (erf) approximation
 * Based on Abramowitz and Stegun formula 7.1.26
 */
export declare function erf(x: number): number;
/**
 * Standard normal CDF (cumulative distribution function)
 */
export declare function normalCDF(x: number): number;
/**
 * Inverse error function approximation
 */
export declare function erfInv(x: number): number;
/**
 * Inverse standard normal CDF (quantile function)
 */
export declare function normalQuantile(p: number): number;
/**
 * Power calculation for two-sample t-test
 */
export declare function calculatePower(n: number, effectSize: number, alpha?: number): number;
/**
 * Sample size calculation for two-sample t-test
 */
export declare function calculateSampleSize(effectSize: number, alpha?: number, power?: number): number;
//# sourceMappingURL=math.d.ts.map