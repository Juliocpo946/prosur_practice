var BASE_URL = "http://localhost:3000/api";

var URLS = {
    categories: BASE_URL + "/categories",
    products: BASE_URL + "/products",
    sales: BASE_URL + "/sales",
    reports: BASE_URL + "/reports"
};


async function request(url, method, body) {
    if (!method) method = "GET";

    var opts = {
        method: method,
        headers: { "Content-Type": "application/json" }
    };

    if (body) {
        opts.body = JSON.stringify(body);
    }

    try {
        var res = await fetch(url, opts);
        var data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR request:", method, url, err.message);
        return null;
    }
}