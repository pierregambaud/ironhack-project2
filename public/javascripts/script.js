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
const socialLogins = document.getElementById(`social-logins`);

emailInput.addEventListener('focus', () => {
  passwordInput.classList.remove(`is-hidden`);
  socialLogins.style.paddingTop = "3em";
  socialLogins.classList.add(`slide-bottom`);
  submitButton.classList.remove(`is-hidden`);
});

passwordInput.addEventListener('focus', () => { // to fix email input shadow that overlays password input when writing
  emailInput.style.zIndex = 2;
});