document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if username and password match the predefined values
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