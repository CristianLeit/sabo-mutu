# Learning Engine Specification

## Overview

The Learning Engine provides personalized, AI-powered learning paths that adapt to user progress, goals, and market demand. It recommends content, tracks mastery, and adjusts difficulty in real-time.

## Core Concepts

### Learning Path
- `pathId`: UUID
- `userId`: UUID
- `goal`: { targetRole, targetSkills[], timelineWeeks }
- `nodes`: Array<LearningNode>
- `currentNodeIndex`: number
- `status`: 'active' | 'completed' | 'paused'
- `createdAt`, `updatedAt`

### LearningNode
- `nodeId`: UUID
- `type`: 'course' | 'project' | 'assessment' | 'reading' | 'practice'
- `title`: string
- `description`: string
- `estimatedHours`: number
- `prerequisites`: nodeId[]
- `skillsAddressed`: skillId[]
- `difficulty`: 1-5
- `contentRef`: { provider, externalId, url }
- `completionCriteria`: { type, threshold }

### Mastery State
- `userId`, `skillId`
- `level`: 0-5 (Novice → Expert)
- `confidence`: 0.0-1.0
- `lastAssessed`: ISODate
- `evidence`: Array<{ type, reference, score, date }>

## Recommendation Algorithm

### Inputs
1. **User Profile** — Current skills, goals, learning style, available hours/week
2. **Market Demand** — High-demand skills for target role (from Market Research)
3. **Content Catalog** — Available courses, projects, assessments with metadata
4. **Peer Data** — Successful paths of similar users (anonymized)

### Scoring Function

For each candidate content item:
```
score = 
  0.35 * relevanceToGoal(content, userGoal) +
  0.25 * skillGapClosure(content, userSkills, targetSkills) +
  0.15 * marketDemandAlignment(content, marketData) +
  0.10 * learningStyleFit(content, userStyle) +
  0.10 * difficultyProgression(content, currentLevel) +
  0.05 * peerSuccessRate(content, similarUsers)
```

### Path Construction

1. **Seed**: Start with highest-scoring prerequisite-free nodes
2. **Expand**: Iteratively add nodes that unlock new skills
3. **Balance**: Ensure mix of content types (theory/practice/assessment)
4. **Pace**: Target ~10 hours/week, adjust node count accordingly
5. **Validate**: Simulate completion timeline against user goal

## Adaptive Features

### Dynamic Difficulty
- If assessment score > 90%: skip next similar node, increase difficulty
- If assessment score < 60%: insert remedial node, decrease difficulty
- Spaced repetition for retention (SM-2 algorithm)

### Content Substitution
- If user struggles with format (e.g., video), substitute with alternative
- If provider content unavailable, auto-find equivalent

### Goal Adjustment
- User can modify goal → path recalculates preserving completed nodes
- Market demand shifts → optional "trending skills" sidebar

## API Endpoints

### GET /api/learning/path
- Query: `userId`
- Returns: Current learning path with progress

### POST /api/learning/path
- Body: `userId`, `goal`
- Creates new path, returns pathId

### PATCH /api/learning/path/:pathId/progress
- Body: `nodeId`, `status` ('started' | 'completed' | 'skipped'), `score?`
- Updates progress, triggers adaptation

### GET /api/learning/recommendations
- Query: `userId`, `context` ('next' | 'review' | 'explore')
- Returns: Ranked content recommendations

### POST /api/learning/assessment
- Body: `userId`, `skillId`, `questions[]`
- Starts adaptive assessment, returns question stream

### GET /api/learning/mastery/:skillId
- Query: `userId`
- Returns: Mastery level, evidence, next milestones

## Content Providers

- **Internal**: Custom courses, projects, assessments
- **External**: Coursera, edX, Udemy, Pluralsight, freeCodeCamp, YouTube
- **Integration**: LTI, xAPI, SCORM for progress tracking

## UI Components

- Path visualizer (node graph with progress)
- Daily/weekly agenda
- Skill mastery radar chart
- Adaptive assessment interface
- Content player with progress sync