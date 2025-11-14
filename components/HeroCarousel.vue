<template>
  <div
    class="relative w-full h-full"
    dir="rtl"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
  >
    <!-- Carousel Container -->
    <div
      class="relative w-full h-full min-h-[300px] overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300 dark:from-brand-700 dark:via-brand-800 dark:to-brand-900"
    >
      <!-- Slides Wrapper -->
      <div
        class="flex transition-transform duration-500 ease-in-out h-full"
        :style="{ transform: `translateX(${currentTranslate}%)` }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <!-- Slides -->
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="flex-shrink-0 h-full relative"
          style="width: 100%"
          :class="{
            'opacity-100': index === currentIndex,
            'opacity-0': index !== currentIndex,
          }"
        >
          <!--          Decorative Background Elements-->
          <div class="absolute inset-0 hidden md:block">
            <div class="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
            <div
              class="absolute top-10 right-10 w-20 h-20 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-2xl"
            />
            <div
              class="absolute bottom-10 left-10 w-24 h-24 lg:w-40 lg:h-40 bg-brand-400/20 rounded-full blur-3xl"
            />
          </div>

          <!-- Slide Content -->
          <div
            class="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center"
          >
            <!-- Icon -->
            <UIcon
              :name="slide.icon"
              class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 text-brand-500 dark:text-brand-400 mb-4 sm:mb-5 lg:mb-8"
            />

            <!-- Title -->
            <h3
              class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4"
            >
              {{ slide.title }}
            </h3>

            <!-- Description -->
            <p
              class="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700 dark:text-gray-200 max-w-[90%] sm:max-w-md lg:max-w-lg"
            >
              {{ slide.description }}
            </p>

            <!-- Badge -->
            <UBadge
              v-if="slide.badge"
              :label="slide.badge"
              class="mt-3 sm:mt-4 lg:mt-6"
              color="primary"
              size="lg"
              variant="solid"
            />
          </div>
        </div>
      </div>

      <!-- Navigation Arrows - Hidden on mobile, shown on desktop -->
      <div
        class="hidden md:flex absolute inset-0 items-end justify-end pointer-events-none gap-x-4 p-8"
      >
        <!-- Next Button (Left side in RTL) -->
        <button
          class="pointer-events-auto w-8 h-8 rounded-full bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/75 dark:hover:bg-gray-700 transition-all hover:scale-110 flex items-center justify-center outline-none"
          aria-label="اسلاید قبلی"
          @click="prevSlide"
        >
          <UIcon
            name="i-heroicons-chevron-right"
            class="w-4 h-4 text-gray-700 dark:text-gray-200"
          />
        </button>

        <!-- Previous Button (Right side in RTL) -->
        <button
          class="pointer-events-auto w-8 h-8 rounded-full bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/75 dark:hover:bg-gray-700 transition-all hover:scale-110 flex items-center justify-center outline-none"
          aria-label="اسلاید بعدی"
          @click="nextSlide"
        >
          <UIcon
            name="i-heroicons-chevron-left"
            class="w-4 h-4 text-gray-700 dark:text-gray-200"
          />
        </button>
      </div>

      <!-- Indicators/Dots -->
      <div
        class="absolute bottom-4 md:bottom-[42px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20"
      >
        <button
          v-for="(slide, index) in slides"
          :key="`dot-${slide.id}`"
          class="dot-button outline-none rounded-full transition-all"
          :aria-label="`برو به اسلاید ${index + 1}`"
          @click="goToSlide(index)"
        >
          <span
            class="block rounded-full transition-all"
            :class="
              index === currentIndex
                ? 'bg-white/75 w-5 sm:w-6 lg:w-8 h-1.5 sm:h-2 lg:h-2.5'
                : 'bg-white/40 hover:bg-white/60 w-1.5 sm:w-2 lg:w-2.5 h-1.5 sm:h-2 lg:h-2.5'
            "
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroCarousel',

  data() {
    return {
      currentIndex: 0,
      autoplayInterval: null,
      isPaused: false,
      touchStartX: 0,
      touchEndX: 0,
      touchStartTime: 0,
      autoplayDuration: 8000,

      slides: [
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
      ],
    }
  },

  computed: {
    currentTranslate() {
      return this.currentIndex * 100
    },
  },

  mounted() {
    this.startAutoplay()
    this.setupKeyboardNavigation()
  },

  beforeUnmount() {
    this.stopAutoplay()
    this.removeKeyboardNavigation()
  },

  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length
    },

    prevSlide() {
      this.currentIndex =
        this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1
    },

    goToSlide(index) {
      this.currentIndex = index
    },

    startAutoplay() {
      this.stopAutoplay()

      this.autoplayInterval = setInterval(() => {
        if (!this.isPaused) {
          this.nextSlide()
        }
      }, this.autoplayDuration)
    },

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval)
        this.autoplayInterval = null
      }
    },

    pauseAutoplay() {
      this.isPaused = true
    },

    resumeAutoplay() {
      this.isPaused = false
    },

    handleTouchStart(e) {
      // Only handle actual touch events, not mouse clicks
      if (e.type === 'mousedown') return

      this.touchStartX = e.touches[0].clientX
      this.touchEndX = e.touches[0].clientX
      this.touchStartTime = Date.now() // Track when touch started
      this.pauseAutoplay()
    },

    handleTouchMove(e) {
      // Only handle actual touch events
      if (e.type === 'mousemove' || !e.touches) return

      this.touchEndX = e.touches[0].clientX
    },

    handleTouchEnd(e) {
      // Only handle actual touch events
      if (e.type === 'mouseup' || this.touchStartTime === 0) return

      const swipeThreshold = 50
      const timeThreshold = 300 // Max time for a swipe (ms)
      const diff = this.touchStartX - this.touchEndX
      const swipeTime = Date.now() - this.touchStartTime

      // Only trigger if it's a quick swipe with enough distance
      // In RTL: swipe right (diff < 0) = previous, swipe left (diff > 0) = next
      if (Math.abs(diff) > swipeThreshold && swipeTime < timeThreshold) {
        if (diff > 0) {
          this.prevSlide()
        } else {
          this.nextSlide()
        }
      }

      // Reset
      this.touchStartX = 0
      this.touchEndX = 0
      this.touchStartTime = 0
      this.resumeAutoplay()
    },

    handleKeyboard(e) {
      if (e.key === 'ArrowLeft') {
        this.nextSlide()
      } else if (e.key === 'ArrowRight') {
        this.prevSlide()
      }
    },

    setupKeyboardNavigation() {
      document.addEventListener('keydown', this.handleKeyboard)
    },

    removeKeyboardNavigation() {
      document.removeEventListener('keydown', this.handleKeyboard)
    },
  },
}
</script>

<style scoped>
.transition-transform {
  transition: transform 0.5s ease-in-out;
}

.opacity-0 {
  transition: opacity 0.3s ease-in-out;
}

.opacity-100 {
  transition: opacity 0.3s ease-in-out;
}

button:focus,
button:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
</style>
