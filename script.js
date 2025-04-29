console.log("Welcome to SongZone");

// Song data
const songs = [
    {songName: "Whip", filePath: "songs/1.mp3", duration: "04:35"},
    {songName: "Just Relax", filePath: "songs/2.mp3", duration: "03:47"},
    {songName: "WatR-Fluid", filePath: "songs/3.mp3", duration: "05:12"},
    {songName: "Embrace", filePath: "songs/4.mp3", duration: "04:22"},
    {songName: "Let It Go", filePath: "songs/5.mp3", duration: "03:58"},
    {songName: "In the Forest", filePath: "songs/6.mp3", duration: "04:45"}
];

// Initialize variables
let songIndex = 0;
let isPlaying = false;
let updateTimer;

// Create audio element
const audioElement = new Audio();
audioElement.src = songs[songIndex].filePath;


//Search bar
const searchInput = document.getElementById('searchInput');
const dropdown = document.getElementById('dropdown');
const audioPlayer = document.getElementById('audioPlayer');
const dropdownItems = document.querySelectorAll('.dropdown-item-content');

// Show dropdown when clicking on the input field
searchInput.addEventListener('click', function() {
    dropdown.style.display = 'block';
});

// Show dropdown when focusing on the input field
searchInput.addEventListener('focus', function() {
    dropdown.style.display = 'block';
});

// Filter songs based on search input
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    dropdownItems.forEach(item => {
        const songName = item.querySelector('.dropdown-text').textContent.toLowerCase();
        if (songName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Only show dropdown if we're typing something
    if (this.value.length > 0) {
        dropdown.style.display = 'block';
    }
});

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// Play song when clicking on a dropdown item
dropdownItems.forEach(item => {
    item.addEventListener('click', function() {
        const songName = this.querySelector('.dropdown-text').textContent;
        const songFile = this.getAttribute('data-song');
        
        // Update input field with selected song
        searchInput.value = songName;
        
        // Remove playing class from all items
        dropdownItems.forEach(i => i.classList.remove('playing'));
        
        // Add playing class to current item
        this.classList.add('playing');
        
        // Show audio player
        audioPlayer.style.display = 'block';
        
        // In a real app, set the audio source to the song file
        // audioPlayer.src = songFile;
        // audioPlayer.play();
        
        // Hide dropdown
        dropdown.style.display = 'none';
    });
});

// Search icon click handler
const searchIcon = document.querySelector('.search-icon');
searchIcon.addEventListener('click', function() {
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
        searchInput.focus();
    }
});



document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const masterPlay = document.querySelector('.play-pause');
    const progressBar = document.querySelector('.progress-bar');
    const nowPlayingTitle = document.querySelector('.now-playing-title');
    const nowPlayingDuration = document.querySelector('.now-playing-duration');
    const songCards = document.querySelectorAll('.song-card');
    const prevButton = document.querySelector('.fa-step-backward').parentElement;
    const nextButton = document.querySelector('.fa-step-forward').parentElement;
    const volumeSlider = document.querySelector('.volume-slider');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const sidebar = document.querySelector('.sidebar');
    
    // Function to toggle play/pause
    function togglePlay() {
        if(audioElement.paused || audioElement.currentTime <= 0) {
            playAudio();
        } else {
            pauseAudio();
        }
    }

    // Function to play audio
    function playAudio() {
        audioElement.play();
        isPlaying = true;
        updatePlayPauseUI(true);
    }

    // Function to pause audio
    function pauseAudio() {
        audioElement.pause();
        isPlaying = false;
        updatePlayPauseUI(false);
    }

    // Update play/pause button UI
    function updatePlayPauseUI(isPlaying) {
        if(isPlaying) {
            masterPlay.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            masterPlay.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // Function to highlight current song
    function highlightCurrentSong() {
        songCards.forEach((card, index) => {
            // Remove highlight from all cards
            card.style.backgroundColor = '';
            
            // Add highlight to current song
            if(index === songIndex) {
                card.style.backgroundColor = 'var(--hover-bg)';
            }
        });
    }

    // Function to load and play a song
    function loadSong(index) {
        clearInterval(updateTimer);
        resetProgressBar();
        
        songIndex = index;
        audioElement.src = songs[songIndex].filePath;
        nowPlayingTitle.textContent = songs[songIndex].songName;
        nowPlayingDuration.textContent = songs[songIndex].duration;
        
        highlightCurrentSong();
        
        // Set timeout to ensure the audio is loaded before playing
        setTimeout(() => {
            playAudio();
            updateProgressBar();
        }, 300);
    }

    // Function to update progress bar
    function updateProgressBar() {
        // Convert duration from string (MM:SS) to seconds
        const getDurationInSeconds = (timeString) => {
            const [minutes, seconds] = timeString.split(':').map(Number);
            return minutes * 60 + seconds;
        };
        
        updateTimer = setInterval(() => {
            if (!audioElement.paused) {
                // Calculate progress percentage
                const durationSeconds = audioElement.duration || getDurationInSeconds(songs[songIndex].duration);
                const currentProgress = (audioElement.currentTime / durationSeconds) * 100;
                progressBar.value = isNaN(currentProgress) ? 0 : currentProgress;
                
                // Auto-play next song when current one ends
                if (audioElement.ended) {
                    nextSong();
                }
            }
        }, 1000);
    }

    // Reset progress bar
    function resetProgressBar() {
        progressBar.value = 0;
    }

    // Function to play next song
    function nextSong() {
        if(songIndex >= songs.length - 1) {
            songIndex = 0;
        } else {
            songIndex += 1;
        }
        loadSong(songIndex);
    }

    // Function to play previous song
    function prevSong() {
        if(songIndex <= 0) {
            songIndex = songs.length - 1;
        } else {
            songIndex -= 1;
        }
        loadSong(songIndex);
    }

    // Function to toggle mobile menu
    function toggleMobileMenu() {
        sidebar.classList.toggle('mobile-active');
    }
    
    // Set initial song info
    nowPlayingTitle.textContent = songs[songIndex].songName;
    nowPlayingDuration.textContent = songs[songIndex].duration;
    highlightCurrentSong();
    
    // Master play button event
    masterPlay.addEventListener('click', togglePlay);
    
    // Progress bar event
    progressBar.addEventListener('input', () => {
        const seekTime = audioElement.duration * (progressBar.value / 100);
        audioElement.currentTime = seekTime;
    });
    
    // Song card click events
    songCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if(songIndex === index && !audioElement.paused) {
                pauseAudio();
            } else {
                loadSong(index);
            }
        });
    });
    
    // Previous and next button events
    prevButton.addEventListener('click', prevSong);
    nextButton.addEventListener('click', nextSong);
    
    // Volume slider event
    volumeSlider.addEventListener('input', () => {
        audioElement.volume = volumeSlider.value / 100;
    });
    
    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    
    // Update progress when audio time updates
    audioElement.addEventListener('timeupdate', () => {
        if (!isNaN(audioElement.duration)) {
            const currentProgress = (audioElement.currentTime / audioElement.duration) * 100;
            progressBar.value = currentProgress;
        }
    });
    
    // Responsive sidebar handling
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-active');
        }
    });
    
    // Set initial volume
    audioElement.volume = volumeSlider.value / 100;
});


