import { UserProfile, MacroNutrients } from './types'

export function calculateBMR(profile: UserProfile): number {
  // Fórmula de Mifflin-St Jeor
  const { gender, currentWeight, height, age } = profile
  
  if (gender === 'male') {
    return 10 * currentWeight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * currentWeight + 6.25 * height - 5 * age - 161
  }
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile)
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  }
  
  return bmr * activityMultipliers[profile.activityLevel]
}

export function calculateCalorieGoal(profile: UserProfile): number {
  const tdee = calculateTDEE(profile)
  
  switch (profile.goal) {
    case 'lose_weight':
      return Math.round(tdee - 500) // Déficit de 500 calorias
    case 'gain_muscle':
      return Math.round(tdee + 300) // Superávit de 300 calorias
    case 'maintain':
      return Math.round(tdee)
    default:
      return Math.round(tdee)
  }
}

export function calculateMacros(calorieGoal: number, goal: 'lose_weight' | 'gain_muscle' | 'maintain'): MacroNutrients {
  let proteinPercent: number
  let carbPercent: number
  let fatPercent: number
  
  switch (goal) {
    case 'lose_weight':
      proteinPercent = 0.35 // 35% proteína
      carbPercent = 0.30 // 30% carboidratos
      fatPercent = 0.35 // 35% gordura
      break
    case 'gain_muscle':
      proteinPercent = 0.30 // 30% proteína
      carbPercent = 0.45 // 45% carboidratos
      fatPercent = 0.25 // 25% gordura
      break
    case 'maintain':
      proteinPercent = 0.25 // 25% proteína
      carbPercent = 0.45 // 45% carboidratos
      fatPercent = 0.30 // 30% gordura
      break
  }
  
  return {
    protein: Math.round((calorieGoal * proteinPercent) / 4), // 4 cal/g
    carbs: Math.round((calorieGoal * carbPercent) / 4), // 4 cal/g
    fat: Math.round((calorieGoal * fatPercent) / 9), // 9 cal/g
    fiber: Math.round(calorieGoal / 1000 * 14) // 14g por 1000 calorias
  }
}

export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Abaixo do peso'
  if (bmi < 25) return 'Peso normal'
  if (bmi < 30) return 'Sobrepeso'
  return 'Obesidade'
}

export function formatWeight(weight: number): string {
  return `${weight.toFixed(1)} kg`
}

export function formatHeight(height: number): string {
  const meters = Math.floor(height / 100)
  const centimeters = height % 100
  return `${meters},${centimeters.toString().padStart(2, '0')}m`
}

export function calculateWeightProgress(current: number, target: number, initial: number): number {
  if (initial === target) return 100
  return Math.round(((initial - current) / (initial - target)) * 100)
}

export function getMotivationalMessage(progress: number): string {
  if (progress >= 100) return "🎉 Parabéns! Você alcançou seu objetivo!"
  if (progress >= 75) return "🔥 Quase lá! Continue assim!"
  if (progress >= 50) return "💪 Você está no meio do caminho!"
  if (progress >= 25) return "🚀 Bom progresso! Continue firme!"
  return "🌟 Cada passo conta! Vamos começar!"
}

export function generateWeekDays(): string[] {
  return ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
}

export function getCurrentWeek(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  return Math.floor(diff / oneWeek)
}