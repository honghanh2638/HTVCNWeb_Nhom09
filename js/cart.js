document.addEventListener('DOMContentLoaded', function () {
    renderCart();

    // Sự kiện Chọn tất cả
    const checkAll = document.getElementById('checkAll');
    if (checkAll) {
        checkAll.addEventListener('change', function () {
            let cart = IUHCart.getCart();
            cart.forEach(item => item.checked = this.checked);
            IUHCart.saveCart(cart);
            renderCart();
        });
    }

    // Xóa các sản phẩm đã chọn
    const btnDeleteSelected = document.getElementById('btnDeleteSelected');
    if (btnDeleteSelected) {
        btnDeleteSelected.addEventListener('click', function () {
            let cart = IUHCart.getCart().filter(item => !item.checked);
            IUHCart.saveCart(cart);
            renderCart();
        });
    }

    // Nút Thanh Toán
    const btnCheckout = document.getElementById('btnCheckout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', function () {
            window.location.href = 'checkOut.html';
        });
    }
});

function renderCart() {
    const cart = IUHCart.getCart();
    const cartList = document.getElementById('cartList');
    const emptyCart = document.getElementById('emptyCart');
    const cartFooter = document.getElementById('cartFooter');
    const totalProduct = document.getElementById('totalProduct');
    const selectedCount = document.getElementById('selectedCount');
    const subtotal = document.getElementById('subtotal');
    const shippingFee = document.getElementById('shippingFee');
    const totalPrice = document.getElementById('totalPrice');
    const btnCheckout = document.getElementById('btnCheckout');
    const btnDeleteSelected = document.getElementById('btnDeleteSelected');

    if (!cartList) return;

    if (cart.length === 0) {
        cartList.innerHTML = '';
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartFooter) cartFooter.style.display = 'none';
        if (totalProduct) totalProduct.textContent = '(0 sản phẩm)';
        if (selectedCount) selectedCount.textContent = '0';
        if (subtotal) subtotal.textContent = '0đ';
        if (shippingFee) shippingFee.textContent = '0đ';
        if (totalPrice) totalPrice.textContent = '0đ';
        if (btnCheckout) btnCheckout.disabled = true;
        if (btnDeleteSelected) btnDeleteSelected.disabled = true;
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'flex';

    // Render danh sách sản phẩm HTML
    let html = '';
    let selectedQty = 0;
    let sumMoney = 0;
    let allChecked = true;

    cart.forEach((item, index) => {
        if (!item.checked) allChecked = false;
        else {
            selectedQty += item.quantity;
            sumMoney += item.price * item.quantity;
        }

        html += `
            <div class="cart-item d-flex align-items-center gap-3 p-3 border-bottom">
                <input type="checkbox" class="item-checkbox" ${item.checked ? 'checked' : ''} onchange="toggleCheck(${index})">
                <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
                <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold">${item.name}</h6>
                    <span class="text-danger fw-bold">${item.price.toLocaleString('vi-VN')}đ</span>
                </div>
                <div class="qty-control d-flex align-items-center border rounded">
                    <button type="button" class="btn btn-sm" onclick="updateQty(${index}, -1)">-</button>
                    <span class="px-3">${item.quantity}</span>
                    <button type="button" class="btn btn-sm" onclick="updateQty(${index}, 1)">+</button>
                </div>
                <button type="button" class="btn btn-sm text-muted ms-2" onclick="deleteItem(${index})">✕</button>
            </div>
        `;
    });

    cartList.innerHTML = html;

    // Cập nhật các biến tính toán giao diện
    const checkAll = document.getElementById('checkAll');
    if (checkAll) checkAll.checked = allChecked && cart.length > 0;

    const shipPrice = (sumMoney >= 1000000 || sumMoney === 0) ? 0 : 30000;

    if (totalProduct) totalProduct.textContent = `(${cart.length} sản phẩm)`;
    if (selectedCount) selectedCount.textContent = selectedQty;
    if (subtotal) subtotal.textContent = sumMoney.toLocaleString('vi-VN') + 'đ';
    if (shippingFee) shippingFee.textContent = shipPrice.toLocaleString('vi-VN') + 'đ';
    if (totalPrice) totalPrice.textContent = (sumMoney + shipPrice).toLocaleString('vi-VN') + 'đ';

    if (btnCheckout) btnCheckout.disabled = selectedQty === 0;
    if (btnDeleteSelected) btnDeleteSelected.disabled = !cart.some(item => item.checked);
}

// Thay đổi số lượng sản phẩm
function updateQty(index, change) {
    let cart = IUHCart.getCart();
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    IUHCart.saveCart(cart);
    renderCart();
}

// Đánh dấu chọn / bỏ chọn 1 sản phẩm
function toggleCheck(index) {
    let cart = IUHCart.getCart();
    cart[index].checked = !cart[index].checked;
    IUHCart.saveCart(cart);
    renderCart();
}

// Xóa 1 sản phẩm khỏi giỏ
function deleteItem(index) {
    let cart = IUHCart.getCart();
    cart.splice(index, 1);
    IUHCart.saveCart(cart);
    renderCart();
}