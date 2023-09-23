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
* -ani
*/
ani:4,"4":"ani",
/**
* -anIya (gamanIya, BavanIya, ...)
*/
anIyar:5,"5":"anIyar",
/**
* -a
*/
ap:6,"6":"ap",
/**
* -Alu
*/
Aluc:7,"7":"Aluc",
/**
* -Aru
*/
Aru:8,"8":"Aru",
/**
* -itra
*/
itra:9,"9":"itra",
/**
* -in. The trailing `_` is to avoid colliding with Rust's `in` keyword.
*/
in_:10,"10":"in_",
/**
* -in
*/
ini:11,"11":"ini",
/**
* -izRu (alaMkarizRu, prajanizRu, ...)
*/
izRuc:12,"12":"izRuc",
/**
* -u (yuyutsu, Bikzu, ...)
*/
u:13,"13":"u",
/**
* -uka
*/
ukaY:14,"14":"ukaY",
/**
* -Uka
*/
Uka:15,"15":"Uka",
/**
* -a
*/
ka:16,"16":"ka",
/**
* -a
*/
kaY:17,"17":"kaY",
/**
* -am
*/
kamul:18,"18":"kamul",
/**
* -as (visfpaH, ...)
*/
kasun:19,"19":"kasun",
/**
* -a
*/
kap:20,"20":"kap",
/**
* -Ana (cakrARa, ...)
*/
kAnac:21,"21":"kAnac",
/**
* -i (udaDi, ...)
*/
ki:22,"22":"ki",
/**
* -i
*/
kin:23,"23":"kin",
/**
* -ura (BaNgura, ...)
*/
kurac:24,"24":"kurac",
/**
* -elima (pacelima, ...)
*/
kelimar:25,"25":"kelimar",
/**
* -ta (gata, bhUta, ...)
*/
kta:26,"26":"kta",
/**
* -tavat (gatavat, bhUtavat, ...)
*/
ktavatu:27,"27":"ktavatu",
/**
* -ti
*/
ktic:28,"28":"ktic",
/**
* -ti
*/
ktin:29,"29":"ktin",
/**
* -tri
*/
ktri:30,"30":"ktri",
/**
* -tvA (gatvA, bhUtva, ...)
*/
ktvA:31,"31":"ktvA",
/**
* -nu
*/
knu:32,"32":"knu",
/**
* -mara
*/
kmarac:33,"33":"kmarac",
/**
* -ya
*/
kyap:34,"34":"kyap",
/**
* -ru (BIru)
*/
kru:35,"35":"kru",
/**
* -ruka (BIruka)
*/
kruka:36,"36":"kruka",
/**
* -luka (BIluka)
*/
klukan:37,"37":"klukan",
/**
* -van
*/
kvanip:38,"38":"kvanip",
/**
* -vara
*/
kvarap:39,"39":"kvarap",
/**
* -vas
*/
kvasu:40,"40":"kvasu",
/**
* -snu (glAsnu, jizRu, ...)
*/
ksnu:41,"41":"ksnu",
/**
* (empty suffix)
*/
kvin:42,"42":"kvin",
/**
* (empty suffix)
*/
kvip:43,"43":"kvip",
/**
* -a (priyaMvada, vaSaMvada)
*/
Kac:44,"44":"Kac",
/**
* -a
*/
KaS:45,"45":"KaS",
/**
* -a (Izatkara, duzkara, sukara, ...)
*/
Kal:46,"46":"Kal",
/**
* -izRu
*/
KizRuc:47,"47":"KizRuc",
/**
* -uka
*/
KukaY:48,"48":"KukaY",
/**
* -ana
*/
Kyun:49,"49":"Kyun",
/**
* -a
*/
Ga:50,"50":"Ga",
/**
* -a
*/
GaY:51,"51":"GaY",
/**
* -in
*/
GinuR:52,"52":"GinuR",
/**
* -ura
*/
Gurac:53,"53":"Gurac",
/**
* -van
*/
Nvanip:54,"54":"Nvanip",
/**
* -Ana
*/
cAnaS:55,"55":"cAnaS",
/**
* -anta,
*/
Jac:56,"56":"Jac",
/**
* -a
*/
wa:57,"57":"wa",
/**
* -a
*/
wak:58,"58":"wak",
/**
* -a
*/
qa:59,"59":"qa",
/**
* -u
*/
qu:60,"60":"qu",
/**
* -a
*/
Ra:61,"61":"Ra",
/**
* -am
*/
Ramul:62,"62":"Ramul",
/**
* -in
*/
Rini:63,"63":"Rini",
/**
* -ya
*/
Ryat:64,"64":"Ryat",
/**
* -ana
*/
Ryuw:65,"65":"Ryuw",
/**
* (empty)
*/
Rvi:66,"66":"Rvi",
/**
* -aka
*/
Rvuc:67,"67":"Rvuc",
/**
* -aka
*/
Rvul:68,"68":"Rvul",
/**
* -tavya (gantavya, bhavitavya, ...)
*/
tavya:69,"69":"tavya",
/**
* -tavya
*/
tavyat:70,"70":"tavyat",
/**
* -tum (gantum, bhavitum, ...)
*/
tumun:71,"71":"tumun",
/**
* -tf (gantA, bhavitA, ...)
*/
tfc:72,"72":"tfc",
/**
* -tf
*/
tfn:73,"73":"tfn",
/**
* -Taka (gATaka)
*/
Takan:74,"74":"Takan",
/**
* -Tu (vepaTu). Allowed only for dhatus that are `qvit`.
*/
aTuc:75,"75":"aTuc",
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
* -Ayya
*/
Ayya:101,"101":"Ayya",
/**
* -itnu
*/
itnuc:102,"102":"itnuc",
/**
* -iTi
*/
iTin:103,"103":"iTin",
/**
* -iza
*/
wizac:104,"104":"wizac",
/**
* -izWu
*/
izWuc:105,"105":"izWuc",
/**
* -izWa
*/
izWac:106,"106":"izWac",
/**
* -isa
*/
isan:107,"107":"isan",
/**
* -is
*/
isi:108,"108":"isi",
/**
* -u (kAru)
*/
uR:109,"109":"uR",
/**
* -atu (kratu)
*/
katu:110,"110":"katu",
/**
* -ka
*/
kan:111,"111":"kan",
/**
* -Ta
*/
kTan:112,"112":"kTan",
/**
* -vi (jAgfvi)
*/
kvinUnadi:113,"113":"kvinUnadi",
/**
* -sara
*/
ksaran:114,"114":"ksaran",
/**
* -si
*/
ksi:115,"115":"ksi",
/**
* -su
*/
ksu:116,"116":"ksu",
/**
* -u (tAlu)
*/
YuR:117,"117":"YuR",
/**
* -ta
*/
tan:118,"118":"tan",
/**
* -tu
*/
tun:119,"119":"tun",
/**
* -tra,
*/
tran:120,"120":"tran",
/**
* -sa
*/
sa:121,"121":"sa",
/**
* -sara
*/
sara:122,"122":"sara",
/**
* -su
*/
suk:123,"123":"suk",
/**
* -atni,
*/
katnic:124,"124":"katnic",
/**
* -yatu,
*/
yatuc:125,"125":"yatuc",
/**
* -ali
*/
alic:126,"126":"alic",
/**
* -sya
*/
syan:127,"127":"syan",
/**
* -uli
*/
uli:128,"128":"uli",
/**
* -as (use trailing `_` since `as` is a reserved keyword in Rust.)
*/
asa:129,"129":"asa",
/**
* -As,
*/
Asa:130,"130":"Asa",
/**
* -Anu
*/
Anuk:131,"131":"Anuk", });
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
* The complete list of taddhita-pratyayas.
*
* Rust's naming convention is to start enum values with capital letters. However, we allow mixed
* case explicitly here so that we can name pratyayas more concisely with SLP1. Doing so helps us
* distinguish between pratyayas like `naN` and `nan`.
*/
export const Taddhita = Object.freeze({
/**
* -aka
*/
akac:0,"0":"akac",
/**
* -a
*/
aR:1,"1":"aR",
/**
* -a
*/
aY:2,"2":"aY",
/**
* -a
*/
at:3,"3":"at",
/**
* -Ara
*/
Arak:4,"4":"Arak",
/**
* -i
*/
iY:5,"5":"iY",
/**
* -iman
*/
imanic:6,"6":"imanic",
/**
* -ila
*/
ilac:7,"7":"ilac",
/**
* -izWa
*/
izWan:8,"8":"izWan",
/**
* -Iyas
*/
Iyasun:9,"9":"Iyasun",
/**
* -era,
*/
Erak:10,"10":"Erak",
/**
* -ka
*/
kan:11,"11":"kan",
/**
* -kalpa
*/
kalpap:12,"12":"kalpap",
/**
* -kftvas
*/
kftvasuc:13,"13":"kftvasuc",
/**
* -Ina
*/
Ka:14,"14":"Ka",
/**
* -Ina
*/
KaY:15,"15":"KaY",
/**
* -iya
*/
Ga:16,"16":"Ga",
/**
* -iya
*/
Gac:17,"17":"Gac",
/**
* -iya
*/
Gas:18,"18":"Gas",
/**
* -Ayana
*/
cPaY:19,"19":"cPaY",
/**
* -Iya
*/
Ca:20,"20":"Ca",
/**
* -Iya,
*/
CaR:21,"21":"CaR",
/**
* -Iya,
*/
Cas:22,"22":"Cas",
/**
* -ya
*/
Yya:23,"23":"Yya",
/**
* -a
*/
waq:24,"24":"waq",
/**
* -ika
*/
Wak:25,"25":"Wak",
/**
* -ika
*/
WaY:26,"26":"WaY",
/**
* -mat
*/
qmatup:27,"27":"qmatup",
/**
* -aka
*/
qvun:28,"28":"qvun",
/**
* -eya
*/
Qak:29,"29":"Qak",
/**
* -eya
*/
QaY:30,"30":"QaY",
/**
* -era
*/
Qrak:31,"31":"Qrak",
/**
* -in
*/
Rini:32,"32":"Rini",
/**
* -tama
*/
tamap:33,"33":"tamap",
/**
* -tara
*/
tarap:34,"34":"tarap",
/**
* -ta (becomes -tA)
*/
tal:35,"35":"tal",
/**
* -tas
*/
tasi:36,"36":"tasi",
/**
* -tas
*/
tasil:37,"37":"tasil",
/**
* -tika
*/
tikan:38,"38":"tikan",
/**
* -tra
*/
tral:39,"39":"tral",
/**
* -tva
*/
tva:40,"40":"tva",
/**
* -Tam
*/
Tamu:41,"41":"Tamu",
/**
* -TA
*/
TAl:42,"42":"TAl",
/**
* -dA
*/
dA:43,"43":"dA",
/**
* -dAnIm
*/
dAnIm:44,"44":"dAnIm",
/**
* -deSya
*/
deSya:45,"45":"deSya",
/**
* -deSIya
*/
deSIyar:46,"46":"deSIyar",
/**
* -dhA
*/
DA:47,"47":"DA",
/**
* -na
*/
na:48,"48":"na",
/**
* -Ayana
*/
Pak:49,"49":"Pak",
/**
* -Ayana
*/
PaY:50,"50":"PaY",
/**
* -Ayani
*/
PiY:51,"51":"PiY",
/**
* -mat
*/
matup:52,"52":"matup",
/**
* -ma
*/
map:53,"53":"map",
/**
* -maya
*/
mayaw:54,"54":"mayaw",
/**
* -ya
*/
yak:55,"55":"yak",
/**
* -ya
*/
yaY:56,"56":"yaY",
/**
* -ya
*/
yat:57,"57":"yat",
/**
* -yu
*/
yus:58,"58":"yus",
/**
* -rUpa
*/
rUpap:59,"59":"rUpap",
/**
* -rhi
*/
rhil:60,"60":"rhil",
/**
* -la
*/
lac:61,"61":"lac",
/**
* -in
*/
vini:62,"62":"vini",
/**
* -aka
*/
vuY:63,"63":"vuY",
/**
* -aka
*/
vun:64,"64":"vun",
/**
* -Sa
*/
Sa:65,"65":"Sa",
/**
* -Sas
*/
Sas:66,"66":"Sas",
/**
* -ika
*/
zWan:67,"67":"zWan",
/**
* -sAt
*/
sAti:68,"68":"sAti",
/**
* -s
*/
suc:69,"69":"suc",
/**
* -ha
*/
ha:70,"70":"ha", });
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
* WebAssembly API for vidyut-prakriya.
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
    *
    * TODO: how might we reduce the number of arguments here?
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
