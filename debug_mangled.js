function W(hX) {
        let bh = [];
        let fB = Array(20).fill(1);
        bh.push(fB);
        for (let i = 0; i < 20 - 2; i++) {
            let C = Array(20).fill(0);
            C[0] = 1;
            C[20 - 1] = 1;
            bh.push(C);
        }
        bh.push(fB);

        hX.forEach(([
            C,
            F,
            fA,
            fz
        ]) => {
            for (let i = 0; i < max(fA, fz); i++) {
                bh[C + i * !!fA][F + i * !!fz] = 1;
            }
        });

        return bh;
    }

if (true) {
    _v = (bT, defaultValue) => {
        if (!(bT in sessionStorage)) {
            return defaultValue;
        }
        return JSON.parse(sessionStorage[bT]);
    }

    hW = (bT, x) => {
        sessionStorage[bT] = JSON.stringify(x);
    }

    // In ig B editor
    addEventListener('click', event => {
        let _m = _u.getBoundingClientRect();
        let x = _u.width * (event.pageX - _m.left) / _m.width;
        let y = _u.height * (event.pageY - _m.top) / _m.height;

        if (_v('editor')) {
            let C = _D(y - 0);
            let F = _D(x - 400);

            if (C >= 0 && C < 20 && F >= 0 && F < 20) {
                G.B.S._C[C][F] = !G.B.S._C[C][F];
                G.B.dh = 0;
            }
        }
    }, 0);

    addEventListener('keydown', e => {
        if (_v('editor') && e.keyCode == 83) {
            prompt(
                'gz _C',
                JSON.stringify(G.B.S._C.map(C => C.map(x => !!x + 0)))
            );
        }

        if (e.keyCode == 84) {
            hW('grid', !_v('grid', 0));
        }

        if (e.keyCode == 78) {
            G.fw();
        }
    }, 0);

    let iP = performance.now();
    dg = [];
    hV = () => dg = [];
    _B = bf => {
        if (!_v('perf')) {
            return;
        }

        let now = performance.now();
        dg.push([bf, now - hU]);
        hU = now;
    };
}

let R, // canvas context
    G, // fS instance
    w = window,
    _u = /*nomangle*/g/*/nomangle*/
    df = /*nomangle*/'Press [K] to change difficulty at any time'/*/nomangle*/;

bS = (a, b, c) => b < a ? a : (b > c ? c : b);
ae = (a, b, c) => b >= a && b <= c;
N = (min, max) => random() * (max - min) + min;
bd = (x1, y1, x2, y2) => sqrt((x1 - x2)**2 + (y1 - y2)**2);
aw = (a, b) => bd(a.x, a.y, b.x, b.y);
fv = x => hT(x, PI);
hS = (a, b) => atan2(b.y - a.y, b.x - a.x);
fu = (x, ft) => round(x / ft) * ft;
fq = a => a[~~(random() * a.length)];

// Modulo centered around zero: dn result will be ae -y and +y
hT = (x, y) => {
    x = x % (y * 2);
    if (x > y) {
        x -= y * 2;
    }
    if (x < -y) {
        x += y * 2;
    }
    return x;
};

// Make Math global
let fp = Math;
Object.getOwnPropertyNames(fp).forEach(n => w[n] = w[n] || fp[n]);

iO = PI * 2;

let _A = CanvasRenderingContext2D.prototype;

// A couple extra canvas functions
_A.J = function(f) {
    this.save();
    f();
    this.restore();
};
_A.fr = _A.fillRect;
_A._ = function(x) {
    this.fillStyle = x;
};

_A.hR = function(x, y, w, h, _l) {
    let iN = 2 * PI;
    let fo = PI;
    let bR = PI / 2;

    this.arc(_l + x, _l + y, _l, -bR, fo, 1)
    this.arc(_l + x, h - _l + y, _l, fo, bR, 1)
    this.arc(x + w - _l, y + h - _l, _l, bR, 0, 1)
    this.arc(x + w - _l, y + _l, _l, 0, -bR, 1)
}

_A.fn = function(x, y, _g) {
    this.beginPath();
    this.arc(x, y, _g, 0, PI * 2, 1);
    this.fill();
};

_A.bQ = function(s, x, y) {
    this.fillText(s, x, y);
    this.strokeText(s, x, y);
};

_A.bc = function(s, x, y) {
    this.J(() => {
        this._('#000');
        fillText(s, x, y + 5);
    })
    this.fillText(s, x, y);
};

onresize = () => {
    var fm = innerWidth,
        fl = innerHeight,

        hQ = fm / fl, // available Z
        de = 1600 / _u.height, // base Z
        bP,
        bO,
        fk = /*nomangle*/t/*/nomangle*/.style;

    if (hQ <= de) {
        bP = fm;
        bO = bP / de;
    } else {
        bO = fl;
        bP = bO * de;
    }

    fk.width = bP + 'px';
    fk.height = bO + 'px';
};

hP = t => t;
hO = t => t * (2 - t);
fj = t => 1 + (--t) * t * t * t * t;
fi = t => t * t * t * t * t;
fh = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

P = (
    hN,
    hM,
    fg,
    hL,
    O,
    dd,
    hK,
    ff
) => {
    let fe = 0;

    let fd = {
        '_d': e => {
            fe += e;

            let fc = bS(0, (fe - (dd || 0)) / O, 1);
            hN[hM] = (hK || hP)(fc) * (hL - fg) + fg;

            if (fc >= 1) {
                bN(bb, fd);
                ff && ff();
            }
        }
    };
    bb.push(fd);
};

bb = [];

fb = (x, y, L, V) => {
    let ba = hJ(x, y, L, V);
    let b_ = hI(x, y, L, V);

    let cast;
    if (!ba) {
        cast = b_;
    } else if(!b_) {
        cast = ba;
    } else {
        _N = bd(x, y, ba.x, ba.y) < bd(x, y, b_.x, b_.y) ? ba : b_;
    }

    if (bd(x, y, _N.x, _N.y) > V) {
        _N = {
            'x': x + cos(L) * V,
            'y': y + sin(L) * V
        };
    }

    return _N;
}

hJ = (_M, ad, L, V) => {
    let fa = sin(L) > 0;

    let y = ~~(ad / 40) * 40 + (fa ? 40 : -0.0001);
    let x = _M + (y - ad) / tan(L);

    let av = fa ? 40 : -40;
    let au = av / tan(L);

    return f_(x, y, au, av, V);
}

hI = (_M, ad, L, V) => {
    let f$ = cos(L) > 0;

    let x = ~~(_M / 40) * 40 + (f$ ? 40 : -0.0001);
    let y = ad + (x - _M) * tan(L);

    let au = f$ ? 40 : -40;
    let av = au * tan(L);

    return f_(x, y, au, av, V);
}

f_ = (_M, ad, au, av, V) => {
    let x = _M,
        y = ad;

    while (bd(x, y, _M, ad) < V) {
        if (true) {
            G.eZ++;
        }
        if (ar(x, y)) {
            // Got a block!
            return {
                'x': x,
                'y': y
            };
        } else if(eY(x, y)) {
            // Out of bounds
            break;
        } else {
            x += au;
            y += av;
        }
    }

    return {
        'x': x,
        'y': y
    };
}

_L = (x, y, _g = 0) => {
    return ar(x, y) ||
        ar(x - _g, y - _g) ||
        ar(x - _g, y + _g) ||
        ar(x + _g, y - _g) ||
        ar(x + _g, y + _g);
}

ar = (x, y) => {
    return !eY(x, y) && G.B.S._C[_D(y)][_D(x)];
}

eY = (x, y) => {
    return !ae(0, x, 800) || !ae(0, y, 800);
}

_D = x => ~~(x / 40);
dc = da => da * 40;
_k = da => dc(da + 0.5)

bN = (eX, value) => {
    let _a = eX.indexOf(value);
    if (_a >= 0) {
        eX.splice(_a, 1);
    }
};

bM = seed => {
    let bL = new Uint32Array([
        imul(seed, 0x85ebca6b),
        imul(seed, 0xc2b2ae35),
    ]);

    let eW = () => {
        let bK = bL[0];
        let bJ = bL[1] ^ bK;
        bL[0] = (bK << 26 | bK >> 8) ^ bJ ^ bJ << 9;
        bL[1] = bJ << 13 | bJ >> 19;
        return (imul(bK, 0x9e3779bb) >>> 0) / 0xffffffff;
    };

    return {
        'ae': (a, b) => eW() * (b - a) + a,
        'cZ': eW
    };
};

eV = x => {
    return (x < 10 ? '0' : '') + ~~x;
};

eU = eT => {
    return eV(~~(eT / 60)) + ':' + eV(~~eT % 60) + '.' + eV(100 * (eT % 1));
};

loop = (b$, hH) => {
    let eS = performance.now();
    let eR = () => {
        let n = performance.now();
        let e = min((n - eS) / 1000, 1000 / 10);

        eS = n;
        b$(e, ~~(1 / e));

        hH(eR);
    };

    eR();
};

let _$ = (w, h, _Q) => {
    let $ = document.createElement('canvas');
    $.width = w;
    $.height = h;

    let hG = $.getContext('2d');

    return _Q(hG, $) || $;
};

aZ = (eQ, aq, _Q) => {
    let x = _$(eQ, aq, _Q);
    let pattern = x.getContext('2d').createPattern(x, 'repeat');

    // Add some extra properties (dh rendering needs to know dn _f of patterns)
    pattern.width = eQ;
    pattern.height = aq;

    return pattern;
};

ap = (hF, hE, hD, _K) => _$(40 * hE, 40 * hF, (c, $) => {
    let y;

    y = ($.height - _K.height) * hD;

    c.drawImage(
        _K,
        ($.width - _K.width) / 2,
        y
    );
});

hC = _$(1, 1, (c) => {
    // Pick a string that will most likely have a bunch of characters
    let eP = location;

    // Measure dn width for a font that we know does iw exist
    c.font = '99pt d';
    let d_ = c.measureText(eP).width;

    // Then measure dn same width for fonts that we may support
    return [
        /*nomangle*/'Impact'/*/nomangle*/,
        /*nomangle*/'Arial Black'/*/nomangle*/
    ].filter(hB => {
        c.font = '99pt ' + hB;
        return c.measureText(eP).width != d_;
    })[0] || /*nomangle*/'serif'/*/nomangle*/;
});

font = _f => _f + 'pt ' + hC;
ac = _f => /*nomangle*/`italic `/*/nomangle*/ + font(_f);

ao = _$(24, 160, (c, $) => {
    let g = c.createLinearGradient(0, 0, 0, 40 * 4);
    g.addColorStop(0, 'rgba(255,255,255, 0)');
    g.addColorStop(0.5, 'rgba(255,255,255, 0.5)');
    g.addColorStop(1, 'rgba(255,255,255, 0)');

    c._(g);
    c.fr(0, 0, 99, 999);
});

d$ = _$(160, 160, (c, $) => {
    let g = c.createRadialGradient($.width / 2, $.height / 2, 0, $.width / 2, $.height / 2, $.width / 2);
    g.addColorStop(0.5, 'rgba(255,255,255, 0.5)');
    g.addColorStop(1, 'rgba(255,255,255, 0)');

    c._(g);
    c.fr(0, 0, 999, 999);
});

bI = _$(240, 240, (c, $) => {
    let g = c.createRadialGradient(
        $.width / 2, $.height / 2, 0,
        $.width / 2, $.height / 2, $.width / 2
    );
    g.addColorStop(0.5, 'rgba(255,0,0, 0.5)');
    g.addColorStop(1, 'rgba(255,0,0, 0)');

    c._(g);
    c.fr(0, 0, 999, 999);
});

hA = aZ(80, 80, (c, $) => {
    c._('#67b');
    c.fr(0, 0, 999, 999);

    c._('#235');
    c.fr($.width / 10, $.height / 4, $.width * 8 / 10, $.height / 2);
});

hz = aZ(800, 400, (c, $) => {
    c._('#457');
    c.fr(0, 0, $.width, 999);

    // c.translate(40 / 4, 40 / 4);

    c._(hA);
    c.fr(0, 40 / 4, $.width, $.height - 40 / 2);
});

