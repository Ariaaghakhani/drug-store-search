<template>
  <section class="py-16">
    <!-- Section Header -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
      <div>
        <h2 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">
          محصولات <span class="text-brand-500">ویژه</span>
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-3 text-lg">
          داروها و محصولات بهداشتی محبوب با اعتماد هزاران مشتری
        </p>
      </div>
      <UButton
        color="white"
        variant="ghost"
        trailing-icon="i-heroicons-arrow-left"
        to="/products"
        size="xl"
        class="hidden lg:flex"
      >
        مشاهده همه محصولات
      </UButton>
    </div>

    <!-- Products Grid - Responsive -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      <ProductCard
        v-for="product in featuredProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="handleAddToCart"
        @quick-view="handleQuickView"
      />
    </div>

    <!-- Mobile View All Button -->
    <div class="mt-12 text-center lg:hidden">
      <UButton
        color="white"
        variant="outline"
        block
        size="xl"
        trailing-icon="i-heroicons-arrow-left"
        to="/products"
      >
        مشاهده همه محصولات
      </UButton>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCartStore } from '~/stores/cart'
import type { Product } from '~/types/product'

export default defineComponent({
  name: 'FeaturedProducts',

  data() {
    return {
      featuredProducts: [
        {
          id: '1',
          name: 'ویتامین D3 مقدار ۵۰۰۰ واحد',
          category: 'مکمل‌های غذایی',
          price: 129000,
          originalPrice: 169000,
          rating: 4.8,
          reviewCount: 1247,
          image: '/images/products/vitamin-d3.jpg',
          inStock: true,
          badge: 'Popular' as const,
          description: 'ویتامین D3 با دوز بالا برای تقویت استخوان و سیستم ایمنی'
        },
        {
          id: '2',
          name: 'ایبوپروفن ۲۰۰ میلی‌گرم',
          category: 'مسکن‌ها',
          price: 84900,
          rating: 4.7,
          reviewCount: 892,
          image: '/images/products/ibuprofen.jpg',
          inStock: true,
          badge: 'Best Seller' as const,
          description: 'ضد درد و کاهش‌دهنده تب با اثر سریع'
        },
        {
          id: '3',
          name: 'امگا-۳ روغن ماهی',
          category: 'سلامت قلب',
          price: 199000,
          originalPrice: 249000,
          rating: 4.9,
          reviewCount: 2156,
          image: '/images/products/omega-3.jpg',
          inStock: true,
          badge: 'Premium' as const,
          description: 'روغن ماهی با کیفیت بالا برای سلامت قلب و عروق'
        },
        {
          id: '4',
          name: 'مولتی ویتامین روزانه',
          category: 'سلامت عمومی',
          price: 159000,
          rating: 4.6,
          reviewCount: 743,
          image: '/images/products/multivitamin.jpg',
          inStock: true,
          badge: 'New' as const,
          description: 'تغذیه کامل روزانه با ویتامین‌ها و مواد معدنی ضروری'
        }
      ] as Product[]
    }
  },

  computed: {
    cartStore() {
      return useCartStore()
    }
  },

  methods: {
    handleAddToCart(product: Product) {
      this.cartStore.addItem(product)
      
      const toast = useToast()
      toast.add({
        title: 'به سبد خرید اضافه شد',
        description: product.name,
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
    },

    handleQuickView(product: Product) {
      // TODO: Implement quick view modal
      console.log('Quick view:', product)
    }
  }
})
</script>
