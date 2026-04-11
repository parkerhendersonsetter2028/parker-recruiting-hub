/**
 * Netlify Function: Save Parker's added schools to Google Drive
 * Uses Google Drive API with service account (no extra dependencies)
 */

const { GoogleAuth } = require('google-auth-library');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' };
    }

    const { schools } = JSON.parse(event.body);
    if (!Array.isArray(schools)) {
      return { statusCode: 400, body: 'Invalid schools data' };
    }

    const FILE_ID = process.env.PARKER_SCHOOLS_FILE_ID;
    if (!FILE_ID) {
      return { statusCode: 500, body: 'Drive file ID not configured' };
    }

    const creds = process.env.GOOGLE_SERVICE_ACCOUNT;
    if (!creds) {
      return { statusCode: 500, body: 'Service account not configured' };
    }

    const serviceAccount = JSON.parse(creds);
    
    // Get access token
    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    // Upload file to Google Drive
    const fileContent = JSON.stringify(schools, null, 2);
    
    const url = `https://www.googleapis.com/upload/drive/v3/files/${FILE_ID}?uploadType=media`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
      body: fileContent,
    });

    if (!response.ok) {
      console.error('Failed to save to Drive:', response.status, await response.text());
      return { statusCode: 500, body: 'Failed to save to Drive' };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, count: schools.length })
    };
  } catch (err) {
    console.error('Error saving schools to Drive:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
