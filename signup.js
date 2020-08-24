const form = document.querySelector('form');
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://socialme-backend.vykio.vercel.app';

/* Definition of html elements */
const usernameElement = document.getElementById("username");
const passwordElement = document.getElementById("password");
const passwordConfirmElement = document.getElementById("password_confirm");
const errorElement = document.getElementById("errorElement");

/* Error message */
var errorMessage = '';

/* Template of user (signup) */
const userTryingToSignup = {
    username: '',
    password: '',
    confirm_password: ''
}

/* validate.js constraints */
var constraints = {
    username: { 
        presence: true,
        format : {
            pattern: "^[a-zA-Z0-9_]*$",
            message: "a-z A-Z 0-9 _"
        },
        length: {
            minimum: 2,
            maximum: 30,
            message: "length between 2 and 30"
        }
    },
    password: {
        presence: true,
        format: {
            pattern: "^[a-zA-Z0-9\!\#\=\?\_\-]*$",
            message: "Le mot de passe ne doit contenir que des lettres, des chiffres et caractères spéciaux (_!?#=-)"
        },
        length: {
            minimum: 6,
            message: "password > 6"
        }
    },
    confirm_password: {
        equality: "password"
    }
};

function clearErrorMessage() {
    errorMessage = '';
    refreshAlert();
}


/* Dynamic update of userTryingToSignup Object ! */
usernameElement.addEventListener("keyup", (event) => {
    if (userTryingToSignup.username != usernameElement.value) {
        clearErrorMessage();
    }
    userTryingToSignup.username = usernameElement.value;
});

passwordElement.addEventListener("keyup", (event) => {
    if (userTryingToSignup.password != passwordElement.value) {
        clearErrorMessage();
    }
    userTryingToSignup.password = passwordElement.value;
});

passwordConfirmElement.addEventListener("keyup", (event) => {
    if (userTryingToSignup.confirm_password != passwordConfirmElement.value) {
        clearErrorMessage();
    }
    userTryingToSignup.confirm_password = passwordConfirmElement.value;
});


function validUser() {
    /*if (userTryingToSignup.password != userTryingToSignup.confirm_password) {
        errorMessage = 'Passwords must match !';
        refreshAlert();
        return false;
    } */

    const result = validate(userTryingToSignup, constraints);
    if (result) {
        errorMessage = result[Object.keys(result)[0]];
        refreshAlert();
        return false;
    }

    errorMessage = '';
    refreshAlert();
    return true;

}

function refreshAlert() {
    if (errorMessage != '') {
        errorElement.textContent = errorMessage;
        errorElement.style.display = '';
    } else {
        errorElement.style.display = 'none';
    }
    
}

function signup() {

    const postBody = {
        username: userTryingToSignup.username,
        password: userTryingToSignup.password
    };

    fetch(API_URL + "/auth/signup", {
        method: 'POST',
        body : JSON.stringify(postBody),
        headers : {
            'content-type': 'application/json'
        }
    })
        .then((response) => {
            console.log(response);
            if (response.ok) {
                return response.json();
            }

            return response.json().then((error) => {
                throw new Error(error.message);
            });
        })
        .then((user) => {
            console.log(user);
            window.location.replace("/login");
        }).catch((error) => {
            errorMessage = error.message;
            refreshAlert();
        });

}

/* Submit the FORM ! */
form.addEventListener("submit", (event) => {
    /* Prevent default action */
    event.preventDefault();
    
    /*Custom Code */

    console.log(userTryingToSignup);

    if (validUser()) {
        signup();
    }

});