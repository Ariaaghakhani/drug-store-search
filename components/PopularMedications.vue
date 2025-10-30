<template>
  <section class="py-16 bg-gray-50 dark:bg-gray-900/50 rounded-3xl px-6 lg:px-12">
    <!-- Section Header -->
    <div class="text-center mb-12">
      <h2 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">
        داروهای <span class="text-brand-500">پرتکرار</span>
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mt-3 text-lg max-w-3xl mx-auto">
        داروهای معتبر تجویز شده توسط متخصصان بهداشت و درمان در سراسر جهان
      </p>
    </div>

    <!-- Categories Filter -->
    <div class="flex flex-wrap gap-3 justify-center mb-10">
      <UButton
        v-for="category in categories"
        :key="category.value"
        :color="selectedCategory === category.value ? 'primary' : 'white'"
        :variant="selectedCategory === category.value ? 'solid' : 'outline'"
        size="lg"
        @click="selectedCategory = category.value"
      >
        {{ category.label }}
      </UButton>
    </div>

    <!-- Medications Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
      <UCard
        v-for="med in filteredMedications"
        :key="med.id"
        class="hover:shadow-lg transition-all cursor-pointer hover:scale-105 duration-200"
        @click="handleMedicationClick(med)"
      >
        <div class="flex items-center gap-4">
          <!-- Icon/Image -->
          <div class="w-16 h-16 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
            <UIcon :name="med.icon" class="w-8 h-8 text-brand-500" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-900 dark:text-white truncate text-base">
              {{ med.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
              {{ med.description }}
            </p>
          </div>

          <!-- Arrow -->
          <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 text-gray-400 flex-shrink-0" />
        </div>
      </UCard>
    </div>

    <!-- Learn More Button -->
    <div class="text-center mt-12">
      <UButton
        color="primary"
        variant="outline"
        size="xl"
        icon="i-heroicons-information-circle"
        to="/medications"
      >
        مشاهده همه داروها
      </UButton>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Medication {
  id: string
  name: string
  description: string
  category: string
  icon: string
}

export default defineComponent({
  name: 'PopularMedications',

  data() {
    return {
      selectedCategory: 'all',
      categories: [
        { label: 'همه', value: 'all' },
        { label: 'مسکن‌ها', value: 'pain' },
        { label: 'آنتی‌بیوتیک', value: 'antibiotics' },
        { label: 'ویتامین‌ها', value: 'vitamins' },
        { label: 'سلامت قلب', value: 'heart' },
        { label: 'دیابت', value: 'diabetes' }
      ],
      medications: [
        {
          id: '1',
          name: 'استامینوفن ۵۰۰ میلی‌گرم',
          description: 'مسکن و تب‌بر',
          category: 'pain',
          icon: 'i-heroicons-heart'
        },
        {
          id: '2',
          name: 'آموکسی‌سیلین ۵۰۰ میلی‌گرم',
          description: 'آنتی‌بیوتیک برای عفونت‌های باکتریایی',
          category: 'antibiotics',
          icon: 'i-heroicons-shield-check'
        },
        {
          id: '3',
          name: 'ویتامین C مقدار ۱۰۰۰ میلی‌گرم',
          description: 'تقویت سیستم ایمنی',
          category: 'vitamins',
          icon: 'i-heroicons-sun'
        },
        {
          id: '4',
          name: 'لیزینوپریل ۱۰ میلی‌گرم',
          description: 'داروی فشار خون',
          category: 'heart',
          icon: 'i-heroicons-heart'
        },
        {
          id: '5',
          name: 'متفورمین ۵۰۰ میلی‌گرم',
          description: 'مدیریت دیابت نوع ۲',
          category: 'diabetes',
          icon: 'i-heroicons-beaker'
        },
        {
          id: '6',
          name: 'آسپرین ۸۱ میلی‌گرم',
          description: 'دوز پایین برای سلامت قلب',
          category: 'heart',
          icon: 'i-heroicons-heart'
        },
        {
          id: '7',
          name: 'سیتریزین ۱۰ میلی‌گرم',
          description: 'ضد حساسیت و آلرژی',
          category: 'allergies',
          icon: 'i-heroicons-sparkles'
        },
        {
          id: '8',
          name: 'امپرازول ۲۰ میلی‌گرم',
          description: 'درمان اسید معده',
          category: 'digestive',
          icon: 'i-heroicons-beaker'
        }
      ] as Medication[]
    }
  },

  computed: {
    filteredMedications(): Medication[] {
      if (this.selectedCategory === 'all') {
        return this.medications
      }
      return this.medications.filter(med => med.category === this.selectedCategory)
    }
  },

  methods: {
    handleMedicationClick(medication: Medication) {
      this.$router.push(`/medications/${medication.id}`)
    }
  }
})
</script>
