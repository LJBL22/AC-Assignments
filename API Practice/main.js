
let button = document.querySelector('button')
let show = document.querySelector('#show')

button.addEventListener('click', function () {
  axios.get('https://webdev.alphacamp.io/api/lyrics/Adele/Hello.json')
    .then(function (response) {
      show.innerHTML = response.data.lyrics
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
})


  