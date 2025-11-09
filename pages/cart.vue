<template>
  <UContainer>
    <div class="py-12">
      <!-- Page Header -->
      <div class="mb-12">
        <h1
          class="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4"
        >
          سبد <span class="text-brand-500">خرید</span>
        </h1>
      </div>

      <!-- Empty Cart -->
      <div v-if="!cartStore.hasItems" class="text-center py-20">
        <UIcon
          name="i-heroicons-shopping-cart"
          class="w-24 h-24 text-gray-300 mx-auto mb-6"
        />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          سبد خرید شما خالی است
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          محصولی به سبد خرید اضافه نکرده‌اید
        </p>
        <UButton
          size="xl"
          color="primary"
          to="/medications"
          icon="i-heroicons-shopping-bag"
        >
          مشاهده محصولات
        </UButton>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Items List -->
        <div class="lg:col-span-2 space-y-4">
          <UCard v-for="item in cartStore.items" :key="item.id">
            <div class="flex gap-4">
              <!-- Product Image -->
              <div
                class="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"
              >
                <UIcon
                  name="i-heroicons-cube"
                  class="w-12 h-12 text-gray-300"
                />
              </div>

              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <h3
                  class="font-bold text-lg text-gray-900 dark:text-white mb-1"
                >
                  {{ item.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {{ item.category }}
                </p>

                <div class="flex items-center gap-4">
                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-2">
                    <UButton
                      size="sm"
                      color="white"
                      icon="i-heroicons-minus"
                      square
                      @click="decreaseQuantity(item.id)"
                    />
                    <span class="w-12 text-center font-bold">{{
                      item.quantity
                    }}</span>
                    <UButton
                      size="sm"
                      color="white"
                      icon="i-heroicons-plus"
                      square
                      @click="increaseQuantity(item.id)"
                    />
                  </div>

                  <!-- Price -->
                  <div class="text-lg font-black text-brand-500">
                    {{ (item.price * item.quantity).toLocaleString('fa-IR') }}
                    تومان
                  </div>
                </div>
              </div>

              <!-- Remove Button -->
              <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                square
                @click="removeItem(item.id)"
              />
            </div>
          </UCard>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <UCard>
            <div class="space-y-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                خلاصه سفارش
              </h3>

              <div
                class="space-y-3 py-4 border-y border-gray-200 dark:border-gray-800"
              >
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400"
                    >جمع محصولات:</span
                  >
                  <span class="font-bold"
                    >{{
                      cartStore.subtotal.toLocaleString('fa-IR')
                    }}
                    تومان</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400"
                    >هزینه ارسال:</span
                  >
                  <span class="font-bold">
                    {{
                      shippingCost > 0
                        ? shippingCost.toLocaleString('fa-IR') + ' تومان'
                        : 'رایگان'
                    }}
                  </span>
                </div>
              </div>

              <div class="flex justify-between text-lg">
                <span class="font-bold text-gray-900 dark:text-white"
                  >جمع کل:</span
                >
                <span class="font-black text-brand-500 text-2xl">
                  {{ cartStore.total.toLocaleString('fa-IR') }} تومان
                </span>
              </div>

              <UButton
                block
                size="xl"
                color="primary"
                icon="i-heroicons-shopping-bag"
              >
                تکمیل خرید
              </UButton>

              <div class="text-center text-sm text-gray-500 dark:text-gray-400">
                <UIcon name="i-heroicons-shield-check" class="w-4 h-4 inline" />
                پرداخت امن
              </div>
            </div>
          </UCard>

          <!-- Free Shipping Notice -->
          <UCard v-if="cartStore.subtotal < 500000" class="mt-4">
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-truck" class="w-6 h-6 text-brand-500" />
              <div class="text-sm">
                <div class="font-bold text-gray-900 dark:text-white">
                  {{ (500000 - cartStore.subtotal).toLocaleString('fa-IR') }}
                  تومان تا ارسال رایگان
                </div>
                <div class="text-gray-500">برای خرید بالای ۵۰۰,۰۰۰ تومان</div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCartStore } from '~/stores/cart'

export default defineComponent({
  name: 'CartPage',

  head() {
    return {
      title: 'سبد خرید | داروخانه آنلاین',
    }
  },

  computed: {
    cartStore() {
      return useCartStore()
    },

    shippingCost(): number {
      return this.cartStore.subtotal > 500000 ? 0 : 59900
    },
  },

  methods: {
    increaseQuantity(productId: string) {
      const item = this.cartStore.items.find((i) => i.id === productId)
      if (item) {
        this.cartStore.updateQuantity(productId, item.quantity + 1)
      }
    },

    decreaseQuantity(productId: string) {
      const item = this.cartStore.items.find((i) => i.id === productId)
      if (item && item.quantity > 1) {
        this.cartStore.updateQuantity(productId, item.quantity - 1)
      }
    },

    removeItem(productId: string) {
      this.cartStore.removeItem(productId)
      const toast = useToast()
      toast.add({
        title: 'از سبد خرید حذف شد',
        icon: 'i-heroicons-trash',
        color: 'red',
      })
    },
  },
})
</script>
