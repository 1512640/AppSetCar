window.onload = function () {
    $("#registration").css('display', 'none');
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
    axios({
        method: 'post',
        url: 'http://localhost:3000/login/signIn',
        data: json
    }).then(function (res) {
        if (res.status == 201) {
            alert(res.data.msg);
            window.location="./index4.html";
        }
        else {
            alert(res.data.msg);
        }
    }).catch(function (err) {
        alert(err);
    });
}