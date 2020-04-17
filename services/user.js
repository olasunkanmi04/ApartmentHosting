// import authHeader from '../src/helpers/auth__header';
import axios from 'axios';

const api = "https://spleetcms.herokuapp.com/api/v1/"

export async function login(email, password) {
  const {
    data
  } = await axios.post(api + 'auth/login', {
      email: email,
      password: password
    })
    .then(user => {
      // login successful if there's a jwt token in the response
      return user;
    })
    .catch(function (error) {
      throw error.response.data
    });
  return data
}

export async function signup(email, fname, lname, password) {
  const {
    data
  } = await axios.post(api + 'auth/register', {
      email: email,
      first_name: fname,
      last_name: lname,
      password: password
    })
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    })
    .catch(function (error) {
      throw error.response.data
    });
  return data
}
