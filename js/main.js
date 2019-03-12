$(document).ready(function(){
    // inisiasi api
    var _url='http://my-json-server.typicode.com/Clareand/belajar-api/mahasiswa';
    // menampung seluruh data mahasiswa
    var result='';
    //menampung gender sebagain option
    var gender_result='';
    // menampung semua gender mahasiswa
    var gender=[];

        // $.get(_url,function (data) {
    function renderPage(data) {
        $.each(data, function (key, items) {
            _gend = items.gender;

            result += '<div>' +
                '<h3>' + items.name + '</h3>' +
                '<p>' + _gend + '</p>' +
                '</div>';

            if ($.inArray(_gend, gender) === -1) {
                gender.push(_gend);
                gender_result += "<option value='" + _gend + "'>" + _gend + "</option>";
            }
        });

        $('#mhs-list').html(result);
        $('#mhs-select').html("<option value='semua'>semua</option>" + gender_result);
        // });
    }

    var networkDataReceive = false;
    /*
    * start balapan antara service dengan cache
    * fresh data from online service
    * */
    var networkUpdate = fetch(_url).then(function (response) {
        return response.json();
    }).then(function (data) {
        networkDataReceive = true;
        renderPage(data);
    });

    /* ambilkan data dalam local cache */
    caches.match(_url).then(function (response) {
        if (!response) throw Error("no data on cache")
        return response.json();
    }).then(function (data) {
        if (!networkDataReceive){
            renderPage(data);
            console.log("render from cache");
        }
    }).catch(function () {
        return networkUpdate;
    });

    // filter data

    $("#mhs-select").on('change', function () {
        updateListMahasiswa($(this).val());
    });

    function updateListMahasiswa(opt) {
        var result = '';
        var _url2 = _url;

        // cek opsi yang dipilih
        if (opt !== 'semua'){
            _url2 = _url + '?gender='+opt;
        }

        $.get(_url2,function (data) {
            $.each(data, function (key, items) {
                _gend = items.gender;

                result += '<div>' +
                    '<h3>'+items.name+'</h3>' +
                    '<p>'+_gend+'</p>' +
                    '</div>';
            });

            $('#mhs-list').html(result);
        });
    }
});

if ('serviceWorker' in navigator){
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/serviceworker.js').then(
            function (reg) {
                // registerasi service worker berhasil
                console.log('SW registration success, scope :',reg.scope);
            }, function (err) {
                // reg failed
                console.log('SW registration faild : ', err);
            }
        )
    })
}