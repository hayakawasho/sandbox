const rafTimeout = (fn: any, ms: number) => {
  const start = performance.now()

  const loop = (timestamp: number) => {
    const delta = timestamp - start

    delta >= ms ? fn.call() : requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

export { rafTimeout }
