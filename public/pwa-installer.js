// PWA Registration and Installation
class PWAInstaller {
  constructor() {
    this.deferredPrompt = null
    this.isInstalled = false
    this.init()
  }

  init() {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registrado com sucesso:', registration.scope)
          })
          .catch((error) => {
            console.log('Falha ao registrar SW:', error)
          })
      })
    }

    // Capturar evento de instalação
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA pode ser instalado')
      e.preventDefault()
      this.deferredPrompt = e
      this.showInstallButton()
    })

    // Detectar se já está instalado
    window.addEventListener('appinstalled', () => {
      console.log('PWA foi instalado')
      this.isInstalled = true
      this.hideInstallButton()
    })

    // Verificar se já está instalado (iOS)
    if (window.navigator.standalone === true) {
      this.isInstalled = true
    }

    // Verificar se já está instalado (Android)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true
    }
  }

  showInstallButton() {
    // Criar botão de instalação se não existir
    if (!document.getElementById('pwa-install-button') && !this.isInstalled) {
      const installButton = document.createElement('button')
      installButton.id = 'pwa-install-button'
      installButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Instalar App
      `
      installButton.className = `
        fixed bottom-20 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 
        text-white px-4 py-2 rounded-full shadow-lg flex items-center 
        space-x-2 text-sm font-medium transition-all duration-300
        md:bottom-6 md:right-20
      `
      installButton.onclick = () => this.installPWA()
      
      document.body.appendChild(installButton)
    }
  }

  hideInstallButton() {
    const button = document.getElementById('pwa-install-button')
    if (button) {
      button.remove()
    }
  }

  async installPWA() {
    if (!this.deferredPrompt) {
      // Fallback para iOS - mostrar instruções
      if (this.isIOS()) {
        this.showIOSInstructions()
        return
      }
      return
    }

    // Mostrar prompt de instalação
    this.deferredPrompt.prompt()
    
    const { outcome } = await this.deferredPrompt.userChoice
    console.log(`Usuário ${outcome} a instalação`)
    
    if (outcome === 'accepted') {
      this.hideInstallButton()
    }
    
    this.deferredPrompt = null
  }

  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  }

  showIOSInstructions() {
    const modal = document.createElement('div')
    modal.className = `
      fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center 
      justify-center p-4
    `
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-bold mb-4 text-center">
          Instalar Fittar no iOS
        </h3>
        <div class="space-y-3 text-sm text-gray-600">
          <div class="flex items-center space-x-3">
            <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">1</div>
            <span>Toque no botão de compartilhar</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16,6 12,2 8,6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">2</div>
            <span>Selecione "Adicionar à Tela de Início"</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">3</div>
            <span>Toque em "Adicionar"</span>
          </div>
        </div>
        <button 
          onclick="this.parentElement.parentElement.remove()" 
          class="w-full mt-6 bg-emerald-500 text-white py-2 rounded-lg font-medium"
        >
          Entendi
        </button>
      </div>
    `
    document.body.appendChild(modal)
  }

  // Verificar se pode mostrar notificações
  async requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Permissão de notificação concedida')
        return true
      }
    }
    return false
  }

  // Enviar notificação local
  showNotification(title, options = {}) {
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body: options.body || 'Nova notificação do Fittar',
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
          ...options
        })
      })
    }
  }
}

// Inicializar PWA quando DOM estiver pronto
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pwaInstaller = new PWAInstaller()
  })
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PWAInstaller
}