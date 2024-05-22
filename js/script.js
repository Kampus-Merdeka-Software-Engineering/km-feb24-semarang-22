function getCurrentTime() {
    // Buat objek Date untuk mendapatkan waktu saat ini
    var now = new Date();

    // Dapatkan informasi waktu yang diinginkan
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Formatting agar waktu terlihat sesuai dengan format yang diinginkan (misal: HH:MM:SS)
    var formattedTime = padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);

    // Tampilkan waktu dalam elemen div dengan id "current-time"
    document.getElementById("current-time").textContent = formattedTime;
}

// Fungsi untuk menambahkan nol di depan angka jika angka tersebut kurang dari 10 (untuk format waktu)
function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}

// Panggil fungsi getCurrentTime() setiap detik agar waktu terus diperbarui
setInterval(getCurrentTime, 1000);

// Panggil getCurrentTime() untuk pertama kali saat halaman dimuat
getCurrentTime();

function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main-dashboard").style.transition = "margin-left 0.5s";
    document.getElementById("main-dashboard").style.marginLeft = "200px";

    document.getElementById("main-menu").style.transition = "margin-left 0.5s";
    document.getElementById("main-menu").style.marginLeft = "200px";

    var header = document.querySelector('.footer > p');
    header.style.transition = "margin-left 0.5s";
    header.style.marginLeft = "200px";

    var menuSection = document.querySelector('.menu-section');
    menuSection.style.marginLeft = "200px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main-dashboard").style.transition = "margin-left 0.5s";
    document.getElementById("main-dashboard").style.marginLeft = "0";

    var header = document.querySelector('.footer > p');
    header.style.transition = "margin-left 0.5s";
    header.style.marginLeft = "0px";

}

// Fungsi untuk menentukan musim berdasarkan bulan
function getSeason(month) {
    // Jika bulan antara Maret dan Mei, kembalikan "Spring"
    if (month >= 3 && month <= 5) {
        return "(Spring 🌸)";
    }
    // Jika bulan antara Juni dan Agustus, kembalikan "Summer"
    else if (month >= 6 && month <= 8) {
        return "(Summer ☀️)";
    }
    // Jika bulan antara September dan November, kembalikan "Fall"
    else if (month >= 9 && month <= 11) {
        return "(Fall 🍂)";
    }
    // Bulan antara Desember hingga Februari, kembalikan "Winter"
    else {
        return "(Winter ❄️)";
    }
}

    // Fungsi untuk menambahkan nol di depan angka jika angka tersebut kurang dari 10 (untuk format waktu dan tanggal)
    function padZero(num) {
        return (num < 10 ? '0' : '') + num;
    }

