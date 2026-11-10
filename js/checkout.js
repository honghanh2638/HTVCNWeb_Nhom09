// File: js/checkout.js

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

// 1. Render danh sách sản phẩm từ giỏ hàng
function renderCheckout() {
    let cart = [];
    try {
        cart = typeof IUHCart !== 'undefined' ? IUHCart.getCart() : (JSON.parse(localStorage.getItem('IUH_BEAUTY_CART_DATA')) || []);
    } catch (e) {
        cart = [];
    }

    // Lọc các món được tích chọn
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

    // Mở khóa nút ĐẶT HÀNG
    if (btnOrder) btnOrder.disabled = false;
}

// 2. Kiểm tra Regex & Hiển thị lỗi chữ đỏ trên giao diện
function handleOrderSubmit(e) {
    e.preventDefault();

    const hoTenInput = document.getElementById('hoTen');
    const soDTInput = document.getElementById('soDT');
    const emailInput = document.getElementById('email');
    const diaChiInput = document.getElementById('diaChi');
    const ghiChuInput = document.getElementById('ghiChu');

    const hoTen = hoTenInput ? hoTenInput.value.trim() : '';
    const soDT = soDTInput ? soDTInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const diaChi = diaChiInput ? diaChiInput.value.trim() : '';
    const ghiChu = ghiChuInput ? ghiChuInput.value.trim() : '';
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'COD';

    const hoTenError = document.getElementById('hoTenError');
    const soDTError = document.getElementById('soDTError');
    const emailError = document.getElementById('emailError');
    const diaChiError = document.getElementById('diaChiError');

    // Dọn sạch lỗi cũ
    if (hoTenError) hoTenError.textContent = '';
    if (soDTError) soDTError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (diaChiError) diaChiError.textContent = '';

    // Regex chuẩn
    const nameRegex = /^(?=.{2,50}$)\p{L}+(?:\s+\p{L}+)+$/u;
    const phoneRegex = /^0[3|5|7|8|9][0-9]{8}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let isValid = true;

    if (!hoTen) {
        if (hoTenError) hoTenError.textContent = 'Vui lòng nhập Họ và tên!';
        isValid = false;
    } else if (!nameRegex.test(hoTen)) {
        if (hoTenError) hoTenError.textContent = 'Họ tên không hợp lệ (chỉ chứa chữ cái, không chứa số hoặc ký tự đặc biệt).';
        isValid = false;
    }

    if (!soDT) {
        if (soDTError) soDTError.textContent = 'Vui lòng nhập Số điện thoại!';
        isValid = false;
    } else if (!phoneRegex.test(soDT)) {
        if (soDTError) soDTError.textContent = 'Số điện thoại không đúng định dạng VN (phải gồm 10 chữ số, VD: 0988863043).';
        isValid = false;
    }

    if (!email) {
        if (emailError) emailError.textContent = 'Vui lòng nhập Email!';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        if (emailError) emailError.textContent = 'Email không hợp lệ (Ví dụ: name@example.com).';
        isValid = false;
    }

    if (!diaChi) {
        if (diaChiError) diaChiError.textContent = 'Vui lòng nhập Địa chỉ giao hàng!';
        isValid = false;
    } else if (diaChi.length < 5) {
        if (diaChiError) diaChiError.textContent = 'Địa chỉ giao hàng phải từ 5 ký tự trở lên.';
        isValid = false;
    }

    if (!isValid) return;

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

    const remainingCart = cart.filter(item => item.checked === false);
    if (typeof IUHCart !== 'undefined') {
        IUHCart.saveCart(remainingCart);
    } else {
        localStorage.setItem('IUH_BEAUTY_CART_DATA', JSON.stringify(remainingCart));
    }

    window.location.href = 'confirmation.html';
}