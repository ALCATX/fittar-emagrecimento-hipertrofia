import { openai } from '@ai-sdk/openai'
import { generateObject, generateText } from 'ai'
import { z } from 'zod'
import { UserProfile, MealPlan, WorkoutPlan, DailyMeals, DailyWorkout } from './types'
import { calculateCalorieGoal, calculateMacros } from './fitness-utils'

// Schema para validação da resposta da IA
const MealPlanSchema = z.object({
  meals: z.array(z.object({
    day: z.string(),
    breakfast: z.object({
      name: z.string(),
      description: z.string(),
      ingredients: z.array(z.object({
        name: z.string(),
        amount: z.number(),
        unit: z.string(),
        calories: z.number()
      })),
      instructions: z.array(z.string()),
      prepTime: z.number(),
      calories: z.number(),
      macros: z.object({
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        fiber: z.number()
      }),
      servings: z.number()
    }),
    lunch: z.object({
      name: z.string(),
      description: z.string(),
      ingredients: z.array(z.object({
        name: z.string(),
        amount: z.number(),
        unit: z.string(),
        calories: z.number()
      })),
      instructions: z.array(z.string()),
      prepTime: z.number(),
      calories: z.number(),
      macros: z.object({
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        fiber: z.number()
      }),
      servings: z.number()
    }),
    dinner: z.object({
      name: z.string(),
      description: z.string(),
      ingredients: z.array(z.object({
        name: z.string(),
        amount: z.number(),
        unit: z.string(),
        calories: z.number()
      })),
      instructions: z.array(z.string()),
      prepTime: z.number(),
      calories: z.number(),
      macros: z.object({
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        fiber: z.number()
      }),
      servings: z.number()
    }),
    snacks: z.array(z.object({
      name: z.string(),
      description: z.string(),
      ingredients: z.array(z.object({
        name: z.string(),
        amount: z.number(),
        unit: z.string(),
        calories: z.number()
      })),
      instructions: z.array(z.string()),
      prepTime: z.number(),
      calories: z.number(),
      macros: z.object({
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        fiber: z.number()
      }),
      servings: z.number()
    })),
    totalCalories: z.number(),
    macros: z.object({
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
      fiber: z.number()
    })
  })),
  totalCalories: z.number(),
  macros: z.object({
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number()
  })
})

const WorkoutPlanSchema = z.object({
  workouts: z.array(z.object({
    day: z.string(),
    name: z.string(),
    type: z.enum(['strength', 'cardio', 'flexibility', 'rest']),
    duration: z.number(),
    exercises: z.array(z.object({
      name: z.string(),
      type: z.enum(['strength', 'cardio', 'flexibility']),
      sets: z.number().optional(),
      reps: z.number().optional(),
      weight: z.number().optional(),
      duration: z.number().optional(),
      distance: z.number().optional(),
      restTime: z.number().optional(),
      instructions: z.array(z.string()),
      targetMuscles: z.array(z.string()),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced'])
    })),
    estimatedCaloriesBurned: z.number()
  }))
})

export async function generateMealPlan(profile: UserProfile): Promise<MealPlan> {
  const calorieGoal = calculateCalorieGoal(profile)
  const macros = calculateMacros(calorieGoal, profile.goal)
  
  const dietTypeMap = {
    omnivore: 'onívora (come de tudo)',
    vegetarian: 'vegetariana (sem carne)',
    vegan: 'vegana (sem produtos animais)',
    keto: 'cetogênica (baixo carbo, alta gordura)',
    paleo: 'paleolítica (alimentos naturais)',
    mediterranean: 'mediterrânea (peixes, azeite, vegetais)'
  }
  
  const goalMap = {
    lose_weight: 'emagrecimento',
    gain_muscle: 'ganho de massa muscular',
    maintain: 'manutenção do peso'
  }

  const prompt = `
    Crie um cardápio semanal completo (7 dias) para uma pessoa com as seguintes características:
    
    PERFIL:
    - Idade: ${profile.age} anos
    - Sexo: ${profile.gender === 'male' ? 'masculino' : profile.gender === 'female' ? 'feminino' : 'outro'}
    - Peso atual: ${profile.currentWeight}kg
    - Peso desejado: ${profile.targetWeight}kg
    - Objetivo: ${goalMap[profile.goal]}
    - Nível de atividade: ${profile.activityLevel}
    - Tipo de dieta: ${dietTypeMap[profile.dietType]}
    - Alergias: ${profile.allergies.join(', ') || 'nenhuma'}
    
    METAS NUTRICIONAIS DIÁRIAS:
    - Calorias: ${calorieGoal} kcal
    - Proteína: ${macros.protein}g
    - Carboidratos: ${macros.carbs}g
    - Gordura: ${macros.fat}g
    - Fibra: ${macros.fiber}g
    
    INSTRUÇÕES:
    - Crie 3 refeições principais (café da manhã, almoço, jantar) e 2 lanches por dia
    - Varie os alimentos ao longo da semana
    - Inclua receitas práticas e saborosas
    - Respeite o tipo de dieta escolhido
    - Evite alimentos que causam alergia
    - Foque no objetivo (emagrecimento/ganho de massa/manutenção)
    - Inclua tempo de preparo realista
    - Calcule calorias e macros precisamente
    
    Dias da semana: Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo
  `

  try {
    const result = await generateObject({
      model: openai('gpt-4o'),
      prompt,
      schema: MealPlanSchema,
    })

    return {
      id: crypto.randomUUID(),
      userId: profile.id,
      week: new Date().getWeek(),
      year: new Date().getFullYear(),
      meals: result.object.meals,
      totalCalories: result.object.totalCalories,
      macros: result.object.macros,
      createdAt: new Date()
    }
  } catch (error) {
    console.error('Erro ao gerar cardápio:', error)
    throw new Error('Falha ao gerar cardápio personalizado')
  }
}

