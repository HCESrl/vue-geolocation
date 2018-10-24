const VueGeolocation = {
  // implements PositionError interface, giving error code and message for "POSITION UNAVAIBLE" error
  forceRejectErrorObject: {
    code: 2,
    message: 'Reject forced for testing purposes'
  },
  // implements PositionError interface, giving error code 0 (custom) and message for no browser support
  noSupportErrorObject: {
    code: 0,
    message: 'No browser support'
  },
  install (Vue) {
    // define the main instance function
    Vue.prototype.$getLocation = VueGeolocation.getLocation
    Vue.prototype.$watchLocation = VueGeolocation.watchLocation
    Vue.prototype.$clearLocationWatch = VueGeolocation.clearLocation
  },
  getLocation (options = {}, forceReject = false) {
    return new Promise((resolve, reject) => {
      if(forceReject) {
        reject(VueGeolocation.forceRejectErrorObject)
        return
      }
      if (!VueGeolocation._isAvailable()) {
        reject(VueGeolocation.noSupportErrorObject)
      } else {
        window.navigator.geolocation.getCurrentPosition(
          position => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              accuracy: position.coords.accuracy
            })
          },
          (err) => {
            console.log(err.toString())
            reject(err)
          },
          options
        )
      }
    })
  },
  watchLocation (options = {}, forceReject = false) {
    return new Promise((resolve, reject) => {
      if(forceReject) {
        reject(VueGeolocation.forceRejectErrorObject)
        return
      }
      if (!VueGeolocation._isAvailable()) {
        reject(VueGeolocation.noSupportErrorObject)
      } else {
        window.navigator.geolocation.watchPosition(
          position => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              accuracy: position.coords.accuracy,
              heading: position.coords.heading,
              speed: position.coords.speed
            })
          },
          (err) => {
            reject(err)
          },
          options
        )
      }
    })
  },
  clearLocation (watchID) {
    return new Promise((resolve, reject) => {
      if (!VueGeolocation._isAvailable()) {
        reject(VueGeolocation.noSupportErrorObject)
      }
      else if (!watchID) {
        // @todo decide which error object to return
        reject({code: 0, message: 'please provide watchID'})
      } else {
        resolve(window.navigator.geolocation.clearWatch(watchID))
      }
    })
  },
  _isAvailable () {
    return 'geolocation' in window.navigator
  }
}

export default VueGeolocation

// in-browser load
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueGeolocation)
}
