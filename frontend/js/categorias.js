var editandoCat = false;
var editandoCatId = null;

// carga la tabla de categorias
async function mostrarCategorias() {
    var data = await request(URLS.categories);
    console.log("categorias:", data);

    var contenedor = document.getElementById("categories");
    contenedor.innerHTML = "";

    if (!data || !data.data || data.data.length === 0) {
        var msg = document.createElement("div");
        msg.className = "empty-msg";
        msg.textContent = "No hay categorias";
        contenedor.appendChild(msg);
        return;
    }

    var tabla = document.createElement("table");
    var thead = tabla.createTHead();
    var trHead = thead.insertRow();
    trHead.insertCell().textContent = "ID";
    trHead.insertCell().textContent = "Nombre";
    trHead.insertCell().textContent = "Acciones";

    var tbody = tabla.createTBody();
    for (var i = 0; i < data.data.length; i++) {
        var cat = data.data[i];
        var tr = tbody.insertRow();
        tr.insertCell().textContent = cat.id;
        tr.insertCell().textContent = cat.name;

        var tdAcciones = tr.insertCell();

        var btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "edit";
        btnEditar.dataset.id = cat.id;
        btnEditar.dataset.nombre = cat.name;
        btnEditar.onclick = onEditarCategoria;

        var btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "delete";
        btnEliminar.dataset.id = cat.id;
        btnEliminar.onclick = onEliminarCategoria;

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);
    }

    contenedor.appendChild(tabla);
}

function onEditarCategoria() {
    var id = this.dataset.id;
    var nombre = this.dataset.nombre;
    document.getElementById("cat-name").value = nombre;
    document.getElementById("cat-submit").textContent = "Guardar";
    editandoCat = true;
    editandoCatId = id;
}

async function onEliminarCategoria() {
    var id = this.dataset.id;
    await request(URLS.categories + "/" + id, "DELETE");
    mostrarCategorias();
    cargarSelectCategorias();
}

function initCategories() {
    document.getElementById("cat-submit").addEventListener("click", async function() {
        var nombre = document.getElementById("cat-name").value;

        if (!validateText(nombre)) {
            showError("cat-error", "Nombre invalido");
            return;
        }

        if (editandoCat) {
            var res = await request(URLS.categories + "/" + editandoCatId, "PATCH", { name: nombre });
            console.log("editar categoria:", res);
            editandoCat = false;
            editandoCatId = null;
            document.getElementById("cat-submit").textContent = "Agregar";
        } else {
            var res = await request(URLS.categories, "POST", { name: nombre });
            console.log("nueva categoria:", res);
        }

        document.getElementById("cat-name").value = "";
        mostrarCategorias();
        cargarSelectCategorias();
    });
}