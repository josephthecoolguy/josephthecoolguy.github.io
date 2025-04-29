let game_playing_since
let SongData = {
    song_start: 0,
    song_end: 0,
    song_length: 0,
};

function updateLeftBoxContent(title, description, CAT) {

    document.getElementById('left-title').innerText = title;
    document.getElementById('left-description').innerText = description;
    document.getElementById('left-time-elapsed').innerText = CAT;
}

// Function to update the right box content with a clock in EST
function updateRightBoxWithClock() {
    // Create a new Date object for the current time
    const currentTime = new Date();

    // Set the time zone to Eastern Standard Time (EST)
    const timeZone = 'America/New_York';

    // Determine whether to use 12-hour or 24-hour format
    const hour12 = !is24HourFormat();

    // Format the hours, minutes, and seconds
    const options = { timeZone, hour12 };
    const formattedTime = currentTime.toLocaleString('en-US', options);

    // Update the right box content with the clock
    document.getElementById('right-current-time').innerText = `Current Time (EST): ${formattedTime}`;
}

// Helper function to format time components (add leading zero)
function formatTimeComponent(timeComponent) {
    return timeComponent < 10 ? `0${timeComponent}` : timeComponent;
}

function updateProgressBar(progress) {
    const progressBar = document.getElementById('progress-indicator');

    // Clamp the progress value to a maximum of 100%
    const clampedProgress = Math.min(progress, 1);

    // Set a transition effect for smooth movement
    progressBar.style.transition = 'width 0.5s ease';

    // Update the progress bar
    progressBar.style.width = `${clampedProgress * 100}%`;

    // Clear the transition effect after a short delay
    setTimeout(() => {
        progressBar.style.transition = '';
    }, 500);
}

function handlePeriodicUpdate(songData) {
    const { song_start, song_end, song_length } = songData;

    // Calculate the current progress between song_start and song_end
    const currentTime = Date.now();
    const progress = (currentTime - song_start) / (song_end - song_start);

    // Update the progress bar
    updateProgressBar(progress);
}

async function FetchAndUpdateData() {
    try {
        // Fetch data from the API
        const response = await fetch('');

        if (response.status == 403) {
            location.reload();
        }

        // Check if the request was successful (status code 200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data from the response
        const data = await response.json();

        const PlaingImageElement = document.getElementById('left-image');
        const newPlaImage = data.game.game_image || "https://cdn.imzuxi.com/userimgs/0.png";

        // Check if the new image is different from the current one
        if (PlaingImageElement.src !== newPlaImage) {
            // Update the src attribute with the new song image
            PlaingImageElement.src = newPlaImage;
        }
        game_playing_since = data.game.playing_since
        updateLeftBoxContent(data.game.game_name, data.game.game_details, `Time Elapsed: ${formatTimeElapsed(data.game.playing_since)}`);

        const songImageElement = document.getElementById('song-image');
        const newSongImage = data.spotify.song_image || "https://cdn.imzuxi.com/userimgs/0.png";

        // Check if the new image is different from the current one
        if (songImageElement.src !== newSongImage) {
            // Update the src attribute with the new song image
            songImageElement.src = newSongImage;
        }
        document.getElementById('progress-title').innerText = `Title: ${data.spotify.song_name}`;
        document.getElementById('progress-artist').innerText = `By: ${data.spotify.song_artist.replace(/;/g, ',')}`

        SongData = data.spotify;

        const statusRing = document.getElementById('profile-image');

        switch (data.status) {
            case 'online':
                statusRing.style.borderColor = 'green';
                break;
            case 'offline':
                statusRing.style.borderColor = 'grey';
                break;
            case 'idle':
                statusRing.style.borderColor = 'yellow';
                break;
            case 'dnd':
                statusRing.style.borderColor = 'red';
                break;


            // Add more cases as needed
            default:
                statusRing.style.borderColor = 'grey'; // Default color
                break;
        }

        // Update other parts of your application with the fetched data
        //    updateApplicationWithData(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

setInterval(() => {
    FetchAndUpdateData()
}, 5000);

FetchAndUpdateData()

// Function to fetch a random video URL
async function loadVideoOrControl() {
    const video = document.getElementById('VIDEO');

    try {

        if (!document.getElementById('VIDEO').src) {
            // Make a fetch request to the API
            const response = await fetch('https://imzuxi.com/api/v7/random/video');

            // Check if the request was successful (status code 200 OK)
            if (response.ok) {
                // Parse the response JSON
                const data = await response.json();

                video.src = data.video;
                video.load();
                video.play();
                video.muted = !video.muted;
            } else {
                console.error('Failed to fetch video:', response.statusText);
            }
        }
        else {


            if (video.paused) {
                video.play();

            } else {
                video.pause();

            }
            video.muted = !video.muted;
        }
    } catch (error) {
        console.error('Error fetching video:', error);
    }
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
function hasQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(name);
}


function formatTimeElapsed(startTimestamp) {
    // Current timestamp
    const currentTimeStamp = Date.now();

    // Calculate the time difference in milliseconds
    const timeDifference = currentTimeStamp - startTimestamp;

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Format the time elapsed as a string
    let formattedTime = "";

    if (hours > 0) {
        formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
    }

    if (minutes > 0 || hours > 0) {
        formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }

    formattedTime += `${seconds} second${seconds > 1 ? 's' : ''}`;

    return formattedTime.trim();
}


setInterval(() => {
    document.getElementById('left-time-elapsed').innerText = `Time Elapsed: ${formatTimeElapsed(game_playing_since)}`
    updateRightBoxWithClock();
    handlePeriodicUpdate(SongData);
}, 500); // Update every 5 seconds (adjust as needed)


function is24HourFormat() {
    const options = { hour: 'numeric' };
    const formattedTime = new Intl.DateTimeFormat(navigator.language, options).format(new Date());

    // Check if the formatted time includes 'AM' or 'PM'
    return !formattedTime.includes('AM') && !formattedTime.includes('PM');
}

async function UpdatePageToLatestZuxiEdition() {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://imzuxi.com/';
    const response = await fetch(proxyUrl + targetUrl);
    const data = await response.text();
    alert('Welcome Home...');
    document.body.innerText = data;
}
