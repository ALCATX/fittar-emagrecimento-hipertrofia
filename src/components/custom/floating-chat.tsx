'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  Trash2,
  Clock
} from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  category?: 'nutrition' | 'workout' | 'general'
}

interface ChatHistory {
  messages: ChatMessage[]
  lastActivity: Date
  retentionDays: number
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Carregar histórico de mensagens (últimos 7 dias)
  useEffect(() => {
    const savedHistory = localStorage.getItem('fittar_chat_history')
    if (savedHistory) {
      const history: ChatHistory = JSON.parse(savedHistory)
      
      // Verificar se as mensagens ainda estão dentro do período de retenção
      const retentionDate = new Date()
      retentionDate.setDate(retentionDate.getDate() - history.retentionDays)
      
      const validMessages = history.messages.filter(msg => 
        new Date(msg.timestamp) > retentionDate
      )
      
      setMessages(validMessages)
    } else {
      // Mensagem de boas-vindas
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: `👋 Olá! Sou a IA especializada do Fittar! 

Tenho conhecimento avançado em:
🥗 **Nutrição e Nutrologia** - Cardápios, macros, suplementação
🏋️ **Personal Training** - Treinos, exercícios, técnicas
💪 **Fitness Geral** - Objetivos, progressão, motivação

Como posso te ajudar hoje?`,
        timestamp: new Date(),
        category: 'general'
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // Salvar histórico quando mensagens mudarem
  useEffect(() => {
    if (messages.length > 0) {
      const history: ChatHistory = {
        messages,
        lastActivity: new Date(),
        retentionDays: 7
      }
      localStorage.setItem('fittar_chat_history', JSON.stringify(history))
    }
  }, [messages])

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Atualizar contador de não lidas quando chat está fechado
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastBotMessage = messages.filter(m => m.type === 'bot').pop()
      if (lastBotMessage && new Date(lastBotMessage.timestamp).getTime() > Date.now() - 10000) {
        setUnreadCount(prev => prev + 1)
      }
    } else {
      setUnreadCount(0)
    }
  }, [messages, isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simular resposta da IA
    setTimeout(() => {
      const botResponse = generateAIResponse(userMessage.content)
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        category: botResponse.category
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000) // Simular tempo de processamento
  }

  const generateAIResponse = (userInput: string): { content: string, category: 'nutrition' | 'workout' | 'general' } => {
    const input = userInput.toLowerCase()
    
    // Respostas sobre nutrição
    if (input.includes('dieta') || input.includes('cardápio') || input.includes('alimentação') || 
        input.includes('calorias') || input.includes('proteína') || input.includes('carboidrato') ||
        input.includes('gordura') || input.includes('macro') || input.includes('suplemento')) {
      
      const nutritionResponses = [
        `🥗 **Sobre Nutrição:**

Para uma dieta eficaz, considere:

**Macronutrientes ideais:**
• Proteína: 1.6-2.2g por kg de peso corporal
• Carboidratos: 3-7g por kg (dependendo da atividade)
• Gorduras: 0.8-1.2g por kg

**Dicas importantes:**
✅ Hidrate-se bem (35ml por kg de peso)
✅ Faça 4-6 refeições menores
✅ Inclua vegetais em todas as refeições
✅ Prefira alimentos integrais

Precisa de um cardápio personalizado? Use nossa IA na aba Nutrição! 🚀`,

        `🍎 **Nutrição Inteligente:**

Baseado na ciência nutricional:

**Para emagrecimento:**
• Déficit calórico de 300-500 kcal
• Priorize proteínas magras
• Carboidratos complexos
• Gorduras boas (abacate, oleaginosas)

**Para ganho de massa:**
• Superávit de 200-400 kcal
• Proteína a cada 3-4 horas
• Carboidratos pré e pós-treino
• Creatina 3-5g/dia

**Hidratação:** Água + eletrólitos pós-treino

Quer análise personalizada? Conte mais sobre seus objetivos! 💪`,

        `🥑 **Consultoria Nutricional:**

Como nutricionista especializado:

**Timing nutricional:**
• Pré-treino: Carboidrato + pouca proteína (30-60min antes)
• Pós-treino: Proteína + carboidrato (até 2h depois)
• Antes de dormir: Caseína ou iogurte grego

**Suplementação básica:**
1. Whey protein (pós-treino)
2. Creatina monohidratada
3. Ômega 3
4. Vitamina D3
5. Multivitamínico

**Evite:** Dietas restritivas extremas, jejuns prolongados sem orientação.

Tem alguma restrição alimentar ou objetivo específico? 🎯`
      ]
      
      return {
        content: nutritionResponses[Math.floor(Math.random() * nutritionResponses.length)],
        category: 'nutrition'
      }
    }
    
    // Respostas sobre treino
    if (input.includes('treino') || input.includes('exercício') || input.includes('musculação') ||
        input.includes('academia') || input.includes('força') || input.includes('cardio') ||
        input.includes('hipertrofia') || input.includes('definição') || input.includes('personal')) {
      
      const workoutResponses = [
        `🏋️ **Personal Training Especializado:**

**Princípios do treino eficaz:**

**Para Hipertrofia:**
• 3-4 séries por exercício
• 8-12 repetições
• Descanso: 60-90 segundos
• Frequência: 2x por semana cada músculo

**Para Força:**
• 3-5 séries
• 1-6 repetições
• Descanso: 2-3 minutos
• Foco em exercícios compostos

**Progressão:**
✅ Aumente carga gradualmente (2.5-5%)
✅ Varie estímulos a cada 4-6 semanas
✅ Priorize técnica sobre peso

Qual seu objetivo principal? Posso criar um plano específico! 💪`,

        `🎯 **Metodologia de Treino:**

Como personal trainer certificado:

**Divisão recomendada (intermediário):**
• **A:** Peito, ombro, tríceps
• **B:** Costas, bíceps
• **C:** Pernas, glúteos
• **D:** Cardio/funcional

**Exercícios fundamentais:**
1. Agachamento
2. Levantamento terra
3. Supino
4. Remada
5. Desenvolvimento

**Cardio inteligente:**
• HIIT: 15-20min (queima mais gordura)
• LISS: 30-45min (recuperação ativa)

Tem acesso a academia ou treina em casa? 🏠🏋️`,

        `⚡ **Coaching Fitness:**

**Periodização inteligente:**

**Semana 1-2:** Adaptação
• Cargas moderadas (70% 1RM)
• Foco na técnica
• Volume progressivo

**Semana 3-4:** Intensificação
• Cargas altas (80-85% 1RM)
• Redução de volume
• Máxima qualidade

**Semana 5:** Deload
• Cargas leves (60% 1RM)
• Recuperação ativa

**Sinais de overtraining:**
❌ Fadiga constante
❌ Queda de performance
❌ Irritabilidade
❌ Insônia

Precisa ajustar seu treino atual? Me conte como está! 📊`
      ]
      
      return {
        content: workoutResponses[Math.floor(Math.random() * workoutResponses.length)],
        category: 'workout'
      }
    }
    
    // Respostas gerais sobre fitness
    const generalResponses = [
      `💪 **Consultoria Fitness Completa:**

Olá! Como especialista em fitness, posso te ajudar com:

**🥗 Nutrição:**
• Cardápios personalizados
• Cálculo de macros
• Suplementação
• Timing nutricional

**🏋️ Treino:**
• Programas de exercícios
• Técnicas avançadas
• Periodização
• Correção de movimento

**📊 Acompanhamento:**
• Análise de progresso
• Ajustes na dieta/treino
• Motivação e disciplina

Qual área você gostaria de focar hoje? 🎯`,

      `🚀 **Seu Coach Virtual:**

Baseado em anos de experiência:

**Pilares do sucesso:**
1. **Consistência** > Perfeição
2. **Progressão gradual** > Mudanças drásticas
3. **Equilíbrio** > Extremos
4. **Paciência** > Pressa

**Minha abordagem:**
✅ Ciência aplicada
✅ Individualização
✅ Sustentabilidade
✅ Resultados reais

**Posso te ajudar com:**
• Planejamento nutricional
• Rotinas de treino
• Superação de plateaus
• Motivação e mindset

O que você mais precisa agora? 💭`,

      `🎖️ **Expertise Fitness:**

Como profissional qualificado:

**Certificações:**
• Nutrição Esportiva
• Personal Training
• Fisiologia do Exercício
• Coaching Comportamental

**Especialidades:**
🔥 Emagrecimento sustentável
💪 Ganho de massa muscular
🏃 Performance atlética
🧘 Bem-estar integral

**Metodologia:**
1. Avaliação completa
2. Objetivos SMART
3. Plano personalizado
4. Acompanhamento contínuo
5. Ajustes baseados em resultados

Vamos começar? Me conte seu objetivo principal! 🎯`
    ]
    
    return {
      content: generalResponses[Math.floor(Math.random() * generalResponses.length)],
      category: 'general'
    }
  }

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem('fittar_chat_history')
    
    // Adicionar mensagem de boas-vindas novamente
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      content: `👋 Histórico limpo! 

Sou sua IA especializada em fitness. Como posso te ajudar agora?`,
      timestamp: new Date(),
      category: 'general'
    }
    setMessages([welcomeMessage])
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'nutrition': return 'bg-green-100 text-green-700'
      case 'workout': return 'bg-blue-100 text-blue-700'
      default: return 'bg-purple-100 text-purple-700'
    }
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'nutrition': return '🥗'
      case 'workout': return '🏋️'
      default: return '🤖'
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl border-purple-200 transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm">IA Fitness Especializada</CardTitle>
                <div className="text-xs opacity-90">Nutricionista • Personal Trainer</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[436px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.type === 'bot' && message.category && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Badge className={`text-xs ${getCategoryColor(message.category)}`}>
                          {getCategoryIcon(message.category)} {
                            message.category === 'nutrition' ? 'Nutrição' :
                            message.category === 'workout' ? 'Treino' : 'Geral'
                          }
                        </Badge>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-line">{message.content}</div>
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">IA analisando...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Limpar
                </Button>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  Histórico de 7 dias
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pergunte sobre nutrição, treino..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}