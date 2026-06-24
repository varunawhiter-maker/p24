export async function onRequestPost(context) {
    const { request } = context;
    const body = await request.json();

    const fetchConfig = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber: body.cardNumber })
    };

    // Consultar Saldo y Transacciones en paralelo
    const [resSaldo, resTrans] = await Promise.all([
        fetch("https://pago24.com.ar/api/proxy?url=https%3A%2F%2Fmt-cm01-prd.paytec.com.ar%2Fgiftcards%2Fbalance", fetchConfig),
        fetch("https://pago24.com.ar/api/proxy?url=https%3A%2F%2Fmt-cm01-prd.paytec.com.ar%2Fgiftcards%2Ftransactions", fetchConfig)
    ]);

    const dataSaldo = await resSaldo.json();
    const dataTrans = await resTrans.json();

    return new Response(JSON.stringify({ 
        saldo: dataSaldo, 
        movimientos: dataTrans.transactions || [] 
    }), {
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache'
        }
    });
}
