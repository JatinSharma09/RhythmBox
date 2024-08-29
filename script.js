let volume = () => {
    let vol_slider = document.getElementById('volume');
    if (vol_slider.style.display === "none") {
        vol_slider.style.display = "block";
    } else {
        vol_slider.style.display = "none";
    }
    setTimeout(() => {
            vol_slider.style.display = 'none';
        }, 5000);
}

function playpause() {
    let play = document.getElementById("play");
    let pause = document.getElementById("pause");
    let audio = document.getElementsByTagName('audio')[0];
    if (audio.paused) {
        audio.play();
        pause.style.display = 'block';
        play.style.display = 'none';
    } else {
        audio.pause();
        pause.style.display = 'none';
        play.style.display = 'block';
    }
}



//updating current audio track time position to the range input
document.addEventListener('DOMContentLoaded', (event) => {
    const audio = document.getElementById('audio1');
    const audioTrack = document.getElementById('audio_track');
    const playBtn = document.getElementById('play');
    const pauseBtn = document.getElementById('pause');
    const volume = document.getElementById('volume');

    // Wait for the metadata to load
    audio.addEventListener('loadedmetadata', () => {
        // Update the max value of the range input to the audio duration
        audioTrack.max = audio.duration;
    });

    // Update the range input as the audio plays
    audio.addEventListener('timeupdate', () => {
        audioTrack.value = audio.currentTime;
    });

    // Seek the audio when the range input changes
    audioTrack.addEventListener('input', () => {
        audio.currentTime = audioTrack.value;
    });

    // Play the audio when the range input changes and update the button state
    audioTrack.addEventListener('change', () => {
        audio.play();
        updatePlayPauseBtn();
    });

    // Toggle play/pause state when the button is clicked
    playBtn.addEventListener('click', () => {
        audio.play();
        updatePlayPauseBtn();
    });

    pauseBtn.addEventListener('click', () => {
        audio.pause();
        updatePlayPauseBtn();
    });

    // Update the button visibility according to the audio state
    audio.addEventListener('play', updatePlayPauseBtn);
    audio.addEventListener('pause', updatePlayPauseBtn);

    // Function to update the play/pause button visibility
    function updatePlayPauseBtn() {
        if (audio.paused) {
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        } else {
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
        }
    }

    // Volume control
    volume.addEventListener('input', () => {
        audio.volume = volume.value / 100;
    });
    volume.addEventListener('change', () => {
        audio.volume = volume.value / 100;
    });

    // Keyboard shortcuts for play/pause, previous/next, and volume control
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            audio.paused ? audio.play() : audio.pause();
            updatePlayPauseBtn();
        } else if (event.key === 'ArrowRight') {
            audio.currentTime += 5;
        } else if (event.key === 'ArrowLeft') {
            audio.currentTime -= 5;
        }
        // else if (event.key === 'ArrowUp') {
        //     volume.value = Math.min(volume.value + 10, 100);
        //     audio.volume = volume.value / 100;
        //     volume.style.display = 'block';

        // } else if (event.key === 'ArrowDown') {
        //     volume.value = Math.max(volume.value - 10, 0);
        //     audio.volume = volume.value / 100;
        //     volume.style.display = 'block';
        // }
        // Prevent the page from scrolling when pressing arrow keys
        event.stopPropagation();
        // event.preventDefault();
        // Close the volume slider automatically after some time
        // setTimeout(() => {
        //     volume.style.display = 'none';
        // }, 5000);

    });



    // Initialize the button visibility
    updatePlayPauseBtn();

    function cleanTitle(title) {
        // Replace HTML entities
        let cleanedTitle = title.replace(/&quot;/g, '"');

        // Remove everything in parentheses and trim any extra spaces
        cleanedTitle = cleanedTitle.replace(/\s*\(.*?\)\s*/g, '').trim();

        return cleanedTitle;
    }

    let songs = [];
    let currentSongIndex = 0;

    async function getSongData() {
        const response = await fetch('https://saavn.dev/api/playlists?link=https://www.jiosaavn.com/featured/trending-today/I3kvhipIy73uCJW60TJk1Q__&limit=50');
        const data = await response.json();
        songs = data.data.songs;
        // console.log(songs);

        // Update the initial 10 cards
        for (let i = 0; i < 4; i++) {
            updateCard(i, songs[i], songs);
        }

        // Generate additional 40 cards dynamically
        for (let i = 5; i < songs.length; i++) {
            createCard(i, songs[i], songs);
        }
        cardSlider();


    }



    function updateCard(index, song, songsData) {
        const cardImage = document.getElementById(`card-i-${index}`);
        const cardName = document.getElementById(`card-sn-${index}`);
        const cardArtistName = document.getElementById(`card-a-${index}`);
        const cardBgImg = document.getElementById(`card-b-${index}`);
        const playButton = document.getElementById(`id-${index}`);

        cardImage.src = song.image[2].url;
        cardName.style.whiteSpace = "nowrap";
        cardName.style.overflow = "hidden";
        cardName.style.textOverflow = "ellipsis";
        cardName.style.width = "100%";
        cardName.textContent = cleanTitle(song.name);
        cardArtistName.textContent = song.artists.primary[0].name;
        cardBgImg.style.backgroundImage = `url(${song.image[2].url})`;

        // Add event listener to play button
        playButton.addEventListener('click', () => {
            songs = [];
            songs = songsData;
            playSong(index);
        });
    }

    async function createCard(index, song, songsData) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('h-[390px]', 'w-[275px]', 'card', 'flex-shrink-0');
        cardContainer.innerHTML = `
        <div class="mt-2 ml-8 relative">
            <img src="${song.image[2].url}" alt="image-1" class="rounded-t-lg" id="card-i-${index}">
            <div class="h-10 w-10 bg-white rounded-[50%] flex justify-center items-center absolute bottom-4 right-4">
                <img src="../Assets/Icon-Play-Filled.svg" alt="right-arrow" class="h-6 w-6 btn-${index + 1}" id="id-${index}">
            </div>
        </div>
        <div class="h-[110px] ml-8 rounded-b-lg" style="background-image: url('${song.image[2].url}');" id="card-b-${index}">
            <div class="backdrop-blur-xl bg-black/50 h-full rounded-b-lg p-3">
               
                <span class="block text-[18px] font-semibold mt-1" id="card-sn-${index}">${cleanTitle(song.name)}</span>
                <p class="block text-[14px] font-semibold text-[#9898A6]" id="card-a-${index}">${song.artists.primary[0].name}</p>
               
            </div>
        </div>
        `;
        document.getElementById('cards-container').appendChild(cardContainer);  // Ensure you have a container with this ID in your HTML

        // Add event listener to play button
        const playButton = document.getElementById(`id-${index}`);
        playButton.addEventListener('click', () => {
            songs = [];
            songs = songsData;
            playSong(index);
        });
    }

    getSongData();

    // function to handle the slider 
    async function cardSlider() {

        // script for sliding cards for trending today section
        const scrollContainer = document.querySelector('.scroll-container');
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');
        const cards = document.querySelectorAll('.card');
        const cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginRight);
        const visibleCards = 4;
        let currentIndex = 0;

        function updateCarousel() {
            const offset = -currentIndex * cardWidth;
            scrollContainer.style.transform = `translateX(${offset}px)`;
        }

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex -= visibleCards;
                if (currentIndex < 0) currentIndex = 0;
                updateCarousel();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < cards.length - visibleCards) {
                currentIndex += visibleCards;
                if (currentIndex > cards.length - visibleCards) currentIndex = cards.length - visibleCards;
                updateCarousel();
            }
        });

        updateCarousel(); // Initial update
    }

    // Function to play song when the click evwnt occurs by clicking on the card's play button 
    function playSong(index) {
        const audio = document.getElementById('audio1');
        currentSongIndex = index;
        const song = songs[index];
        audio.src = song.downloadUrl[4].url;  // Change this based on your API structure
        audio.play();
        updatePlayPauseBtn();

        const img = document.getElementById('img-m');
        const artist = document.getElementById('artist_name');
        const title = document.getElementById('audio_title');
        const second_artist = document.getElementById('second-artist');
        const fullScreen_image = document.getElementById('full-screen-img');
        const fullScreen_name = document.getElementById('full-song-name');
        const fullScreen_artist = document.getElementById('full-song-artist');
        const songId = song.id;
        // console.log(songId);

        img.src = song.image[2].url;
        artist.textContent = song.artists.primary[0].name;
        title.textContent = cleanTitle(song.name);
        second_artist.textContent = '';
        // full screen player's all details
        fullScreen_image.src = song.image[2].url;
        fullScreen_name.textContent = cleanTitle(song.name);
        fullScreen_artist.textContent = song.artists.primary[0].name;
        document.title = cleanTitle(song.name);
        //  //Loop to load realted cards data 
        //  for (let i = 1; i < 7; i++) {
        getRealtedSongs(songId);
        // }

        // Update artists' images
        updateArtists(song);
    }

    function updateArtists(song) {
        const artistContainer = document.getElementById('artist-names');

        // Clear previous artists' images
        artistContainer.innerHTML = '';

        // Generate and append new artist images
        try {
            for (let i = 0; i < song.artists.primary.length; i++) {
                const artistImage = document.createElement('img');
                artistImage.classList.add('h-14', 'w-14', 'rounded-full');
                artistImage.src = song.artists.primary[i].image[1].url;
                artistContainer.appendChild(artistImage);
            }
        } catch (e) {
            console.log('Artist image not found');
        }
    }

    // Feature for the previous and next buttons
    document.getElementById('prev').addEventListener('click', () => {
        if (currentSongIndex > 0) {
            playSong(currentSongIndex - 1);
        }
    });

    document.getElementById('nxt').addEventListener('click', () => {
        if (currentSongIndex < songs.length - 1) {
            playSong(currentSongIndex + 1);
        }
    });



    async function getPlayLists() {
        const playListNames = ['badshah', 'arijit', 'monsoon', 'indie pop', '90s', '80s'];
        for (let i = 0; i < playListNames.length; i++) {
            // console.log(playListNames[i]);
            const response = await fetch(`https://saavn.dev/api/search/playlists?query=${playListNames[i]}`);
            const data = await response.json();
            const playListAddress = data.data.results[i];
            // console.log(playListAddress);
            const playRes = await fetch(`https://saavn.dev/api/playlists?link=https://www.jiosaavn.com/featured/${playListAddress.url}&limit=50`);
            const playData = await playRes.json();
            const songUrl = playData.data.songs[i];
            // console.log(playData.data.songs);


            const cardImage = document.getElementById(`play-i-${i}`);
            cardImage.src = data.data.results[0].image[1].url;
            const cardName = document.getElementById(`play-name-${i}`);
            cardName.textContent = data.data.results[0].name;
            const cardType = document.getElementById(`play-type-${i}`);
            cardType.textContent = data.data.results[0].type;
            const songCount = document.getElementById(`play-sc-${i}`);
            songCount.textContent = data.data.results[0].language;

            const playButton = document.getElementById(`playlist-card-${i}`);
            playButton.addEventListener('click', () => {
                const playlist = document.getElementById('playlist-screen');
                playlist.style.display = (playlist.style.display === 'block') ? 'none' : 'block';
                playRealtedSong(songUrl);
                showPlaylistData(playData.data);
                songs = [];
                songs = playData.data.songs;
            });
        }


    }
    getPlayLists();

    async function showPlaylistData(data) {
        const playData = data;
        // console.log(playData);
        const playlistName = document.getElementById('table-play-title');
        const playlistImg = document.getElementById('table-play-img');
        const playlistCount = document.getElementById('table-play-count');
        playlistName.innerHTML = playData.name;
        playlistImg.src = playData.image[1].url;
        playlistCount.textContent = playData.songCount + " songs";

        for (let i = 1; i <= 8; i++) {
            try {
                const songImage = document.getElementById(`table-img-${i}`);
                songImage.src = playData.songs[i].image[1].url;
                const songTitile = document.getElementById(`table-name-${i}`);
                songTitile.textContent = cleanTitle(playData.songs[i].name);
                const songArtist = document.getElementById(`table-artist-${i}`);
                songArtist.textContent = playData.songs[i].artists.primary[0].name + ", " + playData.songs[i].artists.primary[1].name;
                const album = document.getElementById(`table-album-${i}`);
                album.textContent = cleanTitle(playData.songs[i].album.name);
                const duration = document.getElementById(`table-dura-${i}`);
                duration.textContent = convertDurationToMinutes(playData.songs[i].duration);
            } catch (e) {
                console.log('opps something wrong !!', e);
            }
            // Add event listener to play button
            const playButton = document.getElementById(`table-row-${i}`);
            playButton.addEventListener('click', () => playRealtedSong(playData.songs[i]));
        }

        // making more song cards dynamically starts from 8 to song length
        for (let i = 9; i < playData.songs.length; i++) { // Start from the 9th song since you already have 8 rows
            try {
                const row = document.createElement('tr');
                row.classList.add('bg-[#171719]', 'border-gray-700', 'hover:bg-gray-600');
                row.setAttribute('id', `table-row-${i}`);

                row.innerHTML = `
                <th scope="row" class="flex items-center gap-6 px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <img src="${playData.songs[i].image[1].url}" alt="img" class="h-10 w-10 rounded-md" id="table-img-${i}">
                    <span class="font-medium" id="table-name-${i}">${cleanTitle(playData.songs[i].name)}</span>
                </th>
                <td class="px-4 py-2" id="table-artist-${i}">
                    ${playData.songs[i].artists.primary.map(artist => artist.name).join(', ')}
                </td>
                <td class="px-4 py-2" id="table-album-${i}">
                    ${playData.songs[i].album.name}
                </td>
                <td class="px-4 py-2" id="table-dura-${i}">
                    ${convertDurationToMinutes(playData.songs[i].duration)}
                </td>
            `;

                document.getElementById("songTable").appendChild(row);
                const playButton = document.getElementById(`table-row-${i}`);
                playButton.addEventListener('click', () => playRealtedSong(playData.songs[i]));
            } catch (e) {
                console.log('Something is wrong !!', e);
            }
        }

        function convertDurationToMinutes(duration) {
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }

    }

    async function getRealtedSongs(songId) {
        let sng = [];
        const response = await fetch(`https://saavn.dev/api/songs/${songId}/suggestions`);
        const data = await response.json();
        sng = data.data;
        // console.log(sng[1]);
        for (let i = 1; i < 7; i++) {
            let sngData = sng[i];
            // console.log(sngData);
            try {
                const realtedImg = document.getElementById(`realted-img-${i}`);
                realtedImg.src = sngData.image[1].url;
                const realtedName = document.getElementById(`realted-name-${i}`);
                realtedName.textContent = cleanTitle(sngData.name);
                const realtedArtist = document.getElementById(`realated-ar-${i}`);
                realtedArtist.textContent = sngData.artists.primary[0].name;

                const playButton = document.getElementById(`realated-cd-${i}`);
                playButton.addEventListener('click', () => playRealtedSong(sngData));
            } catch (e) {
                console.log("Some data is missing !!");
            }
        }
    }

    function playRealtedSong(song) {
        const realatedSong = song;
        // console.log(realatedSong);
        const audio = document.getElementById('audio1');
        audio.src = realatedSong.downloadUrl[4].url;
        audio.play();
        updatePlayPauseBtn();
        const img = document.getElementById('img-m');
        const artist = document.getElementById('artist_name');
        const title = document.getElementById('audio_title');
        const second_artist = document.getElementById('second-artist');
        const fullScreen_image = document.getElementById('full-screen-img');
        const fullScreen_name = document.getElementById('full-song-name');
        const fullScreen_artist = document.getElementById('full-song-artist');
        const sngid = realatedSong.id;

        img.src = realatedSong.image[2].url;
        artist.textContent = realatedSong.artists.primary[0].name;
        title.textContent = cleanTitle(realatedSong.name);
        second_artist.textContent = '';
        // full screen player's all details
        fullScreen_image.src = realatedSong.image[2].url;
        fullScreen_name.textContent = cleanTitle(realatedSong.name);
        fullScreen_artist.textContent = realatedSong.artists.primary[0].name;
        document.title = cleanTitle(realatedSong.name);
        getRealtedSongs(sngid);

        updateArtists(realatedSong);
    }

    //script to toggle mini player to full screen player when user clicks on the full screen button
    document.getElementById('full-screen').addEventListener('click', function () {
        const fullScreen = document.getElementById('full-screen-player');
        fullScreen.style.display = (fullScreen.style.display === 'block') ? 'none' : 'block';
        // when i click on the button only this page show the background page would be hidden 
        // document.body.style.overflow = (fullScreen.style.display === 'none') ? 'auto' : 'hidden';
        const second_section = document.getElementById('second-section');
        second_section.style.display = (fullScreen.style.display === 'none') ? 'block' : 'none';
        const navbar = document.getElementById('navbar');
        navbar.style.display = (fullScreen.style.display === 'none') ? 'block' : 'none';
        const playlist = document.getElementById('playlist-screen');
        if(fullScreen.style.display === 'block') {
            playlist.style.display = 'none';
        }
    });

    // //script to toggle playlist screen
    // document.getElementById('playlist-card-0').addEventListener('click', function () {
    //     const playlist = document.getElementById('playlist-screen');
    //     playlist.style.display = (playlist.style.display === 'none') ? 'none' : 'block';
    // });

    // script to hide playlist screen
    document.getElementById('playlistHide').addEventListener('click', function () {
        const playlist = document.getElementById('playlist-screen');
        playlist.style.display = 'none';
    });
    // script to hide playlist screen
    document.getElementById('playlistShow').addEventListener('click', function () {
        const playlist = document.getElementById('playlist-screen');
        playlist.style.display = 'block';
    });


    //  search feature 
    document.getElementById('search-box').addEventListener('input', async function() {
        const query = this.value.trim();
    
        if (query.length > 2) {  // Start searching after 3 characters
            try {
                const response = await fetch(`https://saavn.dev/api/search?query=${encodeURIComponent(query)}`);
                const data = await response.json();
                // console.log(data);
                displaySuggestions(data.data.songs.results);// Call a function to display the results
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else {
            // clearSearchResults();  // Clear results if query is too short
        }
    });
    
    function displaySuggestions(suggestions) {
        const search = document.getElementById('search-box');
        const suggestionsContainer = document.getElementById('suggestions');
        suggestionsContainer.innerHTML = '';
    
        if (suggestions.length === 0) {
            suggestionsContainer.classList.add('hidden');
            return;
        }
    
        suggestions.forEach(suggestion => {
            const item = document.createElement('li');
            item.className = 'suggestion-item';
            item.textContent = `${suggestion.title}`;
            item.addEventListener('click', () => {
                search.value = suggestion.title;
                suggestionsContainer.classList.add('hidden');
                searchById(suggestion.id)
            });
    
            suggestionsContainer.appendChild(item);
        });
    
        suggestionsContainer.classList.remove('hidden');
    }
    
    // Hide suggestions when clicking outside
    // document.addEventListener('click', (e) => {
    //     if (!search.contains(e.target) && !suggestionsContainer.contains(e.target)) {
    //         suggestionsContainer.classList.add('hidden');
    //     }
    // });

    // making function to search and play songs
    async function searchById(id) {
        const response = await fetch(`https://saavn.dev/api/songs/${id}`);
        const data = await response.json();
        
        // console.log(data);
        playRealtedSong(data.data[0]);
    }
    
});  
