document.addEventListener('DOMContentLoaded', function() {
    // Your JavaScript code here
    let navbar = document.querySelector('.header .navbar');
    let accountform = document.querySelector('.account-form');
    let rgbtn = document.querySelector('.account-form .register-btn');
    let loginbtn = document.querySelector('.account-form .login-btn');
    let logoutbtn = document.querySelector('.account-form .user-profile .logoutt-btn');
    let editbtn = document.querySelector('.account-form .user-profile .edit-btn');
    let scrollbox = document.querySelector('.gallery');
    let reviewbox = document.querySelector('.review-slider');
    let forgotpass = document.querySelector('.account-form #forgotpass');

    // Navbar toggle
    document.querySelector('#menu-btn').onclick = () => {
        navbar.classList.add('active');
    };

    document.querySelector('#close-navbar').onclick = () => {
        navbar.classList.remove('active');
    };

    // Account form toggle
    document.querySelector('#account-btn').onclick = () => {
        accountform.classList.add('active');
    };

    document.querySelector('#close-form').onclick = () => {
        accountform.classList.remove('active');
    };


    // Call autoLogin when the page loads
    autoLogin();

    // Register and login buttons
    rgbtn.onclick = () => {
        rgbtn.classList.add('active');
        loginbtn.classList.remove('active');
        document.querySelector('.account-form .login-form').classList.remove('active');
        document.querySelector('.account-form .registration-form').classList.add('active');
        document.querySelector('.account-form .forgot-password-form').classList.remove('active');
    };

    loginbtn.onclick = () => {
        rgbtn.classList.remove('active');
        loginbtn.classList.add('active');
        document.querySelector('.account-form .login-form').classList.add('active');
        document.querySelector('.account-form .registration-form').classList.remove('active');
        document.querySelector('.account-form .forgot-password-form').classList.remove('active');
    };

    logoutbtn.onclick = () => {
        clearStoredCredentials();
        document.getElementById('popupbox').style.display="block";
        document.getElementById('pophead').innerHTML='<i class="fa-solid fa-circle-check"></i>';
        document.getElementById('poppara').innerHTML="Logout Success";
        rgbtn.style.display="";
        loginbtn.style.display="";
        document.querySelector('.account-form .login-form').classList.add('active');
        document.querySelector('.user-profile').style.display="none";
        
        function clearStoredCredentials() {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
            sessionStorage.removeItem('rememberedEmail');
            sessionStorage.removeItem('rememberedPassword');
        }
    }

    let userDetails={
        email: String,
        password: String,
        name: String,
        mobile: Number,
        country: String
    };
    editbtn.onclick = () => {
        rgbtn.style.display="none";
        loginbtn.style.display="none";
        document.querySelector('.account-form .login-form').classList.remove('active');
        document.querySelector('.account-form .registration-form').classList.remove('active');
        document.querySelector('.account-form .forgot-password-form').classList.remove('active');
        document.querySelector('.account-form .edit-details-form').classList.add('active');
        document.querySelector('.user-profile').style.display="none";
        document.getElementById('editname').value=userDetails.name;
        document.getElementById('editmobile').value=userDetails.mobile;
        document.getElementById('editcountry').value=userDetails.country;
    }

    forgotpass.onclick = () => {
        loginbtn.classList.remove('active');
        document.querySelector('.account-form .login-form').classList.remove('active');
        document.querySelector('.account-form .forgot-password-form').classList.add('active');
        document.querySelector('.account-form .registration-form').classList.remove('active');
    }


    function rememberMee(email, password) {
        // Encrypt the password before storing (for better security)
        // Here, you should use a proper encryption algorithm like AES.
        // For simplicity, this example uses a basic encryption technique (not recommended for production).
        const encryptedPassword = btoa(password); // Base64 encoding (not secure, just for demonstration)
    
        // Store the encrypted credentials in localStorage
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', encryptedPassword);
    }
    function storeCredentials(email, password) {
        // Encrypt the password before storing (for better security)
        // Here, you should use a proper encryption algorithm like AES.
        // For simplicity, this example uses a basic encryption technique (not recommended for production).
        const encryptedPassword = btoa(password); // Base64 encoding (not secure, just for demonstration)
    
        // Store the encrypted credentials in localStorage
        sessionStorage.setItem('rememberedEmail', email);
        sessionStorage.setItem('rememberedPassword', encryptedPassword);
    }
    function getStoredCredentials() {
        let email;
        let encryptedPassword;
        if(sessionStorage.getItem('rememberedEmail')!==null)
        {
            email = sessionStorage.getItem('rememberedEmail');
            encryptedPassword = sessionStorage.getItem('rememberedPassword');
        }
        else
        {
            email = localStorage.getItem('rememberedEmail');
            encryptedPassword = localStorage.getItem('rememberedPassword');
        }

        // Decrypt the password before returning (for better security)
        const password = atob(encryptedPassword); // Base64 decoding (not secure, just for demonstration)

        return { email, password };
    }

    // Log in the user using stored credentials
    function autoLogin() {
        const { email, password } = getStoredCredentials();

        if (email && password) {
            const userData = {
                email: email,
                password: password
            };

            axios.post('http://localhost:4000/login', userData)
                .then(response => {
                    if (response.data.success) {
                        console.log('Automatic Login Successful');
                        // Code for handling successful login...
                        userDetails=response.data.user;
                        rgbtn.style.display="none";
                        loginbtn.style.display="none";
                        document.querySelector('.account-form .login-form').classList.remove('active');
                        document.querySelector('.account-form .registration-form').classList.remove('active');
                        document.querySelector('.account-form .forgot-password-form').classList.remove('active');
                        document.querySelector('.user-profile .username').innerHTML="Hi, "+userDetails.name;
                        document.querySelector('.user-profile .usermail').innerHTML=userDetails.email;
                        document.querySelector('.user-profile').style.display="block";
                    } else {
                        console.log('Automatic Login Failed: Stored credentials are invalid');
                        console.log(userData);
                        // Your existing code for handling login failure...
                    }
                })
                .catch(error => {
                    console.error('Error during automatic login:', error);
                    // Your existing code for handling login errors...
                });
        }
    }

   
    
    //LogIn Form submit Event
    document.querySelector('.login-form.active').addEventListener("submit", (evt) => {
        evt.preventDefault();
        let email = document.getElementById('logmail').value;
        let passwd = document.getElementById('logpass').value;
        let rememberMe  = document.getElementById('remember-me').checked;
        const userData = {
            email: email,
            password: passwd
        };

        // console.log(userData);

        axios.post('http://localhost:4000/login', userData)
          .then(response => {
            if (response.data.success) {
              console.log('Login Successful');
              document.getElementById('popupbox').style.display="block";
              document.getElementById('pophead').innerHTML='<i class="fa-solid fa-circle-check"></i>';
              document.getElementById('poppara').innerHTML="Login Success";
              userDetails=response.data.user;
              rgbtn.style.display="none";
              loginbtn.style.display="none";
              document.querySelector('.account-form .login-form').classList.remove('active');
              document.querySelector('.account-form .registration-form').classList.remove('active');
              document.querySelector('.account-form .forgot-password-form').classList.remove('active');
              document.querySelector('.user-profile .username').innerHTML="Hi, "+userDetails.name;
              document.querySelector('.user-profile .usermail').innerHTML=userDetails.email;
              document.querySelector('.user-profile').style.display="block";

              if(rememberMe===true)
              {
                rememberMee(userData.email,userData.password);
              }
              else
              {
                storeCredentials(userData.email,userData.password);
              }


            } else {
              console.log('Login Failed: Incorrect email or password');
              document.querySelector('.user-profile').style.display="none";
              document.getElementById('popupbox').style.display="block";
              document.getElementById('pophead').innerHTML='<i class="fa-solid fa-user-slash"></i>';
              document.getElementById('poppara').innerHTML="Incorrect Username (or) Password!";
            }
          })
          .catch(error => {
            document.querySelector('.user-profile').style.display="none";
            console.error('Error logging in:', error);
            document.getElementById('popupbox').style.display="block";
            document.getElementById('pophead').innerHTML='<i class="fa-solid fa-circle-xmark"></i>';
            document.getElementById('poppara').innerHTML="Login Failed, Please try again!";
            rgbtn.style.display="";
            loginbtn.style.display="";
            document.querySelector('.account-form .login-form').classList.add('active');
          });
  
    });

    //Edit User Details Form submit
    document.body.addEventListener("submit", (evt) => {
        if (evt.target.matches('.edit-details-form.active')) {
            // Event handler code
        let name = document.getElementById('editname').value;
        let number = document.getElementById('editmobile').value;
        let country = document.getElementById('editcountry').value;
        const newUserData = {
            email: userDetails.email,
            password: userDetails.password,
            name: name,
            number: number,
            country: country
        };
        console.log(newUserData);
            axios.post('http://localhost:4000/edit-user', newUserData)
            .then(response => {
                // Handle success response
                    console.log("HIII");
                    userDetails=response.data.user;
                    console.log(userDetails);
                    document.getElementById('popupbox').style.display="block";
                    document.getElementById('pophead').innerHTML='<i class="fa-solid fa-user-check"></i>';
                    document.getElementById('poppara').innerHTML="User Details Updated";
                    document.querySelector('.account-form .edit-details-form').classList.remove('active');
                    document.querySelector('.user-profile').style.display="block";
                    document.querySelector('.user-profile .username').innerHTML="Hi, "+userDetails.name;

                })
                .catch(error => {
                // Handle error
                document.getElementById('popupbox').style.display="block";
                document.getElementById('pophead').innerHTML='<i class="fa-solid fa-circle-xmark"></i>';
                document.getElementById('poppara').innerHTML="Failed to Update Details! Please try later.";
                });
        }
    });

    //User Registration Form submit Event
    document.querySelector('.registration-form').addEventListener("submit", (evt) => {
        evt.preventDefault();
        let email = document.getElementById('regmail').value;
        let name = document.getElementById('regname').value;
        let mobile = document.getElementById('regmobile').value;
        let country = document.getElementById('regcountry').value;
        let fp = document.getElementById('regpass').value;
        let cp = document.getElementById('confpass').value;
        //checking if both password fields equal or not
        if (fp !== cp) {
            // console.log("Make sure that both the Passwords match");
            document.getElementById('popupbox').style.display="block";
            document.getElementById('pophead').innerHTML='<i class="fa-solid fa-key"></i>';
            document.getElementById('poppara').innerHTML="Make sure that both the Passwords match";
        } else {
            const userData = {
                email: email,
                password: cp,
                name: name,
                mobile: mobile,
                country: country
            };
            // console.log(userData);
            axios.post('http://localhost:4000/register-user', userData)
            .then(response => {
            // Handle success response
                if(response.data.message==="User registered successfully")
                {
                    document.getElementById('popupbox').style.display="block";
                    document.getElementById('pophead').innerHTML="Hey "+name+"!";
                    document.getElementById('poppara').innerHTML="Welcome to the Technew! Please Login to continue.";
                    console.log(response);
                    rgbtn.classList.remove('active');
                    loginbtn.classList.add('active');
                    document.querySelector('.account-form .login-form').classList.add('active');
                    document.querySelector('.account-form .registration-form').classList.remove('active');
                    document.querySelector('.account-form .forgot-password-form').classList.remove('active');
                }
                else
                {
                    document.getElementById('popupbox').style.display="block";
                    document.getElementById('pophead').innerHTML='<i class="fa-solid fa-user"></i>';
                    document.getElementById('poppara').innerHTML="User with this E-Mail already Exists!";
                }
            })
            .catch(error => {
            // Handle error
            console.error('Error registering user:', error);
            document.getElementById('popupbox').style.display="block";
            document.getElementById('pophead').innerHTML='<i class="fa-solid fa-circle-xmark"></i>';
            document.getElementById('poppara').innerHTML="Registration Failed! Please try later";
            });
        }
    });

    //Forgot Password Form submit Event
    document.querySelector('.forgot-password-form').addEventListener("submit", (evt) => {
        evt.preventDefault();
        let email = document.getElementById('formail').value;
        let mobile = document.getElementById('formob').value;
        let fp = document.getElementById('forpass').value;
        let cp = document.getElementById('conpass').value;
        //checking if both password fields equal or not
        if (fp !== cp) {
            // console.log("Make sure that both the Passwords match");
            document.getElementById('popupbox').style.display="block";
            document.getElementById('pophead').innerHTML="Error";
            document.getElementById('poppara').innerHTML="Make sure that both the Passwords match";
        } else {
            const userData = {
                email: email,
                mobile: mobile,
                password: cp
            };
            // console.log(userData);
            axios.post('http://localhost:4000/reset-password', userData)
            .then(response => {
                // alert('Password reset successfully');
                // Redirect to login page and display success message
                document.getElementById('popupbox').style.display="block";
                document.getElementById('pophead').innerHTML='Success <i class="fa-solid fa-circle-check"></i>';
                document.getElementById('poppara').innerHTML="You can now Login with new Password";
                document.querySelector('.account-form .login-form').classList.add('active');
                document.querySelector('.account-form .registration-form').classList.remove('active');
                document.querySelector('.account-form .forgot-password-form').classList.remove('active');
                loginbtn.classList.add('active');
            })
            .catch(error => {
                console.error('Error resetting password:', error);
                document.getElementById('popupbox').style.display="block";
            document.getElementById('pophead').innerHTML='<i class="fa-solid fa-circle-xmark"></i>';
            document.getElementById('poppara').innerHTML="Failed to Reset Password! Please try later";
            });
        }
    });

    // Horizontal scrolling boxes
    scrollbox.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        scrollbox.scrollLeft += evt.deltaY;
    });

    reviewbox.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        reviewbox.scrollLeft += evt.deltaY;
    });
});
