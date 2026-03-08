function formatDate(isoString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(isoString).toLocaleString('en-US', options).replace(',', '');
}
function safeJsonParse(value, fallback = null) {
    if (value == null || typeof value !== "string") return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}
let cnst = order.orderDetails?.map(({ component, dressing, flavor, productName, sides }, idx) => `
<tr><td>${Array.isArray(dressing) ? dressing.length : 0}x</td><td>${productName}</td></tr>
${component ? `<tr><td>*</td><td><i>${component}<i></td></tr>` : ''}
${flavor?.map((product) => {
    const parsedProduct = safeJsonParse(product);
    if (!parsedProduct?.values?.length) return "";
    return `<tr><td>${parsedProduct.name}</td><td>${parsedProduct.values.map((val) => val.name).join(", ")}</td></tr>`;
}).join("")}
${sides?.map((product) => {
    const parsedProduct = safeJsonParse(product);
    if (!parsedProduct?.name) return "";
    return `<tr><td>${parsedProduct.name}</td><td>+</td></tr>`;
}).join("")}`)
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt</title>
    <style>
    body {
        font-family: monospace;
        text-align: center;
        padding: 20px;
    }
    .receipt {
        width: 320px;
        margin: auto;
        padding: 15px;
        border: 1px solid #000;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    }
    .header, .footer {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
    }
    .items {
        text-align: left;
        margin-top: 10px;
    }
    .items table {
        width: 100%;
    }
    .items td {
        padding: 5px 0;
    }
    .total {
        margin-top: 10px;
        font-weight: bold;
    }
    button {
        margin-top: 15px;
        padding: 10px;
        cursor: pointer;
    }
</style>
</head>
<body>
<div class="receipt">
        <div class="header">
            <p>${order.userName}</p>
            <p>RoomService</p>
        </div>
        <hr>
        <div class="items">
            <table>
${cnst}
</table>
</div>
        <hr>
        <div class="total">
            <p><strong>Sub Total: $${order.totalPrice}</strong></p>
        </div>
        <hr>
        <div class="footer">
            <p>Paid</p>
            <p>Delivery Address: ${order.shippingAddress}</p>
            <p>Delivery Driver: ${order.driver.length > 0 ? order.driver : ''}</p>
            <p>Placed At: ${formatDate(order.date)}</p>
        </div>
    </div>
</body>
</html>
`;