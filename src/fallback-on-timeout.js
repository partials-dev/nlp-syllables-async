// func is an asynchronous function; fallback
// is synchronous.
//
// fallbackOnTimeout will call func, then wait for
// the specified waitTime. If we haven't heard back
// from func after the waitTime has elapsed, we
// call fallback and return its result.
export default function fallbackOnTimeout (func, fallback, waitTime) {
  const prom = new Promise((resolve, reject) => {
    try {
      const useFallback = () => {
        const result = fallback()
        resolve(result)
      }
      const timeoutId = setTimeout(useFallback, waitTime)

      func().then(result => {
        clearTimeout(timeoutId)
        resolve(result)
      })
    } catch (e) {
      reject(e)
    }
  })
  return prom
}
