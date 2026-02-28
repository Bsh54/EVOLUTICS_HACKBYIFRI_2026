/**
 * Serveur API simple pour recevoir les données du Google Apps Script
 * Utilise Node.js avec le module http natif
 */

import { createServer } from 'http';
import { URL } from 'url';
import { handlePendingOpportunityAPI } from './api/pending-opportunities.js';

const PORT = process.env.API_PORT || 3001;

// Fonction pour convertir une Request Node.js en Request Web API
function nodeRequestToWebRequest(req) {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  return new Request(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ?
      new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => resolve(body));
      }) : undefined
  });
}

// Serveur HTTP
const server = createServer(async (req, res) => {
  console.log(`📡 ${req.method} ${req.url}`);

  // CORS headers pour toutes les réponses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    // Route pour les opportunités en attente
    if (req.url === '/api/pending-opportunities' || req.url?.startsWith('/api/pending-opportunities')) {

      // Gérer les requêtes OPTIONS (preflight CORS)
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      // Traiter la requête POST
      if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const jsonBody = JSON.parse(body);

            // Créer une Request Web API compatible
            const webRequest = new Request(`http://localhost:${PORT}${req.url}`, {
              method: 'POST',
              headers: req.headers,
              body: JSON.stringify(jsonBody)
            });

            // Traiter avec notre handler
            const response = await handlePendingOpportunityAPI(webRequest);
            const responseText = await response.text();

            res.writeHead(response.status, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(responseText);

          } catch (error) {
            console.error('❌ Erreur parsing JSON:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'JSON invalide' }));
          }
        });

        return;
      }
    }

    // Route de test
    if (req.url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'OK',
        message: 'API EVOLUTICS fonctionnelle',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Route par défaut
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route non trouvée' }));

  } catch (error) {
    console.error('💥 Erreur serveur:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erreur serveur interne' }));
  }
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`🚀 Serveur API EVOLUTICS démarré sur http://localhost:${PORT}`);
  console.log(`📡 Endpoint: POST http://localhost:${PORT}/api/pending-opportunities`);
  console.log(`🏥 Health check: GET http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('📋 Prêt à recevoir les données du Google Apps Script !');
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur API...');
  server.close(() => {
    console.log('✅ Serveur API arrêté');
    process.exit(0);
  });
});

export default server;