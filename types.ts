
export type DomainType = 
  | 'Geography' | 'History' | 'Science' | 'Finance' 
  | 'Languages' | 'Arts' | 'Music' | 'Philosophy' 
  | 'Psychology' | 'Technology' | 'AI' | 'Cybersecurity' 
  | 'Bioinformatics' | 'Chemistry' | 'Physics' | 'Quantum Mechanics' 
  | 'Astronomy' | 'Spirituality' | 'Energy' | 'Religion' 
  | 'Law' | 'Economy' | 'Trading' | 'Personal Finance';

export type AppLanguage = 'en' | 'ar';

export interface AdvancedResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'paper';
}

export interface LocalizedQuizQuestion {
  question_en: string;
  question_ar: string;
  options_en: string[];
  options_ar: string[];
  correctAnswer: number;
  explanation_en: string;
  explanation_ar: string;
}

export interface Concept {
  id: string;
  domain: DomainType;
  category: string;
  topic: string;
  title_en: string;
  title_ar: string;
  lesson_en: string;
  lesson_ar: string;
  extendedLesson_en?: string;
  extendedLesson_ar?: string;
  quiz: LocalizedQuizQuestion[];
  advancedResources?: AdvancedResource[];
  xpReward: number;
  relatedConcepts: string[];
  difficulty: 'Novice' | 'Adept' | 'Expert' | 'Master';
}

export interface UserAnalytics {
  dailyXP: Record<string, number>; // YYYY-MM-DD
  weeklyXP: Record<string, number>; // YYYY-WW
  monthlyXP: Record<string, number>; // YYYY-MM
  domainVelocity: Record<string, number>; // Growth rate per domain
}

export interface UserProfile {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  achievements: Achievement[];
  badges: string[];
  mastery: Record<string, number>;
  detailedMastery: Record<string, number>;
  history: ActivityLog[];
  dailyActivity: Record<string, number>;
  unlockedModules: string[];
  language: AppLanguage;
  notificationsEnabled: boolean;
  lastNotificationDate?: string;
  analytics: UserAnalytics;
}

export interface OmniNotification {
  id: string;
  type: 'streak' | 'lesson' | 'milestone' | 'discovery';
  title: string;
  message: string;
  actionLabel?: string;
  payload?: any;
  timestamp: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface ActivityLog {
  id: string;
  conceptTitle: string;
  domain: string;
  score: number;
  maxScore: number;
  xpEarned: number;
  timestamp: string;
}

export interface DailyRecommendation {
  topic: string;
  domain: string;
  reason: string;
  isFrontier: boolean;
}
