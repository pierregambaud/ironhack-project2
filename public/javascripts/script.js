//    _           _           
//   (_)         | |          
//    _ _ __   __| | _____  __
//   | | '_ \ / _` |/ _ \ \/ /
//   | | | | | (_| |  __/>  < 
//   |_|_| |_|\__,_|\___/_/\_\
//   

const emailInput = document.querySelector(`input[name="email"]`);
const passwordInput = document.querySelector(`input[name="password"]`);
const submitButton = document.querySelector(`button`);
const socialLogins = document.getElementById(`socialLogins`);

emailInput.addEventListener('focus', () => {
  passwordInput.classList.remove(`isHidden`);
  socialLogins.style.paddingTop = "3em";
});

passwordInput.addEventListener('focus', () => {
  submitButton.classList.remove(`isHidden`); 
});