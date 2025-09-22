function checkStringLength(string, maxLength) {
  return string.length <= maxLength;
}

checkStringLength('Строка для проверки', 20);

function isPalindrome(str) {
  const normalStr = str.replaceAll(' ', '').toLowerCase();
  let reverStr = '';
  for (let i = normalStr.length - 1; i >= 0; i--) {
    reverStr += normalStr[i];
  }
  return normalStr === reverStr;
}

isPalindrome('Шалаш');
