/*

    keyMap maps a keboard key to 
        (t)one - voice/channel
        (f)req - frquency
        (m)usic (tbd: but to put it on a musical keyboard)
        (d)uration (tbd: duration-type, if null steady tone til release, rest tbd)

*/

const ASF = {};

ASF.log = (msg) => {
    window.log.innerHTML += msg + '\n';
};

ASF.mappings = [
    {
        desc: 'simple AUDC 1 - buzzy',
        keyboard: 'us',
        key2tfm: {
            q: { t: 1, f: 31 },
            w: { t: 1, f: 30 },
            e: { t: 1, f: 29 },
            r: { t: 1, f: 28 },
            t: { t: 1, f: 27 },
            y: { t: 1, f: 26 },
            u: { t: 1, f: 25 },
            i: { t: 1, f: 24 },
            o: { t: 1, f: 23 },
            p: { t: 1, f: 22 },
            '[': { t: 1, f: 21 },
            ']': { t: 1, f: 20 },
            a: { t: 1, f: 19 },
            s: { t: 1, f: 18 },
            d: { t: 1, f: 17 },
            f: { t: 1, f: 16 },
            g: { t: 1, f: 15 },
            h: { t: 1, f: 14 },
            j: { t: 1, f: 13 },
            k: { t: 1, f: 12 },
            l: { t: 1, f: 11 },
            ';': { t: 1, f: 10 },
            "'": { t: 1, f: 9 },
            z: { t: 1, f: 8 },
            x: { t: 1, f: 7 },
            c: { t: 1, f: 6 },
            v: { t: 1, f: 5 },
            b: { t: 1, f: 4 },
            n: { t: 1, f: 3 },
            m: { t: 1, f: 2 },
            ',': { t: 1, f: 1 },
            '.': { t: 1, f: 0 },
        },
    },
    {
        desc: 'simple AUDC 2 - buzzy/ramble',
        keyboard: 'us',
        key2tfm: {
            q: { t: 2, f: 31 },
            w: { t: 2, f: 30 },
            e: { t: 2, f: 29 },
            r: { t: 2, f: 28 },
            t: { t: 2, f: 27 },
            y: { t: 2, f: 26 },
            u: { t: 2, f: 25 },
            i: { t: 2, f: 24 },
            o: { t: 2, f: 23 },
            p: { t: 2, f: 22 },
            '[': { t: 2, f: 21 },
            ']': { t: 2, f: 20 },
            a: { t: 2, f: 19 },
            s: { t: 2, f: 18 },
            d: { t: 2, f: 17 },
            f: { t: 2, f: 16 },
            g: { t: 2, f: 15 },
            h: { t: 2, f: 14 },
            j: { t: 2, f: 13 },
            k: { t: 2, f: 12 },
            l: { t: 2, f: 11 },
            ';': { t: 2, f: 10 },
            "'": { t: 2, f: 9 },
            z: { t: 2, f: 8 },
            x: { t: 2, f: 7 },
            c: { t: 2, f: 6 },
            v: { t: 2, f: 5 },
            b: { t: 2, f: 4 },
            n: { t: 2, f: 3 },
            m: { t: 2, f: 2 },
            ',': { t: 2, f: 1 },
            '.': { t: 2, f: 0 },
        },
    },
    {
        desc: 'simple AUDC 3 - flangy/wavering',
        keyboard: 'us',
        key2tfm: {
            q: { t: 3, f: 31 },
            w: { t: 3, f: 30 },
            e: { t: 3, f: 29 },
            r: { t: 3, f: 28 },
            t: { t: 3, f: 27 },
            y: { t: 3, f: 26 },
            u: { t: 3, f: 25 },
            i: { t: 3, f: 24 },
            o: { t: 3, f: 23 },
            p: { t: 3, f: 22 },
            '[': { t: 3, f: 21 },
            ']': { t: 3, f: 20 },
            a: { t: 3, f: 19 },
            s: { t: 3, f: 18 },
            d: { t: 3, f: 17 },
            f: { t: 3, f: 16 },
            g: { t: 3, f: 15 },
            h: { t: 3, f: 14 },
            j: { t: 3, f: 13 },
            k: { t: 3, f: 12 },
            l: { t: 3, f: 11 },
            ';': { t: 3, f: 10 },
            "'": { t: 3, f: 9 },
            z: { t: 3, f: 8 },
            x: { t: 3, f: 7 },
            c: { t: 3, f: 6 },
            v: { t: 3, f: 5 },
            b: { t: 3, f: 4 },
            n: { t: 3, f: 3 },
            m: { t: 3, f: 2 },
            ',': { t: 3, f: 1 },
            '.': { t: 3, f: 0 },
        },
    },
    {
        desc: 'simple AUDC 4 - pure',
        keyboard: 'us',
        key2tfm: {
            q: { t: 4, f: 31 },
            w: { t: 4, f: 30 },
            e: { t: 4, f: 29 },
            r: { t: 4, f: 28 },
            t: { t: 4, f: 27 },
            y: { t: 4, f: 26 },
            u: { t: 4, f: 25 },
            i: { t: 4, f: 24 },
            o: { t: 4, f: 23 },
            p: { t: 4, f: 22 },
            '[': { t: 4, f: 21 },
            ']': { t: 4, f: 20 },
            a: { t: 4, f: 19 },
            s: { t: 4, f: 18 },
            d: { t: 4, f: 17 },
            f: { t: 4, f: 16 },
            g: { t: 4, f: 15 },
            h: { t: 4, f: 14 },
            j: { t: 4, f: 13 },
            k: { t: 4, f: 12 },
            l: { t: 4, f: 11 },
            ';': { t: 4, f: 10 },
            "'": { t: 4, f: 9 },
            z: { t: 4, f: 8 },
            x: { t: 4, f: 7 },
            c: { t: 4, f: 6 },
            v: { t: 4, f: 5 },
            b: { t: 4, f: 4 },
            n: { t: 4, f: 3 },
            m: { t: 4, f: 2 },
            ',': { t: 4, f: 1 },
            '.': { t: 4, f: 0 },
        },
    },
    {
        desc: 'simple AUDC 6 - pure/buzzy',
        keyboard: 'us',
        key2tfm: {
            q: { t: 6, f: 31 },
            w: { t: 6, f: 30 },
            e: { t: 6, f: 29 },
            r: { t: 6, f: 28 },
            t: { t: 6, f: 27 },
            y: { t: 6, f: 26 },
            u: { t: 6, f: 25 },
            i: { t: 6, f: 24 },
            o: { t: 6, f: 23 },
            p: { t: 6, f: 22 },
            '[': { t: 6, f: 21 },
            ']': { t: 6, f: 20 },
            a: { t: 6, f: 19 },
            s: { t: 6, f: 18 },
            d: { t: 6, f: 17 },
            f: { t: 6, f: 16 },
            g: { t: 6, f: 15 },
            h: { t: 6, f: 14 },
            j: { t: 6, f: 13 },
            k: { t: 6, f: 12 },
            l: { t: 6, f: 11 },
            ';': { t: 6, f: 10 },
            "'": { t: 6, f: 9 },
            z: { t: 6, f: 8 },
            x: { t: 6, f: 7 },
            c: { t: 6, f: 6 },
            v: { t: 6, f: 5 },
            b: { t: 6, f: 4 },
            n: { t: 6, f: 3 },
            m: { t: 6, f: 2 },
            ',': { t: 6, f: 1 },
            '.': { t: 6, f: 0 },
        },
    },
    {
        desc: 'simple AUDC 7 - reedy/rumble',
        keyboard: 'us',
        key2tfm: {
            q: { t: 7, f: 31 },
            w: { t: 7, f: 30 },
            e: { t: 7, f: 29 },
            r: { t: 7, f: 28 },
            t: { t: 7, f: 27 },
            y: { t: 7, f: 26 },
            u: { t: 7, f: 25 },
            i: { t: 7, f: 24 },
            o: { t: 7, f: 23 },
            p: { t: 7, f: 22 },
            '[': { t: 7, f: 21 },
            ']': { t: 7, f: 20 },
            a: { t: 7, f: 19 },
            s: { t: 7, f: 18 },
            d: { t: 7, f: 17 },
            f: { t: 7, f: 16 },
            g: { t: 7, f: 15 },
            h: { t: 7, f: 14 },
            j: { t: 7, f: 13 },
            k: { t: 7, f: 12 },
            l: { t: 7, f: 11 },
            ';': { t: 7, f: 10 },
            "'": { t: 7, f: 9 },
            z: { t: 7, f: 8 },
            x: { t: 7, f: 7 },
            c: { t: 7, f: 6 },
            v: { t: 7, f: 5 },
            b: { t: 7, f: 4 },
            n: { t: 7, f: 3 },
            m: { t: 7, f: 2 },
            ',': { t: 7, f: 1 },
            '.': { t: 7, f: 0 },
        },
    },
    {
        desc: 'simple AUDC 8 - white noise',
        keyboard: 'us',
        key2tfm: {
            q: { t: 8, f: 31 },
            w: { t: 8, f: 30 },
            e: { t: 8, f: 29 },
            r: { t: 8, f: 28 },
            t: { t: 8, f: 27 },
            y: { t: 8, f: 26 },
            u: { t: 8, f: 25 },
            i: { t: 8, f: 24 },
            o: { t: 8, f: 23 },
            p: { t: 8, f: 22 },
            '[': { t: 8, f: 21 },
            ']': { t: 8, f: 20 },
            a: { t: 8, f: 19 },
            s: { t: 8, f: 18 },
            d: { t: 8, f: 17 },
            f: { t: 8, f: 16 },
            g: { t: 8, f: 15 },
            h: { t: 8, f: 14 },
            j: { t: 8, f: 13 },
            k: { t: 8, f: 12 },
            l: { t: 8, f: 11 },
            ';': { t: 8, f: 10 },
            "'": { t: 8, f: 9 },
            z: { t: 8, f: 8 },
            x: { t: 8, f: 7 },
            c: { t: 8, f: 6 },
            v: { t: 8, f: 5 },
            b: { t: 8, f: 4 },
            n: { t: 8, f: 3 },
            m: { t: 8, f: 2 },
            ',': { t: 8, f: 1 },
            '.': { t: 8, f: 0 },
        },
    },
    {
        desc: 'simple AUDC 12 - pure lower',
        keyboard: 'us',
        key2tfm: {
            q: { t: 12, f: 31 },
            w: { t: 12, f: 30 },
            e: { t: 12, f: 29 },
            r: { t: 12, f: 28 },
            t: { t: 12, f: 27 },
            y: { t: 12, f: 26 },
            u: { t: 12, f: 25 },
            i: { t: 12, f: 24 },
            o: { t: 12, f: 23 },
            p: { t: 12, f: 22 },
            '[': { t: 12, f: 21 },
            ']': { t: 12, f: 20 },
            a: { t: 12, f: 19 },
            s: { t: 12, f: 18 },
            d: { t: 12, f: 17 },
            f: { t: 12, f: 16 },
            g: { t: 12, f: 15 },
            h: { t: 12, f: 14 },
            j: { t: 12, f: 13 },
            k: { t: 12, f: 12 },
            l: { t: 12, f: 11 },
            ';': { t: 12, f: 10 },
            "'": { t: 12, f: 9 },
            z: { t: 12, f: 8 },
            x: { t: 12, f: 7 },
            c: { t: 12, f: 6 },
            v: { t: 12, f: 5 },
            b: { t: 12, f: 4 },
            n: { t: 12, f: 3 },
            m: { t: 12, f: 2 },
            ',': { t: 12, f: 1 },
            '.': { t: 12, f: 0 },
        },
    },
    {
        desc: 'simple AUDC 14 - electronic/rumble',
        keyboard: 'us',
        key2tfm: {
            q: { t: 14, f: 31 },
            w: { t: 14, f: 30 },
            e: { t: 14, f: 29 },
            r: { t: 14, f: 28 },
            t: { t: 14, f: 27 },
            y: { t: 14, f: 26 },
            u: { t: 14, f: 25 },
            i: { t: 14, f: 24 },
            o: { t: 14, f: 23 },
            p: { t: 14, f: 22 },
            '[': { t: 14, f: 21 },
            ']': { t: 14, f: 20 },
            a: { t: 14, f: 19 },
            s: { t: 14, f: 18 },
            d: { t: 14, f: 17 },
            f: { t: 14, f: 16 },
            g: { t: 14, f: 15 },
            h: { t: 14, f: 14 },
            j: { t: 14, f: 13 },
            k: { t: 14, f: 12 },
            l: { t: 14, f: 11 },
            ';': { t: 14, f: 10 },
            "'": { t: 14, f: 9 },
            z: { t: 14, f: 8 },
            x: { t: 14, f: 7 },
            c: { t: 14, f: 6 },
            v: { t: 14, f: 5 },
            b: { t: 14, f: 4 },
            n: { t: 14, f: 3 },
            m: { t: 14, f: 2 },
            ',': { t: 14, f: 1 },
            '.': { t: 14, f: 0 },
        },
    },
    {
        desc: 'simple AUDC 15 - electronic/rumble',
        keyboard: 'us',
        key2tfm: {
            q: { t: 15, f: 31 },
            w: { t: 15, f: 30 },
            e: { t: 15, f: 29 },
            r: { t: 15, f: 28 },
            t: { t: 15, f: 27 },
            y: { t: 15, f: 26 },
            u: { t: 15, f: 25 },
            i: { t: 15, f: 24 },
            o: { t: 15, f: 23 },
            p: { t: 15, f: 22 },
            '[': { t: 15, f: 21 },
            ']': { t: 15, f: 20 },
            a: { t: 15, f: 19 },
            s: { t: 15, f: 18 },
            d: { t: 15, f: 17 },
            f: { t: 15, f: 16 },
            g: { t: 15, f: 15 },
            h: { t: 15, f: 14 },
            j: { t: 15, f: 13 },
            k: { t: 15, f: 12 },
            l: { t: 15, f: 11 },
            ';': { t: 15, f: 10 },
            "'": { t: 15, f: 9 },
            z: { t: 15, f: 8 },
            x: { t: 15, f: 7 },
            c: { t: 15, f: 6 },
            v: { t: 15, f: 5 },
            b: { t: 15, f: 4 },
            n: { t: 15, f: 3 },
            m: { t: 15, f: 2 },
            ',': { t: 15, f: 1 },
            '.': { t: 15, f: 0 },
        },
    },
];

