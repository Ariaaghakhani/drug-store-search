<template>
  <div
    class="relative w-full"
    dir="rtl"
    role="region"
    aria-label="اسلایدر تبلیغات و خدمات داروخانه"
    aria-roledescription="carousel"
  >
    <UCarousel
      v-slot="{ item }"
      :items="slides"
      :ui="carouselUI"
      arrows
      indicators
      class="rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
    >
      <!-- Slide Content -->
      <div
        class="relative w-full h-[280px] sm:h-[320px] lg:h-[450px] xl:h-[500px] flex items-center justify-center overflow-hidden"
        role="group"
        :aria-label="`اسلاید ${item.id} از ${slides.length}: ${item.title}`"
        aria-roledescription="slide"
      >
        <!-- Background Gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300 dark:from-brand-900 dark:to-brand-800"
        >
          <!-- Decorative elements -->
          <div class="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
          <div
            class="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          />
          <div
            class="absolute bottom-10 left-10 w-40 h-40 bg-brand-400/20 rounded-full blur-3xl"
          />
        </div>

        <!-- Slide Content Container -->
        <div
          class="relative z-10 w-full h-full flex flex-col items-center justify-center px-8 text-center"
        >
          <!-- Icon -->
          <UIcon
            :name="item.icon"
            class="w-24 h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 text-brand-500 dark:text-brand-400 mb-6 lg:mb-8"
          />

          <!-- Title -->
          <h3
            class="text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 dark:text-white mb-3 lg:mb-4"
          >
            {{ item.title }}
          </h3>

          <!-- Description -->
          <p
            class="text-base lg:text-lg xl:text-xl text-gray-700 dark:text-gray-200 max-w-md lg:max-w-lg"
          >
            {{ item.description }}
          </p>

          <!-- CTA Badge (optional) -->
          <UBadge
            v-if="item.badge"
            :label="item.badge"
            class="mt-4 lg:mt-6"
            color="primary"
            size="lg"
            variant="solid"
          />
        </div>
      </div>
    </UCarousel>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Carousel slide data
const slides = [
  {
    id: 1,
    icon: 'i-heroicons-shopping-bag',
    title: 'داروهای بدون نسخه',
    description: 'دسترسی آسان به انواع داروها و مکمل‌های سلامتی',
    badge: 'بیش از ۵۰۰۰ محصول',
  },
  {
    id: 2,
    icon: 'i-heroicons-sparkles',
    title: 'دستیار هوشمند پزشکی',
    description: 'مشاوره رایگان با هوش مصنوعی پیشرفته',
    badge: 'پشتیبانی ۲۴/۷',
  },
  {
    id: 3,
    icon: 'i-heroicons-truck',
    title: 'ارسال رایگان و سریع',
    description: 'تحویل در کمتر از ۲ ساعت در سراسر شهر',
    badge: 'ارسال رایگان',
  },
  {
    id: 4,
    icon: 'i-heroicons-gift',
    title: 'تخفیف‌های ویژه',
    description: 'بهترین قیمت‌ها و پیشنهادات استثنایی',
    badge: 'تا ۳۰٪ تخفیف',
  },
  {
    id: 5,
    icon: 'i-heroicons-shield-check',
    title: 'ضمانت اصالت کالا',
    description: 'تمامی محصولات دارای مجوز از سازمان غذا و دارو',
    badge: '۱۰۰٪ اصل',
  },
]

// RTL-specific carousel UI configuration
const carouselUI = {
  wrapper: 'relative w-full',
  container: 'relative w-full overflow-hidden rounded-2xl lg:rounded-3xl',
  item: 'w-full flex-shrink-0',
  arrows: {
    wrapper: 'absolute inset-0 flex items-center justify-between pointer-events-none z-20 px-4',
    base: 'pointer-events-auto w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-110 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-brand-500/50',
    // RTL: Previous button on RIGHT, Next button on LEFT
    prev: 'order-2', // This puts "prev" on the right in RTL
    next: 'order-1', // This puts "next" on the left in RTL
    icon: 'w-5 h-5 lg:w-6 lg:h-6 text-gray-700 dark:text-gray-200',
  },
  indicators: {
    wrapper: 'absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20',
    base: 'w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-500',
    inactive: 'bg-white/50 hover:bg-white/75',
    active: 'bg-white w-6 lg:w-8',
  },
}

// Autoplay functionality
const autoplayInterval = ref(null)
const carousel = ref(null)
const isPaused = ref(false)

const startAutoplay = () => {
  if (autoplayInterval.value) return

  autoplayInterval.value = setInterval(() => {
    if (!isPaused.value) {
      // In RTL, we want to advance to the next slide
      // The carousel should handle RTL direction internally
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      document.dispatchEvent(event)
    }
  }, 4000) // 4 seconds between slides
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

const pauseAutoplay = () => {
  isPaused.value = true
}

const resumeAutoplay = () => {
  isPaused.value = false
}

// Lifecycle hooks
onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
/* Ensure smooth transitions */
:deep(.carousel-item) {
  transition: transform 0.5s ease-in-out;
}

/* RTL-specific adjustments if needed */
[dir='rtl'] :deep(.carousel-track) {
  direction: rtl;
}
</style>
