let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
* The prayoga of some tinanta.
*/
export const Prayoga = Object.freeze({
/**
* Usage coreferent with the agent, e.g. "The horse *goes* to the village."
*/
Kartari:0,"0":"Kartari",
/**
* Usage coreferent with the object, e.g. "The village *is gone to* by the horse."
*/
Karmani:1,"1":"Karmani",
/**
* Usage without a referent, e.g. "*There is motion* by the horse to the village."
* bhAve prayoga generally produces the same forms as karmani prayoga.
*/
Bhave:2,"2":"Bhave", });
/**
* The person of some tinanta.
*/
export const Purusha = Object.freeze({
/**
* The third person.
*/
Prathama:0,"0":"Prathama",
/**
* The second person.
*/
Madhyama:1,"1":"Madhyama",
/**
* The first person.
*/
Uttama:2,"2":"Uttama", });
/**
* The number of some tinanta or subanta.
*/
export const Vacana = Object.freeze({
/**
* The singular.
*/
Eka:0,"0":"Eka",
/**
* The dual.
*/
Dvi:1,"1":"Dvi",
/**
* The plural.
*/
Bahu:2,"2":"Bahu", });
/**
* The tense/mood of some tinanta.
*/
export const Lakara = Object.freeze({
/**
* Describes action in the present tense. Ssometimes called the *present indicative*.
*/
Lat:0,"0":"Lat",
/**
* Describes unwitnessed past action. Sometimes called the *perfect*.
*/
Lit:1,"1":"Lit",
/**
* Describes future action after the current day. Sometimes called the *periphrastic future*.
*/
Lut:2,"2":"Lut",
/**
* Describes general future action. Sometimes called the *simple future*.
*/
Lrt:3,"3":"Lrt",
/**
* The Vedic subjunctive. `vidyut-prakriya` currently has poor support for this lakara.
*/
Let:4,"4":"Let",
/**
* Describes commands. Sometimes called the *imperative*.
*/
Lot:5,"5":"Lot",
/**
* Describes past action before the current day. Sometimes called the *imperfect*.
*/
Lan:6,"6":"Lan",
/**
* Describes potential or hypothetical actions. Sometimes called the *optative*.
*/
VidhiLin:7,"7":"VidhiLin",
/**
* Describes wishes and prayers. Sometimes called the *benedictive*.
*/
AshirLin:8,"8":"AshirLin",
/**
* Describes general past action. Sometimes called the *aorist*.
*/
Lun:9,"9":"Lun",
/**
* Describes past counterfactuals ("would not have ..."). Sometimes called the *conditional*.
*/
Lrn:10,"10":"Lrn", });
/**
* The pada of some tinanta.
*/
export const Pada = Object.freeze({
/**
* Parasmaipada.
*/
Parasmai:0,"0":"Parasmai",
/**
* Atmanepada.
*/
Atmane:1,"1":"Atmane", });
/**
* The complete list of krt-pratyayas.
*
* Rust's naming convention is to start enum values with capital letters. However, we allow mixed
* case explicitly here so that we can name pratyayas more concisely with SLP1. Doing so helps us
* distinguish between pratyayas like `naN` and `nan`.
*/
export const Krt = Object.freeze({
/**
* -a
*/
a:0,"0":"a",
/**
* -a
*/
ac:1,"1":"ac",
/**
* -a
*/
aR:2,"2":"aR",
/**
* -at (jarat)
*/
atfn:3,"3":"atfn",
/**
* -aTu (vepaTu). Allowed only for dhatus that are `qvit`.
*/
aTuc:4,"4":"aTuc",
/**
* -ani
*/
ani:5,"5":"ani",
/**
* -anIya (gamanIya, BavanIya, ...)
*/
anIyar:6,"6":"anIyar",
/**
* -a
*/
ap:7,"7":"ap",
/**
* -Alu
*/
Aluc:8,"8":"Aluc",
/**
* -Aru
*/
Aru:9,"9":"Aru",
/**
* -itra
*/
itra:10,"10":"itra",
/**
* -in. The trailing `_` is to avoid colliding with Rust's `in` keyword.
*/
in_:11,"11":"in_",
/**
* -in
*/
ini:12,"12":"ini",
/**
* -izRu (alaMkarizRu, prajanizRu, ...)
*/
izRuc:13,"13":"izRuc",
/**
* -u (yuyutsu, Bikzu, ...)
*/
u:14,"14":"u",
/**
* -uka
*/
ukaY:15,"15":"ukaY",
/**
* -Uka
*/
Uka:16,"16":"Uka",
/**
* -a
*/
ka:17,"17":"ka",
/**
* -a
*/
kaY:18,"18":"kaY",
/**
* -am
*/
kamul:19,"19":"kamul",
/**
* -as (visfpaH, ...)
*/
kasun:20,"20":"kasun",
/**
* -a
*/
kap:21,"21":"kap",
/**
* -Ana (cakrARa, ...)
*/
kAnac:22,"22":"kAnac",
/**
* -i (udaDi, ...)
*/
ki:23,"23":"ki",
/**
* -i
*/
kin:24,"24":"kin",
/**
* -ura (BaNgura, ...)
*/
kurac:25,"25":"kurac",
/**
* -elima (pacelima, ...)
*/
kelimar:26,"26":"kelimar",
/**
* -ta (gata, bhUta, ...)
*/
kta:27,"27":"kta",
/**
* -tavat (gatavat, bhUtavat, ...)
*/
ktavatu:28,"28":"ktavatu",
/**
* -ti
*/
ktic:29,"29":"ktic",
/**
* -ti
*/
ktin:30,"30":"ktin",
/**
* -tri
*/
ktri:31,"31":"ktri",
/**
* -tvA (gatvA, bhUtva, ...)
*/
ktvA:32,"32":"ktvA",
/**
* -nu
*/
knu:33,"33":"knu",
/**
* -mara
*/
kmarac:34,"34":"kmarac",
/**
* -ya
*/
kyap:35,"35":"kyap",
/**
* -ru (BIru)
*/
kru:36,"36":"kru",
/**
* -ruka (BIruka)
*/
kruka:37,"37":"kruka",
/**
* -luka (BIluka)
*/
klukan:38,"38":"klukan",
/**
* -van
*/
kvanip:39,"39":"kvanip",
/**
* -vara
*/
kvarap:40,"40":"kvarap",
/**
* -vas
*/
kvasu:41,"41":"kvasu",
/**
* -snu (glAsnu, jizRu, ...)
*/
ksnu:42,"42":"ksnu",
/**
* (empty suffix)
*/
kvin:43,"43":"kvin",
/**
* (empty suffix)
*/
kvip:44,"44":"kvip",
/**
* -a (priyaMvada, vaSaMvada)
*/
Kac:45,"45":"Kac",
/**
* -a
*/
KaS:46,"46":"KaS",
/**
* -a (Izatkara, duzkara, sukara, ...)
*/
Kal:47,"47":"Kal",
/**
* -izRu
*/
KizRuc:48,"48":"KizRuc",
/**
* -uka
*/
KukaY:49,"49":"KukaY",
/**
* -ana
*/
Kyun:50,"50":"Kyun",
/**
* -a
*/
Ga:51,"51":"Ga",
/**
* -a
*/
GaY:52,"52":"GaY",
/**
* -in
*/
GinuR:53,"53":"GinuR",
/**
* -ura
*/
Gurac:54,"54":"Gurac",
/**
* -van
*/
Nvanip:55,"55":"Nvanip",
/**
* -Ana
*/
cAnaS:56,"56":"cAnaS",
/**
* -anta,
*/
Jac:57,"57":"Jac",
/**
* -a
*/
wa:58,"58":"wa",
/**
* -a
*/
wak:59,"59":"wak",
/**
* -a
*/
qa:60,"60":"qa",
/**
* -u
*/
qu:61,"61":"qu",
/**
* -a
*/
Ra:62,"62":"Ra",
/**
* -am
*/
Ramul:63,"63":"Ramul",
/**
* -in
*/
Rini:64,"64":"Rini",
/**
* -ya
*/
Ryat:65,"65":"Ryat",
/**
* -ana
*/
Ryuw:66,"66":"Ryuw",
/**
* (empty)
*/
Rvi:67,"67":"Rvi",
/**
* -aka
*/
Rvuc:68,"68":"Rvuc",
/**
* -aka
*/
Rvul:69,"69":"Rvul",
/**
* -tavya (gantavya, bhavitavya, ...)
*/
tavya:70,"70":"tavya",
/**
* -tavya
*/
tavyat:71,"71":"tavyat",
/**
* -tum (gantum, bhavitum, ...)
*/
tumun:72,"72":"tumun",
/**
* -tf (gantA, bhavitA, ...)
*/
tfc:73,"73":"tfc",
/**
* -tf
*/
tfn:74,"74":"tfn",
/**
* -Taka (gATaka)
*/
Takan:75,"75":"Takan",
/**
* -na
*/
naN:76,"76":"naN",
/**
* -naj
*/
najiN:77,"77":"najiN",
/**
* -na (svapna)
*/
nan:78,"78":"nan",
/**
* -man
*/
manin:79,"79":"manin",
/**
* -a
*/
Sa:80,"80":"Sa",
/**
* -at (gacCat, Bavat, ...)
*/
Satf:81,"81":"Satf",
/**
* -Ana (laBamAna, sevamAna, ...)
*/
SAnac:82,"82":"SAnac",
/**
* -Ana
*/
SAnan:83,"83":"SAnan",
/**
* -ya
*/
yat:84,"84":"yat",
/**
* -ana
*/
yuc:85,"85":"yuc",
/**
* -na (namra, kampra, ...)
*/
ra:86,"86":"ra",
/**
* -ru
*/
ru:87,"87":"ru",
/**
* -ana
*/
lyu:88,"88":"lyu",
/**
* -ana
*/
lyuw:89,"89":"lyuw",
/**
* -van
*/
vanip:90,"90":"vanip",
/**
* -vara
*/
varac:91,"91":"varac",
/**
* (empty suffix)
*/
vic:92,"92":"vic",
/**
* (none)
*/
viw:93,"93":"viw",
/**
* -aka
*/
vuY:94,"94":"vuY",
/**
* -aka
*/
vun:95,"95":"vun",
/**
* -Aka
*/
zAkan:96,"96":"zAkan",
/**
* -tra
*/
zwran:97,"97":"zwran",
/**
* -aka
*/
zvun:98,"98":"zvun",
/**
* -ama (praTama)
*/
amac:99,"99":"amac",
/**
* -ala (maNgala)
*/
alac:100,"100":"alac",
/**
* -as (cetaH)
*/
asun:101,"101":"asun",
/**
* -Ayya
*/
Ayya:102,"102":"Ayya",
/**
* -itnu
*/
itnuc:103,"103":"itnuc",
/**
* -iTi
*/
iTin:104,"104":"iTin",
/**
* -iza
*/
wizac:105,"105":"wizac",
/**
* -izWu
*/
izWuc:106,"106":"izWuc",
/**
* -izWa
*/
izWac:107,"107":"izWac",
/**
* -isa
*/
isan:108,"108":"isan",
/**
* -is
*/
isi:109,"109":"isi",
/**
* -u (kAru)
*/
uR:110,"110":"uR",
/**
* -us (Danus)
*/
usi:111,"111":"usi",
/**
* -atu (kratu)
*/
katu:112,"112":"katu",
/**
* -ka
*/
kan:113,"113":"kan",
/**
* -Ta
*/
kTan:114,"114":"kTan",
/**
* -vi (jAgfvi)
*/
kvinUnadi:115,"115":"kvinUnadi",
/**
* -sara
*/
ksaran:116,"116":"ksaran",
/**
* -si
*/
ksi:117,"117":"ksi",
/**
* -su
*/
ksu:118,"118":"ksu",
/**
* -u (tAlu)
*/
YuR:119,"119":"YuR",
/**
* -ta
*/
tan:120,"120":"tan",
/**
* -tu
*/
tun:121,"121":"tun",
/**
* -tra,
*/
tran:122,"122":"tran",
/**
* -sa
*/
sa:123,"123":"sa",
/**
* -sara
*/
sara:124,"124":"sara",
/**
* -su
*/
suk:125,"125":"suk",
/**
* -atni,
*/
katnic:126,"126":"katnic",
/**
* -yatu,
*/
yatuc:127,"127":"yatuc",
/**
* -ali
*/
alic:128,"128":"alic",
/**
* -sya
*/
syan:129,"129":"syan",
/**
* -uli
*/
uli:130,"130":"uli",
/**
* -as (use trailing `_` since `as` is a reserved keyword in Rust.)
*/
asa:131,"131":"asa",
/**
* -As,
*/
Asa:132,"132":"Asa",
/**
* -Anu
*/
Anuk:133,"133":"Anuk", });
/**
* Defines a gaṇa.
*
* The dhatus in the Dhatupatha are organized in ten large *gaṇa*s or classes. These gaṇas
* add various properties to the dhatu, most notably the specific *vikaraṇa* (stem suffix) we use
* before sarvadhatuka suffixes.
*/
export const Gana = Object.freeze({
/**
* The first gaṇa, whose first dhatu is `BU`.
*/
Bhvadi:0,"0":"Bhvadi",
/**
* The second gaṇa, whose first dhatu is `ad`.
*/
Adadi:1,"1":"Adadi",
/**
* The third gaṇa, whose first dhatu is `hu`.
*/
Juhotyadi:2,"2":"Juhotyadi",
/**
* The fourth gaṇa, whose first dhatu is `div`.
*/
Divadi:3,"3":"Divadi",
/**
* The fifth gaṇa, whose first dhatu is `su`.
*/
Svadi:4,"4":"Svadi",
/**
* The sixth gaṇa, whose first dhatu is `tud`.
*/
Tudadi:5,"5":"Tudadi",
/**
* The seventh gaṇa, whose first dhatu is `rudh`.
*/
Rudhadi:6,"6":"Rudhadi",
/**
* The eighth gaṇa, whose first dhatu is `tan`.
*/
Tanadi:7,"7":"Tanadi",
/**
* The ninth gaṇa, whose first dhatu is `krI`.
*/
Kryadi:8,"8":"Kryadi",
/**
* The tenth gaṇa, whose first dhatu is `cur`.
*/
Curadi:9,"9":"Curadi", });
/**
* One of the three common *sanAdi* pratyayas.
*
* The *sanAdi* pratyayas create new dhatus per 3.1.32. They are introduced in rules 3.1.7 -
* 3.1.30, and since rule 3.1.7 contains the word "dhAtoH", they can be called Ardhadhatuka by
* 3.4.114.
*
* Of the sanAdi pratyayas, most are added after either subantas or a handful of dhatus. But
* three of these pratyayas are added after dhatus more generally: `san`, `yaN`, and `Ric`.
*
* For details on what these pratyayas mean and what kinds of words they produce, see the comments
* below.
*/
export const Sanadi = Object.freeze({
/**
* `san`, which creates desiderative roots per 3.1.7.
*
* Examples: buBUzati, ninIzati.
*/
San:0,"0":"San",
/**
* `yaN`, which creates intensive roots per 3.1.22. For certain dhatus, the semantics are
* instead "crooked movement" (by 3.1.23) or "contemptible" action (by 3.1.24).
*
* Examples: boBUyate, nenIyate.
*
* Constraints: can be used only if the dhatu starts with a consonant and has exactly one
* vowel. If this constraint is violated, our APIs will return an `Error`.
*/
Yan:1,"1":"Yan",
/**
* `yaN`, with elision per 2.4.74. This is often listed separately due to its rarity and its
* very different form.
*
* Examples: boBavIti, boBoti, nenayIti, neneti.
*/
YanLuk:2,"2":"YanLuk",
/**
* `Nic`, which creates causal roots per 3.1.26.
*
* Examples: BAvayati, nAyayati.
*/
Nic:3,"3":"Nic", });
/**
* The gender of some subanta.
*/
export const Linga = Object.freeze({
/**
* The masculine.
*/
Pum:0,"0":"Pum",
/**
* The feminine.
*/
Stri:1,"1":"Stri",
/**
* The neuter.
*/
Napumsaka:2,"2":"Napumsaka", });
/**
* The case ending of some subanta.
*/
export const Vibhakti = Object.freeze({
/**
* The first vibhakti . Sometimes called the *nominative case*.
*/
Prathama:0,"0":"Prathama",
/**
* The second vibhakti. Sometimes called the *accusative case*.
*/
Dvitiya:1,"1":"Dvitiya",
/**
* The third vibhakti. Sometimes called the *instrumental case*.
*/
Trtiya:2,"2":"Trtiya",
/**
* The fourth vibhakti. Sometimes called the *dative case*.
*/
Caturthi:3,"3":"Caturthi",
/**
* The fifth vibhakti. Sometimes called the *ablative case*.
*/
Panchami:4,"4":"Panchami",
/**
* The sixth vibhakti. Sometimes called the *genitive case*.
*/
Sasthi:5,"5":"Sasthi",
/**
* The seventh vibhakti. Sometimes called the *locative case*.
*/
Saptami:6,"6":"Saptami",
/**
* The first vibhakti used in the sense of *sambodhana*. Sometimes called the *vocative case*.
*
* *Sambodhana* is technically not a *vibhakti but rather an additional semantic condition
* on the first vibhakti. But we felt that users would find it more convenient to have this
* condition available on `Vibhakti` directly rather than have to define the *sambodhana*
* condition separately.
*/
Sambodhana:7,"7":"Sambodhana", });
/**
* The complete list of taddhita-pratyayas.
*
* Rust's naming convention is to start enum values with capital letters. However, we allow mixed
* case explicitly here so that we can name pratyayas more concisely with SLP1. Doing so helps us
* distinguish between pratyayas like `naN` and `nan`.
*/
export const Taddhita = Object.freeze({
/**
* a
*/
a:0,"0":"a",
/**
* -aka
*/
akac:1,"1":"akac",
/**
* -a
*/
ac:2,"2":"ac",
/**
* -a
*/
aR:3,"3":"aR",
/**
* -a
*/
aY:4,"4":"aY",
/**
* -a
*/
at:5,"5":"at",
/**
* -atas
*/
atasuc:6,"6":"atasuc",
/**
* -astAt
*/
astAti:7,"7":"astAti",
/**
* -Ara
*/
Arak:8,"8":"Arak",
/**
* -i
*/
iY:9,"9":"iY",
/**
* -in
*/
ini:10,"10":"ini",
/**
* -iman
*/
imanic:11,"11":"imanic",
/**
* -ila
*/
ila:12,"12":"ila",
/**
* -ila
*/
ilac:13,"13":"ilac",
/**
* -izWa
*/
izWan:14,"14":"izWan",
/**
* -Ika,
*/
Ikak:15,"15":"Ikak",
/**
* -Iyas
*/
Iyasun:16,"16":"Iyasun",
/**
* -eRya
*/
eRya:17,"17":"eRya",
/**
* -Era
*/
Erak:18,"18":"Erak",
/**
* -ka
*/
kak:19,"19":"kak",
/**
* -ka
*/
kan:20,"20":"kan",
/**
* -kalpa
*/
kalpap:21,"21":"kalpap",
/**
* -kftvas
*/
kftvasuc:22,"22":"kftvasuc",
/**
* -ka
*/
ka:23,"23":"ka",
/**
* -Ina
*/
Ka:24,"24":"Ka",
/**
* -Ina
*/
KaY:25,"25":"KaY",
/**
* -iya
*/
Ga:26,"26":"Ga",
/**
* -iya
*/
Gac:27,"27":"Gac",
/**
* -iya
*/
Gan:28,"28":"Gan",
/**
* -iya
*/
Gas:29,"29":"Gas",
/**
* -Ayana
*/
cPaY:30,"30":"cPaY",
/**
* --
*/
cvi:31,"31":"cvi",
/**
* -Iya
*/
Ca:32,"32":"Ca",
/**
* -Iya,
*/
CaR:33,"33":"CaR",
/**
* -Iya,
*/
Cas:34,"34":"Cas",
/**
* -a,
*/
Ya:35,"35":"Ya",
/**
* -ika
*/
YiW:36,"36":"YiW",
/**
* -ya,
*/
YyaN:37,"37":"YyaN",
/**
* -ya
*/
Yya:38,"38":"Yya",
/**
* -a
*/
waq:39,"39":"waq",
/**
* -iWa
*/
wiWan:40,"40":"wiWan",
/**
* -ya
*/
wyaR:41,"41":"wyaR",
/**
* -ana
*/
wyu:42,"42":"wyu",
/**
* -ana
*/
wyul:43,"43":"wyul",
/**
* -la
*/
wlaY:44,"44":"wlaY",
/**
* -ika
*/
Wak:45,"45":"Wak",
/**
* -ika
*/
Wac:46,"46":"Wac",
/**
* -ika
*/
WaY:47,"47":"WaY",
/**
* -ika
*/
Wan:48,"48":"Wan",
/**
* -ika
*/
Wap:49,"49":"Wap",
/**
* -pa
*/
qupac:50,"50":"qupac",
/**
* -mat
*/
qmatup:51,"51":"qmatup",
/**
* -vala
*/
qvalac:52,"52":"qvalac",
/**
* -aka
*/
qvun:53,"53":"qvun",
/**
* -eya
*/
Qak:54,"54":"Qak",
/**
* -eyaka
*/
QakaY:55,"55":"QakaY",
/**
* -eya
*/
Qa:56,"56":"Qa",
/**
* -eya
*/
QaY:57,"57":"QaY",
/**
* -eyin
*/
Qinuk:58,"58":"Qinuk",
/**
* -era
*/
Qrak:59,"59":"Qrak",
/**
* -a
*/
Ra:60,"60":"Ra",
/**
* -in
*/
Rini:61,"61":"Rini",
/**
* -ya
*/
Rya:62,"62":"Rya",
/**
* -tama
*/
tamap:63,"63":"tamap",
/**
* -tara
*/
tarap:64,"64":"tarap",
/**
* -ta (becomes -tA)
*/
tal:65,"65":"tal",
/**
* -tas
*/
tasi:66,"66":"tasi",
/**
* -tas
*/
tasil:67,"67":"tasil",
/**
* -ti
*/
ti:68,"68":"ti",
/**
* -tika
*/
tikan:69,"69":"tikan",
/**
* -tya
*/
tyak:70,"70":"tyak",
/**
* -tya
*/
tyap:71,"71":"tyap",
/**
* -tra
*/
tral:72,"72":"tral",
/**
* -trA
*/
trA:73,"73":"trA",
/**
* -tva
*/
tva:74,"74":"tva",
/**
* -Tam
*/
Tamu:75,"75":"Tamu",
/**
* -Tya
*/
Tyan:76,"76":"Tyan",
/**
* -TA
*/
TAl:77,"77":"TAl",
/**
* -dA
*/
dA:78,"78":"dA",
/**
* -dAnIm
*/
dAnIm:79,"79":"dAnIm",
/**
* -deSya
*/
deSya:80,"80":"deSya",
/**
* -deSIya
*/
deSIyar:81,"81":"deSIyar",
/**
* -dhA
*/
DA:82,"82":"DA",
/**
* -na
*/
na:83,"83":"na",
/**
* -na
*/
naY:84,"84":"naY",
/**
* -Ayana
*/
Pak:85,"85":"Pak",
/**
* -Ayana
*/
PaY:86,"86":"PaY",
/**
* -Ayani
*/
PiY:87,"87":"PiY",
/**
* -Bakta
*/
Baktal:88,"88":"Baktal",
/**
* -ma
*/
ma:89,"89":"ma",
/**
* -mat
*/
matup:90,"90":"matup",
/**
* -ma
*/
map:91,"91":"map",
/**
* -maya
*/
mayaw:92,"92":"mayaw",
/**
* -ya
*/
ya:93,"93":"ya",
/**
* -ya
*/
yak:94,"94":"yak",
/**
* -ya
*/
yaY:95,"95":"yaY",
/**
* -ya
*/
yat:96,"96":"yat",
/**
* -ya
*/
yan:97,"97":"yan",
/**
* -yu
*/
yus:98,"98":"yus",
/**
* -ra
*/
ra:99,"99":"ra",
/**
* -rUpa
*/
rUpap:100,"100":"rUpap",
/**
* -rhi
*/
rhil:101,"101":"rhil",
/**
* -la
*/
lac:102,"102":"lac",
/**
* -vaya
*/
vaya:103,"103":"vaya",
/**
* -vin
*/
vini:104,"104":"vini",
/**
* -viDu
*/
viDal:105,"105":"viDal",
/**
* -aka
*/
vuk:106,"106":"vuk",
/**
* -aka
*/
vuY:107,"107":"vuY",
/**
* -aka
*/
vun:108,"108":"vun",
/**
* -vya
*/
vyat:109,"109":"vyat",
/**
* -vya
*/
vyan:110,"110":"vyan",
/**
* -Sa
*/
Sa:111,"111":"Sa",
/**
* -Sas
*/
Sas:112,"112":"Sas",
/**
* -tra
*/
zwarac:113,"113":"zwarac",
/**
* -ika
*/
zWac:114,"114":"zWac",
/**
* -ika
*/
zWan:115,"115":"zWan",
/**
* -ika
*/
zWal:116,"116":"zWal",
/**
* Ayana
*/
zPak:117,"117":"zPak",
/**
* -sAt
*/
sAti:118,"118":"sAti",
/**
* -s
*/
suc:119,"119":"suc",
/**
* -sna
*/
snaY:120,"120":"snaY",
/**
* -ha
*/
ha:121,"121":"ha", });
/**
* WebAssembly API for vidyut-prakriya.
*
* Within reason, we have tried to mimic a native JavaScript API. At some point, we wish to
* support optional arguments, perhaps by using `Reflect`.
*/
export class Vidyut {