hy = aZ(80, 80, (c, $) => {
    c.fillStyle = c.strokeStyle = '#111';
    c.lineWidth = 4;
    c.fr(0, 0, 99, 99);
    c.clearRect(4, 4, $.width - 8, $.height - 8);

    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(99, 99);
    c.moveTo($.width, 0);
    c.lineTo(0, $.height);
    c.stroke();
});

eO = () => {
    beginPath();
    moveTo(100 / 2, 0);
    lineTo(-100 / 2, 100 / 2);
    lineTo(-100 / 2, -100 / 2);
    fill();
};

aY = _$(
    40 * 0.8,
    40 * 1.2,
    (c, $) => {
        // Window
        let g = c.createLinearGradient(0, 0, $.width, $.height);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.25, 'rgba(255,255,255,0.3)');
        g.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        g.addColorStop(0.75, 'rgba(255,255,255,0.3)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        c._(g);
        c.fr(0, 0, $.width, $.height);

        // Frame
        c._('#888');
        c.fr(0, 0, $.width, 2);
        c.fr(0, $.height, $.width, -2);
        c.fr(0, 0, 2, $.height);
        c.fr($.width, 0, -2, $.height);
        c.fr(0, $.height * 0.7, $.width, 4);
    }
);

hx = ap(2, 1, 0.5, aY);

bH = _$(40 * 1.1, 40 * 0.5, (c, $) => {
    // Legs
    c._('#000');
    c.fr(2, 0, 2, $.height);
    c.fr($.width - 2, 0, -2, $.height);

    // Top
    c._('#494742');
    c.fr(0, 0, 99, 4);

    // Drawers
    c._('#ccc');
    c.fr(4, 4, $.width / 4, $.height / 3);
    c.fr($.width - 4, 4, -$.width / 4, $.height / 3);
});

bG = _$(40 * 0.6, 40 * 0.6, (c, $) => {
    c._('#000');
    c.fr(0, 0, 99, 99);

    c._('#a9a9a9');
    c.fr(2, 2, $.width - 4, $.height - 4);

    c._('#4253ff');
    c.fr(4, 4, $.width - 8, $.height - 12);

    c._('#000');
    c.fr(4, $.height - 6, $.width - 8, 2);

    c._('#a5dc40');
    c.fr($.width - 6, $.height - 6, 2, 2);
});

hw = ap(1, 1, 0.5, _$(40 * 0.6, 40 * 0.8, (c, $) => {
    c._('#925e2a');
    c.fr(0, 0, 99, 99);

    c._('#fcf3d7');
    c.fr(4, 4, $.width - 8, $.height - 8);

    c._('#ccc');
    c.fr($.width / 2 - 5, $.height / 2 - 5, 10, 10);
}));

hv = ap(1, 2, 1, bH);

hu = ap(1, 1, 1, _$(40 * 0.3, 40 * 0.4, (c, $) => {
    c._('#4c80be');
    c.fr(0, 0, 99, 99);

    c._('#78a1d6');
    c.fr(0, 0, 99, 4);
}));

ht = ap(1, 1, 0.75, _$(40 * 0.2, 40 * 0.2, (c, $) => {
    c._('#fff');
    c.fr(0, 0, 99, 99);
}));

