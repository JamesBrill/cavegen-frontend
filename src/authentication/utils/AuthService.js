import Auth0Lock from 'auth0-lock'
import { browserHistory } from 'react-router'
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from 'src/config'

export default class AuthService {
  constructor() {
    // Configure Auth0
    this.lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
      auth: {
        redirectUrl: 'http://localhost:3000/login',
        responseType: 'token'
      }
    })
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', browserHistory.replace('/editor'))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show()
  }
}
