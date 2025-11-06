// Sistema de autenticação e controle de acesso do Fittar

export interface AuthUser {
  id: string
  email?: string
  cpf?: string
  deviceId: string
  ipAddress: string
  name: string
  phone?: string
  authMethod: 'email' | 'google' | 'apple' | 'cpf'
  isVerified: boolean
  createdAt: Date
  lastLogin: Date
}

export interface DeviceInfo {
  id: string
  userId: string
  deviceId: string
  deviceName: string
  platform: 'ios' | 'android' | 'web'
  ipAddress: string
  userAgent: string
  isActive: boolean
  firstSeen: Date
  lastSeen: Date
}

export interface AuthSession {
  id: string
  userId: string
  deviceId: string
  ipAddress: string
  token: string
  expiresAt: Date
  isActive: boolean
  createdAt: Date
}

// Função para gerar ID único do dispositivo
export function generateDeviceId(): string {
  if (typeof window !== 'undefined') {
    // Tentar obter do localStorage primeiro
    let deviceId = localStorage.getItem('fittar_device_id')
    
    if (!deviceId) {
      // Gerar novo ID baseado em características do dispositivo
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      ctx!.textBaseline = 'top'
      ctx!.font = '14px Arial'
      ctx!.fillText('Device fingerprint', 2, 2)
      
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
      ].join('|')
      
      deviceId = btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
      localStorage.setItem('fittar_device_id', deviceId)
    }
    
    return deviceId
  }
  
  // Fallback para servidor
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Função para obter IP do usuário
export async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('Erro ao obter IP:', error)
    return '0.0.0.0'
  }
}

// Função para validar CPF
export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '')
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i)
  }
  let remainder = sum % 11
  let digit1 = remainder < 2 ? 0 : 11 - remainder
  
  if (parseInt(cpf[9]) !== digit1) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i)
  }
  remainder = sum % 11
  let digit2 = remainder < 2 ? 0 : 11 - remainder
  
  return parseInt(cpf[10]) === digit2
}

