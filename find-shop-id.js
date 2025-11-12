// Quick Shop ID finder - run this in browser console
fetch('https://api.printify.com/v1/shops.json', {
  headers: {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiOWM5ZjJhMWU1Yjk4ODE4YTNmN2E5ZDBjMGE1ZGVhYzY3ODk0M2U1MjdkNzY4YjY4YWY4OGE4ZTlhZmExYjczNGI2YjczYmJkOGRjODdlZjYiLCJpYXQiOjE3MzE0MzU2NzEuMzUyOTQ2LCJuYmYiOjE3MzE0MzU2NzEuMzUyOTQ4LCJleHAiOjE3NjI5NzE2NzEuMzUwNTMsInN1YiI6IjIwNzE4NDMwIiwic2NvcGVzIjpbInNob3BzOm1hbmFnZSIsInNob3BzOnJlYWQiLCJjYXRhbG9nOnJlYWQiLCJvcmRlcnM6cmVhZCIsIm9yZGVyczp3cml0ZSIsInByb2R1Y3RzOnJlYWQiLCJwcm9kdWN0czp3cml0ZSIsIndlYmhvb2tzOnJlYWQiLCJ3ZWJob29rczp3cml0ZSIsInVwbG9hZHM6cmVhZCIsInVwbG9hZHM6d3JpdGUiXX0.X5L4Lq7K4TePAFrAhOJmO1VxJuuwCWLxGTbE4UHF1jA'
  }
})
.then(response => response.json())
.then(shops => {
  console.log('Shops:', shops);
  if (shops.length > 0) {
    console.log('Your Shop ID is:', shops[0].id);
  }
})
.catch(error => console.error('Error:', error));