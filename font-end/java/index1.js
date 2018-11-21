function Findcar() {
    alert("Add imformation success");
    var hoTen = document.getElementById("hoTen").value;
    var dienThoai = document.getElementById("dienThoai").value;
    var diaChi = document.getElementById("diaChi").value;
    var ghiChu = document.getElementById("ghiChu").value;
    var json = {
        addr: diaChi,
        name: hoTen,
        sdt: dienThoai,
        note: ghiChu,
    }
    axios({
        method: 'post',
        url: 'http://localhost:3000/sendInform',
        data: json
    });
   
}