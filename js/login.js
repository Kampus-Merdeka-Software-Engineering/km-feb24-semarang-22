//Pembuatan function anonim untuk login form
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    //Deklarasi variabel dan untuk mengambil value dari inputan
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Pengecekan inputan sesuai atau tidaknya lalu alerting untuk memberitahu statusnya
    if (username !== 'team22') {
        showNotification('Wrong Username !');
    } else if (password !== 'team22') {
        showNotification('Wrong Password !');
    } else {
        showNotification('Login Successful !');
        window.location.href = 'dashboard.html';
    }
});

function showNotification(message) {
    alert(message);
}