//常數與變數
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/' // + ID
const POSTER_URL = BASE_URL + '/posters/' // + img
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

//main code
//渲染畫面
axios.get(INDEX_URL)
  .then((response) => {
    /*寫法一
    // for (const movie of response.data.results) {
    //   movies.push(movie)
    // }
    //r.d.r //Array(80)*/

    //寫法二 展開運算子 ...
    // console.log(response.data.results);
    movies.push(...response.data.results) //利用展開運算子，展開 r.d.r ... 裡的元素
    renderPaginator(movies.length) //先 renderPage 才做 renderMovieList 
    renderMovieList(getMoviesByPage(1)) //初始值是第一頁
  })
  .catch(error => console.log(error))

//監聽
dataPanel.addEventListener('click', onPanelClick)
searchForm.addEventListener('submit', onSearchFormSubmitted)
paginator.addEventListener('click', goToPage)


//函式 依照畫面從上往下、及關聯性羅列
function renderMovieList(data) { //這裡要放參數，以利降低耦合性（可為多個資料所用，而非綁定某變數）
  let HTMLContent = ''
  data.forEach(item => {
    HTMLContent += `
      <div class="col">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
              data-bs-target="#movie-modal" data-id="${item.id}">More</button>
            <button type="button" class="btn btn-info btn-add-favourite" data-id="${item.id}">♡</button>
          </div>
        </div>
      </div>
    `
    dataPanel.innerHTML = HTMLContent
  })
}

function onSearchFormSubmitted(event) {
  //取消預設事件，避免頁面重新跳轉 //該預設事件是綁在 form 上面的 action
  event.preventDefault()
  // console.log('enter!')
  //取得搜尋關鍵字 
  //input type="text" 選到該節點，它的 value 也就是欄框數入的值
  const keyword = searchInput.value.trim().toLowerCase()
  //錯誤處理：輸入無效字串 --> 無效沒關係，就正常顯示
  // if (!keyword.length) {
  //   return alert('Please submit valid keyword.')
  // }
  //儲存符合篩選條件的項目
  // let filteredMovies = [] --> 改成全域變數

  //條件篩選
  //作法二  filter() 以及 includes() 會有大小寫之分，因此再加上 toLowerCase
  filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(keyword)
  })
  //若要大括號的話，在這個情境就一定要寫 Return 
  //這邊只有一行的話可以省略花括號，以及 Return 

  //作法一
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // } 

  //錯誤處理：無符合條件則跳通知提醒
  if (filteredMovies.length === 0) {
    return alert('查無關鍵字，請重新輸入！')
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
}

function getMoviesByPage(page) {
  // page 1 = 0-11 //splice(0,12)
  // page 2 = 12-23 //splice(12,24)
  // ...> 因為 slice 結尾的 index 不會被包含

  //注意，這裡的 movies 有兩個可能性，可用 三元運算子來做判斷

  // 寫法一
  // let data = movies
  // if (filteredMovies.length) {
  //   data = filteredMovies
  // }
  //寫法二 三元運算子 條件 ? true 回傳值: false 回傳值  
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE) //回傳此值讓其他函式繼續利用 //在函式外用其他變數接住這個回傳值做後續操作，
}

function renderPaginator(amount) {
  //80 = 12 * 6...8
  const totalPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let HTMLContent = ''
  for (let page = 1; page <= totalPages; page++) { //這裡不寫 i ，直接語意化命名 page
    HTMLContent += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>` //新增 data-* 屬性是關鍵，方便未來取
  }
  paginator.innerHTML = HTMLContent
}

function goToPage(event) {
  // if (event.target.tagName === 'A') { 
  if (event.target.tagName !== 'A') return // 錯誤處理 i.e 我們只要 tagName = A 的時候才執行此函式；否則跳出結束
  const pageNumber = Number(event.target.dataset.page) // 教案建議用 dataset-page 。 原本用 textContent 也是可以取 但應該是沒這麼好用 --> 思索可能是因為你不能保證 textContent 一定是數字？（雖然這個情況中他們是相同就是了...?)
  // why data-* is better than textContent here?
  // textContent 容易碰到一些空格、斷行字元之類的問題。而且 text 是屬於比較容易被外部修改的內容，比較不能信任。
  // 並且在與其他工程師協作是，看到 dataset 就能猜出這邊一定有下 JS，只取 text 的話，其他人就得花時間掃過程式碼，才能知道有沒有被 JS 訪問喔。
  renderMovieList(getMoviesByPage(pageNumber)) //直接操作兩個函式！！！ 將 pageNumber 傳入 gMB 然後取出該分頁特定的 movies 內容，然後再渲染！！！
}

function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.event.target.dataset)
    showMovieModal(event.target.dataset.id) //--> 此處不一定要把 id 轉型別成 number 因為在 url 的部分算是多此一舉
  } else if (event.target.matches('.btn-add-favourite')) {
    addToFavourite(Number(event.target.dataset.id)) // 但這裡一定要轉，因為會比對 id 
  }
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  //避免顯示上一部資訊
  modalTitle.innerText = ''
  modalImage.firstElementChild.src = ''
  modalDate.innerText = ''
  modalDescription.innerText = ''

  axios.get(INDEX_URL + id)
    .then((response) => {
      // console.log(response)
      const data = response.data.results
      modalTitle.innerText = data.title
      //src 寫法，自己想起來的^^
      modalImage.firstElementChild.src = `${POSTER_URL + data.image}`
      //教案寫法
      // modalImage.innerHTML = `
      // <img src="${POSTER_URL + data.image}"
      // class="img-fluid" alt="Movie Poster">`
      modalDate.innerText = `Release date: ${data.release_date}`
      modalDescription.innerText = data.description
    })
}

function addToFavourite(id) {
  //設定一個 list 變數，儲存從 localStorage 中提取的 fav movies；若還沒有 fav movies 則為空

  //find 方法會對每個元素執行一次 callback 函式，直到找到一個讓 callback 函式回傳 true 的元素。當元素被找到的時候，find 會立刻回傳該元素，否則 find 會回傳 undefined。
  //帶入的參數 movie 的 id 與 id 符合時...  而這裡的參數 movie 來源為 .find() 前面的 陣列
  const list = JSON.parse(localStorage.getItem('favouriteMovies')) || []
  //原始寫法
  // const movie = movies.find(movieIsMatched) //arr.find() 裡是函式 會把 arr 每一個 el 當成參數丟進該函式篩選
  // function movieIsMatched(movie) { return movie.id === id }
  //箭頭函式
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) { //若 some 的函式為真
    return alert('此部電影已加入收藏清單')
  }
  list.push(movie)
  localStorage.setItem('favouriteMovies', JSON.stringify(list))
}

