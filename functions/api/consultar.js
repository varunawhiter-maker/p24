<script>
    async function consultar() {
        const card = document.getElementById('card').value;
        const res = document.getElementById('res');
        const lista = document.getElementById('listaMovimientos');
        res.innerText = "Consultando...";
        lista.innerHTML = "";

        try {
            const response = await fetch('/api/consultar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardNumber: card })
            });
            const data = await response.json();
            
            if (data.saldo.status) {
                res.innerText = "Saldo: $" + data.saldo.balance.availablePurchase;
                
                data.movimientos.forEach(mov => {
                    const [fecha, tiempo] = mov.date.split('T');
                    const hora = tiempo.substring(0, 5);
                    
                    lista.innerHTML += `<tr>
                        <td>${fecha} ${hora}</td>
                        <td>${mov.amount}</td>
                        <td>${mov.status}</td>
                    </tr>`;
                });
            } else {
                res.innerText = "Error: Tarjeta no encontrada";
            }
        } catch (e) { res.innerText = "Error de conexión"; }
    }
</script>
