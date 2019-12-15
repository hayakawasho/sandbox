self.addEventListener('message', e => {
  const { url } = e.data
  const req = new XMLHttpRequest()

  req.open('GET', url, false)
  req.setRequestHeader('X-Starting-Blocks', 'yes')
  req.setRequestHeader('X-Allow-Partial', 'yes')
  req.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  req.withCredentials = true
  req.send(null)

  if (req.status === 200) {
    self.postMessage(JSON.stringify({
      res: req.responseText
    }))
  } else {
    self.postMessage(JSON.stringify({
      err: req.statusText,
      status: req.status
    }))
  }
})
