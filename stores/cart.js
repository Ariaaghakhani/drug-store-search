import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOpen: false,
  }),

  getters: {
    itemCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    subtotal: (state) => {
      return state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    },

    total: (state) => {
      const subtotal = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
      const shipping = subtotal > 50 ? 0 : 5.99
      return subtotal + shipping
    },

    hasItems: (state) => state.items.length > 0,
  },

  actions: {
    addItem(product) {
      const existingItem = this.items.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          ...product,
          quantity: 1,
        })
      }

      // Save to localStorage manually
      this.saveToStorage()
    },

    removeItem(productId) {
      const index = this.items.findIndex((item) => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
      this.saveToStorage()
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find((item) => item.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId)
        } else {
          item.quantity = quantity
        }
      }
      this.saveToStorage()
    },

    clearCart() {
      this.items = []
      this.saveToStorage()
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    // Manual persistence methods
    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    loadFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem('cart')
        if (saved) {
          try {
            this.items = JSON.parse(saved)
          } catch (e) {
            console.error('Failed to load cart from storage', e)
          }
        }
      }
    },
  },
})
