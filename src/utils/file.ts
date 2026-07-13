const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']

export function getExtension(name: string) {
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase()
}

export function isImageAttachment(name: string) {
  return IMAGE_EXTENSIONS.includes(getExtension(name))
}

export function downloadFile(url: string, name: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
