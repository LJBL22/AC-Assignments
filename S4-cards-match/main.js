//常數與變數
const GAME_STATE = {
  //FirstCardAwaits, 
  //to omit the value, only happens when key and value are the same (below is not, which is a string)
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
}

const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png',
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png',
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png',
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png'
]

//MVC 架構
//namespace (命名領域) ，因為 JS 的函式可以當作 value 傳遞。因此可用簡單的 object 直接完成程式碼架構。（相較於物件導向程式設計）

//主導流程
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  //依遊戲狀態，做不同行動
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        return
      case GAME_STATE.SecondCardAwaits:
        // view.renderTriedTimes()
        view.renderTriedTimes(++model.triedTimes)
        // 此處的 argument 是一個 expression 有 evaluate 成 value 
        // ++寫在前面的意思是，把 model.triedTimes 加一之後，把加完的值傳給 renderTriedTimes method 當作 argument
        // 寫在後面則是加了一，但是將原始的值當作 argument 傳遞
        view.flipCards(card)
        model.revealedCards.push(card)
        //判斷配對
        if (model.isRevealedCardsMatched()) {
          // view.renderScore()
          view.renderScore(model.score += 10) //是為了要在這裡處理好輸入的數值？
          this.currentState = GAME_STATE.CardsMatched
          // view.pairCards(card) --> 新增 function & CSS & 替換輸入的卡
          view.pairCards(...model.revealedCards) //將n個參數聚成陣列，rest parameter 因不確定會有幾個參數

          //Finn added
          for (let i = 0; i < 2; i++) {
            let selectIndex = model.indexArray.indexOf(model.revealedCards[i].dataset.index)
            model.indexArray[selectIndex] = undefined
          }

          model.revealedCards = [] //清空回初始值
          // 終於加到 260 的那天，遊戲結束
          if (model.score === 260) {
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits //先回到初始
        } else {
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)
          setTimeout(this.resetCards, 1000)
        }
        return
    }
    // debug 專用兩行，不過前面的 Return 要改成 break 才會接續執行到這裡 （return 就是直接結束函式了）
    // console.log('current state:', this.currentState);
    // //revealedCards 會成為一個儲存 div 的陣列，去遍歷每個 element 然後取出 dataset index 的值，再做成一個陣列
    // console.log('revealedCards:', model.revealedCards.map(card => card.dataset.index));
  },
  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    //注意此處的 this 要改成 controller ，主因是被 setTimeout 調用時，this 會指向 setTimeout
    controller.currentState = GAME_STATE.FirstCardAwaits
  },
  ////credit to Kim// 重新開始遊戲
  restartGame() {
    // 清空 model.indexArray when combine restart & click-it-to-all bts 
    model.indexArray = []
    // 清空分數
    model.score = 0;
    view.renderScore(model.score);
    // 清空次數
    model.triedTimes = 0;
    view.renderTriedTimes(model.triedTimes);
    // 如果是在結束時 restart 才需要移除畫面
    const completedView = document.querySelector(".completed");
    if (completedView) {
      completedView.remove()
    }
    // 重新洗牌，會被監聽器呼叫，所以要用controller
    controller.generateCards();
    document.querySelectorAll('.card').forEach(card => {
      console.log('inside restartGame');
      model.indexArray.push(card.dataset.index)
      card.addEventListener('click', event => {
        controller.dispatchCardAction(card)
        console.log('inside restartGame2');
      })
    })

    // console.log(model.indexArray);
    // // 更改遊戲狀態
    controller.currentState = GAME_STATE.FirstCardAwaits;
    console.log(controller.currentState);
    // return
  }
}

//資料
const model = {
  indexArray: [], ////////add for click-for-all button, credit to Finn
  revealedCards: [],
  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },
  score: 0,
  triedTimes: 0
}

