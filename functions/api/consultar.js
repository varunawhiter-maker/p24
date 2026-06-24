export async function onRequestPost(context) {
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
