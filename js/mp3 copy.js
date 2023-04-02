const jsmediatags = window.jsmediatags;
var btnNext = document.querySelector('.btn-next')
var btnPrev = document.querySelector('.btn-prev')
var togglePlayPause = document.querySelector('.player')
var progress = document.querySelector('#progress')
audioContext = new AudioContext();
// Hàm xử lí sự kiện chuyển bài và in ra metadata tương ứng
function getIndexSong(arrSong, i) {
    var arrGetIndex = []
    setTimeout(function () {
        arrGetIndex = arrSong
        console.log(arrGetIndex)
    }, 2000)
    console.log(arrGetIndex)
    var i = 0

    btnNext.onclick = function () {
        i++
        if (i > arrGetIndex.length) {
            return i = 0
        }
        currentSong(arrGetIndex[i])
    }
    btnPrev.onclick = function () {
        --i
        if (i < 0) {
            i = arrGetIndex.length - 1
        }
        currentSong(arrGetIndex[i])
    }
}
// hàm trả về metadata và in ra metadata cho dashboard
function currentSong(current) {
    var heading = document.querySelector('header h2')
    var cdThumb = document.querySelector('.cd-thumb')
    var backgroundImage = document.querySelector('.dashboard-blur')
    console.log(heading, cdThumb, audio)
    backgroundImage.style.backgroundImage = current.cover
    heading.textContent = current.title
    cdThumb.style.backgroundImage = current.cover
}
function audioBuffLoad(load){
    var audio = document.querySelector('#audio')
    audio.src = load.duration
    console.log(audio)
}
// Hàm lấy metadata từ file mp3
function parseMp3Metadata(files) {
    var parseMp3Metadata = []
    files.map(function (file) { //parse Metadata
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
                    title: tag.tags.title,
                    artist: tag.tags.artist,
                    album: tag.tags.album,
                    genre: tag.tags.genre,
                    cover: `url(data:${format};base64,${window.btoa(base64String)})`
                }
                parseMp3Metadata.push(arrs)
                renderMetadata(parseMp3Metadata)
                getIndexSong(parseMp3Metadata)
            },
            onError: function (error) {
                console.log(error)
            }
        })
    })
    // console.log(parseMp3Metadata)
}
// Hàm render ra metadata vào playlistplaylist file Mp3
function renderMetadata(metadataFiles) {
    console.log(metadataFiles)
    var renderItem = document.querySelector('.playlist')
    var render = metadataFiles.map(function (file) {
        return `<div class="song">
        <div class="thumb" style="background-image: ${file.cover}"></div>
        <div class="body"><h3 class="title">${file.title}</h3><p class="author">${file.artist}</p></div>
        <div class="option"><i class="fas fa-ellipsis-h"></i></div>
    </div>`
    })
    // console.log(render)
    renderItem.innerHTML = render.join('')
}
// Hàm khởi động
function start() {
    whenYouInputFile()
    handleEvents()
    currentSong()

}
start()
// Hàm xử lý file đầu vào
function whenYouInputFile() {
    document.querySelectorAll("input")[1].addEventListener("change", (event) => {
        const file = event.target.files;
        const arrFile = []
        const arrBlob = []
        for (var i = 0; i < file.length; i++) {
            arrFile.push(file[i])
            var path = (window.URL || window.webkitURL).createObjectURL(file[i]);
            arrBlob.push(path)
        }

        console.log(arrFile)
        parseMp3Metadata(arrFile)
        bufferFile(arrBlob)
    })
}
// End parseMp3, render playList 
function handleEvents() {
    const cd = document.querySelector('.cd')
    const backgroundBlur = document.querySelector('.dashboard-blur')
    const backgroundBlack = document.querySelector('.dashboard-black')
    const cdWidth = cd.offsetWidth
    const backgroundBlurWidth = backgroundBlur.offsetWidth
    const backgroundBlackWidth = backgroundBlack.offsetWidth

    document.onscroll = function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop

        // console.log("scroll: ",scrollTop)

        const newCdWidth = cdWidth - scrollTop
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth
        const newbackgroundBlur = backgroundBlurWidth - scrollTop
        backgroundBlur.style.height = newbackgroundBlur > 0 ? newbackgroundBlur + 86 + 'px' : 0;
        console.log(backgroundBlur.style.height)

        const newbackgroundBlack = backgroundBlackWidth - scrollTop
        backgroundBlack.style.height = newbackgroundBlack > 0 ? newbackgroundBlack + 86 + 'px' : 0;
        // if(cd.style.width = 0 + 'px')
        // {
        //     return
        // }
    }

}

// Buffer file
// Hàm này tôi truyền vào tham số là các file nhạc đã convert sang dạng Blob
function bufferFile(samplePaths) {
    let audioContext;
    let samples;
    var sampleSource = null
    const startCtxBtn = document.querySelector(".start")
    const setupSamplesBtn = document.querySelector(".setup-samples")
    const playPauseBtn = document.querySelector(".btn-toggle-play")
    startCtxBtn.addEventListener("click", () => {
        audioContext = new AudioContext();
        console.log("Audio Context Started");
    });

    setupSamplesBtn.addEventListener("click", () => {
        setupSamples(samplePaths).then((response) => {
            samples = response
            console.log(samples)
            var i = 0   
            
            // Play/Pause Event
            playPauseBtn.addEventListener("click", () => {
                pausePlay()
                
            })
            // Next Event
            btnNext.addEventListener("click", () => {
                stopSample()
                i++
                if (i > samples.length) {
                    return i = 0
                }
                playSample(samples[i], 1)
                
            })
            // Prev Event
            btnPrev.addEventListener("click", () => {
                stopSample()
                i--
                if (i < 0) {
                    i = samples.length - 1
                }
                playSample(samples[i], 1)
                audioBuffLoad(samples[i])
            })
            
        })
    })
    // convert file to audioBuffer and return file
    async function getFile(filePath) {
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    // Lấy từng file ra đưa vào hàm getFile để xử lý
    async function setupSamples(paths) {
        console.log("Setting up samples")
        const audioBuffers = []

        for (var i = 0; i < paths.length; i++) {
            var sample = await getFile(paths[i])
            console.log(sample)
            audioBuffers.push(sample)  // sau khi sử lý file xong, file được trả về sẽ đc thêm vào mảng audioBuffers
        }
        console.log("Setting up done")
        return audioBuffers;
    }
    // Hàm play file audioBuffer
    function playSample(audioBuffer, time) {
        sampleSource = audioContext.createBufferSource();
        sampleSource.buffer = audioBuffer;
        sampleSource.connect(audioContext.destination);
        sampleSource.start(time)
        progress.onchange = function(e){
            const seekTime =    audioBuffer.duration / 100 * e.target.value
            console.log("seek: ",seekTime)
            //audioContext.destination.context.currentTime = seekTime
            console.log(sampleSource)
        }
        
    }
    // Hàm này để dừng bài nhạc đang phát. Tôi gọi hàm này khi ấn Next bài tiếp theo
    function stopSample() {
        if (sampleSource) {
            sampleSource.stop()
        }
    }
    // Hàm này làm cho nút play/pause 
    function pausePlay(){
        if(audioContext.state === 'running') {
            audioContext.suspend().then(function() {
                togglePlayPause.classList.remove('playing');
            });
          }else if(audioContext.state === 'suspended') {
            audioContext.resume().then(function() {
                togglePlayPause.classList.add('playing');;
            });  
          }
          console.log(togglePlayPause)
    }
}

