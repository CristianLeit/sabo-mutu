# Market Research Specification

## Overview

The Market Research module aggregates and analyzes industry trends, salary data, and job market insights from multiple external sources to provide actionable intelligence.

## Data Sources

### Primary Sources
- **BLS/OES** (US Bureau of Labor Statistics) — Occupational employment & wages
- **Eurostat** — European labor market statistics
- **LinkedIn Economic Graph** — Skills demand, hiring trends
- **Indeed/Glavinet** — Job posting volume, salary estimates
- **Stack Overflow Developer Survey** — Developer trends, technologies
- **Glassdoor/Payscale** — Salary benchmarks, company reviews

### Enrichment Sources
- **Clearbit/Apollo** — Company firmographics
- **Crunchbase** — Funding, growth signals
- **Google Trends** — Search interest for skills/roles
- **GitHub/StackOverflow** — Technology adoption signals

## Data Pipeline

```
External APIs → Ingestion Workers → Normalization → Storage → Aggregation → API Layer
```

### Ingestion
- Scheduled jobs (cron): daily for salaries, weekly for trends
- Webhook callbacks where available
- Rate limiting & retry logic per provider

### Normalization
- Canonical skill taxonomy (ONET + custom extensions)
- Standardized location hierarchy (country > region > city)
- Currency normalization to USD (monthly rates)
- Role taxonomy mapping (e.g., "SWE" → "Software Engineer")

### Storage Schema

#### salary_data
```sql
id, source, role_canonical, location_canonical,
percentile_25, percentile_50, percentile_75, percentile_90,
sample_size, currency, collected_at, valid_until
```

#### skill_demand
```sql
id, skill_canonical, role_canonical, location_canonical,
demand_score, posting_count, growth_rate_yoy,
collected_at
```

#### industry_trends
```sql
id, industry_canonical, location_canonical,
hiring_velocity, avg_time_to_fill, remote_ratio,
collected_at
```

## API Endpoints

### GET /api/market/salary
- Query: `role`, `location`, `experienceLevel`, `percentiles`
- Returns: Salary bands with source attribution

### GET /api/market/skills/demand
- Query: `skill`, `role`, `location`, `timeRange`
- Returns: Demand trend over time

### GET /api/market/industry/:industry
- Query: `location`, `metrics` (hiring, remote, timeToFill)
- Returns: Industry dashboard data

### GET /api/market/report
- Query: `role`, `location`, `format` (json|pdf)
- Returns: Comprehensive market report

## Caching Strategy

- Salary data: 7-day TTL (slow-changing)
- Skill demand: 1-day TTL
- Industry trends: 1-day TTL
- Reports: generated on-demand, cached 24h

## Refresh Schedule

| Data Type        | Frequency | Method           |
|-----------------|-----------|------------------|
| Salary benchmarks | Weekly   | Batch ETL        |
| Skill demand     | Daily     | Incremental API  |
| Job posting volume | Daily   | Partner webhooks |
| Industry trends  | Weekly    | Aggregation job  |

## UI Features

- Interactive salary explorer (filters: role, location, experience)
- Skill demand heatmap
- Industry comparison dashboard
- PDF report generator with branding