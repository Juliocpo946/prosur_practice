// carrito: product_id, nombre, precio, qty 
var carrito = [];


async function cargarProductos() {
    var data = await request(URLS.products);
    console.log("productos:", data);

    var lista = document.getElementById("productos-lista");
    lista.innerHTML = "";

    if (!data || !data.data || data.data.length === 0) {
        lista.textContent = "No hay productos";
        return;
    }

    // agrupar por categoria
    var grupos = {};
    for (var i = 0; i < data.data.length; i++) {
        var prod = data.data[i];
        var cat = prod.category_name || "Sin categoría";
        if (!grupos[cat]) grupos[cat] = [];
        grupos[cat].push(prod);
    }

    for (var cat in grupos) {
        var bloque = document.createElement("div");
        bloque.className = "category-block";

        var titulo = document.createElement("h3");
        titulo.textContent = cat;
        bloque.appendChild(titulo);

        var grid = document.createElement("div");
        grid.className = "grid";

        var prods = grupos[cat];
        for (var j = 0; j < prods.length; j++) {
            grid.appendChild(crearCard(prods[j]));
        }

        bloque.appendChild(grid);

        var divider = document.createElement("div");
        divider.className = "divider";
        bloque.appendChild(divider);

        lista.appendChild(bloque);
    }
}

function crearCard(prod) {
    var card = document.createElement("div");
    card.className = "card";
    card.dataset.id = prod.id;

    var header = document.createElement("div");
    header.className = "card-header";
    var h4 = document.createElement("h4");
    h4.textContent = prod.name;
    header.appendChild(h4);

    var body = document.createElement("div");
    body.className = "card-body";

    var precio = document.createElement("p");
    precio.className = "price";
    precio.textContent = "$" + prod.price;

    var stock = document.createElement("p");
    stock.className = "stock";
    stock.textContent = "Stock: " + prod.stock;

    body.appendChild(precio);
    body.appendChild(stock);

    var footer = document.createElement("div");
    footer.className = "card-footer";

    var controles = document.createElement("div");
    controles.className = "qty-controls";

    var btnMenos = document.createElement("button");
    btnMenos.textContent = "-";
    btnMenos.onclick = function() {
        cambiarCantidad(prod, -1, spanQty);
    };

    var spanQty = document.createElement("span");
    spanQty.className = "qty";
    spanQty.textContent = "0";

    var btnMas = document.createElement("button");
    btnMas.textContent = "+";
    btnMas.onclick = function() {
        cambiarCantidad(prod, 1, spanQty);
    };

    controles.appendChild(btnMenos);
    controles.appendChild(spanQty);
    controles.appendChild(btnMas);
    footer.appendChild(controles);

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);

    return card;
}


function cambiarCantidad(prod, delta, spanQty) {
    var item = buscarEnCarrito(prod.id);

    if (!item) {
        if (delta < 0) return;
        item = { product_id: prod.id, nombre: prod.name, precio: prod.price, qty: 0 };
        carrito.push(item);
    }

    var nuevaQty = item.qty + delta;
    if (nuevaQty < 0) return;
    if (nuevaQty > prod.stock) return;

    item.qty = nuevaQty;
    spanQty.textContent = nuevaQty;

    if (item.qty === 0) {
        carrito.splice(carrito.indexOf(item), 1);
    }

    actualizarResumen();
}

function buscarEnCarrito(id) {
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].product_id === id) return carrito[i];
    }
    return null;
}


function actualizarResumen() {
    var tbody = document.getElementById("resumen-body");
    var filaVacia = document.getElementById("resumen-vacio");
    tbody.innerHTML = "";

    if (carrito.length === 0) {
        var tr = tbody.insertRow();
        tr.id = "resumen-vacio";
        var td = tr.insertCell();
        td.colSpan = 4;
        td.textContent = "Sin productos";
        return;
    }

    var total = 0;
    for (var i = 0; i < carrito.length; i++) {
        var item = carrito[i];
        var subtotal = item.precio * item.qty;
        total += subtotal;

        var tr = tbody.insertRow();
        tr.insertCell().textContent = item.nombre;
        tr.insertCell().textContent = item.qty;
        tr.insertCell().textContent = "$" + subtotal;

        // boton quitar
        var tdQuitar = tr.insertCell();
        var btn = document.createElement("button");
        btn.textContent = "x";
        btn.className = "delete";
        btn.dataset.id = item.product_id;
        btn.onclick = onQuitarItem;
        tdQuitar.appendChild(btn);
    }

    document.getElementById("venta-total").textContent = total;
}

function onQuitarItem() {
    var id = Number(this.dataset.id);
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].product_id === id) {
            carrito.splice(i, 1);
            break;
        }
    }

    var card = document.querySelector(".card[data-id='" + id + "']");
    if (card) {
        var span = card.querySelector(".qty");
        if (span) span.textContent = "0";
    }

    actualizarResumen();
}


function limpiarVenta() {
    carrito = [];
    var spans = document.querySelectorAll(".qty");
    for (var i = 0; i < spans.length; i++) {
        spans[i].textContent = "0";
    }
    actualizarResumen();
    document.getElementById("venta-total").textContent = "0";
}

function initVenta() {
    cargarProductos();

    document.getElementById("sale-submit").addEventListener("click", async function() {
        if (carrito.length === 0) {
            showError("sale-error", "Agrega al menos un producto");
            return;
        }

        var items = [];
        var total = 0;
        for (var i = 0; i < carrito.length; i++) {
            var item = carrito[i];
            items.push({
                product_id: item.product_id,
                quantity: item.qty,
                unit_price: item.precio
            });
            total += item.precio * item.qty;
        }

        var resultado = await request(URLS.sales, "POST", { total: total, items: items });
        console.log("resultado venta:", resultado);

        var contenedor = document.getElementById("sale-result");
        contenedor.innerHTML = "";

        if (resultado && resultado.saleId) {
            var ok = document.createElement("div");
            ok.className = "success-msg";
            ok.textContent = "Venta creada. ID: " + resultado.saleId;
            contenedor.appendChild(ok);
            limpiarVenta();
        } else {
            var err = document.createElement("div");
            err.className = "error-msg";
            err.textContent = (resultado && (resultado.error || resultado.message)) || "Error desconocido";
            contenedor.appendChild(err);
        }
    });
}