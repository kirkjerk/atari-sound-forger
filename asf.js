/*

    TODO:
        
        -test in firefox remove slash from mapping!!
        
        -record
        -clicktrack
        -convert to bB  

    MAYBE:
        - upper case keys as option?




    keyMap maps a keboard key to 
        (t)one - voice/channel
        (f)req - frquency
        (m)usic (tbd: but to put it on a musical keyboard)
        (d)uration (tbd: duration-type, if null steady tone til release, rest tbd)

*/

// const availableTone = {
//     1: 'buzzy',
//     2: 'buzzy/ramble',
//     3: 'flangy/wavering',
//     4: 'pure',
//     6: 'pure/buzzy',
//     7: 'reedy/rumble',
//     8: 'white noise',
//     12: 'pure lower',
//     14: 'electronic/rumble',
//     15: 'electronic/rumble',
// };

const ASF = {};

ASF.log = (msg) => {
    window.log.innerHTML += msg + '\n';
};

ASF.clipCache = {}; // map of toneFreqInt2Key to a playable sound file
ASF.key2kbdDomId = {}; //key code to id of typewriter keyboard key, to light up
ASF.key2pianoDomId = {}; //key code to id of typewriter keyboard key, to light up

ASF.recording = [];

function loadStuff() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const loadedMaps = localStorage.getItem('atari-sound-forger-maps');
    try {
        ASF.maps = loadedMaps ? JSON.parse(loadedMaps) : defaultMaps;
        window.mappingsets.value = JSON.stringify(ASF.maps, null, ' ');
    } catch (e) {
        alert(`error loading mapping set json, using defaults, edit below\n ${e}`);
        window.mappingsets.value = loadedMaps;
        ASF.maps = defaultMaps;
    }

    const previousMapIndex = localStorage.getItem('atari-sound-forger-map-index');
    ASF.currentMapIndex = previousMapIndex === undefined ? 0 : previousMapIndex;

    ASF.tap = new Pizzicato.Sound({
        source: 'file',
        options: { path: 'fx/ds_cross_stick_rim.wav' },
    });

    ASF.oneframeInMillis = 1000 / 60;

    populateDropdownFromAvailableMaps(ASF.currentMapIndex);
    setupSelectedMap();
}

function storeMappingSetsAndReload() {
    const raw = window.mappingsets.value;
    if (raw === '') {
        localStorage.removeItem('atari-sound-forger-maps');
        return;
    }
    try {
        const parsed = JSON.parse(raw);
        localStorage.setItem('atari-sound-forger-maps', raw);
        location.reload();
    } catch (e) {
        alert(`error parsing json\n ${e}`);
    }
}

function toneFreqInt2Key(t, f) {
    return `${t}_${f}`;
}

function loadAllFilesForMap(map) {
    //ASF.log(JSON.stringify(map.key2tfm));
    Object.keys(map.key2tfm).map((key) => {
        const t_f = map.key2tfm[key];

        getFileForTF(t_f.t, t_f.f);
    });
}

// put a Pizzicato sound clip in the cache if not there already
function getFileForTF(tone, freq) {
    const key = toneFreqInt2Key(tone, freq);
    if (ASF.clipCache[key]) return ASF.clipCache[key];

    const showtone = `${tone}`.length === 1 ? `0${tone}` : tone;
    const showfreq = `${freq}`.length === 1 ? `0${freq}` : freq;
    const path = `./wav/sound_${showtone}_${showfreq}.wav`;
    ASF.clipCache[key] = new Pizzicato.Sound({
        source: 'file',
        options: { loop: true, path },
    });
    return ASF.clipCache[key];
}

function keyToClipInCurrentMap(key) {
    const t_f = ASF.currentMap.key2tfm[key];
    if (!t_f) return null;
    const clip = getFileForTF(t_f.t, t_f.f);
    return clip;
}

function stopAllSounds() {
    Object.keys(ASF.currentMap.key2tfm).forEach((key) => {
        stopSound(key);
    });
}

function handleKeyDown(e) {
    startSound(e.key);
    ASF.recording.push({ event: 'down', key: e.key, time: Date.now() });
}
function startSound(keypressed) {
    const clip = keyToClipInCurrentMap(keypressed);
    if (clip) {
        clip.play();
        const kbdDom = document.getElementById(ASF.key2kbdDomId[keypressed]);

        if (kbdDom) {
            kbdDom.classList.add('keydown');
        }

        const pianoDom = document.getElementById(ASF.key2pianoDomId[keypressed]);

        if (pianoDom) {
            pianoDom.classList.add('keydown');
        }
    } else console.log(`no play for ${keypressed}`);
}

function handleKeyUp(e) {
    stopSound(e.key);
    ASF.recording.push({ event: 'up', key: e.key, time: Date.now() });
}
function stopSound(keypressed) {
    const clip = keyToClipInCurrentMap(keypressed);
    if (clip) {
        clip.stop();
        const kbdDom = document.getElementById(ASF.key2kbdDomId[keypressed]);
        if (kbdDom) {
            kbdDom.classList.remove('keydown');
        }
        const pianoDom = document.getElementById(ASF.key2pianoDomId[keypressed]);

        if (pianoDom) {
            pianoDom.classList.remove('keydown');
        }
    } else console.log(`no stop for ${keypressed}`);
}

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function setupSelectedMap() {
    ASF.key2kbdDomId = {};
    const selectElem = window.mapSelect;
    ASF.currentMap = ASF.maps[selectElem.options[selectElem.selectedIndex].value];
    //ASF.log(`selected tone ${JSON.stringify(ASF.currentMap)}`);
    loadAllFilesForMap(ASF.currentMap);

    window.keyboardWrapper.innerHTML = renderUSTypingKeyboard(ASF.currentMap);
    window.pianoWrapper.innerHTML = renderPiano(ASF.currentMap);

    selectElem.blur();

    localStorage.setItem('atari-sound-forger-map-index', selectElem.selectedIndex);
}

