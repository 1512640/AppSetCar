var ts = 0;
var max=0;

window.onload = function () {
    loadInform();
    initMap();
}

var loadInform = function() {
        var url = 'http://localhost:3000/resInform?ts=' + ts ;
        axios.get(url)
            .then(function(res) {
              ts = res.data.return_ts;
              var source = document.getElementById('template').innerHTML;
              var template = Handlebars.compile(source);
              //var html = template(res.data.categories);
              for( var i=0;i<res.data.categories.length;i++)
              {
                if( res.data.categories[i].stt > max)
                {
                  var html = template(res.data.categories[i]);
                  document.getElementById('list').innerHTML += html;
                  console.log(res.data.categories[i]);
                }
              }

              
              var sl=res.data.categories.length;
              if(max<res.data.categories[sl-1].stt)
              {
                max=res.data.categories[sl-1].stt;
              }
              console.log(" giá trị stt lớn nhất:"+ max);
              
              console.log(res.data)
            }).catch(function(err) {
                console.log(err);
            }).then(function() {
              setTimeout(loadInform, 3500);
            })
    }
    var geocoder;
    var map;
   function initMap() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(10.83901,106.7645653);
    var mapOptions = {
      zoom: 8,
      center: latlng
    }
    
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var marker=new google.maps.Marker({
          position: latlng,
          map:map,
          title: 'hello World',
          animation:google.maps.Animation.BOUNCE,
          draggable: true
        });
        marker.setMap(map);
        google.maps.event.addDomListener(marker,'dragstar',function(event){
          console.log('bat dau di chuyen',event)
        })
        google.maps.event.addDomListener(marker,'dragend',function(event){
          console.log('da dat marker',event);
          geocodeLatLng(geocoder, map)
        })
  }
    


    function codeAddress(ind) {
      
      var address = document.getElementById("add-"+ind).innerHTML;
      alert(address);
      //var address = " 77 đăng văn bi thủ đức HCM"
      var name = document.getElementById("name-"+ind).innerHTML;
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
          var marker = new google.maps.Marker({
              map: map,
              title: name,
              position: results[0].geometry.location,
              draggable: true
          });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
         google.maps.event.addDomListener(marker,'dragstar',function(event){
          console.log('bat dau di chuyen',event)
        })
        google.maps.event.addDomListener(marker,'dragend',function(event){
          console.log('da dat marker'+ event.latLng.lat() +'-'+ event.latLng.lng());
          var latlng = {lat: parseFloat(event.latLng.lat()), lng: parseFloat( event.latLng.lng())};
        console.log( "giá trị"+ latlng);
          geocodeLatLng(geocoder,event,ind)
        })
      });
    }
    function geocodeLatLng(geocoder,event, ind) {
        // event.latLng.lat() +'-'+ event.latLng.lng());
        // var latlngStr = input.split(',', 2);
        var latlng = {lat: parseFloat(event.latLng.lat()), lng: parseFloat( event.latLng.lng())};
        console.log( "giá trị"+ latlng);
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              //map.setZoom(11);
              // var marker = new google.maps.Marker({
              //   position: latlng,
              //   map: map
              // });
              // infowindow.setContent(results[0].formatted_address);
              console.log(" địa điểm:" + results[0].formatted_address);
              document.getElementById("add-"+ind).innerHTML=results[0].formatted_address;
              // infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }
