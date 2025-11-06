'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Target, 
  Activity, 
  Utensils, 
  Dumbbell,
  Zap,
  CheckCircle
} from 'lucide-react'
import { UserProfile } from '@/lib/types'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, title: 'Perfil Básico', icon: User, description: 'Informações pessoais' },
  { id: 2, title: 'Objetivos', icon: Target, description: 'Suas metas fitness' },
  { id: 3, title: 'Atividade', icon: Activity, description: 'Nível de atividade atual' },
  { id: 4, title: 'Alimentação', icon: Utensils, description: 'Preferências alimentares' },
  { id: 5, title: 'Treino', icon: Dumbbell, description: 'Experiência e equipamentos' }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    allergies: [],
    medicalConditions: [],
    availableEquipment: []
  })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Finalizar onboarding e ir para dashboard
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Salvar perfil e redirecionar para dashboard
    const completeProfile: UserProfile = {
      ...profile,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as UserProfile

    // Salvar no localStorage (em produção seria no banco)
    localStorage.setItem('fittarProfile', JSON.stringify(completeProfile))
    
    router.push('/dashboard')
  }

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: string, item: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev]?.includes?.(item)
        ? (prev[field as keyof typeof prev] as string[]).filter(i => i !== item)
        : [...(prev[field as keyof typeof prev] as string[] || []), item]
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profile.name && profile.email && profile.age && profile.gender && profile.height && profile.currentWeight
      case 2:
        return profile.targetWeight && profile.goal
      case 3:
        return profile.activityLevel
      case 4:
        return profile.dietType
      case 5:
        return profile.experienceLevel && profile.workoutDaysPerWeek && profile.preferredWorkoutTime
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Fittar
            </span>
          </div>
          
          <Badge variant="outline" className="border-emerald-200 text-emerald-700">
            Passo {currentStep} de {steps.length}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Configure seu perfil</h1>
            <span className="text-sm text-gray-600">{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  currentStep === step.id 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : currentStep > step.id 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-gray-100 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                  <span className="hidden sm:block font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-emerald-100">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-8 h-8 text-white" })}
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-lg">
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Perfil Básico */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={profile.name || ''}
                    onChange={(e) => updateProfile('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={profile.email || ''}
                    onChange={(e) => updateProfile('email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Idade *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={profile.age || ''}
                    onChange={(e) => updateProfile('age', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Sexo *</Label>
                  <Select value={profile.gender} onValueChange={(value) => updateProfile('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={profile.height || ''}
                    onChange={(e) => updateProfile('height', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentWeight">Peso atual (kg) *</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    step="0.1"
                    placeholder="70.0"
                    value={profile.currentWeight || ''}
                    onChange={(e) => updateProfile('currentWeight', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Objetivos */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Peso desejado (kg) *</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    step="0.1"
                    placeholder="65.0"
                    value={profile.targetWeight || ''}
                    onChange={(e) => updateProfile('targetWeight', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Qual é seu objetivo principal? *</Label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { value: 'lose_weight', label: 'Emagrecer', desc: 'Perder gordura corporal' },
                      { value: 'gain_muscle', label: 'Ganhar Massa', desc: 'Hipertrofia muscular' },
                      { value: 'maintain', label: 'Manter Forma', desc: 'Manutenção do peso' }
                    ].map((goal) => (
                      <Card 
                        key={goal.value}
                        className={`cursor-pointer transition-all ${
                          profile.goal === goal.value 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => updateProfile('goal', goal.value)}
                      >
                        <CardContent className="p-4 text-center">
                          <h3 className="font-semibold text-gray-900">{goal.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{goal.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Atividade */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Qual seu nível de atividade atual? *</Label>
                  <div className="space-y-3">
                    {[
                      { value: 'sedentary', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                      { value: 'lightly_active', label: 'Levemente Ativo', desc: 'Exercício leve 1-3 dias/semana' },
                      { value: 'moderately_active', label: 'Moderadamente Ativo', desc: 'Exercício moderado 3-5 dias/semana' },
                      { value: 'very_active', label: 'Muito Ativo', desc: 'Exercício intenso 6-7 dias/semana' },
                      { value: 'extremely_active', label: 'Extremamente Ativo', desc: 'Exercício muito intenso, trabalho físico' }
                    ].map((activity) => (
                      <Card 
                        key={activity.value}
                        className={`cursor-pointer transition-all ${
                          profile.activityLevel === activity.value 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => updateProfile('activityLevel', activity.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{activity.label}</h3>
                              <p className="text-sm text-gray-600">{activity.desc}</p>
                            </div>
                            {profile.activityLevel === activity.value && (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Alimentação */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Tipo de dieta preferida *</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { value: 'omnivore', label: 'Onívora', desc: 'Como de tudo' },
                      { value: 'vegetarian', label: 'Vegetariana', desc: 'Sem carne' },
                      { value: 'vegan', label: 'Vegana', desc: 'Sem produtos animais' },
                      { value: 'keto', label: 'Cetogênica', desc: 'Baixo carbo, alta gordura' },
                      { value: 'paleo', label: 'Paleolítica', desc: 'Alimentos naturais' },
                      { value: 'mediterranean', label: 'Mediterrânea', desc: 'Peixes, azeite, vegetais' }
                    ].map((diet) => (
                      <Card 
                        key={diet.value}
                        className={`cursor-pointer transition-all ${
                          profile.dietType === diet.value 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => updateProfile('dietType', diet.value)}
                      >
                        <CardContent className="p-4 text-center">
                          <h3 className="font-semibold text-gray-900">{diet.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{diet.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Alergias ou restrições alimentares</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Glúten', 'Lactose', 'Nozes', 'Frutos do mar', 'Ovos', 'Soja', 'Amendoim', 'Outros'].map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={allergy}
                          checked={profile.allergies?.includes(allergy)}
                          onCheckedChange={() => toggleArrayItem('allergies', allergy)}
                        />
                        <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Treino */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Experiência com exercícios *</Label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { value: 'beginner', label: 'Iniciante', desc: 'Pouca experiência' },
                      { value: 'intermediate', label: 'Intermediário', desc: 'Alguns meses de treino' },
                      { value: 'advanced', label: 'Avançado', desc: 'Anos de experiência' }
                    ].map((level) => (
                      <Card 
                        key={level.value}
                        className={`cursor-pointer transition-all ${
                          profile.experienceLevel === level.value 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => updateProfile('experienceLevel', level.value)}
                      >
                        <CardContent className="p-4 text-center">
                          <h3 className="font-semibold text-gray-900">{level.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{level.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Quantos dias por semana quer treinar? *</Label>
                    <Select value={profile.workoutDaysPerWeek?.toString()} onValueChange={(value) => updateProfile('workoutDaysPerWeek', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 dias</SelectItem>
                        <SelectItem value="3">3 dias</SelectItem>
                        <SelectItem value="4">4 dias</SelectItem>
                        <SelectItem value="5">5 dias</SelectItem>
                        <SelectItem value="6">6 dias</SelectItem>
                        <SelectItem value="7">7 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Horário preferido para treinar *</Label>
                    <Select value={profile.preferredWorkoutTime} onValueChange={(value) => updateProfile('preferredWorkoutTime', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Manhã</SelectItem>
                        <SelectItem value="afternoon">Tarde</SelectItem>
                        <SelectItem value="evening">Noite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Equipamentos disponíveis</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Academia completa', 'Halteres', 'Barras', 'Elásticos', 'Peso corporal', 'Esteira', 'Bicicleta', 'Kettlebell', 'TRX'].map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          checked={profile.availableEquipment?.includes(equipment)}
                          onCheckedChange={() => toggleArrayItem('availableEquipment', equipment)}
                        />
                        <Label htmlFor={equipment} className="text-sm">{equipment}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          >
            {currentStep === steps.length ? 'Finalizar' : 'Próximo'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}