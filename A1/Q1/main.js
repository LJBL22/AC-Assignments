let dogPic = document.querySelector("img");

// window.addEventListener("DOMContentLoaded", function () {
//可能是因為在載入此頁面的時候就等於是一個全新的（重新整理的）狀況所以不用特地再多寫這串？
axios
  .get("https://webdev.alphacamp.io/api/dogs/random")
  .then(function (response) {
    dogPic.src = response.data.message;
  }) //觀摩後了解可以精修成以下 function expression 寫法
  .catch(error =>
    // handle error
    console.log(error)
  );
// });

//The DOMContentLoaded event is fired when the document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading (the load event can be used to detect a fully-loaded page).
// event load vs DOMContentLoaded 後者快多了