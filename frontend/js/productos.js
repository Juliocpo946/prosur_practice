var editandoProd = false;
var editandoProdId = null;

// llena el select de categorias en el form de productos
async function cargarSelectCategorias() {
    var data = await request(URLS.categories);
    var sel = document.getElementById("prod-category-id");
    if (!sel) return;

    sel.innerHTML = "";
    var opDefault = document.createElement("option");
    opDefault.value = "";
    opDefault.textContent = "Selecciona categoria";
    sel.appendChild(opDefault);

    if (!data || !data.data) return;

    for (var i = 0; i < data.data.length; i++) {
        var cat = data.data[i];
        var op = document.createElement("option");
        op.value = cat.id;
        op.textContent = cat.name;
        sel.appendChild(op);
    }
}

async function mostrarProductos() {
    var data = await request(URLS.products);
    console.log("productos:", data);

    var contenedor = document.getElementById("products");
    contenedor.innerHTML = "";

    if (!data || !data.data || data.data.length === 0) {
        var msg = document.createElement("div");
        msg.className = "empty-msg";
        msg.textContent = "No hay productos";
        contenedor.appendChild(msg);
        return;
    }

    var tabla = document.createElement("table");
    var thead = tabla.createTHead();
    var trHead = thead.insertRow();
    trHead.insertCell().textContent = "ID";
    trHead.insertCell().textContent = "Categoria";
    trHead.insertCell().textContent = "Nombre";
    trHead.insertCell().textContent = "Precio";
    trHead.insertCell().textContent = "Stock";
    trHead.insertCell().textContent = "Acciones";

    var tbody = tabla.createTBody();
    for (var i = 0; i < data.data.length; i++) {
        var prod = data.data[i];
        var tr = tbody.insertRow();
        tr.insertCell().textContent = prod.id;
        tr.insertCell().textContent = prod.category_name;
        tr.insertCell().textContent = prod.name;
        tr.insertCell().textContent = "$" + prod.price;
        tr.insertCell().textContent = prod.stock;

        var tdAcciones = tr.insertCell();

        var btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "edit";
        btnEditar.dataset.id = prod.id;
        btnEditar.dataset.categoryId = prod.category_id;
        btnEditar.dataset.nombre = prod.name;
        btnEditar.dataset.precio = prod.price;
        btnEditar.dataset.stock = prod.stock;
        btnEditar.onclick = onEditarProducto;

        var btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "delete";
        btnEliminar.dataset.id = prod.id;
        btnEliminar.onclick = onEliminarProducto;

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);
    }

    contenedor.appendChild(tabla);
}

function onEditarProducto() {
    document.getElementById("prod-category-id").value = this.dataset.categoryId;
    document.getElementById("prod-name").value = this.dataset.nombre;
    document.getElementById("prod-price").value = this.dataset.precio;
    document.getElementById("prod-stock").value = this.dataset.stock;
    document.getElementById("prod-submit").textContent = "Guardar";
    editandoProd = true;
    editandoProdId = this.dataset.id;
}

async function onEliminarProducto() {
    await request(URLS.products + "/" + this.dataset.id, "DELETE");
    mostrarProductos();
}

function initProducts() {
    cargarSelectCategorias();

    document.getElementById("prod-submit").addEventListener("click", async function() {
        var catId = document.getElementById("prod-category-id").value;
        var nombre = document.getElementById("prod-name").value;
        var precio = document.getElementById("prod-price").value;
        var stock = document.getElementById("prod-stock").value;

        if (!catId) {
            showError("prod-error", "Selecciona una categoria");
            return;
        }
        if (!validateText(nombre)) {
            showError("prod-error", "Nombre invalido");
            return;
        }
        if (!validatePrice(precio)) {
            showError("prod-error", "Precio invalido (1 - 10000)");
            return;
        }
        if (!validateQuantity(stock)) {
            showError("prod-error", "Stock invalido (1 - 2000)");
            return;
        }

        var body = {
            category_id: Number(catId),
            name: nombre,
            price: Number(precio),
            stock: Number(stock)
        };

        if (editandoProd) {
            var res = await request(URLS.products + "/" + editandoProdId, "PATCH", body);
            console.log("editar producto:", res);
            editandoProd = false;
            editandoProdId = null;
            document.getElementById("prod-submit").textContent = "Agregar";
        } else {
            var res = await request(URLS.products, "POST", body);
            console.log("nuevo producto:", res);
        }

        document.getElementById("prod-name").value = "";
        document.getElementById("prod-price").value = "";
        document.getElementById("prod-stock").value = "";
        document.getElementById("prod-category-id").value = "";
        mostrarProductos();
    });
}