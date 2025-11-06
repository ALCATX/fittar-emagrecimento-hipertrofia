'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Clock, Flame, Target, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react'
import { DailyWorkout, Exercise } from '@/lib/types'
import { useState } from 'react'

interface ExerciseCardProps {
  exercise: Exercise
  isActive?: boolean
  isCompleted?: boolean
  onStart?: () => void
  onComplete?: () => void
}

function ExerciseCard({ exercise, isActive, isCompleted, onStart, onComplete }: ExerciseCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  }

  const difficultyLabels = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário', 
    advanced: 'Avançado'
  }

  return (
    <Card className={`border transition-all ${
      isActive ? 'border-emerald-500 bg-emerald-50' : 
      isCompleted ? 'border-green-500 bg-green-50' : 
      'border-gray-200 hover:border-emerald-300'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge className={difficultyColors[exercise.difficulty]}>
            {difficultyLabels[exercise.difficulty]}
          </Badge>
          {isCompleted && (
            <CheckCircle className="w-5 h-5 text-green-600" />
          )}
        </div>
        <CardTitle className="text-lg">{exercise.name}</CardTitle>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {exercise.sets && exercise.reps && (
            <span>{exercise.sets} séries × {exercise.reps} reps</span>
          )}
          {exercise.duration && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{exercise.duration}s</span>
            </div>
          )}
          {exercise.weight && (
            <span>{exercise.weight}kg</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Target Muscles */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Músculos Trabalhados:</h4>
          <div className="flex flex-wrap gap-1">
            {exercise.targetMuscles.map((muscle, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {muscle}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Instructions */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Como Executar:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            {exercise.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="font-medium text-emerald-600 mr-2">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {exercise.restTime && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-700">
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Descanso: {exercise.restTime}s</span>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          {!isCompleted ? (
            <Button 
              onClick={onStart}
              className={`flex-1 ${isActive 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-emerald-500 hover:bg-emerald-600'
              } text-white`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Em Andamento
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="outline"
              className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
              disabled
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Concluído
            </Button>
          )}
          
          {isActive && (
            <Button 
              onClick={onComplete}
              variant="outline"
              className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
            >
              Finalizar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface WorkoutSessionProps {
  workout: DailyWorkout
}

export function WorkoutSession({ workout }: WorkoutSessionProps) {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null)
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set())
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [workoutCompleted, setWorkoutCompleted] = useState(false)

  const handleStartExercise = (index: number) => {
    if (!workoutStarted) setWorkoutStarted(true)
    setActiveExerciseIndex(index)
  }

  const handleCompleteExercise = (index: number) => {
    setCompletedExercises(prev => new Set([...prev, index]))
    setActiveExerciseIndex(null)
    
    // Check if all exercises are completed
    if (completedExercises.size + 1 === workout.exercises.length) {
      setWorkoutCompleted(true)
    }
  }

  const progress = (completedExercises.size / workout.exercises.length) * 100

  if (workout.type === 'rest') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <RotateCcw className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dia de Descanso</h2>
        <p className="text-gray-600 mb-6">
          Aproveite para relaxar e permitir que seus músculos se recuperem
        </p>
        <Badge className="bg-blue-100 text-blue-700 px-4 py-2">
          Recuperação Ativa Recomendada
        </Badge>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{workout.name}</h2>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{workout.duration} minutos</span>
          </div>
          <div className="flex items-center space-x-1">
            <Flame className="w-4 h-4" />
            <span>~{workout.estimatedCaloriesBurned} kcal</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>{workout.exercises.length} exercícios</span>
          </div>
        </div>

        {workoutStarted && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progresso</span>
              <span>{completedExercises.size}/{workout.exercises.length}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        )}
      </div>

      {workoutCompleted && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Parabéns! Treino Concluído! 🎉
            </h3>
            <p className="text-green-700">
              Você queimou aproximadamente {workout.estimatedCaloriesBurned} calorias em {workout.duration} minutos
            </p>
          </CardContent>
        </Card>
      )}

      {/* Exercises Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard
            key={index}
            exercise={exercise}
            isActive={activeExerciseIndex === index}
            isCompleted={completedExercises.has(index)}
            onStart={() => handleStartExercise(index)}
            onComplete={() => handleCompleteExercise(index)}
          />
        ))}
      </div>

      {!workoutStarted && (
        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => setWorkoutStarted(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4"
          >
            <Play className="w-5 h-5 mr-2" />
            Começar Treino
          </Button>
        </div>
      )}
    </div>
  )
}