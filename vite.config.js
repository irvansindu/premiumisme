import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        store: resolve(__dirname, 'store.html'),
        product: resolve(__dirname, 'product.html'),
        faq: resolve(__dirname, 'faq.html'),
        warranty: resolve(__dirname, 'warranty.html'),
        order: resolve(__dirname, 'order.html'),
        reseller: resolve(__dirname, 'reseller.html'),
        transaction: resolve(__dirname, 'transaction.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
