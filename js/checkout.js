let dangDatHang = false;

function laySanPhamThanhToan() {
    let ds = layDuLieu("iuh_checkout_items", []);
    return Array.isArray(ds) ? ds : [];
}

function kiemTraGioHang() {
    let gioHang = layGioHang();
    let ds = laySanPhamThanhToan();
    if (ds.length == 0) return false;
    let soDongDaChon = 0;
    for (let i = 0; i < gioHang.length; i++) {
        if (gioHang[i].selected !== false) soDongDaChon++;
    }
    if (soDongDaChon != ds.length) return false;

    for (let i = 0; i < ds.length; i++) {
        let khop = false;
        for (let j = 0; j < gioHang.length; j++) {
            let item = gioHang[j];
            if (layMaSanPham(item) == String(ds[i].productId) &&
                item.selected !== false && Number(item.quantity) == Number(ds[i].quantity)) {
                let sp = timSanPham(layMaSanPham(item), item);
                khop = sp != null && Number(sp.price) == Number(ds[i].price);
                break;
            }
        }
        if (!khop) return false;
    }
    return true;
}

function hienThiDonHang() {
    let ds = laySanPhamThanhToan();
    let soLuong = 0;
    let tamTinh = 0;
    $("#orderItems").empty();

    for (let i = 0; i < ds.length; i++) {
        let sp = ds[i];
        let sl = Number(sp.quantity) || 0;
        let gia = Number(sp.price);
        if (sl <= 0 || !Number.isFinite(gia) || gia < 0) continue;
        soLuong += sl;
        tamTinh += sl * gia;

        let dong = $("<div>").addClass("order-item");
        let anh = $("<img>").attr("src", sp.image || "../img/no-image.svg")
            .attr("alt", sp.name || "Sản phẩm")
            .on("error", function () { anhDuPhong(this); });
        let thongTin = $("<div>").addClass("order-item-info");
        thongTin.append($("<h3>").text(sp.name || "Sản phẩm"));
        thongTin.append($("<p>").text("Số lượng: " + sl + " × " + dinhDangTien(gia)));
        let thanhTien = $("<strong>").addClass("order-item-price").text(dinhDangTien(sl * gia));
        dong.append(anh, thongTin, thanhTien);
        $("#orderItems").append(dong);
    }

    let phiVanChuyen = tinhPhiVanChuyen(tamTinh);
    let tongTien = tamTinh + phiVanChuyen;
    $("#selectedCount").text(soLuong + " sản phẩm");
    $("#subtotal").text(dinhDangTien(tamTinh));
    $("#shippingFee").text(tamTinh >= 1000000 ? "Miễn phí" : dinhDangTien(phiVanChuyen));
    $("#totalPrice").text(dinhDangTien(tongTien));
    $("#shippingNotice").text(tamTinh >= 1000000
        ? "Đơn hàng đã đủ điều kiện miễn phí vận chuyển."
        : "Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ.");

    let tongTuCart = layDuLieu("iuh_checkout_totals", null);
    let tienKhop = tongTuCart != null &&
        Number(tongTuCart.subtotal) == tamTinh &&
        Number(tongTuCart.shippingFee) == phiVanChuyen &&
        Number(tongTuCart.total) == tongTien;
    let taiKhoan = layDuLieu("iuh_current_user", null);
    let hopLe = soLuong > 0 && tienKhop && kiemTraGioHang();
    let thongBao = "";
    if (!hopLe) {
        thongBao = "Danh sách sản phẩm đã thay đổi hoặc chưa được chọn. Hãy quay lại Giỏ hàng và nhấn Thanh toán lần nữa.";
    } else if (!taiKhoan || !taiKhoan.email) {
        thongBao = "Bạn cần đăng nhập tại Trang chủ trước khi đặt hàng.";
    }
    $("#checkoutError").text(thongBao).toggle(thongBao != "");
    $("#btnOrder").prop("disabled", !hopLe || !taiKhoan || !taiKhoan.email || dangDatHang);
    capNhatSoGioHang();
    return {items: ds, subtotal: tamTinh, shippingFee: phiVanChuyen, total: tongTien, hopLe: hopLe};
}

