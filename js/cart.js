function hienThiGioHang() {
    let gioHang = layGioHang();
    let tongSoLuong = 0;
    let soDaChon = 0;
    let soDongDaChon = 0;
    let tamTinh = 0;

    $("#cartList").empty();
    $("#cartNotice").hide().text("");

    for (let i = 0; i < gioHang.length; i++) {
        let item = gioHang[i];
        let maSP = layMaSanPham(item);
        let sp = timSanPham(maSP, item);
        let soLuong = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
        let daChon = item.selected !== false;
        let gia = sp ? Number(sp.price) : NaN;
        let hopLe = sp != null && Number.isFinite(gia) && gia >= 0;
        let ten = hopLe ? sp.name : "Sản phẩm chưa có dữ liệu";
        let thanhTien = hopLe ? gia * soLuong : 0;

        tongSoLuong += soLuong;
        if (daChon && hopLe) {
            soDaChon += soLuong;
            soDongDaChon++;
            tamTinh += thanhTien;
        }

        let dong = $("<div>").addClass("product-item");
        let anh = $("<img>").addClass("product-img")
            .attr("src", hopLe ? (sp.image || "../img/no-image.svg") : "../img/no-image.svg")
            .attr("alt", ten)
            .on("error", function () { anhDuPhong(this); });

        let thongTin = $("<div>").addClass("product-info");
        thongTin.append($("<h3>").text(ten));
        if (hopLe) {
            thongTin.append($("<p>").addClass("category").text(sp.category || "Mỹ phẩm IUH BEAUTY"));
            thongTin.append($("<p>").addClass("price").append("Đơn giá: ", $("<strong>").text(dinhDangTien(gia))));
        } else {
            thongTin.append($("<p>").addClass("product-missing").text("Bạn có thể xóa sản phẩm này và thêm lại từ trang sản phẩm."));
        }
        thongTin.append($("<button>").attr("type", "button").addClass("btn-delete")
            .attr("data-id", maSP).text("Xóa"));

        let thaoTac = $("<div>").addClass("product-actions");
        let chon = $("<input>").attr("type", "checkbox").addClass("check-product")
            .attr("data-id", maSP).attr("aria-label", "Chọn " + ten)
            .prop("checked", daChon && hopLe).prop("disabled", !hopLe);
        thaoTac.append($("<label>").addClass("select-product").append(chon));

        let soLuongBox = $("<div>").addClass("quantity-box");
        soLuongBox.append($("<button>").addClass("btn-minus").attr("type", "button")
            .attr("data-id", maSP).prop("disabled", soLuong <= 1).attr("aria-label", "Giảm số lượng " + ten).text("−"));
        soLuongBox.append($("<span>").text(soLuong));
        soLuongBox.append($("<button>").addClass("btn-plus").attr("type", "button")
            .attr("data-id", maSP).prop("disabled", soLuong >= 99).attr("aria-label", "Tăng số lượng " + ten).text("+"));
        thaoTac.append(soLuongBox);
        thaoTac.append($("<div>").addClass("item-total").append(
            $("<small>").text("Thành tiền"),
            document.createTextNode(hopLe ? dinhDangTien(thanhTien) : "Chưa có giá")
        ));
        dong.append(anh, thongTin, thaoTac);
        $("#cartList").append(dong);
    }

    let phiVanChuyen = tinhPhiVanChuyen(tamTinh);
    $("#totalProduct").text("(" + tongSoLuong + " sản phẩm)");
    $("#selectedCount").text(soDaChon);
    $("#subtotal").text(dinhDangTien(tamTinh));
    $("#shippingFee").text(tamTinh >= 1000000 ? "Miễn phí" : dinhDangTien(phiVanChuyen));
    $("#totalPrice").text(dinhDangTien(tamTinh + phiVanChuyen));
    $("#shippingNotice").text(tamTinh >= 1000000
        ? "Đơn hàng đã đủ điều kiện miễn phí vận chuyển."
        : "Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ.");

    let rong = gioHang.length == 0;
    $("#emptyCart").toggle(rong);
    $("#cartList").toggle(!rong);
    $("#cartFooter").toggle(!rong);
    $("#checkAll").prop("disabled", rong);
    $("#checkAll").prop("checked", !rong && soDongDaChon == gioHang.length);
    $("#checkAll").prop("indeterminate", soDongDaChon > 0 && soDongDaChon < gioHang.length);
    $("#btnCheckout").prop("disabled", soDaChon == 0);
    $("#btnDeleteSelected").prop("disabled", soDongDaChon == 0);
    capNhatSoGioHang();
}

function thongBaoGioHang(noiDung) {
    $("#cartNotice").text(noiDung).show();
}