    static __wrap(ptr) {
        const obj = Object.create(Vidyut.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vidyut_free(ptr);
    }
    /**
    * Creates a new API manager.
    *
    * This constructor is not called `new` because `new` is a reserved word in JavaScript.
    * @param {string} dhatupatha
    * @returns {Vidyut}
    */
    static init(dhatupatha) {
        const ptr0 = passStringToWasm0(dhatupatha, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.vidyut_init(ptr0, len0);
        return Vidyut.__wrap(ret);
    }
    /**
    * Wrapper for `Ashtadhyayi::derive_tinantas`.
    *
    * TODO: how might we reduce the number of arguments here?
    * @param {string} code
    * @param {number} lakara
    * @param {number} prayoga
    * @param {number} purusha
    * @param {number} vacana
    * @param {number | undefined} pada
    * @param {number | undefined} sanadi
    * @param {string | undefined} upasarga
    * @returns {any}
    */
    deriveTinantas(code, lakara, prayoga, purusha, vacana, pada, sanadi, upasarga) {
        const ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(upasarga) ? 0 : passStringToWasm0(upasarga, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.vidyut_deriveTinantas(this.ptr, ptr0, len0, lakara, prayoga, purusha, vacana, isLikeNone(pada) ? 2 : pada, isLikeNone(sanadi) ? 4 : sanadi, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * Wrapper for `Ashtadhyayi::derive_subantas`.
    * @param {string} pratipadika
    * @param {number} linga
    * @param {number} vacana
    * @param {number} vibhakti
    * @returns {any}
    */
    deriveSubantas(pratipadika, linga, vacana, vibhakti) {
        const ptr0 = passStringToWasm0(pratipadika, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.vidyut_deriveSubantas(this.ptr, ptr0, len0, linga, vacana, vibhakti);
        return takeObject(ret);
    }
    /**
    * Wrapper for `Ashtadhyayi::derive_krdantas`.
    * @param {string} code
    * @param {number} krt
    * @param {number | undefined} sanadi
    * @param {string | undefined} upasarga
    * @returns {any}
    */
    deriveKrdantas(code, krt, sanadi, upasarga) {
        const ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(upasarga) ? 0 : passStringToWasm0(upasarga, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.vidyut_deriveKrdantas(this.ptr, ptr0, len0, krt, isLikeNone(sanadi) ? 4 : sanadi, ptr1, len1);
        return takeObject(ret);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_error_51d875a0547f9e36 = function(arg0, arg1) {
        console.error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_20cbc34131e76824 = function(arg0, arg1, arg2) {
        getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    };
    imports.wbg.__wbg_new_b525de17f44a8943 = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_f9876326328f45ed = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_17224bc548dd1d7b = function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    const imports = getImports();

    initMemory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('vidyut_prakriya_bg.wasm', import.meta.url);
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
