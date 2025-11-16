<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-md' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{
              currentStep === 'phone'
                ? 'ورود / ثبت نام'
                : currentStep === 'otp'
                  ? 'تایید شماره موبایل'
                  : 'تکمیل ثبت نام'
            }}
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
        <!-- Step 1: Phone Number Input -->
        <div v-if="currentStep === 'phone'" class="space-y-4">
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              شماره موبایل
            </label>
            <UInput
              v-model="phoneNumber"
              type="tel"
              size="lg"
              placeholder="09xxxxxxxxx"
              maxlength="11"
              dir="ltr"
              :ui="{ rounded: 'rounded-lg' }"
              @keyup.enter="handlePhoneSubmit"
            />
            <p
              v-if="phoneError"
              class="mt-2 text-sm text-red-600 dark:text-red-400"
            >
              {{ phoneError }}
            </p>
          </div>

          <UButton
            block
            size="xl"
            color="primary"
            :loading="loading"
            :disabled="!isValidPhone"
            @click="handlePhoneSubmit"
          >
            ادامه
          </UButton>

          <p class="text-xs text-center text-gray-600 dark:text-gray-400">
            با ادامه، شما
            <a href="#" class="text-teal-600 dark:text-teal-400 hover:underline"
              >قوانین و شرایط</a
            >
            را می‌پذیرید.
          </p>
        </div>

        <!-- Step 2: OTP Input (for existing users) -->
        <div v-else-if="currentStep === 'otp'" class="space-y-4">
          <div
            class="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-center"
          >
            <p class="text-sm text-green-700 dark:text-green-300">
              کد تایید به شماره {{ phoneNumber }} ارسال شد
            </p>
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              کد تایید
            </label>
            <div class="flex gap-2 justify-center" dir="ltr">
              <input
                v-for="(digit, index) in otpDigits"
                :key="index"
                :ref="(el) => (otpInputs[index] = el)"
                v-model="otpDigits[index]"
                type="tel"
                maxlength="1"
                class="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                :class="{
                  'border-gray-300 dark:border-gray-600': !otpError,
                  'border-red-500 dark:border-red-500': otpError,
                }"
                @input="handleOtpInput(index, $event)"
                @keydown="handleOtpKeydown(index, $event)"
                @paste="handleOtpPaste"
              />
            </div>
            <p
              v-if="otpError"
              class="mt-2 text-sm text-center text-red-600 dark:text-red-400"
            >
              {{ otpError }}
            </p>
          </div>

          <div class="text-center">
            <p
              v-if="resendTimer > 0"
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              ارسال مجدد کد تا {{ resendTimer }} ثانیه دیگر
            </p>
            <button
              v-else
              class="text-sm text-teal-600 dark:text-teal-400 hover:underline"
              @click="resendOtp"
            >
              ارسال مجدد کد تایید
            </button>
          </div>

          <UButton
            block
            size="xl"
            color="primary"
            :loading="loading"
            :disabled="!isValidOtp"
            @click="handleOtpSubmit"
          >
            تایید و ورود
          </UButton>

          <button
            class="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            @click="goBack"
          >
            بازگشت و ویرایش شماره
          </button>
        </div>

        <!-- Step 3: Registration Form (for new users) -->
        <div v-else-if="currentStep === 'register'" class="space-y-4">
          <div
            class="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center"
          >
            <p class="text-sm text-blue-700 dark:text-blue-300">
              🎉 خوش آمدید! لطفاً اطلاعات خود را تکمیل کنید
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                نام
              </label>
              <UInput
                v-model="formData.firstName"
                size="lg"
                placeholder="نام"
                :ui="{ rounded: 'rounded-lg' }"
              />
            </div>
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                نام خانوادگی
              </label>
              <UInput
                v-model="formData.lastName"
                size="lg"
                placeholder="نام خانوادگی"
                :ui="{ rounded: 'rounded-lg' }"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              ایمیل (اختیاری)
            </label>
            <UInput
              v-model="formData.email"
              type="email"
              size="lg"
              placeholder="example@email.com"
              dir="ltr"
              :ui="{ rounded: 'rounded-lg' }"
            />
          </div>

          <div class="flex items-start gap-2">
            <input
              id="terms"
              v-model="formData.acceptTerms"
              type="checkbox"
              class="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label
              for="terms"
              class="text-sm text-gray-700 dark:text-gray-300"
            >
              <a
                href="#"
                class="text-teal-600 dark:text-teal-400 hover:underline"
                >قوانین و شرایط</a
              >
              استفاده از سرویس را می‌پذیرم
            </label>
          </div>
          <p
            v-if="registerError"
            class="text-sm text-red-600 dark:text-red-400"
          >
            {{ registerError }}
          </p>

          <UButton
            block
            size="xl"
            color="primary"
            :loading="loading"
            :disabled="!isValidRegistration"
            @click="handleRegistrationSubmit"
          >
            تکمیل ثبت نام
          </UButton>

          <button
            class="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            @click="goBack"
          >
            بازگشت و ویرایش شماره
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
      currentStep: 'phone', // 'phone', 'otp', 'register'
      phoneNumber: '',
      phoneError: '',
      otpDigits: ['', '', '', '', ''],
      otpInputs: [],
      otpError: '',
      registerError: '',
      loading: false,
      isNewUser: false,
      resendTimer: 0,
      resendInterval: null,
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        acceptTerms: false,
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
    isValidPhone() {
      return /^09\d{9}$/.test(this.phoneNumber)
    },
    isValidOtp() {
      return this.otpDigits.every((digit) => digit !== '')
    },
    isValidRegistration() {
      return (
        this.formData.firstName.trim() !== '' &&
        this.formData.lastName.trim() !== '' &&
        this.formData.acceptTerms
      )
    },
    otpCode() {
      return this.otpDigits.join('')
    },
  },
  beforeUnmount() {
    if (this.resendInterval) clearInterval(this.resendInterval)
  },
  methods: {
    closeModal() {
      this.isOpen = false
      this.resetForm()
    },

    resetForm() {
      this.currentStep = 'phone'
      this.phoneNumber = ''
      this.phoneError = ''
      this.otpDigits = ['', '', '', '', '']
      this.otpError = ''
      this.registerError = ''
      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        acceptTerms: false,
      }
      if (this.resendInterval) clearInterval(this.resendInterval)
    },

    async handlePhoneSubmit() {
      this.phoneError = ''

      if (!this.isValidPhone) {
        this.phoneError = 'لطفاً شماره موبایل معتبر وارد کنید (مثال: 09123456789)'
        return
      }

      this.loading = true

      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/auth/send-otp', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ phoneNumber: this.phoneNumber })
        // })
        // const data = await response.json()
        // this.isNewUser = data.isNewUser

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Randomly decide if user is new (in production, this comes from backend)
        this.isNewUser = Math.random() > 0.5

        if (this.isNewUser) {
          // New user - go to registration
          this.currentStep = 'register'
        } else {
          // Existing user - go to OTP
          this.currentStep = 'otp'
          this.startResendTimer()
          this.$nextTick(() => {
            if (this.otpInputs[0]) this.otpInputs[0].focus()
          })
        }
      } catch (error) {
        this.phoneError = 'خطا در ارسال کد. لطفاً دوباره تلاش کنید.'
      } finally {
        this.loading = false
      }
    },

    handleOtpInput(index, event) {
      const value = event.target.value
      if (value && !/^\d$/.test(value)) {
        this.otpDigits[index] = ''
        return
      }
      this.otpDigits[index] = value
      this.otpError = ''
      if (value && index < 4) {
        this.$nextTick(() => {
          if (this.otpInputs[index + 1]) this.otpInputs[index + 1].focus()
        })
      }
      if (this.isValidOtp) this.handleOtpSubmit()
    },

    handleOtpKeydown(index, event) {
      if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
        this.$nextTick(() => {
          if (this.otpInputs[index - 1]) this.otpInputs[index - 1].focus()
        })
      }
    },

    handleOtpPaste(event) {
      event.preventDefault()
      const pastedData = event.clipboardData.getData('text').trim()
      if (/^\d{5}$/.test(pastedData)) {
        this.otpDigits = pastedData.split('')
        this.$nextTick(() => {
          if (this.otpInputs[4]) this.otpInputs[4].focus()
        })
        if (this.isValidOtp) this.handleOtpSubmit()
      }
    },

    async handleOtpSubmit() {
      if (!this.isValidOtp || this.loading) return

      this.loading = true
      this.otpError = ''

      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/auth/verify-otp', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     phoneNumber: this.phoneNumber,
        //     otp: this.otpCode
        //   })
        // })
        // const data = await response.json()

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Set authentication
        const { login } = useAuth()
        login('token')

        const toast = useToast()
        toast.add({
          title: 'با موفقیت وارد شدید',
          icon: 'i-heroicons-check-circle',
          color: 'green',
        })

        this.$emit('authenticated')
        this.closeModal()

        if (this.redirectAfterAuth) {
          navigateTo(this.redirectAfterAuth)
        }
      } catch (error) {
        this.otpError = 'کد تایید نادرست است.'
      } finally {
        this.loading = false
      }
    },

    async handleRegistrationSubmit() {
      this.registerError = ''

      if (!this.isValidRegistration) {
        this.registerError = 'لطفاً تمام فیلدهای الزامی را پر کنید'
        return
      }

      this.loading = true

      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/auth/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     phoneNumber: this.phoneNumber,
        //     firstName: this.formData.firstName,
        //     lastName: this.formData.lastName,
        //     email: this.formData.email
        //   })
        // })
        // const data = await response.json()

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Set authentication
        const { login } = useAuth()
        login('token')

        const toast = useToast()
        toast.add({
          title: 'ثبت نام با موفقیت انجام شد',
          icon: 'i-heroicons-check-circle',
          color: 'green',
        })

        this.$emit('authenticated')
        this.closeModal()

        if (this.redirectAfterAuth) {
          navigateTo(this.redirectAfterAuth)
        }
      } catch (error) {
        this.registerError = 'خطا در ثبت نام. لطفاً دوباره تلاش کنید.'
      } finally {
        this.loading = false
      }
    },

    async resendOtp() {
      this.loading = true
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        this.startResendTimer()
        this.otpDigits = ['', '', '', '', '']
        this.otpError = ''
        this.$nextTick(() => {
          if (this.otpInputs[0]) this.otpInputs[0].focus()
        })
      } finally {
        this.loading = false
      }
    },

    startResendTimer() {
      this.resendTimer = 120
      if (this.resendInterval) clearInterval(this.resendInterval)
      this.resendInterval = setInterval(() => {
        this.resendTimer--
        if (this.resendTimer <= 0) clearInterval(this.resendInterval)
      }, 1000)
    },

    goBack() {
      this.currentStep = 'phone'
      this.otpDigits = ['', '', '', '', '']
      this.otpError = ''
      this.registerError = ''
      if (this.resendInterval) clearInterval(this.resendInterval)
    },
  },
}
</script>

<style scoped>
input[type='tel']::-webkit-outer-spin-button,
input[type='tel']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='tel'] {
  -moz-appearance: textfield;
}
</style>
