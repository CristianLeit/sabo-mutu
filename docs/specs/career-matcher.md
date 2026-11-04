# Career Matcher Specification

## Overview

The Career Matcher matches professionals with suitable career opportunities based on skills, preferences, and market demand using a scoring algorithm.

## Core Entities

### Professional Profile
- `userId`: UUID
- `skills`: Array<{ skillId, proficiencyLevel, yearsExperience }>
- `preferences`: {
    remotePreference: 'remote' | 'hybrid' | 'onsite',
    salaryRange: { min, max, currency },
    industries: string[],
    roles: string[],
    location: { city, country, timezone }
  }
- `experience`: Array<{ company, role, startDate, endDate, description }>

### Job Listing
- `listingId`: UUID
- `title`: string
- `company`: { name, size, industry }
- `requirements`: Array<{ skillId, requiredLevel, isRequired }>
- `preferences`: { remotePolicy, salaryRange, location }
- `description`: string
- `postedDate`: ISODate
- `expiresDate`: ISODate

## Matching Algorithm

### Scoring Components (Weighted Sum)

1. **Skills Match** (40%)
   - Required skills: exact match = 1.0, adjacent skill = 0.5, missing = 0.0
   - Preferred skills: bonus points for matches
   - Years experience considered (capped at required years)

2. **Location/Remote Match** (20%)
   - Exact location match = 1.0
   - Remote-compatible = 0.8
   - Same country different city = 0.6
   - Different country = 0.2

3. **Salary Match** (15%)
   - Candidate range overlaps listing range = 1.0
   - Listing max ≥ candidate min = 0.7
   - No overlap = 0.3

4. **Industry/Role Match** (15%)
   - Exact industry match = 1.0
   - Adjacent industry = 0.6
   - Exact role match = 1.0
   - Related role = 0.5

5. **Company Culture Fit** (10%)
   - Based on company size, values, team structure preferences

### Final Score

```
score = Σ(componentScore * weight)
```

Threshold: score ≥ 0.65 for "Good Match", ≥ 0.8 for "Great Match"

## API Endpoints

### GET /api/matches
- Query: `userId`, `limit`, `offset`, `minScore`
- Returns: Array<{ listing, score, breakdown }>

### POST /api/matches/refresh
- Body: `userId`
- Triggers re-computation of matches

### GET /api/matches/:listingId/explanation
- Returns detailed breakdown for a specific match

## Data Sources

- Internal job board (CRUD via admin panel)
- External APIs:
  - LinkedIn Jobs API
  - Indeed API
  - Greenhouse / Lever ATS integrations
- Company profiles (manual + enriched via Clearbit)

## Refresh Strategy

- Incremental: nightly batch job re-scores active listings
- On-demand: user profile updates trigger refresh
- Real-time: new listings scored within 5 minutes

## UI Components

- Match card with score badge
- Breakdown modal (click for details)
- Filter/sort controls
- Save/dismiss actions