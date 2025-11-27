# Causal Inference Mastery

## Causal Framework

### Potential Outcomes (Rubin Causal Model)
- Y(1): Outcome if treated
- Y(0): Outcome if not treated
- Causal Effect: τᵢ = Y(1)ᵢ - Y(0)ᵢ
- Fundamental Problem: Only observe one potential outcome

### Treatment Effects
- **ATE**: Average Treatment Effect = E[Y(1) - Y(0)]
- **ATT**: Average Treatment Effect on Treated = E[Y(1) - Y(0) | D=1]
- **LATE**: Local Average Treatment Effect (compliers only)
- **CATE**: Conditional Average Treatment Effect

### Identification Strategies
1. **Selection on Observables**: Matching, Regression
2. **Selection on Unobservables**: IV, RDD, DID

---

## Difference-in-Differences (DID)

### Basic Setup
```
Y = β₀ + β₁·Treat + β₂·Post + β₃·(Treat×Post) + ε

ATT = β₃ = (Ȳ_treat,post - Ȳ_treat,pre) - (Ȳ_control,post - Ȳ_control,pre)
```

### Key Assumptions
1. **Parallel Trends**: Absent treatment, treated and control would follow same trend
2. **No Anticipation**: No behavioral change before treatment
3. **SUTVA**: No spillovers between units
4. **Stable Composition**: No differential attrition

### Pre-Trend Testing
```r
# R: Event Study
library(fixest)
es_model <- feols(y ~ i(time, treat, ref = -1) | id + time,
                   data = df, vcov = ~id)
iplot(es_model, main = "Event Study")
```

```stata
* Stata: Event Study
reghdfe y i.time#1.treat, absorb(id time) cluster(id)
coefplot, keep(*#1.treat) vertical
```

### Staggered DID
- **Problem**: TWFE biased with heterogeneous treatment effects
- **Solutions**:
  - Callaway & Sant'Anna (2021)
  - Sun & Abraham (2021)
  - de Chaisemartin & D'Haultfœuille (2020)
  - Borusyak, Jaravel & Spiess (2024)

```r
# Callaway-Sant'Anna
library(did)
cs <- att_gt(yname = "y", tname = "time", idname = "id",
             gname = "first_treat", data = df)
aggte(cs, type = "dynamic") |> ggdid()
```

---

## Regression Discontinuity Design (RDD)

### Sharp RDD
```
Treatment: Dᵢ = 1(Xᵢ ≥ c)
Estimand: τ_RD = lim(x→c⁺) E[Y|X=x] - lim(x→c⁻) E[Y|X=x]
```

### Fuzzy RDD
```
First stage: P(D=1|X) jumps at cutoff
τ_RD = [E[Y|X=c⁺] - E[Y|X=c⁻]] / [E[D|X=c⁺] - E[D|X=c⁻]]
```

### Implementation
```r
library(rdrobust)
rd <- rdrobust(y, x, c = cutoff)
summary(rd)
rdplot(y, x, c = cutoff)
```

```stata
rdrobust y x, c(0)
rdplot y x, c(0)
```

### Key Checks
1. **McCrary Test**: No manipulation of running variable
2. **Covariate Balance**: Covariates smooth at cutoff
3. **Bandwidth Sensitivity**: Results stable across bandwidths
4. **Placebo Cutoffs**: No effect at other cutoffs

---

## Instrumental Variables (IV)

### Setup
```
Structural: Y = βD + Xγ + ε    (D endogenous)
First Stage: D = πZ + Xδ + v   (Z = instrument)
```

### Conditions
1. **Relevance**: Cov(Z, D) ≠ 0 → Test: First-stage F > 10
2. **Exclusion**: Cov(Z, ε) = 0 → Not directly testable
3. **Monotonicity**: No defiers (for LATE interpretation)

### Weak Instruments
- F < 10: Weak instrument concern
- Solutions: LIML, Fuller, Anderson-Rubin CI

### Implementation
```r
library(ivreg)
iv <- ivreg(y ~ x1 + x2 | z + x2, data = df)
summary(iv, diagnostics = TRUE)
```

```stata
ivregress 2sls y x2 (x1 = z), first
estat firststage
```

---

## Propensity Score Methods

### Propensity Score
```
e(X) = P(D=1|X) = Pr(Treatment | Covariates)
```

### CIA (Conditional Independence Assumption)
```
Y(0), Y(1) ⊥ D | X  →  Y(0), Y(1) ⊥ D | e(X)
```

### Matching Methods
1. **Nearest Neighbor**: Match to closest PS
2. **Caliper**: Match within specified distance
3. **Kernel**: Weighted average of all controls
4. **Full Matching**: Optimal matching

### Balance Diagnostics
- Standardized Mean Difference < 0.1
- Variance Ratio ≈ 1
- No systematic imbalance in covariates

### Implementation
```r
library(MatchIt)
m <- matchit(treat ~ x1 + x2 + x3, data = df,
             method = "nearest", caliper = 0.2)
summary(m)
matched_df <- match.data(m)
lm(y ~ treat, data = matched_df, weights = weights)
```

---

## Synthetic Control Method (SCM)

### When to Use
- Single treated unit
- Aggregate data (countries, states)
- Long pre-treatment period

### Method
Construct synthetic control as weighted combination of donor units:
```
Ŷ(0)ᵢₜ = Σⱼ wⱼ Yⱼₜ  where Σwⱼ = 1, wⱼ ≥ 0
```

### Implementation
```r
library(Synth)
synth_out <- synth(dataprep.out)
path.plot(synth.res = synth_out, dataprep.res = dataprep.out)
```

```stata
synth y x1 x2, trunit(1) trperiod(2000)
```

---

## Diagnostics Checklist

### DID
- [ ] Pre-trends visual inspection
- [ ] Placebo (pseudo) treatment dates
- [ ] Triple difference if available
- [ ] Robustness to control group definition

### RDD
- [ ] McCrary density test
- [ ] Covariate smoothness at cutoff
- [ ] Bandwidth sensitivity
- [ ] Different polynomial orders

### IV
- [ ] First-stage F-statistic (>10)
- [ ] Overidentification test (if applicable)
- [ ] Reduced-form effect
- [ ] LIML as robustness

### PSM
- [ ] Common support
- [ ] Balance tables (standardized differences)
- [ ] Sensitivity analysis (Rosenbaum bounds)
