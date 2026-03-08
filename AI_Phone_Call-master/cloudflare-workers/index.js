// API TTS unifiée pour Cloudflare Workers
// Reçoit: texte, voix, paramètres -> Renvoie: audio MP3

let expiredAt = null;
let endpoint = null;
let clientId = "76a75279-2ffa-4c3d-8db8-7b47252aa41c";

export default {
  async fetch(request, env, ctx) {
    // Handle CORS pour tous les domaines
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      // Seule route : génération TTS
      if (request.method === "POST") {
        const body = await request.json();

        // Paramètres requis
        const text = body.text || "";
        const voice = body.voice || "fr-FR-DeniseNeural";
        const rate = Number(body.rate) || 0;        // -100 à +100
        const pitch = Number(body.pitch) || 0;      // -100 à +100
        const format = body.format || "audio-24khz-48kbitrate-mono-mp3";

        if (!text.trim()) {
          return new Response(JSON.stringify({ error: "Texte requis" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        return await generateTTS(text, voice, rate, pitch, format, corsHeaders);

      } else if (request.method === "GET") {
        // Support GET avec paramètres URL
        const url = new URL(request.url);
        const text = url.searchParams.get('text') || "";
        const voice = url.searchParams.get('voice') || "fr-FR-DeniseNeural";
        const rate = Number(url.searchParams.get('rate')) || 0;
        const pitch = Number(url.searchParams.get('pitch')) || 0;
        const format = url.searchParams.get('format') || "audio-24khz-48kbitrate-mono-mp3";

        if (!text.trim()) {
          return new Response(JSON.stringify({ error: "Paramètre 'text' requis" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        return await generateTTS(text, voice, rate, pitch, format, corsHeaders);

      } else {
        return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

    } catch (error) {
      console.error("API Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
};

async function generateTTS(text, voice, rate, pitch, format, corsHeaders) {
  try {
    // Rafraîchir le token Microsoft si nécessaire
    await refreshEndpoint();

    // Générer le SSML avec les paramètres
    const ssml = generateSsml(text, voice, rate, pitch);

    // URL de l'API Microsoft TTS
    const url = `https://${endpoint.r}.tts.speech.microsoft.com/cognitiveservices/v1`;

    // Headers pour Microsoft
    const headers = {
      "Authorization": endpoint.t,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": format,
      "User-Agent": "okhttp/4.5.0",
      "Origin": "https://azure.microsoft.com",
      "Referer": "https://azure.microsoft.com/"
    };

    // Appel à l'API Microsoft
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: ssml
    });

    if (!response.ok) {
      throw new Error(`Erreur Microsoft TTS: ${response.status}`);
    }

    // Retourner l'audio directement
    return new Response(response.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${voice}.mp3"`,
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error("TTS Generation Error:", error);
    throw error;
  }
}

function generateSsml(text, voice, rate, pitch) {
  return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="fr-FR">
    <voice name="${voice}">
      <mstts:express-as style="general" styledegree="1.0" role="default">
        <prosody rate="${rate}%" pitch="${pitch}%" volume="50">${text}</prosody>
      </mstts:express-as>
    </voice>
  </speak>`;
}

async function refreshEndpoint() {
  if (!expiredAt || Date.now() / 1000 > expiredAt - 60) {
    try {
      endpoint = await getEndpoint();

      // Parser le token JWT pour l'expiration
      const parts = endpoint.t.split(".");
      if (parts.length >= 2) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decodedJwt = JSON.parse(jsonPayload);
        expiredAt = decodedJwt.exp;
      } else {
        expiredAt = (Date.now() / 1000) + 3600;
      }

      clientId = crypto.randomUUID().replace(/-/g, "");
      console.log(`Token Microsoft obtenu, expire dans ${((expiredAt - Date.now() / 1000) / 60).toFixed(2)} minutes`);
    } catch (error) {
      console.error("Erreur obtention token Microsoft:", error);
      throw error;
    }
  }
}

async function getEndpoint() {
  const endpointUrl = "https://dev.microsofttranslator.com/apps/endpoint?api-version=1.0";
  const headers = {
    "Accept-Language": "fr-FR",
    "X-ClientVersion": "4.0.530a 5fe1dc6c",
    "X-UserId": "0f04d16a175c411e",
    "X-HomeGeographicRegion": "fr-FR",
    "X-ClientTraceId": clientId,
    "X-MT-Signature": await generateSignature(endpointUrl),
    "User-Agent": "okhttp/4.5.0",
    "Content-Type": "application/json; charset=utf-8",
    "Accept-Encoding": "gzip"
  };

  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: headers
  });

  if (!response.ok) {
    throw new Error(`Erreur endpoint Microsoft: ${response.status}`);
  }

  return await response.json();
}

async function generateSignature(urlStr) {
  const url = urlStr.split("://")[1];
  const encodedUrl = encodeURIComponent(url);
  const uuidStr = crypto.randomUUID().replace(/-/g, "");
  const formattedDate = formatDate();
  const bytesToSign = `MSTranslatorAndroidApp${encodedUrl}${formattedDate}${uuidStr}`.toLowerCase();

  const keyData = base64ToArrayBuffer("oik6PdDdMnOXemTbwvMn9de/h9lFnfBaCWbGMMZqqoSaQaqUOqjVGm5NqsmjcBI1x+sS9ugjB55HEJWRiFXYFw==");
  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: { name: 'SHA-256' } }, false, ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(bytesToSign));
  const signatureBase64 = arrayBufferToBase64(signature);

  return `MSTranslatorAndroidApp::${signatureBase64}::${formattedDate}::${uuidStr}`;
}

function formatDate() {
  return new Date().toUTCString().replace(/GMT/, "").trim().toLowerCase() + " gmt";
}

function base64ToArrayBuffer(base64) {
  const binary_string = atob(base64);
  const bytes = new Uint8Array(binary_string.length);
  for (let i = 0; i < binary_string.length; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}