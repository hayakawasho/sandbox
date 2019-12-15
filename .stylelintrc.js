const css = {
  properties: 'src/css/base/custom-properties.css',
  media: 'src/css/base/custom-media.css'
}

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: [
    'stylelint-value-no-unknown-custom-properties',
    'stylelint-media-use-custom-media',
    'stylelint-use-nesting'
  ],
  rules: {
    'no-descending-specificity': null,
    'declaration-colon-newline-after': 'always-multi-line',
    'value-list-comma-newline-after': 'always-multi-line',
    'font-family-no-missing-generic-family-keyword': [ true, {
      'ignoreValues': []
    }],
    'csstools/value-no-unknown-custom-properties': [
      true,
      { importFrom: [css.properties] }
    ],
    'csstools/media-use-custom-media': [
      'always-known',
      { importFrom: [css.media] }
    ],
    'csstools/use-nesting': 'always'
  }
}