const keyboard = `qwertyuiop[]asdfghjkl;'zxcvbnm,.`;
const clipArray = [];
const keyToOffsetOnKeyboard = {};

const availableTone = {
    1: 'buzzy',
    2: 'buzzy/ramble',
    3: 'flangy/wavering',
    4: 'pure',
    6: 'pure/buzzy',
    7: 'reedy/rumble',
    8: 'white noise',
    12: 'pure lower',
    14: 'electronic/rumble',
    15: 'electronic/rumble',
};

const TheForbiddenFile = './wav/sound_04_00.wav';

function loadStuff() {
    document.addEventListener('keydown', go);
    document.addEventListener('keyup', stop);

    for (let pos in keyboard) {
        const key = keyboard[pos];
        keyToOffsetOnKeyboard[key] = 31 - pos;
    }

    const keyToToneAndFreq = {};
    Object.keys(availableTone).map((tone) => {
        //ASF.log(JSON.stringify(keyToOffsetOnKeyboard));
        Object.keys(keyToOffsetOnKeyboard).map((key) => {
            const freq = keyToOffsetOnKeyboard[key];
            //ASF.log(`tone ${tone} key ${key} goes to ${freq}\n`);
            keyToToneAndFreq[key] = { t: parseInt(tone), f: parseInt(freq) };
        });
        const toneDesc = availableTone[tone];
        ASF.log(`{`);
        ASF.log(`   "desc":${JSON.stringify(`simple AUDC ${tone} - ${toneDesc}`)},`);
        ASF.log(`   "keyboard":"us",`);

        ASF.log(`   "key2tfm":${JSON.stringify(keyToToneAndFreq)}`);
        ASF.log(`},`);
    });

    for (let tone = 0; tone < 16; tone++) {}
    ASF.currentTone = 4;

    loadSounds(ASF.currentTone);

    populateDropdownFromAvailableTone(ASF.currentTone);
}

