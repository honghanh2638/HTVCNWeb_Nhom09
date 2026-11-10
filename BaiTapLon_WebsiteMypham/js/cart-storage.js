const CART_STORAGE_KEY = 'IUH_BEAUTY_CART_DATA';

const IUHCart = {
    // Lấy dữ liệu từ LocalStorage
    getCart() {
        try {
            const data = localStorage.getItem(CART_STORAGE_KEY);
            const cart = data ? JSON.parse(data) : [];
            // Đảm bảo mọi sản phẩm đều có checked mặc định là true nếu chưa có
            return cart.map(item => ({
                ...item,
                checked: item.checked !== undefined ? item.checked : true
            }));
        } catch (e) {
            console.error("Lỗi đọc giỏ hàng:", e);
            return [];
        }
    },

    // Lưu dữ liệu vào LocalStorage
    saveCart(cart) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        this.updateBadge();
    },

    // Thêm sản phẩm
    addItem(product) {
        let cart = this.getCart();
        let existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += (product.quantity || 1);
            existing.checked = true; // Chọn luôn khi thêm mới/tăng SL
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                quantity: product.quantity || 1,
                image: product.image || '',
                checked: true // Mặc định luôn chọn
            });
        }
        this.saveCart(cart);
        alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    },

    // Cập nhật số đếm trên Header
    updateBadge() {
        const cart = this.getCart();
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('#cartCount').forEach(el => {
            el.textContent = totalQty;
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    IUHCart.updateBadge();
});