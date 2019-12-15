const ENV = process.env.NODE_ENV
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './dist/**/*.html',
  ],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
  whitelistPatterns: [
    /^(?!.*u\-).+$/
  ]
})

module.exports = ctx => ({
  map: ENV === 'production' ? false : ctx.options.map,
  plugins: [
    require('postcss-import')({
      path: 'src/css'
    }),
    require('tailwindcss'),
    require('postcss-preset-env')({
      autoprefixer: {
        grid: 'autoplace'
      },
      features: {
        'color-mod-function': true
      },
      stage: 0
    }),
    require('postcss-easings')({
      easings: {}
    }),
    ...ENV === 'production' ? [
      purgecss,
      require('csswring')
    ] : []
  ]
})