function loadSounds(tone) {
    if (clipArray[tone]) {
        console.log('already loaded');
        return;
    }

    const showtone = `${tone}`.length === 1 ? `0${tone}` : tone;
    clipArray[tone] = [];
    for (let freq = 0; freq < 32; freq++) {
        const showfreq = `${freq}`.length === 1 ? `0${freq}` : freq;

        const path = `./wav/sound_${showtone}_${showfreq}.wav`;
        if (path != TheForbiddenFile) {
            clipArray[tone][freq] = new Pizzicato.Sound(
                {
                    source: 'file',
                    options: { loop: true, path },
                }
                // function () {
                //     console.log(`loaded  ${path}`);
                // }
            );
        }
    }
    console.log(clipArray);
}

function mylog(msg) {
    window.preLog.innerHTML += `${msg}\n`;
}
function go(e) {
    const offset = keyToOffsetOnKeyboard[e.key];
    console.log({ offset, ct: ASF.currentTone }, clipArray[ASF.currentTone]);
    if (offset !== undefined) {
        clipArray[ASF.currentTone][offset].play();
    }
}
function stop(e) {
    const offset = keyToOffsetOnKeyboard[e.key];
    if (offset !== undefined) {
        clipArray[ASF.currentTone][offset].stop();
    }
}

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function changeTone() {
    const selectElem = window.toneSelect;
    ASF.currentTone = selectElem.options[selectElem.selectedIndex].value;
    console.log(`selected tone ${ASF.currentTone}`);
    loadSounds(ASF.currentTone);
}

function populateDropdownFromAvailableTone(select) {
    const elem = window.toneSelect;
    let buf = '';
    Object.keys(availableTone).map((key) => {
        const desc = availableTone[key];
        const selected = select == key ? 'selected' : '';
        buf += `<option ${selected} value='${key}'>${key} - ${desc}</option>\n`;
    });
    elem.innerHTML = buf;
}

ready(loadStuff);
