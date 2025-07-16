const str = "m   ad am";
const isPalindrome = str.split("").reverse().join("");
if (isPalindrome === str.split(" ").join("")) {
  return console.log(true);
} else {
  return console.log(false);
}
