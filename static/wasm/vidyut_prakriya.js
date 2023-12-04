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
* The complete list of ordinary krt-pratyayas.
*
* Rust's naming convention is to start enum values with capital letters. However, we allow mixed
* case explicitly here so that we can name pratyayas more concisely with SLP1. Doing so helps us
* distinguish between pratyayas like `naN` and `nan`.
*/
export const BaseKrt = Object.freeze({
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
* -ika
*/
ika:10,"10":"ika",
/**
* -ikavaka
*/
ikavaka:11,"11":"ikavaka",
/**
* -itra
*/
itra:12,"12":"itra",
/**
* -in. The trailing `_` is to avoid colliding with Rust's `in` keyword.
*/
in_:13,"13":"in_",
/**
* -in
*/
ini:14,"14":"ini",
/**
* -izRu (alaMkarizRu, prajanizRu, ...)
*/
izRuc:15,"15":"izRuc",
/**
* -u (yuyutsu, Bikzu, ...)
*/
u:16,"16":"u",
/**
* -uka
*/
ukaY:17,"17":"ukaY",
/**
* -Uka
*/
Uka:18,"18":"Uka",
/**
* -a
*/
ka:19,"19":"ka",
/**
* -a
*/
kaY:20,"20":"kaY",
/**
* -am
*/
kamul:21,"21":"kamul",
/**
* -as (visfpaH, ...)
*/
kasun:22,"22":"kasun",
/**
* -a
*/
kap:23,"23":"kap",
/**
* -Ana (cakrARa, ...)
*/
kAnac:24,"24":"kAnac",
/**
* -i (udaDi, ...)
*/
ki:25,"25":"ki",
/**
* -i
*/
kin:26,"26":"kin",
/**
* -ura (BaNgura, ...)
*/
kurac:27,"27":"kurac",
/**
* -elima (pacelima, ...)
*/
kelimar:28,"28":"kelimar",
/**
* -ta (gata, bhUta, ...)
*/
kta:29,"29":"kta",
/**
* -tavat (gatavat, bhUtavat, ...)
*/
ktavatu:30,"30":"ktavatu",
/**
* -ti
*/
ktic:31,"31":"ktic",
/**
* -ti
*/
ktin:32,"32":"ktin",
/**
* -tri
*/
ktri:33,"33":"ktri",
/**
* -tvA (gatvA, bhUtva, ...)
*/
ktvA:34,"34":"ktvA",
/**
* -nu
*/
knu:35,"35":"knu",
/**
* -mara
*/
kmarac:36,"36":"kmarac",
/**
* -ya
*/
kyap:37,"37":"kyap",
/**
* -ru (BIru)
*/
kru:38,"38":"kru",
/**
* -ruka (BIruka)
*/
kruka:39,"39":"kruka",
/**
* -luka (BIluka)
*/
klukan:40,"40":"klukan",
/**
* -van
*/
kvanip:41,"41":"kvanip",
/**
* -vara
*/
kvarap:42,"42":"kvarap",
/**
* -vas
*/
kvasu:43,"43":"kvasu",
/**
* -snu (glAsnu, jizRu, ...)
*/
ksnu:44,"44":"ksnu",
/**
* (empty suffix)
*/
kvin:45,"45":"kvin",
/**
* (empty suffix)
*/
kvip:46,"46":"kvip",
/**
* -a (priyaMvada, vaSaMvada)
*/
Kac:47,"47":"Kac",
/**
* -a
*/
KaS:48,"48":"KaS",
/**
* -a (Izatkara, duzkara, sukara, ...)
*/
Kal:49,"49":"Kal",
/**
* -izRu
*/
KizRuc:50,"50":"KizRuc",
/**
* -uka
*/
KukaY:51,"51":"KukaY",
/**
* -ana
*/
Kyun:52,"52":"Kyun",
/**
* -a
*/
Ga:53,"53":"Ga",
/**
* -a
*/
GaY:54,"54":"GaY",
/**
* -in
*/
GinuR:55,"55":"GinuR",
/**
* -ura
*/
Gurac:56,"56":"Gurac",
/**
* -van
*/
Nvanip:57,"57":"Nvanip",
/**
* -Ana
*/
cAnaS:58,"58":"cAnaS",
/**
* -a
*/
wa:59,"59":"wa",
/**
* -a
*/
wak:60,"60":"wak",
/**
* -a
*/
qa:61,"61":"qa",
/**
* -ara,
*/
qara:62,"62":"qara",
/**
* -u
*/
qu:63,"63":"qu",
/**
* -a
*/
Ra:64,"64":"Ra",
/**
* -am
*/
Ramul:65,"65":"Ramul",
/**
* -in
*/
Rini:66,"66":"Rini",
/**
* -ya
*/
Ryat:67,"67":"Ryat",
/**
* -ana
*/
Ryuw:68,"68":"Ryuw",
/**
* (empty)
*/
Rvi:69,"69":"Rvi",
/**
* -aka
*/
Rvuc:70,"70":"Rvuc",
/**
* -aka
*/
Rvul:71,"71":"Rvul",
/**
* -tavya (gantavya, bhavitavya, ...)
*/
tavya:72,"72":"tavya",
/**
* -tavya
*/
tavyat:73,"73":"tavyat",
/**
* -tum (gantum, bhavitum, ...)
*/
tumun:74,"74":"tumun",
/**
* -tf (gantA, bhavitA, ...)
*/
tfc:75,"75":"tfc",
/**
* -tf
*/
tfn:76,"76":"tfn",
/**
* -Taka (gATaka)
*/
Takan:77,"77":"Takan",
/**
* -na
*/
naN:78,"78":"naN",
/**
* -naj
*/
najiN:79,"79":"najiN",
/**
* -na (svapna)
*/
nan:80,"80":"nan",
/**
* -man
*/
manin:81,"81":"manin",
/**
* -a
*/
Sa:82,"82":"Sa",
/**
* -at (gacCat, Bavat, ...)
*/
Satf:83,"83":"Satf",
/**
* -Ana (laBamAna, sevamAna, ...)
*/
SAnac:84,"84":"SAnac",
/**
* -Ana
*/
SAnan:85,"85":"SAnan",
/**
* -ya
*/
yat:86,"86":"yat",
/**
* -ana
*/
yuc:87,"87":"yuc",
/**
* -na (namra, kampra, ...)
*/
ra:88,"88":"ra",
/**
* -ru
*/
ru:89,"89":"ru",
/**
* -ana
*/
lyu:90,"90":"lyu",
/**
* -ana
*/
lyuw:91,"91":"lyuw",
/**
* -van
*/
vanip:92,"92":"vanip",
/**
* -vara
*/
varac:93,"93":"varac",
/**
* (empty suffix)
*/
vic:94,"94":"vic",
/**
* (none)
*/
viw:95,"95":"viw",
/**
* -aka
*/
vuY:96,"96":"vuY",
/**
* -aka
*/
vun:97,"97":"vun",
/**
* -Aka
*/
zAkan:98,"98":"zAkan",
/**
* -tra
*/
zwran:99,"99":"zwran",
/**
* -aka
*/
zvun:100,"100":"zvun", });
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
* The pada of some tinanta or krdanta.
*/
export const DhatuPada = Object.freeze({
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
* -aWa
*/
aWac:3,"3":"aWac",
/**
* -a
*/
aR:4,"4":"aR",
/**
* -a
*/
aY:5,"5":"aY",
/**
* -a
*/
at:6,"6":"at",
/**
* -atas
*/
atasuc:7,"7":"atasuc",
/**
* -an
*/
anic:8,"8":"anic",
/**
* -a
*/
ap:9,"9":"ap",
/**
* -as
*/
asic:10,"10":"asic",
/**
* -astAt
*/
astAti:11,"11":"astAti",
/**
* -Akin,
*/
Akinic:12,"12":"Akinic",
/**
* -Ara
*/
Arak:13,"13":"Arak",
/**
* -i
*/
iY:14,"14":"iY",
/**
* -ita
*/
itac:15,"15":"itac",
/**
* -ina
*/
inac:16,"16":"inac",
/**
* -in
*/
ini:17,"17":"ini",
/**
* -iman
*/
imanic:18,"18":"imanic",
/**
* -ila
*/
ila:19,"19":"ila",
/**
* -ila
*/
ilac:20,"20":"ilac",
/**
* -izWa
*/
izWan:21,"21":"izWan",
/**
* -Ika,
*/
Ikak:22,"22":"Ikak",
/**
* -Iyas
*/
Iyasun:23,"23":"Iyasun",
/**
* -eRya
*/
eRya:24,"24":"eRya",
/**
* -Era
*/
Erak:25,"25":"Erak",
/**
* -ka
*/
ka:26,"26":"ka",
/**
* -ka
*/
kak:27,"27":"kak",
/**
* -kawa
*/
kawac:28,"28":"kawac",
/**
* -ka
*/
kan:29,"29":"kan",
/**
* -ka
*/
kap:30,"30":"kap",
/**
* -kalpa
*/
kalpap:31,"31":"kalpap",
/**
* -kftvas
*/
kftvasuc:32,"32":"kftvasuc",
/**
* -kuwAra
*/
kuwArac:33,"33":"kuwArac",
/**
* -kura,
*/
kuRap:34,"34":"kuRap",
/**
* -Ina
*/
Ka:35,"35":"Ka",
/**
* -Ina
*/
KaY:36,"36":"KaY",
/**
* -iya
*/
Ga:37,"37":"Ga",
/**
* -iya
*/
Gac:38,"38":"Gac",
/**
* -iya
*/
Gan:39,"39":"Gan",
/**
* -iya
*/
Gas:40,"40":"Gas",
/**
* -caRa
*/
caRap:41,"41":"caRap",
/**
* -cara
*/
caraw:42,"42":"caraw",
/**
* -cuYcu
*/
cuYcup:43,"43":"cuYcup",
/**
* -Ayana
*/
cPaY:44,"44":"cPaY",
/**
* --
*/
cvi:45,"45":"cvi",
/**
* -Iya
*/
Ca:46,"46":"Ca",
/**
* -Iya,
*/
CaR:47,"47":"CaR",
/**
* -Iya,
*/
Cas:48,"48":"Cas",
/**
* -jAtIya
*/
jAtIyar:49,"49":"jAtIyar",
/**
* -jAha
*/
jAhac:50,"50":"jAhac",
/**
* -a,
*/
Ya:51,"51":"Ya",
/**
* -ika
*/
YiW:52,"52":"YiW",
/**
* -ya
*/
Yya:53,"53":"Yya",
/**
* -ya,
*/
YyaN:54,"54":"YyaN",
/**
* -ya
*/
Yyaw:55,"55":"Yyaw",
/**
* -a
*/
wac:56,"56":"wac",
/**
* -a
*/
waq:57,"57":"waq",
/**
* -iWa
*/
wiWan:58,"58":"wiWan",
/**
* -wIwa
*/
wIwac:59,"59":"wIwac",
/**
* -eRya
*/
weRyaR:60,"60":"weRyaR",
/**
* -ya
*/
wyaR:61,"61":"wyaR",
/**
* -ana
*/
wyu:62,"62":"wyu",
/**
* -ana
*/
wyul:63,"63":"wyul",
/**
* -la
*/
wlaY:64,"64":"wlaY",
/**
* -ika
*/
Wak:65,"65":"Wak",
/**
* -ika
*/
Wac:66,"66":"Wac",
/**
* -ika
*/
WaY:67,"67":"WaY",
/**
* -ika
*/
Wan:68,"68":"Wan",
/**
* -ika
*/
Wap:69,"69":"Wap",
/**
* -a
*/
qaw:70,"70":"qaw",
/**
* -ati
*/
qati:71,"71":"qati",
/**
* -atara
*/
qatarac:72,"72":"qatarac",
/**
* -atama
*/
qatamac:73,"73":"qatamac",
/**
* -pa
*/
qupac:74,"74":"qupac",
/**
* -mat
*/
qmatup:75,"75":"qmatup",
/**
* -ya
*/
qyaR:76,"76":"qyaR",
/**
* -vala
*/
qvalac:77,"77":"qvalac",
/**
* -aka
*/
qvun:78,"78":"qvun",
/**
* -eya
*/
Qak:79,"79":"Qak",
/**
* -eyaka
*/
QakaY:80,"80":"QakaY",
/**
* -eya
*/
Qa:81,"81":"Qa",
/**
* -eya
*/
QaY:82,"82":"QaY",
/**
* -eyin
*/
Qinuk:83,"83":"Qinuk",
/**
* -era
*/
Qrak:84,"84":"Qrak",
/**
* -a
*/
Ra:85,"85":"Ra",
/**
* -in
*/
Rini:86,"86":"Rini",
/**
* -ya
*/
Rya:87,"87":"Rya",
/**
* -tama
*/
tamap:88,"88":"tamap",
/**
* -taya
*/
tayap:89,"89":"tayap",
/**
* -tara
*/
tarap:90,"90":"tarap",
/**
* -ta (becomes -tA)
*/
tal:91,"91":"tal",
/**
* -tas
*/
tasi:92,"92":"tasi",
/**
* -tas
*/
tasil:93,"93":"tasil",
/**
* -ti
*/
ti:94,"94":"ti",
/**
* -tika
*/
tikan:95,"95":"tikan",
/**
* -tIya
*/
tIya:96,"96":"tIya",
/**
* -tya
*/
tyak:97,"97":"tyak",
/**
* -tyaka
*/
tyakan:98,"98":"tyakan",
/**
* -tya
*/
tyap:99,"99":"tyap",
/**
* -tana
*/
tyu:100,"100":"tyu",
/**
* -tana
*/
tyul:101,"101":"tyul",
/**
* -tra
*/
tral:102,"102":"tral",
/**
* -trA
*/
trA:103,"103":"trA",
/**
* -tva
*/
tva:104,"104":"tva",
/**
* -Tam
*/
Tamu:105,"105":"Tamu",
/**
* -Tya
*/
Tyan:106,"106":"Tyan",
/**
* -TA
*/
TAl:107,"107":"TAl",
/**
* -daGna
*/
daGnac:108,"108":"daGnac",
/**
* -dA
*/
dA:109,"109":"dA",
/**
* -dAnIm
*/
dAnIm:110,"110":"dAnIm",
/**
* -deSya
*/
deSya:111,"111":"deSya",
/**
* -deSIya
*/
deSIyar:112,"112":"deSIyar",
/**
* -dvayasa
*/
dvayasac:113,"113":"dvayasac",
/**
* -dhA
*/
DA:114,"114":"DA",
/**
* -na
*/
na:115,"115":"na",
/**
* -na
*/
naY:116,"116":"naY",
/**
* -nAwa
*/
nAwac:117,"117":"nAwac",
/**
* -Ayana
*/
Pak:118,"118":"Pak",
/**
* -Ayana
*/
PaY:119,"119":"PaY",
/**
* -Ayani
*/
PiY:120,"120":"PiY",
/**
* -bahu
*/
bahuc:121,"121":"bahuc",
/**
* -biqa
*/
biqac:122,"122":"biqac",
/**
* -birIsa
*/
birIsac:123,"123":"birIsac",
/**
* -Bakta
*/
Baktal:124,"124":"Baktal",
/**
* -Brawa
*/
Brawac:125,"125":"Brawac",
/**
* -ma
*/
ma:126,"126":"ma",
/**
* -mat
*/
matup:127,"127":"matup",
/**
* -ma
*/
map:128,"128":"map",
/**
* -maya
*/
mayaw:129,"129":"mayaw",
/**
* -mAtra
*/
mAtrac:130,"130":"mAtrac",
/**
* -pASa
*/
pASap:131,"131":"pASap",
/**
* -piwa
*/
piwac:132,"132":"piwac",
/**
* -ya
*/
ya:133,"133":"ya",
/**
* -ya
*/
yak:134,"134":"yak",
/**
* -ya
*/
yaY:135,"135":"yaY",
/**
* -ya
*/
yat:136,"136":"yat",
/**
* -ya
*/
yan:137,"137":"yan",
/**
* -yu
*/
yus:138,"138":"yus",
/**
* -ra
*/
ra:139,"139":"ra",
/**
* -rUpa
*/
rUpap:140,"140":"rUpap",
/**
* -rhi
*/
rhil:141,"141":"rhil",
/**
* -rUpya
*/
rUpya:142,"142":"rUpya",
/**
* -la
*/
lac:143,"143":"lac",
/**
* -vat
*/
vatup:144,"144":"vatup",
/**
* -vaya
*/
vaya:145,"145":"vaya",
/**
* -vala
*/
valac:146,"146":"valac",
/**
* -vin
*/
vini:147,"147":"vini",
/**
* -viDu
*/
viDal:148,"148":"viDal",
/**
* -aka
*/
vuk:149,"149":"vuk",
/**
* -aka
*/
vuY:150,"150":"vuY",
/**
* -aka
*/
vun:151,"151":"vun",
/**
* -vya
*/
vyat:152,"152":"vyat",
/**
* -vya
*/
vyan:153,"153":"vyan",
/**
* -Sa
*/
Sa:154,"154":"Sa",
/**
* -SaNkawa
*/
SaNkawac:155,"155":"SaNkawac",
/**
* -SAla
*/
SAlac:156,"156":"SAlac",
/**
* -Sas
*/
Sas:157,"157":"Sas",
/**
* -za
*/
za:158,"158":"za",
/**
* -ka
*/
zkan:159,"159":"zkan",
/**
* -tra
*/
zwarac:160,"160":"zwarac",
/**
* -ika
*/
zWac:161,"161":"zWac",
/**
* -ika
*/
zWan:162,"162":"zWan",
/**
* -ika
*/
zWal:163,"163":"zWal",
/**
* Ayana
*/
zPak:164,"164":"zPak",
/**
* -sa
*/
sa:165,"165":"sa",
/**
* -sna
*/
sna:166,"166":"sna",
/**
* -sAt
*/
sAti:167,"167":"sAti",
/**
* -s
*/
suc:168,"168":"suc",
/**
* -sna
*/
snaY:169,"169":"snaY",
/**
* -ha
*/
ha:170,"170":"ha", });
/**
* Defines a *gaṇa*.
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
* `kAmyac`, which creates nAma-dhAtus per 3.1.9.
*/
kAmyac:0,"0":"kAmyac",
/**
* `kyaN`, which creates nAma-dhAtus per 3.1.11.
*/
kyaN:1,"1":"kyaN",
/**
* `kyac`, which creates nAma-dhAtus per 3.1.8.
*/
kyac:2,"2":"kyac",
/**
* `Nic`, which creates causal roots per 3.1.26.
*
* Examples: BAvayati, nAyayati.
*/
Ric:3,"3":"Ric",
/**
* `yaN`, which creates intensive roots per 3.1.22. For certain dhatus, the semantics are
* instead "crooked movement" (by 3.1.23) or "contemptible" action (by 3.1.24).
*
* Examples: boBUyate, nenIyate.
*
* Constraints: can be used only if the dhatu starts with a consonant and has exactly one
* vowel. If this constraint is violated, our APIs will return an `Error`.
*/
yaN:4,"4":"yaN",
/**
* `yaN`, with elision per 2.4.74. This is often listed separately due to its rarity and its
* very different form.
*
* Examples: boBavIti, boBoti, nenayIti, neneti.
*/
yaNluk:5,"5":"yaNluk",
/**
* `san`, which creates desiderative roots per 3.1.7.
*
* Examples: buBUzati, ninIzati.
*/
san:6,"6":"san", });
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
* The complete list of unadi-pratyayas.
*
* Rust's naming convention is to start enum values with capital letters. However, we allow mixed
* case explicitly here so that we can name pratyayas more concisely with SLP1. Doing so helps us
* distinguish between pratyayas like `naN` and `nan`.
*
* NOTE: we generated this list programmatically. Many of these pratyayas have typos.
*/
export const Unadi = Object.freeze({
/**
* -aknu
*/
aknuc:0,"0":"aknuc",
/**
* -aNga
*/
aNgac:1,"1":"aNgac",
/**
* -adAnu
*/
radAnuk:2,"2":"radAnuk",
/**
* -a
*/
ac:3,"3":"ac",
/**
* -aji
*/
aji:4,"4":"aji",
/**
* -awa
*/
awan:5,"5":"awan",
/**
* -awi
*/
awi:6,"6":"awi",
/**
* -aWa
*/
aWa:7,"7":"aWa",
/**
* -aRqa
*/
aRqan:8,"8":"aRqan",
/**
* -ata
*/
atac:9,"9":"atac",
/**
* -ati
*/
ati:10,"10":"ati",
/**
* -atra
*/
atran:11,"11":"atran",
/**
* -atri
*/
atrin:12,"12":"atrin",
/**
* -aTa
*/
aTa:13,"13":"aTa",
/**
* -adi
*/
adi:14,"14":"adi",
/**
* -a
*/
an:15,"15":"an",
/**
* -ani
*/
ani:16,"16":"ani",
/**
* -anu
*/
anuN:17,"17":"anuN",
/**
* -anya
*/
anya:18,"18":"anya",
/**
* -anyu
*/
anyuc:19,"19":"anyuc",
/**
* -apa
*/
apa:20,"20":"apa",
/**
* -abaka
*/
abaka:21,"21":"abaka",
/**
* -aba
*/
abac:22,"22":"abac",
/**
* -aBa
*/
aBac:23,"23":"aBac",
/**
* -ama
*/
ama:24,"24":"ama",
/**
* -ama (praTama)
*/
amac:25,"25":"amac",
/**
* -amba
*/
ambaj:26,"26":"ambaj",
/**
* -ayu
*/
ayu:27,"27":"ayu",
/**
* -ara
*/
ara:28,"28":"ara",
/**
* -ara
*/
aran:29,"29":"aran",
/**
* -aru
*/
aru:30,"30":"aru",
/**
* -a
*/
al:31,"31":"al",
/**
* -ala (maNgala)
*/
alac:32,"32":"alac",
/**
* -ali
*/
alic:33,"33":"alic",
/**
* -avi
*/
avi:34,"34":"avi",
/**
* -a
*/
asa:35,"35":"asa",
/**
* -asa
*/
asac:36,"36":"asac",
/**
* -asAna
*/
asAnac:37,"37":"asAnac",
/**
* -asi
*/
asi:38,"38":"asi",
/**
* -as (cetas)
*/
asun:39,"39":"asun",
/**
* -A
*/
A:40,"40":"A",
/**
* -Aka
*/
Aka:41,"41":"Aka",
/**
* -AgU
*/
AgUc:42,"42":"AgUc",
/**
* -Awa
*/
Awac:43,"43":"Awac",
/**
* -ARaka
*/
ARaka:44,"44":"ARaka",
/**
* -Atu
*/
Atu:45,"45":"Atu",
/**
* -Atfka
*/
Atfkan:46,"46":"Atfkan",
/**
* -Anaka
*/
Anaka:47,"47":"Anaka",
/**
* -Ana
*/
Anac:48,"48":"Anac",
/**
* -Anu
*/
Anuk:49,"49":"Anuk",
/**
* -Anya
*/
Anya:50,"50":"Anya",
/**
* -Ayya
*/
Ayya:51,"51":"Ayya",
/**
* -Ara
*/
Aran:52,"52":"Aran",
/**
* -Ala
*/
Ala:53,"53":"Ala",
/**
* -Ala
*/
Alac:54,"54":"Alac",
/**
* -Ala
*/
AlaY:55,"55":"AlaY",
/**
* -AlIya
*/
AlIyac:56,"56":"AlIyac",
/**
* -A
*/
Asa:57,"57":"Asa",
/**
* -Asi
*/
Asi:58,"58":"Asi",
/**
* -i
*/
i:59,"59":"i",
/**
* -ika
*/
ikan:60,"60":"ikan",
/**
* -iji
*/
iji:61,"61":"iji",
/**
* -i
*/
iY:62,"62":"iY",
/**
* -i
*/
iR:63,"63":"iR",
/**
* -ita
*/
ita:64,"64":"ita",
/**
* -ita
*/
itac:65,"65":"itac",
/**
* -ita
*/
itan:66,"66":"itan",
/**
* -iti
*/
iti:67,"67":"iti",
/**
* -itnu
*/
itnuc:68,"68":"itnuc",
/**
* -itra
*/
itra:69,"69":"itra",
/**
* -itva
*/
itvan:70,"70":"itvan",
/**
* -iTi
*/
iTin:71,"71":"iTin",
/**
* -i
*/
in_:72,"72":"in_",
/**
* -ina
*/
inac:73,"73":"inac",
/**
* -ina
*/
inaR:74,"74":"inaR",
/**
* -ina
*/
inan:75,"75":"inan",
/**
* -in
*/
ini:76,"76":"ini",
/**
* -imani
*/
imanic:77,"77":"imanic",
/**
* -imani
*/
imanin:78,"78":"imanin",
/**
* -ila
*/
ilac:79,"79":"ilac",
/**
* -izWa
*/
izWac:80,"80":"izWac",
/**
* -izWu
*/
izWuc:81,"81":"izWuc",
/**
* -izRu
*/
izRuc:82,"82":"izRuc",
/**
* -isa
*/
isan:83,"83":"isan",
/**
* -is
*/
isi:84,"84":"isi",
/**
* -is
*/
isin:85,"85":"isin",
/**
* -I
*/
I:86,"86":"I",
/**
* -Ika
*/
Ikan:87,"87":"Ikan",
/**
* -Ici
*/
Ici:88,"88":"Ici",
/**
* -Ida
*/
Ida:89,"89":"Ida",
/**
* -Ira
*/
Irac:90,"90":"Irac",
/**
* -Ira
*/
Iran:91,"91":"Iran",
/**
* -Iza
*/
Izan:92,"92":"Izan",
/**
* -u
*/
u:93,"93":"u",
/**
* -uka
*/
ukan:94,"94":"ukan",
/**
* -uqa
*/
uqac:95,"95":"uqac",
/**
* -u
*/
uR:96,"96":"uR",
/**
* -uti
*/
uti:97,"97":"uti",
/**
* -utra
*/
utra:98,"98":"utra",
/**
* -una
*/
una:99,"99":"una",
/**
* -una
*/
unan:100,"100":"unan",
/**
* -unasi
*/
unasi:101,"101":"unasi",
/**
* -uni
*/
uni:102,"102":"uni",
/**
* -unta
*/
unta:103,"103":"unta",
/**
* -unti
*/
unti:104,"104":"unti",
/**
* -uma
*/
uma:105,"105":"uma",
/**
* -umBa
*/
umBa:106,"106":"umBa",
/**
* -ura
*/
urac:107,"107":"urac",
/**
* -ura
*/
uran:108,"108":"uran",
/**
* -uri
*/
urin:109,"109":"urin",
/**
* -ula
*/
ulac:110,"110":"ulac",
/**
* -uli
*/
uli:111,"111":"uli",
/**
* -uza
*/
uzac:112,"112":"uzac",
/**
* -us (Danus)
*/
usi:113,"113":"usi",
/**
* -U
*/
U:114,"114":"U",
/**
* -Uka
*/
Uka:115,"115":"Uka",
/**
* -Uka
*/
UkaR:116,"116":"UkaR",
/**
* -UKa
*/
UKa:117,"117":"UKa",
/**
* -UTa
*/
UTan:118,"118":"UTan",
/**
* -Uma
*/
Uma:119,"119":"Uma",
/**
* -U
*/
Ur:120,"120":"Ur",
/**
* -Ura
*/
Uran:121,"121":"Uran",
/**
* -Uza
*/
Uzan:122,"122":"Uzan",
/**
* -f
*/
f:123,"123":"f",
/**
* -fti
*/
ftin:124,"124":"ftin",
/**
* -f
*/
fn_:125,"125":"fn_",
/**
* -eRu
*/
eRu:126,"126":"eRu",
/**
* -eRya
*/
eRya:127,"127":"eRya",
/**
* -era
*/
erak:128,"128":"erak",
/**
* -elima
*/
elimac:129,"129":"elimac",
/**
* -ota
*/
otac:130,"130":"otac",
/**
* -ora
*/
oran:131,"131":"oran",
/**
* -ola
*/
olac:132,"132":"olac",
/**
* -ka
*/
ka:133,"133":"ka",
/**
* -ka
*/
kak:134,"134":"kak",
/**
* -kaNkaRa
*/
kaNkaRa:135,"135":"kaNkaRa",
/**
* -kaRa
*/
kaRa:136,"136":"kaRa",
/**
* -katu
*/
katu:137,"137":"katu",
/**
* -katni
*/
katnic:138,"138":"katnic",
/**
* -katra
*/
katra:139,"139":"katra",
/**
* -kTa
*/
kTan:140,"140":"kTan",
/**
* -ka
*/
kan:141,"141":"kan",
/**
* -kanasi
*/
kanasi:142,"142":"kanasi",
/**
* -kani
*/
kanin:143,"143":"kanin",
/**
* -kanu
*/
kanum:144,"144":"kanum",
/**
* -kanya
*/
kanyan:145,"145":"kanyan",
/**
* -kanyu
*/
kanyuc:146,"146":"kanyuc",
/**
* -kapa
*/
kapa:147,"147":"kapa",
/**
* -kapa
*/
kapan:148,"148":"kapan",
/**
* -kami
*/
kamin:149,"149":"kamin",
/**
* -kaya
*/
kayan:150,"150":"kayan",
/**
* -kara
*/
karan:151,"151":"karan",
/**
* -kala
*/
kala:152,"152":"kala",
/**
* -kAku
*/
kAku:153,"153":"kAku",
/**
* -kAla
*/
kAlan:154,"154":"kAlan",
/**
* -kika
*/
kikan:155,"155":"kikan",
/**
* -kita
*/
kitac:156,"156":"kitac",
/**
* -kinda
*/
kindac:157,"157":"kindac",
/**
* -kira
*/
kirac:158,"158":"kirac",
/**
* -kizya
*/
kizyan:159,"159":"kizyan",
/**
* -kIka
*/
kIkac:160,"160":"kIkac",
/**
* -kIka
*/
kIkan:161,"161":"kIkan",
/**
* -kIwa
*/
kIwan:162,"162":"kIwan",
/**
* -ku
*/
ku:163,"163":"ku",
/**
* -ku
*/
kuk:164,"164":"kuk",
/**
* -kuka
*/
kukan:165,"165":"kukan",
/**
* -kuza
*/
kuzan:166,"166":"kuzan",
/**
* -kU
*/
kU:167,"167":"kU",
/**
* -kta
*/
kta:168,"168":"kta",
/**
* -ktnu
*/
ktnu:169,"169":"ktnu",
/**
* -ktra
*/
ktra:170,"170":"ktra",
/**
* -kTi
*/
kTin:171,"171":"kTin",
/**
* -kna
*/
kna:172,"172":"kna",
/**
* -kni
*/
knin:173,"173":"knin",
/**
* -kmala
*/
kmalan:174,"174":"kmalan",
/**
* -kyu
*/
kyu:175,"175":"kyu",
/**
* -kyu
*/
kyun:176,"176":"kyun",
/**
* -kra
*/
kran:177,"177":"kran",
/**
* -krara
*/
kraran:178,"178":"kraran",
/**
* -kri
*/
kri:179,"179":"kri",
/**
* -kri
*/
krin:180,"180":"krin",
/**
* -kruka
*/
krukan:181,"181":"krukan",
/**
* -kru
*/
krun:182,"182":"krun",
/**
* -kla
*/
kla:183,"183":"kla",
/**
* -kva
*/
kvan:184,"184":"kvan",
/**
* -kvani
*/
kvanip:185,"185":"kvanip",
/**
* -kvi
*/
kvin:186,"186":"kvin",
/**
* -kvi
*/
kvip:187,"187":"kvip",
/**
* -kvu
*/
kvun:188,"188":"kvun",
/**
* -ksara
*/
ksaran:189,"189":"ksaran",
/**
* -ksi
*/
ksi:190,"190":"ksi",
/**
* -ksu
*/
ksu:191,"191":"ksu",
/**
* -kseyya
*/
kseyya:192,"192":"kseyya",
/**
* -ksna
*/
ksna:193,"193":"ksna",
/**
* -Ka
*/
Ka:194,"194":"Ka",
/**
* -ga
*/
ga:195,"195":"ga",
/**
* -ga
*/
gak:196,"196":"gak",
/**
* -ga
*/
gaR:197,"197":"gaR",
/**
* -ga
*/
gan:198,"198":"gan",
/**
* -GaTi
*/
GaTin:199,"199":"GaTin",
/**
* -ca
*/
caw:200,"200":"caw",
/**
* -catu
*/
catu:201,"201":"catu",
/**
* -ci
*/
cik:202,"202":"cik",
/**
* -Ja
*/
Jac:203,"203":"Jac",
/**
* -Ji
*/
Jic:204,"204":"Jic",
/**
* -Yu
*/
YuR:205,"205":"YuR",
/**
* -wa
*/
wa:206,"206":"wa",
/**
* -wa
*/
wan:207,"207":"wan",
/**
* -wiza
*/
wizac:208,"208":"wizac",
/**
* -Wa
*/
Wa:209,"209":"Wa",
/**
* -qa
*/
qa:210,"210":"qa",
/**
* -qau
*/
qau:211,"211":"qau",
/**
* -qa
*/
qaw:212,"212":"qaw",
/**
* -qati
*/
qati:213,"213":"qati",
/**
* -qavatu
*/
qavatu:214,"214":"qavatu",
/**
* -qimi
*/
qimi:215,"215":"qimi",
/**
* -quta
*/
qutac:216,"216":"qutac",
/**
* -qu
*/
qun:217,"217":"qun",
/**
* -qumsu
*/
qumsun:218,"218":"qumsun",
/**
* -qU
*/
qU:219,"219":"qU",
/**
* -qE
*/
qE:220,"220":"qE",
/**
* -qEsi
*/
qEsi:221,"221":"qEsi",
/**
* -qo
*/
qo:222,"222":"qo",
/**
* -qosi
*/
qosi:223,"223":"qosi",
/**
* -qO
*/
qO:224,"224":"qO",
/**
* -qri
*/
qri:225,"225":"qri",
/**
* -Qa
*/
Qa:226,"226":"Qa",
/**
* -Ritra
*/
Ritran:227,"227":"Ritran",
/**
* -Ru
*/
Ru:228,"228":"Ru",
/**
* -Ruka
*/
Rukan:229,"229":"Rukan",
/**
* -ta
*/
ta:230,"230":"ta",
/**
* -taka
*/
takan:231,"231":"takan",
/**
* -ta
*/
tan:232,"232":"tan",
/**
* -tana
*/
tanan:233,"233":"tanan",
/**
* -taSa
*/
taSan:234,"234":"taSan",
/**
* -taSasu
*/
taSasun:235,"235":"taSasun",
/**
* -ti
*/
ti:236,"236":"ti",
/**
* -tika
*/
tikan:237,"237":"tikan",
/**
* -tu
*/
tu:238,"238":"tu",
/**
* -tu
*/
tun:239,"239":"tun",
/**
* -tf
*/
tfc:240,"240":"tfc",
/**
* -tf
*/
tfn:241,"241":"tfn",
/**
* -tna
*/
tnaR:242,"242":"tnaR",
/**
* -tyu
*/
tyuk:243,"243":"tyuk",
/**
* -tra
*/
tra:244,"244":"tra",
/**
* -tra
*/
tran:245,"245":"tran",
/**
* -tri
*/
trin:246,"246":"trin",
/**
* -tri
*/
trip:247,"247":"trip",
/**
* -tva
*/
tvan:248,"248":"tvan",
/**
* -Ta
*/
Tak:249,"249":"Tak",
/**
* -da
*/
da:250,"250":"da",
/**
* -da
*/
dan:251,"251":"dan",
/**
* -Du
*/
Duk:252,"252":"Duk",
/**
* -na
*/
na:253,"253":"na",
/**
* -na
*/
nak:254,"254":"nak",
/**
* -ni
*/
ni:255,"255":"ni",
/**
* -nu
*/
nu:256,"256":"nu",
/**
* -pa
*/
pa:257,"257":"pa",
/**
* -pAsa
*/
pAsa:258,"258":"pAsa",
/**
* -Pa
*/
Pak:259,"259":"Pak",
/**
* -ba
*/
ban:260,"260":"ban",
/**
* -Ba
*/
Ba:261,"261":"Ba",
/**
* -Ba
*/
Ban:262,"262":"Ban",
/**
* -ma
*/
mak:263,"263":"mak",
/**
* -madi
*/
madik:264,"264":"madik",
/**
* -ma
*/
man:265,"265":"man",
/**
* -man
*/
mani:266,"266":"mani",
/**
* -man
*/
maniR:267,"267":"maniR",
/**
* -man
*/
manin:268,"268":"manin",
/**
* -mi
*/
mi:269,"269":"mi",
/**
* -mi
*/
min:270,"270":"min",
/**
* -mu
*/
muk:271,"271":"muk",
/**
* -ya
*/
ya:272,"272":"ya",
/**
* -ya
*/
yak:273,"273":"yak",
/**
* -ya
*/
yat:274,"274":"yat",
/**
* -yatu
*/
yatuc:275,"275":"yatuc",
/**
* -yu
*/
yuk:276,"276":"yuk",
/**
* -yu
*/
yuc:277,"277":"yuc",
/**
* -yu
*/
yun:278,"278":"yun",
/**
* -ra
*/
ra:279,"279":"ra",
/**
* -ra
*/
rak:280,"280":"rak",
/**
* -ra
*/
ran:281,"281":"ran",
/**
* -ru
*/
ru:282,"282":"ru",
/**
* -la
*/
lak:283,"283":"lak",
/**
* -va
*/
va:284,"284":"va",
/**
* -va
*/
vaR:285,"285":"vaR",
/**
* -va
*/
van:286,"286":"van",
/**
* -vani
*/
vanip:287,"287":"vanip",
/**
* -vara
*/
varaw:288,"288":"varaw",
/**
* -vala
*/
valaY:289,"289":"valaY",
/**
* -vAla
*/
vAlac:290,"290":"vAlac",
/**
* -vAla
*/
vAlan:291,"291":"vAlan",
/**
* -vi
*/
vin:292,"292":"vin",
/**
* -vu
*/
vun:293,"293":"vun",
/**
* -Sa
*/
Sak:294,"294":"Sak",
/**
* -Su
*/
Sun:295,"295":"Sun",
/**
* -Sva
*/
SvaR:296,"296":"SvaR",
/**
* -ziva
*/
zivan:297,"297":"zivan",
/**
* -zwra
*/
zwran:298,"298":"zwran",
/**
* -zvara
*/
zvarac:299,"299":"zvarac",
/**
* -sa
*/
sa:300,"300":"sa",
/**
* -sa
*/
san:301,"301":"san",
/**
* -sara
*/
sara:302,"302":"sara",
/**
* -sika
*/
sikan:303,"303":"sikan",
/**
* -sTa
*/
sTan:304,"304":"sTan",
/**
* -sma
*/
sman:305,"305":"sman",
/**
* -sya
*/
sya:306,"306":"sya",
/**
* -sya
*/
syan:307,"307":"syan", });
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
    * Wrapper for `Vyakarana::derive_tinantas`.
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
        const ret = wasm.vidyut_deriveTinantas(this.ptr, ptr0, len0, lakara, prayoga, purusha, vacana, isLikeNone(pada) ? 2 : pada, isLikeNone(sanadi) ? 7 : sanadi, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * Wrapper for `Vyakarana::derive_subantas`.
    * @param {string} pratipadika
    * @param {number} linga
    * @param {number} vibhakti
    * @param {number} vacana
    * @returns {any}
    */
    deriveSubantas(pratipadika, linga, vibhakti, vacana) {
        const ptr0 = passStringToWasm0(pratipadika, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.vidyut_deriveSubantas(this.ptr, ptr0, len0, linga, vibhakti, vacana);
        return takeObject(ret);
    }
    /**
    * Wrapper for `Vyakarana::derive_krdantas`.
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
        const ret = wasm.vidyut_deriveKrdantas(this.ptr, ptr0, len0, krt, isLikeNone(sanadi) ? 7 : sanadi, ptr1, len1);
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
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
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
