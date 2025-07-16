const str = "m   ad am";
let parsedStr =str.split(" ").join("");
console.log(str)
const isPalindrome = str.split("").reverse().join("");
console.log(isPalindrome)
if (isPalindrome === str) {
  return console.log(true);
} else {
  return console.log(false);
}