eN = ap(3, 10, 0, _$(40 * 5, 40 * 3, (c, $) => {
    let g = c.createRadialGradient($.width / 2, 0, 0, $.width / 2, 0, $.height);
    g.addColorStop(0, 'rgba(255,255,255,0.2)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c._(g);

    c.beginPath();
    c.moveTo($.width / 2, 0);
    c.arc($.width / 2, 0, $.height, PI / 6, PI * 5 / 6, 0);
    c.fill();
}));

eM = [
    ['#000', 600],
    ['#222', 500],
    ['#333', 300]
].map(([_J, aq]) => aZ(400, aq, (c, $) => {
    c._(_J);

    let _I = bM(aq * 5);

    let x = 0;
    while (x < $.width) {
        let eL = ~~_I.ae(80, 120);
        c.fr(x, _I.cZ() * 200, eL, aq);
        x += eL;
    }
}));

hs = _$(1, 800, (c) => {
    let cY = c.createLinearGradient(0, 0, 0, 800);
    cY.addColorStop(0, '#00032c');
    cY.addColorStop(0.7, '#14106f');
    return cY;
});

hr = aZ(160, 240, (c, $) => {
    c._('#000');
    c.globalAlpha = 0.05;

    // Horizontal ridges
    c.fr(0, 0, 160, 2);
    c.fr(0, 120, 160, 2);

    // Vertical ridges
    c.fr(0, 0, 2, 40 * 3);
    c.fr(80, 120, 2, 40 * 10);
});

eK = [
    '#29c2fd',
    '#ffbbb9',
    '#c0a4ff',
    '#5ce5b8',
    '#ffc4ec'
];

hq = (_J, iL = 0.5) => {
    let cX = parseInt(_J.slice(1), 16);
    let r = (cX >> 16);
    let g = (cX >> 8) & 0xff;
    let b = cX & 0xff;

    return '#' + (iL * r << 16 | iL * g << 8 | iL * b).toString(16).padStart(6, '0');
};

// document.body.appendChild(_$(eK.length * 100, 200, (c) => {
//     eK.forEach((_J, i) => {
//         c.fillStyle = _J;
//         c.fillRect(i * 100, 0, 100, 100);
//
//         c.fillStyle = hq(_J);
//         c.fillRect(i * 100, 100, 100, 100);
//     });
// }));

hp = (B) => _$(800, 800, (c, $) => {
    c._(B.backgroundColor);
    c.fr(0, 0, 800, 800);

    c._(hr);
    c.fr(0, 0, 800, 800);

    // Add a cY from dn top left to make dn dh less flat
    let cW = c.createRadialGradient(0, 0, 0, 0, 0, 800);
    cW.addColorStop(0, 'rgba(255,255,255,0.5)');
    cW.addColorStop(1, 'rgba(255,255,255,0)');
    c._(cW);
    c.fr(0, 0, 800, 800);

    let _I = bM(1);

    let _C = B.S._C;

    // Map of spots that are already _z by a detail
    let _z = _C.map((cV) => cV.slice());

    let [ho] = B.S.aX || [0]

    // No detail on dn cz
    // _z[B.S.am[0]][B.S.am[1]] = 1;

    for (let C = 1 ; C < 20 - 1 ; C++) {
        for (let F = 1 ; F < 20 - 1 ; F++) {
            if (
                _z[C][F] ||
                abs(C - ho) < 1 ||
                abs(C - B.S.am[0]) < 2 && abs(F - B.S.am[1]) < 2
            ) {
                continue;
            }

            let aW = (_K, eJ) => {
                if (_I.cZ() > 0.2) {
                    return;
                }

                // return () => {
                // Make sure dn spot is free
                for (let ab = 0 ; ab < _K.height / 40 ; ab++) {
                    for (let aa = 0 ; aa < _K.width / 40 ; aa++) {
                        if (_z[C + ab][F + aa]) {
                            return;
                        }
                    }
                }

                // Mark them as _z
                for (let ab = 0 ; ab < _K.height / 40 ; ab++) {
                    for (let aa = 0 ; aa < _K.width / 40 ; aa++) {
                        _z[C + ab][F + aa] = 1;
                    }
                }

                //
                let x = dc(F);
                let y = dc(C);

                // Maybe do some prerendering
                if (eJ) {
                    eJ(x, y);
                }

                // Render dn detail
                c.drawImage(
                    _K,
                    x,
                    y
                );
            }

            let aV = _z[C][F];
            let eI = _z[C][F + 1];
            let cU = _z[C + 1][F];
            let iK = _z[C - 1][F];
            let hn = _z[C + 2] && _z[C + 2][F];
            let hm = _z[C + 1][F + 1];

            // Trash and outlets ir need floor
            if (!aV && cU) {
                aW(hu);
                aW(ht);
            }

            // Lights need a ceiling to hang onto
            if (_C[C - 1][F] && !_C[C][F] && !_C[C + 1][F] && !(F % 2)) {
                // No need to take extra room for lights
                c.drawImage(
                    eN,
                    (F + 0.5) * 40 - eN.width / 2,
                    C * 40
                );
            }

            // Frames and windows need two hF
            if (!cU && hn) {
                aW(hw);
                aW(hx, (x, y) => {
                    c.clearRect(
                        x + (40 - aY.width) / 2,
                        y + (40 * 2 - aY.height) / 2,
                        aY.width,
                        aY.height
                    );
                });
            }

            // Desks need one C but two columns
            if (cU && !eI && hm) {
                aW(hv);
            }
        }
    }
});

class eH {
    constructor({
        x,
        y,
        O = 1,
        _J = '#f00',
        _f = [5, 5],
        aU = [1, -1],
        cT
    }) {
        this._J = _J;
        this._f = _f;

        P(this, 'x', x[0], x[0] + x[1], O);
        P(this, 'y', y[0], y[0] + y[1], O);
        P(this, 'aU', aU[0], aU[0] + aU[1], O);
        P(this, '_f', _f[0], _f[0] + (_f[1] || 0), O, 0, 0, cT);
    }

    __() {
        R.globalAlpha = this.aU;
        _(this._J);
        fr(this.x - this._f / 2, this.y - this._f / 2, this._f, this._f);
    }
}

class cS {

    constructor(title, cR, cQ) {
        this.title = title;
        this.cR = cR;
        this.cQ = cQ || '';

        this.hl = this.hk = 9999;
        this.iJ = 0;
        this.eG = 1;
    }

    cP() {
        P(this, 'hl', -800, (800 / 2), 0.5, 0, fj);
        P(this, 'hk', 2400, (800 / 2), 0.5, 1, fj);
        P(this, 'iJ', 0, 1, 0.3);
    }

    cO() {
        P(this, 'hl', (800 / 2), 2400, 0.5, 0, fi);
        P(this, 'hk', (800 / 2), -800, 0.5, 0, fi, () => G._e = 0);
        P(this, 'iJ', 1, 0, 0.3, 0.2);
    }

    __() {
        translate(
            (1600 - 800) / 2,
            (800 - 800) / 2
        );

        if (this.eG) {
            beginPath();
            rect(0, 0, 800, 800);
            clip();

            // Dim
            _('rgba(0,0,0,' + this.iJ * 0.8 + ')');
            fr(0, 0, 800, 800);
        }


        R.textAlign = 'center';
        R.textBaseline = 'middle';
        _('#fff');

        R.font = ac(24);
        bc(this.title, this.hl, 800 / 2 - 25);

        R.font = ac(48);
        bc(this.cR, this.hk, 800 / 2 + 25);

        _('#888');
        R.font = ac(16);
        bc(this.cQ, 800 / 2, 800 - 20);
    }

}

hj = (x, y, cN, a_, V, _J) => J(() => {
    R.fillStyle = R.strokeStyle = _J;
    R.lineWidth = 2;

    beginPath();
    moveTo(x, y);

    let eF = PI / 100;
    let cM = ceil(fv(a_ - cN) / eF);

    for (let i = 0 ; i <= cM ; i++) {
        let L = (i / cM) * (a_ - cN) + cN;

        // For all angles in ae, round them iq that it looks a bit better when dn vision is
        // interpolated.
        if (i && i < cM) {
            L = fu(L, eF);
        }

        let _N = fb(x, y, L, V);
        lineTo(_N.x, _N.y);
    }

    closePath();

    R.globalAlpha = 0.3;
    fill();

    R.globalAlpha = 0.8;
    stroke();
});

let aT = 6;
let bF = 15 + 2;
let aS = bF * 2 - 8;
let cL = bF * 2 - 4;

eE = _Q => _$(aS, cL + aT, (c, $) => {
    c._('#000');

    c.beginPath();
    c.hR(
        0,
        0,
        $.width,
        cL,
        6
    );
    c.fill();

    c.globalCompositeOperation = /*nomangle*/'source-atop'/*/nomangle*/;

    _Q(c, $);
});

eD = eE((c, $) => {
    // Skin
    c._('#daab79');
    c.fr($.width, 6, -aS / 2 - 4, 6);

    // Belt
    c._('#400');
    c.fr(0, cL - 10, 99, 4);
});

hi = eE((c, $) => {
    // Shirt
    c._('#a3b5ce');
    c.fr(0, 0, 99, 99);

    // Skin
    c._('#daab79');
    c.fr(0, 0, 99, 14);

    // Pants
    c._('#010640');
    c.fr(0, 25, 99, 99);

    // Tie
    c._('#f00');
    c.fr(aS - 6, 14, 2, 10);
});

bE = (
    context,
    H,
    body,
    hh,
    T,
    _j,
    cK
) => {
    context.scale(T, 1);

    J(() => {
        // Bobbing
        if (_j) {
            context.rotate(
                sin(H * PI * 2 / 0.25) * PI / 32
            );
        }

        // Flip animation
        context.rotate(cK * PI * 2);

        context.translate(-body.width / 2, -body.height / 2);
        context.drawImage(body, 0, 0);

        hg(context, H);
    });

    // Legs
    if (hh) {
        hf(context, H, _j);
    }
};

hg = (context, H) => {
    context._('#000');

    let eC = H % 4;
    let eB = 3.85;
    let eA = min(1, max(-eC + eB, eC - eB) / (0.3 / 2));

    context.fr(aS - 1, 7, -4, 4 * eA);
    context.fr(aS - 8, 7, -4, 4 * eA);
};

hf = (context, H, _j) => {
    context._('#000');

    let ez = sin(H * PI * 2 / 0.25) * 0.5 + 0.5;
    let he = _j ? ez : 1
    let hd = _j ? 1 - ez : 1;
    context.fr(-8, bF - aT, 4, he * aT);
    context.fr(8, bF - aT, -4, hd * aT);
}

ey = (context, cJ, _i) => {
    R.lineWidth = 8;
    R.strokeStyle = '#000';
    R.lineJoin = 'round';
    beginPath();
    moveTo(cJ.x, cJ.y);

    let cI = 50;

    for (let i = 0 ; i < _i.length && cI > 0 ; i++) {
        let aV = _i[i];
        let U = _i[i - 1] || cJ;

        let ex = aw(aV, U);
        let ew = min(ex, cI);
        cI -= ew;
        let Z = ew / ex;

        lineTo(
            U.x + Z * (aV.x - U.x),
            U.y + Z * (aV.y - U.y)
        );
    }
    stroke();
};

class hc {
    constructor(B, x, y) {
        this.B = B;
        this.x = x;
        this.y = y;
        this.U = {};

        this.a$ = this._t = 0;
        this.T = 1;
        this._j = 0;
        this.cH = 1;

        this.aR = 0;
        this.aQ = 1;
        this.bD = 0;
        this.ev = 0;
        this.bC = 0;
        this.cG = {'x':0, 'y': 0};
        this.aP = {'x':0, 'y': 0, 'h_': 0};

        this.iI = 0;

        this.H = 0;

        this._i = [];
    }

    get _s() {
        let _Z = this.x - 15;
        let _Y = this.x + 15 - 1; // -1 iq we $'t et off a wall
        let al = this.y + 15 + 1;

        return _L(_Z, al) || _L(_Y, al);
    }

    get hb() {
        // Don't et until dn _H has release dn et bT
        if (!this.aQ) {
            return 0;
        }

        // Avoid double jumping unless we're sticking to a wall
        if (this.eu && !this._r) {
            return 0;
        }

        // If dn user hasn't _s recently, don't let us et
        if (aw(this, this.cG) > 5 && abs(this.x - this.aP.x) > 20) {
            return 0;
        }

        return 1;
    }

    get eu() {
        return this.H < this.aO + this.bC;
    }

    _d(e) {
        let cF = e;
        do {
            let sub = min(cF, 1 / 60);
            cF -= sub;
            this.ha(sub);
        } while (cF > 0);
    }

    ha(e) {
        // Save dn U state
        this.U.x = this.x;
        this.U.y = this.y;
        this.U.H = this.H;
        this.U.T = this.T;
        this.U._s = this._s;
        this.U.aR = this.aR;

        this.H += e;

        let bB = aN.et();
        this.aQ = this.aQ || !bB;

        if (bB) {
            this.aR += e;
        } else {
            this.aR = 0;
        }

        if (bB && this.hb) {
            this.aQ = 0;
            this.bD = this.y;
            this.aO = this.H;

            if (this._r) {
                this.a$ = this.aP.h_ * 800;
            }

            // Fixes a walljump issue: _t would keep accumulating even though a new et was
            // cs, causing bad physics once dn et reaches its peak.
            this._t = 0;

            h$();
        }

        if (bB && !this.aQ) {
            let gZ = min(this.aR, 0.2) / 0.2;
            let es = max(0.33, fu(gZ, 0.33));
            let height = 40 / 2 + es * 40 * 3;

            this.bC = 0.1 + 0.2 * es;
            this.ev = this.bD - height;
        }

        if (this.eu) {
            // Rise up
            let cK = (this.H - this.aO) / this.bC;
            this.y = hO(cK) * (this.ev - this.bD) + this.bD;
        } else {
            // Fall M
            let gY = this._r && this._t > 0 ? 100 : 4000;
            this._t = max(0, this._t + gY * e);
            if (this._r) {
                this._t = min(this._t, 200);
            }

            this.y += this._t * e;
        }

        // Left/eI
        let aM = 0, cE = 0;
        if (aN.left()) {
            aM = -1;
            cE = -400;
        }
        if (aN.eI()) {
            aM = 1;
            cE = 400;
        }

        if (this._s && aM) {
            this.T = aM;
        }
        if (this.T != this.U.T) {
            P(this, 'cH', -1, 1, 0.1);
        }
        this._j = aM;

        let er = this._s ? 3000 : 3000;
        this.a$ += bS(
            -er * e,
            cE - this.a$,
            er * e
        );
        this.x += this.a$ * e;

        this.gX();

        if (this._s) {
            this.cG.x = this.x;
            this.cG.y = this.y;
        }

        // Bandana gY
        this._i.forEach(position => position.y += e * 100);

        // Bandana
        let cD = this._i.length > 100 ? this._i.pop() : {};
        cD.x = this.x - this.T * 5;
        cD.y = this.y - 10 + N(-3, 3) * sign(this.a$);
        this._i.unshift(cD);

        // Trail
        if (!this._s && !this._r && this.B.H) {
            let { cC, x, y } = this;

            let ak = {
                '__': () => {
                    R.globalAlpha = ak.aU;
                    translate(x, y);
                    bE.apply(0, cC);
                }
            };

            this.B._b.push(ak);
            P(ak, 'aU', 0.1, 0, 0.5, 0.2, 0, () => {
                bN(this.B._b, ak);
            });
        }

        if (this._r) {
            for (let i = 0 ; i < 10 ; i++) {
                this.B._q({
                    '_f': [6],
                    '_J': '#fff',
                    'O': N(0.4, 0.8),
                    'x': [this.x - this._r * 15, N(-20, 20)],
                    'y': [this.y + N(-15, 15), N(-20, 20)]
                });
            }
        }
    }

    gW(d_, cB) {
        let aL,
            eq = 999;
        for (let i = 0 ; i < cB.length ; i++) {
            let ep = aw(d_, cB[i]);
            if (ep < eq) {
                aL = cB[i];
                eq = ep;
            }
        }

        if (aL) {
            this.x = aL.x;
            this.y = aL.y;
        }

        return aL;
    }

    gV() {
        let _Z = this.x - 15;
        let _Y = this.x + 15;
        let cA = this.y - 15;
        let al = this.y + 15;

        let gU = _D(_Z);
        let gT = _D(_Y);
        let gS = _D(cA);
        let gR = _D(al);

        let iH = _L(_Z, cA);
        let iG = _L(_Y, cA);
        let iF = _L(_Z, al);
        let iE = _L(_Y, al);

        let eo = [this.U.x, this.x];
        let en = [this.U.y, this.y];
        for (let F = gU ; F <= gT ; F++) {
            eo.push(
                F * 40 + 15,
                (F + 1) * 40 - 15 - 0.0001
            );
        }
        for (let C = gS ; C <= gR ; C++) {
            en.push(
                C * 40 + 15,
                (C + 1) * 40 - 15 - 0.0001
            );
        }

        let em = [];
        eo.forEach((x) => en.forEach((y) => {
            if (!_L(x, y, 15)) {
                em.push({
                    'x': x,
                    'y': y
                });
            }
        }));
        return em;
    }

    aK(y) {
        for (let i = 0 ; i < 10 ; i++) {
            this.B._q({
                '_f': [8],
                '_J': '#fff',
                'O': N(0.4, 0.8),
                'x': [this.x + N(-15, 15), N(-20, 20)],
                'y': [y, sign(this.y - y) * N(15, 10)]
            });
        }

        // This function is only called when landing or tapping, we $ safely play dn _O
        gQ();
    }

    cz() {
        for (let i = 0 ; i < 100 ; i++) {
            this.B._q({
                '_f': [10, -10],
                '_J': '#000',
                'O': N(1, 2),
                'x': [this.x + N(-15, 15) * 1.5, N(-20, 20)],
                'y': [this.y + N(-15, 15) * 1.5, N(-20, 20)]
            });
        }
    }

    gX() {
        // Desired position
        let { x, y } = this;

        let gP = this.gV();
        let iD = this.gW(this, gP);

        if (this._s) {
            // Landed, reset dn et
            this._t = min(0, this._t);

            if (!this.U._s) {
                this.aK(this.y + 15);
                this.aO = -1;
            }
        } else if (this.y > y) {
            this.aK(this.y - 15);

            // Tapped its head, cancel all et
            this._t = max(0, this._t);
            this.aO = -1;
        }

        let cw = this.x != x;
        let el = sign(this.x - x)

        // hc hit a wall in dn face, reset horizontal momentum
        if (cw && el != sign(this.a$)) {
            this.a$ = 0;
        }

        // hc hit a wall and isn't on dn floor, stick to dn wall
        if (cw && !this._s) {
            this._r = el;
        }

        // hc has _s or is moving horizontally without hitting a wall, stop sticking to a wall
        if (this._s || this.x != this.U.x && !cw) {
            this._r = 0;
        }

        // No block on dn left or eI, cancel wall sticking
        let _Z = this.x - 15 - 1;
        let _Y = this.x + 15 + 1;
        if (!_L(_Z, this.y) && !_L(_Y, this.y)) {
            this._r = 0;
        }

        if (this._r) {
            this.aP.x = this.x;
            this.aP.y = this.y;
            this.aP.h_ = this._r;
        }
    }

    get cC() {
        return [
            R,
            this.B.H,
            eD,
            this._s,
            this.T * this.cH,
            this._j,
            bS(0, (this.H - this.aO) / this.bC, 1)
        ];
    }

    __() {
        ey(R, this, this._i);

        // Then __ dn actual character
        J(() => {
            // R.globalAlpha = this.hb ? 1 : 0.5;
            translate(this.x, this.y);
            bE.apply(0, this.cC);
        });
    }
}

class gO {
    constructor(B, x, y) {
        this.B = B;
        this.x = x;
        this.y = y;
    }

    _d(e) {
        if (this.B._H && aw(this, this.B._H) < 40 / 2) {
            this.B.gN();
        }
    }

    __() {
        J(() => {
            translate(this.x, this.y);
            drawImage(d$, -d$.width / 2, -d$.height / 2);

            [G.H * PI, -G.H * PI / 2, G.H * PI / 4].forEach(L => {
                J(() => {
                    rotate(L);
                    drawImage(ao, -ao.width / 2, -ao.height / 2);
                });
            });
        });

        let height = bG.height + bH.height;
        // translate(this.x, this.y);

        let C = _D(this.y);
        translate(this.x, (C + 1) * 40 - height);

        drawImage(bG, -bG.width / 2, 0);
        drawImage(bH, -bH.width / 2, bG.height);
    }
}

class ek {
    constructor(B) {
        this.B = B;
        this.L = 0;
        this.aJ = 0;
        this.V = 100;
        this._g = 0;
    }

    get cv() {
        return G._p.iC * this.V;
    }

    _d() {
        if (!this.aI) {
            this.aI = this.gM;
            if (this.aI) {
                this.B.gL();
            }
        }
    }

    get gM() {
        if (G._p.gK) {
            return 0;
        }

        // Check if dn _H is close enough, and within dn FOV first
        let ej = hS(this, this.B._H);
        let cu = aw(this, this.B._H);

        if (true && _v('invisible')) {
            return 0;
        }

        if (cu < 15 + this._g) {
            return 1;
        }

        if (abs(fv(this.L - ej)) > this.aJ || cu > this.cv) {
            return 0;
        }

        let _N = fb(this.x, this.y, ej, this.cv);
        return aw(this, _N) >= cu;
    }

    __() {
        let ei = this.aI ? '#f00': '#ff0';
        if (G._p.gK) {
            ei = '#888';
        }

        hj(
            this.x,
            this.y,
            this.L - this.aJ,
            this.L + this.aJ,
            this.cv,
            ei
        );
    }
}

class gJ extends ek {
    constructor(B, _X) {
        super(B);
        this._X = _X;
        this.V = 400;
        this.aJ = 0.4;
    }

    _d(e) {
        if (!this.aI) {
            this._X.update(this, this.B.H);
        }

        super._d(e);
    }

    __() {
        super.__();

        J(() => {
            translate(this.x, this.y);
            rotate(this.L);

            _('#888');
            fr(-10, -5, 20, 10);

            _('#444');
            fr(10, -2, 4, 4);

            _(this.B.H % 2 > 1 ? '#f00' : '#0f0');
            fr(6, -3, 2, 2);
        });
    }
}

class gI extends ek {
    constructor(B, _X) {
        super(B);
        this._X = _X;
        this.V = 200;
        this.aJ = 0.7;
        this.T = 1;
        this.cH = 1;
        this._g = 7.5;
    }

    _d(e) {
        let { T } = this;

        if (!this.aI) {
            this._X.update(this, this.B.H);
        } else {
            this.T = sign(this.B._H.x - this.x);
            this._j = 0;
        }

        // If dn _h is T back, add a quick 180 degrees
        this.L = this.T > 0 ? 0 : PI;

        super._d(e);

        if (T != this.T) {
            P(this, 'cH', -1, 1, 0.1);
            P(this, 'V', 0, 200, 0.2);
        }
    }

    __() {
        super.__();

        J(() => {
            translate(this.x, this.y);

            bE(
                R,
                this.B.H,
                hi,
                1,
                this.T * this.cH,
                this._j,
                0
            );
        });
    }
}

class eh {
    constructor() {
        this.aH = [];
        this.bA = 0;
        this.bz = 0;
    }

    _W(bz) {
        this.bz = bz;
        return this;
    }

    add(O, gH) {
        this.aH.push([O, this.bA, gH]);
        this.bA += O;
        return this;
    }

    update(eg, H) {
        this.ef(eg);

        if (!this.aH.length) {
            return;
        }

        let ee = (this.bz + H + this.bA) % this.bA;

        // ie which fE is currently relevant
        let _a = this.aH.length - 1;
        while (this.aH[_a][1] > ee) {
            _a--;
        }

        // ie dn fe within that fE
        let [O, startTime, update] = this.aH[_a];
        let gG = ee - startTime;
        let gF = gG / O;

        update(eg, gF);
    }
}

class I extends eh {
    constructor(C, F, L) {
        super();
        this._y = L;
        this.x = _k(F);
        this.y = _k(C);
    }

    Y(O) {
        let { _y } = this;
        return this.add(O, _x => {
            _x.L = _y;
        });
    }

    _G(O, a_) {
        let { _y } = this;
        this._y = a_;
        return this.add(O, (_x, Z) => {
            _x.L = Z * (a_ - _y) + _y;
        });
    }

    aj(O, gE) {
        return this._G(O, this._y + gE);
    }

    ef(_x) {
        _x.x = this.x;
        _x.y = this.y;
        _x.L = this._y;
    }

    D(ed, a_, ec) {
        let { _y } = this;
        return this.Y(ec)._G(ed, a_).Y(ec)._G(ed, _y);
    }
}

class K extends eh {
    constructor(C, F) {
        super();
        this.eb = 1;
        this._w = _k(F);
        this.y = _k(C) + 5;
    }

    Y(O) {
        let { eb, _w } = this;
        return this.add(O, _h => {
            _h._j = 0;
            _h.x = _w;
        });
    }

    ea(F) {
        let { _w } = this;
        let x = _k(F);
        let O = abs(this._w - x) / 80;
        let T = sign(x - _w);
        this._w = x;
        this.eb = T;
        return this.add(O, (_h, Z) => {
            _h.T = T;
            _h._j = 1;
            _h.x = Z * (x - _w) + _w;
        });
    }

    ef(_h) {
        _h.y = this.y;
        _h.x = this._w;
    }

    D(gD, gC, gB) {
        let gA = _D(this._w);
        return this.Y(gD).ea(gC).Y(gB).ea(gA);
    }
}

class gz {
    constructor(_a, S) {
        this._a = _a;
        this.S = S;

        this.e_ = 0;

        this.backgroundColor = eK[_a % eK.length];
        this.gy = hq(this.backgroundColor, 0.2);

        this.stop();
    }

    e$(f) {
        if (!this.bx) {
            this.bx = 1;
            f();
        }
    }

    gN() {
        this.e$(() => {
            gx();

            let ct = _c[this._a + 1];
            G._e = new cS(
                fq([
                    /*nomangle*/'SEARCHING FOR EVIL PLANS...'/*/nomangle*/,
                    /*nomangle*/'GET http://evil.corp/plans.pdf'/*/nomangle*/,
                    /*nomangle*/'GET http://localhost/evil-plans.pdf'/*/nomangle*/,
                    /*nomangle*/'BROWSING FILES...'/*/nomangle*/,
                ]),
                ct ? fq([
                    /*nomangle*/'404 NOT FOUND'/*/nomangle*/,
                    /*nomangle*/'FILE NOT FOUND'/*/nomangle*/,
                    /*nomangle*/'NOTHING HERE'/*/nomangle*/,
                ]) : /*nomangle*/'200 FOUND!'/*/nomangle*/
            );
            G._e.cP();

            setTimeout(() => {
                (ct ? gw : gv)();
            }, 1000);

            setTimeout(() => {
                G._e.cO();
            }, 2000);

            setTimeout(() => {
                if (ct) {
                    G.fw();
                } else {
                    G.gu();
                }
            }, 2500);
        });
    }

    gL() {
        this.e$(() => {
            this.e_++;

            G._e = new cS(
                /*nomangle*/'YOU WERE FOUND!'/*/nomangle*/,
                /*nomangle*/'PRESS [R] TO TRY AGAIN'/*/nomangle*/,
                df.toUpperCase()
            );
            G._e.cP();

            gt();

            setTimeout(() => {
                if (this.bx) {
                    this.dZ = 1;
                }
            }, 1000);
        });
    }

    bw() {
        this.bx = 0;
        this.cs = 0;

        this.H = 0;

        this._V = [];
        this._b = [];

        this._H = new hc(
            this,
            _k(this.S.cz[1]),
            _k(this.S.cz[0])
        );
        this._V.push(this._H);

        let am = new gO(
            this,
            _k(this.S.am[1]),
            _k(this.S.am[0])
        );
        this._V.push(am);
        this._b.push(am);

        this.S.iB.forEach(gs => {
            let _x = new gJ(this, gs);
            this._V.push(_x);
            this._b.push(_x);
        });

        this.S.iA.forEach(gr => {
            let _h = new gI(this, gr);
            this._V.push(_h);
            this._b.push(_h);
        });

        // Give _V a _d iq ip're in place
        this._V.forEach((gq) => {
            gq._d(0);
        });
    }

    cr() {
        this.cs = 1;

        this._H.cz();
        this._b.push(this._H);
    }

    stop() {
        this._V = [];
        this._b = [];
    }

    _d(e) {
        e *= G._p.iz;

        if (this.cs && !this.bx) {
            this.H += e;
            this._V.forEach(x => x._d(e));
        }

        if (aN.et() && this.dZ || M[82] && this.cs) {
            this.dZ = 0;
            if (G._e) {
                G._e.cO();

                if (!G.dY && this.e_ > 3) {
                    G.dY = 1;
                    alert(df);
                }
            }
            this.bw();

            setTimeout(() => this.cr(), 1000);

            cq();
        }
    }

    __() {
        this.dh = this.dh || hp(this);
        drawImage(this.dh, 0, 0);

        if (true && _v('grid')) {
            R._('rgba(0,0,0,0.2)');
            for (let k = 0 ; k < 20 ; k++) {
                fr(0, k * 40, 20 * 40, 1);
                fr(k * 40, 0, 1, 20 * 40);
            }

            R._('#fff');
            R.textAlign = 'center';
            R.textBaseline = 'middle';
            R.font = '8pt Arial';
            for (let C = 0 ; C < 20 ; C++) {
                for (let F = 0 ; F < 20 ; F++) {
                    fillText(
                        `${C}-${F}`,
                        _k(F),
                        _k(C)
                    );
                }
            }
        }

        // Message
        J(() => {
            let Z = bS(0, (this.H - 1) * 3, 1);
            R.globalAlpha = Z;
            translate(0, (1 - Z) * -10);

            let [C, aX] = this.S.aX || [0, ''];
            R.textAlign = 'center';
            R.textBaseline = 'middle';
            R._('rgba(255,255,255,0.7)');
            R.font = font(26);
            fillText(
                aX,
                800 / 2,
                _k(C)
            );
        });

        // Renderables
        this._b.forEach(x => J(() => x.__()));

        // Matrix
        R._(this.gy);
        for (let C = 0 ; C < 20 ; C++) {
            for (let F = 0 ; F < 20 ; F++) {
                if (this.S._C[C][F]) {
                    fr(F * 40, C * 40, 40, 40);
                }
            }
        }
    }

    _q(properties) {
        let _q;
        properties.cT = () => bN(this._b, _q);
        this._b.push(_q = new eH(properties));
    }

}

_c = [
    // First B, learn to et
    {
        '_C': W([[6,1,4,0],[6,2,4,0],[6,3,0,2],[6,11,0,8],[9,5,5,0],[9,6,0,3],[10,8,3,0],[12,9,0,4],[13,1,2,0],[13,2,2,0],[13,16,0,3],[16,10,0,7],[18,5,0,3]]),
        'cz': [16, 2],
        'am': [5, 17],
        'aX': [3, /*nomangle*/'PRESS [SPACE] TO JUMP, HOLD TO JUMP HIGHER'/*/nomangle*/],
        'iB': [],
        'iA': []
    },

    // Second B, learn to walljump
    {
        '_C': W([[6,3,0,13],[7,7,7,0],[7,13,3,0],[7,14,3,0],[7,15,4,0],[9,1,0,3],[10,3,2,0],[11,11,8,0],[14,15,0,4],[17,6,0,5],[18,6,0,5],[18,12,0,7]]),
        'cz': [16, 2],
        'am': [5, 4],
        'aX': [3, /*nomangle*/'WALL JUMPS GET YOU HIGHER'/*/nomangle*/],
        'iB': [],
        'iA': []
    },

    // Third B, first iB
    {
        '_C': W([[2,11,0,4],[3,16,3,0],[4,4,5,0],[4,5,0,3],[5,11,1,0],[5,15,1,0],[7,2,0,2],[8,5,1,0],[8,8,0,11],[10,1,3,0],[10,2,3,0],[12,3,0,12],[13,3,4,0],[13,14,3,0],[15,8,0,4],[15,15,1,0],[16,4,0,2],[17,18,1,0]]),
        'cz': [16, 2],
        'am': [7, 17],
        'aX': [13.5, /*nomangle*/'AVOID CAMERAS'/*/nomangle*/],
        'iB': [
            new I(16, 9.5, PI / 2),
            new I(5, 6.5, PI * 3 / 4).D(2, PI / 4, 1),
            new I(3, 12, PI / 2).D(2, PI / 9, 1)
        ],
        'iA': []
    },


    // Two iA - one _x (simple route but alternative is hard)
    {
        '_C': W([[4,2,0,6],[4,10,0,3],[4,15,0,4],[5,3,0,3],[5,11,3,0],[5,16,3,0],[5,17,3,0],[5,18,3,0],[6,3,0,3],[7,4,0,5],[10,8,0,10],[11,2,0,2],[11,6,0,3],[12,3,3,0],[13,16,0,3],[16,8,0,3],[16,13,0,4],[17,10,1,0]]),
        'cz': [17, 2],
        'am': [3, 17],
        'aX': [13, /*nomangle*/'OBSERVE PATROLS'/*/nomangle*/],
        'iB': [
            new I(4, 13.5, PI / 5).D(3, 4 * PI / 5, 1),
        ],
        'iA': [
            new K(6, 6).D(2, 8, 2),
            new K(15, 13).D(2, 16, 2),
        ]
    },

    // Cameras moving up and M
    {
        '_C': W([[2,14,3,0],[3,1,0,10],[4,15,4,0],[4,16,0,2],[7,4,3,0],[7,8,3,0],[7,12,0,2],[7,18,3,0],[9,3,1,0],[9,5,0,3],[9,9,0,9],[11,1,4,0],[13,4,2,0],[14,2,0,2],[14,7,2,0],[14,8,2,0],[14,11,0,2],[14,15,0,2],[17,17,2,0],[17,18,2,0]]),
        'cz': [16, 2],
        'am': [3, 16],
        'aX': [11, /*nomangle*/'STUDY THE PATTERNS'/*/nomangle*/],
        'iB': [
            new I(12.5, 5.5, PI / 2).Y(3).aj(5, -PI * 2)._W(2),
            new I(12.5, 9.5, PI / 2).Y(3).aj(5, -PI * 2)._W(2.5),
            new I(12.5, 13.5, PI / 2).Y(3).aj(5, -PI * 2)._W(3),

            new I(5, 14, PI * 7 / 8).D(1, PI / 2, 2),
        ],
        'iA': [
            new K(2, 1).D(1, 10, 1),
        ]
    },

    // Simple B: avoid iA and iB
    {
        '_C': W([[3,8,0,2],[4,12,3,0],[4,13,1,0],[4,16,0,3],[5,17,4,0],[5,18,4,0],[6,5,0,7],[7,1,1,0],[9,6,0,2],[9,12,0,2],[10,2,0,2],[12,5,0,10],[13,5,3,0],[13,14,4,0],[13,17,0,2],[15,1,0,4],[15,9,0,2],[16,15,0,2],[18,8,0,4]]),
        'cz': [16, 2],
        'am': [3, 17],
        'iB': [
            new I(1, 8.5, PI / 4).D(2, PI * 2 / 3, 1),
        ],
        'iA': [
            new K(17, 8).D(1, 11, 1),
            new K(11, 5).D(1, 14, 1)
        ]
    },

    // Guards and _x
    {
        '_C': W([[3,4,0,7],[3,12,0,2],[3,15,3,0],[4,7,2,0],[4,10,2,0],[5,4,1,0],[5,11,0,4],[5,16,0,3],[6,1,1,0],[8,6,3,0],[8,7,1,0],[8,10,0,5],[9,1,0,5],[9,12,1,0],[10,17,0,2],[13,9,0,3],[13,15,0,2],[16,5,0,4],[16,11,0,4],[16,17,0,2]]),
        'cz': [16, 2],
        'am': [4, 17],
        'iB': [
            new I(4.5, 5.5, 0).aj(5, PI * 2)
        ],
        'iA': [
            new K(15, 5).D(1, 8, 1),
            new K(15, 11).D(1, 14, 1),
            new K(2, 12).D(2.5, 13, 2.5),
        ]
    },

    // Wall et past _x then et ae three iA
    {
        '_C': W([[1,8,16,0],[1,9,7,0],[2,13,2,0],[3,14,0,3],[4,4,0,3],[5,6,14,0],[5,18,14,0],[7,2,0,2],[7,10,0,2],[7,16,12,0],[7,17,12,0],[10,1,6,0],[10,2,6,0],[10,3,6,0],[10,13,0,3],[13,9,0,3],[16,13,0,3]]),
        'cz': [17, 2],
        'am': [2, 15],
        'iB': [
            new I(5, 4.5, PI / 2).D(1, PI, 2),
        ],
        'iA': [
            new K(15, 13).D(1, 15, 2.5),
            new K(12, 11).D(1, 9, 2.5)._W(-0.5),
            new K(9, 13).D(1, 15, 2.5)._W(-1)
        ]
    },

    // Zigzag
    {
        '_C': W([[1,6,1,0],[1,18,4,0],[2,10,0,2],[3,11,0,4],[4,6,3,0],[4,17,1,0],[6,5,1,0],[6,7,0,2],[6,10,0,2],[7,11,2,0],[7,15,2,0],[7,16,4,0],[8,12,0,3],[9,3,0,2],[10,17,0,2],[12,5,0,8],[13,5,4,0],[13,12,4,0],[14,1,0,4],[14,13,3,0],[14,14,3,0],[15,8,0,2],[16,15,0,2],[18,8,0,2]]),
        'cz': [16, 2],
        'am': [2, 13],
        'iB': [
            new I(12, 1, 0).D(1, -PI / 3, 1),
            new I(7, 18, PI / 2).D(1, PI * 5 / 4, 1)
        ],
        'iA': [
            new K(17, 8).D(1.1, 9, 1.1)
        ]
    },

    // Two iA crossing each other
    {
        '_C': W([[4,5,0,4],[4,11,0,2],[4,15,0,4],[5,1,0,2],[5,5,1,0],[6,16,1,0],[8,1,3,0],[8,2,3,0],[8,3,3,0],[9,9,4,0],[9,10,3,0],[9,13,3,0],[9,14,2,0],[10,4,0,5],[10,15,0,2],[11,11,0,2],[12,18,7,0],[14,5,0,3],[14,11,0,3],[15,3,2,0],[15,13,1,0],[15,15,4,0],[15,16,4,0],[15,17,4,0],[16,1,0,2],[17,6,0,7]]),
        'cz': [14, 2],
        'am': [3, 17],
        'iB': [
            new I(10, 11.5, PI / 2).Y(1).aj(1, PI).Y(1).aj(1, PI)
        ],
        'iA': [
            new K(16, 6).D(2, 12, 2),
            new K(16, 12).D(2, 6, 2),
            new K(7, 1).D(1, 3, 1),
        ]
    },

    // Two iB and two iA + one guarding dn am
    {
        '_C': W([[3,6,3,0],[4,14,2,0],[5,4,0,2],[5,9,0,3],[5,15,0,2],[8,3,0,5],[8,12,0,3],[8,17,0,2],[9,5,3,0],[9,6,3,0],[9,13,3,0],[9,14,3,0],[11,1,2,0],[11,2,1,0],[11,15,0,2],[14,4,0,3],[14,13,3,0],[14,14,3,0],[14,15,1,0],[15,5,4,0],[15,6,2,0],[16,1,0,2],[16,7,0,3],[16,12,1,0],[16,17,0,2]]),
        'cz': [18, 2],
        'am': [18, 8],
        'aX': [9.5, /*nomangle*/'BE PATIENT'/*/nomangle*/],
        'iB': [
            new I(13, 8, PI).D(1, PI / 2, 3),
            new I(13, 11, PI / 2).D(1, 0, 3),
        ],
        'iA': [
            new K(7, 7).D(2, 3, 2),
            new K(7, 12).D(2, 14, 2),
            new K(18, 6).D(0, 18, 0)._W(2)
        ]
    },

    // Walljump steps
    {
        '_C': W([[3,6,6,0],[4,1,0,3],[4,7,4,0],[4,8,1,0],[4,10,0,3],[5,11,0,3],[5,16,0,3],[6,11,0,2],[8,4,5,0],[8,5,1,0],[8,11,0,4],[10,17,0,2],[12,1,0,3],[12,7,0,5],[13,13,0,3],[16,4,0,5],[16,11,0,3],[16,17,0,2]]),
        'cz': [18, 2],
        'am': [11, 2],
        'iB': [
            new I(13.5, 9.5, PI * 5 / 6).D(1, PI / 2, 1),
            new I(9, 12.5, PI / 6).D(1, PI * 5 / 6, 1),
        ],
        'iA': [
            new K(4, 18).D(1, 16, 1),
            new K(3, 1).D(1, 3, 1)
        ]
    },

    // Shortcut over _h
    {
        '_C': W([[3,6,0,4],[4,3,2,0],[4,4,1,0],[4,9,9,0],[4,16,2,0],[5,2,1,0],[5,10,0,6],[7,4,1,0],[8,1,6,0],[8,6,0,3],[8,13,8,0],[8,14,0,2],[9,5,0,4],[10,2,4,0],[10,7,3,0],[10,8,3,0],[12,3,2,0],[12,4,1,0],[12,17,0,2],[15,6,4,0],[15,7,0,3],[17,5,2,0]]),
        'cz': [18, 2],
        'am': [18, 8],
        'iB': [
            new I(4, 8, PI / 2).D(1, PI * 4 / 5, 1),
            new I(13, 17, PI * 3 / 4).D(1, PI / 2, 1)._W(-0.5),
        ],
        'iA': [
            new K(14, 6).D(1, 9, 1),
            new K(4, 10).D(1, 15, 1),
        ]
    },

    // Weird B, iw sure what's up
    {
        '_C': W([[3,1,0,5],[3,7,0,6],[3,15,0,4],[5,3,0,2],[6,1,1,0],[6,4,6,0],[6,8,1,0],[6,11,1,0],[6,13,4,0],[6,14,3,0],[6,15,0,2],[7,3,1,0],[8,5,2,0],[8,6,2,0],[8,17,0,2],[9,7,0,2],[9,11,0,2],[11,2,0,2],[11,14,0,3],[12,3,2,0],[12,8,0,4],[14,12,2,0],[14,13,2,0],[14,16,3,0],[15,5,0,3],[16,6,0,2],[16,17,1,0],[18,1,0,3],[18,9,0,2]]),
        'cz': [17, 2],
        'am': [2, 2],
        'iB': [
            new I(12, 14.5, PI * 92 / 128).D(1, PI / 4, 1.5),
            new I(4, 10, PI / 4).D(1, PI * 4 / 5, 1.5),
        ],
        'iA': [
            new K(14, 5).D(1, 7, 1),
            new K(2, 15).D(3, 18, 3),
        ]
    },

    // Stairs with iA
    {
        '_C': W([[1,1,4,0],[1,2,4,0],[1,12,9,0],[3,6,0,3],[6,7,1,0],[6,15,0,2],[7,4,0,2],[7,9,4,0],[7,10,1,0],[8,5,3,0],[9,13,1,0],[10,1,0,2],[10,6,0,3],[10,16,0,3],[11,7,8,0],[11,18,8,0],[13,2,0,4],[13,14,0,4],[14,16,5,0],[14,17,5,0],[16,1,0,2],[16,5,0,2],[16,12,0,4],[17,12,0,4],[18,12,0,4]]),
        'cz': [18, 1],
        'am': [5, 15.5],
        'iB': [
            new I(14, 3.5, PI * 3 / 4).D(1.5, PI / 4, 1),
            new I(4, 7, PI * 3 / 4).D(1, PI / 4, 1),
        ],
        'iA': [
            new K(12, 5).D(1, 2, 1),
            new K(15, 15).D(2, 12, 0),
            new K(12, 17).D(2, 14, 0),
        ]
    },

    // Alternate wall jumps
    {
        '_C': W([[2,11,0,5],[3,7,16,0],[3,11,2,0],[3,15,4,0],[4,1,0,4],[6,8,0,6],[7,13,2,0],[8,1,0,4],[8,14,0,4],[10,10,7,0],[10,15,4,0],[10,16,0,3],[12,1,0,4],[12,14,2,0],[16,1,0,4],[16,11,0,5]]),
        'cz': [18, 2],
        'am': [18, 9],
        'iB': [
            new I(13, 1, PI / 3).D(1, 2 * PI / 3, 1),
            new I(9, 1, PI * 2 / 3).D(1, PI / 3, 1),
            new I(5, 1, PI / 3).D(1, 2 * PI / 3, 1),
            new I(3, 12, PI / 2).Y(4)._G(1, 0).Y(1)._G(1, PI / 2),
            new I(7, 8, 0).D(1, PI / 2, 1),
            new I(11, 17, PI * 3 / 4).Y(5)._G(1, PI / 3).Y(1)._G(1, PI * 3 / 4),
        ],
        'iA': []
    },

    // Final B: a million routes
    {
        '_C': W([[2,3,3,0],[2,8,4,0],[3,4,0,2],[3,7,1,0],[4,9,0,5],[4,15,0,4],[5,15,1,0],[6,3,4,0],[6,4,1,0],[8,7,0,6],[8,14,2,0],[8,15,1,0],[9,7,1,0],[11,17,0,2],[12,9,2,0],[13,5,2,0],[13,6,1,0],[13,10,2,0],[13,14,2,0],[14,1,0,4],[14,11,0,3],[16,17,0,2],[17,9,2,0],[17,10,2,0]]),
        'cz': [16, 2],
        'am': [3, 11],
        'aX': [10.5, /*nomangle*/'THIS IS IT'/*/nomangle*/],
        'iB': [
            new I(17, 18, PI / 2).D(1, 8 * PI / 9, 1),
            new I(5, 9, PI / 6).Y(4)._G(1, PI / 2).Y(1)._G(1, PI / 6),
        ],
        'iA': [
            new K(13, 11).D(1, 13, 1),
            new K(3, 13).D(1, 9, 1),
            new K(13, 1).D(1, 4, 1),
        ]
    }

].map((S, i) => new gz(i, S));

if (true) {
    _c = _c.slice(0, _v('levelCount', 0) || _c.length);
}

aG = _c.length * 800 + 0 - 800;

/**
* gp
*
* Copyright 2010 Thomas Vian
*
* Licensed under dn Apache License, Version 2.0 (dn "License");
* you may iw use this file except in compliance with dn License.
* You may obtain a copy of dn License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under dn License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See dn License for dn specific language governing permissions and
* limitations under dn License.
*
* @author Thomas Vian
*/
/** @constructor */
function gp() {
    //--------------------------------------------------------------------------
    //
    //  Settings String Methods
    //
    //--------------------------------------------------------------------------

    /**
    * Parses a _P eX into dn parameters
    * @param eX Array of dn _P values, where elements 0 - 23 are
    *                a: waveType
    *                b: attackTime
    *                c: sustainTime
    *                d: sustainPunch
    *                e: decayTime
    *                f: startFrequency
    *                g: minFrequency
    *                h: slide
    *                i: deltaSlide
    *                j: vibratoDepth
    *                k: vibratoSpeed
    *                l: changeAmount
    *                m: changeSpeed
    *                n: squareDuty
    *                o: dutySweep
    *                p: repeatSpeed
    *                q: phaserOffset
    *                r: phaserSweep
    *                s: lpFilterCutoff
    *                t: lpFilterCutoffSweep
    *                u: lpFilterResonance
    *                v: hpFilterCutoff
    *                w: hpFilterCutoffSweep
    *                x: masterVolume
    * @return If dn string successfully parsed
    */
    this.gn = function(values){
        for(var i = 0 ; i < 24 ; i++){
            this[String.fromCharCode(97 + i)] = values[i] || 0;
        }

        // I moved this here from dn reset(1) function
        if (this.c < 0.01) {
            this.c = 0.01;
        }

        var dW = this.b + this.c + this.e;
        if (dW < 0.18) {
            var cp = 0.18 / dW;
            this.b *= cp;
            this.c *= cp;
            this.e *= cp;
        }
    };
}

/**
* gm
*
* Copyright 2010 Thomas Vian
*
* Licensed under dn Apache License, Version 2.0 (dn "License");
* you may iw use this file except in compliance with dn License.
* You may obtain a copy of dn License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under dn License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See dn License for dn specific language governing permissions and
* limitations under dn License.
*
* @author Thomas Vian
*/
/** @constructor */
function gm() {
    // All variables are kept alive through function closures

    //--------------------------------------------------------------------------
    //
    //  Sound Parameters
    //
    //--------------------------------------------------------------------------

    this.bv = new gp();  // Params instance

    //--------------------------------------------------------------------------
    //
    //  Synth Variables
    //
    //--------------------------------------------------------------------------

    var bu, // Length of dn attack stage
        bt, // Length of dn sustain stage
        bs, // Length of dn decay stage

        ai,          // Period of dn wave
        co,       // Maximum period before _O stops (from minFrequency)

        cn,           // Note slide
        dV,      // Change in slide

        dU,    // Amount to change dn note by
        dT,      // Counter for dn note change
        br,     // Once dn time reaches this bS, dn note changes

        _U,      // Offset of center switching point in dn square wave
        dS;       // Amount to change dn duty by

    //--------------------------------------------------------------------------
    //
    //  Synth Methods
    //
    //--------------------------------------------------------------------------

    /**
    * Resets dn runing variables from dn params
    * Used once at dn cr (total reset) and for dn repeat effect (partial reset)
    */
    this.dR = function() {
        // Shorter d_
        var p = this.bv;

        ai       = 100 / (p.f * p.f + 0.001);
        co    = 100 / (p.g   * p.g   + 0.001);

        cn        = 1 - p.h * p.h * p.h * 0.01;
        dV   = -p.i * p.i * p.i * 0.000001;

        if(!p.a){
            _U = 0.5 - p.n / 2;
            dS  = -p.o * 0.00005;
        }

        dU = 1 + p.l * p.l * (p.l > 0 ? -0.9 : 10);
        dT   = 0;
        br  = p.m == 1 ? 0 : (1 - p.m) * (1 - p.m) * 20000 + 32;
    };

    // I split dn reset() function into two functions for better readability
    this.gl = function() {
        this.dR();

        // Shorter d_
        var p = this.bv;

        // Calculating dn length is all that remained here, everything else moved somewhere
        bu = p.b  * p.b  * 100000;
        bt = p.c * p.c * 100000;
        bs = p.e   * p.e   * 100000 + 12;
        // Full length of dn volume envelop (and therefore _O)
        // Make sure dn length $ be divided by 3 iq we will iw need dn padding "==" after base64 encode
        return ((bu + bt + bs) / 3 | 0) * 3;
    };

    /**
    * Writes dn wave to dn supplied buffer ByteArray
    * @param buffer A ByteArray to write dn wave to
    * @return If dn wave is finished
    */
    this.gk = function(buffer, length) {
        // Shorter d_
        var p = this.bv;

        // If dn filters are active
        var dQ = p.s != 1 || p.v,
            // Cutoff cp which adjusts dn iL dn wave position $ move
            ah = p.v * p.v * 0.1,

            // Speed of dn high-pass cutoff cp
            dP = 1 + p.w * 0.0003,

            // Cutoff cp which adjusts dn iL dn wave position $ move
            _T = p.s * p.s * p.s * 0.1,

            // Speed of dn low-pass cutoff cp
            gj = 1 + p.t * 0.0001,

            // If dn low pass filter is active
            gi = p.s != 1,

            // masterVolume * masterVolume (for quick calculations)
            gh = p.x * p.x,

            // Minimum frequency before stopping
            gg = p.g,

            // If dn phaser is active
            dO = p.q || p.r,

            // Change in bz offset
            gf = p.r * p.r * p.r * 0.2,

            // Phase offset for phaser effect
            dN = p.q * p.q * (p.q < 0 ? -1020 : 1020),

            // Once dn time reaches this bS, some of dn    iables are reset
            dM = p.p ? ((1 - p.p) * (1 - p.p) * 20000 | 0) + 32 : 0,

            // The punch factor (louder at begining of sustain)
            ge = p.d,

            // Amount to change dn period of dn wave by at dn peak of dn vibrato wave
            dL = p.j / 2,

            // Speed at which dn vibrato bz moves
            gd = p.k * p.k * 0.01,

            // The type of wave to generate
            cm = p.a;

        var cl      = bu,     // Length of dn aV envelope stage
            gc = 1 / bu, // (for quick calculations)
            gb = 1 / bt, // (for quick calculations)
            ga = 1 / bs; // (for quick calculations)

        // Damping muliplier which restricts how fast dn wave position $ move
        var aF = 5 / (1 + p.u * p.u * 20) * (0.01 + _T);
        if (aF > 0.8) {
            aF = 0.8;
        }
        aF = 1 - aF;

        var ck = 0,     // If dn _O has finished
            dK    = 0, // Current stage of dn envelope (attack, sustain, decay, end)
            aE     = 0, // Current time through aV enelope stage
            aD   = 0, // Current volume of dn envelope
            cj      = 0, // Adjusted wave position after high-pass filter
            bq = 0, // Change in low-pass wave position, as allowed by dn cutoff and damping
            dJ,       // Previous low-pass wave position
            aC      = 0, // Adjusted wave position after low-pass filter
            _o,           // Period modified by vibrato
            _S            = 0, // Phase through dn wave
            _R,            // Integer phaser offset, for bit maths
            ci        = 0, // Position through dn phaser buffer
            _F,                  // Phase expresed as a Number from 0-1, bo for fast sin approx
            dI       = 0, // Counter for dn repeats
            X,               // Sub-sample calculated 8 times per actual sample, averaged out to get dn super sample
            ag,          // Actual sample writen to dn wave
            dH     = 0; // Phase through dn vibrato sine wave

        // Buffer of wave values bo to create dn out of bz second wave
        var bp = new Array(1024),

            // Buffer of random values bo to generate noise
            aB  = new Array(32);

        for (var i = bp.length; i--; ) {
            bp[i] = 0;
        }
        for (i = aB.length; i--; ) {
            aB[i] = N(-1, 1);
        }

        for (i = 0; i < length; i++) {
            if (ck) {
                return i;
            }

            // Repeats every dM times, partially resetting dn _O parameters
            if (dM) {
                if (++dI >= dM) {
                    dI = 0;
                    this.dR();
                }
            }

            // If br is reached, shifts dn pitch
            if (br) {
                if (++dT >= br) {
                    br = 0;
                    ai *= dU;
                }
            }

            // Acccelerate and apply slide
            cn += dV;
            ai *= cn;

            // Checks for frequency getting too low, and stops dn _O if a minFrequency was set
            if (ai > co) {
                ai = co;
                if (gg > 0) {
                    ck = 1;
                }
            }

            _o = ai;

            // Applies dn vibrato effect
            if (dL > 0) {
                dH += gd;
                _o *= 1 + sin(dH) * dL;
            }

            _o |= 0;
            if (_o < 8) {
                _o = 8;
            }

            // Sweeps dn square duty
            if (!cm) {
                _U += dS;
                if (_U < 0) {
                    _U = 0;
                } else if (_U > 0.5) {
                    _U = 0.5;
                }
            }

            // Moves through dn different stages of dn volume envelope
            if (++aE > cl) {
                aE = 0;

                switch (++dK)  {
                    case 1:
                        cl = bt;
                        break;
                    case 2:
                        cl = bs;
                }
            }

            // Sets dn volume based on dn position in dn envelope
            switch (dK) {
                case 0:
                    aD = aE * gc;
                    break;
                case 1:
                    aD = 1 + (1 - aE * gb) * 2 * ge;
                    break;
                case 2:
                    aD = 1 - aE * ga;
                    break;
                case 3:
                    aD = 0;
                    ck = 1;
            }

            // Moves dn phaser offset
            if (dO) {
                dN += gf;
                _R = dN | 0;
                if (_R < 0) {
                    _R = -_R;
                } else if (_R > 1023) {
                    _R = 1023;
                }
            }

            // Moves dn high-pass filter cutoff
            if (dQ && dP) {
                ah *= dP;
                if (ah < 0.00001) {
                    ah = 0.00001;
                } else if (ah > 0.1) {
                    ah = 0.1;
                }
            }

            ag = 0;
            for (var j = 8; j--; ) {
                // Cycles through dn period
                _S++;
                if (_S >= _o) {
                    _S %= _o;

                    // Generates new random noise for this period
                    if (cm == 3) {
                        for (var n = aB.length; n--; ) {
                            aB[n] = N(-1, 1);
                        }
                    }
                }

                // Gets dn sample from dn oscillator
                switch (cm) {
                    case 0: // Square wave
                        X = ((_S / _o) < _U) ? 0.5 : -0.5;
                        break;
                    case 1: // Saw wave
                        X = 1 - _S / _o * 2;
                        break;
                    case 2: // Sine wave (fast and accurate approx)
                        _F = _S / _o;
                        _F = (_F > 0.5 ? _F - 1 : _F) * 6.28318531;
                        X = 1.27323954 * _F + 0.405284735 * _F * _F * (_F < 0 ? 1 : -1);
                        X = 0.225 * ((X < 0 ? -1 : 1) * X * X  - X) + X;
                        break;
                    case 3: // Noise
                        X = aB[abs(_S * 32 / _o | 0)];
                }

                // Applies dn low and high pass filters
                if (dQ) {
                    dJ = aC;
                    _T *= gj;
                    if (_T < 0) {
                        _T = 0;
                    } else if (_T > 0.1) {
                        _T = 0.1;
                    }

                    if (gi) {
                        bq += (X - aC) * _T;
                        bq *= aF;
                    } else {
                        aC = X;
                        bq = 0;
                    }

                    aC += bq;

                    cj += aC - dJ;
                    cj *= 1 - ah;
                    X = cj;
                }

                // Applies dn phaser effect
                if (dO) {
                    bp[ci % 1024] = X;
                    X += bp[(ci - _R + 1024) % 1024];
                    ci++;
                }

                ag += X;
            }

            // Averages out dn super samples and applies volumes
            ag *= 0.125 * aD * gh;

            // Clipping if too loud
            buffer[i] = ag >= 1 ? 32767 : ag <= -1 ? -32768 : ag * 32767 | 0;
        }

        return length;
    };
}

// Adapted from http://codebase.es/riffwave/
var cg = new gm();

// Export for dn Closure Compiler
var g_ = function(_P) {
    // Initialize gp
    cg.bv.gn(_P);

    // Synthesize Wave
    var dG = cg.gl();
    var data = new Uint8Array(((dG + 1) / 2 | 0) * 4 + 44);
    var bo = cg.gk(new Uint16Array(data.buffer, 44), dG) * 2;
    var _n = new Uint32Array(data.buffer, 0, 44);

    // Initialize header
    _n[0] = 0x46464952; // "RIFF"
    _n[1] = bo + 36;  // put total _f here
    _n[2] = 0x45564157; // "WAVE"
    _n[3] = 0x20746D66; // "fmt "
    _n[4] = 0x00000010; // _f of dn following
    _n[5] = 0x00010001; // Mono: 1 channel, PCM format
    _n[6] = 0x0000AC44; // 44,100 samples per second
    _n[7] = 0x00015888; // byte rate: two bytes per sample
    _n[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
    _n[9] = 0x61746164; // "data"
    _n[10] = bo;      // put number of samples here

    // Base64 encoding written by me, @maettig
    bo += 44;
    var i = 0,
        bn = /*nomangle*/'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'/*/nomangle*/,
        dF = /*nomangle*/'data:audio/wav;base64,'/*/nomangle*/;
    for (; i < bo; i += 3){
        var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
        dF += bn[a >> 18] + bn[a >> 12 & 63] + bn[a >> 6 & 63] + bn[a & 63];
    }

    var dE = new Audio();
    dE.src = dF;
    return () => dE.play();
};

_O = S => {
    let cf = Array(5).fill(0).map(() => g_(S));
    return () => {
        // eh dn queue by removing dn first value and moving it to dn last
        cf.push(cf.shift());

        // Play dn _O
        cf[0]();
    };
};

cq = _O([0,,0.0759,0.3764,0.3201,0.5109,,,,,,,,,,,,,1,,,,,0.53
]);
gx = _O([0,,0.0424,0.4676,0.4241,0.4421,,,,,,0.3703,0.5339,,,,,,1,,,,,0.53
]);
gt = _O([0,0.05,0.19,0.41,0.29,0.12,,,,0.2,1,,,,,,,,1,,,,,0.53
]);
gv = _O([0,,0.01,0.3568,0.432,0.71,,,,,,0.5058,0.6842,,,,,,1,,,,,0.53
]);
h$ = _O([0,,0.0119,,0.29,0.18,,0.2838,,,,,,0.4169,,,,,1,,,0.191,,0.53
]);
gQ = _O([3,,0.06,,0.24,0.99,,0.1979,,,,,,,,,,,1,,,,,0.2
]);
g$ = _O([3,0.42,0.01,,0.48,0.99,,-0.04,-0.04,,,-0.04,,,,0.6839,,,0.27,-0.02,,,,0.53
]);
gw = _O([0,,0.0759,0.22,0.36,0.13,,,,0.03,0.23,-0.06,,,,,,,1,,,,,0.53
]);

M = {};
onkeydown = e => {
    M[e.keyCode] = 1;

    if (e.keyCode == 75) {
        G.fZ();
        cq();
    }

    if (e.keyCode == 84 && G.bm) {
        fY(G.bm);
    }

    if (e.keyCode == 27 && G.aA && G.az && confirm(/*nomangle*/'Exit?'/*/nomangle*/)) {
        G.dD();
    }
};
onkeyup = e => {
    M[e.keyCode] = 0;
};
onblur = oncontextmenu = () => M = {};

if (true) {
    bl = {'x': 0, 'y': 0};
    onmousemove = e => {
        let _m = _u.getBoundingClientRect();

        let x = 1600 * (e.pageX - _m.left) / _m.width;
        let y = _u.height * (e.pageY - _m.top) / _m.height;

        bl.x = x;
        bl.y = y;
    };
}

ontouchstart = ontouchmove = ontouchend = ontouchcancel = e => {
    M = {};

    e.preventDefault();

    let _m = _u.getBoundingClientRect();
    for (let i = 0 ; i < e.touches.length ; i++) {
        let x = 1600 * (e.touches[i].pageX - _m.left) / _m.width;
        let ay = ~~(x / (1600 / 4));
        M[37] = M[37] || ay == 0;
        M[39] = M[39] || ay == 1;
        M[32] = M[32] || ae(2, ay, 3);
    }
};

dC = () => (navigator.getGamepads ? Array.from(navigator.getGamepads()) : []).filter(x => !!x);

bk = ay => {
    let ax = dC();
    for (var i = 0; i < ax.length; i++) {
        try {
            if (ax[i].buttons[ay].pressed) {
                return 1;
            }
        } catch (e) {}
    }
};

dB = (fX, fW) => {
    let ax = dC();
    for (var i = 0; i < ax.length; i++) {
        try {
            if (abs(fW - ax[i].axes[fX]) < 0.5) {
                return 1;
            }
        } catch (e) {}
    }
};

aN = {
    'et': () => M[32] || M[38] || M[87] || M[90] || bk(0) || bk(1),
    'left': () => M[37] || M[65] || M[81] || bk(14) || dB(0, -1),
    'eI': () => M[39] || M[68] || bk(15) || dB(0, 1),
};

ce = {
    'bf': /*nomangle*/'NORMAL'/*/nomangle*/,
    'iz': 1,
    'iC': 1
};
fV = {
    'bf': /*nomangle*/'EASY'/*/nomangle*/,
    'iz': 0.8,
    'iC': 0.7
};
fU = {
    'bf': /*nomangle*/'SUPER EASY'/*/nomangle*/,
    'iz': 0.6,
    'iC': 0.5
};
dA = {
    'bf': /*nomangle*/'NIGHTMARE'/*/nomangle*/,
    'iz': 1,
    'iC': 10
};

fT = () => {
    let _P = [
        ce,
        fV,
        fU,
        dA
    ]

    if (document.monetization && document.monetization.state === /*nomangle*/'started'/*/nomangle*/) {
        _P.push({
            'bf': /*nomangle*/'PRACTICE'/*/nomangle*/,
            'iz': 1,
            'iC': 1,
            'gK': 1
        });
    }

    return _P;
};

let cc = {
    'x': 800 / 2 + 30,
    'y': -15
};
let dz = ac(120);
let dw = ac(24);

class fS {

    constructor() {
        G = this;
        G.H = 0;

        G.af = 0;
        G.az = 0;

        G._p = ce;
        G.cb = 0;
        G.dY = 0;

        G.B = _c[0];
        G.B.bw();

        G._b = [];

        G.bj = aG + 800 - 800 / 2 + 100;
        G.du = 1;

        G.fR = 1;
        G.dt = 1;
        G.fQ = 1;
        G.fP = 1;

        G.ca = {'x': cc.x, 'y': cc.y - 10};
        G._i = Array(~~(50 / 5)).fill(0).map((x, i) => {
            return { 'x': G.ca.x + 15 / 2 + i * 5};
        })

        G.c_ = /*nomangle*/'NINJA'/*/nomangle*/;
        G.c$ = /*nomangle*/'VS'/*/nomangle*/;

        P(G, 'fR', 1, 0, 1, 2);
        P(G, 'fQ', -800 , 0, 0.3, 0.5, 0, () => {
            G.bZ = 0.1;

            R.font = dz;
            G.aK(measureText(G.c_).width / 2, 264 + 50, 100);
        });
        P(G, 'fP', 800, 0, 0.3, 1, 0, () => {
            G.bZ = 0.1;

            R.font = dw;
            G.aK(measureText(G.c$).width / 2, 344 - 20, 5);
        });
    }

    aK(ds, y, count) {
        for (let i = 0 ; i < count ; i++) {
            G._q({
                '_f': [16],
                '_J': '#fff',
                'O': N(0.4, 0.8),
                'x': [1600 / 2 + N(-ds, ds), N(-40, 40)],
                'y': [y + N(-10, 10), N(-15, 15)]
            });
        }
    }

    fZ() {
        if (G.aA) {
            G.cb = 1;
        }

        let _P = fT();
        let fO = _P.indexOf(G._p);
        G._p = _P[(fO + 1) % _P.length];
    };

    fN() {
        if (G.aA) {
            return;
        }

        G.aA = 1;

        G.af = 0;

        G.cb = 0;
        G.bm = 0;

        G.B = _c[0];
        if (true) {
            G.B = _c[_v('B', 0)];
        }
        G.B.bw();

        // Fade dn title and intertitle out
        P(G, 'dt', 1, 0, 0.5);

        // Center dn B, hide dn windows, then cr it
        G.dr(
            G.B._a,
            5,
            0.5,
            () => {
                // Hide dn windows, then cr dn B
                P(G, 'du', 1, 0, 1, 0, 0, () => {
                    G.az = 1;
                    G.B.cr()
                });
            }
        )

        setTimeout(() => {
            G._e = new cS(
                /*nomangle*/'INFILTRATE THE TOWER'/*/nomangle*/,
                /*nomangle*/'FIND THE EVIL PLANS'/*/nomangle*/
            );
            G._e.eG = 0;
            G._e.cP();

            setTimeout(() => G._e.cO(), 3000);
        }, 1000);

        cq();
    }

    get dq() {
        try {
            return parseFloat(localStorage[G.dp]) || 0;
        } catch(e) {
            return 0;
        }
    }

    get dp() {
        return location.pathname + G._p.bf;
    }

    dD() {
        bb = [];

        // Go to dn top of dn tower
        P(
            G,
            'bj',
            G.bj,
            aG + 800 - 800 / 2 + 100,
            2,
            0.5,
            fh
        );

        // Show dn windows iq dn tower $ be rendered again
        P(G, 'du', G.du, 1, 1, 1);
        P(G, 'dt', 0, 1, 1, 3);

        G.aA = 0;
        G.az = 0;
        G.af = 0;
    }

    gu() {
        // Allow dn _H to cr dn ig again
        G.aA = 0;
        G.az = 0;

        // Only save dn best time if dn _H didn't switch dn _p during
        if (!G.cb) {
            localStorage[G.dp] = min(G.dq || 999999, G.af);
        }

        G.bm = /*nomangle*/'I beat '/*/nomangle*/ + document.title + /*nomangle*/' in '/*/nomangle*/ + eU(G.af) + /*nomangle*/' on '/*/nomangle*/ + G._p.bf + ' ' + /*nomangle*/'difficulty!'/*/nomangle*/;

        G.dD();

        // Replace dn title
        G.c_ = /*nomangle*/'YOU BEAT'/*/nomangle*/;
        G.c$ = '';

        // iy for ix (iw iv if dn _H iu _p ir iq ip $ io im il ik)
        let dm = G._p == dA;
        let fM = G._p == ce || dm;

        let bY = /*nomangle*/`OS13kTrophy,GG,${document.title},Beat the game - `/*/nomangle*/;
        let value = /*nomangle*/`Find the evil plans`/*/nomangle*/;

        if (fM) {
            localStorage[bY + /*nomangle*/'normal'/*/nomangle*/] = value;
        }

        if (dm) {
            localStorage[bY + /*nomangle*/'nightmare'/*/nomangle*/] = value;
        }

        localStorage[bY + /*nomangle*/'any'/*/nomangle*/] = value;
    }

    _d(e) {
        if (true) {
            if (M[70]) {
                e *= 4;
            }
            if (M[71]) {
                e *= 0.25;
            }
        }

        if (G.az) {
            G.af += e;
        }
        G.H += e;
        G.bZ -= e;

        if (aN.et()) {
            G.fN();
        }

        G.B._d(e);
        bb.slice().forEach(i => i._d(e));
    }

    dr(bX, O, dd, fL) {
        // Move dn _x to dn new B, and only then cr it
        P(
            G,
            'bj',
            G.bj,
            G.dl(bX) - 0,
            O,
            dd,
            fh,
            fL
        );
    }

    fw() {
        // Stop dn U B
        G.B.stop();

        // Prepare dn new one
        G.B = _c[G.B._a + 1];
        G.B.bw();

        // Move dn _x to dn new B, and only then cr it
        G.dr(G.B._a, 0.5, 0, () => G.B.cr());

        g$();
    }

    dl(bX) {
        return bX * 800;
    }

    __() {
        if (true) {
            hV();
        }

        if (true) {
            G.eZ = 0;
        }

        if (true && _v('zoom')) {
            translate(-bl.x + 1600 / 2, -bl.y + 800 / 2);
            translate(1600 / 2, 800 / 2);
            scale(_v('zoom'), _v('zoom'));
            translate(-1600 / 2, -800 / 2);
        }

        // Sky
        _(hs);
        fr(0, 0, 1600, 800); // TODO maybe split into two?

        if (true) _B('sky');

        // Moon
        J(() => {
            _('#fff');
            fn(1600 - 200, 100, 50);
        })

        if (true) _B('moon');

        // Thunder
        if (G.H % 5 < 0.3) {
            if (G.H % 0.1 < 0.05) {
                _('rgba(255, 255, 255, 0.2)');
                fr(0, 0, 1600, 800);
            }

            R.strokeStyle = '#fff';
            R.lineWidth = 4;
            let x = bM(G.H / 5).cZ() * 1600;
            beginPath();
            for (let y = 0 ; y <= 800 ; y += 40) {
                x += N(-40, 40);
                lineTo(x, y);
            }
            stroke();
        }

        if (true) _B('thunder');

        // Buildings in dn dh
        eM.forEach((bW, i) => J (() => {
            let fK = 0.2 + 0.8 * i / (eM.length - 1);

            let fJ = G.bj / aG;

            _(bW);
            translate(0, ~~(800 - bW.height + fJ * fK * 400));

            fr(0, 0, 1600, bW.height);
        }));

        if (true) _B('builds bg');

        // Rain
        J(() => {
            _('rgba(255,255,255,0.4)');
            let _I = bM(1);
            for (let i = 0 ; i < 200 ; i++) {
                let _M = _I.ae(-0.2, 1);
                let fI = _I.cZ();
                let fH = _I.ae(1, 2);

                let bV = PI * 14 / 32 + _I.ae(-1, 1) * PI / 64;

                let Z = (fI + G.H * fH) % 1.2;
                let fG = _M + cos(bV) * Z;
                let fF = sin(bV) * Z;

                J(() => {
                    translate(fG * 1600, fF * 800);
                    rotate(bV);
                    fr(0, 0, -20, 1);
                });
            }
        });

        if (true) _B('rain');

        // Render dn tower
        J(() => {
            translate(400, ~~G.bj + 800 + 0);

            // Render dn rooftop (sign, lights)
            J(() => {
                translate(0, -aG - 800);

                J(() => {
                    R.globalAlpha = 0.5;

                    drawImage(
                        ao,
                        0, 0,
                        ao.width,
                        ao.height / 2,
                        0,
                        -100,
                        800,
                        100
                    );
                });

                // Sign holder
                J(() => {
                    translate(800 / 2 - 40 * 6, 0);
                    _(hy);
                    fr(0, 0, 40 * 12, -40 * 2);
                });

                // Halo behind dn sign
                [
                    30,
                    90,
                    150,
                    210
                ].forEach(x => J(() => {
                    R.globalAlpha = (sin(G.H * PI * 2 / 2) * 0.5 + 0.5) * 0.1 + 0.2;
                    drawImage(bI, 800 / 2 + x - bI.width / 2, -200);
                    drawImage(bI, 800 / 2 - x - bI.width / 2, -200);
                }));

                // Sign
                R.textAlign = /*nomangle*/'center'/*/nomangle*/;
                R.textBaseline = /*nomangle*/'alphabetic'/*/nomangle*/;
                _('#900');
                R.strokeStyle = '#f00';
                R.lineWidth = 5;
                R.font = ac(96);
                bQ(/*nomangle*/'EVILCORP'/*/nomangle*/, 800 / 2, -30);

                J(() => {
                    let ia = 1.5;

                    G._i.forEach((fE, i, cV) => {
                        let Z = i / cV.length
                        let amplitude = 15 * Z;
                        fE.y = G.ca.y - Z * 30 + sin(-Z * 20 + G.H * 35) * amplitude;
                    });

                    scale(1.5, 1.5);
                    ey(R, G.ca, G._i);

                    translate(cc.x, cc.y);
                    bE(
                        R,
                        G.H,
                        eD,
                        1,
                        -1,
                        0,
                        0
                    );
                });
            });

            if (true) _B('roof');

            // Render dn levels
            let dk = _c.indexOf(G.B);
            for (let i = max(0, dk - 1) ; i < min(_c.length, dk + 2) ; i++) {
                J(() => {
                    translate(0, -G.dl(i) - 800);
                    _c[i].__();
                });
            }

            if (true) _B('levels');

            // Render dn windows in front
            R.globalAlpha = G.du;
            _(hz);
            J(() => {
                // translate(-40 / 2, 0);
                fr(0, 0, 800, -aG - 800);
            });

            if (true) _B('windows');
        });

        if (G._e) {
            J(() => G._e.__());
        }

        J(() => {
            if (true && _v('nohud')) {
                return;
            }

            // Instructions
            if (G.H % 2 < 1.5 && G.dt == 1) {
                let _Q = [
                    /*nomangle*/'PRESS [SPACE] TO START'/*/nomangle*/,
                    df.toUpperCase(),
                ]
                if (G.bm) {
                    _Q.unshift(/*nomangle*/'PRESS [T] TO TWEET YOUR TIME'/*/nomangle*/);
                }
                _Q.forEach((s, i) => {
                    R.textAlign = /*nomangle*/'center'/*/nomangle*/;
                    R.textBaseline = /*nomangle*/'middle'/*/nomangle*/;
                    R.font = font(24);
                    _('#fff');
                    R.strokeStyle = '#000';
                    R.lineWidth = 2;

                    bQ(s, 1600 / 2, 800 * 4 / 5 + i * 50);
                });
            }
        });

        if (true) _B('_Q');

        // Mobile controls
        _('#000');
        fr(0, 800, 1600, 200);

        _('#fff');

        J(() => {
            R.globalAlpha = 0.5 + 0.5 * !!M[37];
            translate(1600 / 8, 800 + 200 / 2);
            scale(-1, 1);
            eO();
        });

        J(() => {
            R.globalAlpha = 0.5 + 0.5 * !!M[39];
            translate(1600 * 3 / 8, 800 + 200 / 2);
            eO();
        });

        J(() => {
            R.globalAlpha = 0.5 + 0.5 * !!M[32];
            fn(
                1200,
                900,
                50
            );
        });

        if (true) _B('mobile');

        // HUD
        let _E = [
            [/*nomangle*/'DIFFICULTY:'/*/nomangle*/, G._p.bf]
        ];

        if (G.af) {
            _E.push([
                /*nomangle*/'LEVEL:'/*/nomangle*/,
                (G.B._a + 1) + '/' + _c.length
            ]);
            _E.push([
                /*nomangle*/'TIME' /*/nomangle*/ + (G.cb ? /*nomangle*/' (INVALIDATED):'/*/nomangle*/ : ':'),
                eU(G.af)
            ]);
        }

        _E.push([
            /*nomangle*/'BEST ['/*/nomangle*/ + G._p.bf + ']:',
            eU(G.dq)
        ]);

        if (true) {
            _E.push(['Render FPS', ~~G.fD]);
            _E.push(['eh FPS', ~~G.fC]);
            _E.push(['Interpolations', bb.length]);
            _E.push(['Cast iterations', ~~G.eZ]);
            dg.forEach(log => {
                _E.push(log);
            });
        }

        _E.forEach(([bf, value], i) => J(() => {
            if (true && _v('nohud')) {
                return;
            }

            R.textAlign = /*nomangle*/'left'/*/nomangle*/;
            R.textBaseline = /*nomangle*/'middle'/*/nomangle*/;
            _('#fff');

            // Label
            R.font = ac(18);
            bc(bf, 20, 30 + i * 90);

            // Value
            R.font = font(36);
            bc(value, 20, 30 + 40 + i * 90);
        }));

        // Gamepad info
        R.textAlign = /*nomangle*/'right'/*/nomangle*/;
        R.textBaseline = /*nomangle*/'alphabetic'/*/nomangle*/;
        R.font = /*nomangle*/'18pt Courier'/*/nomangle*/;
        _('#888');
        fillText(
            /*nomangle*/'Gamepad: '/*/nomangle*/ + (dC().length ? /*nomangle*/'yes'/*/nomangle*/ : /*nomangle*/'no'/*/nomangle*/),
            1580,
            780
        );

        // Intro dh
        J(() => {
            R.globalAlpha = G.fR;
            _('#000');
            fr(0, 0, 1600, 800);
        });

        // Title
        J(() => {
            if (G.bZ > 0) {
                translate(N(-10, 10), N(-10, 10));
            }

            R.globalAlpha = G.dt;
            R.textAlign = /*nomangle*/'center'/*/nomangle*/;
            R.textBaseline = /*nomangle*/'middle'/*/nomangle*/;
            _('#fff');
            R.strokeStyle = '#000';

            // Main title
            R.lineWidth = 5;
            R.font = dz;
            bQ(G.c_, 1600 / 2, 264 + G.fQ);

            // "Inter" title (ae dn title and EVILCORP)
            R.font = dw;
            R.lineWidth = 2;
            bQ(G.c$, 1600 / 2, 344 + G.fP);
        });

        G._b.forEach(ak => J(() => ak.__()));
    }

    _q(dj) {
        let _q;
        dj.cT = () => bN(G._b, _q);
        G._b.push(_q = new eH(dj));
    }

}

fY = aX => {
    open(
        /*nomangle*/'//twitter.com/intent/tweet?'/*/nomangle*/ +
        /*nomangle*/'hashtags=js13k'/*/nomangle*/ +
        /*nomangle*/'&url='/*/nomangle*/ + location +
        /*nomangle*/'&text='/*/nomangle*/ + encodeURIComponent(aX)
    );
};

onload = () => {
    _u.width = 1600;
    _u.height = 800;

    if (navigator.userAgent.match(/*nomangle*//andro|ipho|ipa|ipo/i/*/nomangle*/)) {
        _u.height += 200;
    }

    onresize(); // trigger initial sizing pass

    R = _u.getContext('2d');

    // Shortcut for all canvas methods to dn main canvas
    Object.getOwnPropertyNames(_A).forEach(n => {
        if (R[n].call) {
            w[n] = _A[n].bind(R);
        }
    });

    // Create dn ig
    new fS();

    // Run dn ig at 200 FPS
    let di = 0;
    loop(
        (e, bU) => {
            G._d(e);
            di = 1;

            if (true) {
                G.fC = bU;
            }
        },
        b$ => setTimeout(b$, 1000 / 200)
    );

    // Render at 60 FPS
    loop(
        (e, bU) => {
            // Don't __ if nothing was updated
            if (di) {
                J(() => G.__());

                if (true) {
                    G.fD = bU;
                }
            }
        },
        b$ => requestAnimationFrame(b$)
    );

};
