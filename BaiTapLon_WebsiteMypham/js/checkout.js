// Không khai báo lại const CART_STORAGE_KEY ở đây vì cart-storage.js đã có sẵn!
// Chỉ khai báo hằng số riêng của Checkout:
if (typeof ORDERS_STORAGE_KEY === 'undefined') {
    var ORDERS_STORAGE_KEY = 'IUH_BEAUTY_ORDERS_DATA';
}

document.addEventListener('DOMContentLoaded', function () {
    renderCheckout();

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleOrderSubmit);
    }

    const bankRadio = document.getElementById('bank');
    const codRadio = document.getElementById('cod');
    const bankNotice = document.getElementById('bankNotice');

    if (bankRadio && bankNotice) {
        bankRadio.addEventListener('change', () => bankNotice.style.display = 'block');
    }
    if (codRadio && bankNotice) {
        codRadio.addEventListener('change', () => bankNotice.style.display = 'none');
    }
});

function renderCheckout() {
    let cart = [];
    try {
        // Sử dụng hàm getCart() có sẵn từ đối tượng IUHCart của cart-storage.js
        cart = typeof IUHCart !== 'undefined' ? IUHCart.getCart() : (JSON.parse(localStorage.getItem('IUH_BEAUTY_CART_DATA')) || []);
    } catch (e) {
        cart = [];
    }

    // Lấy tất cả sản phẩm được chọn
    const selectedItems = cart.filter(item => item.checked === true || item.checked === undefined);

    const orderItemsEl = document.getElementById('orderItems');
    const selectedCountEl = document.getElementById('selectedCount');
    const subtotalEl = document.getElementById('subtotal');
    const shippingFeeEl = document.getElementById('shippingFee');
    const totalPriceEl = document.getElementById('totalPrice');
    const btnOrder = document.getElementById('btnOrder');
    const checkoutError = document.getElementById('checkoutError');

    if (selectedItems.length === 0) {
        if (orderItemsEl) orderItemsEl.innerHTML = '<p class="text-danger p-3 mb-0">Chưa có sản phẩm nào được chọn từ giỏ hàng.</p>';
        if (selectedCountEl) selectedCountEl.textContent = '0 sản phẩm';
        if (subtotalEl) subtotalEl.textContent = '0đ';
        if (shippingFeeEl) shippingFeeEl.textContent = '0đ';
        if (totalPriceEl) totalPriceEl.textContent = '0đ';
        if (btnOrder) btnOrder.disabled = true;

        if (checkoutError) {
            checkoutError.style.display = 'block';
            checkoutError.textContent = 'Vui lòng quay lại Giỏ hàng và chọn ít nhất 1 sản phẩm để thanh toán.';
        }
        return;
    }

    if (checkoutError) checkoutError.style.display = 'none';

    let totalQty = 0;
    let sumMoney = 0;
    let html = '';

    selectedItems.forEach(item => {
        totalQty += item.quantity;
        const itemTotal = item.price * item.quantity;
        sumMoney += itemTotal;

        html += `
            <div class="d-flex align-items-center justify-content-between p-2 border-bottom">
                <div class="d-flex align-items-center gap-2">
                    <img src="${item.image || '../img/use.png'}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
                    <div>
                        <h6 class="mb-0 fs-6">${item.name}</h6>
                        <small class="text-muted">SL: ${item.quantity} x ${item.price.toLocaleString('vi-VN')}đ</small>
                    </div>
                </div>
                <strong class="text-danger fs-6">${itemTotal.toLocaleString('vi-VN')}đ</strong>
            </div>
        `;
    });

    const shipFee = (sumMoney >= 1000000 || sumMoney === 0) ? 0 : 30000;
    const finalTotal = sumMoney + shipFee;

    if (orderItemsEl) orderItemsEl.innerHTML = html;
    if (selectedCountEl) selectedCountEl.textContent = `${totalQty} sản phẩm`;
    if (subtotalEl) subtotalEl.textContent = sumMoney.toLocaleString('vi-VN') + 'đ';
    if (shippingFeeEl) shippingFeeEl.textContent = shipFee.toLocaleString('vi-VN') + 'đ';
    if (totalPriceEl) totalPriceEl.textContent = finalTotal.toLocaleString('vi-VN') + 'đ';

    // KÍCH HOẠT NÚT ĐẶT HÀNG SÁNG LÊN
    if (btnOrder) btnOrder.disabled = false;
}

function handleOrderSubmit(e) {
    e.preventDefault();

    const hoTen = document.getElementById('hoTen').value.trim();
    const soDT = document.getElementById('soDT').value.trim();
    const email = document.getElementById('email').value.trim();
    const diaChi = document.getElementById('diaChi').value.trim();
    const ghiChu = document.getElementById('ghiChu').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'COD';

    if (!hoTen || !soDT || !email || !diaChi) {
        alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)!');
        return;
    }

    let cart = typeof IUHCart !== 'undefined' ? IUHCart.getCart() : (JSON.parse(localStorage.getItem('IUH_BEAUTY_CART_DATA')) || []);
    const selectedItems = cart.filter(item => item.checked === true || item.checked === undefined);

    if (selectedItems.length === 0) {
        alert('Giỏ hàng chưa có sản phẩm nào được chọn!');
        return;
    }

    const subtotal = selectedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const shippingFee = (subtotal >= 1000000) ? 0 : 30000;
    const totalPrice = subtotal + shippingFee;

    const orderData = {
        orderCode: 'IUH' + Math.floor(100000 + Math.random() * 900000),
        orderDate: new Date().toLocaleString('vi-VN'),
        customer: { hoTen, soDT, email, diaChi, ghiChu },
        paymentMethod: paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng',
        paymentStatus: paymentMethod === 'COD' ? 'Chưa thanh toán' : 'Chờ thanh toán',
        items: selectedItems,
        subtotal,
        shippingFee,
        totalPrice
    };

    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
    } catch (err) { }
    orders.unshift(orderData);

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    localStorage.setItem('IUH_BEAUTY_LATEST_ORDER', JSON.stringify(orderData));

    // Xóa sản phẩm đã đặt khỏi giỏ
    const remainingCart = cart.filter(item => item.checked === false);
    if (typeof IUHCart !== 'undefined') {
        IUHCart.saveCart(remainingCart);
    } else {
        localStorage.setItem('IUH_BEAUTY_CART_DATA', JSON.stringify(remainingCart));
    }

    // Chuyển hướng sang trang xác nhận thành công
    window.location.href = 'confirmation.html';
}