
import { UserProfile, ActivityLog, AppLanguage, Concept } from '../types';

const USER_KEY = 'omniora_user_v3';
const CONTENT_KEY = 'omniora_custom_content';

export const getXPForLevel = (level: number) => {
  if (level <= 1) return 0;
  return Math.floor(1000 * Math.pow(level - 1, 1.4));
};

const defaultUser: UserProfile = {
  id: 'usr-' + Math.random().toString(36).substr(2, 9),
  username: 'Explorer',
  xp: 0,
  level: 1,
  streak: 0,
  lastActive: new Date().toISOString(),
  achievements: [],
  badges: ['Pioneer'],
  mastery: {},
  detailedMastery: {},
  history: [],
  dailyActivity: {},
  unlockedModules: ['Foundation'],
  language: 'en',
  notificationsEnabled: true,
  analytics: {
    dailyXP: {},
    weeklyXP: {},
    monthlyXP: {},
    domainVelocity: {}
  }
};

export const getUser = (): UserProfile => {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : defaultUser;
};

export const saveUser = (user: UserProfile) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const addXP = (amount: number) => {
  const user = getUser();
  const now = new Date();
  const dateKey = now.toISOString().split('T')[0];
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Update Analytics
  user.analytics.dailyXP[dateKey] = (user.analytics.dailyXP[dateKey] || 0) + amount;
  user.analytics.monthlyXP[monthKey] = (user.analytics.monthlyXP[monthKey] || 0) + amount;
  
  user.xp += amount;
  let nextLevel = user.level;
  while (user.xp >= getXPForLevel(nextLevel + 1)) {
    nextLevel++;
  }
  user.level = nextLevel;
  saveUser(user);
  return user;
};

export const updateMastery = (domain: string, category: string, topic: string, increment: number) => {
  const user = getUser();
  const topicKey = `${domain}:${category}:${topic}`;
  
  const currentTopicMastery = user.detailedMastery[topicKey] || 0;
  user.detailedMastery[topicKey] = Math.min(100, currentTopicMastery + increment);
  
  const domainKeys = Object.keys(user.detailedMastery).filter(k => k.startsWith(`${domain}:`));
  const domainSum = domainKeys.reduce((acc, k) => acc + user.detailedMastery[k], 0);
  user.mastery[domain] = Math.round(domainSum / (domainKeys.length || 1));
  
  // Track domain velocity (simplified as last increment)
  user.analytics.domainVelocity[domain] = (user.analytics.domainVelocity[domain] || 0) + increment;
  
  saveUser(user);
  return user;
};

export const checkStreak = () => {
  const user = getUser();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastActiveDate = new Date(user.lastActive);
  const lastActiveDay = new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate());

  const diffDays = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    user.streak += 1;
  } else if (diffDays > 1) {
    user.streak = 1;
  } else if (user.streak === 0) {
    user.streak = 1;
  }
  user.lastActive = now.toISOString();
  saveUser(user);
  return user;
};

export const logActivity = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
  const user = getUser();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  user.dailyActivity[dateStr] = (user.dailyActivity[dateStr] || 0) + 1;
  
  const fullLog: ActivityLog = {
    ...log,
    id: 'log-' + Math.random().toString(36).substr(2, 9),
    timestamp: now.toISOString()
  };
  user.history = [fullLog, ...user.history].slice(0, 50);
  saveUser(user);
  return user;
};

export const getCustomContent = (): Concept[] => {
  const stored = localStorage.getItem(CONTENT_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveConcept = (concept: Concept) => {
  const content = getCustomContent();
  const index = content.findIndex(c => c.id === concept.id);
  if (index >= 0) content[index] = concept;
  else content.push(concept);
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
};

export const deleteConcept = (id: string) => {
  const content = getCustomContent().filter(c => c.id !== id);
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
};

export const getAllUsersStats = () => [getUser()];

export const setLanguage = (lang: AppLanguage) => {
  const user = getUser();
  user.language = lang;
  saveUser(user);
  return user;
};

export const toggleNotifications = () => {
  const user = getUser();
  user.notificationsEnabled = !user.notificationsEnabled;
  saveUser(user);
  return user;
};

export const markNotificationSent = () => {
  const user = getUser();
  user.lastNotificationDate = new Date().toISOString().split('T')[0];
  saveUser(user);
  return user;
};