//介面
const view = { //用 const
  displayCards(indexes) {
    const rootElement = document.querySelector('#cards')
    //4 第四階段寫法
    //要降低耦合性、把 utility 從此消除
    rootElement.innerHTML =
      indexes
        .map(index => this.getCardElement(index))
        .join('')

    //3 第三階段的寫法
    // rootElement.innerHTML =
    //   utility.getRandomNumberArray(52)
    //     .map(index => this.getCardElement(index))
    //     .join('')

    //1 第一階段的嘗試
    // rootElement.innerHTML = this.getCardElement(38)

    //2-1 第二階段的寫法
    // rootElement.innerHTML =
    //   Array.from(Array(52).keys())
    //     .map(index => this.getCardElement(index))
    //     .join('')
    //Array.from(Array(52).keys()) 將取出的 52 個 index 值，做成陣列
    //將此陣列利用 map 迭代函式 getCardElement()，再將結果做成新陣列回傳。
    //因為要做成一個大字串放在 literal template 裡面，因此用 join() 來結合原本單一張卡片的 HTMLContent，但會有逗號自動生成，因此加一個空 join('')

    //2-2 若要還原成一般函式的寫法 （this 會更改成 view)
    // rootElement.innerHTML =
    //   Array.from(Array(52).keys())
    //     .map(function (index) { return view.getCardElement(index) })
    //     .join('') //this.getCardElement is not a function
    // function 會包一個膜 裡面的就沒有 this 有關
    //在view裡面的內容我們可以使用this來指向view，但當多包了一層function(又或著說多了一個 block )時，就沒辦法順利使用this來指向view，需要直接呼叫view取得裡面的內容來進行操作

  },
  getCardElement(index) {
    return `<div class="card back" data-index="${index}"></div>`
  },
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    //此處用 const
    //加了 this 提醒是調用在這個 view 裡面的函式，否則會到外層去找
    // 0 > ...0 + 1 | 12 > ...12+1 | 13 > ...0 + 1
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>
    `
  },
  flipCards(...cards) { //spread operator 將陣列變成個別值
    cards.map(card => { //陣列 cards 裡面每一個參數 card 都執行（迴圈）並回傳新的陣列
      if (card.classList.contains('back')) {
        //翻牌揭數字
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        //暫定數字 10 //點擊後會發現每張卡片都有 data-index 值，接著就是要取出、並確保是 number 型別 （目前沒加也是沒錯）
        return
      }
      //翻回牌面
      card.classList.add('back')
      card.innerHTML = null
    })
  },
  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'; //漏了‘’字串，因此 not defined
      case 11:
        return 'J';
      case 12:
        return 'Q';
      case 13:
        return 'K';
      default:
        //教案與 MDN 寫 default: ，學起來！
        //我寫 case number: 也可運作
        return number
    }
  },
  pairCards(...cards) { //將陣列展開，spread operator
    cards.map(card => {
      card.classList.add('paired')
    })
  },
  renderScore(score) {
    // const showScore = document.querySelector('.score')
    // model.score += 10 //教案直接拿去當 argument
    // showScore.textContent = `Score: ${model.score}` 
    document.querySelector('.score').textContent = `Score: ${score}`
  },
  renderTriedTimes(triedTimes) {
    // const showTriedTimes = document.querySelector('.tried') //一三行直接結合
    // model.triedTimes += 1 //教案改寫成 ++model.triedTimes 直接當成 argument
    // showTriedTimes.textContent = `You've tried: ${model.triedTimes} times`
    document.querySelector('.tried').textContent = `You've tried: ${triedTimes} times`
  },
  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event =>
        event.target.classList.remove('wrong'), { once: true })
    }) //addEventListener('event', function/listener, options/useCapture) 這裡的 once 就是一個 options，而 false 是 default 值
  },
  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
    <p>Complete!</p>
    <p>Score: ${model.score}</p>
    <p>You've tried ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div) //element.before() //i.e. 把這個 div 放到 header 前面 
  },////////add for click-for-all button, credit to Finn
  showAnswer() {
    const cards = document.querySelectorAll('.card')
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].classList.contains('back')) {
        console.log('what');
        let result = model.indexArray[i] % 13
        let nextIndex = model.indexArray.slice(i + 1).findIndex(num => num % 13 === result) + i + 1
        cards[i].click()
        cards[nextIndex].click()
      }
    }
  }
}

const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}

//main code
controller.generateCards()

// document.querySelectorAll('.card').forEach(card => {
//   card.addEventListener('click', event => {
//     controller.dispatchCardAction(card)
//   })
// })
//選擇所有的 div.card (會回傳一個 Node list) array-like
//用 forEach 遍歷，每一個 card 掛上監聽器，先用印出來檢查

////////add for click-for-all button, credit to Finn
document.querySelectorAll('.card').forEach(card => {
  model.indexArray.push(card.dataset.index)
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
  })
})

document.querySelector('.click-for-all').addEventListener('click', view.showAnswer)


//restart
document.querySelector('.restart').addEventListener('click', controller.restartGame)
