# Regression Analysis Mastery

## OLS Regression

### Model
```
Y = β₀ + β₁X₁ + β₂X₂ + ... + βₖXₖ + ε
```

### Gauss-Markov Assumptions (BLUE)
1. **Linearity**: E(Y|X) = Xβ
2. **Random Sampling**: (Yᵢ, Xᵢ) are i.i.d.
3. **No Perfect Multicollinearity**: rank(X) = k+1
4. **Zero Conditional Mean**: E(ε|X) = 0
5. **Homoscedasticity**: Var(ε|X) = σ²
6. **Normality** (for inference): ε ~ N(0, σ²)

### Diagnostics

#### Multicollinearity
```r
# R
car::vif(model)  # VIF > 10 problematic
```
```stata
* Stata
vif
```

#### Heteroscedasticity
```r
# Breusch-Pagan test
lmtest::bptest(model)
# Solution: Robust SE
lmtest::coeftest(model, vcov = sandwich::vcovHC)
```
```stata
hettest
reg y x1 x2, robust
```

#### Normality of Residuals
```r
shapiro.test(residuals(model))
qqnorm(residuals(model))
```

### Interpretation

| Variable Type | Coefficient Interpretation |
|--------------|---------------------------|
| Continuous | 1-unit ↑ X → β-unit Δ Y |
| Log(X) | 1% ↑ X → β/100 Δ Y |
| Log(Y) | 1-unit ↑ X → 100×(eᵝ-1)% Δ Y |
| Log-Log | 1% ↑ X → β% Δ Y (elasticity) |
| Binary | Category=1 vs 0 difference |

---

## Panel Data Models

### Fixed Effects (FE)
```
Yᵢₜ = αᵢ + Xᵢₜβ + εᵢₜ

Within transformation: (Yᵢₜ - Ȳᵢ) = (Xᵢₜ - X̄ᵢ)β + (εᵢₜ - ε̄ᵢ)
```

**Pros**: Controls for time-invariant unobservables
**Cons**: Cannot estimate time-invariant variables

### Random Effects (RE)
```
Yᵢₜ = α + Xᵢₜβ + uᵢ + εᵢₜ

where uᵢ ~ N(0, σ²ᵤ), εᵢₜ ~ N(0, σ²ₑ)
```

**Pros**: More efficient, can estimate time-invariant variables
**Cons**: Requires uᵢ ⊥ Xᵢₜ (often implausible)

### Hausman Test
```
H₀: RE is consistent (uᵢ ⊥ Xᵢₜ)
H₁: RE is inconsistent → Use FE

Test: H = (β̂_FE - β̂_RE)'[Var(β̂_FE) - Var(β̂_RE)]⁻¹(β̂_FE - β̂_RE) ~ χ²(k)
```

### Implementation
```r
library(plm)
fe <- plm(y ~ x1 + x2, data = panel, model = "within", index = c("id", "time"))
re <- plm(y ~ x1 + x2, data = panel, model = "random", index = c("id", "time"))
phtest(fe, re)  # Hausman test
```

```stata
xtset id time
xtreg y x1 x2, fe
estimates store fe
xtreg y x1 x2, re
hausman fe
```

### Two-Way Fixed Effects
```r
library(fixest)
twfe <- feols(y ~ x1 + x2 | id + time, data = panel, vcov = ~id)
```

```stata
reghdfe y x1 x2, absorb(id time) cluster(id)
```

---

## Limited Dependent Variables

### Logistic Regression
```
P(Y=1|X) = 1 / (1 + e^(-Xβ)) = Λ(Xβ)

Log-odds: log[P/(1-P)] = Xβ
```

### Probit
```
P(Y=1|X) = Φ(Xβ)

where Φ is the standard normal CDF
```

### Interpretation
- **Coefficients**: Log-odds (logit) or z-score change (probit)
- **Odds Ratio**: exp(β) for logit
- **Marginal Effects**: ∂P/∂X = f(Xβ)·β

```r
# Logit
logit <- glm(y ~ x1 + x2, data = df, family = binomial(link = "logit"))
exp(coef(logit))  # Odds ratios

# Marginal effects
library(margins)
margins(logit)
```

```stata
logit y x1 x2
margins, dydx(*)  # Average marginal effects
```

### Ordered Logit/Probit
```r
library(MASS)
polr(factor(y) ~ x1 + x2, data = df, method = "logistic")
```

```stata
ologit y x1 x2
```

### Multinomial Logit
```r
library(nnet)
multinom(y ~ x1 + x2, data = df)
```

```stata
mlogit y x1 x2, baseoutcome(0)
```

---

## Count Models

### Poisson Regression
```
E(Y|X) = exp(Xβ)
Var(Y|X) = E(Y|X)  [equidispersion]

log E(Y|X) = Xβ
```

### Negative Binomial
```
Var(Y|X) = E(Y|X) + αE(Y|X)²  [overdispersion]
```

### Zero-Inflated Models
- Excess zeros beyond what Poisson/NB predicts
- Two-part model: logit for zero vs positive, count for positive values

### Implementation
```r
# Poisson
pois <- glm(y ~ x1 + x2, data = df, family = poisson)

# Negative Binomial
library(MASS)
nb <- glm.nb(y ~ x1 + x2, data = df)

# Zero-Inflated Poisson
library(pscl)
zip <- zeroinfl(y ~ x1 + x2 | z1, data = df)
```

```stata
poisson y x1 x2
nbreg y x1 x2
zip y x1 x2, inflate(z1)
```

---

## Survival Analysis

### Hazard Function
```
h(t) = lim[Δt→0] P(t ≤ T < t+Δt | T ≥ t) / Δt
```

### Cox Proportional Hazards
```
h(t|X) = h₀(t) · exp(Xβ)

Hazard Ratio: HR = exp(β)
```

### Kaplan-Meier Estimator
```r
library(survival)
km <- survfit(Surv(time, event) ~ group, data = df)
plot(km)

# Cox model
cox <- coxph(Surv(time, event) ~ x1 + x2, data = df)
```

```stata
stset time, failure(event)
sts graph, by(group)
stcox x1 x2
```

---

## Model Selection

### Information Criteria
```
AIC = -2·ln(L) + 2k
BIC = -2·ln(L) + k·ln(n)
```
- Lower is better
- BIC penalizes complexity more

### R-squared Variants
| Measure | Formula | Use |
|---------|---------|-----|
| R² | 1 - SSR/SST | OLS |
| Adjusted R² | 1 - (1-R²)(n-1)/(n-k-1) | Model comparison |
| Pseudo R² | 1 - L₁/L₀ | GLM |
| Within R² | 1 - SSR_within/SST_within | Panel FE |

### Cross-Validation
```r
library(caret)
train_control <- trainControl(method = "cv", number = 10)
cv_model <- train(y ~ ., data = df, method = "lm", trControl = train_control)
```
