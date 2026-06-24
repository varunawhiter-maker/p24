export async function onRequestPost(context) {
    const { request } = context;
    let body;
    
    try {
        body = await request.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }
    
    // Petición al servidor real
    const response = await fetch("https://pago24.com.ar/api/proxy?url=https%3A%2F%2Fmt-cm01-prd.paytec.com.ar%2Fgiftcards%2Fbalance&authRequired=false", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://pago24.com.ar/tarjetas-regalo'
        },
        body: JSON.stringify({ cardNumber: body.cardNumber })
    });

    const data = await response.json();
    
    // Retornamos la respuesta forzando al navegador a NO guardar caché
    return new Response(JSON.stringify(data), {
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });
}

// Opcional: Manejo de preflight para evitar bloqueos CORS
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}export async function onRequestPost(context) {
    const { request } = context;
    const body = await request.json();
    
    // Aquí hacemos la petición al servidor real
    const response = await fetch("https://pago24.com.ar/api/proxy?url=https%3A%2F%2Fmt-cm01-prd.paytec.com.ar%2Fgiftcards%2Fbalance&authRequired=false", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://pago24.com.ar/tarjetas-regalo'
        },
        body: JSON.stringify({ cardNumber: body.cardNumber })
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Asegura que no haya problemas de CORS
        }
    });
}
