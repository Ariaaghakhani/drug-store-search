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
[dir='rtl'] .nuxt-loading-indicator {
  transform-origin: right !important;
}
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
