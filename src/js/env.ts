const html = document.documentElement
const body = document.body
const isProd = process.env.NODE_ENV === 'production'

export { html, body, isProd }
