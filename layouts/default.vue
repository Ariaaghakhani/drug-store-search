<template>
  <div dir="rtl" class="font-dana">
    <Header />
    <main class="min-h-screen">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style>
[dir="rtl"] .nuxt-loading-indicator {
  transform-origin: right !important;
}
</style>
