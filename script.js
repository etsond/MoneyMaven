'use strict';

// setting hard coded user accounts
const account1 = {
  owner: 'Etson Dorival',
  movements: [200, 450, -400, 300_0, -650, -130, 70, 130_0],
  interestRate: 1.2, // %
  pin: 111_1,

   movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};


const account2 = {
  owner: 'Jess Brown',
  movements: [500_0, 340_0, -150, -790, -321_0, -100_0, 850_0, -30],
  interestRate: 1.5,
  pin: 222_2,

   movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2021-07-25T14:43:26.374Z',
    '2022-07-28T18:49:59.371Z',
    '2023-01-23T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};


const accounts = [account1, account2 ]

// selting the element using class and storing them in a const
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const formatMovementDate = function(Date){
  const calcDaysPassed = (date1, date2) => 
     Math.round(Math.abs(date2 - date1) / (1000 * 60 *60 *24))

      const daysPassed = calcDaysPassed(new Date(), date);
      console.log(daysPassed);

      if(daysPassed === 0 )return "Today;";
        if(daysPassed === 1 )return "Yesterday;";
          if(daysPassed <= 7 )return `${daysPassed} days ago`;
          else{
                const date = new Date(acc.movementsDates[i]);
                const day = `${date.getDate()}`.padStart(2,0);
                const month = `${date.getMonth() + 1}`.padStart(2,0);
                const year = `${date.getFullYear()}`;
                  return `${month}/${day}/${year}`;
          }  //  <div class="movements__value">${displayDate}</div>
};
//displaying the movements
// adding the second paramenter to see wherethere or not the movement was false
const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';
  
  // taking a copy of the movements and sort it and not sort the new array
  const movs = sort 
  ? acc.movements.slice().sort((a, b)=> a - b) 
  : acc.movements;

  // looping over----- after each iterato
  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit': 'withdrawal';

    const date = new Date(acc.movementsDates[i])
    const displayDate = formatMovementDate(date);
    
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--
        ${type}">${
           i + 1
      } ${type}</div>
        <div class="movements__date">${displayDate}<
        /div>
        <div class="movements__value">${mov.toFixed(2)}</div>
       
          
        </div>
    `;
    // create string in html
    containerMovements.insertAdjacentHTML('afterbegin', html)
  }); 

};

//displaying the balance function
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => 
  acc + mov, 0);
  // acc.abalance = balance; 
  labelBalance.textContent = `${acc.balance}.00$`
}

//display the summary balance
const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc,mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;

  // calculating for the outgoing money
  const out = acc.movements 
  // filtering the amount that are negatives
    .filter(mov => mov < 0)
    // then reducing it
    .reduce((acc,mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)}.00$`;

// calculate the interest rate
// pays out an interest everytime there is a deposit(to practice filtering and reducing--- purposes)
    const interest = acc.movements
      .filter(mov => mov > 0)
      // creating a map to hold all of the interest
      .map(deposit => (deposit * acc.interestRate) / 100)
      //making sure to pay interest if the interest is at least 1 dollar to then add it together
      .filter((int, i, arr) => {
        return int >= i;
      })
      // adding the interest rate together
      .reduce((acc,int) => acc + int, 0);
      labelSumInterest.textContent = `${interest}.00$`;
};

//this function allows the usernames provide to 1.lowerCase 2.Split 3.join the initial for loggin in.
const createUsernames = function (accs) {
accs.forEach(function(acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
});

};

createUsernames(accounts);

const updateUI = function(acc){
   //show the movements
    displayMovements(acc.movements);
    //show the balance
    calcDisplayBalance(acc);

    //show the summary
    calcDisplaySummary(acc);
}




//initializing the variable to use late to manipulate the current user
let currentAccount;

