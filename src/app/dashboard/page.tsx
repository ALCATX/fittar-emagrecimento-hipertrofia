'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Zap, 
  User, 
  Target, 
  Calendar, 
  Utensils, 
  Dumbbell, 
  Camera,
  Trophy,
  TrendingUp,
  Clock,
  Flame,
  Activity,
  ChefHat,
  Play,
  Users,
  Settings,
  Bell,
  Plus,
  MapPin,
  Timer,
  Gift,
  Crown,
  Coins,
  Star,
  Upload,
  MessageCircle,
  Heart,
  Share2,
  Award,
  Pause,
  Square,
  RotateCcw
} from 'lucide-react'
import { UserProfile, MealPlan, WorkoutPlan, Challenge, UserStats } from '@/lib/types'
import { 
  calculateBMI, 
  getBMICategory, 
  calculateCalorieGoal, 
  calculateMacros,
  calculateWeightProgress,
  getMotivationalMessage,
  formatWeight,
  formatHeight
} from '@/lib/fitness-utils'
import { generateMealPlan, generateWorkoutPlan } from '@/lib/ai-service'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [isGeneratingMeals, setIsGeneratingMeals] = useState(false)
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [userStats, setUserStats] = useState<UserStats>({
    level: 2,
    credits: 150,
    totalWorkouts: 12,
    totalMeals: 45,
    streakDays: 7,
    challengesCompleted: 3,
    totalCaloriesBurned: 2850,
    totalDistance: 15.2
  })
  
  // Estados para funcionalidades específicas
  const [isRunning, setIsRunning] = useState(false)
  const [runTime, setRunTime] = useState(0)
  const [runDistance, setRunDistance] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [calorieResult, setCalorieResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Planos e assinatura
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'premium' | 'pro'>('free')
  const [freeTrialDays, setFreeTrialDays] = useState(7)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Desafios disponíveis
  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Caminhada Matinal',
      description: 'Caminhe 5km pela manhã',
      type: 'daily',
      category: 'steps',
      target: 5000,
      unit: 'passos',
      credits: 50,
      difficulty: 'easy',
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: '2',
      title: 'Hidratação Completa',
      description: 'Beba 2.5L de água hoje',
      type: 'daily',
      category: 'water',
      target: 2500,
      unit: 'ml',
      credits: 30,
      difficulty: 'easy',
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: '3',
      title: 'Sequência de Treinos',
      description: 'Complete 5 treinos esta semana',
      type: 'weekly',
      category: 'workout',
      target: 5,
      unit: 'treinos',
      credits: 200,
      difficulty: 'medium',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: '4',
      title: 'Mestre da Consistência',
      description: 'Mantenha sua sequência por 30 dias',
      type: 'monthly',
      category: 'workout',
      target: 30,
      unit: 'dias',
      credits: 1000,
      difficulty: 'hard',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true
    }
  ])

  useEffect(() => {
    // Carregar perfil do localStorage
    const savedProfile = localStorage.getItem('fittarProfile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else {
      router.push('/onboarding')
    }

    // Simular trial de 7 dias
    const trialStart = localStorage.getItem('fittarTrialStart')
    if (!trialStart) {
      localStorage.setItem('fittarTrialStart', new Date().toISOString())
    } else {
      const daysPassed = Math.floor((new Date().getTime() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24))
      setFreeTrialDays(Math.max(0, 7 - daysPassed))
    }

    // Timer para corrida
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRunTime(prev => prev + 1)
        // Simular distância baseada no tempo (velocidade média de 6 km/h)
        setRunDistance(prev => prev + 0.00167) // ~6km/h convertido para km/segundo
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [router, isRunning, isPaused])

  const handleGenerateMealPlan = async () => {
    if (!profile) return
    
    setIsGeneratingMeals(true)
    try {
      const newMealPlan = await generateMealPlan(profile)
      setMealPlan(newMealPlan)
      localStorage.setItem('fittarMealPlan', JSON.stringify(newMealPlan))
    } catch (error) {
      console.error('Erro ao gerar cardápio:', error)
    } finally {
      setIsGeneratingMeals(false)
    }
  }

  const handleGenerateWorkoutPlan = async () => {
    if (!profile) return
    
    setIsGeneratingWorkout(true)
    try {
      const newWorkoutPlan = await generateWorkoutPlan(profile)
      setWorkoutPlan(newWorkoutPlan)
      localStorage.setItem('fittarWorkoutPlan', JSON.stringify(newWorkoutPlan))
    } catch (error) {
      console.error('Erro ao gerar treino:', error)
    } finally {
      setIsGeneratingWorkout(false)
    }
  }

  // Funcionalidade da câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error)
      alert('Não foi possível acessar a câmera. Verifique as permissões.')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      if (context) {
        context.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')
        setCapturedImage(imageData)
        analyzeFood(imageData)
      }
    }
  }

  const analyzeFood = async (imageData: string) => {
    setIsAnalyzing(true)
    try {
      // Simular análise de IA (em produção, seria uma chamada para API de reconhecimento de alimentos)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockResults = [
        { food: 'Banana', calories: 105, carbs: 27, protein: 1, fat: 0.3 },
        { food: 'Maçã', calories: 95, carbs: 25, protein: 0.5, fat: 0.3 },
        { food: 'Pão Integral', calories: 247, carbs: 41, protein: 13, fat: 4 },
        { food: 'Peito de Frango', calories: 231, carbs: 0, protein: 43, fat: 5 }
      ]
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setCalorieResult(randomResult)
    } catch (error) {
      console.error('Erro ao analisar alimento:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    setCameraActive(false)
    setCapturedImage(null)
    setCalorieResult(null)
  }

  // Funcionalidades de corrida
  const startRun = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const pauseRun = () => {
    setIsPaused(!isPaused)
  }

  const stopRun = () => {
    setIsRunning(false)
    setIsPaused(false)
    // Salvar dados da corrida
    const runData = {
      date: new Date().toISOString(),
      duration: runTime,
      distance: runDistance,
      avgSpeed: runDistance / (runTime / 3600) // km/h
    }
    
    const savedRuns = JSON.parse(localStorage.getItem('fittarRuns') || '[]')
    savedRuns.push(runData)
    localStorage.setItem('fittarRuns', JSON.stringify(savedRuns))
    
    // Reset
    setRunTime(0)
    setRunDistance(0)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId)
    if (challenge) {
      setUserStats(prev => ({
        ...prev,
        credits: prev.credits + challenge.credits,
        challengesCompleted: prev.challengesCompleted + 1
      }))
      alert(`Parabéns! Você ganhou ${challenge.credits} FitCoins! 🎉`)
    }
  }

  const checkPremiumFeature = (feature: string) => {
    if (subscriptionPlan === 'free' && freeTrialDays <= 0) {
      setShowUpgradeModal(true)
      return false
    }
    return true
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Carregando seu perfil...</p>
        </div>
      </div>
    )
  }

  const bmi = calculateBMI(profile.currentWeight, profile.height)
  const bmiCategory = getBMICategory(bmi)
  const calorieGoal = calculateCalorieGoal(profile)
  const macros = calculateMacros(calorieGoal, profile.goal)
  const weightProgress = calculateWeightProgress(profile.currentWeight, profile.targetWeight, profile.currentWeight)
  const motivationalMessage = getMotivationalMessage(weightProgress)

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
          
          <div className="flex items-center space-x-4">
            {/* Status da assinatura */}
            <div className="flex items-center space-x-2">
              {subscriptionPlan === 'free' && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  {freeTrialDays > 0 ? `${freeTrialDays} dias grátis` : 'Gratuito'}
                </Badge>
              )}
              {subscriptionPlan === 'premium' && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              {subscriptionPlan === 'pro' && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              )}
            </div>

            {/* FitCoins */}
            <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">{userStats.credits}</span>
            </div>

            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Olá, {profile.name?.split(' ')[0]}!</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao seu painel, {profile.name?.split(' ')[0]}! 🎯
          </h1>
          <p className="text-lg text-gray-600">{motivationalMessage}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-emerald-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{formatWeight(profile.currentWeight)}</div>
              <div className="text-sm text-gray-600">Peso Atual</div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{formatWeight(profile.targetWeight)}</div>
              <div className="text-sm text-gray-600">Meta</div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{bmi}</div>
              <div className="text-sm text-gray-600">IMC - {bmiCategory}</div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{calorieGoal}</div>
              <div className="text-sm text-gray-600">Calorias/dia</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-emerald-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <Utensils className="w-4 h-4 mr-2" />
              Nutrição
            </TabsTrigger>
            <TabsTrigger value="workout" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <Dumbbell className="w-4 h-4 mr-2" />
              Treino
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <Target className="w-4 h-4 mr-2" />
              Progresso
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <Users className="w-4 h-4 mr-2" />
              Comunidade
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Today's Summary */}
              <Card className="border-emerald-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span>Hoje</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Calorias</span>
                    <span className="font-semibold">1,250 / {calorieGoal}</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Água</span>
                    <span className="font-semibold">1.5L / 2.5L</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Exercícios</span>
                    <span className="font-semibold">45min</span>
                  </div>
                </CardContent>
              </Card>

              {/* Running Tracker */}
              <Card className="border-emerald-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>Corrida/Caminhada</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {formatTime(runTime)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {runDistance.toFixed(2)} km
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!isRunning ? (
                      <Button 
                        onClick={startRun}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={pauseRun}
                          variant="outline"
                          className="flex-1"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          {isPaused ? 'Continuar' : 'Pausar'}
                        </Button>
                        <Button 
                          onClick={stopRun}
                          variant="destructive"
                          className="flex-1"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Parar
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Challenges */}
              <Card className="border-emerald-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-emerald-600" />
                    <span>Desafios Diários</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {challenges.filter(c => c.type === 'daily').slice(0, 2).map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-sm">{challenge.title}</div>
                        <div className="text-xs text-gray-600">{challenge.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Coins className="w-3 h-3 text-yellow-600" />
                          <span className="text-xs font-semibold text-yellow-700">{challenge.credits}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => completeChallenge(challenge.id)}
                          className="text-xs mt-1"
                        >
                          Completar
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Camera Food Scanner */}
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Camera className="w-5 h-5 text-emerald-600" />
                      <span>Contador de Calorias por Foto</span>
                    </CardTitle>
                    <CardDescription>
                      Fotografe seu alimento e descubra as calorias instantaneamente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!cameraActive ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Escaneie seu alimento
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Use a câmera para identificar calorias e macros automaticamente
                        </p>
                        <Button 
                          onClick={() => {
                            if (checkPremiumFeature('camera')) {
                              startCamera()
                            }
                          }}
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Ativar Câmera
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <video 
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <canvas ref={canvasRef} className="hidden" />
                        </div>
                        
                        {capturedImage && (
                          <div className="space-y-4">
                            <img 
                              src={capturedImage} 
                              alt="Captured food"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            
                            {isAnalyzing ? (
                              <div className="text-center py-4">
                                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Analisando alimento...</p>
                              </div>
                            ) : calorieResult && (
                              <div className="bg-emerald-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-emerald-800 mb-2">{calorieResult.food}</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>Calorias: <span className="font-semibold">{calorieResult.calories}</span></div>
                                  <div>Carboidratos: <span className="font-semibold">{calorieResult.carbs}g</span></div>
                                  <div>Proteína: <span className="font-semibold">{calorieResult.protein}g</span></div>
                                  <div>Gordura: <span className="font-semibold">{calorieResult.fat}g</span></div>
                                </div>
                                <Button size="sm" className="w-full mt-3">
                                  Adicionar ao Diário
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button 
                            onClick={capturePhoto}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Fotografar
                          </Button>
                          <Button 
                            onClick={stopCamera}
                            variant="outline"
                            className="flex-1"
                          >
                            Fechar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Meal Plan Generation */}
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ChefHat className="w-5 h-5 text-emerald-600" />
                      <span>Cardápio Semanal com IA</span>
                    </CardTitle>
                    <CardDescription>
                      Cardápio personalizado baseado no seu perfil e objetivos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!mealPlan ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Utensils className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Gere seu cardápio personalizado
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Nossa IA criará um plano alimentar perfeito para seus objetivos
                        </p>
                        <Button 
                          onClick={() => {
                            if (checkPremiumFeature('meal-plan')) {
                              handleGenerateMealPlan()
                            }
                          }}
                          disabled={isGeneratingMeals}
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                        >
                          {isGeneratingMeals ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Gerando Cardápio...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Gerar Cardápio com IA
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Cardápio da Semana</h3>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleGenerateMealPlan}
                            disabled={isGeneratingMeals}
                          >
                            Gerar Novo
                          </Button>
                        </div>
                        
                        <div className="grid gap-3">
                          {mealPlan.meals.slice(0, 3).map((day, index) => (
                            <Card key={index} className="border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold">{day.day}</h4>
                                    <p className="text-sm text-gray-600">
                                      {day.breakfast.name} • {day.lunch.name} • {day.dinner.name}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-emerald-600">
                                      {day.totalCalories} kcal
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      P: {day.macros.protein}g • C: {day.macros.carbs}g • G: {day.macros.fat}g
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Nutrition Summary */}
              <div className="space-y-6">
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle>Metas Diárias</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Calorias</span>
                        <span>{calorieGoal} kcal</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Proteína</span>
                        <span>{macros.protein}g</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Carboidratos</span>
                        <span>{macros.carbs}g</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Gordura</span>
                        <span>{macros.fat}g</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Workout Tab */}
          <TabsContent value="workout" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Workout Plan Generation */}
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Dumbbell className="w-5 h-5 text-emerald-600" />
                      <span>Plano de Treino com IA</span>
                    </CardTitle>
                    <CardDescription>
                      Treinos personalizados baseados na sua experiência e objetivos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!workoutPlan ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Dumbbell className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Crie seu plano de treino
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Nossa IA criará treinos adaptados ao seu nível e equipamentos
                        </p>
                        <Button 
                          onClick={() => {
                            if (checkPremiumFeature('workout-plan')) {
                              handleGenerateWorkoutPlan()
                            }
                          }}
                          disabled={isGeneratingWorkout}
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                        >
                          {isGeneratingWorkout ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Gerando Treino...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Gerar Treino com IA
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Treinos da Semana</h3>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleGenerateWorkoutPlan}
                            disabled={isGeneratingWorkout}
                          >
                            Gerar Novo
                          </Button>
                        </div>
                        
                        <div className="grid gap-3">
                          {workoutPlan.workouts.slice(0, 4).map((workout, index) => (
                            <Card key={index} className="border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold">{workout.day}</h4>
                                    <p className="text-sm text-gray-600">
                                      {workout.name} • {workout.exercises.length} exercícios
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-emerald-600">
                                      {workout.duration} min
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      ~{workout.estimatedCaloriesBurned} kcal
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  size="sm" 
                                  className="mt-3 w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  variant="ghost"
                                  onClick={() => {
                                    if (checkPremiumFeature('workout-start')) {
                                      // Iniciar treino
                                    }
                                  }}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Iniciar Treino
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Workout Stats */}
              <div className="space-y-6">
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle>Esta Semana</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">{userStats.totalWorkouts}</div>
                      <div className="text-sm text-gray-600">Treinos Realizados</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">180</div>
                      <div className="text-sm text-gray-600">Minutos Ativos</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">{userStats.totalCaloriesBurned}</div>
                      <div className="text-sm text-gray-600">Calorias Queimadas</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle>Próximo Treino</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold">Treino de Força</div>
                        <div className="text-sm text-gray-600">Peito, Ombro e Tríceps</div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>45 minutos</span>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                        onClick={() => {
                          if (checkPremiumFeature('workout-start')) {
                            // Iniciar treino
                          }
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar Agora
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-emerald-100">
                <CardHeader>
                  <CardTitle>Progresso do Peso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">
                      {formatWeight(profile.currentWeight)}
                    </div>
                    <div className="text-gray-600 mb-4">
                      Meta: {formatWeight(profile.targetWeight)}
                    </div>
                    <Progress value={weightProgress} className="h-3 mb-4" />
                    <div className="text-sm text-gray-600">
                      {Math.abs(profile.targetWeight - profile.currentWeight).toFixed(1)}kg restantes
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100">
                <CardHeader>
                  <CardTitle>Estatísticas de Corrida</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distância Total</span>
                    <span className="font-semibold">{userStats.totalDistance} km</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Melhor Tempo (5km)</span>
                    <span className="font-semibold">24:35</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Corridas Esta Semana</span>
                    <span className="font-semibold">3</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sequência</span>
                    <span className="font-semibold">{userStats.streakDays} dias</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 md:col-span-2">
                <CardHeader>
                  <CardTitle>Desafios e Conquistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {challenges.map((challenge) => (
                      <div key={challenge.id} className="p-4 border border-emerald-100 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{challenge.title}</h4>
                          <Badge 
                            variant={challenge.difficulty === 'easy' ? 'secondary' : 
                                   challenge.difficulty === 'medium' ? 'default' : 'destructive'}
                          >
                            {challenge.difficulty === 'easy' ? 'Fácil' : 
                             challenge.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Coins className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-700">{challenge.credits} FitCoins</span>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => completeChallenge(challenge.id)}
                          >
                            Completar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feed de Posts */}
              <div className="md:col-span-2 space-y-4">
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <span>Feed da Comunidade</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Post de exemplo */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">@fittar_oficial</div>
                          <div className="text-xs text-gray-600">2h atrás</div>
                        </div>
                        <Badge className="ml-auto bg-emerald-100 text-emerald-700">Oficial</Badge>
                      </div>
                      <p className="text-gray-800 mb-3">
                        🎉 Bem-vindos ao Fittar! Compartilhem seus progressos e inspirem outros membros da comunidade! 
                        #FittarFamily #Fitness
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <button className="flex items-center space-x-1 hover:text-red-500">
                          <Heart className="w-4 h-4" />
                          <span>127</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-500">
                          <MessageCircle className="w-4 h-4" />
                          <span>23</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-green-500">
                          <Share2 className="w-4 h-4" />
                          <span>Compartilhar</span>
                        </button>
                      </div>
                    </div>

                    {/* Mais posts simulados */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">Maria Silva</div>
                          <div className="text-xs text-gray-600">4h atrás</div>
                        </div>
                      </div>
                      <p className="text-gray-800 mb-3">
                        Completei meu primeiro desafio de 5km! 🏃‍♀️ Obrigada Fittar pelos treinos personalizados!
                      </p>
                      <div className="bg-emerald-50 p-3 rounded-lg mb-3">
                        <div className="flex items-center space-x-2">
                          <Award className="w-5 h-5 text-emerald-600" />
                          <span className="font-semibold text-emerald-800">Conquista Desbloqueada: Primeira Corrida!</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <button className="flex items-center space-x-1 hover:text-red-500">
                          <Heart className="w-4 h-4" />
                          <span>45</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-500">
                          <MessageCircle className="w-4 h-4" />
                          <span>12</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-green-500">
                          <Share2 className="w-4 h-4" />
                          <span>Compartilhar</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar da Comunidade */}
              <div className="space-y-6">
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle>Seu Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">Nível {userStats.level}</div>
                      <div className="text-sm text-gray-600">Iniciante Dedicado</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold text-yellow-700">{userStats.credits} FitCoins</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle>Seguindo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">@fittar_oficial</div>
                          <div className="text-xs text-gray-600">Conta Oficial</div>
                        </div>
                        <Badge className="ml-auto bg-emerald-100 text-emerald-700 text-xs">Seguindo</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle>Criar Post</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Compartilhe seu progresso..."
                        className="resize-none"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Camera className="w-4 h-4 mr-2" />
                          Foto
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Upload className="w-4 h-4 mr-2" />
                          Vídeo
                        </Button>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                        Publicar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Upgrade */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Upgrade para Premium</CardTitle>
              <CardDescription className="text-center">
                Seu período gratuito expirou. Escolha um plano para continuar:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Premium</h3>
                    <Badge className="bg-purple-100 text-purple-700">
                      <Crown className="w-3 h-3 mr-1" />
                      R$ 11,99/mês
                    </Badge>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Cardápios ilimitados com IA</li>
                    <li>• Treinos personalizados</li>
                    <li>• Contador de calorias por foto</li>
                    <li>• Comunidade premium</li>
                  </ul>
                </div>

                <div className="border border-yellow-300 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Pro</h3>
                    <Badge className="bg-yellow-100 text-yellow-700">
                      <Star className="w-3 h-3 mr-1" />
                      R$ 19,99/mês
                    </Badge>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tudo do Premium +</li>
                    <li>• Painel administrativo</li>
                    <li>• Sistema de créditos para influenciadores</li>
                    <li>• Analytics avançados</li>
                    <li>• Suporte prioritário</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  onClick={() => {
                    setSubscriptionPlan('premium')
                    setShowUpgradeModal(false)
                  }}
                >
                  Escolher Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}