function hienThiTaiKhoan() {
    let tk = layDuLieu("iuh_current_user", null);
    if (!tk) return;
    $("#hoTen").val(tk.name || "");
    $("#email").val(tk.email || "");
    let banNhap = layDuLieu("iuh_checkout_draft", null);
    if (banNhap && banNhap.userEmail == tk.email) {
        $("#hoTen").val(banNhap.name || tk.name || "");
        $("#soDT").val(banNhap.phone || "");
        $("#email").val(banNhap.email || tk.email || "");
        $("#diaChi").val(banNhap.address || "");
        $("#ghiChu").val(banNhap.note || "");
        $("#rememberInfo").prop("checked", true);
    }
}

function luuThongTinTam() {
    if (!$("#rememberInfo").prop("checked")) return;
    let tk = layDuLieu("iuh_current_user", null);
    if (!tk || !tk.email) return;
    let ht = $("#hoTen").val().trim();
    let sdt = $("#soDT").val().trim();
    let email = $("#email").val().trim();
    let diaChi = $("#diaChi").val().trim();
    if (!/^[\p{L}]+(?:\s+[\p{L}]+)+$/u.test(ht) ||
        !/^0[0-9]{9}$/.test(sdt) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        diaChi.length < 10) return;
    luuDuLieu("iuh_checkout_draft", {
        userEmail: tk.email,
        name: $("#hoTen").val().trim(),
        phone: $("#soDT").val().trim(),
        email: $("#email").val().trim(),
        address: $("#diaChi").val().trim(),
        note: $("#ghiChu").val().trim()
    });
}

function hienLoi(idInput, idLoi, thongBao) {
    document.getElementById(idLoi).textContent = thongBao;
    document.getElementById(idInput).classList.add("is-invalid");
}

function xoaLoi(idInput, idLoi) {
    document.getElementById(idLoi).textContent = "";
    document.getElementById(idInput).classList.remove("is-invalid");
}

function ktraHoTen() {
    let ht = document.getElementById("hoTen").value.trim();
    let regex = /^[\p{L}]+(?:\s+[\p{L}]+)+$/u;

    xoaLoi("hoTen", "loiHoTen");
    if (ht === "") {
        hienLoi("hoTen", "loiHoTen", "Họ tên không được để trống.");
        return false;
    }
    if (!regex.test(ht)) {
        hienLoi("hoTen", "loiHoTen", "Họ tên phải có ít nhất 2 từ và chỉ chứa chữ cái.");
        return false;
    }
    return true;
}

function ktraSoDT() {
    let sdt = document.getElementById("soDT").value.trim();
    let regex = /^0[0-9]{9}$/;

    xoaLoi("soDT", "loiSoDT");
    if (sdt === "") {
        hienLoi("soDT", "loiSoDT", "Số điện thoại không được để trống.");
        return false;
    }
    if (!regex.test(sdt)) {
        hienLoi("soDT", "loiSoDT", "Số điện thoại phải gồm 10 số, bắt đầu bằng 0.");
        return false;
    }
    return true;
}

function ktraEmail() {
    let email = document.getElementById("email").value.trim();
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    xoaLoi("email", "loiEmail");
    if (email === "") {
        hienLoi("email", "loiEmail", "Email không được để trống.");
        return false;
    }
    if (!regex.test(email)) {
        hienLoi("email", "loiEmail", "Email không đúng định dạng.");
        return false;
    }
    return true;
}

function ktraDiaChi() {
    let diaChi = document.getElementById("diaChi").value.trim();

    xoaLoi("diaChi", "loiDiaChi");
    if (diaChi === "") {
        hienLoi("diaChi", "loiDiaChi", "Địa chỉ không được để trống.");
        return false;
    }
    if (diaChi.length < 10) {
        hienLoi("diaChi", "loiDiaChi", "Địa chỉ phải có ít nhất 10 ký tự.");
        return false;
    }
    return true;
}

