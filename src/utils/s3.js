export function signedBase64ImageUpload(base64, signedUrl, fields) {
  const blob = base64ToBlob(base64, 'image/png')
  const formData = new FormData()
  formData.append('AWSAccessKeyId', fields.aWSAccessKeyId)
  formData.append('key', fields.key)
  formData.append('signature', fields.signature)
  formData.append('policy', fields.policy)
  formData.append('acl', fields.acl)
  formData.append('Content-Type', 'image/png')
  formData.append('file', blob)
  return signedUpload(formData, signedUrl)
}

export function signedUpload(file, signedUrl) {
  return new Promise((resolve, reject) => {
    const xhr = createCorsRequest('POST', signedUrl)

    xhr.addEventListener('load', () => {
      if (xhr.status === 200 || xhr.status === 204) {
        resolve()
      } else {
        reject(new Error(`Upload error: ${xhr.status}`))
      }
    })
    xhr.addEventListener('error', () => reject(new Error('Failed to upload to S3')))
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

    xhr.setRequestHeader('acl', 'public-read')

    xhr.send(file)
  })
}

function createCorsRequest(method, url) {
  let xhr = new XMLHttpRequest()

  if (xhr.withCredentials !== null) {
    xhr.open(method, url, true)
  } else if (typeof XDomainRequest !== 'undefined') {
    xhr = new XDomainRequest()
    xhr.open(method, url)
  } else {
    throw new Error('CORS is not supported')
  }
  return xhr
}

function base64ToBlob(base64, mime = '') {
  const sliceSize = 1024
  const byteChars = window.atob(base64)
  const byteArrays = []

  for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
    const slice = byteChars.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: mime })
}