//event handler when the login button is click by dfeault form also uses the enter key
btnLogin.addEventListener("click", function(e){
  //prevent the page from realoding since it is a form
  e.preventDefault();
  // finding  the current account
currentAccount= accounts.find(
  // if the input matches the usernameLogin (value)
  acc => acc.username ===
   inputLoginUsername.value);
   console.log(currentAccount);
   //using chain property to see if the account is exists
  if(currentAccount?.pin === Number(inputLoginPin.value))
  {
    //display the UI and welcome message if it is a match
    labelWelcome.textContent= `welcome back, ${
    currentAccount.owner.split(' ')[0]
    }`;
    //container app has the app class
    containerApp.style.opacity = 100;
    // create current date
// showing the month, day and year
const now = new Date();
const day = now.getDate();

// starting at zero so adding one
const month =now.getMonth() + 1;
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const minutes = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${month}/${day}/${year}, ${hour}:${minutes}`;
 
  //clear input fileds
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  // update UI
  updateUI(currentAccount)
  }
});

//event listener for the button transfer 
btnTransfer.addEventListener("click", function(e) {
  //setting the default 
  e.preventDefault();
  //getting the transfer amount value
  const amount = Number(inputTransferAmount.value)
  //which account to transfer to
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  //checking to see if you have enough to transfer
  if(
    amount >0 && 
    receiverAcc &&
    currentAccount.balance >= amount && 
    //? optional chainning to check if the account even exist
    receiverAcc?.username !== currentAccount.username
    ){
      //the trasnfer
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);

  // add the current date to the transfer

  currentAccount.movementsDates.push(new Date().toISOString());
   receiverAcc.movementsDates.push(new Date().toISOString());

  //update the UI
  updateUI(currentAccount);

    }
});

// Taking a loan
btnLoan.addEventListener("click", function(e){
  e.preventDefault();
  
  //converting the value of the inputLoann to a number
  const amount = Number(inputLoanAmount.value);

  // amount cannot be less than zeo, 
  // accept  request if currentAmount is >= 10 Percent of the amount 
  if(amount > 0 && currentAccount.movements.some(
    mov => mov >= amount * 0.1)){
      //add the amount
      currentAccount.movements.push(amount)

        // add the current date to the transfer
      currentAccount.movementsDates.push(new Date().toISOString());

      //update the ui
      updateUI(currentAccount);
    }

    //TODO clea the input field 
    inputLoanAmount.value = '';
})
//button close event listner to listen for a click

btnClose.addEventListener("click", function(e){
  // preventig the default to not reload
  e.preventDefault();

  // TODO check if the credential are corrent
  if(inputCloseUsername .value === currentAccount.username
    && Number(inputClosePin.value) === currentAccount.pin)
    {
      // calculate the index to delete
      const index = accounts.findIndex(acc => acc.username
        === currentAccount.username);
        console.log(index)
      
        //TODO  delete current acount and remove 1 element
      accounts.splice(index, 1);

      //hidden UI
      containerApp.style.opacity = 0;
    }

    // setting the stirng to empty after rm the user
    inputCloseUsername.value = inputClosePin.value = '';
});
// creatin new varibale for the sorted states throught the clicks
let sorted = 0;
//sorting the amount everytime user click button
btnSort.addEventListener("click", function(e) {
  e.preventDefault();


  /*  does not work because varibale remains unchange ---- reminder---- look into sorted func*/ 
  // displayMovements(currentAccount.movements, true);
  // // flippin it after thef flip

  // sorted = !sorted;

  sorted ++;

  if(sorted % 2 == 0){
    currentAccount.movements.sort((a, b) => a - b);
  }else {
    currentAccount.movements.sort((a , b) => b - a);
  }

  // update UI
  updateUI(currentAccount);
})



const future =  new Date(2037, 10, 19,15,23);
console.log(+future)

const calcDaysPassed = (date1, date2) => 
Math.abs(date2 - date1) / (1000 * 60 *60 *24)

const day1 = calcDaysPassed(new Date(2037, 3,4),
new Date(2037, 3,14) );

console.log(day1);

