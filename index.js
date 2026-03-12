const singBtn = document.getElementById('btn-sing').addEventListener('click', function () {

    const userInput = document.getElementById('user')
    const userValue = userInput.value
    
    const passInput = document.getElementById('pass') 
    const passValue = passInput.value

    if (userValue === ''){
        alert('Please enter your Username')
        return
    }
    else if(userValue !== 'admin'){
        alert('User Invalid')
        return
    }
    if (passValue === ''){
        alert('Please enter your Password')
        return
    }
    if(passValue !== 'admin123'){
        alert('Password Invalid')
        return
    }
    else{
        window.location.assign('./home.html')
    }
})