# Dr. QuantMaster MCP Server

> AI-Powered Quantitative Research & Applied Statistics Assistant

[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Dr. QuantMaster는 양적 연구자를 위한 전문 MCP 서버입니다. 통계학, 계량경제학, 인과추론 전문 지식과 R/Stata/Python 코드 생성 기능을 제공합니다.

### Key Features

- **45개 MCP Tools** - 통계 분석 전 과정 지원
- **다중 언어 코드 생성** - R, Stata, Python
- **인과추론 특화** - DID, RDD, IV, PSM, Synth
- **메타분석 지원** - 효과크기, 이질성, 출판편향
- **Open Science** - 사전등록, 재현성 패키지

## 45 MCP Tools

### Knowledge (5)
- `search_stats_knowledge` - 통계 지식베이스 검색
- `get_method_guide` - 방법론 상세 가이드
- `suggest_method` - 연구설계 기반 방법론 추천
- `compare_methods` - 방법론 비교
- `get_formula` - 수식 및 LaTeX

### Sample Size & Power (5)
- `calc_sample_size` - 필요 표본크기 계산
- `calc_power` - 검정력 계산
- `calc_effect_size` - 효과크기 계산
- `mde_calculator` - 최소탐지효과 계산
- `power_curve` - 검정력 곡선 데이터

### Diagnostics (5)
- `check_assumptions` - 가정 점검 가이드
- `diagnose_regression` - 회귀 진단
- `test_selection` - 적절한 검정 선택
- `interpret_diagnostics` - 진단 결과 해석
- `robustness_guide` - 강건성 검정 가이드

### Causal Inference (6)
- `causal_design_guide` - 인과추론 설계 가이드
- `parallel_trends_check` - DID 평행추세 검정
- `iv_strength_check` - IV 강도 검정
- `psm_guide` - 성향점수매칭 가이드
- `rdd_bandwidth` - RDD 대역폭 선택
- `event_study_guide` - 사건연구 가이드

### Code Generation (8)
- `generate_r_code` - R 코드 생성
- `generate_stata_code` - Stata 코드 생성
- `generate_python_code` - Python 코드 생성
- `code_template` - 전체 워크플로우 템플릿
- `visualization_code` - 시각화 코드
- `table_code` - 결과표 코드
- `debug_code` - 코드 디버깅
- `optimize_code` - 코드 최적화

### Interpretation (5)
- `interpret_coefficient` - 계수 해석
- `interpret_model_fit` - 적합도 해석
- `marginal_effects_guide` - 한계효과 가이드
- `interpret_test` - 검정 결과 해석
- `write_results_section` - 결과 섹션 템플릿

### Meta-Analysis (4)
- `meta_effect_size` - 효과크기 계산/변환
- `meta_heterogeneity` - 이질성 해석
- `publication_bias` - 출판편향 검정
- `meta_code` - 메타분석 코드

### Reporting (5)
- `journal_guide` - 저널별 보고 가이드
- `apa_reporting` - APA 스타일 보고
- `prereg_template` - 사전등록 템플릿
- `replication_package` - 재현성 패키지
- `reviewer_response` - 리뷰어 대응

### Advanced (5)
- `sem_guide` - 구조방정식 가이드
- `mlm_guide` - 다층모형 가이드
- `bayesian_guide` - 베이지안 분석
- `ml_for_causal` - ML 기반 인과추론
- `timeseries_guide` - 시계열 분석

### File Operations (2)
- `write_analysis_file` - 파일 저장
- `create_project_structure` - 프로젝트 구조 생성

## Installation

```bash
# Clone
git clone https://github.com/seanshin0214/quantmaster-mcp.git
cd quantmaster-mcp

# Install
npm install

# Build
npm run build
```

## Claude Desktop Configuration

```json
{
  "mcpServers": {
    "quantmaster": {
      "command": "node",
      "args": ["C:\\path\\to\\quantmaster-mcp-server\\dist\\index.js"],
      "env": {
        "CHROMA_PATH": "C:\\path\\to\\quantmaster-mcp-server\\chroma-data"
      }
    }
  }
}
```

## Skills (Hot Layer)

`skills/` 폴더의 파일들을 Claude Desktop 프로젝트에 첨부:

| File | Content |
|------|---------|
| 01_IDENTITY.md | Dr. QuantMaster 페르소나 |
| 02_CAUSAL_INFERENCE.md | 인과추론 (DID, RDD, IV, PSM) |
| 03_REGRESSION.md | 회귀분석 (OLS, Panel, GLM) |

## Supported Methods

### Regression
- OLS, WLS, GLS
- Logit, Probit, Ordered/Multinomial
- Poisson, Negative Binomial, Zero-Inflated
- Panel FE/RE, Dynamic Panel

### Causal Inference
- Difference-in-Differences (+ Staggered)
- Regression Discontinuity Design
- Instrumental Variables
- Propensity Score Methods
- Synthetic Control

### Advanced
- SEM, CFA, Path Analysis
- Multilevel/HLM
- Bayesian Statistics
- Meta-Analysis
- Time Series (ARIMA, VAR)

## License

MIT License

## Author

**Sean Shin** - Quantitative Methods & AI Integration
