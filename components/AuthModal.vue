<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-md' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isLoginMode ? 'ورود به حساب کاربری' : 'ثبت نام' }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            class="-my-1"
            @click="closeModal"
          />
        </div>
      </template>

      <div class="space-y-4">
        <!-- Email/Phone Input -->
        <div>
          <label
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            {{ isLoginMode ? 'ایمیل یا شماره موبایل' : 'شماره موبایل' }}
          </label>
          <UInput
            v-model="formData.email"
            size="lg"
            placeholder="example@email.com یا 09123456789"
            :ui="{ rounded: 'rounded-lg' }"
          />
        </div>

        <!-- Password Input -->
        <div>
          <label
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            رمز عبور
          </label>
          <UInput
            v-model="formData.password"
            type="password"
            size="lg"
            placeholder="رمز عبور خود را وارد کنید"
            :ui="{ rounded: 'rounded-lg' }"
          />
        </div>

        <!-- Name Input (Register only) -->
        <div v-if="!isLoginMode">
          <label
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            نام و نام خانوادگی
          </label>
          <UInput
            v-model="formData.name"
            size="lg"
            placeholder="نام کامل خود را وارد کنید"
            :ui="{ rounded: 'rounded-lg' }"
          />
        </div>

        <!-- Submit Button -->
        <UButton
          block
          size="xl"
          color="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ isLoginMode ? 'ورود' : 'ثبت نام' }}
        </UButton>

        <!-- Toggle Mode -->
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          {{
            isLoginMode
              ? 'حساب کاربری ندارید؟'
              : 'قبلاً ثبت نام کرده‌اید؟'
          }}
          <button
            class="text-teal-600 dark:text-teal-400 font-semibold hover:underline mr-1"
            @click="toggleMode"
          >
            {{ isLoginMode ? 'ثبت نام' : 'ورود' }}
          </button>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script>
export default {
  name: 'AuthModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    redirectAfterAuth: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue', 'authenticated'],
  data() {
    return {
      isLoginMode: true,
      loading: false,
      formData: {
        email: '',
        password: '',
        name: '',
      },
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
  methods: {
    toggleMode() {
      this.isLoginMode = !this.isLoginMode
      this.formData = {
        email: '',
        password: '',
        name: '',
      }
    },

    closeModal() {
      this.isOpen = false
      this.formData = {
        email: '',
        password: '',
        name: '',
      }
      this.isLoginMode = true
    },

    async handleSubmit() {
      // Validate inputs
      if (!this.formData.email || !this.formData.password) {
        const toast = useToast()
        toast.add({
          title: 'لطفاً تمام فیلدها را پر کنید',
          icon: 'i-heroicons-exclamation-triangle',
          color: 'red',
        })
        return
      }

      if (!this.isLoginMode && !this.formData.name) {
        const toast = useToast()
        toast.add({
          title: 'لطفاً نام خود را وارد کنید',
          icon: 'i-heroicons-exclamation-triangle',
          color: 'red',
        })
        return
      }

      this.loading = true

      // Simulate API call
      setTimeout(() => {
        const { login } = useAuth()

        // Set authentication token
        login('token')

        this.loading = false

        const toast = useToast()
        toast.add({
          title: this.isLoginMode
            ? 'با موفقیت وارد شدید'
            : 'ثبت نام با موفقیت انجام شد',
          icon: 'i-heroicons-check-circle',
          color: 'green',
        })

        this.$emit('authenticated')
        this.closeModal()

        // Redirect if specified
        if (this.redirectAfterAuth) {
          navigateTo(this.redirectAfterAuth)
        }
      }, 1000)
    },
  },
}
</script>
