'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Clock, Users, ChefHat, Flame } from 'lucide-react'
import { DailyMeals, Meal } from '@/lib/types'

interface MealCardProps {
  meal: Meal
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

function MealCard({ meal, type }: MealCardProps) {
  const typeLabels = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço', 
    dinner: 'Jantar',
    snack: 'Lanche'
  }

  const typeColors = {
    breakfast: 'bg-orange-100 text-orange-700',
    lunch: 'bg-blue-100 text-blue-700',
    dinner: 'bg-purple-100 text-purple-700',
    snack: 'bg-green-100 text-green-700'
  }

  return (
    <Card className="border-emerald-100 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge className={typeColors[type]}>
            {typeLabels[type]}
          </Badge>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{meal.prepTime}min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{meal.servings}</span>
            </div>
          </div>
        </div>
        <CardTitle className="text-lg">{meal.name}</CardTitle>
        <CardDescription>{meal.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Nutrition Info */}
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-emerald-700">{meal.calories} kcal</span>
          </div>
          <div className="text-sm text-emerald-600">
            P: {meal.macros.protein}g • C: {meal.macros.carbs}g • G: {meal.macros.fat}g
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Ingredientes:</h4>
          <div className="grid grid-cols-1 gap-1 text-sm">
            {meal.ingredients.map((ingredient, index) => (
              <div key={index} className="flex justify-between text-gray-600">
                <span>• {ingredient.name}</span>
                <span>{ingredient.amount}{ingredient.unit}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Instructions */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Modo de Preparo:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            {meal.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="font-medium text-emerald-600 mr-2">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        <Button 
          variant="outline" 
          className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        >
          <ChefHat className="w-4 h-4 mr-2" />
          Adicionar ao Meu Cardápio
        </Button>
      </CardContent>
    </Card>
  )
}

interface DailyMealPlanProps {
  dailyMeals: DailyMeals
}

export function DailyMealPlan({ dailyMeals }: DailyMealPlanProps) {
  return (
    <div className="space-y-6">
      {/* Day Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{dailyMeals.day}</h2>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div>
            <span className="font-semibold text-emerald-600">{dailyMeals.totalCalories}</span> kcal
          </div>
          <div>
            P: <span className="font-semibold">{dailyMeals.macros.protein}g</span>
          </div>
          <div>
            C: <span className="font-semibold">{dailyMeals.macros.carbs}g</span>
          </div>
          <div>
            G: <span className="font-semibold">{dailyMeals.macros.fat}g</span>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <MealCard meal={dailyMeals.breakfast} type="breakfast" />
        <MealCard meal={dailyMeals.lunch} type="lunch" />
        <MealCard meal={dailyMeals.dinner} type="dinner" />
        
        {/* Snacks */}
        {dailyMeals.snacks.length > 0 && (
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lanches</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {dailyMeals.snacks.map((snack, index) => (
                <MealCard key={index} meal={snack} type="snack" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}