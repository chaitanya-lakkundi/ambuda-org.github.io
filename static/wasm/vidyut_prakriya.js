
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
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

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
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

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
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
ac:0,"0":"ac",
/**
* -a
*/
aR:1,"1":"aR",
/**
* -at (jarat)
*/
atfn:2,"2":"atfn",
/**
* -ani
*/
ani:3,"3":"ani",
/**
* -anIya (gamanIya, BavanIya, ...)
*/
anIyar:4,"4":"anIyar",
/**
* -Alu
*/
Aluc:5,"5":"Aluc",
/**
* -Aru
*/
Aru:6,"6":"Aru",
/**
* -itra
*/
itra:7,"7":"itra",
/**
* -in
*/
ini:8,"8":"ini",
/**
* -izRu (alaMkarizRu, prajanizRu, ...)
*/
izRuc:9,"9":"izRuc",
/**
* -u (yuyutsu, Bikzu, ...)
*/
u:10,"10":"u",
/**
* -uka
*/
ukaY:11,"11":"ukaY",
/**
* -Uka
*/
Uka:12,"12":"Uka",
/**
* -Ana
*/
cAnaS:13,"13":"cAnaS",
/**
* -a
*/
ka:14,"14":"ka",
/**
* -Ana (cakrARa, ...)
*/
kAnac:15,"15":"kAnac",
/**
* -i (udaDi, ...)
*/
ki:16,"16":"ki",
/**
* -i
*/
kin:17,"17":"kin",
/**
* -ura (BaNgura, ...)
*/
kurac:18,"18":"kurac",
/**
* -ta (gata, bhUta, ...)
*/
kta:19,"19":"kta",
/**
* -tavat (gatavat, bhUtavat, ...)
*/
ktavatu:20,"20":"ktavatu",
/**
* -ti
*/
ktic:21,"21":"ktic",
/**
* -ti
*/
ktin:22,"22":"ktin",
/**
* -tri
*/
ktri:23,"23":"ktri",
/**
* -tvA (gatvA, bhUtva, ...)
*/
ktvA:24,"24":"ktvA",
/**
* -nu
*/
knu:25,"25":"knu",
/**
* -mara
*/
kmarac:26,"26":"kmarac",
/**
* -ya
*/
kyap:27,"27":"kyap",
/**
* -ru (BIru)
*/
kru:28,"28":"kru",
/**
* -ruka (BIruka)
*/
kruka:29,"29":"kruka",
/**
* -luka (BIluka)
*/
klukan:30,"30":"klukan",
/**
* -vara
*/
kvarap:31,"31":"kvarap",
/**
* -vas
*/
kvasu:32,"32":"kvasu",
/**
* -snu (glAsnu, jizRu, ...)
*/
ksnu:33,"33":"ksnu",
/**
* (empty suffix)
*/
kvin:34,"34":"kvin",
/**
* (empty suffix)
*/
kvip:35,"35":"kvip",
/**
* -a (Izatkara, duzkara, sukara, ...)
*/
Kal:36,"36":"Kal",
/**
* -a
*/
Ga:37,"37":"Ga",
/**
* -a
*/
GaY:38,"38":"GaY",
/**
* -in
*/
GinuR:39,"39":"GinuR",
/**
* -ura
*/
Gurac:40,"40":"Gurac",
/**
* -van
*/
Nvanip:41,"41":"Nvanip",
/**
* -a
*/
wak:42,"42":"wak",
/**
* -u
*/
qu:43,"43":"qu",
/**
* -a
*/
Ra:44,"44":"Ra",
/**
* -in
*/
Rini:45,"45":"Rini",
/**
* -ya
*/
Ryat:46,"46":"Ryat",
/**
* -ana
*/
Ryuw:47,"47":"Ryuw",
/**
* -aka
*/
Rvuc:48,"48":"Rvuc",
/**
* -aka
*/
Rvul:49,"49":"Rvul",
/**
* -tavya (gantavya, bhavitavya, ...)
*/
tavya:50,"50":"tavya",
/**
* -tavya
*/
tavyat:51,"51":"tavyat",
/**
* -tum (gantum, bhavitum, ...)
*/
tumun:52,"52":"tumun",
/**
* -tf (gantA, bhavitA, ...)
*/
tfc:53,"53":"tfc",
/**
* -tf
*/
tfn:54,"54":"tfn",
/**
* -Taka (gATaka)
*/
Takan:55,"55":"Takan",
/**
* -Tu (vepaTu). Allowed only for dhatus that are `qvit`.
*/
Tuc:56,"56":"Tuc",
/**
* -na
*/
naN:57,"57":"naN",
/**
* -naj
*/
najiN:58,"58":"najiN",
/**
* -na (svapna)
*/
nan:59,"59":"nan",
/**
* -a
*/
Sa:60,"60":"Sa",
/**
* -at (gacCat, Bavat, ...)
*/
Satf:61,"61":"Satf",
/**
* -Ana (laBamAna, sevamAna, ...)
*/
SAnac:62,"62":"SAnac",
/**
* -Ana
*/
SAnan:63,"63":"SAnan",
/**
* -ya
*/
yat:64,"64":"yat",
/**
* -ana
*/
yuc:65,"65":"yuc",
/**
* -na (namra, kampra, ...)
*/
ra:66,"66":"ra",
/**
* -ru
*/
ru:67,"67":"ru",
/**
* -ana
*/
lyu:68,"68":"lyu",
/**
* -ana
*/
lyuw:69,"69":"lyuw",
/**
* -vaca
*/
varac:70,"70":"varac",
/**
* -aka
*/
vuY:71,"71":"vuY",
/**
* -aka
*/
vun:72,"72":"vun",
/**
* -Aka
*/
zAkan:73,"73":"zAkan",
/**
* -tra
*/
zwran:74,"74":"zwran",
/**
* -aka
*/
zvun:75,"75":"zvun", });
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
    * @returns {any}
    */
    derive_tinantas(code, lakara, prayoga, purusha, vacana, pada, sanadi) {
        const ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.vidyut_derive_tinantas(this.ptr, ptr0, len0, lakara, prayoga, purusha, vacana, isLikeNone(pada) ? 2 : pada, isLikeNone(sanadi) ? 4 : sanadi);
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
    derive_subantas(pratipadika, linga, vacana, vibhakti) {
        const ptr0 = passStringToWasm0(pratipadika, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.vidyut_derive_subantas(this.ptr, ptr0, len0, linga, vacana, vibhakti);
        return takeObject(ret);
    }
    /**
    * Wrapper for `Ashtadhyayi::derive_krdantas`.
    *
    * TODO: how might we reduce the number of arguments here?
    * @param {string} code
    * @param {number} krt
    * @returns {any}
    */
    derive_krdantas(code, krt) {
        const ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.vidyut_derive_krdantas(this.ptr, ptr0, len0, krt);
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
    imports.wbg.__wbg_new_1d9a920c6bfc44a8 = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_0b9bfdd97583284e = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_a68214f35c417fa9 = function(arg0, arg1, arg2) {
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
    cachedInt32Memory0 = new Int32Array();
    cachedUint8Memory0 = new Uint8Array();


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
