<template>
  <section class="py-16 lg:py-24">
    <div class="flex gap-12 lg:gap-16 content-start flex-wrap md:flex-nowrap">
      <!-- Image/Illustration -->
      <div
          class="aspect-square w-full rounded-3xl bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300 dark:from-brand-900 dark:to-brand-800 flex items-center justify-center relative overflow-hidden shadow-2xl">
        <!-- Decorative elements -->
        <div class="absolute inset-0 bg-white/5 backdrop-blur-3xl"/>
        <div class="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
        <div class="absolute bottom-10 left-10 w-40 h-40 bg-brand-400/20 rounded-full blur-3xl"/>

        <!-- Icon -->
        <UIcon class="w-48 h-48 text-brand-500 opacity-30 relative z-10" name="i-heroicons-building-storefront"/>
      </div>

      <!-- Text Content -->
      <div class="space-y-8 w-full">
        <!-- AI Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/50 text-sm">
          <UIcon class="text-brand-800 dark:text-white w-5 h-5" name="i-heroicons-sparkles"/>
          <span class="text-brand-800 dark:text-white font-medium">دستیار هوشمند آنلاین</span>
        </div>

        <!-- Main Heading -->
        <div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 dark:text-white leading-tight">
            سلامتی شما،
            <span class="text-brand-500 block mt-2">در درب منزل</span>
          </h1>
        </div>

        <!-- Description -->
        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
          دارو و محصولات بهداشتی خود را با تحویل ایمن در منزل دریافت کنید. داروسازان مجرب ۲۴/۷ با پشتیبانی هوش مصنوعی در
          خدمت شما هستند.
        </p>

        <!-- Large ChatGPT-style Search Input -->
        <div class="relative">
          <textarea
              v-model="searchQuery"
              class="w-full px-6 py-5 pe-16 text-sm md:text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none resize-none transition-all shadow-lg hover:shadow-xl"
              placeholder="نام دارو یا محصول مورد نظر خود را جستجو کنید..."
              rows="1"
              style="min-height: 80px; max-height: 200px;"
              @input="autoResize"
              @keydown.enter.prevent="handleSearch"
          />
          <button
              :class="{ '!bg-brand-100 !cursor-not-allowed' : !searchQuery.trim() }"
              :disabled="!searchQuery.trim()"
              class="w-12 h-12 absolute  left-4 bottom-4 p-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors shadow-md hover:shadow-lg"
              @click="handleSearch"
          >
            <UIcon class="w-6 h-6" name="i-heroicons-magnifying-glass"/>
          </button>
        </div>

        <!-- Features List -->
        <div class="flex flex-wrap gap-6 text-base">
          <div class="flex items-center gap-2">
            <UIcon class="text-brand-500 w-6 h-6" name="i-heroicons-check-circle"/>
            <span class="font-medium">تایید سازمان غذا و دارو</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon class="text-brand-500 w-6 h-6" name="i-heroicons-check-circle"/>
            <span class="font-medium">پشتیبانی ۲۴ ساعته</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon class="text-brand-500 w-6 h-6" name="i-heroicons-check-circle"/>
            <span class="font-medium">ارسال رایگان</span>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
          <UButton
              class="justify-center"
              color="primary"
              icon="i-heroicons-shopping-bag"
              size="xl"
              to="/medications"
          >
            مشاهده داروها
          </UButton>
          <UButton
              class="justify-center"
              color="white"
              icon="i-heroicons-chat-bubble-left-right"
              size="xl"
              variant="outline"
              @click="openChat"
          >
            گفتگو با دستیار هوشمند
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {useChatStore} from '~/stores/chat'

export default {
  name: 'HeroSection',

  data() {
    return {
      searchQuery: ''
    }
  },

  methods: {
    openChat() {
      const chatStore = useChatStore()
      chatStore.toggleChat()
    },

    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push(`/medications?search=${encodeURIComponent(this.searchQuery)}`)
      }
    },

    autoResize(event) {
      const textarea = event.target
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
    }
  }
}
</script>
