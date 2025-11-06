'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Target, 
  Users, 
  Trophy, 
  Camera, 
  Brain, 
  Smartphone,
  Star,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function FittarHome() {
  const [isPlaying, setIsPlaying] = useState(false)

  const features = [
    {
      icon: Brain,
      title: "IA Personalizada",
      description: "Cardápios e treinos criados especialmente para você com inteligência artificial avançada"
    },
    {
      icon: Target,
      title: "Objetivos Claros",
      description: "Emagrecimento, hipertrofia ou manutenção - seu plano personalizado para cada meta"
    },
    {
      icon: Camera,
      title: "Contador de Calorias",
      description: "Tire foto da comida e descubra instantaneamente as calorias e macronutrientes"
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Compartilhe resultados, dicas e motivação com milhares de usuários"
    },
    {
      icon: Trophy,
      title: "Desafios e Recompensas",
      description: "Complete desafios diários e semanais para ganhar créditos e subir de nível"
    },
    {
      icon: Smartphone,
      title: "Tracking Completo",
      description: "Monitore caminhadas, corridas e todo seu progresso fitness em tempo real"
    }
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      result: "Perdi 15kg em 4 meses",
      text: "O Fittar mudou minha vida! Os cardápios são deliciosos e os treinos se adaptam perfeitamente à minha rotina.",
      rating: 5
    },
    {
      name: "João Santos",
      result: "Ganhou 8kg de massa muscular",
      text: "Nunca consegui resultados tão rápidos. A IA realmente entende o que meu corpo precisa para hipertrofia.",
      rating: 5
    },
    {
      name: "Ana Costa",
      result: "Mantém o peso há 1 ano",
      text: "Depois de emagrecer, o Fittar me ajuda a manter o peso ideal com planos de manutenção perfeitos.",
      rating: 5
    }
  ]

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      features: [
        "Cardápio básico semanal",
        "Treino personalizado",
        "Contador de calorias",
        "Comunidade",
        "Desafios básicos"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "R$ 29,90",
      period: "/mês",
      features: [
        "Cardápios ilimitados",
        "Treinos avançados",
        "IA premium",
        "Análise de fotos",
        "Desafios exclusivos",
        "Suporte prioritário",
        "Sem anúncios"
      ],
      popular: true
    },
    {
      name: "Pro",
      price: "R$ 49,90",
      period: "/mês",
      features: [
        "Tudo do Premium",
        "Nutricionista virtual",
        "Personal trainer IA",
        "Relatórios detalhados",
        "Integração com wearables",
        "Consultoria 1:1"
      ],
      popular: false
    }
  ]

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
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">Recursos</a>
            <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-colors">Depoimentos</a>
            <a href="#pricing" className="text-gray-600 hover:text-emerald-600 transition-colors">Preços</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-emerald-600">
              Entrar
            </Button>
            <Link href="/onboarding">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <Badge className="mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            🚀 Mais de 100.000 usuários transformados
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
            Transforme seu corpo com
            <br />
            <span className="text-gray-900">Inteligência Artificial</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Cardápios personalizados, treinos inteligentes e uma comunidade que te motiva. 
            Seja para <strong>emagrecer</strong>, <strong>ganhar massa muscular</strong> ou <strong>manter a forma</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/onboarding">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg">
                Começar Transformação
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play className="mr-2 w-5 h-5" />
              Ver Como Funciona
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">100k+</div>
              <div className="text-gray-600">Usuários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">2M+</div>
              <div className="text-gray-600">Cardápios Gerados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">500k+</div>
              <div className="text-gray-600">Treinos Criados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">95%</div>
              <div className="text-gray-600">Taxa de Sucesso</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Recursos que fazem a diferença
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologia de ponta para acelerar seus resultados e manter você motivado
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Histórias de sucesso reais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja como o Fittar transformou a vida de milhares de pessoas
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-emerald-100 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg text-gray-900">{testimonial.name}</CardTitle>
                  <Badge className="bg-emerald-100 text-emerald-700 w-fit">
                    {testimonial.result}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Escolha seu plano
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comece grátis e evolua conforme seus resultados
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-emerald-500 shadow-lg scale-105' : 'border-gray-200'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/onboarding">
                    <Button 
                      className={`w-full ${plan.popular 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white' 
                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.name === 'Gratuito' ? 'Começar Grátis' : 'Assinar Agora'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Pronto para sua transformação?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Junte-se a mais de 100.000 pessoas que já transformaram suas vidas com o Fittar
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Começar Agora - É Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Fittar</span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fittar. Todos os direitos reservados. Transforme seu corpo com IA.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}