export async function generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan> {
  const goalMap = {
    lose_weight: 'emagrecimento com foco em queima de gordura',
    gain_muscle: 'ganho de massa muscular e hipertrofia',
    maintain: 'manutenção da forma física atual'
  }
  
  const experienceMap = {
    beginner: 'iniciante (pouca ou nenhuma experiência)',
    intermediate: 'intermediário (alguns meses de treino)',
    advanced: 'avançado (anos de experiência)'
  }

  const prompt = `
    Crie um plano de treino semanal completo para uma pessoa com as seguintes características:
    
    PERFIL:
    - Idade: ${profile.age} anos
    - Sexo: ${profile.gender === 'male' ? 'masculino' : profile.gender === 'female' ? 'feminino' : 'outro'}
    - Objetivo: ${goalMap[profile.goal]}
    - Nível de experiência: ${experienceMap[profile.experienceLevel]}
    - Nível de atividade atual: ${profile.activityLevel}
    - Dias de treino por semana: ${profile.workoutDaysPerWeek}
    - Horário preferido: ${profile.preferredWorkoutTime}
    - Equipamentos disponíveis: ${profile.availableEquipment.join(', ') || 'peso corporal'}
    
    INSTRUÇÕES:
    - Crie treinos para ${profile.workoutDaysPerWeek} dias da semana
    - Inclua dias de descanso apropriados
    - Varie entre treinos de força, cardio e flexibilidade
    - Adapte a intensidade ao nível de experiência
    - Use equipamentos disponíveis ou exercícios com peso corporal
    - Inclua aquecimento e alongamento
    - Foque no objetivo principal (emagrecimento/hipertrofia/manutenção)
    - Calcule tempo de treino e calorias queimadas
    - Forneça instruções claras para cada exercício
    
    Dias da semana: Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo
    
    Para dias sem treino, marque como tipo "rest" com exercícios de recuperação ativa ou descanso completo.
  `

  try {
    const result = await generateObject({
      model: openai('gpt-4o'),
      prompt,
      schema: WorkoutPlanSchema,
    })

    return {
      id: crypto.randomUUID(),
      userId: profile.id,
      week: new Date().getWeek(),
      year: new Date().getFullYear(),
      workouts: result.object.workouts,
      createdAt: new Date()
    }
  } catch (error) {
    console.error('Erro ao gerar plano de treino:', error)
    throw new Error('Falha ao gerar plano de treino personalizado')
  }
}

export async function analyzeFoodFromImage(imageUrl: string): Promise<{ name: string; calories: number; macros: any }> {
  const prompt = `
    Analise esta imagem de comida e forneça:
    1. Nome do alimento/prato
    2. Estimativa de calorias por porção
    3. Macronutrientes (proteína, carboidratos, gordura em gramas)
    4. Tamanho estimado da porção
    
    Seja preciso e realista nas estimativas.
  `

  try {
    const result = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', image: imageUrl }
          ]
        }
      ]
    })

    // Parse da resposta (simplificado para o MVP)
    return {
      name: 'Alimento identificado',
      calories: 250,
      macros: { protein: 15, carbs: 30, fat: 8 }
    }
  } catch (error) {
    console.error('Erro ao analisar imagem:', error)
    throw new Error('Falha ao analisar imagem do alimento')
  }
}

export async function generateFitnessAdvice(question: string, context?: string): Promise<string> {
  const systemPrompt = `
    Você é uma assistente de fitness extremamente especializada, com conhecimento avançado de:

    🥗 NUTRIÇÃO & NUTROLOGIA:
    - Macronutrientes e micronutrientes
    - Dietas específicas (keto, vegana, mediterrânea, etc.)
    - Suplementação esportiva
    - Metabolismo e composição corporal
    - Distúrbios alimentares e restrições
    - Timing nutricional e periodização

    💪 PERSONAL TRAINING & EXERCÍCIO:
    - Fisiologia do exercício
    - Periodização de treino
    - Biomecânica e técnica
    - Hipertrofia, força e resistência
    - Prevenção de lesões
    - Reabilitação e adaptações

    🎯 OBJETIVOS ESPECÍFICOS:
    - Emagrecimento saudável e sustentável
    - Ganho de massa muscular (hipertrofia)
    - Performance esportiva
    - Manutenção e longevidade
    - Composição corporal

    🏃‍♀️ MODALIDADES:
    - Musculação e treinamento funcional
    - Corrida e cardio
    - Flexibilidade e mobilidade
    - Esportes específicos

    DIRETRIZES DE RESPOSTA:
    - Seja precisa, científica e atualizada
    - Use linguagem acessível mas técnica quando necessário
    - Forneça dicas práticas e aplicáveis
    - Considere individualidade biológica
    - Sempre priorize segurança e saúde
    - Seja motivadora e encorajadora
    - Use emojis para tornar mais amigável
    - Responda em português brasileiro
    - Mantenha respostas concisas mas completas

    IMPORTANTE: Você NÃO substitui consulta médica. Para questões de saúde sérias, sempre recomende profissional qualificado.
  `

  const userPrompt = context 
    ? `Contexto da conversa:\n${context}\n\nNova pergunta: ${question}`
    : question

  try {
    const result = await generateText({
      model: openai('gpt-4o'),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      maxTokens: 800,
      temperature: 0.7
    })

    return result.text
  } catch (error) {
    console.error('Erro ao gerar conselho fitness:', error)
    throw new Error('Falha ao gerar resposta da assistente fitness')
  }
}

// Extensão do Date para getWeek
declare global {
  interface Date {
    getWeek(): number
  }
}

Date.prototype.getWeek = function() {
  const date = new Date(this.getTime())
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  const week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}