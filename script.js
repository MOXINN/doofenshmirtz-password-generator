const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const copyBtnText = document.getElementById('copyBtnText');

const lengthValue = document.getElementById('lengthValue');
const lengthSlider = document.getElementById('lengthSlider');

const uppercase = document.getElementById('includeUppercase');
const lowercase = document.getElementById('includeLowercase');
const numbers = document.getElementById('includeNumbers');
const symbols = document.getElementById('includeSymbols');

const generateBtn = document.getElementById('generateBtn');
const statusMessage = document.getElementById('statusMessage');

// 1.Sound Effects
const errorSound = new Audio('https://www.myinstants.com/media/sounds/among-us-role-reveal-sound.mp3');
const generateSound = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3'); 
const copySound = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');

// Helper function to rewind and play sound without browser errors
function playEffect(sound) {
  sound.currentTime = 0; // Rewind so rapid clicks/drags still play sound
  sound.play().catch(() => {
    // Ignore autoplay restrictions if page just loaded
  });
}

// 2. Helper function to update the slider UI
function updateSliderUI() {
  let val = lengthSlider.value;
  let min = lengthSlider.min;
  let max = lengthSlider.max;
   
  lengthValue.textContent = `(${val})`;
  let percentage = ((val - min) / (max - min)) * 100;
  lengthSlider.style.setProperty('--slider-pct', `${percentage}%`);
}

// 3. Password Generation Logic
const charsUpper = 'ASDFGHJKLZXCVBNMQWERTYUIOP';
const charsLower = 'zxcvbnmasdfghjklpoiuytrewq';
const charsNum = '7894056321';
const charsSym = '!@#$%&*()_+|?,.-=';

function createPassword(shouldPlaySound = true) {
  statusMessage.textContent = '';
  statusMessage.classList.remove('is-error');

  let allowedChar = '';
  let generatedPassword = '';
  const length = lengthSlider.value;

  if (uppercase.checked) allowedChar += charsUpper;
  if (lowercase.checked) allowedChar += charsLower;
  if (numbers.checked) allowedChar += charsNum;
  if (symbols.checked) allowedChar += charsSym; 

  if (allowedChar.length === 0) {
    if (shouldPlaySound) playEffect(errorSound);
    statusMessage.textContent = "There's a Platypus Controlling Me! (Check a box)";
    statusMessage.classList.add('is-error');
    passwordOutput.value = '';
    return;
  }

  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * allowedChar.length);
    generatedPassword += allowedChar[randomIndex];
  }

  passwordOutput.value = generatedPassword;
  if (shouldPlaySound) playEffect(generateSound);
}

// 4. Event Listeners
lengthSlider.addEventListener('input', () => {
  updateSliderUI();
  createPassword(true);
});

generateBtn.addEventListener('click', () => {
  createPassword(true);
});

copyBtn.addEventListener('click', async () => {
  const currentPassword = passwordOutput.value;

  if (!currentPassword) {
    playEffect(errorSound);
    statusMessage.textContent = "Curse you Perry the Platypus! (Generate first)";
    statusMessage.classList.add('is-error');
    return;
  }

  try {
    await navigator.clipboard.writeText(currentPassword);
    
    // Show glowing green success feedback!
    copyBtnText.textContent = 'Copied!';
    statusMessage.classList.remove('is-error');
    statusMessage.textContent = 'Evil Password Copied to Clipboard!';
    playEffect(copySound);
    
    setTimeout(() => {
      copyBtnText.textContent = 'Copy';
      statusMessage.textContent = '';
    }, 2000);
    
  } catch (err) {
    playEffect(errorSound);
    statusMessage.textContent = "Failed to copy! The Inator is broken.";
    statusMessage.classList.add('is-error');
  }
});

// 5. Run on initial page load (silent so browser doesn't block audio)
updateSliderUI();
createPassword(false);