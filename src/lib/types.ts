// Tipos para o Fittar - App de Fitness com IA

export interface UserProfile {
  id: string
  name: string
  email: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number // cm
  currentWeight: number // kg
  targetWeight: number // kg
  goal: 'lose_weight' | 'gain_muscle' | 'maintain'
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  dietType: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean'
  allergies: string[]
  medicalConditions: string[]
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
  availableEquipment: string[]
  workoutDaysPerWeek: number
  preferredWorkoutTime: 'morning' | 'afternoon' | 'evening'
  subscriptionPlan: 'free' | 'premium' | 'pro'
  freeTrialDays: number
  cpf?: string
  deviceId?: string
  ipAddress?: string
  createdAt: Date
  updatedAt: Date
}

export interface MealPlan {
  id: string
  userId: string
  week: number
  year: number
  meals: DailyMeals[]
  totalCalories: number
  macros: MacroNutrients
  createdAt: Date
}

export interface DailyMeals {
  day: string
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  snacks: Meal[]
  totalCalories: number
  macros: MacroNutrients
}

export interface Meal {
  name: string
  description: string
  ingredients: Ingredient[]
  instructions: string[]
  prepTime: number // minutes
  calories: number
  macros: MacroNutrients
  servings: number
}

export interface Ingredient {
  name: string
  amount: number
  unit: string
  calories: number
}

export interface MacroNutrients {
  protein: number // grams
  carbs: number // grams
  fat: number // grams
  fiber: number // grams
}

export interface WorkoutPlan {
  id: string
  userId: string
  week: number
  year: number
  workouts: DailyWorkout[]
  createdAt: Date
}

export interface DailyWorkout {
  day: string
  name: string
  type: 'strength' | 'cardio' | 'flexibility' | 'rest'
  duration: number // minutes
  exercises: Exercise[]
  estimatedCaloriesBurned: number
}

export interface Exercise {
  name: string
  type: 'strength' | 'cardio' | 'flexibility'
  sets?: number
  reps?: number
  weight?: number // kg
  duration?: number // seconds
  distance?: number // meters
  restTime?: number // seconds
  instructions: string[]
  targetMuscles: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface Challenge {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly'
  category: 'workout' | 'nutrition' | 'steps' | 'water' | 'sleep'
  target: number
  unit: string
  credits: number
  difficulty: 'easy' | 'medium' | 'hard'
  startDate: Date
  endDate: Date
  isActive: boolean
}

export interface UserProgress {
  id: string
  userId: string
  date: Date
  weight: number
  bodyFat?: number
  muscleMass?: number
  measurements: BodyMeasurements
  photos: string[]
  notes: string
}

export interface BodyMeasurements {
  chest?: number
  waist?: number
  hips?: number
  bicep?: number
  thigh?: number
  neck?: number
}

export interface ActivityLog {
  id: string
  userId: string
  date: Date
  type: 'workout' | 'meal' | 'water' | 'sleep' | 'steps'
  data: any
  calories?: number
  duration?: number
}

export interface UserStats {
  level: number
  credits: number
  totalWorkouts: number
  totalMeals: number
  streakDays: number
  challengesCompleted: number
  totalCaloriesBurned: number
  totalDistance: number // km
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'workout' | 'meal' | 'challenge' | 'achievement' | 'social'
  isRead: boolean
  createdAt: Date
}

// Novos tipos para funcionalidades adicionais

export interface RunSession {
  id: string
  userId: string
  date: Date
  duration: number // seconds
  distance: number // km
  avgSpeed: number // km/h
  calories: number
  route?: GeoLocation[]
  notes?: string
}

export interface GeoLocation {
  latitude: number
  longitude: number
  timestamp: Date
}

export interface FoodAnalysis {
  id: string
  userId: string
  imageUrl: string
  foodName: string
  calories: number
  macros: MacroNutrients
  confidence: number
  timestamp: Date
}

export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  imageUrls: string[]
  videoUrl?: string
  type: 'text' | 'image' | 'video' | 'achievement'
  likes: number
  comments: number
  shares: number
  timestamp: Date
  isVerified: boolean
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: Date
  likes: number
}

export interface BusinessProfile {
  id: string
  name: string
  category: 'gym' | 'restaurant' | 'supplement' | 'equipment' | 'clothing'
  description: string
  address: string
  phone: string
  email: string
  website: string
  logo: string
  verified: boolean
  rating: number
  totalReviews: number
  subscriptionPlan: 'basic' | 'premium' | 'enterprise'
  createdAt: Date
}

export interface Campaign {
  id: string
  businessId: string
  title: string
  description: string
  type: 'banner' | 'post' | 'video' | 'story'
  category: 'gym' | 'restaurant' | 'supplement' | 'equipment' | 'clothing'
  budget: number
  targetAudience: string[]
  startDate: Date
  endDate: Date
  status: 'active' | 'paused' | 'completed' | 'draft'
  impressions: number
  clicks: number
  conversions: number
  imageUrl?: string
  videoUrl?: string
  createdAt: Date
}

export interface CreditTransaction {
  id: string
  type: 'sent' | 'received' | 'withdrawn' | 'purchased'
  amount: number
  fromUserId?: string
  toUserId?: string
  fromUserName?: string
  toUserName?: string
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  description: string
  conversionRate?: number // FitCoins to real money
}

export interface Influencer {
  id: string
  userId: string
  name: string
  username: string
  avatar: string
  followers: number
  category: string
  verified: boolean
  creditsReceived: number
  totalEarnings: number
  conversionRate: number
  bio: string
  socialLinks: SocialLinks
}

export interface SocialLinks {
  instagram?: string
  youtube?: string
  tiktok?: string
  twitter?: string
}

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  bonus: number
  popular?: boolean
  description: string
}

export interface SubscriptionPlan {
  id: string
  name: 'free' | 'premium' | 'pro'
  price: number
  features: string[]
  limits: PlanLimits
  popular?: boolean
}

export interface PlanLimits {
  mealPlansPerMonth: number
  workoutPlansPerMonth: number
  cameraScansPerDay: number
  communityPosts: boolean
  adminPanel: boolean
  analytics: boolean
  prioritySupport: boolean
}

export interface ChatMessage {
  id: string
  userId: string
  message: string
  response: string
  timestamp: Date
  type: 'nutrition' | 'workout' | 'general'
  isRead: boolean
}

export interface ChatHistory {
  userId: string
  messages: ChatMessage[]
  lastActivity: Date
  retentionDays: number // 7 days default
}