function kiemTraForm() {
    let ok1 = ktraHoTen();
    let ok2 = ktraSoDT();
    let ok3 = ktraEmail();
    let ok4 = ktraDiaChi();

    if (!(ok1 && ok2 && ok3 && ok4)) {
        return false;
    }
    return true;
}

function datHang() {
    if (dangDatHang) return;
    if (!kiemTraForm()) {
        $(".is-invalid").first().trigger("focus");
        return;
    }
    let duLieu = hienThiDonHang();
    let tk = layDuLieu("iuh_current_user", null);
    if (!duLieu.hopLe || !tk || !tk.email) {
        alert("Thông tin giỏ hàng chưa hợp lệ. Hãy quay lại trang Giỏ hàng.");
        return;
    }

    dangDatHang = true;
    $("#btnOrder").prop("disabled", true).text("ĐANG LƯU ĐƠN HÀNG...");
    let phuongThuc = $("input[name='payment']:checked").val();
    let maDon = "IUH" + Date.now() + Math.floor(Math.random() * 1000);
    let donHang = {
        orderId: maDon,
        createdAt: new Date().toISOString(),
        customerEmail: tk.email,
        receiver: {
            name: $("#hoTen").val().trim(),
            phone: $("#soDT").val().trim(),
            email: $("#email").val().trim(),
            address: $("#diaChi").val().trim(),
            note: $("#ghiChu").val().trim()
        },
        items: duLieu.items,
        shippingMethod: "standard",
        paymentMethod: phuongThuc,
        subtotal: duLieu.subtotal,
        shippingFee: duLieu.shippingFee,
        total: duLieu.total,
        orderStatus: "placed",
        paymentStatus: phuongThuc == "COD" ? "unpaid" : "pending"
    };

    let dsDonHang = layDuLieu("iuh_orders", []);
    if (!Array.isArray(dsDonHang)) dsDonHang = [];
    dsDonHang.push(donHang);

    let gioHang = layGioHang();
    let gioHangConLai = [];
    for (let i = 0; i < gioHang.length; i++) {
        if (gioHang[i].selected === false) gioHangConLai.push(gioHang[i]);
    }

    if (!luuDuLieu("iuh_orders", dsDonHang)) {
        dangDatHang = false;
        hienThiDonHang();
        $("#btnOrder").text("ĐẶT HÀNG");
        return;
    }
    if (!luuDuLieu("iuh_cart", gioHangConLai)) {
        dsDonHang.pop();
        luuDuLieu("iuh_orders", dsDonHang);
        dangDatHang = false;
        hienThiDonHang();
        $("#btnOrder").text("ĐẶT HÀNG");
        return;
    }
    try {
        localStorage.setItem("iuh_last_order_id", maDon);
    } catch (e) {
        // Đơn vẫn đã lưu trong iuh_orders; Confirmation có thể tìm theo tài khoản.
        alert("Đã lưu đơn hàng nhưng không ghi được mã đơn gần nhất. Vui lòng kiểm tra LocalStorage.");
    }
    localStorage.removeItem("iuh_checkout_items");
    localStorage.removeItem("iuh_checkout_totals");
    if (!$("#rememberInfo").prop("checked")) localStorage.removeItem("iuh_checkout_draft");
    window.location.href = "confirmation.html";
}

$(document).ready(function () {
    hienThiTaiKhoan();
    hienThiDonHang();
    $("#hoTen").blur(kiemTraHoTen);
    $("#soDT").blur(kiemTraSoDT);
    $("#email").blur(kiemTraEmail);
    $("#diaChi").blur(kiemTraDiaChi);
    $("#checkoutForm input, #checkoutForm textarea").on("input change", luuThongTinTam);
    $("#rememberInfo").change(function () {
        if ($(this).prop("checked")) luuThongTinTam();
        else localStorage.removeItem("iuh_checkout_draft");
    });
    $("input[name='payment']").change(function () {
        $("#bankNotice").toggle($("#bank").prop("checked"));
    });
    $("#checkoutForm").submit(function (e) {
        e.preventDefault();
        datHang();
    });
});

$(window).on("pageshow storage", function () { if (!dangDatHang) hienThiDonHang(); });
