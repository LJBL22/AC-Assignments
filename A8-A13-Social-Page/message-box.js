//常數
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const messageModal = document.querySelector('#message-modal')
const newUserList = JSON.parse(localStorage.getItem('droppedMsgUserList')) || []
//發現 message box page 沒有用到 axios 也沒關係，因為我已經儲存完整的值到 newUserList 了

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
    `
  })
  dataPanel.innerHTML = htmlContent
}

function onPanelClick(event) {
  if (event.target.matches('.show-user-profile')) {
    showUserModal(Number(event.target.dataset.id)) //傳入什麼值很重要，永遠要檢查數字
  }
}

function showUserModal(id) {
  const modalAvatar = document.querySelector('#user-modal-avatar')
  const modalName = document.querySelector('#user-modal-name')
  const modalBirthday = document.querySelector('#user-modal-birthday')
  const modalRegion = document.querySelector('#user-modal-region')
  const modalEmail = document.querySelector('#user-modal-email')
  const modalMessage = document.querySelector('#user-modal-message')
  // 先將 modal 內容清空，以免出現上一個 user 的資料殘影 --> 觀摩 model answer
  modalAvatar.firstElementChild.src = ''
  modalName.innerText = ''
  modalBirthday.innerText = ''
  modalRegion.innerText = ''
  modalEmail.innerText = ''
  modalMessage.innerText = ''

  const data = newUserList.find(user => user.id === id)

  modalAvatar.firstElementChild.src = `${data.avatar}`
  modalName.innerText = `${data.name} ${data.surname}`
  modalBirthday.innerText = `🎂 ${data.birthday} (${data.age})`
  modalRegion.innerText = `🏠 ${data.region}`
  modalEmail.innerText = `📩 ${data.email}`
  modalMessage.innerText = `💬 ${data.message}`
}


//main code
renderUserCards(newUserList)

//監聽
dataPanel.addEventListener('click', onPanelClick)