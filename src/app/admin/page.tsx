'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap, 
  Building2, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar, 
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Image as ImageIcon,
  Video,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react'

interface Campaign {
  id: string
  title: string
  description: string
  type: 'banner' | 'post' | 'video' | 'story'
  category: 'gym' | 'restaurant' | 'supplement' | 'equipment' | 'clothing'
  budget: number
  targetAudience: string[]
  startDate: string
  endDate: string
  status: 'active' | 'paused' | 'completed' | 'draft'
  impressions: number
  clicks: number
  conversions: number
  imageUrl?: string
  videoUrl?: string
}

interface BusinessProfile {
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
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Academia FitMax - Promoção Verão',
      description: 'Matricule-se agora e ganhe 2 meses grátis! Equipamentos de última geração.',
      type: 'banner',
      category: 'gym',
      budget: 2500,
      targetAudience: ['18-35', 'fitness-enthusiasts', 'weight-loss'],
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'active',
      impressions: 15420,
      clicks: 892,
      conversions: 67,
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop'
    },
    {
      id: '2',
      title: 'Restaurante Fit Gourmet - Cardápio Saudável',
      description: 'Refeições balanceadas e deliciosas. Delivery grátis para pedidos acima de R$ 50.',
      type: 'post',
      category: 'restaurant',
      budget: 1800,
      targetAudience: ['25-45', 'healthy-eating', 'busy-professionals'],
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      status: 'active',
      impressions: 8930,
      clicks: 445,
      conversions: 89,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop'
    }
  ])

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    id: '1',
    name: 'Academia FitMax',
    category: 'gym',
    description: 'A melhor academia da região com equipamentos de última geração e personal trainers qualificados.',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    phone: '(11) 99999-9999',
    email: 'contato@fitmax.com.br',
    website: 'www.fitmax.com.br',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
    verified: true,
    rating: 4.8,
    totalReviews: 247
  })

  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    type: 'banner',
    category: 'gym',
    status: 'draft',
    targetAudience: [],
    impressions: 0,
    clicks: 0,
    conversions: 0
  })

  const [showCreateCampaign, setShowCreateCampaign] = useState(false)

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0)
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0'
  const avgConversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0'

  const handleCreateCampaign = () => {
    if (newCampaign.title && newCampaign.description && newCampaign.budget) {
      const campaign: Campaign = {
        id: Date.now().toString(),
        title: newCampaign.title,
        description: newCampaign.description,
        type: newCampaign.type || 'banner',
        category: newCampaign.category || 'gym',
        budget: newCampaign.budget,
        targetAudience: newCampaign.targetAudience || [],
        startDate: newCampaign.startDate || new Date().toISOString().split('T')[0],
        endDate: newCampaign.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        impressions: 0,
        clicks: 0,
        conversions: 0,
        imageUrl: newCampaign.imageUrl,
        videoUrl: newCampaign.videoUrl
      }
      
      setCampaigns([...campaigns, campaign])
      setNewCampaign({
        type: 'banner',
        category: 'gym',
        status: 'draft',
        targetAudience: [],
        impressions: 0,
        clicks: 0,
        conversions: 0
      })
      setShowCreateCampaign(false)
    }
  }

  const updateCampaignStatus = (campaignId: string, status: Campaign['status']) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId ? { ...campaign, status } : campaign
    ))
  }

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gym': return '🏋️'
      case 'restaurant': return '🍽️'
      case 'supplement': return '💊'
      case 'equipment': return '🏃'
      case 'clothing': return '👕'
      default: return '🏢'
    }
  }

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'paused': return 'bg-yellow-100 text-yellow-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'draft': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Fittar Business
              </span>
              <div className="text-xs text-gray-600">Painel Administrativo</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src={businessProfile.logo} 
                alt={businessProfile.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-700">{businessProfile.name}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  {businessProfile.verified && <span className="text-green-500 mr-1">✓</span>}
                  {businessProfile.category}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo - {businessProfile.name}
          </h1>
          <p className="text-lg text-gray-600">
            Gerencie suas campanhas publicitárias e acompanhe o desempenho no Fittar
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-blue-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">R$ {totalBudget.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Orçamento Total</div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalImpressions.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Impressões</div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{avgCTR}%</div>
              <div className="text-sm text-gray-600">CTR Médio</div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-100">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalConversions}</div>
              <div className="text-sm text-gray-600">Conversões</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-blue-100">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Target className="w-4 h-4 mr-2" />
              Campanhas
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Performance Overview */}
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>Performance Geral</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Campanhas Ativas</span>
                    <span className="font-semibold">{campaigns.filter(c => c.status === 'active').length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taxa de Conversão</span>
                    <span className="font-semibold">{avgConversionRate}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ROI Estimado</span>
                    <span className="font-semibold text-green-600">+245%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Atividade Recente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-semibold">Nova conversão</div>
                      <div className="text-gray-600">Academia FitMax - há 2h</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-semibold">Campanha iniciada</div>
                      <div className="text-gray-600">Promoção Verão - há 1 dia</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-semibold">Orçamento 80% usado</div>
                      <div className="text-gray-600">Cardápio Saudável - há 2 dias</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Campaign */}
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span>Melhor Campanha</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {campaigns.length > 0 && (
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold">{campaigns[0].title}</div>
                        <div className="text-sm text-gray-600">{campaigns[0].description}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-600">Impressões</div>
                          <div className="font-semibold">{campaigns[0].impressions.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">CTR</div>
                          <div className="font-semibold">
                            {((campaigns[0].clicks / campaigns[0].impressions) * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Suas Campanhas</h2>
              <Button 
                onClick={() => setShowCreateCampaign(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Campanha
              </Button>
            </div>

            <div className="grid gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="border-blue-100">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        {campaign.imageUrl && (
                          <img 
                            src={campaign.imageUrl} 
                            alt={campaign.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                          <p className="text-gray-600 mb-2">{campaign.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{getCategoryIcon(campaign.category)} {campaign.category}</span>
                            <span>📅 {campaign.startDate} - {campaign.endDate}</span>
                            <span>💰 R$ {campaign.budget.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status === 'active' ? 'Ativa' :
                           campaign.status === 'paused' ? 'Pausada' :
                           campaign.status === 'completed' ? 'Concluída' : 'Rascunho'}
                        </Badge>
                        
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteCampaign(campaign.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{campaign.impressions.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Impressões</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{campaign.clicks}</div>
                        <div className="text-xs text-gray-600">Cliques</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : '0'}%
                        </div>
                        <div className="text-xs text-gray-600">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{campaign.conversions}</div>
                        <div className="text-xs text-gray-600">Conversões</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {campaign.status === 'active' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateCampaignStatus(campaign.id, 'paused')}
                        >
                          Pausar
                        </Button>
                      ) : campaign.status === 'paused' ? (
                        <Button 
                          size="sm"
                          onClick={() => updateCampaignStatus(campaign.id, 'active')}
                        >
                          Reativar
                        </Button>
                      ) : campaign.status === 'draft' ? (
                        <Button 
                          size="sm"
                          onClick={() => updateCampaignStatus(campaign.id, 'active')}
                        >
                          Publicar
                        </Button>
                      ) : null}
                      
                      <Button size="sm" variant="outline">
                        Ver Relatório
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle>Desempenho por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">🏋️ Academia</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">75%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">🍽️ Restaurante</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">60%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">💊 Suplementos</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">45%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle>Público-Alvo Mais Engajado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">18-25 anos</span>
                      <span className="font-semibold">32%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">26-35 anos</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">36-45 anos</span>
                      <span className="font-semibold">18%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">46+ anos</span>
                      <span className="font-semibold">5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Mantenha as informações da sua empresa atualizadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome da Empresa</Label>
                    <Input 
                      id="name" 
                      value={businessProfile.name}
                      onChange={(e) => setBusinessProfile({...businessProfile, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select 
                      value={businessProfile.category}
                      onValueChange={(value: any) => setBusinessProfile({...businessProfile, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gym">Academia</SelectItem>
                        <SelectItem value="restaurant">Restaurante</SelectItem>
                        <SelectItem value="supplement">Suplementos</SelectItem>
                        <SelectItem value="equipment">Equipamentos</SelectItem>
                        <SelectItem value="clothing">Roupas Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description"
                    value={businessProfile.description}
                    onChange={(e) => setBusinessProfile({...businessProfile, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      value={businessProfile.phone}
                      onChange={(e) => setBusinessProfile({...businessProfile, phone: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={businessProfile.email}
                      onChange={(e) => setBusinessProfile({...businessProfile, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input 
                    id="address" 
                    value={businessProfile.address}
                    onChange={(e) => setBusinessProfile({...businessProfile, address: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={businessProfile.website}
                    onChange={(e) => setBusinessProfile({...businessProfile, website: e.target.value})}
                  />
                </div>

                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Nova Campanha */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Criar Nova Campanha</CardTitle>
              <CardDescription>
                Configure sua campanha publicitária no Fittar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Campanha</Label>
                <Input 
                  id="title"
                  value={newCampaign.title || ''}
                  onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                  placeholder="Ex: Promoção de Verão - 50% OFF"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description"
                  value={newCampaign.description || ''}
                  onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                  placeholder="Descreva sua oferta ou serviço..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo de Anúncio</Label>
                  <Select 
                    value={newCampaign.type}
                    onValueChange={(value: any) => setNewCampaign({...newCampaign, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="post">Post no Feed</SelectItem>
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select 
                    value={newCampaign.category}
                    onValueChange={(value: any) => setNewCampaign({...newCampaign, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gym">Academia</SelectItem>
                      <SelectItem value="restaurant">Restaurante</SelectItem>
                      <SelectItem value="supplement">Suplementos</SelectItem>
                      <SelectItem value="equipment">Equipamentos</SelectItem>
                      <SelectItem value="clothing">Roupas Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input 
                    id="startDate"
                    type="date"
                    value={newCampaign.startDate || ''}
                    onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Data de Término</Label>
                  <Input 
                    id="endDate"
                    type="date"
                    value={newCampaign.endDate || ''}
                    onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="budget">Orçamento (R$)</Label>
                <Input 
                  id="budget"
                  type="number"
                  value={newCampaign.budget || ''}
                  onChange={(e) => setNewCampaign({...newCampaign, budget: Number(e.target.value)})}
                  placeholder="1000"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">URL da Imagem (opcional)</Label>
                <Input 
                  id="imageUrl"
                  value={newCampaign.imageUrl || ''}
                  onChange={(e) => setNewCampaign({...newCampaign, imageUrl: e.target.value})}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCreateCampaign(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  onClick={handleCreateCampaign}
                >
                  Criar Campanha
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}