// Função para formatar CPF
export function formatCPF(cpf: string): string {
  cpf = cpf.replace(/[^\d]/g, '')
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Função para verificar se usuário já existe
export function checkExistingUser(cpf?: string, deviceId?: string, ipAddress?: string): boolean {
  const existingUsers = JSON.parse(localStorage.getItem('fittar_users') || '[]')
  
  return existingUsers.some((user: AuthUser) => 
    (cpf && user.cpf === cpf) ||
    (deviceId && user.deviceId === deviceId) ||
    (ipAddress && user.ipAddress === ipAddress)
  )
}

// Função para criar novo usuário
export function createUser(userData: Partial<AuthUser>): AuthUser {
  const newUser: AuthUser = {
    id: Date.now().toString(),
    deviceId: userData.deviceId || generateDeviceId(),
    ipAddress: userData.ipAddress || '0.0.0.0',
    name: userData.name || '',
    email: userData.email,
    cpf: userData.cpf,
    phone: userData.phone,
    authMethod: userData.authMethod || 'email',
    isVerified: false,
    createdAt: new Date(),
    lastLogin: new Date()
  }
  
  // Salvar usuário
  const existingUsers = JSON.parse(localStorage.getItem('fittar_users') || '[]')
  existingUsers.push(newUser)
  localStorage.setItem('fittar_users', JSON.stringify(existingUsers))
  
  // Criar sessão
  createSession(newUser.id, newUser.deviceId, newUser.ipAddress)
  
  return newUser
}

// Função para criar sessão
export function createSession(userId: string, deviceId: string, ipAddress: string): AuthSession {
  const session: AuthSession = {
    id: Date.now().toString(),
    userId,
    deviceId,
    ipAddress,
    token: generateSessionToken(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    isActive: true,
    createdAt: new Date()
  }
  
  localStorage.setItem('fittar_session', JSON.stringify(session))
  return session
}

// Função para gerar token de sessão
function generateSessionToken(): string {
  return btoa(Date.now().toString() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, '')
}

// Função para verificar sessão ativa
export function getActiveSession(): AuthSession | null {
  const sessionData = localStorage.getItem('fittar_session')
  if (!sessionData) return null
  
  const session: AuthSession = JSON.parse(sessionData)
  
  // Verificar se sessão não expirou
  if (new Date() > new Date(session.expiresAt)) {
    localStorage.removeItem('fittar_session')
    return null
  }
  
  return session
}

// Função para logout
export function logout(): void {
  localStorage.removeItem('fittar_session')
  localStorage.removeItem('fittarProfile')
  // Manter device_id para próximo login
}

// Função para verificar se é primeiro acesso do dispositivo
export function isFirstTimeDevice(): boolean {
  return !localStorage.getItem('fittar_device_id')
}

// Função para registrar informações do dispositivo
export function registerDevice(userId: string): DeviceInfo {
  const deviceInfo: DeviceInfo = {
    id: Date.now().toString(),
    userId,
    deviceId: generateDeviceId(),
    deviceName: getDeviceName(),
    platform: getPlatform(),
    ipAddress: '0.0.0.0', // Será atualizado via API
    userAgent: navigator.userAgent,
    isActive: true,
    firstSeen: new Date(),
    lastSeen: new Date()
  }
  
  // Salvar informações do dispositivo
  const devices = JSON.parse(localStorage.getItem('fittar_devices') || '[]')
  devices.push(deviceInfo)
  localStorage.setItem('fittar_devices', JSON.stringify(devices))
  
  return deviceInfo
}

// Função para obter nome do dispositivo
function getDeviceName(): string {
  const userAgent = navigator.userAgent
  
  if (/iPhone/.test(userAgent)) return 'iPhone'
  if (/iPad/.test(userAgent)) return 'iPad'
  if (/Android/.test(userAgent)) return 'Android'
  if (/Windows/.test(userAgent)) return 'Windows'
  if (/Mac/.test(userAgent)) return 'Mac'
  
  return 'Unknown Device'
}

// Função para obter plataforma
function getPlatform(): 'ios' | 'android' | 'web' {
  const userAgent = navigator.userAgent
  
  if (/iPhone|iPad/.test(userAgent)) return 'ios'
  if (/Android/.test(userAgent)) return 'android'
  
  return 'web'
}

// Função para verificar limite de dispositivos por usuário
export function checkDeviceLimit(userId: string): boolean {
  const devices = JSON.parse(localStorage.getItem('fittar_devices') || '[]')
  const userDevices = devices.filter((device: DeviceInfo) => 
    device.userId === userId && device.isActive
  )
  
  return userDevices.length < 3 // Máximo 3 dispositivos por usuário
}

// Função para seguir conta oficial automaticamente
export function followOfficialAccount(userId: string): void {
  const following = JSON.parse(localStorage.getItem('fittar_following') || '[]')
  
  // Adicionar conta oficial se não estiver seguindo
  if (!following.includes('fittar_oficial')) {
    following.push('fittar_oficial')
    localStorage.setItem('fittar_following', JSON.stringify(following))
  }
}

// Função para verificar autenticação social
export function authenticateWithGoogle(): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    // Simular autenticação com Google
    setTimeout(() => {
      const userData = {
        name: 'Usuário Google',
        email: 'usuario@gmail.com',
        authMethod: 'google' as const,
        isVerified: true
      }
      
      const user = createUser(userData)
      followOfficialAccount(user.id)
      resolve(user)
    }, 1000)
  })
}

export function authenticateWithApple(): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    // Simular autenticação com Apple
    setTimeout(() => {
      const userData = {
        name: 'Usuário Apple',
        email: 'usuario@icloud.com',
        authMethod: 'apple' as const,
        isVerified: true
      }
      
      const user = createUser(userData)
      followOfficialAccount(user.id)
      resolve(user)
    }, 1000)
  })
}

// Função para autenticação por CPF
export function authenticateWithCPF(cpf: string, name: string): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    if (!validateCPF(cpf)) {
      reject(new Error('CPF inválido'))
      return
    }
    
    // Verificar se CPF já está cadastrado
    if (checkExistingUser(cpf)) {
      reject(new Error('CPF já cadastrado'))
      return
    }
    
    const userData = {
      name,
      cpf: formatCPF(cpf),
      authMethod: 'cpf' as const,
      isVerified: true
    }
    
    const user = createUser(userData)
    followOfficialAccount(user.id)
    resolve(user)
  })
}