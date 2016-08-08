# nlp-syllables-async
A [plugin](https://github.com/nlp-compromise/nlp_compromise/wiki/Plugins) for [nlp_compromise](https://github.com/nlp-compromise/nlp_compromise) that splits words into syllables.

# Features
- Asynchronous: pulls high quality syllable data from the network.
- Cached: avoids making duplicate network requests.
- Promise-based: more fun.
- Uses time-outs: if querying the network takes too long, guesses the syllables using `nlp-syllables`.

# Installation and Usage

Install with `$ npm install nlp-syllables-async`

then

```javascript
import nlp from 'nlp_compromise'
import syllables from 'nlp-syllables-async'
nlp.plugin(syllables)

nlp.termWithSyllables('simplicity').then(term => {
  const syllables = JSON.stringify(term.syllables)
  console.log(syllables)
  // output: ['sim', 'plic', 'i', 'ty']
})

nlp.text('simple is different from easy').termsWithSyllables().then(terms => {
  const allSyllables = terms.map(t => t.syllables)
  console.log(JSON.stringify(allSyllables))
  // output:
  // [
  //  ['sim', 'ple'],
  //  ['is'],
  //  ['dif', 'fer', 'ent'],
  //  ['from'],
  //  ['eas', 'y']
  // ]
})

nlp.term('indeterminacy').getSyllablesAsync().then(syllables => {
  console.log(syllables)
  // output:
  // [
  //  'in',
  //  'de',
  //  'ter',
  //  'mi',
  //  'na',
  //  'cy'
  // ]
})
```
