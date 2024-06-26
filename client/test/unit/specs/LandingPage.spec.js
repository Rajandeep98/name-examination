import Vue from 'vue'
import LandingPage from '@/components/LandingPage'
import store from '@/store'

describe('LandingPage.vue', () => {
  it('renders warning message when not connected', () => {
    const Constructor = Vue.extend(LandingPage)
    const vm = new Constructor({ store }).$mount()
    expect(vm.$el.textContent).toContain('Your authorization is missing or has expired. Please login.')
  })
})
