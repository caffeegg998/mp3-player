jsmediatags.read(file, {
        onSuccess: function (tag) {
            var renderItem = document.querySelector('.render')
            var arrs = [
                {
                    title : tag.tags.title,
                    artist : tag.tags.artist,
                    album : tag.tags.album,
                    genre : tag.tags.genre,
                }     
            ]
            var data = tag.tags.picture.data;
            var format = tag.tags.picture.format;
            var base64String = "";
            for (var i = 0; i < data.length; i++) {
                base64String += String.fromCharCode(data[i])
            }
            arrs[0].cover = `url(data:${format};base64,${window.btoa(base64String)})`;
            console.log(arrs)
            var render = arrs.map(function(arr){
                return `<div id="cover" style="background-image:${arr.cover}"></div>
                <div id="title">${arr.title}</div>
                <div id="artist">${arr.artist}</div>
                <div id="album">${arr.album}</div>
                <div id="genre">${arr.genre}</div> `
            })
            console.log(render)
            renderItem.innerHTML = render.join('')
        },
        onError: function (error) {
            console.log(error)
        }
    })