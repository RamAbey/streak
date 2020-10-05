

var num1 = document.getElementById("num1");
var num2 = document.getElementById("num2");
var num3 = document.getElementById("num3");



num1.addEventListener('input', (e) => {
    verifyNumber(e.target.value)
})
num2.addEventListener('input', (e) => {
    verifyNumber(e.target.value)
})
num3.addEventListener('input', (e) => {
    verifyNumber(e.target.value)
})

function verifyNumber(number) {
    number = parseInt(number, 10)
    if (number) {
        if (number > 0 && number < 21) {
            console.log(`Your number is ${number}`)
            document.getElementById('error').style.display = 'none'
            return true
        } else {
            showError()
            console.log("Not between 1 and 20.")
            return false
        }
    } else {
        showError()
        return false
    }
}

function showError() {
    document.getElementById('error').style.display='block'
}