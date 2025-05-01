const { OAuth2Client } = require('google-auth-library');
const http = require('http');
const url = require('url');
const open = require('open'); // Vous devrez peut-être installer ceci : npm install open
const destroyer = require('server-destroy'); // npm install server-destroy

// Remplacez par vos propres identifiants
const CLIENT_ID = '561653101714-lc3vj0dekoj9ab5kul7f4con6i4vli9v.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URL = 'http://localhost:3000/oauth2callback';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// Générer une URL pour que les utilisateurs visitent pour autoriser votre application
const scopes = ['https://mail.google.com/'];
const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent' // Cela garantit que vous obtenez un refresh token à chaque fois
});

// Ouvrir le navigateur pour que l'utilisateur autorise l'application
console.log('Ouverture du navigateur pour l\'autorisation...');
open(authorizeUrl);

// Créer un serveur pour gérer le callback
const server = http.createServer(async (req, res) => {
  try {
    // Obtenir le code de l'URL de callback
    const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
    const code = qs.get('code');
    
    if (!code) {
      res.end('Aucun code trouvé dans l\'URL de callback');
      return;
    }
    
    // Obtenir les jetons à partir du code
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Jeton d\'accès :', tokens.access_token);
    console.log('Jeton d\'actualisation :', tokens.refresh_token);
    
    res.end('Authentification réussie ! Vous pouvez fermer cette fenêtre.');
    server.destroy();
  } catch (error) {
    console.error('Erreur pendant l\'authentification :', error);
    res.end('Erreur d\'authentification : ' + error.message);
    server.destroy();
  }
});

server.listen(3000, () => {
  console.log('En écoute sur http://localhost:3000');
});

destroyer(server);