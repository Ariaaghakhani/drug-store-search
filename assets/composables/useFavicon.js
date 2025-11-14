export const useFavicon = () => {
  useHead({
    link: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: computed(() => {
          const svg =
            '<svg data-v-a81738bd="" width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle data-v-a81738bd="" cx="16" cy="16" r="16" fill="#2C7A7B"></circle><circle data-v-a81738bd="" cx="16" cy="16" r="8" fill="white"></circle></svg>'
          return `data:image/svg+xml,${encodeURIComponent(svg)}`
        }),
      },
    ],
  })
}
