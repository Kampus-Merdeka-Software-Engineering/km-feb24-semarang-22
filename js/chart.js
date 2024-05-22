let ctx1 = document.getElementById('BusyTimeChart').getContext('2d');
let ctx2 = document.getElementById('TopPizzaChart').getContext('2d');
let ctx3 = document.getElementById('TopPizzaCategory').getContext('2d');
let ctx4 = document.getElementById('TopPizzaSize').getContext('2d');
let ctx5 = document.getElementById('TotalSalesYear').getContext('2d');
let myChart1, myChart2, myChart3, myChart4, myChart5;

const selectElement = document.getElementById('month-select');

let month;

selectElement.addEventListener("change", (e) =>{
    month = e.target.value;
    fetchJsonBusyTime(month);
    fetchTopPizzaChart(month);
    fetchTopPizzaCategory(month);
    fetchTopPizzaSize(month);
})

fetch("/json/pembelian shift perbulan.json")
    .then(response => response.json())
    .then(data => {
        jsonData1 = data;
        createBusyTimeChart(jsonData1);
    });

function fetchJsonBusyTime(month=""){
    fetch("/json/pembelian shift perbulan.json")
    .then(response => response.json())
    .then(data => {
        const filteredData = data.filter(object => object.bulan === month);
        const jsonData1 = filteredData
        createBusyTimeChart(jsonData1);
    });
}

function createBusyTimeChart(data) {
    if (myChart1) {
        myChart1.destroy(); // Destroy existing chart before creating a new one
    }

    const aggregatedData = data.reduce((acc, current) => {
        // Mencari index berdasarkan shift_waktu
        const index = acc.findIndex(item => item.shift_waktu === current.shift_waktu);
        
        if (index === -1) {
          // Jika belum ada kategori shift_waktu ini, tambahkan entry baru
          acc.push({
            shift_waktu: current.shift_waktu,
            pizza_terjual: parseInt(current.pizza_terjual)
          });
        } else {
          // Jika sudah ada, tambahkan pizza_terjual ke kategori yang ada
          acc[index].pizza_terjual += parseInt(current.pizza_terjual);
        }
        
        return acc;
      }, []);

    myChart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: aggregatedData.map(item => item.shift_waktu),
            datasets: [{
                label: 'Time',
                data: aggregatedData.map(item => item.pizza_terjual),
                borderWidth: 1,
                backgroundColor: [
                    '#332e2c',
                    '#3d493e',
                    '#4a5540',
                    '#556038',
                    '#616d33',
                ],
                hoverBackgroundColor: "#d4ba88",
                hoverBorderColor: "#663300",
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

// fetch("/json/BusyTime.json")
//     .then(function (response) {
//         if (response.status == 200) {
//             return response.json();
//         }
//     })
//     .then(function (data) {
//         jsonData1 = data;
//         createBusyTimeChart(jsonData1);
//     });

// function createBusyTimeChart(data) {
//     myChart1 = new Chart(ctx1, {
//         type: 'bar',
//         data: {
//             labels: data.map(row => row.TimeShift),
//             datasets: [{
//                 label: 'Time',
//                 data: data.map(row => row.TotalPizzaSold),
//                 borderWidth: 1,
//                 backgroundColor: [
//                     '#332e2c',
//                     '#3d493e',
//                     '#4a5540',
//                     '#556038',
//                     '#616d33',
//                 ],
//                 hoverBackgroundColor: "#d4ba88",
//                 hoverBorderColor: "#663300",
//             }]
//         },
//         options: {
//             indexAxis: 'y',
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             },   
//             responsive: true,
//             maintainAspectRatio: false,
//         }
//     });
// }

    fetch("/json/Top5PizzaNew.json")
    .then(response => response.json())
    .then(data => {
        jsonData2 = data;
        createTopPizzaChart(jsonData2);
    });

    function fetchTopPizzaChart(month=""){
        fetch("/json/Top5PizzaNew.json")
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(object => object.month === month);
            const jsonData2 = filteredData
            createTopPizzaChart(jsonData2);
        });
    }

