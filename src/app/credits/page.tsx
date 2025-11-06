'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap, 
  Coins, 
  Gift, 
  TrendingUp, 
  Users, 
  DollarSign,
  Send,
  Wallet,
  Star,
  Heart,
  MessageCircle,
  Share2,
  User,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Trophy,
  Target
} from 'lucide-react'

interface Influencer {
  id: string
  name: string
  username: string
  avatar: string
  followers: number
  category: string
  verified: boolean
  creditsReceived: number
  totalEarnings: number
  conversionRate: number
}

interface CreditTransaction {
  id: string
  type: 'sent' | 'received' | 'withdrawn' | 'purchased'
  amount: number
  fromUser?: string
  toUser?: string
  influencer?: string
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  description: string
}

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  bonus: number
  popular?: boolean
}

export default function CreditsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userCredits, setUserCredits] = useState(1250)
  const [userEarnings, setUserEarnings] = useState(89.50)
  
  const [influencers] = useState<Influencer[]>([
    {
      id: '1',
      name: 'Ana Fitness',
      username: '@anafitness',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop',
      followers: 125000,
      category: 'Fitness',
      verified: true,
      creditsReceived: 2450,
      totalEarnings: 245.00,
      conversionRate: 8.5
    },
    {
      id: '2',
      name: 'Carlos Strong',
      username: '@carlosstrong',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      followers: 89000,
      category: 'Musculação',
      verified: true,
      creditsReceived: 1890,
      totalEarnings: 189.00,
      conversionRate: 7.2
    },
    {
      id: '3',
      name: 'Nutricionista Bia',
      username: '@nutribia',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      followers: 67000,
      category: 'Nutrição',
      verified: false,
      creditsReceived: 1340,
      totalEarnings: 134.00,
      conversionRate: 9.1
    }
  ])

  const [transactions] = useState<CreditTransaction[]>([
    {
      id: '1',
      type: 'sent',
      amount: 100,
      toUser: 'Ana Fitness',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Apoio pelo conteúdo inspirador'
    },
    {
      id: '2',
      type: 'received',
      amount: 50,
      fromUser: 'João Silva',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Obrigado pela dica de treino!'
    },
    {
      id: '3',
      type: 'purchased',
      amount: 500,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Compra de pacote de créditos'
    },
    {
      id: '4',
      type: 'withdrawn',
      amount: 25.50,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Saque para conta bancária'
    }
  ])

  const [creditPackages] = useState<CreditPackage[]>([
    {
      id: '1',
      name: 'Pacote Básico',
      credits: 100,
      price: 9.99,
      bonus: 0
    },
    {
      id: '2',
      name: 'Pacote Popular',
      credits: 500,
      price: 39.99,
      bonus: 50,
      popular: true
    },
    {
      id: '3',
      name: 'Pacote Premium',
      credits: 1000,
      price: 69.99,
      bonus: 150
    },
    {
      id: '4',
      name: 'Pacote Mega',
      credits: 2500,
      price: 149.99,
      bonus: 500
    }
  ])

  const [sendAmount, setSendAmount] = useState('')
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>('')
  const [sendMessage, setSendMessage] = useState('')

  const handleSendCredits = () => {
    if (sendAmount && selectedInfluencer && Number(sendAmount) <= userCredits) {
      const amount = Number(sendAmount)
      setUserCredits(prev => prev - amount)
      
      // Simular transação
      const newTransaction: CreditTransaction = {
        id: Date.now().toString(),
        type: 'sent',
        amount: amount,
        toUser: influencers.find(i => i.id === selectedInfluencer)?.name || '',
        timestamp: new Date(),
        status: 'completed',
        description: sendMessage || 'Apoio do fã'
      }
      
      setSendAmount('')
      setSelectedInfluencer('')
      setSendMessage('')
      
      alert(`${amount} FitCoins enviados com sucesso! 🎉`)
    }
  }

  const handlePurchaseCredits = (packageId: string) => {
    const creditPackage = creditPackages.find(p => p.id === packageId)
    if (creditPackage) {
      const totalCredits = creditPackage.credits + creditPackage.bonus
      setUserCredits(prev => prev + totalCredits)
      
      alert(`${totalCredits} FitCoins adicionados à sua conta! 💰`)
    }
  }

  const handleWithdraw = () => {
    if (userEarnings >= 10) {
      const withdrawAmount = Math.floor(userEarnings)
      setUserEarnings(prev => prev - withdrawAmount)
      
      alert(`R$ ${withdrawAmount.toFixed(2)} solicitado para saque! 💳`)
    } else {
      alert('Valor mínimo para saque é R$ 10,00')
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getTransactionIcon = (type: CreditTransaction['type']) => {
    switch (type) {
      case 'sent': return <ArrowUpRight className="w-4 h-4 text-red-500" />
      case 'received': return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case 'purchased': return <CreditCard className="w-4 h-4 text-blue-500" />
      case 'withdrawn': return <Wallet className="w-4 h-4 text-purple-500" />
    }
  }

  const getTransactionColor = (type: CreditTransaction['type']) => {
    switch (type) {
      case 'sent': return 'text-red-600'
      case 'received': return 'text-green-600'
      case 'purchased': return 'text-blue-600'
      case 'withdrawn': return 'text-purple-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-yellow-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                FitCoins
              </span>
              <div className="text-xs text-gray-600">Sistema de Créditos</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">{userCredits}</span>
            </div>
            
            <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">R$ {userEarnings.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Créditos FitCoins 💰
          </h1>
          <p className="text-lg text-gray-600">
            Apoie seus influenciadores favoritos e ganhe dinheiro com seu conteúdo
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-yellow-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{userCredits}</div>
              <div className="text-sm text-gray-600">FitCoins</div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">R$ {userEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Ganhos</div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {transactions.filter(t => t.type === 'sent').length}
              </div>
              <div className="text-sm text-gray-600">Apoios Enviados</div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {transactions.filter(t => t.type === 'received').length}
              </div>
              <div className="text-sm text-gray-600">Apoios Recebidos</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-yellow-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="influencers" className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700">
              <Users className="w-4 h-4 mr-2" />
              Influenciadores
            </TabsTrigger>
            <TabsTrigger value="buy" className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700">
              <Gift className="w-4 h-4 mr-2" />
              Comprar Créditos
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700">
              <Wallet className="w-4 h-4 mr-2" />
              Meus Ganhos
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Send Credits */}
              <Card className="border-yellow-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="w-5 h-5 text-yellow-600" />
                    <span>Enviar FitCoins</span>
                  </CardTitle>
                  <CardDescription>
                    Apoie seus influenciadores favoritos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Quantidade</Label>
                    <Input 
                      id="amount"
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="100"
                      max={userCredits}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="influencer">Influenciador</Label>
                    <select 
                      id="influencer"
                      value={selectedInfluencer}
                      onChange={(e) => setSelectedInfluencer(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione um influenciador</option>
                      {influencers.map((influencer) => (
                        <option key={influencer.id} value={influencer.id}>
                          {influencer.name} ({influencer.username})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Mensagem (opcional)</Label>
                    <Input 
                      id="message"
                      value={sendMessage}
                      onChange={(e) => setSendMessage(e.target.value)}
                      placeholder="Obrigado pelo conteúdo!"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSendCredits}
                    disabled={!sendAmount || !selectedInfluencer || Number(sendAmount) > userCredits}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar FitCoins
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="border-yellow-100 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                    <span>Transações Recentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <div className="font-semibold text-sm">{transaction.description}</div>
                            <div className="text-xs text-gray-600">
                              {transaction.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'sent' ? '-' : '+'}
                          {transaction.type === 'withdrawn' ? 'R$ ' : ''}
                          {transaction.type === 'withdrawn' ? transaction.amount.toFixed(2) : transaction.amount}
                          {transaction.type !== 'withdrawn' ? ' FC' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Influencers Tab */}
          <TabsContent value="influencers" className="space-y-6">
            <div className="grid gap-6">
              {influencers.map((influencer) => (
                <Card key={influencer.id} className="border-yellow-100">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={influencer.avatar} 
                          alt={influencer.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">{influencer.name}</h3>
                            {influencer.verified && (
                              <Badge className="bg-blue-100 text-blue-700">
                                ✓ Verificado
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{influencer.username}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>👥 {formatNumber(influencer.followers)} seguidores</span>
                            <span>📂 {influencer.category}</span>
                            <span>💰 {influencer.conversionRate}% conversão</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-600">
                          {influencer.creditsReceived}
                        </div>
                        <div className="text-sm text-gray-600">FitCoins recebidos</div>
                        <div className="text-sm text-green-600 font-semibold">
                          R$ {influencer.totalEarnings.toFixed(2)} ganhos
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedInfluencer(influencer.id)
                          setActiveTab('overview')
                        }}
                        className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Apoiar
                      </Button>
                      <Button size="sm" variant="outline">
                        <User className="w-4 h-4 mr-2" />
                        Ver Perfil
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Mensagem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Buy Credits Tab */}
          <TabsContent value="buy" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Comprar FitCoins
              </h2>
              <p className="text-gray-600">
                Escolha o pacote ideal para apoiar seus influenciadores favoritos
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {creditPackages.map((creditPackage) => (
                <Card 
                  key={creditPackage.id} 
                  className={`border-yellow-100 relative ${creditPackage.popular ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  {creditPackage.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle>{creditPackage.name}</CardTitle>
                    <div className="text-3xl font-bold text-yellow-600">
                      R$ {creditPackage.price.toFixed(2)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="text-center space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {creditPackage.credits}
                      </div>
                      <div className="text-sm text-gray-600">FitCoins</div>
                    </div>
                    
                    {creditPackage.bonus > 0 && (
                      <div className="bg-green-50 p-2 rounded-lg">
                        <div className="text-green-700 font-semibold">
                          +{creditPackage.bonus} Bônus!
                        </div>
                        <div className="text-xs text-green-600">
                          Total: {creditPackage.credits + creditPackage.bonus} FitCoins
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => handlePurchaseCredits(creditPackage.id)}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Comprar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-yellow-100">
              <CardHeader>
                <CardTitle>Como Funciona</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CreditCard className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Compre FitCoins</h3>
                    <p className="text-sm text-gray-600">
                      Escolha um pacote e adicione créditos à sua conta
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Gift className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold mb-2">2. Apoie Influenciadores</h3>
                    <p className="text-sm text-gray-600">
                      Envie FitCoins para seus criadores de conteúdo favoritos
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Eles Ganham Dinheiro</h3>
                    <p className="text-sm text-gray-600">
                      Influenciadores convertem FitCoins em dinheiro real
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-yellow-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5 text-yellow-600" />
                    <span>Meus Ganhos</span>
                  </CardTitle>
                  <CardDescription>
                    Ganhe dinheiro com FitCoins recebidos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      R$ {userEarnings.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Disponível para saque</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Taxa de conversão:</span>
                      <span className="font-semibold">1 FitCoin = R$ 0,10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Valor mínimo para saque:</span>
                      <span className="font-semibold">R$ 10,00</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleWithdraw}
                    disabled={userEarnings < 10}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Solicitar Saque
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-yellow-100">
                <CardHeader>
                  <CardTitle>Histórico de Ganhos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.filter(t => t.type === 'received').map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ArrowDownLeft className="w-4 h-4 text-green-500" />
                          <div>
                            <div className="font-semibold text-sm">{transaction.description}</div>
                            <div className="text-xs text-gray-600">
                              De: {transaction.fromUser}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            +{transaction.amount} FC
                          </div>
                          <div className="text-xs text-gray-600">
                            R$ {(transaction.amount * 0.1).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-yellow-100">
              <CardHeader>
                <CardTitle>Como Ganhar Mais FitCoins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Crie Conteúdo de Qualidade</h3>
                    <p className="text-sm text-gray-600">
                      Compartilhe dicas, treinos e resultados inspiradores
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Engaje com a Comunidade</h3>
                    <p className="text-sm text-gray-600">
                      Responda comentários e ajude outros usuários
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Complete Desafios</h3>
                    <p className="text-sm text-gray-600">
                      Participe de desafios e ganhe FitCoins como recompensa
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}