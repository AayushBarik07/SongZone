console.log("Welcome to MyPlayList");
// Whip-prazkhanal
// Just relax - Lesfm
// WatR - Fluid - ItsWatR
// Embarace - ItsWatR
// Let It Go - ItsWatR
// In the Forest - Lesfm

//Initialize the variables
let songindex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let tuning = Array.from(document.getElementsByClassName('tuning'));



let songs = [
    {songName: "Whip", filePath: "songs/1.mp3"},
    {songName: "Just relax", filePath: "songs/2.mp3"},
    {songName: "WatR-Fluid", filePath: "songs/3.mp3"},
    {songName: "Embarace", filePath: "songs/4.mp3"},
    {songName: "Let It Go", filePath: "songs/5.mp3"},
    {songName: "In the Forest", filePath: "songs/6.mp3"}
]


//Hanndle play/pause click
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play();
        masterPlay.classList.remove('fa-solid-fa-2x-fa-play');
        masterPlay.classList.add('fa-solid-fa-2x-fa-pause');
        gif.style.opacity=1;
    }
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-solid-fa-2x-fa-pause');
        masterPlay.classList.add('fa-solid-fa-2x-fa-play');
        gif.style.opacity=0;
    }
})

//Listen to events
audioElement.addEventListener('timeupdate', ()=>{
    console.log('timeupdate');
    //Update Seekbar
    progress = parseInt((audioElement.currentTime/audioElement.duration)*100);
    console.log(progress);
    myProgressBar.value = progress;
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value*audioElement.duration/100;
})

const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-solid-fa-2x-fa-pause');
        element.classList.add('fa-solid-fa-2x-fa-play');
        console.log("done");
    })
}

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
    element.addEventListener('click',(e)=>{
        makeAllPlays();
        songindex = parseInt(e.target.id);
        e.target.classList.remove('fa-solid-fa-2x-fa-play');
        e.target.classList.add('fa-solid-fa-2x-fa-pause');
        audioElement.src = `songs/${songindex+1}.mp3`;
        masterSongName.innerText = songs[songindex].songName;
        audioElement.play();
        e.target.classList.remove('fa-solid-fa-2x-fa-play');
        e.target.classList.add('fa-solid-fa-2x-fa-pause');
        gif.style.opacity=1;
        console.log("done");
    })
})

document.getElementById('previous').addEventListener('click', (e)=>{
    if(songindex<=0){
        songindex=0;
        songindex=5;
    }
    else{
        songindex-=1; 
    }
    audioElement.src = `songs/${songindex+1}.mp3`;
    masterSongName.innerText = songs[songindex].songName;
    audioElement.play();
    e.target.classList.remove('fa-solid-fa-2x-fa-play');
    e.target.classList.add('fa-solid-fa-2x-fa-pause');
    gif.style.opacity=1;
    console.log("done");
})
document.getElementById('next').addEventListener('click', (e)=>{
    if(songindex>=5){
        songindex=0;
    }
    else{
        songindex+=1; 
    }
    audioElement.src = `songs/${songindex+1}.mp3`;
    masterSongName.innerText = songs[songindex].songName;
    audioElement.play();
    e.target.classList.remove('fa-solid-fa-2x-fa-play');
    e.target.classList.add('fa-solid-fa-2x-fa-pause');
    gif.style.opacity=1;
    console.log("done");
})