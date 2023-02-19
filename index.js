const jsmediatags = window.jsmediatags;

function parseMp3Metadata(files) {
    var parseMp3Metadata = []
    var jsonString
    files.map(function(file){ //parse Metadata
        jsmediatags.read(file, {
            onSuccess: function (tag) {
                
                var data = tag.tags.picture.data;
                var format = tag.tags.picture.format;
                var base64String = "";
                for (var i = 0; i < data.length; i++) {
                    base64String += String.fromCharCode(data[i])
                }
                var arrs =
                    {
                        title : tag.tags.title,
                        artist : tag.tags.artist,
                        album : tag.tags.album,
                        genre : tag.tags.genre,
                        cover : `url(data:${format};base64,${window.btoa(base64String)})`
                    } 
                    parseMp3Metadata.splice(0,0,arrs)
                    renderMetadata(parseMp3Metadata)
                    getIndexSong(parseMp3Metadata)
                    // jsonString = JSON.stringify(parseMp3Metadata);
                    // console.log(jsonString)            
            },
            onError: function (error) {
                console.log(error)
            }
        })
    })

}

// function downloadJson(content, fileName, contentType) {
//     var a = document.createElement("a");
//     var file = new Blob([content], {type: contentType});
//     a.href = URL.createObjectURL(file);
//     a.download = fileName;
//     a.click();
//     console.log(a)
// }
function getIndexSong(arrSong,i){
    var arrGetIndex = []
    arrGetIndex=arrSong
    console.log(arrGetIndex[i])
}
function renderMetadata(metadataFiles){
    var renderItem = document.querySelector('.render')
    var render = metadataFiles.map(function(file){
        return `<ul class="item">
        <li id="cover" style="background-image:${file.cover}"></li>
        <li class="info">
            <li id="title">Title: ${file.title}</li>
            <li id="artist">Artist: ${file.artist}</li>
            <li id="album">Album: ${file.album}</li>
            <li id="genre">Genre: ${file.genre}</li>
        </li>
    </ul>`

    })
    // console.log(render)
    renderItem.innerHTML = render.join('')
}

function start(){
   
    whenYouInputFile()
    onClickGetID()
}
start()

function whenYouInputFile(){
    document.querySelector("input").addEventListener("change", (event) => {
        var url
        const file = event.target.files;
        const arrFile = []
        var reader = new FileReader();
        console.log(file)
        for(var i = 0;i<file.length;i++)
        {
            arrFile.push(file[i])
        }   
        parseMp3Metadata(arrFile) //to parseMetadata

        // Convert and put file into arr
        const arrBlob = []
        var reader = new FileReader();
        for(var i = 0; i<file.length;i++)
        {
            reader.readAsDataURL(arrFile[i]) // truyền vào file đầu vào cho sự kiện onload convert file sang url
            reader.onload = function(evt){
            url = evt.target.result;        
            // console.log(url)
            var arr = {   // gán url đã convert đầu tiên vào object này
                path:url
            }
            arrBlob.push(arr) // gán từng object đc lặp theo số file được chọn vào mảng arrBlob
            }  
        }
        
        //         arrBlob = {         
        //                 cc: url,
        //             }
                
                
        
    })
}
const upload = () => {
    var url;
    var file = document.querySelector("#file").files[0];
    var reader = new FileReader();
    reader.onload = function(evt) {
      url = evt.target.result;
      console.log(url);
    //   var sound = document.createElement("audio");
    //   var link = document.createElement("source");
    //   sound.id = "audio-player";
    //   sound.controls = "controls";
    //   link.src = url;
    //   sound.type = "audio/mpeg";
    //   sound.appendChild(link);
    //   document.getElementById("song").appendChild(sound);
    };
    reader.readAsDataURL(file);
  };
//   for (let i = 1; i <= 2; i++) {
//     setTimeout(function() {
//       alert(i)
//     }, 100);
//   }


// var ii  = 0;
// setInterval(function(){
//     console.log(ii)
//     setTimeout(function(){
//         console.log(ii+1)
//     })
// },1000)
function onClickGetID(){
    window.onload = () =>
    {
        // collection of <li> elements
        const items = Array.from(document.getElementsByTagName("div"));

        // add click event listener for each collection item
        items.forEach( ( button, index ) =>
        {
            button.addEventListener("click", () =>
            {
                // refer index of clicked <li> in collection <items> 
                console.log(index)
            });
        });
        console.log(items)
    }


}
