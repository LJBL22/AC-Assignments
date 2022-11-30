//常數
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const messageModal = document.querySelector('#message-modal')
const userList = []

//函式
function getUsersAPI() { //model answer 將此包入函式，主程式看起來清爽多了
  axios
    .get(INDEX_URL)
    .then(response => {
      // console.log(response.data.results) //Array(200)
      //用意是將這一長串 r.d.r 儲存在一個陣列，以方便為未來所用
      userList.push(...response.data.results)
      renderUserCards(userList)
    })
    .catch(error => console.log(error))
}

function renderUserCards(data) {
  let htmlContent = ''
  data.forEach(user => {
    htmlContent += `
    <div class="col-sm">
      <div class="item">
        <img src="${user.avatar}" alt="user-avatar" class="w-100 rounded-circle show-user-profile"
          data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${user.id}">
          <p><small>${user.name} ${user.surname}</small></p>
      </div>
    </div>
    ` //傻眼自己多打一個 # --> data-id="＃${user.id}" 卡關好久
  })
  dataPanel.innerHTML = htmlContent
}

function onPanelClick(event) {
  //若叫 onAvatarClick 這個函式就被限制住功能性，少了多樣性被其他調用
  if (event.target.matches('.show-user-profile')) {
    // console.log(event.target);
    showUserModal(event.target.dataset.id) //傳入什麼值很重要
  }
  else if (event.target.matches('.send-message-btn')) {
    storeMessage(Number(event.target.dataset.id))
  }
}

/*觀摩 model answer 是另一種做法，選擇少一點的節點，改用 innerHTML 統一更改
這裡沿用 movie list 的方法，選多一點節點，搭配 innerText 單純更改（不被 HTML 弄到眼花花）
各有優劣*/
function showUserModal(id) {
  const modalAvatar = document.querySelector('#user-modal-avatar')
  const modalName = document.querySelector('#user-modal-name')
  const modalBirthday = document.querySelector('#user-modal-birthday')
  const modalRegion = document.querySelector('#user-modal-region')
  const modalEmail = document.querySelector('#user-modal-email')
  const dropMessageBtn = document.querySelector('#drop-message-btn')
  // 先將 modal 內容清空，以免出現上一個 user 的資料殘影 --> 觀摩 model answer
  modalAvatar.firstElementChild.src = ''
  modalName.innerText = ''
  modalBirthday.innerText = ''
  modalRegion.innerText = ''
  modalEmail.innerText = ''

  axios.get(INDEX_URL + id)
    .then(response => {
      const data = response.data
      modalAvatar.firstElementChild.src = `${data.avatar}`
      modalName.innerText = `${data.name} ${data.surname}`
      modalBirthday.innerText = `🎂 ${data.birthday} (${data.age})`
      modalRegion.innerText = `🏠 ${data.region}`
      modalEmail.innerText = `📩 ${data.email}`
      // dropMessageBtn.setAttribute('data-bs-recipient', '任何希望帶入的值') 等同下面那行，注意 -bs-re... 會換成 bsRe...camelCase
      //新發現，也就是說根本不用在 HTML 寫，就可以靠這句直接創立 & 賦值
      dropMessageBtn.dataset.bsRecipient = `${data.name} ${data.surname}`
      dropMessageBtn.dataset.id = `${data.id}`
    })
    .catch(error => console.log(error))
}

function sendMessageModal(event) {
  //此處幾乎沒有變動，比照 bs 
  // console.log(event)
  const button = event.relatedTarget
  //變數 reci... get 上一個 modal 的值
  const recipient = button.getAttribute('data-bs-recipient')
  const modalTitle = messageModal.querySelector('.modal-title')
  const modalBodyInput = messageModal.querySelector('.modal-body input')
  //更改本 modal 的 title 節點的內容
  modalTitle.textContent = `New message to ${recipient}`
  //為本節點的 Input value 賦值
  modalBodyInput.value = recipient

  const sendMessageBtn = messageModal.querySelector('.send-message-btn')
  //新增 data-* attribute id ，賦值上一個 modal 的 data-id
  sendMessageBtn.dataset.id = button.getAttribute('data-id')

  sendMessageBtn.addEventListener('click', onPanelClick)

  // //??? WHY 假如我不例外去 panelClick，而是像以下，就會重現出現12345無限增生的 log
  // sendMessageBtn.addEventListener('click', function () {
  //   storeMessage(sendMessageBtn.dataset.id)
  // })
  messageModal.querySelector('textarea').value = ''
}

function storeMessage(id) {
  const message = messageModal.querySelector('textarea').value.trim()
  if (!message) {
    alert('❌ The empty message was not sent. ❌')
    return
  }
  const newUserList = JSON.parse(localStorage.getItem('droppedMsgUserList')) || []

  const targetUser = userList.find((user) => user.id === id)
  console.log(targetUser);
  const name = targetUser.name
  const surname = targetUser.surname
  const email = targetUser.email
  const age = targetUser.age
  const region = targetUser.region
  const birthday = targetUser.birthday
  const avatar = targetUser.avatar

  const checkUser = newUserList.find(user => user.id === id) //這裡用 some 也可以 @@ but why? 猜想是回傳什麼跟回傳布林值的差異
  if (checkUser) {
    alert('⛔Only one message can be sent.⛔\nPlease go to Inbox page and check!')
  } else {
    newUserList.push(
      {
        id,
        name,
        surname,
        email,
        age,
        region,
        birthday,
        avatar,
        message: `${message}`
      }
    )
    alert('🎉🎉🎉Congratulations🎉🎉🎉\nYou just sent the first message, now you\'re connected!')
  }
  localStorage.setItem('droppedMsgUserList', JSON.stringify(newUserList))
}

//main code
getUsersAPI()

//監聽
dataPanel.addEventListener('click', onPanelClick)
messageModal.addEventListener('show.bs.modal', sendMessageModal)
//觸發後用 console 檢查 event 會看到 type=show.bs.modal @@
//The show.bs.modal event in Bootstrap fires when the modal is about to be displayed.