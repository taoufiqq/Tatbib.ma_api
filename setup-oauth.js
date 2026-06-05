// // Save this file as setup-oauth.js

// const { OAuth2Client } = require('google-auth-library');
// const http = require('http');
// const url = require('url');
// const destroyer = require('server-destroy');

// // Function to get OAuth2 tokens
// async function setupOAuth() {
//   try {
//     // Dynamically import 'open' package
//     const open = await import('open');
    
//     // Use environment variables for client info
//     const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || 
//       '547585619798-t6mft5v5vqaqt3dc2prjt9mm27umk3g4.apps.googleusercontent.com';
//     const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || 
//       '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';
//     const GMAIL_REDIRECT_URL = process.env.GMAIL_REDIRECT_URL || 
//       'http://localhost:3000/oauth2callback';
      
//     console.log('Using client ID:', GMAIL_CLIENT_ID);
    
//     // Create OAuth client
//     const oauth2Client = new OAuth2Client(
//       GMAIL_CLIENT_ID,
//       GMAIL_CLIENT_SECRET,
//       GMAIL_REDIRECT_URL
//     );
    
//     // Define required scopes for Gmail API
//     const scopes = [
//       'https://mail.google.com/'
//     ];
    
//     // Generate authorization URL
//     const authorizeUrl = oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: scopes,
//       prompt: 'consent', // Force to show consent screen to get refresh token
//     });
    
//     console.log('Opening the browser for authorization...');
//     await open.default(authorizeUrl);  // .default is necessary when using dynamic imports
    
//     // Create local server to handle the OAuth callback
//     const server = http.createServer(async (req, res) => {
//       try {
//         const reqUrl = new url.URL(req.url, 'http://localhost:3000');
//         const code = reqUrl.searchParams.get('code');
        
//         if (!code) {
//           res.writeHead(400, { 'Content-Type': 'text/html' });
//           res.end('No authorization code found in the callback URL');
//           return;
//         }
        
//         console.log('Authorization code received, exchanging for tokens...');
        
//         // Exchange authorization code for tokens
//         const { tokens } = await oauth2Client.getToken(code);
        
//         console.log('\n--- OAuth2 Tokens (ADD THESE TO YOUR .ENV FILE) ---');
//         console.log('GMAIL_ACCESS_TOKEN=' + tokens.access_token);
//         console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
//         console.log('GMAIL_TOKEN_EXPIRY=' + tokens.expiry_date);
//         console.log('--------------------------------------------------\n');
//         console.log('⚠️  Important: Add the GMAIL_REFRESH_TOKEN to your .env file');
        
//         // Send success response
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(`
//           <html>
//             <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//               <h2 style="color: #4CAF50;">Authentication Successful!</h2>
//               <p>You have successfully authenticated with Google.</p>
//               <p>Check your terminal for the tokens you need to add to your .env file.</p>
//               <p>You can close this window now.</p>
//             </body>
//           </html>
//         `);
        
//         // Close server after handling the callback
//         server.destroy();
//       } catch (error) {
//         console.error('Authentication error:', error);
//         res.writeHead(500, { 'Content-Type': 'text/html' });
//         res.end(`
//           <html>
//             <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//               <h2 style="color: #f44336;">Authentication Error</h2>
//               <p>An error occurred during authentication: ${error.message}</p>
//               <p>Please try again.</p>
//             </body>
//           </html>
//         `);
//         server.destroy();
//       }
//     });
    
//     // Start server
//     server.listen(3000, () => {
//       console.log('Listening for OAuth callback on http://localhost:3000');
//     });
    
//     // Add destroy method to server
//     destroyer(server);
    
//   } catch (error) {
//     console.error('OAuth setup error:', error);
//   }
// }

// // Execute the setup
// setupOAuth();
// Save this file as setup-oauth.js

const { OAuth2Client } = require('google-auth-library');
const http = require('http');
const url = require('url');
const destroyer = require('server-destroy');

// Function to get OAuth2 tokens
async function setupOAuth() {
  try {
    // Dynamically import 'open' package
    const open = await import('open');
    
    // Use environment variables for client info
    const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || 
      '547585619798-t6mft5v5vqaqt3dc2prjt9mm27umk3g4.apps.googleusercontent.com';
    const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || 
      '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';
    const GMAIL_REDIRECT_URL = process.env.GMAIL_REDIRECT_URL || 
      'http://localhost:3001/oauth2callback';
      
    console.log('Using client ID:', GMAIL_CLIENT_ID);
    
    // Create OAuth client
    const oauth2Client = new OAuth2Client(
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      GMAIL_REDIRECT_URL
    );
    
    // Define required scopes for Gmail API
    const scopes = [
      'https://mail.google.com/'
    ];
    
    // Generate authorization URL
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force to show consent screen to get refresh token
    });
    
    console.log('Opening the browser for authorization...');
    await open.default(authorizeUrl);  // .default is necessary when using dynamic imports
    
    // Create local server to handle the OAuth callback
    const server = http.createServer(async (req, res) => {
      try {
        const reqUrl = new url.URL(req.url, 'http://localhost:3001');
        const code = reqUrl.searchParams.get('code');
        
        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('No authorization code found in the callback URL');
          return;
        }
        
        console.log('Authorization code received, exchanging for tokens...');
        
        // Exchange authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        
        console.log('\n--- OAuth2 Tokens (ADD THESE TO YOUR .ENV FILE) ---');
        console.log('GMAIL_ACCESS_TOKEN=' + tokens.access_token);
        console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
        console.log('GMAIL_TOKEN_EXPIRY=' + tokens.expiry_date);
        console.log('--------------------------------------------------\n');
        console.log('⚠️  Important: Add the GMAIL_REFRESH_TOKEN to your .env file');
        
        // Send success response
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #4CAF50;">Authentication Successful!</h2>
              <p>You have successfully authenticated with Google.</p>
              <p>Check your terminal for the tokens you need to add to your .env file.</p>
              <p>You can close this window now.</p>
            </body>
          </html>
        `);
        
        // Close server after handling the callback
        server.destroy();
      } catch (error) {
        console.error('Authentication error:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #f44336;">Authentication Error</h2>
              <p>An error occurred during authentication: ${error.message}</p>
              <p>Please try again.</p>
            </body>
          </html>
        `);
        server.destroy();
      }
    });
    
    // Start server
    server.listen(3001, () => {
      console.log('Listening for OAuth callback on http://localhost:3001');
    });
    
    // Add destroy method to server
    destroyer(server);
    
  } catch (error) {
    console.error('OAuth setup error:', error);
  }
}

// Execute the setup
setupOAuth();