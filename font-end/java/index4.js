var map;
var success=false;
var user;
var add_start;
var add_end;
var directionsDisplay;
var directionsService;
var pos;
//var ds;
//var ind=1;
var marker;
var LatlngUser; // dau vao 
var ts=0;
window.onload = function () {
  //$("#registration").css('display', 'none');
    initMap(); 
}

  function initMap() {
        
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
        center: { lat: 10.771530, lng: 106.657860 }
      });
    directionsService = new google.maps.DirectionsService();    // Khởi tạo DirectionsService - thằng này có nhiệm vụ tính toán chỉ đường cho chúng ta.
    directionsDisplay = new google.maps.DirectionsRenderer({ map: map });    // Khởi tạo DirectionsRenderer - thằng này có nhiệm vụ hiển thị chỉ đường trên bản đồ sau khi đã tính toán.
    map.addListener('click', function(e) {
    geoLocation(e.latLng);
    
    }); 
  }
  function geoLocation(latLng){      ///hàm lấy vị trí hiện tại
    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,      //loction của vị trí hiện tại
              lng: position.coords.longitude
            };
            //alert( "vi tri hien tai: "+ pos.lat+", "+ pos.lng);
            var origin1 =latLng;
            var destinationA =new google.maps.LatLng(parseFloat(position.coords.latitude), parseFloat( position.coords.longitude));
            //alert( "vi tri hien tai: "+ origin1 +","+ destinationA);
            placeMarkerAndPanTo(destinationA, map);
            var service = new google.maps.DistanceMatrixService();  //dki một dịch vụ tính khoảng cách
            service.getDistanceMatrix(
            {
              origins: [origin1],
              destinations: [destinationA],
              travelMode: 'WALKING',
              
              unitSystem: google.maps.UnitSystem.METRIC ,
              avoidHighways: true,
              avoidTolls: true,
            }, function callback(response, status) {
             if (status == 'OK') {
              var result=response.rows["0"].elements["0"].distance.value; ///trả về giá trị khoảng cách
              if(result >100)                                   /////// kiểm tra khoảng cách
              {
                alert("Vui lòng click địa điểm khác trong bán kính 100m")
                
              }else
              {
                  alert("Chấp nhận địa chỉ trong bán kính 100m")
                LatlngUser=latLng;
                placeMarkerAndPanTo(latLng, map);   //khi trong phạm vi 100m thể hiện marker
                  if(user!==null){
                  axios({
                  method: 'post',
                  url: 'http://localhost:3000/driver/setAdd?stt='+user.stt,
                  data: LatLng
                  });
              }

              }
            //alert('khoảng cách là:'+result);
            console.log(response);
            }else{
            alert("không đo được khoảng cách");
            }
  
          });

          
          //   infoWindow.setPosition(pos);
          //   infoWindow.setContent('Location found.');
          //   infoWindow.open(map);
          //   map.setCenter(pos);
          // }, function() {
          //   handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

function placeMarkerAndPanTo(latLng, map) {
   marker = new google.maps.Marker({
    position: latLng,
    map: map,
    draggable: true
    
  });
  map.panTo(latLng);
}
 //Chi duong
function calculateAndDisplayRoute(directionsService, directionsDisplay) {

    directionsService.route({    // hàm route của DirectionsService sẽ thực hiện tính toán với các tham số truyền vào
        origin: add_start,    // điểm xuất phát
        destination: add_end,    // điểm đích
        travelMode: 'DRIVING',     // phương tiện di chuyển
    }, function (response, status) {    // response trả về bao gồm tất cả các thông tin về chỉ đường
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response); // hiển thị chỉ đường trên bản đồ (nét màu đỏ từ A-B)

            //showSteps(response); // Hiển thị chi tiết các bước cần phải đi đến đích.
        } else {
            window.alert('Request for getting direction is failed due to ' + status);    // Hiển thị lỗi
        }
    });
}


