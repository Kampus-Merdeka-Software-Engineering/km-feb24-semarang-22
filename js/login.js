document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if username and password match the predefined values
    if (username !== 'ael') {
        showNotification('Wrong Username !');
    } else if (password !== 'rhizn') {
        showNotification('Wrong Password !');
    } else {
        showNotification('Login Successful !');
        window.location.href = 'dashboard.html';
    }
});

function showNotification(message) {
    alert(message);
}