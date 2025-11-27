# Dr. QuantMaster MCP Server

AI-Powered Quantitative Research Assistant with 45 MCP tools for causal inference, regression analysis, power calculation, and statistical code generation.

## Features

### 45 MCP Tools in 10 Categories

| Category | Tools | Description |
|----------|-------|-------------|
| **Knowledge Search** | 5 | Search statistical knowledge, method guides, formula lookup |
| **Sample Size & Power** | 5 | Power analysis, effect size, MDE calculator |
| **Diagnostics** | 5 | Assumption checks, regression diagnostics, test selection |
| **Causal Inference** | 6 | DID, RDD, IV, PSM, Synthetic Control guides |
| **Code Generation** | 8 | R, Stata, Python code generation and optimization |
| **Interpretation** | 5 | Coefficient interpretation, model fit, results writing |
| **Meta-Analysis** | 4 | Effect sizes, heterogeneity, publication bias |
| **Reporting** | 5 | Journal guidelines, APA reporting, preregistration |
| **Advanced Methods** | 5 | SEM, MLM, Bayesian, ML for causal, time series |
| **File Operations** | 2 | Analysis file writing, project structure creation |

### Causal Inference Methods Supported

- **DID (Difference-in-Differences)**: Parallel trends, staggered adoption, event studies
- **RDD (Regression Discontinuity)**: Sharp/Fuzzy RDD, bandwidth selection, McCrary test
- **IV (Instrumental Variables)**: 2SLS, weak instrument tests, overidentification
- **PSM (Propensity Score Matching)**: Balance diagnostics, caliper selection, ATT/ATE
- **Synthetic Control**: Donor pool selection, placebo tests, inference

### Code Generation

Generate analysis code for:
- **R**: tidyverse, fixest, did, rdrobust, MatchIt
- **Stata**: reghdfe, did_imputation, rdrobust, psmatch2
- **Python**: statsmodels, linearmodels, causalinference

## Architecture

```
Skills (Hot Layer)     MCP Tools (Cold Layer)     RAG (Vector Search)
      |                        |                         |
      v                        v                         v
 01_IDENTITY.md          45 Tools               32 ChromaDB Collections
 02_CAUSAL_INFERENCE.md  - Knowledge Search     - stat_foundations
 03_REGRESSION.md        - Power Analysis       - regression_*
                         - Code Generation      - econometrics_*
                         - Diagnostics          - advanced_*
```

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/seanshin0214/quantmaster-mcp-server.git
cd quantmaster-mcp-server

# Install dependencies
npm install

# Build
npm run build

# Copy environment file
cp .env.example .env
```

### Claude Desktop Configuration

Add to `claude_desktop_config.json`:

**Windows:**
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

**macOS/Linux:**
```json
{
  "mcpServers": {
    "quantmaster": {
      "command": "node",
      "args": ["/path/to/quantmaster-mcp-server/dist/index.js"],
      "env": {
        "CHROMA_PATH": "/path/to/quantmaster-mcp-server/chroma-data"
      }
    }
  }
}
```

## Usage Examples

### Power Analysis
```
Tool: calc_power
Input: { "n": 200, "effectSize": 0.3, "alpha": 0.05 }
```

### Causal Inference Guide
```
Tool: causal_design_guide
Input: { "method": "did", "context": "policy evaluation" }
```

### Generate R Code
```
Tool: generate_r_code
Input: {
  "method": "did",
  "dataDescription": "panel data with treatment in 2020"
}
```

### Interpret Coefficient
```
Tool: interpret_coefficient
Input: {
  "coefficient": 0.15,
  "se": 0.05,
  "method": "ols",
  "outcomeVar": "log_wage"
}
```

## Tool Reference

### Knowledge Search Tools
- `search_stats_knowledge`: Search statistical methods database
- `get_method_guide`: Get detailed method guide
- `suggest_method`: Suggest appropriate method for research question
- `compare_methods`: Compare two statistical methods
- `get_formula`: Get formula for specific statistic

### Power Analysis Tools
- `calc_sample_size`: Calculate required sample size
- `calc_power`: Calculate statistical power
- `calc_effect_size`: Calculate effect size from statistics
- `mde_calculator`: Calculate minimum detectable effect
- `power_curve`: Generate power curve data

### Causal Inference Tools
- `causal_design_guide`: Get causal inference design guide
- `parallel_trends_check`: Check parallel trends assumption
- `iv_strength_check`: Check instrument strength
- `psm_guide`: Propensity score matching guide
- `rdd_bandwidth`: RDD bandwidth selection guide
- `event_study_guide`: Event study design guide

### Code Generation Tools
- `generate_r_code`: Generate R analysis code
- `generate_stata_code`: Generate Stata analysis code
- `generate_python_code`: Generate Python analysis code
- `code_template`: Get code template for method
- `visualization_code`: Generate visualization code
- `table_code`: Generate publication-ready table code
- `debug_code`: Debug statistical code
- `optimize_code`: Optimize code performance

## 32 ChromaDB Collections

| Domain | Collections |
|--------|-------------|
| Foundations | stat_foundations, probability_theory, inference_basics |
| Regression | regression_ols, regression_diagnostics, regression_extensions |
| Econometrics | econometrics_panel, econometrics_iv, econometrics_did, econometrics_rdd |
| Advanced | advanced_sem, advanced_mlm, advanced_bayesian, advanced_ml_causal |
| Meta-Analysis | meta_effect_sizes, meta_heterogeneity, meta_publication_bias |
| Code | code_r, code_stata, code_python |

## Skills Files

### 01_IDENTITY.md
Dr. QuantMaster persona and core capabilities definition.

### 02_CAUSAL_INFERENCE.md
Detailed guides for DID, RDD, IV, PSM, and Synthetic Control with code templates.

### 03_REGRESSION.md
OLS, Panel Data, Limited Dependent Variables, Count Models, and Survival Analysis guides.

## License

MIT License - See [LICENSE](LICENSE) for details.

## Author

Sean Shin ([@seanshin0214](https://github.com/seanshin0214))

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with [Model Context Protocol](https://modelcontextprotocol.io/) and [ChromaDB](https://www.trychroma.com/)
