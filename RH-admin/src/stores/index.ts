import { defineStore } from 'pinia';

export default defineStore('app', {
  state: () => {
    return {
      collapsedFlag: false,
      isMobile: false
    }
  },
  actions: {
    setCollapsedFlag (data: boolean) {
      this.collapsedFlag = data
    },
    setIsMobile () {
      const rect = document.body.getBoundingClientRect();
      this.isMobile = (/Mobi|Android|iPhone/i.test(navigator.userAgent) || rect.width - 1 < 992)
    }
  }
})
