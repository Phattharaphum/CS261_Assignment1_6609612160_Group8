document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const modal = document.getElementById('loginModal');
    const modalContent = document.getElementById('modal-content');
    const closeModalButton = document.getElementById('closeModal');

    const usernameBox = document.getElementById('userbox');
    const passwordBox = document.getElementById('passbox');

    usernameInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs); // ตรวจสอบรหัสผ่านด้วย

    function validateInputs() {
        const usernameValid = /^\d{10}$/.test(usernameInput.value);
        const passwordValid = passwordInput.value.length >= 6; // รหัสผ่านต้องมีมากกว่า 6 ตัวอักษร

        if (!usernameValid) {
            usernameBox.style.border = '3px solid #9d0208'; // ขอบแดงถ้า username ไม่ถูกต้อง
        } else {
            usernameBox.style.border = '2px solid #495057'; // ขอบสีปกติถ้าถูกต้อง
        }

        if (!passwordValid) {
            passwordBox.style.border = '3px solid #9d0208'; // ขอบแดงถ้ารหัสผ่านน้อยกว่า 6 ตัวอักษร
        } else {
            passwordBox.style.border = '2px solid #495057'; // ขอบสีปกติถ้าถูกต้อง
        }
    }

    function submitLogin() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            showModal(`
                <p class="login-failed"><span class="spatata">Login Failed !</span></p>
                <p class="login-failed-message">Username and Password Fields Must Be Filled.</p>
            `);
            return; 
        }

        const usernameValid = /^\d{10}$/.test(username);
        const passwordValid = password.length >= 6; // ตรวจสอบว่ารหัสผ่านมีมากกว่า 6 ตัวอักษร

        if (!usernameValid) {
            showModal(`
                <p class="login-failed">Alert !</p>
                <p class="login-failed-message">Username must be 10 digits</p>
            `);
            return;
        }

        if (!passwordValid) {
            showModal(`
                <p class="login-failed">Alert !</p>
                <p class="login-failed-message">Password must be at least 6 characters long</p>
            `);
            return;
        }

        if (usernameValid && passwordValid) {
            fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Application-Key': ''
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
                        <p class="login-success">Login successful !</p>
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
                        <p class="login-failed">Login Failed !</p>
                        <p class="login-failed-message">${data.message}</p>
                    `);
                }
            })
            .catch(error => {
                showModal(`
                    <p class="login-failed">Error !</p>
                    <p class="login-failed-message">Error: ${error}</p>
                `);
            });
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

    const togglePasswordButton = document.getElementById('togglePassword');

    togglePasswordButton.addEventListener('click', function () {
        // เปลี่ยนประเภท input ระหว่าง password และ text
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // เปลี่ยนข้อความของปุ่มระหว่าง Show และ Hide
        this.textContent = type === 'password' ? 'Show' : 'Hide';
    });
});
