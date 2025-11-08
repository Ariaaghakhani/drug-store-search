<template>
  <section class="py-12">
    <div class="relative">
      <!-- Previous Button - Hidden on mobile -->
      <div
          v-show="canScrollPrev"
          class="absolute start-0 top-1/2 -translate-y-1/2 z-20 -me-4 hidden md:block"
      >
        <button
            type="button"
            class="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            @click.prevent="scrollToPrev"
        >
          <UIcon name="i-heroicons-chevron-right-20-solid" class="w-6 h-6" />
        </button>
      </div>

      <!-- Next Button - Hidden on mobile -->
      <div
          v-show="canScrollNext"
          class="absolute end-0 top-1/2 -translate-y-1/2 z-20 -ms-4 hidden md:block"
      >
        <button
            type="button"
            class="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            @click.prevent="scrollToNext"
        >
          <UIcon name="i-heroicons-chevron-left-20-solid" class="w-6 h-6" />
        </button>
      </div>

      <!-- Carousel Container -->
      <div class="overflow-hidden px-2 md:px-6">
        <div
            ref="carousel"
            class="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth hide-scrollbar snap-x snap-mandatory"
            @scroll="onScroll"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
        >
          <!-- Category Cards -->
          <div
              v-for="category in categories"
              :key="category.id"
              class="flex-shrink-0 w-20 sm:w-24 md:w-32 snap-start"
          >
            <button
                type="button"
                class="w-full p-3 md:p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all group"
                :class="selectedCategory?.id === category.id
                ? 'bg-brand-50 dark:bg-brand-900/20'
                : 'dark:border-gray-700'"
                @click="selectCategory(category)"
            >
              <div class="flex flex-col items-center gap-2 md:gap-3">
                <!-- Icon -->
                <div
                    class="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-colors"
                    :class="selectedCategory?.id === category.id
                    ? 'bg-brand-500'
                    : 'bg-brand-100 dark:bg-brand-900/30 group-hover:bg-brand-200'"
                >
                  <UIcon
                      :name="category.icon"
                      class="w-6 h-6 md:w-7 md:h-7"
                      :class="selectedCategory?.id === category.id
                      ? 'text-white'
                      : 'text-brand-600 dark:text-brand-400'"
                  />
                </div>
                <!-- Text -->
                <div
                    class="text-xs md:text-sm font-medium text-center leading-tight"
                    :class="selectedCategory?.id === category.id
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-700 dark:text-gray-300'"
                >
                  {{ category.name }}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Dots -->
      <div v-if="totalPages > 1" class="absolute start-1/2 translate-x-1/2 flex justify-center gap-2 mt-6">
        <button
            v-for="n in totalPages"
            :key="n"
            type="button"
            class="h-2 rounded-full transition-all"
            :class="currentPage === n - 1 ? 'w-8 bg-brand-500' : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'"
            @click="scrollToPage(n - 1)"
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CategoriesCarousel',

  data() {
    return {
      selectedCategory: null,
      canScrollPrev: false,
      canScrollNext: false,
      currentPage: 0,
      totalPages: 1,
      touchStartX: 0,
      touchEndX: 0,
      categories: [
        { id: 1, name: 'مسکن و ضد درد', icon: 'i-heroicons-heart-20-solid', slug: 'pain-relief' },
        { id: 2, name: 'ویتامین و مکمل', icon: 'i-heroicons-beaker-20-solid', slug: 'vitamins' },
        { id: 3, name: 'قلب و عروق', icon: 'i-heroicons-heart-20-solid', slug: 'cardiovascular' },
        { id: 4, name: 'گوارش', icon: 'i-heroicons-sparkles-20-solid', slug: 'digestive' },
        { id: 5, name: 'پوست و مو', icon: 'i-heroicons-user-20-solid', slug: 'skin-hair' },
        { id: 6, name: 'اعصاب و روان', icon: 'i-heroicons-academic-cap-20-solid', slug: 'mental-health' },
        { id: 7, name: 'تنفسی', icon: 'i-heroicons-cloud-20-solid', slug: 'respiratory' },
        { id: 8, name: 'کودکان', icon: 'i-heroicons-face-smile-20-solid', slug: 'children' },
        { id: 9, name: 'زنان', icon: 'i-heroicons-user-circle-20-solid', slug: 'women' },
        { id: 10, name: 'دیابت', icon: 'i-heroicons-beaker-20-solid', slug: 'diabetes' },
        { id: 11, name: 'آنتی بیوتیک', icon: 'i-heroicons-shield-check-20-solid', slug: 'antibiotics' },
        { id: 12, name: 'چشم و بینایی', icon: 'i-heroicons-eye-20-solid', slug: 'eye-care' }
      ]
    }
  },

  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.calculatePages()
        this.updateScrollButtons()
      }, 200)
    })

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize)
    }
  },

  beforeUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize)
    }
  },

  methods: {
    scrollToPrev() {
      const carousel = this.$refs.carousel
      if (!carousel) return

      const scrollAmount = carousel.clientWidth * 0.8
      carousel.scrollLeft += scrollAmount // In RTL, + goes back
    },

    scrollToNext() {
      const carousel = this.$refs.carousel
      if (!carousel) return

      const scrollAmount = carousel.clientWidth * 0.8
      carousel.scrollLeft -= scrollAmount // In RTL, - goes forward
    },

    scrollToPage(pageIndex) {
      const carousel = this.$refs.carousel
      if (!carousel) return

      const pageWidth = carousel.clientWidth
      // In RTL: page 0 = 0, page 1 = -pageWidth, page 2 = -2*pageWidth
      carousel.scrollLeft = -pageIndex * pageWidth
    },

    onScroll() {
      this.updateScrollButtons()
      this.updateCurrentPage()
    },

    updateScrollButtons() {
      const carousel = this.$refs.carousel
      if (!carousel) return

      // Get scroll metrics
      const scrollLeft = carousel.scrollLeft
      const scrollWidth = carousel.scrollWidth
      const clientWidth = carousel.clientWidth

      // In RTL, scrollLeft can be 0 or negative
      // At start (rightmost): scrollLeft is close to 0
      // At end (leftmost): scrollLeft is most negative

      const maxScrollLeft = -(scrollWidth - clientWidth)

      this.canScrollPrev = scrollLeft < -10 // Can go back if we've scrolled forward
      this.canScrollNext = scrollLeft > maxScrollLeft + 10 // Can go forward if not at end
    },

    updateCurrentPage() {
      const carousel = this.$refs.carousel
      if (!carousel || this.totalPages <= 1) return

      const scrollLeft = carousel.scrollLeft
      const pageWidth = carousel.clientWidth

      // Calculate current page from scroll position
      // In RTL: scrollLeft = 0 is page 0, scrollLeft = -pageWidth is page 1
      const calculatedPage = Math.round(Math.abs(scrollLeft) / pageWidth)
      this.currentPage = Math.max(0, Math.min(calculatedPage, this.totalPages - 1))
    },

    calculatePages() {
      const carousel = this.$refs.carousel
      if (!carousel) return

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      const itemWidth = isMobile ? 112 : 144 // w-28 or w-36
      const gap = isMobile ? 12 : 16 // gap-3 or gap-4
      const fullItemWidth = itemWidth + gap

      const containerWidth = carousel.clientWidth
      const visibleItems = Math.floor(containerWidth / fullItemWidth)

      if (visibleItems >= this.categories.length) {
        this.totalPages = 1
      } else {
        this.totalPages = Math.ceil(this.categories.length / Math.max(1, visibleItems))
      }
    },

    handleResize() {
      this.calculatePages()
      this.updateScrollButtons()
      this.updateCurrentPage()
    },

    selectCategory(category) {
      this.selectedCategory = category
      this.$router.push(`/medications?category=${category.slug}`)
    },

    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX
    },

    handleTouchMove(event) {
      this.touchEndX = event.touches[0].clientX
    },

    handleTouchEnd() {
      const swipeDistance = this.touchStartX - this.touchEndX
      const minSwipeDistance = 50

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swiped left - scroll forward (next)
          this.scrollToNext()
        } else {
          // Swiped right - scroll back (prev)
          this.scrollToPrev()
        }
      }

      this.touchStartX = 0
      this.touchEndX = 0
    }
  }
}
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
