function dinhDangNgay(ngay) {
    let d = new Date(ngay);
    if (isNaN(d.getTime())) return "Chưa xác định";
    return d.toLocaleString("vi-VN");
}

function layDonHangCuaToi() {
    let dsDonHang = layDuLieu("iuh_orders", []);
    let tk = layDuLieu("iuh_current_user", null);
    let ketQua = [];
    if (!Array.isArray(dsDonHang) || !tk || !tk.email) return ketQua;
    for (let i = 0; i < dsDonHang.length; i++) {
        let don = dsDonHang[i];
        if (don && String(don.customerEmail || "").toLowerCase() == String(tk.email).toLowerCase()) {
            ketQua.push(don);
        }
    }
    return ketQua;
}

function layDonHangMoiNhat() {
    let maDon = localStorage.getItem("iuh_last_order_id");
    let dsDonHang = layDonHangCuaToi();
    for (let i = 0; i < dsDonHang.length; i++) {
        if (dsDonHang[i].orderId == maDon) return dsDonHang[i];
    }
    return dsDonHang.length > 0 ? dsDonHang[dsDonHang.length - 1] : null;
}

function thongBaoRong(tieuDe, noiDung) {
    $("#successIcon").text("i");
    $("#successTitle").text(tieuDe);
    $("#successMessage").text(noiDung);
    $("#successMeta").hide();
    $("#receiverName, #receiverPhone, #receiverEmail, #receiverAddress, #shippingMethod, #orderNote, #paymentMethod, #paymentStatus").text("—");
    $("#orderItems").empty().append($("<p>").addClass("text-muted mt-3").text("Chưa có sản phẩm để hiển thị."));
    $("#itemCount").text("0 sản phẩm");
    $("#subtotal, #shippingFee, #totalPrice").text(dinhDangTien(0));
    $("#btnViewOrders").prop("disabled", layDonHangCuaToi().length == 0);
}

function hienThiDonHang(donHang) {
    if (!donHang) return;
    let nguoiNhan = donHang.receiver || {};
    $("#successIcon").text("✓");
    $("#successTitle").text("Đặt hàng thành công!");
    $("#successMessage").text("Cảm ơn bạn đã mua sắm tại IUH BEAUTY. Đơn hàng đã được ghi nhận.");
    $("#successMeta").show();
    $("#orderCode").text(donHang.orderId || "—");
    $("#orderDate").text(dinhDangNgay(donHang.createdAt));
    $("#orderStatus").text(donHang.orderStatus == "cancelled" ? "Đã hủy" : "Đã ghi nhận");
    $("#btnViewOrders").prop("disabled", false);

    $("#receiverName").text(nguoiNhan.name || "—");
    $("#receiverPhone").text(nguoiNhan.phone || "—");
    $("#receiverEmail").text(nguoiNhan.email || "—");
    $("#receiverAddress").text(nguoiNhan.address || "—");
    $("#shippingMethod").text(donHang.shippingMethod == "standard" ? "Giao hàng tiêu chuẩn" : (donHang.shippingMethod || "Tiêu chuẩn"));
    $("#orderNote").text(nguoiNhan.note || "Không có");
    $("#paymentMethod").text(donHang.paymentMethod == "COD" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản (mô phỏng)");
    $("#paymentStatus").text(donHang.paymentStatus == "paid" ? "Đã thanh toán" :
        donHang.paymentStatus == "pending" ? "Chờ thanh toán" : "Chưa thanh toán");

    let ds = Array.isArray(donHang.items) ? donHang.items : [];
    let tongSL = 0;
    $("#orderItems").empty();
    for (let i = 0; i < ds.length; i++) {
        let sp = ds[i];
        let soLuong = Number(sp.quantity) || 0;
        tongSL += soLuong;
        let dong = $("<div>").addClass("confirm-product");
        let anh = $("<img>").attr("src", sp.image || "../img/no-image.svg")
            .attr("alt", sp.name || "Sản phẩm").on("error", function () { anhDuPhong(this); });
        let thongTin = $("<div>").addClass("confirm-product-info");
        thongTin.append($("<h3>").text(sp.name || "Sản phẩm"));
        thongTin.append($("<p>").text("Số lượng: " + soLuong + " × " + dinhDangTien(sp.price)));
        let thanhTien = $("<strong>").addClass("confirm-product-price").text(dinhDangTien(Number(sp.price) * soLuong));
        dong.append(anh, thongTin, thanhTien);
        $("#orderItems").append(dong);
    }
    $("#itemCount").text(tongSL + " sản phẩm");
    $("#subtotal").text(dinhDangTien(donHang.subtotal));
    $("#shippingFee").text(Number(donHang.shippingFee) == 0 ? "Miễn phí" : dinhDangTien(donHang.shippingFee));
    $("#totalPrice").text(dinhDangTien(donHang.total));
}

function xemDonHangCuaToi() {
    let ds = layDonHangCuaToi();
    $("#ordersList").empty();
    if (ds.length == 0) {
        $("#ordersList").text("Bạn chưa có đơn hàng nào trên thiết bị này.");
        return;
    }
    for (let i = ds.length - 1; i >= 0; i--) {
        let don = ds[i];
        let nut = $("<button>").attr("type", "button").addClass("history-order");
        let thongTin = $("<span>");
        thongTin.append($("<strong>").text(don.orderId || "Không có mã"));
        thongTin.append($("<small>").text(dinhDangNgay(don.createdAt)));
        nut.append(thongTin);
        nut.append($("<span>").addClass("history-price").text(dinhDangTien(don.total)));
        nut.click(function () {
            localStorage.setItem("iuh_last_order_id", don.orderId);
            hienThiDonHang(don);
            bootstrap.Modal.getOrCreateInstance(document.getElementById("ordersModal")).hide();
            window.scrollTo(0, 0);
        });
        $("#ordersList").append(nut);
    }
}

function taiLaiDonHang() {
    capNhatSoGioHang();
    let tk = layDuLieu("iuh_current_user", null);
    if (!tk || !tk.email) {
        thongBaoRong("Bạn chưa đăng nhập", "Vui lòng đăng nhập ở Trang chủ để xem đơn hàng của mình.");
    } else {
        let donHang = layDonHangMoiNhat();
        if (donHang) hienThiDonHang(donHang);
        else thongBaoRong("Chưa có đơn hàng", "Hãy hoàn tất đặt hàng tại trang Thanh toán để xem thông tin.");
    }
}

$(document).ready(function () {
    taiLaiDonHang();
    $("#ordersModal").on("show.bs.modal", xemDonHangCuaToi);
});

$(window).on("pageshow storage", taiLaiDonHang);
