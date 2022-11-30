const button = document.querySelector("button");
const userContent = document.querySelector("#user-content"); //改成常數
const url = "https://webdev.alphacamp.io/api/v1/users/random/"; //新增 url 常數

//觀摩答案練習的精簡寫法
button.addEventListener("click", (e) => {
  //event 寫成 e
  axios
    .get(url)
    .then((response) => {
      const user = response.data.results[0]; //data 改取名為 user 比較直觀
      const avatar = user.avatar;
      const name = `${user.name} ${user.surname}`;
      const email = user.email;

      userContent.innerHTML = `<h1 class="text-lowercase">${name}</h1>
        <img src="${avatar}" alt="user-photo">
        <h2 class="fs-6">${email}</h2>`;
    }) //都要 innerHTML 就直觀地做，毋須 += +=
    .catch((error) =>
      // handle error
      console.log(error)
    );
});

//以下是原本的寫法，冗長一些，也沒有這麼直觀，要練習怎麼用精簡的變數來應用
// button.addEventListener("click", event => {
//   axios
//     .get("https://webdev.alphacamp.io/api/v1/users/random/")
//     .then(response => {
//       let htmlContent = "";
//       htmlContent += `<h1 class="text-lowercase"></h1>
//         <img src="" alt="user-photo">
//         <h2 class="fs-6"></h2>`;
//       userContent.innerHTML = htmlContent;
//       const data = response.data.results[0];
//       userContent.children[1].src = data.avatar;
//       userContent.firstElementChild.textContent += `${data.name} ${data.surname}`;
//       userContent.lastElementChild.textContent += `${data.email}`;
//   })
//     .catch(error =>
//       // handle error
//       console.log(error))
// });
