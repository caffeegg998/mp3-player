const musicList = [];
        const musicPlayer = document.querySelector("#music-player");
        const playPauseBtn = document.querySelector(".btn-toggle-play");
        const prevBtn = document.querySelector(".btn-prev");
        const nextBtn = document.querySelector(".btn-next");
        const progress = document.querySelector("#progress");
        const coverImg = document.querySelector(".cd-thumb");
        const togglePlayPause = document.querySelector('.player')
        const backgroundImage = document.querySelector('.dashboard-blur')
        const heading = document.querySelector('header h2')
        let currentSongIndex = 0;

        function handleMusicFileSelect(event) {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                jsmediatags.read(file, {
                    onSuccess: function (tag) {
                        const title = tag.tags.title || file.name;
                        const artist = tag.tags.artist || "Unknown";
                        const album = tag.tags.album || "Unknown";
                        const url = URL.createObjectURL(file);
                        const picture = tag.tags.picture;
                        const coverUrl = picture ? "data:" + picture.format + ";base64," + btoa(String.fromCharCode.apply(null, picture.data)) : "";
                        const musicItem = document.createElement("div");
                        musicItem.classList.add("song");
                        musicItem.innerHTML = `<div class="thumb" width="50%" style="background-image: url(${coverUrl});"></div>
                        <div class="body"><h3 class="title">${title}</h3><p class="author">${artist}</p></div>
                        <div class="option"><i class="fas fa-ellipsis-h"></i></div>`;
                        musicList.push({
                            title: title,
                            artist: artist,
                            album: album,
                            url: url,
                            coverUrl: coverUrl
                        });
                        document.querySelector(".playlist").appendChild(musicItem);
                    },
                    onError: function (error) {
                        console.log(error);
                    }
                });
            }
        }

        function playCurrentSong() {
            const currentSong = musicList[currentSongIndex];
            musicPlayer.src = currentSong.url;
            heading.textContent = currentSong.title
            coverImg.style.backgroundImage = `url(${currentSong.coverUrl})`;
            backgroundImage.style.backgroundImage = `url(${currentSong.coverUrl})`;
            musicPlayer.play();
            togglePlayPause.classList.add('playing');
        }

        function handlePlayPauseClick() {
            if (musicPlayer.paused) {
                musicPlayer.play();
                togglePlayPause.classList.add('playing');
            } else {
                musicPlayer.pause();
                togglePlayPause.classList.remove('playing');;
            }
        }

        function handlePrevClick() {
            currentSongIndex = (currentSongIndex - 1 + musicList.length) % musicList.length;
            playCurrentSong();
        }

        function handleNextClick() {
            currentSongIndex = (currentSongIndex + 1) % musicList.length;
            playCurrentSong();
        }

        function handleSeekBarChange() {
            const time = musicPlayer.duration * (progress.value / 100);
            musicPlayer.currentTime = time;
        }

        function updateSeekBar() {
            const currentTime = musicPlayer.currentTime;
            const duration = musicPlayer.duration;
            const percentage = (currentTime / duration) * 100;
            progress.value = percentage;
        }
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
        handleEvents()
        musicPlayer.addEventListener("ended", handleNextClick);
        musicPlayer.addEventListener("timeupdate", updateSeekBar);

        document.querySelector(".music-file").addEventListener("change", handleMusicFileSelect);
        playPauseBtn.addEventListener("click", handlePlayPauseClick);
        prevBtn.addEventListener("click", handlePrevClick);
        nextBtn.addEventListener("click", handleNextClick);
        progress.addEventListener("input", handleSeekBarChange);