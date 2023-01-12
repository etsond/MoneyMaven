'use strict';

// setting hard coded user accounts
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
// adding the second paramenter to see wherethere or not the movement was false
const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';
  
  // taking a copy of the movements and sort it and not sort the new array
  const movs = sort ? movements.slice().sort((a, b)=> a - b) : movements;

  movs.forEach(function(mov, i){
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
// creatin new varibale for the sorted states throught the clciks

let sorted = 0;
//sorting the amount everytime user click button
btnSort.addEventListener("click", function(e) {
  e.preventDefault();


  /*  does not work because varibale remains unchange ---- reminder---- look into sorted func*/ 
  // displayMovements(currentAccount.movements, true);
  // // flippin it afte the flip

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


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements)
// console.log(movements.includes(-130));

// // some
// console.log(movements.some(mov => mov === -130))
// // checking to see if there are postive number in the array

// const anyDeposit = movements.some(mov => 1500);
// console.log(anyDeposit);


// // every
// console.log(movements.every(mov => 0));
// console.log(account4.movements.every(mov => 0));


// // separate cancelIdleCallback

// const deposit = mov >= mov > 0;

// console.log(movements.some(deposit));
// console.log(movements.every(deposit))
// console.log(movements.filter(deposit));