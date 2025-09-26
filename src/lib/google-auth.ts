export interface GoogleAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

export const initGoogleAuth = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.google) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

export const handleGoogleSignIn = (): Promise<GoogleAuthResponse> => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google API not loaded'))
      return
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: '184779474829-1eo8v5n98av38rp6v26kl9dm2h9g8p59.apps.googleusercontent.com',
      scope: 'email profile',
      callback: (response: GoogleAuthResponse) => {
        if (response.access_token) {
          resolve(response)
        } else {
          reject(new Error('Failed to get access token'))
        }
      },
      error_callback: (error: any) => {
        reject(error)
      }
    })

    client.requestAccessToken()
  })
}