function populateDropdownFromAvailableMaps(select) {
    const elem = window.mapSelect;
    let buf = '';
    ASF.maps.map((map, key) => {
        const desc = map.desc;
        const selected = select == key ? 'selected' : '';
        buf += `<option ${selected} value='${key}'>${desc}</option>\n`;
    });
    elem.innerHTML = buf;
}

function renderPiano(currentMap) {
    let buf = '';
    let minOctave = 10;
    let maxOctave = -1;
    let hasPianoNotes = false;
    const note2hunk = {};
    const note2type = {};

    //for now I'm calling "hunk" the little tone/freq/pianonote map

    //go over each mapping and see if it has piano note attached, figure min/max octaves
    Object.keys(currentMap.key2tfm).forEach((key) => {
        const hunk = currentMap.key2tfm[key];
        if (hunk.p) {
            note2hunk[hunk.p] = hunk;
            note2type[hunk.p] = key;
            hasPianoNotes = true;
            const octave = hunk.p.slice(1, 2);
            if (octave < minOctave) minOctave = octave;
            if (octave > maxOctave) maxOctave = octave;
        }
    });

    if (!hasPianoNotes) return '';

    for (let i = minOctave; i <= maxOctave; i++) {
        buf += renderOctave(currentMap, i, note2type, note2hunk);
    }
    return buf;
}

function renderOctave(currentMap, octave, note2type, note2hunk) {
    const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    return notes.map((note) => renderPianoKey(note, octave, note2type, note2hunk)).join('');
}

let pianoKeyCounter = 0;

function renderPianoKey(note, octave, note2type, note2hunk) {
    const sharp = note.length === 2;
    const notename = note.length === 1 ? `${note}${octave}` : `${note.charAt(0)}${octave}#`;

    const typeKey = note2type[notename] ? `<div><b>${note2type[notename]}</b></div>` : '';
    const disabled = note2type[notename] ? '' : 'disabled';

    const caption = note2type[notename] ? `${typeKey}${notename}` : '';

    const kbdDomId = `piano_${pianoKeyCounter}`;
    pianoKeyCounter++;

    // note2type[notename] is key they are typing, record the element so we can light it up

    ASF.key2pianoDomId[note2type[notename]] = kbdDomId;

    return !sharp
        ? `<div class='wrapper'><div id='${kbdDomId}' class='key ${disabled}'>${caption}</div></div>`
        : `<div class='wrapper'><div id='${kbdDomId}' class='key sharp ${disabled}'>${caption}</div></div>`;
}

function renderUSTypingKeyboard(currentMap) {
    const keys = `\`1234567890-=
~~~qwertyuiop[]\\
~~~~asdfghjkl;'
~~~~~zxcvbnm,.
~~~~~~~~ `;

    let keyCounter = 0;

    function makeRow(cs) {
        return cs.split('').map(makeKey).join('');
    }
    function makeKey(c) {
        const t_f_for_c = currentMap.key2tfm[c];

        const soundDisplay = t_f_for_c ? `<div>${t_f_for_c.t}:${t_f_for_c.f}</div>` : '';

        const kbdDomId = `kbd_${keyCounter}`;
        keyCounter++;

        if (c === '~') {
            return `<div class='spacer' id='${kbdDomId}'> </div>`;
        }
        if (c === ' ') {
            return `<div class='space' id='${kbdDomId}'>${c}${soundDisplay}</div>`;
        }

        ASF.key2kbdDomId[c] = kbdDomId;

        return `<div  id='${kbdDomId}'><b>${c}</b>${soundDisplay}</div>`;
    }

    const rowsOfKeys = keys.split('\n');
    const rows = rowsOfKeys.map(makeRow);

    return rows.map((rowcontent) => `<div class='typewriter-row'>${rowcontent}</div>`).join('');
}

function startBeat() {
    if (ASF.tapTimer) clearInterval(ASF.tapTimer);
    ASF.tapTimer = setInterval(() => ASF.tap.play(), ASF.oneframeInMillis * 8);
}
function stopBeat() {
    clearInterval(ASF.tapTimer);
    ASF.tapTimer = null;
}
function playBack() {
    console.log(ASF.recording);
    if (ASF.recording.length <= 0) return;
    const startTime = ASF.recording[0].time;

    for (let i = 0; i < ASF.recording.length; i++) {
        const e = ASF.recording[i];
        const delay = e.time - startTime;
        console.log(delay);
        if (e.event === 'down') {
            setTimeout(() => {
                startSound(e.key);
            }, delay);
        }
        if (e.event === 'up') {
            setTimeout(() => {
                stopSound(e.key);
            }, delay);
        }
    }
}

ready(loadStuff);
