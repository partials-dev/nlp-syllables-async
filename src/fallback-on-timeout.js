
// func is an asynchronous function; fallback
// is synchronous.
//
// fallbackOnTimeout will call func, then wait for
// the specified waitTime. If we haven't heard back
// from func after the waitTime has elapsed, we
// call fallback and return its result.
export default function fallbackOnTimeout (func, fallback, waitTime = 5000) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      const result = fallback()
      resolve(result)
    }, waitTime)

    func().then(result => {
      clearTimeout(timeoutId)
      resolve(result)
    })
  })
}
