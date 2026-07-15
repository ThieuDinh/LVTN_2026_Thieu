import { create } from 'zustand';

export const useStore = create((set) => ({
  // Authentication State
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // Shopping Cart State
  cart: [],
  addToCart: (product, quantity = 1) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        ),
      };
    }
    return { cart: [...state.cart, { ...product, quantity }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== productId),
  })),
  updateCartQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map((item) =>
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    ),
  })),
  clearCart: () => set({ cart: [] }),

  // Shop / Vendor State
  shops: [],
  setShops: (shops) => set({ shops }),
  
  // Product List State
  products: [],
  setProducts: (products) => set({ products }),
}));
