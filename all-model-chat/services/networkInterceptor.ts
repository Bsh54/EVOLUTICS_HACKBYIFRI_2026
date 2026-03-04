// Network Interceptor Service
// Intercepte les requêtes réseau pour ajouter un proxy si configuré

class NetworkInterceptor {
  private isEnabled = false;
  private proxyUrl = '';

  mount() {
    // Initialisation de l'intercepteur
    console.log('Network interceptor mounted');
  }

  configure(enabled: boolean, proxyUrl?: string) {
    this.isEnabled = enabled;
    this.proxyUrl = proxyUrl || '';
    
    if (enabled && proxyUrl) {
      console.log(`Network interceptor configured with proxy: ${proxyUrl}`);
    } else {
      console.log('Network interceptor disabled');
    }
  }

  unmount() {
    this.isEnabled = false;
    console.log('Network interceptor unmounted');
  }
}

export const networkInterceptor = new NetworkInterceptor();
