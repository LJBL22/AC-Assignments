// DEFAULT CODE ////////////////////////
const BASE_URL = "https://webdev.alphacamp.io/api/lyrics/";
const songList = document.querySelector("#song-list");
const lyricsPanel = document.querySelector("#lyrics-panel");
const album = {
  artist: "Adele",
  album: "25",
  tracks: [
    "Hello",
    "Send My Love (To Your New Lover)",
    "I Miss You",
    "When We Were Young",
    "Remedy",
    "Water Under the Bridge",
    "River Lea",
    "Love in the Dark",
    "Million Years Ago",
    "All I Ask",
    "Sweetest Devotion"
  ]
};

// WRITE YOUR CODE ////////////////////////
//先召喚女神出來
document.body.style.backgroundImage =
  "url('https://media.newyorker.com/photos/6169d1caf9c7cf02c89a9454/master/w_2560%2Cc_limit/Battan-AdeleEasyOnMe-2.jpg')";
document.body.style.backgroundSize = "cover";

//生成 album 列表 //利用單純的 for loop 去掉在 HTML 裡的 [i]
//使用 Bootstrap pills 用法
let htmlContent = `<div class="d-flex align-items-start">
      <div class="nav flex-column nav-pills me-3"
      id="v-pills-tab" role="tablist"
      aria-orientation="vertical">`;

album.tracks.forEach(track => {
  htmlContent += `<button class="nav-link" id="v-pills-profile-tab"
      data-bs-toggle="pill" data-bs-target="#v-pills-profile"
      type="button" role="tab" aria-controls="v-pills-profile"
      aria-selected="false" style="text-align:left">${track}</button>`;
})

htmlContent += `</div></div>`;
songList.innerHTML = htmlContent;

//事件監聽_點擊後使用 axios 發送請求取得 API 資料
songList.addEventListener("click", (e) => {
  const artist = album.artist; //更換任何歌手的專輯都可以代入
  const title = e.target.textContent;
  const newURL = BASE_URL + artist + "/" + title + ".json";

  axios.get(newURL).then((response) => {
    const lyrics = response.data.lyrics
      // .replaceAll("\r\n", "\n\n")
      //此處可將 \r\n 視為 \n\n 看待 且貿然替換會有問題（第一二段黏在一起）
      .replace("\n\n", "\n\n\n\n")//只處理第一個
      .replaceAll("\n\n", "\n"); //處理所有
    //credit to KIM 處理了阿雜的內文

    //我的寫法＿優點：有吃到 CSS 設定；小缺：有點冗長＆難懂
    let trackTitle = document.createElement("h2");
    trackTitle.textContent = title;
    lyricsPanel.innerText = lyrics;
    lyricsPanel.prepend(trackTitle);
    //查閱《修改 DOM 節點》，利用 prepend 插入成為第一個子元素
    // document.body.style.backgroundSize = "contain" 
    // 若想要更改點擊出歌詞的畫面可以從這邊下手思考 cr Jamie

    // //KIM 的簡潔寫法＿優點：簡潔！；小缺？打字機的字型（=沒有樣式？）
    // lyricsPanel.innerHTML = `
    // <h3>${title}</h3>
    // <pre>${lyrics}</pre>`
  });
});

//回到首頁的效果

//重置 = 回到首頁的效果 = 再次召喚女神
//想像是要在 藍色開關下功夫 --> done 但是歌詞沒有消失
//原本方向錯誤，跟 API 沒關係，而是要清空右方的內容 11/2
const nav = document.querySelector("nav");

//自己再來回覆，若是在自己的 vs code 裡面（因為 codepen 免費版不支援 project），其實可以直接把 adele 25 的標籤從 span 改成 a 加上 href="./index.html" 就可以回到首頁 = 重整畫面了。就不用寫監聽 nav 那串功能了。不過使用者體驗是些微不同的，一個是會跳轉畫面，一個是優雅地清除。
nav.addEventListener("click", (e) => {
  if (lyricsPanel.innerText !== "") {
    //資料驗證避免一剛開始即點擊頁首，會造成 null
    let active = document.querySelector(".active");
    active.ariaSelected = "false";
    active.classList.remove("active");
    lyricsPanel.innerText = "";
  }
});


//覺得沒處理好的 br 有點阿雜 有在想有沒有可能把它全部去掉然後上新的 tag (目前看起來沒有要求處理這項就可以通過) --> 11/3 done credit to KIM

///////OLD NOTES//////
//原本寫 prep 似乎也可以，不過他的 display 是 none 而 li 是 listed-item
//後來寫 `<li>${track}</li>`
//最後因為 bootstrap pills 改寫成 pill button

////寫法一 for loop
// for (let i = 0; i < album.tracks.length; i++) {
//   let track = album.tracks[i];

// //原forEach 寫法 （不必要加 i) (亦可省去多增一個變數名，畢竟之後沒有要再用這個變數)
//   const tracks = album.tracks
//   tracks.forEach((track,i) => {
// songList.innerHTML += `<li>${track}</li>`
//   })

////助教建議寫法，就不會有 i 了(其實我本來寫對了，不知道為什麼沒想清楚/設定清楚，因而在 template literal 裡面加了 i)
// album.tracks.forEach((track) => {
//     htmlContent += 
//     `<button class="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false" style="text-align:left">${track}</button>`
// })