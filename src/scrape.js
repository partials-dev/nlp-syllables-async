'use babel'

import originalScrape from 'scrape-url'

export default function scrape (...args) {
  return new Promise((resolve, reject) => {
    originalScrape(...args, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}
