document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const modal = document.getElementById('loginModal');
    const modalContent = document.getElementById('modal-content');
    const closeModalButton = document.getElementById('closeModal');

    const usernameBox = document.getElementById('userbox');
    const passwordBox = document.getElementById('passbox');

    usernameInput.addEventListener('input', validateInputs);
    

    function validateInputs() {
        const usernameValid = /^\d{10}$/.test(usernameInput.value);
       

        if (!usernameValid) {
            usernameBox.style.border = '3px solid #9d0208';
            passwordBox.style.border = '2px solid #495057';
        } else {
            usernameBox.style.border = '2px solid #495057';
            passwordBox.style.border = '2px solid #495057';
        }
    }

    function submitLogin() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            showModal(`
                <p class="login-failed"><span class="spatata">Error:</span></p>
                <p class="login-failed-message">Please fill in both username and password.</p>
            `);
            return; 
        }

        const usernameValid = /^\d{10}$/.test(username);
        const passwordValid = password;

        if (usernameValid && passwordValid) {
            fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Application-Key': '-'
                },
                body: JSON.stringify({
                    UserName: username,
                    PassWord: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === true) {
                    showModal(`
                        <p class="login-success">Login successful!</p>
                        <p class="username"><span class="spatata">Username:</span> ${data.username}</p>
                        <p class="email"><span class="spatata">Email:</span> ${data.email}</p>
                        <p class="displayname-en"><span class="spatata">Name (EN):</span> ${data.displayname_en}</p>
                        <p class="displayname-th"><span class="spatata">Name (TH):</span> ${data.displayname_th}</p>
                        <p class="faculty"><span class="spatata">Faculty:</span> ${data.faculty}</p>
                        <p class="department"><span class="spatata">Department:</span> ${data.department}</p>
                    `);
                    usernameInput.value = '';
                    passwordInput.value = '';
                } else {
                    showModal(`
                        <p class="login-failed">Login failed</p>
                        <p class="login-failed-message">${data.message}</p>
                    `);
                }
            })
            .catch(error => {
                showModal(`
                    <p class="login-failed">Error</p>
                    <p class="login-failed-message">Error: ${error}</p>
                `);
            });
        } else {
            showModal(`
                <p class="login-failed">Error</p>
                <p class="login-failed-message">Username must be 10 digits</p>
            `);
        
            
        }
    }

  const modalBackdrop = document.createElement('div');
    modalBackdrop.classList.add('modal-backdrop');
    document.body.appendChild(modalBackdrop);

    function showModal(content) {
        modalContent.innerHTML = content;
        modal.style.display = 'block';
        modalBackdrop.style.display = 'block'; 
    }

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
        modalBackdrop.style.display = 'none'; 
    });

    window.submitLogin = submitLogin;
});
