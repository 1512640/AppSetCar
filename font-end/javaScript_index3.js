var ts = 0;
var dataList;
function initMap() {
    var directionsDisplay;
    var directionsService;
    var idGoogleMap = document.getElementById("googleMap");

    var hCm = new google.maps.LatLng(10.776530, 106.700980);
    var nhaTrang = new google.maps.LatLng(12.238791, 109.196747);
    var currentPosstion;
    //Khai bao cac thuoc tinh
    var mapProp = {
        //Tam ban do, quy dinh boi kinh do va vi do
        center: hCm,
        //set default zoom cua ban do khi duoc load
        zoom: 5,
        //Dinh nghia type
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //Truyen tham so cho cac thuoc tinh Map cho the div chua Map
    var map = new google.maps.Map(idGoogleMap, mapProp);
    var marker = new google.maps.Marker({
        position: nhaTrang,
        animation: google.maps.Animation.DRAG
    });
    marker.setMap(map);

    directionsService = new google.maps.DirectionsService();    // Khởi tạo DirectionsService - thằng này có nhiệm vụ tính toán chỉ đường cho chúng ta.
    directionsDisplay = new google.maps.DirectionsRenderer({ map: map });    // Khởi tạo DirectionsRenderer - thằng này có nhiệm vụ hiển thị chỉ đường trên bản đồ sau khi đã tính toán.

    calculateAndDisplayRoute(directionsService, directionsDisplay);    // Hàm xử lý và hiển thị kết quả chỉ đường

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({    // hàm route của DirectionsService sẽ thực hiện tính toán với các tham số truyền vào
            origin: hCm,    // điểm xuất phát
            destination: nhaTrang,    // điểm đích
            travelMode: 'DRIVING',     // phương tiện di chuyển
        }, function (response, status) {    // response trả về bao gồm tất cả các thông tin về chỉ đường
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response); // hiển thị chỉ đường trên bản đồ (nét màu đỏ từ A-B)
                showSteps(response); // Hiển thị chi tiết các bước cần phải đi đến đích.
            } else {
                window.alert('Request for getting direction is failed due to ' + status);    // Hiển thị lỗi
            }
        });
    }
    function showSteps(directionResult) {
        var myRoute = directionResult.routes[0].legs[0]; // Mình sẽ chỉ lấy 1 tuyến đường để hiển thị vì nó là tối ưu nhất cho người dùng.
        var instructions = '<h3 class="distance">Quãng đường: ' + myRoute.distance.text + '</h3><br>';
        instructions += '<h5 class="duration">Duration: ' + myRoute.duration.text + '</h5>';
        instructions += '<h5 class="start_address">From: ' + myRoute.start_address + '</h5>';
        instructions += '<h5 class="end_address">To: ' + myRoute.end_address + '</h5>';
        instructions += '<p class="steps"><ol>';

        for (var i = 0; i < myRoute.steps.length; i++) {
            instructions += '<li>' + myRoute.steps[i].instructions + '</li>';
        }
        instructions += '</p></ol>';
        document.getElementById("instructions").innerHTML = instructions; // Đặt kết quả vào <div id="instructions">
    }
    window.app_info = {};
}


window.onload = function () {
    $('#Map').css("display", "none");
    LoadData();
}
function chiDan () {
    $('#app3').css("display", "none");
    $('#Map').css("display", "block");
    initMap();
}
function hienThiDanhSach () {
    $('#Map').css("display", "none");
    $('#app3').css("display", "block");
}
function setStatus(status) {
    alert("AAAA")
    switch (status) {
        case "đã định vị":
            $('#state').css("class", "bg-warning text-white");
            break
        case "đã có xe nhận":
            $('#state').css("class", "bg-info text-white");
            break;
        case "đang di chuyển":
            $('#state').css("class", "bg-success text-white");
            break;
        case "đã hoàn thành":
            $('#state').css("class", "bg-primary text-white");
            break;
        default: $('#state').css("class", "bg -dark text - white");
    }
}
function LoadData() {
	var url = 'http://localhost:3000/getList?ts='+ ts;
    axios.get(url)
        .then(function (res) { //success
            ts = res.data.return_ts;
            dataList = res.data.inform;         
            var source = document.getElementById('template').innerHTML;
            var template = Handlebars.compile(source);
            var html = template(dataList);
            document.getElementById('list').innerHTML += html;
        }).catch(function (err) {
            alert(err);
        }).then(function () {         
           setTimeout(LoadData, 1000);         
        });
};
function getState(ind) {
    var str;
    str = document.getElementById("state" + ind).innerHTML;
    if (str === "đã nhận xe") {
        chiDan();
    }
    else alert("Chưa nhận xe");
}
$(function () {
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) $('#goTop').fadeIn();
		else $('#goTop').fadeOut();
	});
	$('#goTop').click(function () {
		$('body,html').animate({ scrollTop: 0 }, 'slow');
	});
});