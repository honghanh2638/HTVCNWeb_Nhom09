// ==================== DỮ LIỆU SẢN PHẨM MỸ PHẨM ====================
const iuhBeautyProducts = {
  skincare: [
    { id: 1, ten: "Serum Dưỡng Sáng Phục Hồi", gia: 153650750000, mota: "Serum dưỡng sáng tinh khiết cô đặc thẩm thấu nhanh vào từng tầng biểu bì.", hinhAnh: "../img/prod-serum.jpg", url: "chi-tiet-serum-duong-sang.html" },
    { id: 2, ten: "Kem Dưỡng Ẩm Chuyên Sâu", gia: 923980650000, mota: "Kem dưỡng ẩm dịu mát với tinh chất bưởi và phức hợp Ceramide tự nhiên.", hinhAnh: "../img/Nuoc_Buoi_Moi_Edit_tach_nen_Size_Web_ef5c4fc93b.jpg", url: "chi-tiet-kem-duong-am.html" },
    { id: 3, ten: "Sữa Rửa Mặt Tạo Bọt Dịu Nhẹ", gia: 724990420000, mota: "Bọt mịn giàu khoáng chất cuốn sạch bụi mịn PM2.5 và cân bằng pH 5.5.", hinhAnh: "../img/prod-cleanser.jpg", url: "chi-tiet-sua-rua-mat.html" },
    { id: 5, ten: "Serum Vitamin C Chống Oxy Hóa", gia: 635934790000, mota: "Công thức Vitamin C bọc phân tử thế hệ mới giúp làm mờ thâm nám.", hinhAnh: "../img/prod-vitaminc.jpg", url: "chi-tiet-serum-vitamin-c.html" }
  ],
  makeup: [
    { id: 4, ten: "Son Lì Velvet Tint Mịn Màng", gia: 875879380000, mota: "Chất son nhung mướt mịn như lụa, lên màu chuẩn sắc ngay từ lần quét đầu.", hinhAnh: "../img/prod-lipstick.jpg", url: "chi-tiet-son-li-min.html" },
    { id: 6, ten: "Phấn Nước Cushion Glossy", gia: 550000, mota: "Lớp nền mỏng nhẹ tự nhiên, mọng nước căng bóng chuẩn Hàn Quốc.", hinhAnh: "../img/cushion.jpg", url: "#" },
    { id: 7, ten: "Bảng Phấn Mắt 12 Ô Pastel", gia: 410000, mota: "Hạt phấn siêu mịn dễ tán, phối hợp nhiều tone màu hiện đại.", hinhAnh: "../img/pm.webp", url: "#" }
  ],
  haircare: [
    { id: 8, ten: "Tinh Dầu Dưỡng Tóc Nước Bưởi", gia: 165000, mota: "Kích thích mọc tóc và nuôi dưỡng chân tóc chắc khỏe.", hinhAnh: "../img/dau-duong-toc-l-oreal-100ml-1.webp", url: "#" },
    { id: 9, ten: "Dầu Gội Phục Hồi Argan Organic", gia: 280000, mota: "Phục hồi tóc hư tổn nặng do hóa chất tẩy nhuộm.", hinhAnh: "../img/dg.png", url: "#" }
  ]
};

// ==================== DỮ LIỆU TIN TỨC / BLOG ====================
const iuhBeautyBlogData = [
  {
    id: 1,
    title: "5 thành phần dưỡng da đáng có trong chu trình của bạn",
    category: "ingredients",
    date: "2026-05-16",
    minutes: 5,
    image: "blog-1.jpg",
    excerpt: "Khám phá những thành phần quen thuộc giúp cấp ẩm, làm dịu và chăm sóc da mỗi ngày."
  },
  {
    id: 2,
    title: "Chăm sóc da sáng và tối: Khác nhau ở điểm nào?",
    category: "skincare",
    date: "2026-05-10",
    minutes: 5,
    image: "blog-2.jpg",
    excerpt: "Tìm hiểu cách xây dựng thói quen chăm sóc da hợp lý vào buổi sáng và buổi tối."
  },
  {
    id: 3,
    title: "Làm đẹp bền vững từ những thói quen nhỏ",
    category: "lifestyle",
    date: "2026-05-03",
    minutes: 4,
    image: "blog-3.jpg",
    excerpt: "Khám phá những thói quen làm đẹp thân thiện với môi trường mà bạn có thể bắt đầu ngay."
  }
];

// ==================== LƯU DỮ LIỆU VÀO LOCALSTORAGE ====================
localStorage.setItem("iuh_beauty_products", JSON.stringify(iuhBeautyProducts));
if (!localStorage.getItem("IUHBeautyNewsV5")) {
  localStorage.setItem("IUHBeautyNewsV5", JSON.stringify(iuhBeautyBlogData));
}

// Khởi tạo giỏ hàng nếu chưa có
if (!localStorage.getItem("iuh_cart_items")) {
  localStorage.setItem("iuh_cart_items", JSON.stringify([]));
}