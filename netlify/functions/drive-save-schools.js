
/**
 * Netlify Function: Save Parker's added schools to Google Drive
 * Writes to a JSON file stored in Google Drive (via service account)
 */

const { google } = require('googleapis');

// Service account credentials (from environment variable)
const getServiceAccount = () => {
  const creds = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!creds) {
    console.warn('GOOGLE_SERVICE_ACCOUNT not set');
    return null;
  }
  try {
    return JSON.parse(creds);
  } catch (err) {
    console.error('Failed to parse service account:', err);
    return null;
  }
};

const auth = new google.auth.GoogleAuth({
  credentials: getServiceAccount(),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

exports.handler = async (event) => {
  try {
    // Validate request
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' };
    }

    const { schools } = JSON.parse(event.body);
    if (!Array.isArray(schools)) {
      return { statusCode: 400, body: 'Invalid schools data' };
    }

    // File ID in Google Drive
    const FILE_ID = process.env.PARKER_SCHOOLS_FILE_ID;
    if (!FILE_ID) {
      console.warn('PARKER_SCHOOLS_FILE_ID not set');
      return { statusCode: 500, body: 'Drive file ID not configured' };
    }

    // Upload/update file to Google Drive
    const fileContent = JSON.stringify(schools, null, 2);
    
    await drive.files.update(
      {
        fileId: FILE_ID,
        media: { mimeType: 'application/json', body: fileContent }
      }
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, count: schools.length })
    };
  } catch (err) {
    console.error('Error saving schools to Drive:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
