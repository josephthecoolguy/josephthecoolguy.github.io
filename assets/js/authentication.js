function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
function hasQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(name);
}

function hasCookie(name) {
    return document.cookie.includes(name);
}

if (hasQueryParam('error')) {
    document.getElementById('infodata').innerText = htmlEncode(getQueryParam('error'))
}


if (hasQueryParam('username')) {
    document.getElementById('username').value = htmlEncode(getQueryParam('username'))
}

if (hasQueryParam('email')) {
    document.getElementById('username').value = htmlEncode(getQueryParam('email'))
}

if (hasQueryParam('invitecode')) {
    document.getElementById('invitecode').value = htmlEncode(getQueryParam('invitecode'))
}



function htmlEncode(value) {
    // Implement your HTML encoding logic
    return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


function discordlogin() {
    window.location.href = 'https://discord.com/oauth2/authorize?client_id=550142208335151104&redirect_uri=https%3A%2F%2Fzuxi.dev%2Fapi%2Fv7%2Fdiscord%2Flogin&response_type=code&scope=identify%20guilds.join';
}

async function handleFormSubmit(event, form) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const formData = new FormData(form);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    // Get the current browser path

    try {
        //      const apiUrl = `https://zuxi.dev/${currentPath}`; 
       // const apiUrl = window.location.href;
       
       const apiUrl = "http://localhost:1337/login"
       const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers needed for your API request
            },
            body: JSON.stringify(formDataObject),
        });

        if (!response.ok) {
            // Handle non-successful response (e.g., display an error message)
            const errorData = await response.json();
            if (errorData.is2faerror) {

                let base2f = "https://zuxi.dev/twofactor"

                if (hasQueryParam("ret")) {
                    base2f += "?ret="+ getQueryParam("ret")
                }


                window.location.href = base2f
            }

            console.error('Error occurred during API request:', errorData);
            document.getElementById('infodata').innerText = errorData.error;
            var infoAlert = document.querySelector('.custom-alert-info');
            infoAlert.style.backgroundColor = '#e74c3c'; // Red background color
            infoAlert.style.borderColor = '#e74c3c'; // Red border color

            //  alert(errorData.error || 'An error occurred during the request.');
        } else {
            // Handle successful response (e.g., redirect to a success page)
            const successData = await response.json();
            const cookies = response.headers.get('set-cookie');
            console.log('Success response from API:', successData);
            document.cookie = cookies;

            if (hasQueryParam('ret') || successData.ret) {
                window.location.href = getQueryParam('ret') || successData.ret
            }
            else {
                window.location.pathname = "/dashboard"
            }
            // Redirect logic or other actions for success
        }
    } catch (error) {
        document.getElementById('infodata').innerText = "Something went wrong, Try Again or Contact Zuxi";
        var infoAlert = document.querySelector('.custom-alert-info');
        infoAlert.style.backgroundColor = '#e74c3c'; // Red background color
        infoAlert.style.borderColor = '#e74c3c'; // Red border color
    }
}

if (hasCookie('auth')) {
    if (hasQueryParam('ret')) {
        window.location.href = getQueryParam('ret')
    }
    else {
        window.location.pathname = "/dashboard"
    }
}

