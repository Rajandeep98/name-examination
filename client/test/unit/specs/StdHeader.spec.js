import Vue from 'vue'
import router from '@/router'
import StdHeader from '@/components/application/sections/StdHeader'
import { sleep } from '@/utils/sleep'

var messageSentToStore
var valueSent

describe('StdHeader.vue', () => {
  let instance
  let vm
  let store

  let mount = () => {
    sessionStorage.setItem('AUTHORIZED', true)
    const Constructor = Vue.extend(StdHeader)
    instance = new Constructor({ store, router })
    let app = document.createElement('DIV')
    app.id = 'app'
    document.body.innerHTML = ''
    document.body.appendChild(app)
    return instance.$mount(document.getElementById('app'))
  }

  let click = (id) => {
    let button = vm.$el.querySelector(id)
    let window = button.ownerDocument.defaultView
    var click = new window.Event('click')
    button.dispatchEvent(click)
  }

  // FUTURE: fix
  xit('displays user id', () => {
    store = {
      getters: {
        isAuthenticated: true,
        userHasEditRole: true,
        userHasApproverRole: true,
        userId: 'max',
      },
    }
    vm = mount()
    let value = vm.$el.querySelector('#userid').innerHTML

    expect(value).toEqual('max')
  })

  describe('Navigation menu when logged in', () => {
    beforeEach(() => {
      store = {
        getters: {
          isAuthenticated: true,
          userHasApproverRole: true,
          userHasEditRole: true,
        },
      }
      vm = mount()
    })

    // FUTURE: fix
    xit('offers a link to /home from logo', async () => {
      click('#namex-logo-home-link')
      await sleep(300)

      expect(window.location.pathname).toEqual('/home')
    })

    // FUTURE: fix
    xit('offers a link to /nameExamination', async () => {
      //vuetify does not offer a way to assign an ID to the link ( <a> tag )  in its tab
      //component in the markup, but it is the first and only child of the element which gets the
      //id
      vm.$el.querySelector('#nameExamine').firstChild.setAttribute('id', 'nameExaminationhref')
      click('#nameExaminationhref')
      await sleep(300)

      expect(window.location.pathname).toEqual('/nameExamination')
    })

    // FUTURE: fix
    xit('offers a link to /find', async () => {
      vm.$el.querySelector('#header-search-link',).firstChild.setAttribute('id', 'namexSearchLink')
      click('#namexSearchLink')
      await sleep(300)

      expect(window.location.pathname).toEqual('/find')
    })

    // FUTURE: fix
    xit('offers a link to sign out', () => {
      expect(vm.$el.querySelector('#header-logout-button')).not.toEqual(null)
    })

    // FUTURE: fix
    xit('does not offer a link to sign in', () => {
      expect(vm.$el.querySelector('#header-login-button')).toEqual(null)
    })
  })

  describe('Navigation menu when logged in as editor or viewer', () => {
    // FUTURE: fix
    xit('does not offer a link to /nameExamination for editors', () => {
      store = {
        getters: {
          isAuthenticated: true,
          userHasApproverRole: false,
          userHasEditRole: true,
        },
      }
      vm = mount()
      expect(vm.$el.querySelector('#nameExamine')).toEqual(null)
    })

    // FUTURE: fix
    xit('does not offer a link to /nameExamination for viewers', () => {
      store = {
        getters: {
          isAuthenticated: true,
          userHasApproverRole: false,
          userHasEditRole: false,
        },
      }
      vm = mount()
      expect(vm.$el.querySelector('#nameExamine')).toEqual(null)
    })
  })

  describe('Navigation menu when not logged in', () => {
    beforeEach(() => {
      store = {
        getters: {},
      }
      vm = mount()
    })

    it('does not offer a link to /nameExamination', () => {
      expect(vm.$el.querySelector('#nameExamine')).toEqual(null)
    })

    it('does not offer a link to /find', () => {
      expect(vm.$el.querySelector('#header-search-link')).toEqual(null)
    })

    it('does not offer a link to sign out', () => {
      expect(vm.$el.querySelector('#header-logout-button')).toEqual(null)
    })

    it('offers a link to sign-in', async () => {
      click('#header-login-button')
      await sleep(300)

      expect(window.location.pathname).toEqual('/signin')
    })
  })

  describe('onSubmit', () => {
    let submit = () => {
      click('#header-search-button')
    }

    beforeEach(() => {
      store = {
        state: {
          compInfo: {
            nrNumber: 'NR 44475'
          }
        },
        getters: {
          isAuthenticated: true,
          userHasApproverRole: true,
          userHasEditRole: true,
          userId: 'max',
          adminURL: 'wherever',
        },
        dispatch: function (message, value) {
          messageSentToStore = message
          valueSent = value
        },
      }
      messageSentToStore = ''
      valueSent = ''
      vm = mount()
    })

    it('resists trailing spaces on NR', () => {
      vm.nrNum = 'NR 1234 '
      vm.submit()

      expect(valueSent.search).toEqual('NR 1234')
    })

    it('adds missing prefix', () => {
      vm.nrNum = '1234'
      vm.submit()

      expect(valueSent.search).toEqual('NR 1234')
    })

    it('detaches prefix', () => {
      vm.nrNum = 'NR1234'
      vm.submit()

      expect(valueSent.search).toEqual('NR 1234')
    })

    it('does nothing when value is empty', () => {
      vm.nrNum = ''
      vm.submit()

      expect(valueSent).toEqual('')
    })
  })

  describe('logout', () => {
    let logout = () => {
      click('#header-logout-button')
    }

    let assigned
    let oldHandler

    beforeEach(() => {
      store = {
        getters: {
          isAuthenticated: true,
          userHasApproverRole: true,
          userHasEditRole: true,
        },
        dispatch: function (message, value) {
          messageSentToStore = message
          valueSent = value
        },
      }
      messageSentToStore = ''
      valueSent = ''
      vm = mount()
      oldHandler = window.location.assign
      window.location.assign = function (value) {
        assigned = value
      }
      logout()
    })

    afterEach(() => {
      window.location.assign = oldHandler
    })

    // FUTURE: fix
    xit('is delegated to the store', () => {
      expect(messageSentToStore).toEqual('logout')
    })

    // FUTURE: fix
    xit('resets location', () => {
      expect(assigned).toEqual('/')
    })

    // FUTURE: fix
    xit('offers a login link when not authenticated', () => {
      store = {
        getters: {
          isAuthenticated: false,
        },
        dispatch: function (message, value) {
          messageSentToStore = message
          valueSent = value
        },
      }
      vm = mount()

      expect(vm.$el.querySelector('#header-login-button')).not.toEqual(null)
    })
  })
})
