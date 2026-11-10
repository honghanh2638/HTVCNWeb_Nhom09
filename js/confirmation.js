// File: js/confirmation.js

document.addEventListener('DOMContentLoaded', function () {
    renderConfirmation();
    renderOrdersModal();
});

function renderConfirmation() {
    let order = null;
    try {
        // Lấy đơn hàng mới nhất vừa đặt
        const data = localStorage.getItem('IUH_BEAUTY_LATEST_ORDER');
        order = data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Lỗi đọc đơn hàng mới nhất:", e);
    }

    const successTitle = document.getElementById('successTitle');
    const successMessage = document.getElementById('successMessage');
    const successMeta = document.getElementById('successMeta');
    const successIcon = document.getElementById('successIcon');
    const orderCode = document.getElementById('orderCode');
    const orderDate = document.getElementById('orderDate');
    const orderStatus = document.getElementById('orderStatus');

    const receiverName = document.getElementById('receiverName');
    const receiverPhone = document.getElementById('receiverPhone');
    const receiverEmail = document.getElementById('receiverEmail');
    const receiverAddress = document.getElementById('receiverAddress');
    const shippingMethod = document.getElementById('shippingMethod');
    const orderNote = document.getElementById('orderNote');

    const paymentMethod = document.getElementById('paymentMethod');
    const paymentStatus = document.getElementById('paymentStatus');

    const itemCount = document.getElementById('itemCount');
    const orderItems = document.getElementById('orderItems');
    const subtotal = document.getElementById('subtotal');
    const shippingFee = document.getElementById('shippingFee');
    const totalPrice = document.getElementById('totalPrice');
    const btnViewOrders = document.getElementById('btnViewOrders');

    // Trường hợp CHƯA CÓ ĐƠN HÀNG
    if (!order) {
        if (successTitle) successTitle.textContent = 'Chưa có đơn hàng';
        if (successMessage) successMessage.textContent = 'Hãy hoàn tất đặt hàng tại trang Thanh toán để xem thông tin ở đây.';
        if (successMeta) successMeta.style.display = 'none';
        if (btnViewOrders) btnViewOrders.disabled = true;
        return;
    }

    // Trường hợp ĐÃ CÓ ĐƠN HÀNG -> ĐỔ DỮ LIỆU RA GIAO DIỆN
    if (successIcon) {
        successIcon.textContent = '✓';
        successIcon.style.backgroundColor = '#28a745';
        successIcon.style.color = '#fff';
    }
    if (successTitle) successTitle.textContent = 'Đặt hàng thành công!';
    if (successMessage) successMessage.textContent = 'Cảm ơn bạn đã mua hàng tại IUH BEAUTY. Đơn hàng của bạn đang được xử lý.';
    
    if (successMeta) successMeta.style.display = 'block';
    if (orderCode) orderCode.textContent = order.orderCode || '---';
    if (orderDate) orderDate.textContent = order.orderDate || '---';
    if (orderStatus) orderStatus.textContent = order.paymentStatus || 'Đã ghi nhận';

    // 1. Thông tin giao hàng
    if (receiverName) receiverName.textContent = order.customer?.hoTen || '---';
    if (receiverPhone) receiverPhone.textContent = order.customer?.soDT || '---';
    if (receiverEmail) receiverEmail.textContent = order.customer?.email || '---';
    if (receiverAddress) receiverAddress.textContent = order.customer?.diaChi || '---';
    if (shippingMethod) shippingMethod.textContent = 'Giao hàng tiêu chuẩn';
    if (orderNote) orderNote.textContent = order.customer?.ghiChu || 'Không có';

    // 2. Thông tin thanh toán
    if (paymentMethod) paymentMethod.textContent = order.paymentMethod || '---';
    if (paymentStatus) paymentStatus.textContent = order.paymentStatus || '---';

    // 3. Chi tiết sản phẩm đã mua
    const items = order.items || [];
    let totalQty = 0;
    let html = '';

    items.forEach(item => {
        totalQty += item.quantity;
        const itemTotal = item.price * item.quantity;
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

    if (itemCount) itemCount.textContent = `${totalQty} sản phẩm`;
    if (orderItems) orderItems.innerHTML = html;
    if (subtotal) subtotal.textContent = (order.subtotal || 0).toLocaleString('vi-VN') + 'đ';
    if (shippingFee) shippingFee.textContent = (order.shippingFee || 0).toLocaleString('vi-VN') + 'đ';
    if (totalPrice) totalPrice.textContent = (order.totalPrice || 0).toLocaleString('vi-VN') + 'đ';

    // Bật mở nút Xem đơn hàng của tôi
    if (btnViewOrders) btnViewOrders.disabled = false;
}

// Render Modal hiển thị Lịch sử tất cả các đơn hàng đã đặt
function renderOrdersModal() {
    let orders = [];
    try {
        const data = localStorage.getItem('IUH_BEAUTY_ORDERS_DATA');
        orders = data ? JSON.parse(data) : [];
    } catch (e) {
        orders = [];
    }

    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="text-center text-muted p-4">Bạn chưa có đơn hàng nào.</p>';
        return;
    }

    let html = '';
    orders.forEach((ord, idx) => {
        html += `
            <div class="card mb-3 shadow-sm">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <strong>Đơn hàng #${ord.orderCode}</strong>
                    <small class="text-muted">${ord.orderDate}</small>
                </div>
                <div class="card-body">
                    <p class="mb-1"><strong>Người nhận:</strong> ${ord.customer?.hoTen} - ${ord.customer?.soDT}</p>
                    <p class="mb-2"><strong>Địa chỉ:</strong> ${ord.customer?.diaChi}</p>
                    <div class="border-top pt-2">
                        ${ord.items.map(i => `<div class="d-flex justify-content-between small"><span>${i.name} (x${i.quantity})</span><span>${(i.price * i.quantity).toLocaleString('vi-VN')}đ</span></div>`).join('')}
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <span class="badge bg-info text-dark">${ord.paymentMethod}</span>
                    <strong class="text-danger">Tổng tiền: ${ord.totalPrice.toLocaleString('vi-VN')}đ</strong>
                </div>
            </div>
        `;
    });

    ordersList.innerHTML = html;
}