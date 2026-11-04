// Core domain types shared across web and API

export * from './onboarding'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'professional' | 'company' | 'recruiter' | 'admin'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  aliases?: string[]
}

export type SkillCategory =
  | 'programming'
  | 'data'
  | 'design'
  | 'management'
  | 'marketing'
  | 'sales'
  | 'operations'
  | 'other'

export interface UserSkill {
  skillId: string
  skill: Skill
  proficiencyLevel: ProficiencyLevel
  yearsExperience: number
  lastUsed?: Date
}

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5

export interface Preferences {
  remotePreference: RemotePreference
  salaryRange: SalaryRange
  industries: string[]
  roles: string[]
  location: Location
}

export type RemotePreference = 'remote' | 'hybrid' | 'onsite'

export interface SalaryRange {
  min: number
  max: number
  currency: string
  period: 'monthly' | 'yearly' | 'hourly'
}

export interface Location {
  city: string
  country: string
  timezone: string
  coordinates?: { lat: number; lng: number }
}

export interface Experience {
  id: string
  company: string
  role: string
  startDate: Date
  endDate?: Date
  description: string
  skills: string[]
}

export interface JobListing {
  id: string
  title: string
  company: Company
  requirements: SkillRequirement[]
  preferences: JobPreferences
  description: string
  postedDate: Date
  expiresDate?: Date
  source: ListingSource
}

export interface Company {
  id: string
  name: string
  size: CompanySize
  industry: string
  logoUrl?: string
  website?: string
}

export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise'

export interface SkillRequirement {
  skillId: string
  skill: Skill
  requiredLevel: ProficiencyLevel
  isRequired: boolean
  weight?: number
}

export interface JobPreferences {
  remotePolicy: RemotePreference
  salaryRange?: SalaryRange
  location?: Location
}

export type ListingSource = 'internal' | 'linkedin' | 'indeed' | 'greenhouse' | 'lever' | 'other'

export interface Match {
  listing: JobListing
  score: number
  breakdown: MatchBreakdown
  status: MatchStatus
  createdAt: Date
}

export type MatchStatus = 'new' | 'saved' | 'dismissed' | 'applied'

export interface MatchBreakdown {
  skills: number
  location: number
  salary: number
  industry: number
  culture: number
}

export interface LearningPath {
  id: string
  userId: string
  goal: LearningGoal
  nodes: LearningNode[]
  currentNodeIndex: number
  status: PathStatus
  createdAt: Date
  updatedAt: Date
}

export interface LearningGoal {
  targetRole: string
  targetSkills: string[]
  timelineWeeks: number
}

export interface LearningNode {
  id: string
  type: NodeType
  title: string
  description: string
  estimatedHours: number
  prerequisites: string[]
  skillsAddressed: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  contentRef: ContentRef
  completionCriteria: CompletionCriteria
}

export type NodeType = 'course' | 'project' | 'assessment' | 'reading' | 'practice'

export interface ContentRef {
  provider: string
  externalId: string
  url: string
}

export interface CompletionCriteria {
  type: 'assessment' | 'project_submission' | 'time_spent' | 'manual'
  threshold: number
}

export type PathStatus = 'active' | 'completed' | 'paused'

export interface Mastery {
  userId: string
  skillId: string
  level: number
  confidence: number
  lastAssessed: Date
  evidence: Evidence[]
}

export interface Evidence {
  type: 'assessment' | 'project' | 'certification' | 'peer_review'
  reference: string
  score: number
  date: Date
}

export interface MarketData {
  salary: SalaryData[]
  skillDemand: SkillDemand[]
  industryTrends: IndustryTrend[]
}

export interface SalaryData {
  role: string
  location: Location
  percentiles: {
    p25: number
    p50: number
    p75: number
    p90: number
  }
  sampleSize: number
  currency: string
  source: string
  collectedAt: Date
}

export interface SkillDemand {
  skillId: string
  skill: Skill
  role: string
  location: Location
  demandScore: number
  postingCount: number
  growthRateYoY: number
  collectedAt: Date
}

export interface IndustryTrend {
  industry: string
  location: Location
  hiringVelocity: number
  avgTimeToFill: number
  remoteRatio: number
  collectedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  data: T
  meta?: ResponseMeta
}

export interface ResponseMeta {
  page?: number
  limit?: number
  total?: number
  hasMore?: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}
