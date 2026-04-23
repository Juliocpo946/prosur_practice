var graficaVentas = null;

async function cargarReporte(desde, hasta) {
    var url = URLS.reports;

    if (desde || hasta) {
        url += "?";
        if (desde) url += "from=" + desde;
        if (desde && hasta) url += "&";
        if (hasta) url += "to=" + hasta;
    }

    var data = await request(url);
    console.log("reporte:", data);

    if (!data || !data.data) return;

    llenarTop3(data.data);
    llenarTabla(data.data);
    actualizarGrafica(data.data);
}

// agrupa cantidad vendida por producto
function agruparPorProducto(ventas) {
    var mapa = {};
    for (var i = 0; i < ventas.length; i++) {
        var items = ventas[i].items || [];
        for (var j = 0; j < items.length; j++) {
            var nombre = items[j].product_name || "Producto " + items[j].product_id;
            if (!mapa[nombre]) mapa[nombre] = { qty: 0, ingreso: 0 };
            mapa[nombre].qty += Number(items[j].quantity);
            mapa[nombre].ingreso += Number(items[j].quantity) * Number(items[j].unit_price);
        }
    }

    var resultado = [];
    for (var nombre in mapa) {
        resultado.push({ name: nombre, qty: mapa[nombre].qty, ingreso: mapa[nombre].ingreso });
    }
    resultado.sort(function(a, b) { return b.qty - a.qty; });
    return resultado;
}

function llenarTop3(ventas) {
    var top = agruparPorProducto(ventas).slice(0, 3);
    var tbody = document.getElementById("top3-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (top.length === 0) {
        var tr = tbody.insertRow();
        tr.insertCell().colSpan = 3;
        tr.cells[0].textContent = "Sin datos";
        return;
    }

    for (var i = 0; i < top.length; i++) {
        var tr = tbody.insertRow();
        tr.insertCell().textContent = i + 1;
        tr.insertCell().textContent = top[i].name;
        tr.insertCell().textContent = top[i].qty;
    }
}

function llenarTabla(ventas) {
    var todos = agruparPorProducto(ventas);
    var tbody = document.getElementById("ventas-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (todos.length === 0) {
        var tr = tbody.insertRow();
        tr.insertCell().colSpan = 2;
        tr.cells[0].textContent = "Sin datos";
        return;
    }

    for (var i = 0; i < todos.length; i++) {
        var tr = tbody.insertRow();
        tr.insertCell().textContent = todos[i].name;
        tr.insertCell().textContent = todos[i].qty;
        tr.insertCell().textContent = "$" + todos[i].ingreso.toFixed(2);
    }
}

function actualizarGrafica(ventas) {
    var todos = agruparPorProducto(ventas);
    var ctx = document.getElementById("salesChart");
    if (!ctx) return;

    var etiquetas = [];
    var valores = [];
    for (var i = 0; i < todos.length; i++) {
        etiquetas.push(todos[i].name);
        valores.push(todos[i].qty);
    }

    if (graficaVentas) {
        graficaVentas.destroy();
    }

    graficaVentas = new Chart(ctx, {
        type: "bar",
        data: {
            labels: etiquetas,
            datasets: [{
                data: valores,
                backgroundColor: "#274c77"
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}

function initReporte() {
    cargarReporte();

    document.getElementById("filter-submit").addEventListener("click", function() {
        var desde = document.getElementById("filter-from").value;
        var hasta = document.getElementById("filter-to").value;
        cargarReporte(desde || null, hasta || null);
    });
}