'use strict';

// setting simple user account
const account1 = {
  owner: 'Etson Dorival',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jess Brown',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Hailey Suzan ',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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


//displaying the movements
const displayMovements = function(movements) {
  containerMovements.innerHTML = '';
  
  movements.forEach(function(mov, i){
    const type = mov > 0? 'deposit': 'withdrawal';
    
    const html = `
      <div class="movements__row">
          <div class="movements__type 
        movements__type--${type}">${
          i + 1
        } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
    `;
    // create string in html
    containerMovements.insertAdjacentHTML('afterbegin', html)
  }); 

};

//displaying the balance function
const calcDisplayBalance = function (acc) {
  //
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

  const out = acc.movements 
    .filter(mov => mov < 0)
    .reduce((acc,mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)}.00$`;


    const interest = acc.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * acc.interestRate) / 100)
      .filter((int, i, arr) => {
        return int >= i;
      })
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

//initializing the variable
let currentAccount;
//event handler when the login button is click
btnLogin.addEventListener("click", function(e){
  //prevent form from submitting
  e.preventDefault();

  
currentAccount= accounts.find(
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
  //clear input fileds
  inputLoginUsername.value = inputLoginPin.value = 
  '';

  inputLoginPin.blur();

   

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

  //update the UI
  updateUI(currentAccount);

    }
})


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


