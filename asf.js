/*

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

ASF.maps = defaultMaps;

ASF.clipCache = {};

function loadStuff() {
    document.addEventListener('keydown', go);
    document.addEventListener('keyup', stop);

    ASF.currentMapIndex = 4;
    populateDropdownFromAvailableMaps(ASF.currentMapIndex);
    mapSelected();
}

function toneFreqInt2Key(t, f) {
    return `${t}_${f}`;
}

function loadAllFilesForMap(map) {
    ASF.log(JSON.stringify(map.key2tfm));
    Object.keys(map.key2tfm).map((key) => {
        console.log(`LOADING key is ${key}`);
        const t_f = map.key2tfm[key];

        getFileForTF(t_f.t, t_f.f);
    });
}

// put a Pizzicato sound clip in the cache if not there already
function getFileForTF(tone, freq) {
    console.log('loading', { tone, freq });
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

function go(e) {
    const clip = keyToClipInCurrentMap(e.key);
    if (clip) clip.play();
    else console.log(`no play for ${e.key}`);
}
function stop(e) {
    const clip = keyToClipInCurrentMap(e.key);
    if (clip) clip.stop();
    else console.log(`no stop for ${e.key}`);
}

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function mapSelected() {
    const selectElem = window.mapSelect;
    ASF.currentMap = ASF.maps[selectElem.options[selectElem.selectedIndex].value];
    ASF.log(`selected tone ${JSON.stringify(ASF.currentMap)}`);
    loadAllFilesForMap(ASF.currentMap);
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
ready(loadStuff);
