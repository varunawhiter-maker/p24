const BALANCE_URL =
  "https://pago24.com.ar/api/proxy?url=https%3A%2F%2Fmt-cm01-prd.paytec.com.ar%2Fgiftcards%2Fbalance";

const TRANSACTIONS_URL =
  "https://pago24.com.ar/api/proxy?url=https%3A%2F%2Fmt-cm01-prd.paytec.com.ar%2Fgiftcards%2Ftransactions";

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-store, no-cache",
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: CORS_HEADERS,
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function onRequestPost(context) {
  let body;

  try {
    body = await context.request.json();
  } catch {
    return errorResponse("El cuerpo de la solicitud no es JSON válido.");
  }

  const cardNumber = String(body?.cardNumber ?? "").trim();

  if (!cardNumber) {
    return errorResponse("El campo cardNumber es requerido.");
  }

  if (!/^\d{16}$/.test(cardNumber)) {
    return errorResponse("El cardNumber debe tener exactamente 16 dígitos.");
  }

  const fetchConfig = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardNumber }),
  };

  let balanceRes, transactionsRes;

  try {
    [balanceRes, transactionsRes] = await Promise.all([
      fetch(BALANCE_URL, fetchConfig),
      fetch(TRANSACTIONS_URL, fetchConfig),
    ]);
  } catch (err) {
    return errorResponse("Error al conectar con el proveedor externo.", 502);
  }

  let saldo, transactionsData;

  try {
    [saldo, transactionsData] = await Promise.all([
      balanceRes.json(),
      transactionsRes.json(),
    ]);
  } catch {
    return errorResponse("Respuesta inesperada del proveedor externo.", 502);
  }

  const movimientos = Array.isArray(transactionsData?.transactions)
    ? transactionsData.transactions
    : [];

  return jsonResponse({ saldo, movimientos });
}
