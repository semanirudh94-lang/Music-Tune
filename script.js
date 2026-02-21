console.log('Lets write java script');
    let currentsong = new Audio();
    let songs ;
    let currentFolder = "songs/lofi-songs/";
function secondToMinuteSeconds(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "Invalid input"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`

}


async function getSongs(folder = "") { 
    let folderPath = folder || currentFolder;
    let a = await fetch(`http://127.0.0.1:3000/${folderPath}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // 🔴 FIX 1 — only take the file name, not the full local path
            let songName = element.href.split("/").pop();  
            songs.push(songName);
        }
    }

    console.log("✅ Songs loaded:", songs);
    return songs;
}

const playmusic = async (track) => {
    console.clear();
    console.log("🟢 Input track:", track);

    track = track.replace(/\\/g, "/").trim();
    if (!track.endsWith(".mp3")) track += ".mp3";

    // 🟢 FIXED PATH HANDLING
    let cleanTrack = track.replace(/^songs[\\/]+/, "");
    let fullPath = `http://127.0.0.1:3000/${cleanTrack}`.replace(/\\/g, "/");

    console.log("🎧 Full Path to play:", fullPath);

    try {
        const res = await fetch(fullPath);
        if (!res.ok) {
            console.error("❌ File not found:", fullPath);
            return;
        }
        console.log("✅ File found, playing...");

        currentsong.src = fullPath;
        await currentsong.play();
        play.src = "pause.svg";

        console.log("🎶 Playing:", fullPath);
    } catch (err) {
        console.error("🚫 Error playing file:", err);
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};




// const playmusic = (track, pause=false)=>{
//     // let audio = new Audio("/songs/" + track)

// // currentsong.src =  `http://127.0.0.1:3000/${currentFolder}${track}`;
// currentsong.src = track.startsWith("http") 
//   ? track 
//   : `http://127.0.0.1:3000/${currentFolder}${track}`;


//     currentsong.play()
//          play.src = "pause.svg"
// document.querySelector(".songinfo").innerHTML = decodeURI(track)
// document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
// }

async function main(){

songs = await getSongs()

let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
 songUL.innerHTML = "";

for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li>
                    <img class="invert" src="play.svg" alt="">
                    <div class="info">
                        <div>${song.replaceAll("%20"," ")}</div>
                        <div>Piyush</div>
                    </div>
                </li>`;
            }


Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
    console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
})
play.addEventListener("click", ()=>{
    if(currentsong.paused){
        currentsong.play()
        play.src = "pause.svg"

    }
    else{
        currentsong.pause()
        play.src = "play.svg"
    }
})
currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime,currentsong.duration);
    document.querySelector(".songtime").innerHTML = `
    ${secondToMinuteSeconds(currentsong.currentTime)}/${
secondToMinuteSeconds(currentsong.duration)}`
document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";

})


document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
document.querySelector(".circle").style.left = percent + "%";
currentsong.currentTime = ((currentsong.duration) * percent) / 100;
})
document.querySelector(".hamverger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = 0;

})
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-100%";
    
})
previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src);

    // If song not found, try matching by file name
    if (index === -1) {
        let currentName = currentsong.src.split("/").slice(-1)[0];
        index = songs.findIndex(song => song.endsWith(currentName));
    }

    if (index > 0) {
        let prevSong = songs[index - 1].split("/").slice(-1)[0];
        playmusic(prevSong);
    } else {
        console.log("No previous song");
    }
});

next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src);

    // If song not found, try matching by file name
    if (index === -1) {
        let currentName = currentsong.src.split("/").slice(-1)[0];
        index = songs.findIndex(song => song.endsWith(currentName));
    }

    if (index < songs.length - 1) {
        let nextSong = songs[index + 1].split("/").slice(-1)[0];
        playmusic(nextSong);
    } else {
        console.log("No next song");
    }
});


previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src);

    // If song not found, try matching by file name
    if (index === -1) {
        let currentName = currentsong.src.split("/").slice(-1)[0];
        index = songs.findIndex(song => song.endsWith(currentName));
    }

    if (index > 0) {
        let prevSong = songs[index - 1].split("/").slice(-1)[0];
        playmusic(prevSong);
    } else {
        console.log("No previous song");
    }
});

next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src);


    if (index === -1) {
        let currentName = currentsong.src.split("/").slice(-1)[0];
        index = songs.findIndex(song => song.endsWith(currentName));
    }

    if (index < songs.length - 1) {
        let nextSong = songs[index + 1].split("/").slice(-1)[0];
        playmusic(nextSong);
    } else {
        console.log("No next song");
    }
});

document.querySelector(".range input").addEventListener("input", (e)=>{
    let volume = e.target.value/100;
    currentsong.volume = volume;
})

document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", async () => {
        let folder = card.dataset.folder;
        console.log("🟢 Folder clicked:", folder);

        // 🔴 FIX: Always include base songs folder
        let folderPath = `songs/${folder}/`;

        let songs = await getSongs(folderPath);
        console.log("🎶 Songs loaded:", songs);

        let songUL = document.querySelector(".songlist ul");
        songUL.innerHTML = "";

        for (const song of songs) {
            let songName = song.split("/").pop().replaceAll("%20", " ");
            songUL.innerHTML += `
                <li>
                    <img class="invert" src="play.svg" alt="">
                    <div class="info">
                        <div>${songName}</div>
                        <div>${folder}</div>
                    </div>
                </li>`;
        }

        // 🔴 FIX: Update currentFolder (needed for next/prev)
        currentFolder = folderPath;

        // Add click event to each song
        Array.from(songUL.getElementsByTagName("li")).forEach(li => {
            li.addEventListener("click", () => {
                // let track = li.querySelector(".info div").innerHTML.trim();
                // let fullPath = `${folderPath}${track}`;
                // console.log("▶️ Trying to play:", fullPath); // 🔍 Debug

                // playmusic(fullPath); // ✅ Pass full correct path
                let track = li.querySelector(".info div").innerHTML.trim();

// 🔴 FIX 3 — just pass filename, let playmusic build full path
console.log("▶️ Trying to play:", track);
playmusic(track);

            });
        });
    });
});




}






main()


