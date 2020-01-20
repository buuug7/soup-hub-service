# Authentication

## authentication with JWT

```javascript
// first login
fetch('http://localhost:3000/public/login', {
  method: 'POST',
  headers: {
    'Content-type': 'application/json'
  },
  body: JSON.stringify({
    username: 'buuug7',
    password: 'password'
  })
})
  .then(res => res.json())
  .then(json => {
    document.body.textContent = json.token;
    localStorage.setItem('token', json.token);
  });

// and then with token consumer the reset of api
fetch('http://localhost:3000/test', {
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(res => res.json())
  .then(json => console.log(json));
```

#### a more detail example

```javascript
// login
const login = () => {
  return fetch('http://localhost:3000/public/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      username: 'buuug7',
      password: '123456'
    })
  });
};

// getData
const getData = token => {
  fetch('http://localhost:3000/test', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(json => console.log(json));
};

// first login and then request other api
login()
  .then(res => res.json())
  .then(json => {
    getData(json.token);
  });
```
