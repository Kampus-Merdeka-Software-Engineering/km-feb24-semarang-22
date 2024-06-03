let ctx1 = document.getElementById('BusyTimeChart').getContext('2d');
let ctx2 = document.getElementById('TopPizzaChart').getContext('2d');
let ctx3 = document.getElementById('TopPizzaCategory').getContext('2d');
let ctx4 = document.getElementById('TopPizzaSize').getContext('2d');
let ctx5 = document.getElementById('TotalSalesYear').getContext('2d');
let myChart1, myChart2, myChart3, myChart4, myChart5;

const selectElement = document.getElementById('month-select');
const sortElement = document.getElementById('sort');

let month;
let sort;

selectElement.addEventListener("change", (e) =>{
    month = e.target.value;
    if (month > '0'){
        fetchJsonBusyTime(month);
        fetchTopPizzaChart(month);
        fetchTopPizzaCategory(month);
        fetchTopPizzaSize(month);
        fetchsummaryData(month);
        fetchTrending(month);
        document.getElementById('current-season').textContent = getSeason(month);
    } else if (month === '0') {
        fetch_all();
        fetchTrending(month);
        document.getElementById('current-season').textContent = " ";
    }
})

function fetch_all(){
    fetch("/json/pembelian shift perbulan.json")
    .then(response => response.json())
    .then(data => {
        jsonData1 = data;
        createBusyTimeChart(jsonData1);
    });

    fetch("/json/Top5PizzaNew.json")
    .then(response => response.json())
    .then(data => {
        jsonData2 = data;
        createTopPizzaChart(jsonData2);
    });

    fetch("/json/jenisPizzaPerbulan.json")
    .then(response => response.json())
    .then(data => {
        jsonData3 = data;
        createTopPizzaCategory(jsonData3);
    });

    fetch("/json/sizePizzaPerbulan.json")
    .then(response => response.json())
    .then(data => {
        jsonData4 = data;
        createTopPizzaSize(jsonData4);
    });

    fetch("/json/Penjualan All Pizza Perbulan.json")
    .then(response => response.json())
    .then(data => {
        jsonData6 = data;
        summaryData(jsonData6);
    });
}

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
                borderColor: '#8E2323',
                backgroundColor: [
                    'rgba(142, 35, 35, 0.8)',
                    'rgba(215, 83, 50, 0.8)',
                    'rgba(242, 134, 107, 0.8)',
                    'rgba(255, 190, 174, 0.8)',
                    'rgba(255, 219, 184, 0.8)',
                ],
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
            plugins: {
                legend: {
                    display: false // Sembunyikan legend
                }
            }
        }
    });

    sortElement.addEventListener("change", (e) =>{
        sort = e.target.value;
        if (sort === 'asc'){
            aggregatedData.sort((a, b) => a.pizza_terjual - b.pizza_terjual);
        } else {
            aggregatedData.sort((a, b) => b.pizza_terjual - a.pizza_terjual);
        }

        // Update the chart with sorted data
        myChart1.data.labels = aggregatedData.map(item => item.shift_waktu);
        myChart1.data.datasets[0].data = aggregatedData.map(item => item.pizza_terjual);
        myChart1.update();
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
      let top5Data = aggregatedData.slice(0, 5);

    myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: top5Data.map(row => row.Name),
            datasets: [{
                label: 'Total Pizza Sold',
                data: top5Data.map(row => row.TotalPurchases),
                borderWidth: 1,
                borderColor: '#8E2323',
                backgroundColor: [
                    'rgba(142, 35, 35, 0.8)',
                    'rgba(215, 83, 50, 0.8)',
                    'rgba(242, 134, 107, 0.8)',
                    'rgba(255, 190, 174, 0.8)',
                    'rgba(255, 219, 184, 0.8)',
                ],
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
            plugins: {
                legend: {
                    display: false // Sembunyikan legend
                }
            }
        }
    });

    sortElement.addEventListener("change", (e) =>{
        sort = e.target.value;
        if (sort === 'asc'){
            aggregatedData.sort((a, b) => a.TotalPurchases - b.TotalPurchases);
            top5Data = aggregatedData.slice(0, 5);
        } else {
            aggregatedData.sort((a, b) => b.TotalPurchases - a.TotalPurchases);
            top5Data = aggregatedData.slice(0, 5);
        }

        // Update the chart with sorted data
        myChart2.data.labels = top5Data.map(item => item.Name);
        myChart2.data.datasets[0].data = top5Data.map(item => item.TotalPurchases);
        myChart2.update();
        });
}

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
                borderColor: '#8E2323',
                backgroundColor: [
                    'rgba(142, 35, 35, 0.8)',
                    'rgba(215, 83, 50, 0.8)',
                    'rgba(242, 134, 107, 0.8)',
                    'rgba(255, 190, 174, 0.8)',
                    'rgba(255, 219, 184, 0.8)',
                ],
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
                borderColor: '#8E2323',
                backgroundColor: [
                    'rgba(142, 35, 35, 0.8)',
                    'rgba(215, 83, 50, 0.8)',
                    'rgba(242, 134, 107, 0.8)',
                    'rgba(255, 190, 174, 0.8)',
                    'rgba(255, 219, 184, 0.8)',
                ],
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
            plugins: {
                legend: {
                    display: false // Sembunyikan legend
                }
            }
        },
    });

    sortElement.addEventListener("change", (e) =>{
        sort = e.target.value;
        if (sort === 'asc'){
            aggregatedData.sort((a, b) => a.jumlah_total_pizza_terjual - b.jumlah_total_pizza_terjual);
        } else {
            aggregatedData.sort((a, b) => b.jumlah_total_pizza_terjual - a.jumlah_total_pizza_terjual);
        }

        // Update the chart with sorted data
        myChart4.data.labels = aggregatedData.map(item => item.size);
        myChart4.data.datasets[0].data = aggregatedData.map(item => item.jumlah_total_pizza_terjual);
        myChart4.update();
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
    if (myChart5) {
        myChart5.destroy(); // Destroy existing chart before creating a new one
    }
    // Mengurutkan data berdasarkan bulan
data.sort((a, b) => a.month - b.month);

myChart5 = new Chart(ctx5, {
    type: 'line',
    data: {
        labels: data.map(row => row.month), // Gunakan bulan sebagai label
        datasets: [{
            data: data.map(row => row.total), // Gunakan total sebagai data
            borderWidth: 1,
            backgroundColor: 'rgba(242, 134, 107, 0.5)',
            pointBackgroundColor: '#8E2323', // Warna latar belakang
            borderColor: '#8E2323', // Warna garis
            fill: true, // Tidak mengisi area di bawah garis
            lineTension: 0.4,
            pointRadius: 3
        }]
    },
    options: {
        scales: {
            y: {
                suggestedMin: 60000, // Mulai sumbu y dari 60.000
                ticks: {
                    precision: 0 // Atur presisi agar tidak ada desimal
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Sembunyikan legend
            }
        }
    }
});

sortElement.addEventListener("change", (e) => {
    sort = e.target.value;

    // Sort data based on selected option
    if (sort === 'asc') {
        data.sort((a, b) => a.total - b.total);
    } else {
        data.sort((a, b) => b.total - a.total);
    }

    // Update chart with sorted data
    myChart5.data.labels = data.map(row => row.month);
    myChart5.data.datasets[0].data = data.map(row => row.total);
    console.log(data)
    myChart5.update();
});
}

// TRENDING TABLE
    function fetchTrending(month=""){
        fetch("/json/trending.json")
        .then(response => response.json())
        .then(data => {
            if (month > '0'){
                const filteredData = data.filter(item => {
                    document.getElementById("alert-trending").textContent = "";
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

                const tableHead = document.getElementById('pizza-table-head');
                tableHead.innerHTML = ''; // Kosongkan thead jika sudah ada isinya sebelumnya
            
                const headerRow = document.createElement('tr');
                const headers = ['Pizza Name', 'Total', 'Month'];
            
                headers.forEach(headerText => {
                    const header = document.createElement('th');
                    header.textContent = headerText;
                    headerRow.appendChild(header);
                });
            
                tableHead.appendChild(headerRow);
    
                // Buat tabel HTML dan masukkan data yang difilter ke dalamnya
                const tableBody = document.getElementById("pizza-table-body");
                    tableBody.innerHTML = "";

                filteredData.forEach(item => {
                    var row = document.createElement("tr");
                    var nameCell = document.createElement("td");
                    nameCell.textContent = item.pizza_name;
                    var totalCell = document.createElement("td");
                    totalCell.textContent = item.total;
                    var monthCell = document.createElement("td");
                    monthCell.textContent = item.month;
                    row.appendChild(nameCell);
                    row.appendChild(totalCell);
                    row.appendChild(monthCell);
                    tableBody.appendChild(row);
                });
            } else if (month === '0'){
                const alertSeason = document.getElementById("alert-trending");
                alertSeason.textContent = "Please Choose Month First to show";
                alertSeason.style.color = "red";
                const tableBody = document.getElementById("pizza-table-body");
                tableBody.innerHTML = "";
                const tableHead = document.getElementById('pizza-table-head');
                tableHead.innerHTML = "";
            }
        });
    }

    function fetchsummaryData(month=""){
        fetch("/json/Penjualan All Pizza Perbulan.json")
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(object => object.month === month);
            summaryData(filteredData);
        });
    }


function summaryData(data) {
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



fetch_all();