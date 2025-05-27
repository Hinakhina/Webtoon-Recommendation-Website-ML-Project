const form = document.getElementById
("form")
const errormsg = document.getElementById("error")


form.addEventListener("submit", function(event){
    event.preventDefault()

    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    let confirmPassword = document.getElementById("confirm-password").value


    
// VALIDASII

    if (username.length == 0){
        errormsg.style.display = "block" //untuk display error 
        errormsg.innerHTML = "E-mail must be filled."
        return 
    }

    let hasCapital = false
    let hasnotCapital = false
    let hasDigit = false
    for (let i=0; i<password.length; i++){
        let char = password[i]
        if(char >= 'a' && char <= 'z'){
            hasnotCapital = true
        }
        if (char >= 'A' && char <= 'Z'){
            hasCapital = true
        }
        if (char >= '0' && char <= '9'){
            hasDigit = true
        }
    }

    if(password.length<8 || hasCapital == false || hasnotCapital == false || hasDigit == false){
        errormsg.style.display = "block" //untuk display error 
        errormsg.innerHTML = "Password doesn't meet the requirements. Please try again."
        return 
    }



    if(confirmPassword.length==0 || password.length<8 || password !== confirmPassword){
        errormsg.style.display = "block" //untuk display error 
        errormsg.innerHTML = "Confirm Password doesn't match. Please try again"
        return 
    }


    error.style.display = "none"

    console.log("Username: " + username)
    console.log("Password: " + password)
    console.log("Confirm Password: " + confirmPassword)

    // redirect to questionnare
    window.location.href = "../html/questionnare.html";
})