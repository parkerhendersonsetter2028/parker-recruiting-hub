/**
 * Netlify Function: Claude Discovery Engine
 * Calls Claude API to research college volleyball programs
 */

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const { schoolName } = JSON.parse(event.body);
    if (!schoolName) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing schoolName' }) };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
    }

    const prompt = `You are a college volleyball recruiting expert. Provide comprehensive data for "${schoolName}" men's volleyball program for a recruit named Parker Henderson (setter, born 5/10/09, Brophy College Prep Phoenix AZ, club: AZ Fear 17s, interests: business, aviation, theology).
Return ONLY valid JSON (no markdown, no backticks):
{
  "id": "short_id", "name": "Full Name", "city": "City", "state": "ST", "mascot": "Mascot",
  "divLevel": "DI|DII|DIII|NAIA|JUCO", "conference": "Conference name",
  "acceptance": "XX%", "tuitionIn": "$XX,XXX", "tuitionOut": "$XX,XXX",
  "programRank": "#XX or NR", "setterNeed": "High|Med|Low", "priority": "Reach|Target|Safety",
  "url": "https://school.edu", "logoUrl": "https://school.edu", "vbUrl": "https://...", "programIG": "@handle", "questionnaireUrl": "https://...",
  "academic": { "top10": ["Major1","Major2"], "business": "description", "theology": "description", "aviation": "description", "avgGPA": "3.X", "gradRate": "XX%" },
  "parkerFit": { "business": true, "aviation": false, "theology": true, "notes": "2-3 sentence explanation of why this school fits Parker specifically" },
  "coaches": [{ "name": "Name", "role": "Head Coach", "email": "email@school.edu", "phone": "" }],
  "setters": [{ "name": "Name", "grad": "20XX", "class": "JR" }],
  "azRadar": [], "winHistory": [{ "yr": "2025", "w": 0, "l": 0, "p": ".000" }],
  "schedule26": [], "news": [], "notes": "", "section": "discovery", "isVolleyballSchool": true
}
If no men's volleyball program, return: {"isVolleyballSchool": false}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: error.error?.message || 'Claude API error' }),
      };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const parsed = JSON.parse(text.replace(/```json[\s\S]*?```|```/g, '').trim());

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    console.error('Error in claude-discovery:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
