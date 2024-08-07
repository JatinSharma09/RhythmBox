let volume = () => {
    let vol_slider = document.getElementById('volume');
    if (vol_slider.style.display === "none") {
        vol_slider.style.display = "block";
    } else {
        vol_slider.style.display = "none";
    }


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
        } else if (event.key === 'ArrowUp') {
            volume.value = Math.min(volume.value + 10, 100);
            audio.volume = volume.value / 100;
            volume.style.display = 'block';

        } else if (event.key === 'ArrowDown') {
            volume.value = Math.max(volume.value - 10, 0);
            audio.volume = volume.value / 100;
            volume.style.display = 'block';
        }
        // Prevent the page from scrolling when pressing arrow keys
        event.stopPropagation();
        event.preventDefault();
        // Close the volume slider automatically after some time
        setTimeout(() => {
            volume.style.display = 'none';
        }, 5000);

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
        const response = await fetch('https://saavn.dev/api/playlists?link=https://www.jiosaavn.com/featured/trending-today/I3kvhipIy73uCJW60TJk1Q__');
        const data = await response.json();
        songs = data.data.songs;

        // Update the initial 10 cards
        for (let i = 0; i < 10; i++) {
            updateCard(i, songs[i]);
        }

        // Generate additional 40 cards dynamically
        for (let i = 10; i < songs.length; i++) {
            createCard(i, songs[i]);
        }
    }

    function updateCard(index, song) {
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
        playButton.addEventListener('click', () => playSong(index));
    }

    function createCard(index, song) {
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
                <span class="block text-[10px] font-semibold text-pink-600">NEW FOR YOU</span>
                <span class="block text-[18px] font-semibold mt-1" id="card-sn-${index}">${cleanTitle(song.name)}</span>
                <p class="block text-[14px] font-semibold text-[#9898A6]" id="card-a-${index}">${song.artists.primary[0].name}</p>
            </div>
        </div>
        `;
        document.getElementById('cards-container').appendChild(cardContainer);  // Ensure you have a container with this ID in your HTML

        // Add event listener to play button
        const playButton = document.getElementById(`id-${index}`);
        playButton.addEventListener('click', () => playSong(index));
    }

    getSongData();


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

        img.src = song.image[2].url;
        artist.textContent = song.artists.primary[0].name;
        title.textContent = cleanTitle(song.name);
        second_artist.textContent = '';
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

    async function getPlayLists() {
        const playListNames = ['badshah', 'arijit', 'monsoon', 'indie pop', '90s', '80s'];
        for (let i = 0; i < playListNames.length; i++) {
            // console.log(playListNames[i]);
            const response = await fetch(`https://saavn.dev/api/search/playlists?query=${playListNames[i]}`);
            const data = await response.json();
            // console.log(data);

            const cardImage = document.getElementById(`play-i-${i}`);
            cardImage.src = data.data.results[0].image[1].url;
            const cardName = document.getElementById(`play-name-${i}`);
            cardName.textContent = data.data.results[0].name;
            const cardType = document.getElementById(`play-type-${i}`);
            cardType.textContent = data.data.results[0].type;
            const songCount = document.getElementById(`play-sc-${i}`);
            songCount.textContent = data.data.results[0].language;
        }


    }
    getPlayLists();


});
