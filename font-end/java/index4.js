var map;
var success=false;
var user;
//var ds;
//var ind=1;
var marker;
var LatlngUser;
var ts=0;
window.onload = function () {
  //$("#registration").css('display', 'none');
    initMap(); 
}

      function initMap() {
        
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat:10.7699421, lng: 106.6734581 }
    });
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
            alert( "vi tri hien tai: "+ pos.lat+", "+ pos.lng);
            var origin1 =latLng;
            var destinationA =new google.maps.LatLng(parseFloat(position.coords.latitude), parseFloat( position.coords.longitude));
            //alert( "vi tri hien tai: "+ origin1 +","+ destinationA);
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
                alert(" vui lòng click địa điểm khác")
                
              }else
              {
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
  alert(latLng.lat())
  map.panTo(latLng);
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
function acceptClient(ind){
  var vitri=user.stt;
  var url = 'http://localhost:3000/driver/setClient?stt=' + vitri+'&state='+"đã nhận xe";
    axios.get(url)
        .then(function (res) {
            
            console.log(res.data)
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