function createTopPizzaChart(data) {
    if (myChart2) {
        myChart2.destroy(); // Destroy existing chart before creating a new one
    }

    const aggregatedData = data.reduce((acc, current) => {
        const index = acc.findIndex(item => item.Name === current.Name);
      
        if (index === -1) {
          // Jika belum ada pizza dengan nama ini, tambahkan entry baru
          acc.push({
            Name: current.Name,
            TotalPurchases: parseInt(current.TotalPurchases)
          });
        } else {
          // Jika sudah ada, tambahkan TotalPurchases ke pizza yang sesuai
          acc[index].TotalPurchases += parseInt(current.TotalPurchases);
        }
      
        return acc;
      }, []);

      aggregatedData.sort((a, b) => b.TotalPurchases - a.TotalPurchases);
      const top5Data = aggregatedData.slice(0, 5);

    myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: top5Data.map(row => row.Name),
            datasets: [{
                label: 'Total Pizza Sold',
                data: top5Data.map(row => row.TotalPurchases),
                borderWidth: 1,
                backgroundColor: [
                    '#332e2c',
                    '#3d493e',
                    '#4a5540',
                    '#556038',
                    '#616d33',
                ],
                hoverBackgroundColor: "#d4ba88",
                hoverBorderColor: "#663300",
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

fetch("/json/jenisPizzaPerbulan.json")
    .then(response => response.json())
    .then(data => {
        jsonData3 = data;
        createTopPizzaCategory(jsonData3);
    });

    function fetchTopPizzaCategory(month=""){
        fetch("/json/jenisPizzaPerbulan.json")
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(object => object.month === month);
            const jsonData3 = filteredData
            createTopPizzaCategory(jsonData3);
        });
    }

function createTopPizzaCategory(data) {
    if (myChart3) {
        myChart3.destroy(); // Destroy existing chart before creating a new one
    }

    const aggregatedData = data.reduce((acc, current) => {
        const index = acc.findIndex(item => item.category === current.category);
      
        if (index === -1) {
          // Jika belum ada pizza dengan nama ini, tambahkan entry baru
          acc.push({
            category: current.category,
            total: parseInt(current.total)
          });
        } else {
          // Jika sudah ada, tambahkan TotalPurchases ke pizza yang sesuai
          acc[index].total += parseInt(current.total);
        }
      
        return acc;
      }, []);

    myChart3 = new Chart(ctx3, {
        type: 'doughnut',
        data: {
            labels: aggregatedData.map(row => row.category),
            datasets: [{
                label: 'Total Pizza Sold',
                data: aggregatedData.map(row => row.total),
                borderWidth: 1,
                backgroundColor: [
                    '#332e2c',
                    '#3d493e',
                    '#4a5540',
                    '#556038',
                    '#616d33',
                ],
                hoverBackgroundColor: "#d4ba88",
                hoverBorderColor: "#663300",
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            width: 200, // atur lebar grafik dalam piksel
            height: 100, // atur tinggi grafik dalam piksel
        }
    });
}

fetch("/json/sizePizzaPerbulan.json")
    .then(response => response.json())
    .then(data => {
        jsonData4 = data;
        createTopPizzaSize(jsonData4);
    });

    function fetchTopPizzaSize(month=""){
        fetch("/json/sizePizzaPerbulan.json")
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(object => object.bulan === month);
            const jsonData4 = filteredData
            createTopPizzaSize(jsonData4);
        });
    }

function createTopPizzaSize(data) {
    if (myChart4) {
        myChart4.destroy(); // Destroy existing chart before creating a new one
    }

    const aggregatedData = data.reduce((acc, current) => {
        const index = acc.findIndex(item => item.size === current.size);
      
        if (index === -1) {
          // Jika belum ada pizza dengan nama ini, tambahkan entry baru
          acc.push({
            size: current.size,
            jumlah_total_pizza_terjual : parseInt(current.jumlah_total_pizza_terjual)
          });
        } else {
          // Jika sudah ada, tambahkan TotalPurchases ke pizza yang sesuai
          acc[index].jumlah_total_pizza_terjual += parseInt(current.jumlah_total_pizza_terjual);
        }
      
        return acc;
      }, []);
      
      aggregatedData.sort((a, b) => b.jumlah_total_pizza_terjual - a.jumlah_total_pizza_terjual);

    myChart4 = new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: aggregatedData.map(row => row.size),
            datasets: [{
                label: 'Total Pizza Sold',
                data: aggregatedData.map(row => row.jumlah_total_pizza_terjual),
                borderWidth: 1,
                backgroundColor: [
                    '#332e2c',
                    '#3d493e',
                    '#4a5540',
                    '#556038',
                    '#616d33',
                ],
                hoverBackgroundColor: "#d4ba88",
                hoverBorderColor: "#663300",
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

fetch("/json/Penjualan All Pizza Perbulan.json")
.then(function (response) {
    if (response.status == 200) {
        return response.json();
    }
})
.then(function (data) {
    jsonData5 = data;
    createTotalSalesYear(jsonData5);
});

function createTotalSalesYear(data) {
// Mengurutkan data berdasarkan bulan
data.sort((a, b) => a.month - b.month);

// Ubah tipe data month menjadi integer
data.forEach(item => {
    item.month = parseInt(item.month);
});

myChart5 = new Chart(ctx5, {
    type: 'line',
    data: {
        labels: data.map(row => row.month), // Gunakan bulan sebagai label
        datasets: [{
            label: 'Total Sales Per Year',
            data: data.map(row => row.total), // Gunakan total sebagai data
            borderWidth: 2,
            backgroundColor: '#332e2c', // Warna latar belakang
            borderColor: '#616d33', // Warna garis
            fill: false, // Tidak mengisi area di bawah garis
            lineTension: 0.4,
            pointRadius: 5
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear', // Gunakan skala linear untuk sumbu x
                ticks: {
                    stepSize: 1, // Langkah interval
                    precision: 0 // Atur presisi agar tidak ada desimal
                }
            },
            y: {
                suggestedMin: 60000, // Mulai sumbu y dari 60.000
                ticks: {
                    precision: 0 // Atur presisi agar tidak ada desimal
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});
}

// TRENDING TABLE
function fetchDataAndCreateTable() {
    selectElement.addEventListener("change", (e) =>{
        month = e.target.value;
        fetchTrending(month)
    })

    function fetchTrending(month=""){
        fetch("/json/trending.json")
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(item => {
                var data = parseInt(item.month);
                if (month >= 3 && month <= 5) { // Musim Semi (Maret hingga Mei)
                    return data >= 3 && data <= 5;
                } else if (month >= 6 && month <= 8) { // Musim Panas (Juni hingga Agustus)
                    return data >= 6 && data <= 8;
                } else if (month >= 9 && month <= 11) { // Musim Gugur (September hingga November)
                    return data >= 9 && data <= 11;
                } else { // Musim Dingin (Desember hingga Februari)
                    return data >= 12 || data <= 2;
                }
            });

            // Mengurutkan data berdasarkan total secara menurun (dari besar ke kecil)
            filteredData.sort((a, b) => b.total - a.total);

            // Buat tabel HTML dan masukkan data yang difilter ke dalamnya
            const tableBody = document.getElementById("pizza-table-body");
                tableBody.innerHTML = "";
            filteredData.forEach(item => {
                var row = document.createElement("tr");
                var nameCell = document.createElement("td");
                nameCell.textContent = item.pizza_name;
                var totalCell = document.createElement("td");
                totalCell.textContent = item.total;
                row.appendChild(nameCell);
                row.appendChild(totalCell);
                tableBody.appendChild(row);
            });
        });
    }
}

fetch("/json/Penjualan All Pizza Perbulan.json")
    .then(response => response.json())
    .then(data => {
        jsonData6 = data;
        summaryData(jsonData6);
    });

    selectElement.addEventListener("change", (e) =>{
        month = e.target.value;
        fetchsummaryData(month)
    })

    function fetchsummaryData(month=""){
        fetch("/json/Penjualan All Pizza Perbulan.json")
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(object => object.month === month);
            summaryData(filteredData);
        });
    }


function summaryData(data) {
    if (!Array.isArray(data)) {
        console.error("Data is not an array:", data);
        return;
    }
        const aggregatedData = data.reduce((acc, current) => {
            acc.total += parseFloat(current.total);
            acc.total_quantity += parseInt(current.total_quantity);
            return acc;
          }, { total: 0, total_quantity: 0 });
          
          // Memformat hasil ke dalam array sesuai dengan output yang diharapkan
          const result = [{
            total: aggregatedData.total.toFixed(0), // Menggunakan toFixed untuk memastikan format desimal
            total_quantity: aggregatedData.total_quantity.toString()
          }];

          // Menaruh nilai ke dalam elemen HTML
        var totalElement = document.getElementById("total-value");
        var totalQuantityElement = document.getElementById("total-quantity-value");

        totalElement.textContent = "$" + result[0].total;
        totalQuantityElement.textContent = result[0].total_quantity;
}