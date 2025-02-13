const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  fetch('/login', {method: 'POST'})
    .then(function(response) {
      if (response.ok) {
        return;
      }
      throw new Error('Login Request Failed')
    })
    .catch(function(error) {
      console.log(error);
    })
});