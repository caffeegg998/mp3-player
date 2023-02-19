const jsmediatags = window.jsmediatags;

function parseMp3Metadata(files) {
    var parseMp3Metadata = []
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
            },
            onError: function (error) {
                console.log(error)
            }
        })
    })
}
function renderMetadata(metadataFiles){
    console.log(metadataFiles)
    var renderItem = document.querySelector('.playlist')
    var render = metadataFiles.map(function(file){
        return `<div class="song">
        <div class="thumb" style="background-image: ${file.cover}"></div>
        <div class="body"><h3 class="title">${file.title}</h3><p class="author">${file.artist}</p></div>
        <div class="option"><i class="fas fa-ellipsis-h"></i></div>
    </div>`
    })
    // console.log(render)
    renderItem.innerHTML = render.join('')
}
function start(){
    whenYouInputFile()
}
start()

function whenYouInputFile(){
    document.querySelectorAll("input")[1].addEventListener("change", (event) => {
        const file = event.target.files;
        const arrFile = []
        for(var i = 0;i<file.length;i++)
        {
            arrFile.push(file[i])
        }   
        // console.log(arrFile)
        parseMp3Metadata(arrFile)
    })
}
// End parseMp3, render playList 
const app = {
    currentIndex: 0,
    start: function(){
        this.handleEvents()
        this.defineProperties()
    },
    defineProperties: function(){
        Object.defineProperties(this, 'currentSong',{
            get:function(){
                return this.parseMp3Metadata[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const cd = document.querySelector('.cd')
        const cdWidth = cd.offsetWidth 
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0; 
            cd.style.opacity = newCdWidth / cdWidth
            console.log(newCdWidth)
        }
    }
}
appHandle.start()