function registration() {
    $("#signIn").css('display', 'none');
    $("#registration").css('display', 'block');
    var name = document.getElementById("name").value;
    var pass = document.getElementById("pass").value;
    var json = {
        name: name,
        pass: pass
    }
    axios({
        method: 'post',
        url: 'http://localhost:3000/login/registration',
        data: json
    });

}
function signIn() {
    var name = document.getElementById("name").value;
    var pass = document.getElementById("pass").value;
    console.log(" name:"+name + "  pass:"+pass);
    var json = {
        name: name,
        pass: pass
    }

    var url = 'http://localhost:3000/login/signIn?name=' + name+'&pass='+pass;
    axios.get(url)
        .then(function (res) {
            if (res.status == 201) {
            alert(res.data.msg);
            user = res.data.temp;
            alert(res.data.temp);
            //window.location="./index4.html";
            success= true;
            user=res.data.temp;
            var source;
            if(document.getElementById("template1").innerHTML == null){
              alert("không tìm thấy template1")}
              else{
                source = document.getElementById('template1').innerHTML
              }
            var template = Handlebars.compile(source);
            var html = template(res.data.temp);
            
            if(document.getElementById("list1").innerHTML == null){
              alert("không tìm thấy inform")}
              else{
                document.getElementById("list1").innerHTML += html;
              }
              //// làm ẩn form đăng nhập
              
                document.getElementById("dangnhap").innerHTML = null;
              

            setStatus1();
           
        }
        else {
            alert(res.data.msg);
        }
        }).catch(function (err) {
            console.log(err);
        }).then(function () {
            //setTimeout(loadInform, 3500);
        })
}
function setStatus1(){
  
  
  //document.getElementById("status").innerHTML = "Trang thai:Ready";
           var sta=user.stt;
           console.log(sta);
   var url = 'http://localhost:3000/driver/setStatus?stt=Ready&user='+ sta;
    axios.get(url)
        .then(function (res) {
            if (res.status == 200) {
            alert("Bây giờ bạn có thể nhận khách");
            user = res.data.temp;
            //alert(res.data.temp);
            //window.location="./index4.html";
          
            document.getElementById("status").innerHTML = "Trang thai:Ready";
           requestDriver();
           
        }
        else {
            alert(res.data.msg);
        }
        }).catch(function (err) {
            console.log(err);
        }).then(function () {
            //setTimeout(loadInform, 3500);
        })
}
function setStatus2(){
  alert(" change Standby");
  //document.getElementById("status").innerHTML = "Trạng thai:Standby"; 
  ///// Bug chưa response về được 


  var sta=user.stt;
   var url = 'http://localhost:3000/driver/setStatus?stt=Standby&user='+ sta;
    axios.get(url)
        .then(function (res) {
            if (res.status == 200) {
            alert("Bạn sẽ không nhận khách khi đổi sang trạng thái Standby");
            user = res.data.temp;
            //alert(res.data.temp);
            //window.location="./index4.html";
          
            document.getElementById("status").innerHTML = "Trạng thai:Standby";
            document.getElementById("list2").innerHTML = "";
            ts=0;
           
        }
        else {
            alert(res.data.msg);
        }
        }).catch(function (err) {
            console.log(err);
        }).then(function () {
            //setTimeout(loadInform, 3500);
        })
}
// function setAddr(){          // cập nhật địa chỉ của driver
//   if(user.status=="Ready"){
//     var ts=0;
//     var url = 'http://localhost:3000/driver?ts=' + ts;
//       axios.get(url)
//           .then(function (res) {
//               ts = res.data.return_ts;
//               var source = document.getElementById('template2').innerHTML;
//               var template = Handlebars.compile(source);
//               var html = template(res.data.categories);
//               document.getElementById('list1').innerHTML += html;
//               console.log(res.data)
//           }).catch(function (err) {
//               console.log(err);
//           }).then(function () {
//               setTimeout(requestDriver, 3000);
//           })
//         }
// }
function requestDriver()
{
  if(user.status==="Ready"){
    
    var url = 'http://localhost:3000/driver?ts=' + ts;
      axios.get(url)
          .then(function (res) {
              ts = res.data.return_ts;
              var source = document.getElementById('template2').innerHTML;
              var template = Handlebars.compile(source);
              var html = template(res.data.categories);
              //var db=res.data.categories;
              document.getElementById('list2').innerHTML += html;
              
              //Timeout();
             // ind++;            xét thời gian khách yêu cầu xuống sao cho chỉ thể hiện 10s
                
              console.log(res.data)
          }).catch(function (err) {
              console.log(err);
          }).then(function () {
              setTimeout(requestDriver, 3000);
              //Timeout(1,10)
          })
        }
}
function acceptClient(ind) {
    alert(ind);
  var vitri=user.stt;
  var url = 'http://localhost:3000/driver/setClient?stt=' + vitri+'&state='+"đã nhận xe";
    axios.get(url)
        .then(function (res) {            
            console.log(res.data);
            add_start = LatlngUser;
            add_end = document.getElementById("add-" + ind).innerHTML;
            alert(" bắt đầu");
            calculateAndDisplayRoute(directionsService, directionsDisplay);

        }).catch(function (err) {
            console.log(err);
        }).then(function () {
            setTimeout(requestDriver, 3000);
        })
}
window.onunload = function () {
  //$("#registration").css('display', 'none');
    
}

// function Timeout(stt,x){

//   document.getElementById('timer-'+stt).innerHTML =x;
//   x=x-1;
//   if(x===0)
//   {
//     document.getElementById('ds-1').innerHTML ="";
//   }
//   setTimeout(Timeout(stt,x),1000)
// }