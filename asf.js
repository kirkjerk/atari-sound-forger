/*

Stop things for reals w/ loops...
see about not doing typing thing

    TODO:
    MAYBE:
        - upper case keys as option?
        -sounds with decay

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

ASF.recording = null;
ASF.recordingKeysNowDown = {};
ASF.loops = [];

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
    ASF.counts = [];
    for (let i = 1; i <= 4; i++) {
        ASF.counts[`${i}`] = new Pizzicato.Sound({
            source: 'file',
            options: { path: `fx/${i}.wav` },
        });
    }

    ASF.bpm = 120;
    ASF.fpc = 30;
    ASF.oneframeInMillis = 1000 / 60;
    ASF.millisPerTap = 60000 / ASF.bpm; // matches 120 bpm
    ASF.beatsPerMeasure = 4;
    ASF.nowPlaying = false;

    populateDropdownFromAvailableMaps(ASF.currentMapIndex);
    setupSelectedMap();

    setPlaybackButtonOn();
}

function restoreDefaultMappings() {
    window.mappingsets.value = JSON.stringify(defaultMaps, null, ' ');
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
}
function startSound(keypressed) {
    const clip = keyToClipInCurrentMap(keypressed);
    if (clip) {
        clip.play();

        const t_f = ASF.currentMap.key2tfm[keypressed];

        ASF.recordingKeysNowDown[keypressed] = { t_f, starttime: Date.now() };

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
}
function stopSound(keypressed) {
    const clip = keyToClipInCurrentMap(keypressed);
    if (clip) {
        clip.stop();
        const recordedKeyDown = ASF.recordingKeysNowDown[keypressed];
        if (recordedKeyDown) {
            recordedKeyDown.endtime = Date.now();
        }
        if (ASF.recording) {
            ASF.recording.push(recordedKeyDown);
        }

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
    console.log(ASF.counts);

    const domStatus = document.getElementById('recordingStatus');
    if (ASF.tapTimer) clearInterval(ASF.tapTimer);
    ASF.tapTimer = setInterval(() => {
        if (ASF.beatsToGo === 0) {
            ASF.recordingStartTimeInMills = Date.now(); // - 150;//hack
            playBack();
        }
        if (ASF.beatsToGo >= 1 && ASF.beatsToGo <= 4) {
            ASF.counts[`${ASF.beatsToGo}`].play();
        } else {
            ASF.tap.stop();
            ASF.tap.play();
        }
        domStatus.innerHTML = ASF.beatsToGo <= 0 ? 'RECORDING' : ASF.beatsToGo;
        ASF.beatsToGo--;
    }, ASF.millisPerTap);
}
function stopBeat() {
    if (ASF.tapTimer) clearInterval(ASF.tapTimer);
    ASF.tapTimer = null;
}

function toggleRecording() {
    const domToggle = document.getElementById('toggleRecording');
    if (!ASF.recording) {
        ASF.recording = [];
        domToggle.innerHTML = '◾ stop recording';

        const useClickTrack = document.getElementById('useClickTrack').checked;
        if (useClickTrack) {
            ASF.beatsToGo = 4;
            startBeat();
        } else {
            ASF.beatsToGo = 0;
        }
    } else {
        stopBeat();
        ASF.nowPlaying = false;
        document.getElementById('recordingStatus').innerHTML = '';

        const recordingZeroedFromStartTime = ASF.recording.map((x) => {
            return {
                starttime: x.starttime - ASF.recordingStartTimeInMills,
                endtime: x.endtime - ASF.recordingStartTimeInMills,
                t_f: x.t_f,
            };
        });
        console.log(ASF.recording);
        console.log(recordingZeroedFromStartTime);
        ASF.loops.push({ track: recordingZeroedFromStartTime, meta: { padTo: -1 } });

        makeLoopDisplays();

        ASF.recording = null;
        domToggle.innerHTML = '◉ start recording';
    }
}

function makeLoopDisplays() {
    const domWrapper = document.getElementById('loopWrapper');
    let buf = '';

    for (let i = 0; i < ASF.loops.length; i++) {
        const loop = ASF.loops[i];
        const trackAsMillis = loop.track;
        const padTo = loop.meta.padTo;
        if (trackAsMillis.length > 0) {
            const trackAsFrames = translateIntoFramesWithPauses(trackAsMillis, padTo);
            const finalThing = trackAsFrames[trackAsFrames.length - 1];
            const finalFrame = finalThing.endframe + finalThing.pauseframes;
            const finalBeat = ((finalFrame * ASF.bpm) / 3600).toFixed(2);

            // const width = loop.meta.padTo == -1 ? finalFrame : loop.meta.padTo * ASF.fpc;
            buf += `<div class='loopWrapper'><div class='loop' style='width:${finalFrame}px' id='track-${i}'>${trackAsFrames
                .map((frameblock) => makeFrameBlock(frameblock))
                .join('')}${makeBars(finalFrame)}</div>
                <div>
                    
                    <a onclick='deleteLoop(${i});return false;' href='#'>delete</a>
                </div>
                </div>
             ${finalFrame} frames ${finalBeat} beats
                    ${showPadOption(i, loop.meta, finalBeat)}
            <br><br>
            `;
        }
    }
    domWrapper.innerHTML = buf;
}

function showPadOption(index, meta, finalBeat) {
    const hasPad = meta.padTo != -1;
    if (hasPad) {
        return `<label><input checked id='padTo_${index}' type='checkbox' onclick='setPadLoop(${index},-1);'>
                    padded to ${meta.padTo} beats</a></label><a onclick='setupPadLoop(${index},${finalBeat});return false;' href='#'>change</a>
            `;
    }
    return `<label><input id='padTo_${index}' type='checkbox' onclick='setupPadLoop(${index},${finalBeat})' >pad track to whole beats</label>`;
}

function setupPadLoop(index, finalBeat) {
    const suggestion = nextMultipleOfFour(finalBeat);
    const res = prompt('Pad to make how many beats?', suggestion);
    if (res) setPadLoop(index, res);
}

function nextMultipleOfFour(finalBeat) {
    let x = Math.ceil(finalBeat);
    while (x % 4 != 0) x++;
    return x;
}

function setPadLoop(index, beatcount) {
    ASF.loops[index].meta.padTo = beatcount;
    makeLoopDisplays();
}

function makeFrameBlock(fb) {
    return `<div style='left:${fb.startframe}px; width:${fb.durationframes}px;top:${fb.f}px'></div>`;
}

function makeBars(finalFrame) {
    const barCount = parseInt(finalFrame / (ASF.fpc * ASF.beatsPerMeasure)) + 1;
    let buf = '';
    for (let i = 1; i < barCount; i++) {
        buf += `<div class='bar' style='left:${i * (ASF.fpc * ASF.beatsPerMeasure)}px'></div>`; //pixelsPerFrame = 1
    }
    return buf;
}

function deleteLoop(index) {
    ASF.loops.splice(index, 1);
    makeLoopDisplays();
}

function togglePlayBack() {
    if (!ASF.nowPlaying) {
        playBack();
        ASF.nowPlaying = true;
        setPlaybackButtonOff();
    } else {
        ASF.nowPlaying = false;
        setPlaybackButtonOn();
    }
}

function playBack() {
    for (let i = 0; i < ASF.loops.length; i++) {
        playBackLoop(ASF.loops[i].track, ASF.loops[i].meta.padTo);
    }
}

function playBackLoop(track, padTo) {
    if (track.length <= 0) return;
    // const startTime = track[0].starttime;

    const timeToCheckRestart = padTo == -1 ? track[track.length - 1].endtime : padTo * ASF.millisPerTap;

    for (let i = 0; i < track.length; i++) {
        const e = track[i];
        const delayStart = e.starttime; //- startTime;
        const delayStop = e.endtime; // - startTime;
        const t_f = e.t_f;
        const clip = getFileForTF(t_f.t, t_f.f);

        setTimeout(() => {
            clip.play();
        }, delayStart);
        setTimeout(() => {
            clip.stop();
        }, delayStop);
    }
    setTimeout(() => {
        if (ASF.nowPlaying) {
            console.log('pete repeat', track, padTo);
            playBackLoop(track, padTo);
        }
    }, timeToCheckRestart);
}

function promptBPM() {
    const bpm = prompt('How many BPM?', ASF.bpm);
    if (bpm) {
        ASF.bpm = bpm;
        ASF.fpc = 3600 / bpm;
        window.bpm.innerHTML = bpm;
        window.fpc.innerHTML = ASF.fpc;
        ASF.millisPerTap = (60 * 1000) / bpm;
    }
}

function generateBasicData(track, padTo) {
    const framevents = translateIntoFramesWithPauses(track, padTo);
    let buf = '';

    if (framevents.length == 0) return '';

    const initialTime = framevents[0].startframe;

    if (initialTime > 0) {
        buf += `   0, 0, 0, ${initialTime},\n`;
    }

    for (let i = 0; i < framevents.length; i++) {
        const f = framevents[i];
        const dur = f.durationframes;
        const playline = `   8, ${f.t}, ${f.f}, ${dur},\n`;
        //console.log(f, dur, playline);
        buf += playline;
        const pauseline = `   0, 0, 0, ${f.pauseframes},\n`;
        buf += pauseline;
    }
    return buf;
}

function generateBasic() {
    const basic =
        ASF.loops.length == 1
            ? doBasicTemplateSingle(generateBasicData(ASF.loops[0].track, ASF.loops[0].meta.padTo))
            : doBasicTemplateDouble(
                  generateBasicData(ASF.loops[0].track, ASF.loops[0].meta.padTo),
                  generateBasicData(ASF.loops[1].track, ASF.loops[1].meta.padTo)
              );
    document.getElementById('basicTextarea').value = basic;
}
function translateIntoFramesWithPauses(recording, padToBeat) {
    if (!recording || !recording.length) return [];
    const frameTrack = [];
    const startOfTrackInMillis = 0; //ASF.fpc * ASF.beatsPerMeasure;  //hack

    for (let i = 0; i < recording.length; i++) {
        const thing = recording[i];
        const framevent = {};
        framevent.startframe = millisToFrames(thing.starttime - startOfTrackInMillis);
        framevent.endframe = millisToFrames(thing.endtime - startOfTrackInMillis);
        framevent.durationframes = framevent.endframe - framevent.startframe;
        framevent.t = thing.t_f.t;
        framevent.f = thing.t_f.f;
        frameTrack.push(framevent);
    }
    for (let i = 0; i < frameTrack.length - 1; i++) {
        const framevent = frameTrack[i];
        const next = frameTrack[i + 1];
        framevent.pauseframes = next.startframe - framevent.endframe;
    }
    //WE SEEM TO BE GETTING SOME KIND ROUNDING ERROR IN PREVIOUS METHOD,
    //SO HERE WE ARE JUST SEEING WHAT WE GOT SO FAR...
    const firstFrame = frameTrack[0];
    const finalFrame = frameTrack[frameTrack.length - 1];
    finalFrame.pauseframes = 0;
    //
    //console.log(`time total is ${framevents.reduce(timesum, 0)}`);

    //finalFrame;
    //final frame, see if we are padding. Padding is a nunber of beats,
    // convert that to # of frames, and then add a padding to the end of whatever endframe was
    if (padToBeat != -1) {
        finalFrame.pauseframes = padToBeat * ASF.fpc - frameTrack.reduce(timesumForFrames, firstFrame.startframe);
    }

    console.log('FINALLY GOT TIME ', frameTrack.reduce(timesumForFrames, firstFrame.startframe));

    return frameTrack;
}
const timesumForFrames = (a, cv) => a + cv.durationframes + cv.pauseframes;

function millisToFrames(millis) {
    return parseInt((millis * 60) / 1000);
    //return Math.round((millis * 60) / 1000);
}
function copyBasicToClipboard() {
    let textarea = document.getElementById('basicTextarea');
    textarea.select();
    document.execCommand('copy');
}

function setPlaybackButtonOn() {
    document.getElementById('playback').innerHTML = '▶ playback';
}
function setPlaybackButtonOff() {
    document.getElementById('playback').innerHTML = '▣ end loops';
}

ready(loadStuff);
