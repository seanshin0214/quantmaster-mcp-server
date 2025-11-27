// Dr. QuantMaster Knowledge Base Collections
// 42 domains organized into 8 categories

export type CollectionCategory =
  | "foundations"      // 통계 기초
  | "regression"       // 회귀분석
  | "econometrics"     // 계량경제학
  | "advanced"         // 고급 기법
  | "meta"            // 메타분석
  | "replication"     // 재현성/Open Science
  | "code"            // 코드 템플릿
  | "journals";       // 저널 가이드

export interface CollectionConfig {
  name: string;
  description: string;
  metadata: Record<string, string>;
}

export const COLLECTIONS: Record<string, CollectionConfig> = {
  // === FOUNDATIONS (통계 기초) ===
  descriptive: {
    name: "descriptive_stats",
    description: "기술통계, 분포, 시각화",
    metadata: { category: "foundations", level: "basic" },
  },
  probability: {
    name: "probability_theory",
    description: "확률론, 확률분포, 중심극한정리",
    metadata: { category: "foundations", level: "basic" },
  },
  hypothesis: {
    name: "hypothesis_testing",
    description: "가설검정, t-test, ANOVA, chi-square",
    metadata: { category: "foundations", level: "basic" },
  },
  power: {
    name: "power_analysis",
    description: "검정력분석, 표본크기 계산, 효과크기",
    metadata: { category: "foundations", level: "intermediate" },
  },

  // === REGRESSION (회귀분석) ===
  ols: {
    name: "ols_regression",
    description: "OLS, 가정, 진단, 해석",
    metadata: { category: "regression", level: "intermediate" },
  },
  logistic: {
    name: "logistic_regression",
    description: "로지스틱, 프로빗, 순서형/다항 로짓",
    metadata: { category: "regression", level: "intermediate" },
  },
  count: {
    name: "count_models",
    description: "포아송, 음이항, 영과잉 모형",
    metadata: { category: "regression", level: "intermediate" },
  },
  survival: {
    name: "survival_analysis",
    description: "생존분석, Cox, Kaplan-Meier",
    metadata: { category: "regression", level: "advanced" },
  },

  // === ECONOMETRICS (계량경제학) ===
  panel: {
    name: "panel_data",
    description: "패널데이터, FE, RE, 하우스만",
    metadata: { category: "econometrics", level: "advanced" },
  },
  timeseries: {
    name: "time_series",
    description: "시계열, ARIMA, VAR, 공적분",
    metadata: { category: "econometrics", level: "advanced" },
  },
  iv: {
    name: "instrumental_variables",
    description: "도구변수, 2SLS, GMM",
    metadata: { category: "econometrics", level: "advanced" },
  },
  did: {
    name: "diff_in_diff",
    description: "이중차분, 평행추세, 사건연구",
    metadata: { category: "econometrics", level: "advanced" },
  },
  rdd: {
    name: "regression_discontinuity",
    description: "회귀불연속, Sharp/Fuzzy RD",
    metadata: { category: "econometrics", level: "advanced" },
  },
  synth: {
    name: "synthetic_control",
    description: "합성대조군, SCM, 인과추론",
    metadata: { category: "econometrics", level: "advanced" },
  },

  // === ADVANCED (고급 기법) ===
  sem: {
    name: "structural_equation",
    description: "구조방정식, CFA, 경로분석",
    metadata: { category: "advanced", level: "advanced" },
  },
  mlm: {
    name: "multilevel",
    description: "다층모형, HLM, 랜덤효과",
    metadata: { category: "advanced", level: "advanced" },
  },
  bayesian: {
    name: "bayesian_stats",
    description: "베이지안, MCMC, 사전분포",
    metadata: { category: "advanced", level: "advanced" },
  },
  ml: {
    name: "machine_learning",
    description: "ML, 랜덤포레스트, XGBoost, 교차검증",
    metadata: { category: "advanced", level: "advanced" },
  },
  spatial: {
    name: "spatial_analysis",
    description: "공간분석, SAR, GWR, 공간가중행렬",
    metadata: { category: "advanced", level: "advanced" },
  },
  network: {
    name: "network_analysis",
    description: "네트워크분석, 중심성, ERGM",
    metadata: { category: "advanced", level: "advanced" },
  },

  // === META-ANALYSIS (메타분석) ===
  metaBasic: {
    name: "meta_basic",
    description: "메타분석 기초, 효과크기, 이질성",
    metadata: { category: "meta", level: "intermediate" },
  },
  metaAdvanced: {
    name: "meta_advanced",
    description: "메타회귀, 출판편향, 민감도분석",
    metadata: { category: "meta", level: "advanced" },
  },

  // === REPLICATION (재현성/Open Science) ===
  prereg: {
    name: "preregistration",
    description: "사전등록, OSF, AsPredicted",
    metadata: { category: "replication", level: "basic" },
  },
  openscience: {
    name: "open_science",
    description: "Open Science, FAIR, 데이터공유",
    metadata: { category: "replication", level: "basic" },
  },
  reproducibility: {
    name: "reproducibility",
    description: "재현성, 코드공유, 컨테이너",
    metadata: { category: "replication", level: "intermediate" },
  },

  // === CODE TEMPLATES (코드 템플릿) ===
  rBasic: {
    name: "r_basic",
    description: "R 기초 코드, tidyverse, ggplot2",
    metadata: { category: "code", level: "basic" },
  },
  rAdvanced: {
    name: "r_advanced",
    description: "R 고급 코드, plm, lme4, brms",
    metadata: { category: "code", level: "advanced" },
  },
  stata: {
    name: "stata_code",
    description: "Stata 코드, xtreg, reghdfe, did",
    metadata: { category: "code", level: "intermediate" },
  },
  python: {
    name: "python_code",
    description: "Python 코드, statsmodels, sklearn",
    metadata: { category: "code", level: "intermediate" },
  },

  // === JOURNALS (저널 가이드) ===
  econometrica: {
    name: "journal_econometrica",
    description: "Econometrica 스타일, 수식표기",
    metadata: { category: "journals", level: "advanced" },
  },
  aer: {
    name: "journal_aer",
    description: "AER 스타일, 인과추론 강조",
    metadata: { category: "journals", level: "advanced" },
  },
  jfe: {
    name: "journal_jfe",
    description: "JFE 스타일, 재무 데이터",
    metadata: { category: "journals", level: "advanced" },
  },
  ms: {
    name: "journal_ms",
    description: "Management Science 스타일",
    metadata: { category: "journals", level: "advanced" },
  },
};

export const COLLECTION_NAMES = Object.values(COLLECTIONS).map((c) => c.name);