function doiSoLuong(maSP, thayDoi) {
    let gioHang = layGioHang();
    for (let i = 0; i < gioHang.length; i++) {
        if (layMaSanPham(gioHang[i]) == maSP) {
            let soLuong = Number(gioHang[i].quantity) || 1;
            gioHang[i].quantity = Math.max(1, Math.min(99, soLuong + thayDoi));
            break;
        }
    }
    if (luuGioHang(gioHang)) {
        hienThiGioHang();
        thongBaoGioHang("Đã cập nhật số lượng và lưu giỏ hàng.");
    }
}

function xoaSanPham(maSP) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    let gioHang = layGioHang();
    let gioHangMoi = [];
    for (let i = 0; i < gioHang.length; i++) {
        if (layMaSanPham(gioHang[i]) != maSP) gioHangMoi.push(gioHang[i]);
    }
    if (luuGioHang(gioHangMoi)) {
        hienThiGioHang();
        thongBaoGioHang("Đã xóa sản phẩm khỏi giỏ hàng.");
    }
}

function chonSanPham(maSP, daChon) {
    let gioHang = layGioHang();
    for (let i = 0; i < gioHang.length; i++) {
        if (layMaSanPham(gioHang[i]) == maSP) gioHang[i].selected = daChon;
    }
    if (luuGioHang(gioHang)) {
        hienThiGioHang();
        thongBaoGioHang("Đã lưu lựa chọn sản phẩm.");
    }
}

function chonTatCa(daChon) {
    let gioHang = layGioHang();
    for (let i = 0; i < gioHang.length; i++) {
        let sp = timSanPham(layMaSanPham(gioHang[i]), gioHang[i]);
        gioHang[i].selected = daChon && sp != null && Number.isFinite(Number(sp.price));
    }
    if (luuGioHang(gioHang)) {
        hienThiGioHang();
        thongBaoGioHang("Đã cập nhật lựa chọn sản phẩm.");
    }
}

function xoaSanPhamDaChon() {
    if (!confirm("Bạn có chắc muốn xóa các sản phẩm đã chọn?")) return;
    let gioHang = layGioHang();
    let gioHangMoi = [];
    for (let i = 0; i < gioHang.length; i++) {
        if (gioHang[i].selected === false) gioHangMoi.push(gioHang[i]);
    }
    if (luuGioHang(gioHangMoi)) {
        hienThiGioHang();
        thongBaoGioHang("Đã xóa các sản phẩm được chọn.");
    }
}

function thanhToan() {
    let gioHang = layGioHang();
    let dsThanhToan = [];
    let tamTinh = 0;
    for (let i = 0; i < gioHang.length; i++) {
        let item = gioHang[i];
        let maSP = layMaSanPham(item);
        let sp = timSanPham(maSP, item);
        if (item.selected !== false && sp != null && Number.isFinite(Number(sp.price)) && Number(sp.price) >= 0) {
            let sl = Number(item.quantity) || 1;
            let gia = Number(sp.price);
            dsThanhToan.push({
                productId: maSP,
                name: sp.name,
                image: sp.image || "../img/no-image.svg",
                category: sp.category || "",
                price: gia,
                quantity: sl
            });
            tamTinh += gia * sl;
        }
    }
    if (dsThanhToan.length == 0) {
        alert("Bạn chưa chọn sản phẩm để thanh toán!");
        return;
    }
    
    let taiKhoan = layDuLieu("iuh_current_user", null);
    if (!taiKhoan || !taiKhoan.email) {
        alert("Vui lòng đăng nhập tại Trang chủ trước khi thanh toán!");
        window.location.href = "index.html";
        return;
    }

    let phiVanChuyen = tinhPhiVanChuyen(tamTinh);
    if (!luuDuLieu("iuh_checkout_items", dsThanhToan)) return;
    if (!luuDuLieu("iuh_checkout_totals", {
        subtotal: tamTinh,
        shippingFee: phiVanChuyen,
        total: tamTinh + phiVanChuyen
    })) return;
    window.location.href = "checkOut.html";
}

$(document).ready(function () {
    hienThiGioHang();
    $("#cartList").on("click", ".btn-plus", function () { doiSoLuong($(this).attr("data-id"), 1); });
    $("#cartList").on("click", ".btn-minus", function () { doiSoLuong($(this).attr("data-id"), -1); });
    $("#cartList").on("click", ".btn-delete", function () { xoaSanPham($(this).attr("data-id")); });
    $("#cartList").on("change", ".check-product", function () {
        chonSanPham($(this).attr("data-id"), $(this).prop("checked"));
    });
    $("#checkAll").change(function () { chonTatCa($(this).prop("checked")); });
    $("#btnDeleteSelected").click(xoaSanPhamDaChon);
    $("#btnCheckout").click(thanhToan);
});

$(window).on("pageshow storage", function () { hienThiGioHang(); });
