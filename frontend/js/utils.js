// valida que sea un texto con al menos una palabra
function validateText(valor) {
    if (typeof valor !== "string") return false;
    return valor.trim().length > 0;
}

function validatePrice(precio) {
    var n = Number(precio);
    if (isNaN(n) || n <= 0 || n > 10000) return false;
    return true;
}

function validateQuantity(cantidad) {
    var n = Number(cantidad);
    if (isNaN(n) || n <= 0 || n > 2000) return false;
    if (n % 1 !== 0) return false;
    return true;
}

// suma total de los items
function sumPriceProducts(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        total += Number(items[i].unit_price) * Number(items[i].quantity);
    }
    return total;
}

// muestra error 3 segundos y desaparece
function showError(id, mensaje) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = mensaje;
    el.style.display = "block";
    setTimeout(function() {
        el.style.display = "none";
    }, 3000);
}