<template>
  <div>
    <!-- Hero Section - Full Width Background -->
    <div
      class="bg-gradient-to-b from-brand-50 to-white dark:from-brand-950 dark:to-gray-900"
    >
      <UContainer>
        <HeroSection />
      </UContainer>
    </div>

    <UContainer>
      <CategoriesCarousel />
    </UContainer>

    <!-- Stats Section - Contained -->
    <UContainer>
      <StatsSection />
    </UContainer>

    <!-- Featured Products - Contained -->
    <UContainer>
      <FeaturedProducts />
    </UContainer>

    <!-- Popular Medications - Full Width Background -->
    <div class="bg-gray-50 dark:bg-gray-900 py-16">
      <UContainer>
        <PopularMedications />
      </UContainer>
    </div>

    <!-- Chatbot Widget - Fixed Position -->
    <ChatbotWidget />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',

  head() {
    return {
      title: 'داروخانه آنلاین | سلامتی در درب منزل',
      meta: [
        {
          name: 'description',
          content:
            'دارو و محصولات بهداشتی خود را با تحویل ایمن در منزل دریافت کنید. داروسازان مجرب ۲۴/۷ در خدمت شما',
        },
        {
          property: 'og:title',
          content: 'داروخانه آنلاین | سلامتی در درب منزل',
        },
        {
          property: 'og:description',
          content:
            'دارو و محصولات بهداشتی خود را با تحویل ایمن در منزل دریافت کنید',
        },
      ],
    }
  },
})
</script>