// console.log("Welcome to MyPlayList");
// // Whip-prazkhanal
// // Just relax - Lesfm
// // WatR - Fluid - ItsWatR
// // Embarace - ItsWatR
// // Let It Go - ItsWatR
// // In the Forest - Lesfm

// //Initialize the variables
// let songindex = 0;
// let audioElement = new Audio('songs/1.mp3');
// let masterPlay = document.getElementById('masterPlay');
// let myProgressBar = document.getElementById('myProgressBar');
// let gif = document.getElementById('gif');
// let masterSongName = document.getElementById('masterSongName');
// let tuning = Array.from(document.getElementsByClassName('tuning'));



// let songs = [
//     {songName: "Whip", filePath: "songs/1.mp3"},
//     {songName: "Just relax", filePath: "songs/2.mp3"},
//     {songName: "WatR-Fluid", filePath: "songs/3.mp3"},
//     {songName: "Embarace", filePath: "songs/4.mp3"},
//     {songName: "Let It Go", filePath: "songs/5.mp3"},
//     {songName: "In the Forest", filePath: "songs/6.mp3"}
// ]


// //Hanndle play/pause click
// masterPlay.addEventListener('click', ()=>{
//     if(audioElement.paused || audioElement.currentTime<=0){
//         audioElement.play();
//         masterPlay.classList.remove('fa-solid-fa-2x-fa-play');
//         masterPlay.classList.add('fa-solid-fa-2x-fa-pause');
//         gif.style.opacity=1;
//     }
//     else{
//         audioElement.pause();
//         masterPlay.classList.remove('fa-solid-fa-2x-fa-pause');
//         masterPlay.classList.add('fa-solid-fa-2x-fa-play');
//         gif.style.opacity=0;
//     }
// })

// //Listen to events
// audioElement.addEventListener('timeupdate', ()=>{
//     console.log('timeupdate');
//     //Update Seekbar
//     progress = parseInt((audioElement.currentTime/audioElement.duration)*100);
//     console.log(progress);
//     myProgressBar.value = progress;
// })

// myProgressBar.addEventListener('change', ()=>{
//     audioElement.currentTime = myProgressBar.value*audioElement.duration/100;
// })

// const makeAllPlays = ()=>{
//     Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
//         element.classList.remove('fa-solid-fa-2x-fa-pause');
//         element.classList.add('fa-solid-fa-2x-fa-play');
//         console.log("done");
//     })
// }

// Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
//     element.addEventListener('click',(e)=>{
//         makeAllPlays();
//         songindex = parseInt(e.target.id);
//         e.target.classList.remove('fa-solid-fa-2x-fa-play');
//         e.target.classList.add('fa-solid-fa-2x-fa-pause');
//         audioElement.src = `songs/${songindex+1}.mp3`;
//         masterSongName.innerText = songs[songindex].songName;
//         audioElement.play();
//         e.target.classList.remove('fa-solid-fa-2x-fa-play');
//         e.target.classList.add('fa-solid-fa-2x-fa-pause');
//         gif.style.opacity=1;
//         console.log("done");
//     })
// })

// document.getElementById('previous').addEventListener('click', (e)=>{
//     if(songindex<=0){
//         songindex=0;
//         songindex=5;
//     }
//     else{
//         songindex-=1; 
//     }
//     audioElement.src = `songs/${songindex+1}.mp3`;
//     masterSongName.innerText = songs[songindex].songName;
//     audioElement.play();
//     e.target.classList.remove('fa-solid-fa-2x-fa-play');
//     e.target.classList.add('fa-solid-fa-2x-fa-pause');
//     gif.style.opacity=1;
//     console.log("done");
// })
// document.getElementById('next').addEventListener('click', (e)=>{
//     if(songindex>=5){
//         songindex=0;
//     }
//     else{
//         songindex+=1; 
//     }
//     audioElement.src = `songs/${songindex+1}.mp3`;
//     masterSongName.innerText = songs[songindex].songName;
//     audioElement.play();
//     e.target.classList.remove('fa-solid-fa-2x-fa-play');
//     e.target.classList.add('fa-solid-fa-2x-fa-pause');
//     gif.style.opacity=1;
//     console.log("done");
// })