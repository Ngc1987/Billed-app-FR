export const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return JSON.stringify(store[key])
    },
    setItem: function(key, value) {
      store[key] = value.toString()
    },
    clear: function() {
      store = {}
    },
    removeItem: function(key) {
      delete store[key]
    }
  }
})()

export function setLocalStorage (user) {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({ type: user, email: 'test@email.com' }))
}