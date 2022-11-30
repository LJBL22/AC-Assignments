const button = document.querySelector("button");
const dataPanel = document.querySelector("#data-panel");
const url =
  "https://webdev.alphacamp.io/api/v1/users/random?gender=female&results=3";

//觀摩 MA 更改細節以避免每次都升成一個新的 div
//處理方式是把 user 個別處理成一個物件
button.addEventListener("click", (e) => {
  axios.get(url).then((response) => {
    for (let i = 0; i < 3; i++) {
      const data = response.data.results[i]; //陣列 3 users
      const user = {
        name: `${data.name} ${data.surname}`,
        avatar: data.avatar,
        email: data.email
      };

      // create user template
      let div = document.createElement("div");
      let htmlContent = `
          <div class="user-item border p-4 d-flex flex-column align-items-center">
            <h1 class="text-lowercase fs-4">${user.name} ${user.surname}</h1>
            <img src="${user.avatar}" alt="user-photo" style="width: 150px"> 
            <h2 class="fs-6">${user.email}<h2> 
         </div>`;
      div.innerHTML = htmlContent;
      dataPanel.append(div); //在 dataPanel 這個節點後面加上 div 這個變數 ， 而這個變數是一個節點，而這個節點裡有如上的內容
    }
  });
});

// //原本自己+觀摩的寫法，會造成每一次都多新增一組 div 包著三個 user
// button.addEventListener("click", (e) => {
//   axios
//     .get(url)
//     .then((response) => {
//       //console.log(response)
//       const users = response.data.results; //陣列 3 users
//       //console.log(users)
//       let div = document.createElement("div"); //觀摩 MA 了解需要再額外增加一層 div
//       // function generate3Users() { //原本的寫法 14,26,27,31
//       let htmlContent = "";
//       users.forEach((user, i) => {
//         htmlContent += `
//           <div class="border p-4 d-flex flex-column align-items-center">
//             <h1 class="text-lowercase fs-2">${users[i].name} ${users[i].surname}</h1>
//             <img src="${users[i].avatar}" alt="user-photo" style="width: 150px">
//             <h2 class="fs-6">${users[i].email}<h2>
//          </div>`;
//         //MA 頭三個 div bootstrap class --> MA 是單純另開 CSS 來改，視覺上會更簡潔
//         //MA style="width: 150px"
//         //MA 下次可以直接寫 small 取代 h2 又 fz-6
//       });
//       //   return htmlContent
//       // }
//       div.innerHTML = htmlContent; //觀摩 MA 了解就不需要用 function 隔開，直接寫也可以
//       dataPanel.appendChild(div); //觀摩 MA 後寫此行。查詢了解 appendChild 只限 node element ，而 append 也可以增加 DOM string 文字
//       // dataPanel.innerHTML = generate3Users(users)
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });
// // img 置中問題待研究 class="d-inline-block"_solved 請見 18 & 23
