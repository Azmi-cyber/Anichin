// ============================================================
//  ANICHIN API PROXY — Vercel Serverless Function
//  URL: https://your-app.vercel.app/api/anime?endpoint=/anime/donghua/home/1
// ============================================================

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { endpoint } = req.query;

    if (!endpoint) {
        return res.status(400).json({ error: 'Parameter endpoint wajib diisi. Contoh: /anime/donghua/home/1' });
    }

    const targetUrl = `https://www.sankavollerei.web.id${endpoint}`;

    try {
        console.log(`[PROXY] Request ke: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            }
        });

        const text = await response.text();
        console.log(`[PROXY] Status: ${response.status}`);
        console.log(`[PROXY] Response: ${text.substring(0, 500)}...`);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('[PROXY] Gagal parse JSON:', e.message);
            return res.status(500).json({
                error: 'Gagal parse response dari API',
                raw: text.substring(0, 500)
            });
        }

        return res.status(200).json({
            success: true,
            endpoint: endpoint,
            data: data
        });

    } catch (error) {
        console.error('[PROXY] Error:', error.message);
        return res.status(500).json({
            error: error.message,
            endpoint: endpoint
        });
    }
}
    }
}
