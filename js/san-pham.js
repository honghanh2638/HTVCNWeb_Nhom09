// SAN-PHAM.JS - Danh sách sản phẩm dùng chung cho IUH BEAUTY.
// Mỗi sản phẩm có mã duy nhất. Giá giữ đúng theo các file thành viên cung cấp.
let danhSachSanPham = [
    { id: "SP001", name: "Serum Dưỡng Sáng", price: 299000, image: "../img/prod-serum.jpg", category: "Chăm sóc da", page: "chi-tiet-serum-duong-sang.html" },
    { id: "SP002", name: "Kem Dưỡng Ẩm", price: 259000, image: "../img/Nuoc_Buoi_Moi_Edit_tach_nen_Size_Web_ef5c4fc93b.jpg", category: "Chăm sóc da", page: "chi-tiet-kem-duong-am.html" },
    { id: "SP003", name: "Sữa Rửa Mặt", price: 159000, image: "../img/prod-cleanser.jpg", category: "Chăm sóc da", page: "chi-tiet-sua-rua-mat.html" },
    { id: "SP004", name: "Son Lì Mịn", price: 189000, image: "../img/prod-lipstick.jpg", category: "Trang điểm", page: "chi-tiet-son-li-min.html" },
    { id: "SP005", name: "Serum Vitamin C", price: 329000, image: "../img/prod-vitaminc.jpg", category: "Chăm sóc da", page: "chi-tiet-serum-vitamin-c.html" },
 ];

function timSanPhamGoc(maSP) {
    for (let i = 0; i < danhSachSanPham.length; i++) {
        if (danhSachSanPham[i].id == String(maSP)) {
            return danhSachSanPham[i];
        }
    }
    return null;
}

// Có thể đọc sản phẩm không cần lưu LocalStorage. Chỉ ghi iuh_products
// khi khách hàng thực sự thêm sản phẩm vào giỏ hàng.
