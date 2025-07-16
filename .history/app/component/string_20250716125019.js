
const str = "m   ad am";
const isPalindrome = str.split('').reverse().join('')
if(isPalindrome=== str.split('').join(' ')){
    return console.log(str.split(' ').join(''))
}
else{
    return console.log(false)
}
