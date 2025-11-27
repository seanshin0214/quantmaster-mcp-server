import { searchKnowledgeBase } from "../db/embeddings.js";
import { calculatePower } from "../utils/math.js";
// ============================================================
// Dr. QuantMaster MCP Tools (45개)
// ============================================================
export const tools = [
    // === CATEGORY 1: Knowledge Search (5 tools) ===
    {
        name: "search_stats_knowledge",
        description: "통계/계량경제학 지식베이스 RAG 검색. 방법론, 가정, 해석 가이드 제공",
        inputSchema: {
            type: "object",
            properties: {
                query: { type: "string", description: "검색 쿼리" },
                category: {
                    type: "string",
                    enum: ["foundations", "regression", "econometrics", "advanced", "meta", "all"],
                    description: "검색 카테고리"
                },
                n_results: { type: "number", description: "결과 수 (기본: 5)" },
            },
            required: ["query"],
        },
    },
    {
        name: "get_method_guide",
        description: "특정 통계 방법의 상세 가이드 (가정, 절차, 해석, 보고)",
        inputSchema: {
            type: "object",
            properties: {
                method: {
                    type: "string",
                    description: "방법론 (예: ols, panel_fe, did, sem, meta)"
                },
                aspect: {
                    type: "string",
                    enum: ["assumptions", "procedure", "interpretation", "reporting", "all"],
                    description: "가이드 측면"
                },
            },
            required: ["method"],
        },
    },
    {
        name: "suggest_method",
        description: "연구질문과 데이터 특성에 맞는 통계 방법 추천",
        inputSchema: {
            type: "object",
            properties: {
                research_question: { type: "string", description: "연구 질문" },
                dv_type: {
                    type: "string",
                    enum: ["continuous", "binary", "ordinal", "count", "time_to_event", "proportion"],
                    description: "종속변수 유형"
                },
                data_structure: {
                    type: "string",
                    enum: ["cross_sectional", "panel", "time_series", "clustered", "multilevel"],
                    description: "데이터 구조"
                },
                causal_design: {
                    type: "string",
                    enum: ["none", "experimental", "quasi_experimental", "observational"],
                    description: "인과추론 설계"
                },
            },
            required: ["research_question", "dv_type"],
        },
    },
    {
        name: "compare_methods",
        description: "여러 통계 방법 비교 (장단점, 적용조건)",
        inputSchema: {
            type: "object",
            properties: {
                methods: {
                    type: "array",
                    items: { type: "string" },
                    description: "비교할 방법들"
                },
                criteria: {
                    type: "array",
                    items: { type: "string" },
                    description: "비교 기준 (예: assumptions, efficiency, robustness)"
                },
            },
            required: ["methods"],
        },
    },
    {
        name: "get_formula",
        description: "통계 수식 및 LaTeX 표기법 제공",
        inputSchema: {
            type: "object",
            properties: {
                concept: { type: "string", description: "개념 (예: ols_estimator, did_att, hausman_test)" },
                format: { type: "string", enum: ["latex", "text", "both"], description: "출력 형식" },
            },
            required: ["concept"],
        },
    },
    // === CATEGORY 2: Sample Size & Power (5 tools) ===
    {
        name: "calc_sample_size",
        description: "필요 표본크기 계산 (t-test, ANOVA, regression, proportion)",
        inputSchema: {
            type: "object",
            properties: {
                test_type: {
                    type: "string",
                    enum: ["t_test_two", "t_test_paired", "anova", "regression", "proportion", "chi_square"],
                    description: "검정 유형"
                },
                effect_size: { type: "number", description: "효과크기 (Cohen's d, f, f²)" },
                alpha: { type: "number", description: "유의수준 (기본: 0.05)" },
                power: { type: "number", description: "검정력 (기본: 0.80)" },
                groups: { type: "number", description: "집단 수 (ANOVA)" },
                predictors: { type: "number", description: "예측변수 수 (회귀)" },
            },
            required: ["test_type", "effect_size"],
        },
    },
    {
        name: "calc_power",
        description: "주어진 표본크기에서 검정력 계산",
        inputSchema: {
            type: "object",
            properties: {
                test_type: { type: "string", description: "검정 유형" },
                n: { type: "number", description: "표본크기" },
                effect_size: { type: "number", description: "효과크기" },
                alpha: { type: "number", description: "유의수준" },
            },
            required: ["test_type", "n", "effect_size"],
        },
    },
    {
        name: "calc_effect_size",
        description: "효과크기 계산 및 해석 (Cohen's d, η², f², OR, RR)",
        inputSchema: {
            type: "object",
            properties: {
                type: {
                    type: "string",
                    enum: ["cohens_d", "eta_squared", "f_squared", "odds_ratio", "correlation"],
                    description: "효과크기 유형"
                },
                values: { type: "object", description: "계산에 필요한 값들" },
            },
            required: ["type", "values"],
        },
    },
    {
        name: "mde_calculator",
        description: "최소탐지효과크기(MDE) 계산 - A/B 테스트, 실험설계",
        inputSchema: {
            type: "object",
            properties: {
                n_per_group: { type: "number", description: "그룹당 표본크기" },
                baseline: { type: "number", description: "기준값 (비율 또는 평균)" },
                alpha: { type: "number", description: "유의수준" },
                power: { type: "number", description: "검정력" },
                test_type: { type: "string", enum: ["proportion", "mean"], description: "검정 유형" },
            },
            required: ["n_per_group", "baseline"],
        },
    },
    {
        name: "power_curve",
        description: "검정력 곡선 데이터 생성 (시각화용)",
        inputSchema: {
            type: "object",
            properties: {
                test_type: { type: "string", description: "검정 유형" },
                n_range: { type: "array", items: { type: "number" }, description: "[최소, 최대] 표본크기" },
                effect_sizes: { type: "array", items: { type: "number" }, description: "효과크기 배열" },
                alpha: { type: "number", description: "유의수준" },
            },
            required: ["test_type", "n_range", "effect_sizes"],
        },
    },
    // === CATEGORY 3: Diagnostics & Assumptions (5 tools) ===
    {
        name: "check_assumptions",
        description: "통계 가정 점검 가이드 (정규성, 등분산, 독립성 등)",
        inputSchema: {
            type: "object",
            properties: {
                method: { type: "string", description: "분석 방법" },
                data_description: { type: "string", description: "데이터 설명" },
            },
            required: ["method"],
        },
    },
    {
        name: "diagnose_regression",
        description: "회귀분석 진단 가이드 (다중공선성, 이분산, 자기상관 등)",
        inputSchema: {
            type: "object",
            properties: {
                issues: {
                    type: "array",
                    items: { type: "string" },
                    description: "의심되는 문제 (multicollinearity, heteroscedasticity, autocorrelation, outliers)"
                },
                model_type: { type: "string", description: "모형 유형" },
            },
            required: ["issues"],
        },
    },
    {
        name: "test_selection",
        description: "적절한 통계 검정 선택 가이드",
        inputSchema: {
            type: "object",
            properties: {
                purpose: {
                    type: "string",
                    enum: ["comparison", "relationship", "prediction", "model_fit"],
                    description: "분석 목적"
                },
                variable_types: { type: "object", description: "변수 유형 정보" },
                sample_characteristics: { type: "object", description: "표본 특성" },
            },
            required: ["purpose", "variable_types"],
        },
    },
    {
        name: "interpret_diagnostics",
        description: "진단 결과 해석 (VIF, DW, BP test 등)",
        inputSchema: {
            type: "object",
            properties: {
                test_name: { type: "string", description: "진단 검정명" },
                statistic: { type: "number", description: "검정 통계량" },
                p_value: { type: "number", description: "p-value" },
                context: { type: "string", description: "분석 맥락" },
            },
            required: ["test_name", "statistic"],
        },
    },
    {
        name: "robustness_guide",
        description: "강건성 검정 가이드 (대안모형, 민감도분석)",
        inputSchema: {
            type: "object",
            properties: {
                main_analysis: { type: "string", description: "주 분석 방법" },
                concerns: { type: "array", items: { type: "string" }, description: "우려사항" },
            },
            required: ["main_analysis"],
        },
    },
    // === CATEGORY 4: Causal Inference (6 tools) ===
    {
        name: "causal_design_guide",
        description: "인과추론 설계 가이드 (DID, RDD, IV, PSM, Synth)",
        inputSchema: {
            type: "object",
            properties: {
                design: {
                    type: "string",
                    enum: ["did", "rdd", "iv", "psm", "synthetic_control", "event_study"],
                    description: "인과추론 설계"
                },
                aspect: {
                    type: "string",
                    enum: ["identification", "assumptions", "implementation", "threats", "all"],
                    description: "가이드 측면"
                },
            },
            required: ["design"],
        },
    },
    {
        name: "parallel_trends_check",
        description: "DID 평행추세 검정 가이드",
        inputSchema: {
            type: "object",
            properties: {
                pre_periods: { type: "number", description: "사전 기간 수" },
                approach: { type: "string", enum: ["visual", "statistical", "placebo"], description: "검정 방법" },
            },
            required: ["pre_periods"],
        },
    },
    {
        name: "iv_strength_check",
        description: "도구변수 강도/유효성 검정 가이드",
        inputSchema: {
            type: "object",
            properties: {
                n_instruments: { type: "number", description: "도구변수 수" },
                first_stage_f: { type: "number", description: "1단계 F-통계량" },
                overid_test: { type: "boolean", description: "과대식별 검정 필요 여부" },
            },
            required: ["n_instruments"],
        },
    },
    {
        name: "psm_guide",
        description: "성향점수매칭 가이드 (추정, 매칭, 균형검정)",
        inputSchema: {
            type: "object",
            properties: {
                matching_method: {
                    type: "string",
                    enum: ["nearest", "caliper", "kernel", "full"],
                    description: "매칭 방법"
                },
                balance_check: { type: "boolean", description: "균형검정 포함" },
            },
            required: ["matching_method"],
        },
    },
    {
        name: "rdd_bandwidth",
        description: "RDD 대역폭 선택 가이드",
        inputSchema: {
            type: "object",
            properties: {
                design: { type: "string", enum: ["sharp", "fuzzy"], description: "RDD 유형" },
                method: { type: "string", enum: ["ik", "cct", "cv"], description: "대역폭 선택 방법" },
            },
            required: ["design"],
        },
    },
    {
        name: "event_study_guide",
        description: "사건연구(Event Study) 설계 가이드",
        inputSchema: {
            type: "object",
            properties: {
                event_type: { type: "string", description: "사건 유형" },
                staggered: { type: "boolean", description: "시차적 처치 여부" },
                estimator: { type: "string", enum: ["twfe", "cs", "sa", "did_m"], description: "추정량" },
            },
            required: ["event_type"],
        },
    },
    // === CATEGORY 5: Code Generation (8 tools) ===
    {
        name: "generate_r_code",
        description: "R 코드 생성 (분석, 진단, 시각화)",
        inputSchema: {
            type: "object",
            properties: {
                analysis_type: { type: "string", description: "분석 유형" },
                variables: { type: "object", description: "변수 정보" },
                options: { type: "object", description: "추가 옵션" },
            },
            required: ["analysis_type"],
        },
    },
    {
        name: "generate_stata_code",
        description: "Stata 코드 생성 (분석, 진단, 시각화)",
        inputSchema: {
            type: "object",
            properties: {
                analysis_type: { type: "string", description: "분석 유형" },
                variables: { type: "object", description: "변수 정보" },
                options: { type: "object", description: "추가 옵션" },
            },
            required: ["analysis_type"],
        },
    },
    {
        name: "generate_python_code",
        description: "Python 코드 생성 (statsmodels, sklearn)",
        inputSchema: {
            type: "object",
            properties: {
                analysis_type: { type: "string", description: "분석 유형" },
                library: { type: "string", enum: ["statsmodels", "sklearn", "linearmodels"], description: "라이브러리" },
                variables: { type: "object", description: "변수 정보" },
            },
            required: ["analysis_type"],
        },
    },
    {
        name: "code_template",
        description: "분석 전체 워크플로우 코드 템플릿",
        inputSchema: {
            type: "object",
            properties: {
                workflow: {
                    type: "string",
                    enum: ["regression_full", "panel_full", "did_full", "meta_full", "sem_full"],
                    description: "워크플로우 유형"
                },
                language: { type: "string", enum: ["r", "stata", "python"], description: "언어" },
            },
            required: ["workflow", "language"],
        },
    },
    {
        name: "visualization_code",
        description: "시각화 코드 생성 (ggplot2, matplotlib, Stata graphs)",
        inputSchema: {
            type: "object",
            properties: {
                chart_type: {
                    type: "string",
                    enum: ["coefficient_plot", "marginal_effects", "residual_plot", "power_curve", "forest_plot"],
                    description: "차트 유형"
                },
                language: { type: "string", enum: ["r", "stata", "python"], description: "언어" },
                customization: { type: "object", description: "커스터마이징 옵션" },
            },
            required: ["chart_type", "language"],
        },
    },
    {
        name: "table_code",
        description: "결과표 생성 코드 (stargazer, esttab, pandas)",
        inputSchema: {
            type: "object",
            properties: {
                table_type: {
                    type: "string",
                    enum: ["descriptive", "regression", "correlation", "balance"],
                    description: "표 유형"
                },
                format: { type: "string", enum: ["latex", "html", "word", "markdown"], description: "출력 형식" },
                language: { type: "string", enum: ["r", "stata", "python"], description: "언어" },
            },
            required: ["table_type", "format", "language"],
        },
    },
    {
        name: "debug_code",
        description: "통계 코드 디버깅 도움",
        inputSchema: {
            type: "object",
            properties: {
                code: { type: "string", description: "문제 코드" },
                error_message: { type: "string", description: "에러 메시지" },
                language: { type: "string", enum: ["r", "stata", "python"], description: "언어" },
            },
            required: ["code", "error_message", "language"],
        },
    },
    {
        name: "optimize_code",
        description: "대용량 데이터용 코드 최적화 제안",
        inputSchema: {
            type: "object",
            properties: {
                code: { type: "string", description: "최적화할 코드" },
                data_size: { type: "string", description: "데이터 크기 (행 수, GB)" },
                language: { type: "string", enum: ["r", "stata", "python"], description: "언어" },
            },
            required: ["code", "language"],
        },
    },
    // === CATEGORY 6: Results Interpretation (5 tools) ===
    {
        name: "interpret_coefficient",
        description: "회귀계수 해석 가이드 (OLS, Logit, 상호작용 등)",
        inputSchema: {
            type: "object",
            properties: {
                model_type: { type: "string", description: "모형 유형" },
                coefficient: { type: "number", description: "계수값" },
                se: { type: "number", description: "표준오차" },
                variable_type: { type: "string", enum: ["continuous", "binary", "categorical", "interaction"], description: "변수 유형" },
                transformation: { type: "string", enum: ["none", "log", "standardized"], description: "변환" },
            },
            required: ["model_type", "coefficient"],
        },
    },
    {
        name: "interpret_model_fit",
        description: "모형적합도 해석 (R², AIC, BIC, Pseudo-R²)",
        inputSchema: {
            type: "object",
            properties: {
                metrics: { type: "object", description: "적합도 지표들" },
                model_type: { type: "string", description: "모형 유형" },
                comparison: { type: "boolean", description: "모형 비교 여부" },
            },
            required: ["metrics", "model_type"],
        },
    },
    {
        name: "marginal_effects_guide",
        description: "한계효과 계산 및 해석 가이드",
        inputSchema: {
            type: "object",
            properties: {
                model_type: { type: "string", enum: ["logit", "probit", "poisson", "tobit"], description: "모형" },
                effect_type: { type: "string", enum: ["ame", "mem", "mer"], description: "한계효과 유형" },
                interaction: { type: "boolean", description: "상호작용항 포함" },
            },
            required: ["model_type"],
        },
    },
    {
        name: "interpret_test",
        description: "통계 검정 결과 해석",
        inputSchema: {
            type: "object",
            properties: {
                test_name: { type: "string", description: "검정명" },
                statistic: { type: "number", description: "검정통계량" },
                p_value: { type: "number", description: "p-value" },
                df: { type: "number", description: "자유도" },
                context: { type: "string", description: "맥락" },
            },
            required: ["test_name", "p_value"],
        },
    },
    {
        name: "write_results_section",
        description: "결과 섹션 작성 템플릿 생성",
        inputSchema: {
            type: "object",
            properties: {
                analysis_type: { type: "string", description: "분석 유형" },
                results: { type: "object", description: "주요 결과" },
                style: { type: "string", enum: ["apa", "asa", "econometrica"], description: "스타일" },
            },
            required: ["analysis_type", "results"],
        },
    },
    // === CATEGORY 7: Meta-Analysis (4 tools) ===
    {
        name: "meta_effect_size",
        description: "메타분석용 효과크기 계산 및 변환",
        inputSchema: {
            type: "object",
            properties: {
                input_type: {
                    type: "string",
                    enum: ["means_sd", "t_value", "f_value", "correlation", "odds_ratio", "proportion"],
                    description: "입력 유형"
                },
                values: { type: "object", description: "입력값" },
                target_metric: { type: "string", description: "변환 목표 지표" },
            },
            required: ["input_type", "values"],
        },
    },
    {
        name: "meta_heterogeneity",
        description: "메타분석 이질성 해석 (Q, I², τ²)",
        inputSchema: {
            type: "object",
            properties: {
                q_stat: { type: "number", description: "Q 통계량" },
                i_squared: { type: "number", description: "I² 값" },
                tau_squared: { type: "number", description: "τ² 값" },
                k: { type: "number", description: "연구 수" },
            },
            required: ["i_squared", "k"],
        },
    },
    {
        name: "publication_bias",
        description: "출판편향 검정 가이드",
        inputSchema: {
            type: "object",
            properties: {
                methods: {
                    type: "array",
                    items: { type: "string" },
                    description: "검정 방법 (funnel_plot, egger, trim_fill, selection_model)"
                },
                k: { type: "number", description: "연구 수" },
            },
            required: ["methods"],
        },
    },
    {
        name: "meta_code",
        description: "메타분석 코드 생성 (metafor, meta, metan)",
        inputSchema: {
            type: "object",
            properties: {
                analysis: {
                    type: "string",
                    enum: ["basic_ma", "meta_regression", "subgroup", "sensitivity"],
                    description: "분석 유형"
                },
                effect_measure: { type: "string", description: "효과크기 지표" },
                language: { type: "string", enum: ["r", "stata"], description: "언어" },
            },
            required: ["analysis", "language"],
        },
    },
    // === CATEGORY 8: Reporting & Publication (5 tools) ===
    {
        name: "journal_guide",
        description: "저널별 통계 보고 가이드",
        inputSchema: {
            type: "object",
            properties: {
                journal: {
                    type: "string",
                    enum: ["econometrica", "aer", "jfe", "ms", "smj", "amj", "jf", "rfs"],
                    description: "목표 저널"
                },
                method: { type: "string", description: "사용 방법론" },
            },
            required: ["journal"],
        },
    },
    {
        name: "apa_reporting",
        description: "APA 스타일 통계 보고 템플릿",
        inputSchema: {
            type: "object",
            properties: {
                test_type: { type: "string", description: "검정 유형" },
                results: { type: "object", description: "결과 값들" },
            },
            required: ["test_type", "results"],
        },
    },
    {
        name: "prereg_template",
        description: "사전등록 템플릿 생성 (OSF, AsPredicted)",
        inputSchema: {
            type: "object",
            properties: {
                platform: { type: "string", enum: ["osf", "aspredicted"], description: "플랫폼" },
                study_type: { type: "string", enum: ["experiment", "observational", "replication"], description: "연구 유형" },
                hypotheses: { type: "array", items: { type: "string" }, description: "가설 목록" },
            },
            required: ["platform", "study_type"],
        },
    },
    {
        name: "replication_package",
        description: "재현성 패키지 구조 가이드",
        inputSchema: {
            type: "object",
            properties: {
                journal: { type: "string", description: "목표 저널" },
                components: {
                    type: "array",
                    items: { type: "string" },
                    description: "포함 요소 (code, data, readme, codebook)"
                },
            },
            required: ["components"],
        },
    },
    {
        name: "reviewer_response",
        description: "리뷰어 통계 지적 대응 가이드",
        inputSchema: {
            type: "object",
            properties: {
                critique_type: {
                    type: "string",
                    enum: ["endogeneity", "selection", "measurement", "robustness", "sample_size", "identification"],
                    description: "지적 유형"
                },
                current_method: { type: "string", description: "현재 사용 방법" },
                data_constraints: { type: "string", description: "데이터 제약" },
            },
            required: ["critique_type", "current_method"],
        },
    },
    // === CATEGORY 9: Advanced Methods (5 tools) ===
    {
        name: "sem_guide",
        description: "구조방정식모형 가이드 (측정모형, 구조모형)",
        inputSchema: {
            type: "object",
            properties: {
                model_type: { type: "string", enum: ["cfa", "path", "full_sem", "multigroup"], description: "모형 유형" },
                fit_indices: { type: "object", description: "적합도 지수" },
            },
            required: ["model_type"],
        },
    },
    {
        name: "mlm_guide",
        description: "다층모형 가이드 (ICC, 랜덤효과, 교차수준 상호작용)",
        inputSchema: {
            type: "object",
            properties: {
                levels: { type: "number", description: "수준 수 (2 or 3)" },
                random_effects: { type: "array", items: { type: "string" }, description: "랜덤효과" },
                cross_level: { type: "boolean", description: "교차수준 상호작용" },
            },
            required: ["levels"],
        },
    },
    {
        name: "bayesian_guide",
        description: "베이지안 분석 가이드 (사전분포, 수렴진단, 해석)",
        inputSchema: {
            type: "object",
            properties: {
                analysis_type: { type: "string", description: "분석 유형" },
                prior_type: { type: "string", enum: ["uninformative", "weakly_informative", "informative"], description: "사전분포" },
                convergence: { type: "boolean", description: "수렴진단 포함" },
            },
            required: ["analysis_type"],
        },
    },
    {
        name: "ml_for_causal",
        description: "인과추론용 ML 가이드 (Double ML, Causal Forest)",
        inputSchema: {
            type: "object",
            properties: {
                method: { type: "string", enum: ["double_ml", "causal_forest", "lasso_iv", "honest_tree"], description: "방법" },
                target: { type: "string", enum: ["ate", "att", "cate", "late"], description: "추정 대상" },
            },
            required: ["method"],
        },
    },
    {
        name: "timeseries_guide",
        description: "시계열 분석 가이드 (ARIMA, VAR, 공적분)",
        inputSchema: {
            type: "object",
            properties: {
                analysis: { type: "string", enum: ["arima", "var", "vecm", "garch", "state_space"], description: "분석 유형" },
                stationarity: { type: "boolean", description: "정상성 검정 포함" },
            },
            required: ["analysis"],
        },
    },
    // === CATEGORY 10: File Operations (2 tools) ===
    {
        name: "write_analysis_file",
        description: "분석 코드/결과를 파일로 저장",
        inputSchema: {
            type: "object",
            properties: {
                content: { type: "string", description: "파일 내용" },
                filename: { type: "string", description: "파일명" },
                directory: { type: "string", description: "저장 디렉토리" },
                encoding: { type: "string", description: "인코딩 (기본: utf-8)" },
            },
            required: ["content", "filename"],
        },
    },
    {
        name: "create_project_structure",
        description: "연구 프로젝트 폴더 구조 생성",
        inputSchema: {
            type: "object",
            properties: {
                project_name: { type: "string", description: "프로젝트명" },
                base_path: { type: "string", description: "기본 경로" },
                template: { type: "string", enum: ["basic", "replication", "full"], description: "템플릿" },
            },
            required: ["project_name", "base_path"],
        },
    },
];
// ============================================================
// Tool Handler Implementation
// ============================================================
export async function handleToolCall(name, args) {
    switch (name) {
        // Knowledge Search
        case "search_stats_knowledge":
            return await handleSearchKnowledge(args);
        case "get_method_guide":
            return await handleGetMethodGuide(args);
        case "suggest_method":
            return await handleSuggestMethod(args);
        case "compare_methods":
            return handleCompareMethods(args);
        case "get_formula":
            return handleGetFormula(args);
        // Sample Size & Power
        case "calc_sample_size":
            return handleCalcSampleSize(args);
        case "calc_power":
            return handleCalcPower(args);
        case "calc_effect_size":
            return handleCalcEffectSize(args);
        case "mde_calculator":
            return handleMdeCalculator(args);
        case "power_curve":
            return handlePowerCurve(args);
        // Diagnostics
        case "check_assumptions":
            return handleCheckAssumptions(args);
        case "diagnose_regression":
            return handleDiagnoseRegression(args);
        case "test_selection":
            return handleTestSelection(args);
        case "interpret_diagnostics":
            return handleInterpretDiagnostics(args);
        case "robustness_guide":
            return handleRobustnessGuide(args);
        // Causal Inference
        case "causal_design_guide":
            return handleCausalDesignGuide(args);
        case "parallel_trends_check":
            return handleParallelTrendsCheck(args);
        case "iv_strength_check":
            return handleIvStrengthCheck(args);
        case "psm_guide":
            return handlePsmGuide(args);
        case "rdd_bandwidth":
            return handleRddBandwidth(args);
        case "event_study_guide":
            return handleEventStudyGuide(args);
        // Code Generation
        case "generate_r_code":
            return handleGenerateRCode(args);
        case "generate_stata_code":
            return handleGenerateStataCode(args);
        case "generate_python_code":
            return handleGeneratePythonCode(args);
        case "code_template":
            return handleCodeTemplate(args);
        case "visualization_code":
            return handleVisualizationCode(args);
        case "table_code":
            return handleTableCode(args);
        case "debug_code":
            return handleDebugCode(args);
        case "optimize_code":
            return handleOptimizeCode(args);
        // Results Interpretation
        case "interpret_coefficient":
            return handleInterpretCoefficient(args);
        case "interpret_model_fit":
            return handleInterpretModelFit(args);
        case "marginal_effects_guide":
            return handleMarginalEffectsGuide(args);
        case "interpret_test":
            return handleInterpretTest(args);
        case "write_results_section":
            return handleWriteResultsSection(args);
        // Meta-Analysis
        case "meta_effect_size":
            return handleMetaEffectSize(args);
        case "meta_heterogeneity":
            return handleMetaHeterogeneity(args);
        case "publication_bias":
            return handlePublicationBias(args);
        case "meta_code":
            return handleMetaCode(args);
        // Reporting
        case "journal_guide":
            return handleJournalGuide(args);
        case "apa_reporting":
            return handleApaReporting(args);
        case "prereg_template":
            return handlePreregTemplate(args);
        case "replication_package":
            return handleReplicationPackage(args);
        case "reviewer_response":
            return handleReviewerResponse(args);
        // Advanced Methods
        case "sem_guide":
            return handleSemGuide(args);
        case "mlm_guide":
            return handleMlmGuide(args);
        case "bayesian_guide":
            return handleBayesianGuide(args);
        case "ml_for_causal":
            return handleMlForCausal(args);
        case "timeseries_guide":
            return handleTimeseriesGuide(args);
        // File Operations
        case "write_analysis_file":
            return handleWriteAnalysisFile(args);
        case "create_project_structure":
            return handleCreateProjectStructure(args);
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}
// ============================================================
// Handler Implementations (Core Examples)
// ============================================================
async function handleSearchKnowledge(args) {
    const query = args.query;
    const category = args.category || "all";
    const nResults = args.n_results || 5;
    const results = await searchKnowledgeBase(query, category, nResults);
    return {
        query,
        category,
        results_count: results.length,
        results: results.map(r => ({
            content: r.content.substring(0, 500),
            source: r.metadata.source || "knowledge_base",
            relevance: r.distance ? (1 - r.distance).toFixed(3) : "N/A"
        }))
    };
}
async function handleGetMethodGuide(args) {
    const method = args.method;
    const aspect = args.aspect || "all";
    const methodGuides = {
        ols: {
            name: "Ordinary Least Squares (OLS)",
            assumptions: [
                "1. Linearity: E(Y|X) = Xβ",
                "2. Random Sampling: i.i.d. observations",
                "3. No Perfect Multicollinearity: rank(X) = k",
                "4. Zero Conditional Mean: E(ε|X) = 0",
                "5. Homoscedasticity: Var(ε|X) = σ²",
                "6. Normality (for inference): ε ~ N(0, σ²)"
            ],
            procedure: [
                "1. Specify the model: Y = β₀ + β₁X₁ + ... + βₖXₖ + ε",
                "2. Check data (missing, outliers, distributions)",
                "3. Estimate: β̂ = (X'X)⁻¹X'Y",
                "4. Diagnostics: residual plots, VIF, normality tests",
                "5. Interpret coefficients and significance",
                "6. Report with robust standard errors if needed"
            ],
            interpretation: {
                coefficient: "1단위 X 증가 → β 단위 Y 변화 (다른 변수 통제)",
                r_squared: "설명된 분산 비율 (0-1)",
                f_test: "전체 모형 유의성",
                t_test: "개별 계수 유의성"
            },
            reporting: "β = X.XX, SE = X.XX, t = X.XX, p < .05, 95% CI [X.XX, X.XX]"
        },
        panel_fe: {
            name: "Panel Fixed Effects",
            assumptions: [
                "1. Strict Exogeneity: E(εᵢₜ|Xᵢ₁,...,Xᵢₜ,αᵢ) = 0",
                "2. Time-invariant unobserved heterogeneity: αᵢ",
                "3. No perfect multicollinearity within entities",
                "4. Sufficient within-variation in X"
            ],
            procedure: [
                "1. Demean: ỹᵢₜ = yᵢₜ - ȳᵢ, x̃ᵢₜ = xᵢₜ - x̄ᵢ",
                "2. Estimate: ỹᵢₜ = x̃ᵢₜβ + (εᵢₜ - ε̄ᵢ)",
                "3. Cluster standard errors at entity level",
                "4. Hausman test vs Random Effects"
            ],
            interpretation: {
                coefficient: "개체 내 X 변화 → Y 변화 (개체 고정효과 통제)",
                limitation: "시간불변 변수 효과 추정 불가"
            },
            reporting: "β = X.XX (cluster SE), entity FE: Yes, time FE: Yes/No"
        },
        did: {
            name: "Difference-in-Differences",
            assumptions: [
                "1. Parallel Trends: 처치 없었다면 동일한 추세",
                "2. No Anticipation: 사전 처치 효과 없음",
                "3. SUTVA: 처치 간 간섭 없음",
                "4. No Composition Change: 그룹 구성 안정"
            ],
            procedure: [
                "1. Basic 2x2: Y = β₀ + β₁Post + β₂Treat + β₃(Post×Treat) + ε",
                "2. Pre-trend test: 사전 기간 평행추세 확인",
                "3. Event study: 시간별 처치효과 추정",
                "4. Staggered DID: CS, SA, or did_imputation if staggered"
            ],
            interpretation: {
                att: "β₃ = E[Y(1)-Y(0)|Treat=1] = 처치집단 처치효과",
                event_study: "각 시점별 처치효과 (동적 효과)"
            },
            reporting: "ATT = X.XX (SE), Pre-trend p = X.XX, N = X,XXX"
        }
    };
    const guide = methodGuides[method.toLowerCase()] || {
        message: `'${method}' 가이드가 Knowledge Base에서 검색됩니다.`,
        suggestion: "search_stats_knowledge 도구로 검색해보세요."
    };
    if (aspect !== "all" && guide[aspect]) {
        return { method, aspect, guide: guide[aspect] };
    }
    return { method, guide };
}
function handleSuggestMethod(args) {
    const dvType = args.dv_type;
    const dataStructure = args.data_structure || "cross_sectional";
    const causalDesign = args.causal_design || "none";
    const suggestions = {
        continuous: {
            cross_sectional: {
                observational: ["OLS Regression", "Robust Regression"],
                quasi_experimental: ["Propensity Score Matching", "IV/2SLS"],
                experimental: ["t-test", "ANOVA", "OLS with controls"]
            },
            panel: {
                observational: ["Panel FE/RE", "Correlated Random Effects"],
                quasi_experimental: ["DID", "Synthetic Control", "Event Study"]
            },
            time_series: {
                observational: ["ARIMA", "VAR", "VECM"],
                quasi_experimental: ["Interrupted Time Series", "Event Study"]
            }
        },
        binary: {
            cross_sectional: {
                observational: ["Logistic Regression", "Probit"],
                quasi_experimental: ["PSM + Logit", "IV Probit"]
            },
            panel: {
                observational: ["Conditional Logit (FE)", "Random Effects Logit"],
                quasi_experimental: ["DID Logit", "Linear Probability Model + FE"]
            }
        },
        count: {
            cross_sectional: {
                observational: ["Poisson", "Negative Binomial", "Zero-Inflated"]
            },
            panel: {
                observational: ["FE Poisson", "FE Negative Binomial"]
            }
        }
    };
    const methodList = suggestions[dvType]?.[dataStructure]?.[causalDesign] ||
        suggestions[dvType]?.[dataStructure]?.["observational"] ||
        ["검색 필요: search_stats_knowledge 사용"];
    return {
        research_question: args.research_question,
        dv_type: dvType,
        data_structure: dataStructure,
        causal_design: causalDesign,
        recommended_methods: methodList,
        considerations: [
            "데이터 크기와 분포 확인 필요",
            "가정 검토 (내생성, 선택편의 등)",
            "robustness check 계획 수립"
        ]
    };
}
function handleCompareMethods(args) {
    const methods = args.methods;
    const comparison = {
        fe_vs_re: {
            methods: ["Fixed Effects", "Random Effects"],
            key_difference: "FE는 개체 고정효과와 X 상관 허용, RE는 비상관 가정",
            decision: "Hausman test: H₀ 기각 → FE, H₀ 수용 → RE (효율성)",
            tradeoff: "FE: 일관성 | RE: 효율성 (시간불변 변수 추정 가능)"
        },
        did_vs_scm: {
            methods: ["DID", "Synthetic Control"],
            key_difference: "DID는 다수 처치/통제, SCM은 단일 처치 단위에 적합",
            decision: "처치 단위 수: 1 → SCM, 다수 → DID",
            tradeoff: "DID: 통계 검정 용이 | SCM: 평행추세 가정 완화"
        },
        psm_vs_iv: {
            methods: ["PSM", "IV/2SLS"],
            key_difference: "PSM은 관찰변수 통제, IV는 비관찰 내생성 해결",
            decision: "Selection on observables → PSM, Selection on unobservables → IV",
            tradeoff: "PSM: 도구변수 불필요 | IV: 비관찰 교란 통제"
        }
    };
    const methodKey = methods.sort().join("_vs_");
    const result = comparison[methodKey] || {
        methods,
        message: "상세 비교를 위해 search_stats_knowledge 도구 사용을 권장합니다."
    };
    return result;
}
function handleGetFormula(args) {
    const concept = args.concept;
    const format = args.format || "both";
    const formulas = {
        ols_estimator: {
            latex: "\\hat{\\beta} = (X'X)^{-1}X'Y",
            text: "β̂ = (X'X)⁻¹X'Y"
        },
        did_att: {
            latex: "\\text{ATT} = (\\bar{Y}_{T,post} - \\bar{Y}_{T,pre}) - (\\bar{Y}_{C,post} - \\bar{Y}_{C,pre})",
            text: "ATT = (Ȳ_T,post - Ȳ_T,pre) - (Ȳ_C,post - Ȳ_C,pre)"
        },
        hausman_test: {
            latex: "H = (\\hat{\\beta}_{FE} - \\hat{\\beta}_{RE})'[Var(\\hat{\\beta}_{FE}) - Var(\\hat{\\beta}_{RE})]^{-1}(\\hat{\\beta}_{FE} - \\hat{\\beta}_{RE})",
            text: "H = (β̂_FE - β̂_RE)'[Var(β̂_FE) - Var(β̂_RE)]⁻¹(β̂_FE - β̂_RE) ~ χ²(k)"
        },
        cohens_d: {
            latex: "d = \\frac{\\bar{X}_1 - \\bar{X}_2}{S_{pooled}}",
            text: "d = (X̄₁ - X̄₂) / S_pooled"
        },
        r_squared: {
            latex: "R^2 = 1 - \\frac{SS_{res}}{SS_{tot}} = 1 - \\frac{\\sum(y_i - \\hat{y}_i)^2}{\\sum(y_i - \\bar{y})^2}",
            text: "R² = 1 - (SS_res / SS_tot)"
        }
    };
    const formula = formulas[concept.toLowerCase()];
    if (!formula) {
        return { concept, error: "Formula not found. Try: ols_estimator, did_att, hausman_test, cohens_d, r_squared" };
    }
    if (format === "latex")
        return { concept, latex: formula.latex };
    if (format === "text")
        return { concept, text: formula.text };
    return { concept, ...formula };
}
function handleCalcSampleSize(args) {
    const testType = args.test_type;
    const effectSize = args.effect_size;
    const alpha = args.alpha || 0.05;
    const power = args.power || 0.80;
    // Simplified sample size formulas
    const zAlpha = alpha === 0.05 ? 1.96 : (alpha === 0.01 ? 2.576 : 1.645);
    const zBeta = power === 0.80 ? 0.84 : (power === 0.90 ? 1.28 : 0.52);
    let n;
    let formula;
    switch (testType) {
        case "t_test_two":
            n = Math.ceil(2 * ((zAlpha + zBeta) / effectSize) ** 2);
            formula = "n per group = 2 × ((z_α + z_β) / d)²";
            break;
        case "t_test_paired":
            n = Math.ceil(((zAlpha + zBeta) / effectSize) ** 2);
            formula = "n = ((z_α + z_β) / d)²";
            break;
        case "anova":
            const groups = args.groups || 3;
            n = Math.ceil((groups * (zAlpha + zBeta) ** 2) / (effectSize ** 2));
            formula = "n per group = k × (z_α + z_β)² / f²";
            break;
        case "regression":
            const predictors = args.predictors || 5;
            n = Math.ceil((8 / (effectSize ** 2)) + predictors);
            formula = "n ≈ 8/f² + k (Green, 1991 rule)";
            break;
        default:
            n = Math.ceil(2 * ((zAlpha + zBeta) / effectSize) ** 2);
            formula = "Generic formula used";
    }
    return {
        test_type: testType,
        effect_size: effectSize,
        alpha,
        power,
        required_n: n,
        formula,
        interpretation: `${power * 100}% 검정력으로 효과크기 ${effectSize} 탐지에 필요한 최소 표본: ${n}`,
        note: "실제 계산은 G*Power 또는 pwr 패키지 사용 권장"
    };
}
function handleCalcPower(args) {
    const n = args.n;
    const effectSize = args.effect_size;
    const alpha = args.alpha || 0.05;
    // Simplified power calculation using helper function
    const power = calculatePower(n, effectSize, alpha);
    return {
        n,
        effect_size: effectSize,
        alpha,
        estimated_power: Math.min(power, 0.999).toFixed(3),
        interpretation: power >= 0.80 ? "적절한 검정력 (≥80%)" : "낮은 검정력 - 표본 증가 권장",
        r_code: `pwr.t.test(n = ${n}, d = ${effectSize}, sig.level = ${alpha}, type = "two.sample")`
    };
}
function handleCalcEffectSize(args) {
    const type = args.type;
    const values = args.values;
    let result = { type };
    switch (type) {
        case "cohens_d":
            if (values.mean1 && values.mean2 && values.sd_pooled) {
                result.effect_size = ((values.mean1 - values.mean2) / values.sd_pooled).toFixed(3);
            }
            else if (values.t && values.n1 && values.n2) {
                result.effect_size = (values.t * Math.sqrt((values.n1 + values.n2) / (values.n1 * values.n2))).toFixed(3);
            }
            result.interpretation = {
                small: "0.2", medium: "0.5", large: "0.8"
            };
            break;
        case "eta_squared":
            if (values.ss_effect && values.ss_total) {
                result.effect_size = (values.ss_effect / values.ss_total).toFixed(3);
            }
            result.interpretation = {
                small: "0.01", medium: "0.06", large: "0.14"
            };
            break;
        case "f_squared":
            if (values.r_squared) {
                result.effect_size = (values.r_squared / (1 - values.r_squared)).toFixed(3);
            }
            result.interpretation = {
                small: "0.02", medium: "0.15", large: "0.35"
            };
            break;
        case "odds_ratio":
            if (values.or) {
                result.effect_size = values.or;
                result.cohens_d_approx = (Math.log(values.or) * Math.sqrt(3) / Math.PI).toFixed(3);
            }
            break;
    }
    return result;
}
function handleMdeCalculator(args) {
    const nPerGroup = args.n_per_group;
    const baseline = args.baseline;
    const alpha = args.alpha || 0.05;
    const power = args.power || 0.80;
    const testType = args.test_type || "proportion";
    const zAlpha = 1.96;
    const zBeta = 0.84;
    let mde;
    if (testType === "proportion") {
        const se = Math.sqrt(2 * baseline * (1 - baseline) / nPerGroup);
        mde = (zAlpha + zBeta) * se;
    }
    else {
        mde = (zAlpha + zBeta) / Math.sqrt(nPerGroup / 2);
    }
    return {
        n_per_group: nPerGroup,
        baseline,
        alpha,
        power,
        mde: mde.toFixed(4),
        mde_percentage: (mde / baseline * 100).toFixed(2) + "%",
        interpretation: `현재 표본으로 baseline 대비 ${(mde / baseline * 100).toFixed(1)}% 차이 탐지 가능`
    };
}
function handlePowerCurve(args) {
    const nRange = args.n_range;
    const effectSizes = args.effect_sizes;
    const alpha = args.alpha || 0.05;
    const curveData = [];
    const nMin = nRange[0];
    const nMax = nRange[1];
    const step = Math.ceil((nMax - nMin) / 20);
    for (let n = nMin; n <= nMax; n += step) {
        for (const d of effectSizes) {
            const power = calculatePower(n, d, alpha);
            curveData.push({ n, effect_size: d, power: Math.min(power, 0.999).toFixed(3) });
        }
    }
    return {
        alpha,
        n_range: nRange,
        effect_sizes: effectSizes,
        curve_data: curveData,
        r_code: `library(pwr)\npower_curve <- pwr.t.test(n = seq(${nMin}, ${nMax}, by=${step}), d = c(${effectSizes.join(", ")}), sig.level = ${alpha}, type = "two.sample")`
    };
}
// Placeholder implementations for remaining handlers
function handleCheckAssumptions(args) {
    const method = args.method;
    return {
        method,
        assumptions_checklist: {
            ols: ["Linearity", "Normality of residuals", "Homoscedasticity", "Independence", "No multicollinearity"],
            logit: ["Binary DV", "Independence", "No multicollinearity", "Linearity in logit"],
            panel_fe: ["Strict exogeneity", "Time-invariant heterogeneity", "Within-variation"]
        }[method] || ["Method-specific assumptions - use search_stats_knowledge"],
        diagnostic_tests: ["검정 목록은 diagnose_regression 도구 사용"]
    };
}
function handleDiagnoseRegression(args) {
    const issues = args.issues;
    const diagnostics = {
        multicollinearity: {
            tests: ["VIF (>10 문제)", "Condition Number (>30 문제)", "Correlation Matrix"],
            r_code: "car::vif(model)",
            stata_code: "vif",
            solution: "변수 제거, PCA, Ridge regression"
        },
        heteroscedasticity: {
            tests: ["Breusch-Pagan test", "White test", "Residual plot"],
            r_code: "lmtest::bptest(model)",
            stata_code: "hettest",
            solution: "Robust SE, WLS, Log transformation"
        },
        autocorrelation: {
            tests: ["Durbin-Watson", "Breusch-Godfrey", "ACF plot"],
            r_code: "lmtest::dwtest(model)",
            stata_code: "dwstat",
            solution: "HAC SE, GLS, ARIMA errors"
        }
    };
    return {
        issues,
        diagnostics: issues.map(issue => diagnostics[issue] || { issue, message: "진단 정보 검색 필요" })
    };
}
function handleTestSelection(args) {
    return { args, suggestion: "Variable types에 따른 검정 추천 - 상세 구현 필요" };
}
function handleInterpretDiagnostics(args) {
    const testName = args.test_name;
    const pValue = args.p_value;
    const interpretations = {
        "hausman": pValue < 0.05 ? "FE 사용 권장 (RE 불일치)" : "RE 사용 가능 (더 효율적)",
        "breusch_pagan": pValue < 0.05 ? "이분산 존재 - Robust SE 사용" : "등분산 가정 충족",
        "durbin_watson": "DW≈2: 자기상관 없음, DW<1.5 또는 >2.5: 자기상관 의심"
    };
    return {
        test: testName,
        p_value: pValue,
        interpretation: interpretations[testName.toLowerCase()] || "검정 결과 해석 필요"
    };
}
function handleRobustnessGuide(args) {
    return {
        main_analysis: args.main_analysis,
        robustness_checks: [
            "Alternative specifications (different controls)",
            "Different estimation methods",
            "Sample restrictions (outliers, subgroups)",
            "Alternative measures of key variables",
            "Placebo tests"
        ]
    };
}
function handleCausalDesignGuide(args) {
    const design = args.design;
    const guides = {
        did: {
            identification: "Parallel Trends Assumption",
            key_tests: ["Pre-trend test", "Placebo test", "Event study"],
            threats: ["Anticipation", "Spillover", "Composition change"],
            stata: "did_imputation, csdid, reghdfe",
            r: "did, fixest::feols"
        },
        rdd: {
            identification: "Local randomization at cutoff",
            key_tests: ["McCrary density test", "Covariate balance at cutoff"],
            threats: ["Manipulation", "Compound treatment"],
            stata: "rdrobust",
            r: "rdrobust, rdd"
        },
        iv: {
            identification: "Exclusion restriction + Relevance",
            key_tests: ["First-stage F (>10)", "Overidentification (Sargan/Hansen)"],
            threats: ["Weak instruments", "Invalid exclusion"],
            stata: "ivreg2, ivregress",
            r: "ivreg, fixest::feols"
        }
    };
    return { design, guide: guides[design] || { message: "Design guide not found" } };
}
function handleParallelTrendsCheck(args) {
    return {
        pre_periods: args.pre_periods,
        approaches: {
            visual: "사전 기간 처치/통제 그룹 추세 비교 그래프",
            statistical: "사전 기간 시간×처치 상호작용항 유의성 검정",
            placebo: "가짜 처치 시점에서 효과 없음 확인"
        },
        r_code: "feols(y ~ i(time, treat, ref = -1) | id + time, data)",
        stata_code: "reghdfe y i.time#1.treat, absorb(id time) cluster(id)"
    };
}
function handleIvStrengthCheck(args) {
    const firstStageF = args.first_stage_f;
    return {
        first_stage_f: firstStageF,
        interpretation: firstStageF >= 10 ? "Strong instrument" : "Weak instrument concern",
        additional_tests: [
            "Stock-Yogo critical values",
            "Anderson-Rubin confidence sets (robust to weak IV)",
            "LIML estimator (less biased with weak IV)"
        ]
    };
}
function handlePsmGuide(args) {
    return {
        matching_method: args.matching_method,
        steps: [
            "1. Propensity score estimation (logit/probit)",
            "2. Check common support",
            "3. Perform matching",
            "4. Balance check (standardized differences <0.1)",
            "5. Estimate treatment effect on matched sample"
        ],
        balance_metrics: ["Standardized mean difference", "Variance ratio", "Overlap plots"]
    };
}
function handleRddBandwidth(args) {
    return {
        design: args.design,
        methods: {
            ik: "Imbens-Kalyanaraman (2012) - 기본 선택",
            cct: "Calonico-Cattaneo-Titiunik (2014) - bias correction",
            cv: "Cross-validation - 데이터 기반"
        },
        stata: "rdrobust y x, c(0) kernel(triangular)",
        r: "rdrobust(Y, X, c = 0)"
    };
}
function handleEventStudyGuide(args) {
    return {
        event_type: args.event_type,
        staggered: args.staggered,
        estimators: {
            twfe: "Two-way FE (동질적 처치효과 시)",
            cs: "Callaway-Sant'Anna (이질적 처치효과)",
            sa: "Sun-Abraham (이질적 처치효과)",
            did_m: "de Chaisemartin-D'Haultfoeuille"
        },
        recommendation: args.staggered ? "CS 또는 SA 추정량 권장" : "TWFE 사용 가능"
    };
}
function handleGenerateRCode(args) {
    const analysisType = args.analysis_type;
    const templates = {
        ols: `
# OLS Regression
library(tidyverse)
library(fixest)
library(modelsummary)

# Estimate
model <- lm(y ~ x1 + x2 + x3, data = df)

# Robust SE
model_robust <- feols(y ~ x1 + x2 + x3, data = df, vcov = "hetero")

# Diagnostics
car::vif(model)  # Multicollinearity
lmtest::bptest(model)  # Heteroscedasticity

# Results table
modelsummary(list("OLS" = model, "Robust" = model_robust))
`,
        panel_fe: `
# Panel Fixed Effects
library(fixest)
library(modelsummary)

# Entity FE
model_fe <- feols(y ~ x1 + x2 | id, data = panel_df, vcov = ~id)

# Entity + Time FE
model_twfe <- feols(y ~ x1 + x2 | id + year, data = panel_df, vcov = ~id)

# Results
modelsummary(list("Entity FE" = model_fe, "TWFE" = model_twfe))
`,
        did: `
# Difference-in-Differences
library(fixest)
library(did)

# Basic DID
did_model <- feols(y ~ treat:post | id + time, data = df, vcov = ~id)

# Event Study
es_model <- feols(y ~ i(time, treat, ref = -1) | id + time, data = df, vcov = ~id)
iplot(es_model)

# Callaway-Sant'Anna (staggered)
cs_did <- att_gt(yname = "y", tname = "time", idname = "id",
                  gname = "first_treat", data = df)
aggte(cs_did, type = "dynamic") |> ggdid()
`
    };
    return {
        analysis_type: analysisType,
        r_code: templates[analysisType] || "# Analysis template not found\n# Use search_stats_knowledge for guidance"
    };
}
function handleGenerateStataCode(args) {
    const analysisType = args.analysis_type;
    const templates = {
        ols: `
* OLS Regression
reg y x1 x2 x3

* Robust SE
reg y x1 x2 x3, robust

* Diagnostics
vif
hettest
ovtest
`,
        panel_fe: `
* Panel Setup
xtset id time

* Fixed Effects
xtreg y x1 x2, fe cluster(id)

* Two-way FE (reghdfe)
reghdfe y x1 x2, absorb(id time) cluster(id)

* Hausman test
xtreg y x1 x2, fe
estimates store fe
xtreg y x1 x2, re
hausman fe
`,
        did: `
* Basic DID
gen treat_post = treat * post
reg y treat post treat_post, cluster(id)

* reghdfe
reghdfe y treat_post, absorb(id time) cluster(id)

* Event Study
forvalues t = -5/5 {
    gen treat_t\`t' = treat * (time == event_time + \`t')
}
reghdfe y treat_t*, absorb(id time) cluster(id)
coefplot, keep(treat_t*)
`
    };
    return {
        analysis_type: analysisType,
        stata_code: templates[analysisType] || "* Analysis template not found"
    };
}
function handleGeneratePythonCode(args) {
    const analysisType = args.analysis_type;
    const templates = {
        ols: `
import pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf

# OLS
model = smf.ols('y ~ x1 + x2 + x3', data=df).fit()
print(model.summary())

# Robust SE
model_robust = smf.ols('y ~ x1 + x2 + x3', data=df).fit(cov_type='HC3')

# VIF
from statsmodels.stats.outliers_influence import variance_inflation_factor
X = df[['x1', 'x2', 'x3']]
vif = pd.DataFrame({
    'Variable': X.columns,
    'VIF': [variance_inflation_factor(X.values, i) for i in range(X.shape[1])]
})
`,
        panel_fe: `
import pandas as pd
from linearmodels import PanelOLS

# Set index
df = df.set_index(['id', 'time'])

# Entity FE
model_fe = PanelOLS(df['y'], df[['x1', 'x2']], entity_effects=True)
result_fe = model_fe.fit(cov_type='clustered', cluster_entity=True)

# Two-way FE
model_twfe = PanelOLS(df['y'], df[['x1', 'x2']],
                       entity_effects=True, time_effects=True)
result_twfe = model_twfe.fit(cov_type='clustered', cluster_entity=True)
`
    };
    return {
        analysis_type: analysisType,
        python_code: templates[analysisType] || "# Analysis template not found"
    };
}
function handleCodeTemplate(args) {
    return {
        workflow: args.workflow,
        language: args.language,
        template: "Full workflow template - use specific code generation tools for detailed code"
    };
}
function handleVisualizationCode(args) {
    const chartType = args.chart_type;
    const language = args.language;
    const templates = {
        coefficient_plot: {
            r: `library(ggplot2)\nmodelsummary::modelplot(model, coef_omit = "Intercept")`,
            stata: `coefplot, drop(_cons) xline(0)`,
            python: `import matplotlib.pyplot as plt\ncoefs = model.params[1:]\nerrs = model.bse[1:]\nplt.errorbar(coefs.index, coefs, yerr=1.96*errs, fmt='o')`
        },
        forest_plot: {
            r: `library(metafor)\nforest(meta_result)`,
            stata: `metan effect se, forestplot`,
            python: `# Use forestplot package or matplotlib`
        }
    };
    return {
        chart_type: chartType,
        language,
        code: templates[chartType]?.[language] || "# Visualization code template"
    };
}
function handleTableCode(args) {
    return {
        table_type: args.table_type,
        format: args.format,
        language: args.language,
        code: "Table generation code - use modelsummary (R), esttab (Stata), or stargazer"
    };
}
function handleDebugCode(args) {
    return {
        error: args.error_message,
        language: args.language,
        suggestions: [
            "Check variable names and data types",
            "Verify data structure (missing values, duplicates)",
            "Check package/library installation",
            "Review function syntax and arguments"
        ]
    };
}
function handleOptimizeCode(args) {
    return {
        language: args.language,
        data_size: args.data_size,
        recommendations: {
            r: ["Use data.table instead of data.frame", "Use fst for file I/O", "Consider collapse package"],
            stata: ["Use gtools (gisid, gegen)", "Use ftools (reghdfe)", "Compress data"],
            python: ["Use pandas with chunking", "Consider dask or polars", "Use parquet format"]
        }
    };
}
function handleInterpretCoefficient(args) {
    const modelType = args.model_type;
    const coefficient = args.coefficient;
    const variableType = args.variable_type;
    let interpretation = "";
    if (modelType === "ols" || modelType === "linear") {
        interpretation = `X가 1단위 증가하면 Y가 ${coefficient.toFixed(3)} 단위 변화 (다른 변수 통제)`;
    }
    else if (modelType === "logit" || modelType === "logistic") {
        const or = Math.exp(coefficient);
        interpretation = `Odds Ratio = ${or.toFixed(3)}. X가 1단위 증가하면 odds가 ${((or - 1) * 100).toFixed(1)}% 변화`;
    }
    return {
        model_type: modelType,
        coefficient,
        variable_type: variableType,
        interpretation,
        caution: "인과적 해석은 연구설계에 따라 결정"
    };
}
function handleInterpretModelFit(args) {
    const metrics = args.metrics;
    return {
        metrics,
        interpretation: {
            r_squared: metrics.r_squared ? `설명력: ${(metrics.r_squared * 100).toFixed(1)}%` : null,
            adj_r_squared: metrics.adj_r_squared ? `조정된 설명력: ${(metrics.adj_r_squared * 100).toFixed(1)}%` : null,
            aic: metrics.aic ? "낮을수록 좋음 (모형 비교용)" : null,
            bic: metrics.bic ? "낮을수록 좋음 (복잡성 페널티 더 큼)" : null
        }
    };
}
function handleMarginalEffectsGuide(args) {
    return {
        model_type: args.model_type,
        effect_types: {
            ame: "Average Marginal Effect - 평균적 한계효과",
            mem: "Marginal Effect at Mean - 평균값에서 한계효과",
            mer: "Marginal Effect at Representative values"
        },
        r_code: "margins::margins(model)",
        stata_code: "margins, dydx(*)"
    };
}
function handleInterpretTest(args) {
    const pValue = args.p_value;
    return {
        test_name: args.test_name,
        p_value: pValue,
        statistic: args.statistic,
        conclusion: pValue < 0.05 ? "통계적으로 유의함 (p < .05)" : "통계적으로 유의하지 않음 (p ≥ .05)",
        effect_size_note: "p-value 외에 효과크기도 보고 필요"
    };
}
function handleWriteResultsSection(args) {
    return {
        analysis_type: args.analysis_type,
        style: args.style,
        template: "Results section template based on analysis type and style guide"
    };
}
function handleMetaEffectSize(args) {
    return {
        input_type: args.input_type,
        values: args.values,
        r_code: "escalc(measure = 'SMD', m1i, sd1i, n1i, m2i, sd2i, n2i, data)"
    };
}
function handleMetaHeterogeneity(args) {
    const iSquared = args.i_squared;
    return {
        i_squared: iSquared,
        interpretation: iSquared < 25 ? "Low heterogeneity" : iSquared < 75 ? "Moderate heterogeneity" : "High heterogeneity",
        implications: iSquared > 50 ? "Random effects model 권장, 이질성 원인 탐색" : "Fixed effect 가능"
    };
}
function handlePublicationBias(args) {
    return {
        methods: args.methods,
        tests: {
            funnel_plot: "Visual asymmetry check",
            egger: "Regression test for asymmetry",
            trim_fill: "Impute missing studies",
            selection_model: "Model publication process"
        }
    };
}
function handleMetaCode(args) {
    return {
        analysis: args.analysis,
        language: args.language,
        r_code: "library(metafor)\nres <- rma(yi, vi, data = dat)\nforest(res)",
        stata_code: "metan effect se, random"
    };
}
function handleJournalGuide(args) {
    const journal = args.journal;
    const guides = {
        econometrica: {
            style: "Rigorous mathematical notation",
            expectations: ["Novel theoretical contribution", "Clean identification", "Formal proofs"],
            stats_reporting: "Full estimation details, robustness in appendix"
        },
        aer: {
            style: "Clear causal identification",
            expectations: ["Policy relevance", "Clean natural experiment or RCT", "Replication data"],
            stats_reporting: "Main results in text, extensive robustness"
        },
        jfe: {
            style: "Empirical finance focus",
            expectations: ["Financial data", "Asset pricing or corporate finance", "Economic significance"],
            stats_reporting: "t-statistics in parentheses, clustering at firm level"
        }
    };
    return { journal, guide: guides[journal] || { message: "Journal guide not found" } };
}
function handleApaReporting(args) {
    return {
        test_type: args.test_type,
        template: "t(df) = X.XX, p < .05, d = X.XX, 95% CI [X.XX, X.XX]"
    };
}
function handlePreregTemplate(args) {
    return {
        platform: args.platform,
        sections: [
            "1. Study Information",
            "2. Design Plan",
            "3. Sampling Plan",
            "4. Variables",
            "5. Analysis Plan",
            "6. Other"
        ]
    };
}
function handleReplicationPackage(args) {
    return {
        components: args.components,
        structure: {
            code: "/code - Analysis scripts",
            data: "/data - Raw and processed data",
            output: "/output - Tables and figures",
            docs: "/docs - README, codebook"
        }
    };
}
function handleReviewerResponse(args) {
    const critiqueType = args.critique_type;
    const responses = {
        endogeneity: {
            options: ["IV/2SLS", "Control function", "Selection model", "Bounds analysis"],
            template: "We address endogeneity concerns by [method]. Results remain robust..."
        },
        selection: {
            options: ["Heckman selection", "PSM", "Bounds", "Placebo tests"],
            template: "Selection concerns are addressed through [method]..."
        }
    };
    return {
        critique_type: critiqueType,
        response_guide: responses[critiqueType] || { message: "Response template not found" }
    };
}
function handleSemGuide(args) {
    return {
        model_type: args.model_type,
        fit_indices: {
            acceptable: "CFI > .90, TLI > .90, RMSEA < .08, SRMR < .08",
            good: "CFI > .95, TLI > .95, RMSEA < .06, SRMR < .05"
        },
        r_code: "library(lavaan)\nfit <- sem(model, data = df)\nsummary(fit, fit.measures = TRUE)"
    };
}
function handleMlmGuide(args) {
    return {
        levels: args.levels,
        key_concepts: {
            icc: "Intraclass Correlation - 집단간 분산 비율",
            random_slope: "기울기의 집단간 변이 허용",
            cross_level: "수준간 상호작용"
        },
        r_code: "library(lme4)\nfit <- lmer(y ~ x1 + (1 + x1 | group), data = df)"
    };
}
function handleBayesianGuide(args) {
    return {
        analysis_type: args.analysis_type,
        prior_type: args.prior_type,
        convergence_checks: ["Rhat < 1.01", "ESS > 400", "Trace plots", "Posterior predictive checks"],
        r_code: "library(brms)\nfit <- brm(y ~ x1 + x2, data = df, family = gaussian())"
    };
}
function handleMlForCausal(args) {
    return {
        method: args.method,
        description: {
            double_ml: "Debiased/Double ML - nuisance parameter estimation with ML",
            causal_forest: "Heterogeneous treatment effects via random forests"
        },
        r_code: "library(DoubleML)\n# or library(grf) for causal forest"
    };
}
function handleTimeseriesGuide(args) {
    return {
        analysis: args.analysis,
        workflow: [
            "1. Stationarity test (ADF, KPSS)",
            "2. Determine order (ACF, PACF, Information criteria)",
            "3. Estimate model",
            "4. Diagnostics (Ljung-Box, residual ACF)",
            "5. Forecasting / Impulse response"
        ]
    };
}
async function handleWriteAnalysisFile(args) {
    const content = args.content;
    const filename = args.filename;
    const directory = args.directory || ".";
    // Note: Actual file writing would require fs module
    return {
        status: "File writing capability - requires file system access",
        filename,
        directory,
        content_preview: content.substring(0, 200) + "..."
    };
}
async function handleCreateProjectStructure(args) {
    const projectName = args.project_name;
    const template = args.template || "basic";
    const structures = {
        basic: ["/code", "/data", "/output", "/docs"],
        replication: ["/code/analysis", "/code/data_prep", "/data/raw", "/data/processed", "/output/tables", "/output/figures", "/docs"],
        full: ["/code/00_master", "/code/01_data", "/code/02_analysis", "/code/03_robustness", "/data/raw", "/data/processed", "/data/temp", "/output/tables", "/output/figures", "/output/logs", "/docs", "/paper"]
    };
    return {
        project_name: projectName,
        template,
        structure: structures[template],
        readme_template: "# Project Name\n\n## Structure\n\n## Replication Instructions\n\n## Data Sources\n\n## Contact"
    };
}
//# sourceMappingURL=index.js.map