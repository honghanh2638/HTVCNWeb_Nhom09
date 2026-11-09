function layDuLieu(ten, giaTriMacDinh) {
    try {
        let duLieu = JSON.parse(localStorage.getItem(ten));
        return duLieu == null ? giaTriMacDinh : duLieu;
    } catch (e) {
        return giaTriMacDinh;
    }
}

function luuDuLieu(ten, duLieu) {
    try {
        localStorage.setItem(ten, JSON.stringify(duLieu));
        return true;
    } catch (e) {
        alert("Không lưu được dữ liệu trên trình duyệt. Hãy kiểm tra LocalStorage.");
        return false;
    }
}

function chuyenGioHangCu() {
    let gioHangCu = layDuLieu("iuh_cart_items", []);
    if (!Array.isArray(gioHangCu) || gioHangCu.length == 0) return;

    let gioHang = layDuLieu("iuh_cart", []);
    if (!Array.isArray(gioHang)) gioHang = [];

    let chuaChuyen = [];
    let daChuyen = false;
    for (let i = 0; i < gioHangCu.length; i++) {
        let item = gioHangCu[i];
        if (!item || typeof item != "object") {
            chuaChuyen.push(item);
            continue;
        }

        let maSP = String(item.productId || item.id || "");
        if (/^[1-9]\d*$/.test(maSP)) {
            maSP = "SP" + maSP.padStart(3, "0");
        }
        let ten = item.name || item.title || "";
        let gia = Number(item.price);
        let soLuong = Math.floor(Number(item.quantity));
        if (!maSP || !ten || !Number.isFinite(gia) || gia < 0 ||
            !Number.isFinite(soLuong) || soLuong < 1) {
            chuaChuyen.push(item);
            continue;
        }

        soLuong = Math.min(99, soLuong);
        let hinhAnh = item.image || item.img || "../img/no-image.svg";
        if (hinhAnh.startsWith("./img/")) {
            hinhAnh = "../img/" + hinhAnh.substring(6);
        }

        let viTri = -1;
        for (let j = 0; j < gioHang.length; j++) {
            let sp = gioHang[j];
            if (sp && String(sp.productId || sp.id || "") == maSP) {
                viTri = j;
                break;
            }
        }

        if (viTri >= 0) {
            let sp = gioHang[viTri];
            sp.quantity = Math.min(99, (Number(sp.quantity) || 0) + soLuong);
            sp.selected = true;
            if (!sp.name) sp.name = ten;
            if (sp.price == null) sp.price = gia;
            if (!sp.image) sp.image = hinhAnh;
        } else {
            gioHang.push({
                productId: maSP,
                name: ten,
                price: gia,
                image: hinhAnh,
                category: item.category || "",
                quantity: soLuong,
                selected: true
            });
        }
        daChuyen = true;
    }

    if (!daChuyen || !luuDuLieu("iuh_cart", gioHang)) return;
    if (chuaChuyen.length == 0) localStorage.removeItem("iuh_cart_items");
    else luuDuLieu("iuh_cart_items", chuaChuyen);
    localStorage.removeItem("iuh_checkout_items");
    localStorage.removeItem("iuh_checkout_totals");
}

function layGioHang() {
    chuyenGioHangCu();
    let gioHang = layDuLieu("iuh_cart", []);
    return Array.isArray(gioHang) ? gioHang : [];
}

function luuGioHang(gioHang) {
    if (!luuDuLieu("iuh_cart", gioHang)) return false;
    localStorage.removeItem("iuh_checkout_items");
    localStorage.removeItem("iuh_checkout_totals");
    return true;
}

function layDanhSachSanPham() {
    let ds = layDuLieu("iuh_products", []);
    return Array.isArray(ds) ? ds : [];
}

function timSanPham(maSP, item) {
    let ds = layDanhSachSanPham();
    for (let i = 0; i < ds.length; i++) {
        if (String(ds[i].id) == String(maSP)) return ds[i];
    }
    if (item && item.name && item.price != null) return item;
    return null;
}

function layMaSanPham(item) {
    return String(item.productId || item.id || "");
}

function dinhDangTien(soTien) {
    return Number(soTien || 0).toLocaleString("vi-VN") + "đ";
}

function tinhPhiVanChuyen(tamTinh) {
    if (tamTinh <= 0 || tamTinh >= 1000000) return 0;
    return 30000;
}

function demSoLuongGioHang() {
    let gioHang = layGioHang();
    let tong = 0;
    for (let i = 0; i < gioHang.length; i++) {
        tong += Number(gioHang[i].quantity) || 0;
    }
    return tong;
}

function capNhatSoGioHang() {
    let tong = demSoLuongGioHang();
    $("#cartCount").text(tong > 99 ? "99+" : tong);
}

function themVaoGioHang(sanPham, soLuong) {
    if (!sanPham || !sanPham.id || !sanPham.name ||
        !Number.isFinite(Number(sanPham.price)) || Number(sanPham.price) < 0) {
        alert("Thông tin sản phẩm không hợp lệ.");
        return false;
    }

    let sl = Number(soLuong) || 1;
    sl = Math.floor(sl);
    if (sl < 1 || sl > 99) return false;

    let ds = layDanhSachSanPham();
    let daCo = false;
    for (let i = 0; i < ds.length; i++) {
        if (String(ds[i].id) == String(sanPham.id)) {
            ds[i] = sanPham;
            daCo = true;
            break;
        }
    }
    if (!daCo) ds.push(sanPham);
    if (!luuDuLieu("iuh_products", ds)) return false;

    let gioHang = layGioHang();
    let timThay = false;
    for (let i = 0; i < gioHang.length; i++) {
        if (layMaSanPham(gioHang[i]) == String(sanPham.id)) {
            let soLuongMoi = (Number(gioHang[i].quantity) || 0) + sl;
            gioHang[i].quantity = Math.min(99, soLuongMoi);
            gioHang[i].selected = true;
            gioHang[i].name = sanPham.name;
            gioHang[i].price = Number(sanPham.price);
            gioHang[i].image = sanPham.image || "../img/no-image.svg";
            gioHang[i].category = sanPham.category || "";
            timThay = true;
            break;
        }
    }
    if (!timThay) {
        gioHang.push({
            productId: String(sanPham.id),
            quantity: sl,
            selected: true,
            name: sanPham.name,
            price: Number(sanPham.price),
            image: sanPham.image || "../img/no-image.svg",
            category: sanPham.category || ""
        });
    }
    if (!luuGioHang(gioHang)) return false;
    capNhatSoGioHang();
    return true;
}

function anhDuPhong(anh) {
    $(anh).off("error").attr("src", "../img/no-image.svg");
}
