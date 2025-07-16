const str = "m   ad am";
let parsedStr =str.split(" ").join("");
const isPalindrome = parsedStr.split("").reverse().join("");
console.log(isPalindrome)
if (isPalindrome === str) {
  return console.log(true);
} else {
  return console.log(false);
}
