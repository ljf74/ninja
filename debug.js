function revertOptimizeMatrix(lines) {
        let decoded = [];
        let topAndBottomRow = Array(20).fill(1);
        decoded.push(topAndBottomRow);
        for (let i = 0; i < 20 - 2; i++) {
            let row = Array(20).fill(0);
            row[0] = 1;
            row[20 - 1] = 1;
            decoded.push(row);
        }
        decoded.push(topAndBottomRow);

        lines.forEach(([
            row,
            col,
            verticalLength,
            horizontalLength
        ]) => {
            for (let i = 0; i < max(verticalLength, horizontalLength); i++) {
                decoded[row + i * !!verticalLength][col + i * !!horizontalLength] = 1;
            }
        });

        return decoded;
    }

if (true) {
    getDebugValue = (key, defaultValue) => {
        if (!(key in sessionStorage)) {
            return defaultValue;
        }
        return JSON.parse(sessionStorage[key]);
    }

    setDebugValue = (key, x) => {
        sessionStorage[key] = JSON.stringify(x);
    }

    // In game level editor
    addEventListener('click', event => {
        let canvasCoords = CANVAS.getBoundingClientRect();
        let x = CANVAS.width * (event.pageX - canvasCoords.left) / canvasCoords.width;
        let y = CANVAS.height * (event.pageY - canvasCoords.top) / canvasCoords.height;

        if (getDebugValue('editor')) {
            let row = toCellUnit(y - 0);
            let col = toCellUnit(x - 400);

            if (row >= 0 && row < 20 && col >= 0 && col < 20) {
                G.level.definition.matrix[row][col] = !G.level.definition.matrix[row][col];
                G.level.background = 0;
            }
        }
    }, 0);

    addEventListener('keydown', e => {
        if (getDebugValue('editor') && e.keyCode == 83) {
            prompt(
                'Level matrix',
                JSON.stringify(G.level.definition.matrix.map(row => row.map(x => !!x + 0)))
            );
        }

        if (e.keyCode == 84) {
            setDebugValue('grid', !getDebugValue('grid', 0));
        }

        if (e.keyCode == 78) {
            G.nextLevel();
        }
    }, 0);

    let lastLogTime = performance.now();
    perfLogs = [];
    resetPerfLogs = () => perfLogs = [];
    logPerf = label => {
        if (!getDebugValue('perf')) {
            return;
        }

        let now = performance.now();
        perfLogs.push([label, now - lastTime]);
        lastTime = now;
    };
}

let R, // canvas context
    G, // Game instance
    w = window,
    CANVAS = /*nomangle*/g/*/nomangle*/
    DIFFICULTY_INSTRUCTION = /*nomangle*/'Press [K] to change difficulty at any time'/*/nomangle*/;

limit = (a, b, c) => b < a ? a : (b > c ? c : b);
between = (a, b, c) => b >= a && b <= c;
rnd = (min, max) => random() * (max - min) + min;
distP = (x1, y1, x2, y2) => sqrt((x1 - x2)**2 + (y1 - y2)**2);
dist = (a, b) => distP(a.x, a.y, b.x, b.y);
normalize = x => moduloWithNegative(x, PI);
angleBetween = (a, b) => atan2(b.y - a.y, b.x - a.x);
roundToNearest = (x, precision) => round(x / precision) * precision;
pick = a => a[~~(random() * a.length)];

// Modulo centered around zero: the result will be between -y and +y
moduloWithNegative = (x, y) => {
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
let math = Math;
Object.getOwnPropertyNames(math).forEach(n => w[n] = w[n] || math[n]);

TWO_PI = PI * 2;

let canvasProto = CanvasRenderingContext2D.prototype;

// A couple extra canvas functions
canvasProto.wrap = function(f) {
    this.save();
    f();
    this.restore();
};
canvasProto.fr = canvasProto.fillRect;
canvasProto.fs = function(x) {
    this.fillStyle = x;
};

canvasProto.roundedRectangle = function(x, y, w, h, rounded) {
    let radiansInCircle = 2 * PI;
    let halfRadians = PI;
    let quarterRadians = PI / 2;

    this.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, 1)
    this.arc(rounded + x, h - rounded + y, rounded, halfRadians, quarterRadians, 1)
    this.arc(x + w - rounded, y + h - rounded, rounded, quarterRadians, 0, 1)
    this.arc(x + w - rounded, y + rounded, rounded, 0, -quarterRadians, 1)
}

canvasProto.fillCircle = function(x, y, radius) {
    this.beginPath();
    this.arc(x, y, radius, 0, PI * 2, 1);
    this.fill();
};

canvasProto.outlinedText = function(s, x, y) {
    this.fillText(s, x, y);
    this.strokeText(s, x, y);
};

canvasProto.shadowedText = function(s, x, y) {
    this.wrap(() => {
        this.fs('#000');
        fillText(s, x, y + 5);
    })
    this.fillText(s, x, y);
};

onresize = () => {
    var windowWidth = innerWidth,
        windowHeight = innerHeight,

        availableRatio = windowWidth / windowHeight, // available ratio
        canvasRatio = 1600 / CANVAS.height, // base ratio
        appliedWidth,
        appliedHeight,
        containerStyle = /*nomangle*/t/*/nomangle*/.style;

    if (availableRatio <= canvasRatio) {
        appliedWidth = windowWidth;
        appliedHeight = appliedWidth / canvasRatio;
    } else {
        appliedHeight = windowHeight;
        appliedWidth = appliedHeight * canvasRatio;
    }

    containerStyle.width = appliedWidth + 'px';
    containerStyle.height = appliedHeight + 'px';
};

linear = t => t;
easeOutQuad = t => t * (2 - t);
easeOutQuint = t => 1 + (--t) * t * t * t * t;
easeInQuint = t => t * t * t * t * t;
easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

interp = (
    obj,
    property,
    fromValue,
    toValue,
    duration,
    delay,
    easing,
    endCallback
) => {
    let progress = 0;

    let interpolation = {
        'cycle': e => {
            progress += e;

            let progressAsRatio = limit(0, (progress - (delay || 0)) / duration, 1);
            obj[property] = (easing || linear)(progressAsRatio) * (toValue - fromValue) + fromValue;

            if (progressAsRatio >= 1) {
                remove(INTERPOLATIONS, interpolation);
                endCallback && endCallback();
            }
        }
    };
    INTERPOLATIONS.push(interpolation);
};

INTERPOLATIONS = [];

castRay = (x, y, angle, maxDistance) => {
    let castHorizontal = castAgainstHorizontal(x, y, angle, maxDistance);
    let castVertical = castAgainstVertical(x, y, angle, maxDistance);

    let cast;
    if (!castHorizontal) {
        cast = castVertical;
    } else if(!castVertical) {
        cast = castHorizontal;
    } else {
        impact = distP(x, y, castHorizontal.x, castHorizontal.y) < distP(x, y, castVertical.x, castVertical.y) ? castHorizontal : castVertical;
    }

    if (distP(x, y, impact.x, impact.y) > maxDistance) {
        impact = {
            'x': x + cos(angle) * maxDistance,
            'y': y + sin(angle) * maxDistance
        };
    }

    return impact;
}

castAgainstHorizontal = (startX, startY, angle, maxDistance) => {
    let pointingDown = sin(angle) > 0;

    let y = ~~(startY / 40) * 40 + (pointingDown ? 40 : -0.0001);
    let x = startX + (y - startY) / tan(angle);

    let yStep = pointingDown ? 40 : -40;
    let xStep = yStep / tan(angle);

    return doCast(x, y, xStep, yStep, maxDistance);
}

castAgainstVertical = (startX, startY, angle, maxDistance) => {
    let pointingRight = cos(angle) > 0;

    let x = ~~(startX / 40) * 40 + (pointingRight ? 40 : -0.0001);
    let y = startY + (x - startX) * tan(angle);

    let xStep = pointingRight ? 40 : -40;
    let yStep = xStep * tan(angle);

    return doCast(x, y, xStep, yStep, maxDistance);
}

doCast = (startX, startY, xStep, yStep, maxDistance) => {
    let x = startX,
        y = startY;

    while (distP(x, y, startX, startY) < maxDistance) {
        if (true) {
            G.castIterations++;
        }
        if (internalHasBlock(x, y)) {
            // Got a block!
            return {
                'x': x,
                'y': y
            };
        } else if(isOut(x, y)) {
            // Out of bounds
            break;
        } else {
            x += xStep;
            y += yStep;
        }
    }

    return {
        'x': x,
        'y': y
    };
}

hasBlock = (x, y, radius = 0) => {
    return internalHasBlock(x, y) ||
        internalHasBlock(x - radius, y - radius) ||
        internalHasBlock(x - radius, y + radius) ||
        internalHasBlock(x + radius, y - radius) ||
        internalHasBlock(x + radius, y + radius);
}

internalHasBlock = (x, y) => {
    return !isOut(x, y) && G.level.definition.matrix[toCellUnit(y)][toCellUnit(x)];
}

isOut = (x, y) => {
    return !between(0, x, 800) || !between(0, y, 800);
}

toCellUnit = x => ~~(x / 40);
toCellCoord = rowOrCol => rowOrCol * 40;
toMiddleCellCoord = rowOrCol => toCellCoord(rowOrCol + 0.5)

remove = (array, value) => {
    let index = array.indexOf(value);
    if (index >= 0) {
        array.splice(index, 1);
    }
};

createNumberGenerator = seed => {
    let ints = new Uint32Array([
        imul(seed, 0x85ebca6b),
        imul(seed, 0xc2b2ae35),
    ]);

    let generateFloat = () => {
        let s0 = ints[0];
        let s1 = ints[1] ^ s0;
        ints[0] = (s0 << 26 | s0 >> 8) ^ s1 ^ s1 << 9;
        ints[1] = s1 << 13 | s1 >> 19;
        return (imul(s0, 0x9e3779bb) >>> 0) / 0xffffffff;
    };

    return {
        'between': (a, b) => generateFloat() * (b - a) + a,
        'floating': generateFloat
    };
};

addZeroes = x => {
    return (x < 10 ? '0' : '') + ~~x;
};

formatTime = seconds => {
    return addZeroes(~~(seconds / 60)) + ':' + addZeroes(~~seconds % 60) + '.' + addZeroes(100 * (seconds % 1));
};

loop = (func, nextFrameFunc) => {
    let lastFrame = performance.now();
    let iteration = () => {
        let n = performance.now();
        let e = min((n - lastFrame) / 1000, 1000 / 10);

        lastFrame = n;
        func(e, ~~(1 / e));

        nextFrameFunc(iteration);
    };

    iteration();
};

let createCanvas = (w, h, instructions) => {
    let can = document.createElement('canvas');
    can.width = w;
    can.height = h;

    let ctx = can.getContext('2d');

    return instructions(ctx, can) || can;
};

createCanvasPattern = (patternWidth, patternHeight, instructions) => {
    let x = createCanvas(patternWidth, patternHeight, instructions);
    let pattern = x.getContext('2d').createPattern(x, 'repeat');

    // Add some extra properties (background rendering needs to know the size of patterns)
    pattern.width = patternWidth;
    pattern.height = patternHeight;

    return pattern;
};

padCanvas = (rows, cols, anchorY, image) => createCanvas(40 * cols, 40 * rows, (c, can) => {
    let y;

    y = (can.height - image.height) * anchorY;

    c.drawImage(
        image,
        (can.width - image.width) / 2,
        y
    );
});

FONT = createCanvas(1, 1, (c) => {
    // Pick a string that will most likely have a bunch of characters
    let testText = location;

    // Measure the width for a font that we know does not exist
    c.font = '99pt d';
    let reference = c.measureText(testText).width;

    // Then measure the same width for fonts that we may support
    return [
        /*nomangle*/'Impact'/*/nomangle*/,
        /*nomangle*/'Arial Black'/*/nomangle*/
    ].filter(fontName => {
        c.font = '99pt ' + fontName;
        return c.measureText(testText).width != reference;
    })[0] || /*nomangle*/'serif'/*/nomangle*/;
});

font = size => size + 'pt ' + FONT;
italicFont = size => /*nomangle*/`italic `/*/nomangle*/ + font(size);

GOD_RAY = createCanvas(24, 160, (c, can) => {
    let g = c.createLinearGradient(0, 0, 0, 40 * 4);
    g.addColorStop(0, 'rgba(255,255,255, 0)');
    g.addColorStop(0.5, 'rgba(255,255,255, 0.5)');
    g.addColorStop(1, 'rgba(255,255,255, 0)');

    c.fs(g);
    c.fr(0, 0, 99, 999);
});

HALO = createCanvas(160, 160, (c, can) => {
    let g = c.createRadialGradient(can.width / 2, can.height / 2, 0, can.width / 2, can.height / 2, can.width / 2);
    g.addColorStop(0.5, 'rgba(255,255,255, 0.5)');
    g.addColorStop(1, 'rgba(255,255,255, 0)');

    c.fs(g);
    c.fr(0, 0, 999, 999);
});

RED_HALO = createCanvas(240, 240, (c, can) => {
    let g = c.createRadialGradient(
        can.width / 2, can.height / 2, 0,
        can.width / 2, can.height / 2, can.width / 2
    );
    g.addColorStop(0.5, 'rgba(255,0,0, 0.5)');
    g.addColorStop(1, 'rgba(255,0,0, 0)');

    c.fs(g);
    c.fr(0, 0, 999, 999);
});

WINDOW_PATTERN = createCanvasPattern(80, 80, (c, can) => {
    c.fs('#67b');
    c.fr(0, 0, 999, 999);

    c.fs('#235');
    c.fr(can.width / 10, can.height / 4, can.width * 8 / 10, can.height / 2);
});

BUILDING_PATTERN = createCanvasPattern(800, 400, (c, can) => {
    c.fs('#457');
    c.fr(0, 0, can.width, 999);

    // c.translate(40 / 4, 40 / 4);

    c.fs(WINDOW_PATTERN);
    c.fr(0, 40 / 4, can.width, can.height - 40 / 2);
});

SIGN_HOLDER_PATTERN = createCanvasPattern(80, 80, (c, can) => {
    c.fillStyle = c.strokeStyle = '#111';
    c.lineWidth = 4;
    c.fr(0, 0, 99, 99);
    c.clearRect(4, 4, can.width - 8, can.height - 8);

    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(99, 99);
    c.moveTo(can.width, 0);
    c.lineTo(0, can.height);
    c.stroke();
});

renderMobileArrow = () => {
    beginPath();
    moveTo(100 / 2, 0);
    lineTo(-100 / 2, 100 / 2);
    lineTo(-100 / 2, -100 / 2);
    fill();
};

UNPADDED_WINDOW = createCanvas(
    40 * 0.8,
    40 * 1.2,
    (c, can) => {
        // Window
        let g = c.createLinearGradient(0, 0, can.width, can.height);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.25, 'rgba(255,255,255,0.3)');
        g.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        g.addColorStop(0.75, 'rgba(255,255,255,0.3)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        c.fs(g);
        c.fr(0, 0, can.width, can.height);

        // Frame
        c.fs('#888');
        c.fr(0, 0, can.width, 2);
        c.fr(0, can.height, can.width, -2);
        c.fr(0, 0, 2, can.height);
        c.fr(can.width, 0, -2, can.height);
        c.fr(0, can.height * 0.7, can.width, 4);
    }
);

WINDOW = padCanvas(2, 1, 0.5, UNPADDED_WINDOW);

UNPADDED_DESK = createCanvas(40 * 1.1, 40 * 0.5, (c, can) => {
    // Legs
    c.fs('#000');
    c.fr(2, 0, 2, can.height);
    c.fr(can.width - 2, 0, -2, can.height);

    // Top
    c.fs('#494742');
    c.fr(0, 0, 99, 4);

    // Drawers
    c.fs('#ccc');
    c.fr(4, 4, can.width / 4, can.height / 3);
    c.fr(can.width - 4, 4, -can.width / 4, can.height / 3);
});

COMPUTER = createCanvas(40 * 0.6, 40 * 0.6, (c, can) => {
    c.fs('#000');
    c.fr(0, 0, 99, 99);

    c.fs('#a9a9a9');
    c.fr(2, 2, can.width - 4, can.height - 4);

    c.fs('#4253ff');
    c.fr(4, 4, can.width - 8, can.height - 12);

    c.fs('#000');
    c.fr(4, can.height - 6, can.width - 8, 2);

    c.fs('#a5dc40');
    c.fr(can.width - 6, can.height - 6, 2, 2);
});

FRAME = padCanvas(1, 1, 0.5, createCanvas(40 * 0.6, 40 * 0.8, (c, can) => {
    c.fs('#925e2a');
    c.fr(0, 0, 99, 99);

    c.fs('#fcf3d7');
    c.fr(4, 4, can.width - 8, can.height - 8);

    c.fs('#ccc');
    c.fr(can.width / 2 - 5, can.height / 2 - 5, 10, 10);
}));

DESK = padCanvas(1, 2, 1, UNPADDED_DESK);

TRASH = padCanvas(1, 1, 1, createCanvas(40 * 0.3, 40 * 0.4, (c, can) => {
    c.fs('#4c80be');
    c.fr(0, 0, 99, 99);

    c.fs('#78a1d6');
    c.fr(0, 0, 99, 4);
}));

OUTLET = padCanvas(1, 1, 0.75, createCanvas(40 * 0.2, 40 * 0.2, (c, can) => {
    c.fs('#fff');
    c.fr(0, 0, 99, 99);
}));

LIGHT = padCanvas(3, 10, 0, createCanvas(40 * 5, 40 * 3, (c, can) => {
    let g = c.createRadialGradient(can.width / 2, 0, 0, can.width / 2, 0, can.height);
    g.addColorStop(0, 'rgba(255,255,255,0.2)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fs(g);

    c.beginPath();
    c.moveTo(can.width / 2, 0);
    c.arc(can.width / 2, 0, can.height, PI / 6, PI * 5 / 6, 0);
    c.fill();
}));

BUILDINGS_BACKGROUND = [
    ['#000', 600],
    ['#222', 500],
    ['#333', 300]
].map(([color, patternHeight]) => createCanvasPattern(400, patternHeight, (c, can) => {
    c.fs(color);

    let rng = createNumberGenerator(patternHeight * 5);

    let x = 0;
    while (x < can.width) {
        let buildingWidth = ~~rng.between(80, 120);
        c.fr(x, rng.floating() * 200, buildingWidth, patternHeight);
        x += buildingWidth;
    }
}));

SKY_BACKGROUND = createCanvas(1, 800, (c) => {
    let gradient = c.createLinearGradient(0, 0, 0, 800);
    gradient.addColorStop(0, '#00032c');
    gradient.addColorStop(0.7, '#14106f');
    return gradient;
});

LEVEL_BACKGROUND_PATTERN = createCanvasPattern(160, 240, (c, can) => {
    c.fs('#000');
    c.globalAlpha = 0.05;

    // Horizontal ridges
    c.fr(0, 0, 160, 2);
    c.fr(0, 120, 160, 2);

    // Vertical ridges
    c.fr(0, 0, 2, 40 * 3);
    c.fr(80, 120, 2, 40 * 10);
});

LEVEL_COLORS = [
    '#29c2fd',
    '#ffbbb9',
    '#c0a4ff',
    '#5ce5b8',
    '#ffc4ec'
];

darken = (color, amount = 0.5) => {
    let num = parseInt(color.slice(1), 16);
    let r = (num >> 16);
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;

    return '#' + (amount * r << 16 | amount * g << 8 | amount * b).toString(16).padStart(6, '0');
};

// document.body.appendChild(createCanvas(LEVEL_COLORS.length * 100, 200, (c) => {
//     LEVEL_COLORS.forEach((color, i) => {
//         c.fillStyle = color;
//         c.fillRect(i * 100, 0, 100, 100);
//
//         c.fillStyle = darken(color);
//         c.fillRect(i * 100, 100, 100, 100);
//     });
// }));

createLevelBackground = (level) => createCanvas(800, 800, (c, can) => {
    c.fs(level.backgroundColor);
    c.fr(0, 0, 800, 800);

    c.fs(LEVEL_BACKGROUND_PATTERN);
    c.fr(0, 0, 800, 800);

    // Add a gradient from the top left to make the background less flat
    let grad = c.createRadialGradient(0, 0, 0, 0, 0, 800);
    grad.addColorStop(0, 'rgba(255,255,255,0.5)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    c.fs(grad);
    c.fr(0, 0, 800, 800);

    let rng = createNumberGenerator(1);

    let matrix = level.definition.matrix;

    // Map of spots that are already taken by a detail
    let taken = matrix.map((arr) => arr.slice());

    let [messageRow] = level.definition.message || [0]

    // No detail on the spawn
    // taken[level.definition.exit[0]][level.definition.exit[1]] = 1;

    for (let row = 1 ; row < 20 - 1 ; row++) {
        for (let col = 1 ; col < 20 - 1 ; col++) {
            if (
                taken[row][col] ||
                abs(row - messageRow) < 1 ||
                abs(row - level.definition.exit[0]) < 2 && abs(col - level.definition.exit[1]) < 2
            ) {
                continue;
            }

            let maybeAdd = (image, prerender) => {
                if (rng.floating() > 0.2) {
                    return;
                }

                // return () => {
                // Make sure the spot is free
                for (let takenRow = 0 ; takenRow < image.height / 40 ; takenRow++) {
                    for (let takenCol = 0 ; takenCol < image.width / 40 ; takenCol++) {
                        if (taken[row + takenRow][col + takenCol]) {
                            return;
                        }
                    }
                }

                // Mark them as taken
                for (let takenRow = 0 ; takenRow < image.height / 40 ; takenRow++) {
                    for (let takenCol = 0 ; takenCol < image.width / 40 ; takenCol++) {
                        taken[row + takenRow][col + takenCol] = 1;
                    }
                }

                //
                let x = toCellCoord(col);
                let y = toCellCoord(row);

                // Maybe do some prerendering
                if (prerender) {
                    prerender(x, y);
                }

                // Render the detail
                c.drawImage(
                    image,
                    x,
                    y
                );
            }

            let current = taken[row][col];
            let right = taken[row][col + 1];
            let below = taken[row + 1][col];
            let above = taken[row - 1][col];
            let belowBelow = taken[row + 2] && taken[row + 2][col];
            let belowRight = taken[row + 1][col + 1];

            // Trash and outlets just need floor
            if (!current && below) {
                maybeAdd(TRASH);
                maybeAdd(OUTLET);
            }

            // Lights need a ceiling to hang onto
            if (matrix[row - 1][col] && !matrix[row][col] && !matrix[row + 1][col] && !(col % 2)) {
                // No need to take extra room for lights
                c.drawImage(
                    LIGHT,
                    (col + 0.5) * 40 - LIGHT.width / 2,
                    row * 40
                );
            }

            // Frames and windows need two rows
            if (!below && belowBelow) {
                maybeAdd(FRAME);
                maybeAdd(WINDOW, (x, y) => {
                    c.clearRect(
                        x + (40 - UNPADDED_WINDOW.width) / 2,
                        y + (40 * 2 - UNPADDED_WINDOW.height) / 2,
                        UNPADDED_WINDOW.width,
                        UNPADDED_WINDOW.height
                    );
                });
            }

            // Desks need one row but two columns
            if (below && !right && belowRight) {
                maybeAdd(DESK);
            }
        }
    }
});

class Particle {
    constructor({
        x,
        y,
        duration = 1,
        color = '#f00',
        size = [5, 5],
        alpha = [1, -1],
        onFinish
    }) {
        this.color = color;
        this.size = size;

        interp(this, 'x', x[0], x[0] + x[1], duration);
        interp(this, 'y', y[0], y[0] + y[1], duration);
        interp(this, 'alpha', alpha[0], alpha[0] + alpha[1], duration);
        interp(this, 'size', size[0], size[0] + (size[1] || 0), duration, 0, 0, onFinish);
    }

    render() {
        R.globalAlpha = this.alpha;
        fs(this.color);
        fr(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}

class Menu {

    constructor(title, subtitle, footer) {
        this.title = title;
        this.subtitle = subtitle;
        this.footer = footer || '';

        this.titlePosition = this.subtitlePosition = 9999;
        this.dimAlpha = 0;
        this.dim = 1;
    }

    animateIn() {
        interp(this, 'titlePosition', -800, (800 / 2), 0.5, 0, easeOutQuint);
        interp(this, 'subtitlePosition', 2400, (800 / 2), 0.5, 1, easeOutQuint);
        interp(this, 'dimAlpha', 0, 1, 0.3);
    }

    animateOut() {
        interp(this, 'titlePosition', (800 / 2), 2400, 0.5, 0, easeInQuint);
        interp(this, 'subtitlePosition', (800 / 2), -800, 0.5, 0, easeInQuint, () => G.menu = 0);
        interp(this, 'dimAlpha', 1, 0, 0.3, 0.2);
    }

    render() {
        translate(
            (1600 - 800) / 2,
            (800 - 800) / 2
        );

        if (this.dim) {
            beginPath();
            rect(0, 0, 800, 800);
            clip();

            // Dim
            fs('rgba(0,0,0,' + this.dimAlpha * 0.8 + ')');
            fr(0, 0, 800, 800);
        }


        R.textAlign = 'center';
        R.textBaseline = 'middle';
        fs('#fff');

        R.font = italicFont(24);
        shadowedText(this.title, this.titlePosition, 800 / 2 - 25);

        R.font = italicFont(48);
        shadowedText(this.subtitle, this.subtitlePosition, 800 / 2 + 25);

        fs('#888');
        R.font = italicFont(16);
        shadowedText(this.footer, 800 / 2, 800 - 20);
    }

}

renderVision = (x, y, fromAngle, toAngle, maxDistance, color) => wrap(() => {
    R.fillStyle = R.strokeStyle = color;
    R.lineWidth = 2;

    beginPath();
    moveTo(x, y);

    let angleInterval = PI / 100;
    let subAngles = ceil(normalize(toAngle - fromAngle) / angleInterval);

    for (let i = 0 ; i <= subAngles ; i++) {
        let angle = (i / subAngles) * (toAngle - fromAngle) + fromAngle;

        // For all angles in between, round them so that it looks a bit better when the vision is
        // interpolated.
        if (i && i < subAngles) {
            angle = roundToNearest(angle, angleInterval);
        }

        let impact = castRay(x, y, angle, maxDistance);
        lineTo(impact.x, impact.y);
    }

    closePath();

    R.globalAlpha = 0.3;
    fill();

    R.globalAlpha = 0.8;
    stroke();
});

let legLength = 6;
let visualRadius = 15 + 2;
let bodyWidth = visualRadius * 2 - 8;
let bodyHeight = visualRadius * 2 - 4;

createCharacterBody = instructions => createCanvas(bodyWidth, bodyHeight + legLength, (c, can) => {
    c.fs('#000');

    c.beginPath();
    c.roundedRectangle(
        0,
        0,
        can.width,
        bodyHeight,
        6
    );
    c.fill();

    c.globalCompositeOperation = /*nomangle*/'source-atop'/*/nomangle*/;

    instructions(c, can);
});

PLAYER_BODY = createCharacterBody((c, can) => {
    // Skin
    c.fs('#daab79');
    c.fr(can.width, 6, -bodyWidth / 2 - 4, 6);

    // Belt
    c.fs('#400');
    c.fr(0, bodyHeight - 10, 99, 4);
});

GUARD_BODY = createCharacterBody((c, can) => {
    // Shirt
    c.fs('#a3b5ce');
    c.fr(0, 0, 99, 99);

    // Skin
    c.fs('#daab79');
    c.fr(0, 0, 99, 14);

    // Pants
    c.fs('#010640');
    c.fr(0, 25, 99, 99);

    // Tie
    c.fs('#f00');
    c.fr(bodyWidth - 6, 14, 2, 10);
});

renderCharacter = (
    context,
    clock,
    body,
    legs,
    facing,
    walking,
    jumpRatio
) => {
    context.scale(facing, 1);

    wrap(() => {
        // Bobbing
        if (walking) {
            context.rotate(
                sin(clock * PI * 2 / 0.25) * PI / 32
            );
        }

        // Flip animation
        context.rotate(jumpRatio * PI * 2);

        context.translate(-body.width / 2, -body.height / 2);
        context.drawImage(body, 0, 0);

        renderEyes(context, clock);
    });

    // Legs
    if (legs) {
        renderLegs(context, clock, walking);
    }
};

renderEyes = (context, clock) => {
    context.fs('#000');

    let moduloTime = clock % 4;
    let middleBlinkTime = 3.85;
    let eyeScale = min(1, max(-moduloTime + middleBlinkTime, moduloTime - middleBlinkTime) / (0.3 / 2));

    context.fr(bodyWidth - 1, 7, -4, 4 * eyeScale);
    context.fr(bodyWidth - 8, 7, -4, 4 * eyeScale);
};

renderLegs = (context, clock, walking) => {
    context.fs('#000');

    let legLengthRatio = sin(clock * PI * 2 / 0.25) * 0.5 + 0.5;
    let leftRatio = walking ? legLengthRatio : 1
    let rightRatio = walking ? 1 - legLengthRatio : 1;
    context.fr(-8, visualRadius - legLength, 4, leftRatio * legLength);
    context.fr(8, visualRadius - legLength, -4, rightRatio * legLength);
}

renderBandana = (context, characterPosition, bandanaTrail) => {
    R.lineWidth = 8;
    R.strokeStyle = '#000';
    R.lineJoin = 'round';
    beginPath();
    moveTo(characterPosition.x, characterPosition.y);

    let remainingLength = 50;

    for (let i = 0 ; i < bandanaTrail.length && remainingLength > 0 ; i++) {
        let current = bandanaTrail[i];
        let previous = bandanaTrail[i - 1] || characterPosition;

        let actualDistance = dist(current, previous);
        let renderedDist = min(actualDistance, remainingLength);
        remainingLength -= renderedDist;
        let ratio = renderedDist / actualDistance;

        lineTo(
            previous.x + ratio * (current.x - previous.x),
            previous.y + ratio * (current.y - previous.y)
        );
    }
    stroke();
};

class Player {
    constructor(level, x, y) {
        this.level = level;
        this.x = x;
        this.y = y;
        this.previous = {};

        this.vX = this.vY = 0;
        this.facing = 1;
        this.walking = 0;
        this.facingScale = 1;

        this.jumpHoldTime = 0;
        this.jumpReleased = 1;
        this.jumpStartY = 0;
        this.jumpEndY = 0;
        this.jumpPeakTime = 0;
        this.lastLanded = {'x':0, 'y': 0};
        this.lastWallStick = {'x':0, 'y': 0, 'direction': 0};

        this.stickingToWallX = 0;

        this.clock = 0;

        this.bandanaTrail = [];
    }

    get landed() {
        let leftX = this.x - 15;
        let rightX = this.x + 15 - 1; // -1 so we can't jump off a wall
        let bottomY = this.y + 15 + 1;

        return hasBlock(leftX, bottomY) || hasBlock(rightX, bottomY);
    }

    get canJump() {
        // Don't jump until the player has release the jump key
        if (!this.jumpReleased) {
            return 0;
        }

        // Avoid double jumping unless we're sticking to a wall
        if (this.isRising && !this.sticksToWall) {
            return 0;
        }

        // If the user hasn't landed recently, don't let us jump
        if (dist(this, this.lastLanded) > 5 && abs(this.x - this.lastWallStick.x) > 20) {
            return 0;
        }

        return 1;
    }

    get isRising() {
        return this.clock < this.jumpStartTime + this.jumpPeakTime;
    }

    cycle(e) {
        let remaining = e;
        do {
            let sub = min(remaining, 1 / 60);
            remaining -= sub;
            this.subCycle(sub);
        } while (remaining > 0);
    }

    subCycle(e) {
        // Save the previous state
        this.previous.x = this.x;
        this.previous.y = this.y;
        this.previous.clock = this.clock;
        this.previous.facing = this.facing;
        this.previous.landed = this.landed;
        this.previous.jumpHoldTime = this.jumpHoldTime;

        this.clock += e;

        let holdingJump = INPUT.jump();
        this.jumpReleased = this.jumpReleased || !holdingJump;

        if (holdingJump) {
            this.jumpHoldTime += e;
        } else {
            this.jumpHoldTime = 0;
        }

        if (holdingJump && this.canJump) {
            this.jumpReleased = 0;
            this.jumpStartY = this.y;
            this.jumpStartTime = this.clock;

            if (this.sticksToWall) {
                this.vX = this.lastWallStick.direction * 800;
            }

            // Fixes a walljump issue: vY would keep accumulating even though a new jump was
            // started, causing bad physics once the jump reaches its peak.
            this.vY = 0;

            jumpSound();
        }

        if (holdingJump && !this.jumpReleased) {
            let jumpHoldRatio = min(this.jumpHoldTime, 0.2) / 0.2;
            let steppedRatio = max(0.33, roundToNearest(jumpHoldRatio, 0.33));
            let height = 40 / 2 + steppedRatio * 40 * 3;

            this.jumpPeakTime = 0.1 + 0.2 * steppedRatio;
            this.jumpEndY = this.jumpStartY - height;
        }

        if (this.isRising) {
            // Rise up
            let jumpRatio = (this.clock - this.jumpStartTime) / this.jumpPeakTime;
            this.y = easeOutQuad(jumpRatio) * (this.jumpEndY - this.jumpStartY) + this.jumpStartY;
        } else {
            // Fall down
            let gravity = this.sticksToWall && this.vY > 0 ? 100 : 4000;
            this.vY = max(0, this.vY + gravity * e);
            if (this.sticksToWall) {
                this.vY = min(this.vY, 200);
            }

            this.y += this.vY * e;
        }

        // Left/right
        let dX = 0, targetVX = 0;
        if (INPUT.left()) {
            dX = -1;
            targetVX = -400;
        }
        if (INPUT.right()) {
            dX = 1;
            targetVX = 400;
        }

        if (this.landed && dX) {
            this.facing = dX;
        }
        if (this.facing != this.previous.facing) {
            interp(this, 'facingScale', -1, 1, 0.1);
        }
        this.walking = dX;

        let horizontalAcceleration = this.landed ? 3000 : 3000;
        this.vX += limit(
            -horizontalAcceleration * e,
            targetVX - this.vX,
            horizontalAcceleration * e
        );
        this.x += this.vX * e;

        this.readjust();

        if (this.landed) {
            this.lastLanded.x = this.x;
            this.lastLanded.y = this.y;
        }

        // Bandana gravity
        this.bandanaTrail.forEach(position => position.y += e * 100);

        // Bandana
        let newTrail = this.bandanaTrail.length > 100 ? this.bandanaTrail.pop() : {};
        newTrail.x = this.x - this.facing * 5;
        newTrail.y = this.y - 10 + rnd(-3, 3) * sign(this.vX);
        this.bandanaTrail.unshift(newTrail);

        // Trail
        if (!this.landed && !this.sticksToWall && this.level.clock) {
            let { renderCharacterParams, x, y } = this;

            let renderable = {
                'render': () => {
                    R.globalAlpha = renderable.alpha;
                    translate(x, y);
                    renderCharacter.apply(0, renderCharacterParams);
                }
            };

            this.level.renderables.push(renderable);
            interp(renderable, 'alpha', 0.1, 0, 0.5, 0.2, 0, () => {
                remove(this.level.renderables, renderable);
            });
        }

        if (this.sticksToWall) {
            for (let i = 0 ; i < 10 ; i++) {
                this.level.particle({
                    'size': [6],
                    'color': '#fff',
                    'duration': rnd(0.4, 0.8),
                    'x': [this.x - this.sticksToWall * 15, rnd(-20, 20)],
                    'y': [this.y + rnd(-15, 15), rnd(-20, 20)]
                });
            }
        }
    }

    goToClosestAdjustment(reference, adjustments) {
        let closestAdjustment,
            closestAdjustmentDistance = 999;
        for (let i = 0 ; i < adjustments.length ; i++) {
            let distance = dist(reference, adjustments[i]);
            if (distance < closestAdjustmentDistance) {
                closestAdjustment = adjustments[i];
                closestAdjustmentDistance = distance;
            }
        }

        if (closestAdjustment) {
            this.x = closestAdjustment.x;
            this.y = closestAdjustment.y;
        }

        return closestAdjustment;
    }

    allSnapAdjustments() {
        let leftX = this.x - 15;
        let rightX = this.x + 15;
        let topY = this.y - 15;
        let bottomY = this.y + 15;

        let leftCol = toCellUnit(leftX);
        let rightCol = toCellUnit(rightX);
        let topRow = toCellUnit(topY);
        let bottomRow = toCellUnit(bottomY);

        let topLeft = hasBlock(leftX, topY);
        let topRight = hasBlock(rightX, topY);
        let bottomLeft = hasBlock(leftX, bottomY);
        let bottomRight = hasBlock(rightX, bottomY);

        let snapX = [this.previous.x, this.x];
        let snapY = [this.previous.y, this.y];
        for (let col = leftCol ; col <= rightCol ; col++) {
            snapX.push(
                col * 40 + 15,
                (col + 1) * 40 - 15 - 0.0001
            );
        }
        for (let row = topRow ; row <= bottomRow ; row++) {
            snapY.push(
                row * 40 + 15,
                (row + 1) * 40 - 15 - 0.0001
            );
        }

        let res = [];
        snapX.forEach((x) => snapY.forEach((y) => {
            if (!hasBlock(x, y, 15)) {
                res.push({
                    'x': x,
                    'y': y
                });
            }
        }));
        return res;
    }

    dust(y) {
        for (let i = 0 ; i < 10 ; i++) {
            this.level.particle({
                'size': [8],
                'color': '#fff',
                'duration': rnd(0.4, 0.8),
                'x': [this.x + rnd(-15, 15), rnd(-20, 20)],
                'y': [y, sign(this.y - y) * rnd(15, 10)]
            });
        }

        // This function is only called when landing or tapping, we can safely play the sound
        landSound();
    }

    spawn() {
        for (let i = 0 ; i < 100 ; i++) {
            this.level.particle({
                'size': [10, -10],
                'color': '#000',
                'duration': rnd(1, 2),
                'x': [this.x + rnd(-15, 15) * 1.5, rnd(-20, 20)],
                'y': [this.y + rnd(-15, 15) * 1.5, rnd(-20, 20)]
            });
        }
    }

    readjust() {
        // Desired position
        let { x, y } = this;

        let allAdjustments = this.allSnapAdjustments();
        let adjustment = this.goToClosestAdjustment(this, allAdjustments);

        if (this.landed) {
            // Landed, reset the jump
            this.vY = min(0, this.vY);

            if (!this.previous.landed) {
                this.dust(this.y + 15);
                this.jumpStartTime = -1;
            }
        } else if (this.y > y) {
            this.dust(this.y - 15);

            // Tapped its head, cancel all jump
            this.vY = max(0, this.vY);
            this.jumpStartTime = -1;
        }

        let hitWall = this.x != x;
        let adjustmentDirectionX = sign(this.x - x)

        // Player hit a wall in the face, reset horizontal momentum
        if (hitWall && adjustmentDirectionX != sign(this.vX)) {
            this.vX = 0;
        }

        // Player hit a wall and isn't on the floor, stick to the wall
        if (hitWall && !this.landed) {
            this.sticksToWall = adjustmentDirectionX;
        }

        // Player has landed or is moving horizontally without hitting a wall, stop sticking to a wall
        if (this.landed || this.x != this.previous.x && !hitWall) {
            this.sticksToWall = 0;
        }

        // No block on the left or right, cancel wall sticking
        let leftX = this.x - 15 - 1;
        let rightX = this.x + 15 + 1;
        if (!hasBlock(leftX, this.y) && !hasBlock(rightX, this.y)) {
            this.sticksToWall = 0;
        }

        if (this.sticksToWall) {
            this.lastWallStick.x = this.x;
            this.lastWallStick.y = this.y;
            this.lastWallStick.direction = this.sticksToWall;
        }
    }

    get renderCharacterParams() {
        return [
            R,
            this.level.clock,
            PLAYER_BODY,
            this.landed,
            this.facing * this.facingScale,
            this.walking,
            limit(0, (this.clock - this.jumpStartTime) / this.jumpPeakTime, 1)
        ];
    }

    render() {
        renderBandana(R, this, this.bandanaTrail);

        // Then render the actual character
        wrap(() => {
            // R.globalAlpha = this.canJump ? 1 : 0.5;
            translate(this.x, this.y);
            renderCharacter.apply(0, this.renderCharacterParams);
        });
    }
}

class Exit {
    constructor(level, x, y) {
        this.level = level;
        this.x = x;
        this.y = y;
    }

    cycle(e) {
        if (this.level.player && dist(this, this.level.player) < 40 / 2) {
            this.level.foundExit();
        }
    }

    render() {
        wrap(() => {
            translate(this.x, this.y);
            drawImage(HALO, -HALO.width / 2, -HALO.height / 2);

            [G.clock * PI, -G.clock * PI / 2, G.clock * PI / 4].forEach(angle => {
                wrap(() => {
                    rotate(angle);
                    drawImage(GOD_RAY, -GOD_RAY.width / 2, -GOD_RAY.height / 2);
                });
            });
        });

        let height = COMPUTER.height + UNPADDED_DESK.height;
        // translate(this.x, this.y);

        let row = toCellUnit(this.y);
        translate(this.x, (row + 1) * 40 - height);

        drawImage(COMPUTER, -COMPUTER.width / 2, 0);
        drawImage(UNPADDED_DESK, -UNPADDED_DESK.width / 2, COMPUTER.height);
    }
}

class PlayerSpotter {
    constructor(level) {
        this.level = level;
        this.angle = 0;
        this.halfFov = 0;
        this.maxDistance = 100;
        this.radius = 0;
    }

    get appliedMaxDistance() {
        return G.difficulty.visionFactor * this.maxDistance;
    }

    cycle() {
        if (!this.foundPlayer) {
            this.foundPlayer = this.seesPlayer;
            if (this.foundPlayer) {
                this.level.wasFound();
            }
        }
    }

    get seesPlayer() {
        if (G.difficulty.noSpotters) {
            return 0;
        }

        // Check if the player is close enough, and within the FOV first
        let angleToPlayer = angleBetween(this, this.level.player);
        let distToPlayer = dist(this, this.level.player);

        if (true && getDebugValue('invisible')) {
            return 0;
        }

        if (distToPlayer < 15 + this.radius) {
            return 1;
        }

        if (abs(normalize(this.angle - angleToPlayer)) > this.halfFov || distToPlayer > this.appliedMaxDistance) {
            return 0;
        }

        let impact = castRay(this.x, this.y, angleToPlayer, this.appliedMaxDistance);
        return dist(this, impact) >= distToPlayer;
    }

    render() {
        let visionColor = this.foundPlayer ? '#f00': '#ff0';
        if (G.difficulty.noSpotters) {
            visionColor = '#888';
        }

        renderVision(
            this.x,
            this.y,
            this.angle - this.halfFov,
            this.angle + this.halfFov,
            this.appliedMaxDistance,
            visionColor
        );
    }
}

class Camera extends PlayerSpotter {
    constructor(level, cycleDefinition) {
        super(level);
        this.cycleDefinition = cycleDefinition;
        this.maxDistance = 400;
        this.halfFov = 0.4;
    }

    cycle(e) {
        if (!this.foundPlayer) {
            this.cycleDefinition.update(this, this.level.clock);
        }

        super.cycle(e);
    }

    render() {
        super.render();

        wrap(() => {
            translate(this.x, this.y);
            rotate(this.angle);

            fs('#888');
            fr(-10, -5, 20, 10);

            fs('#444');
            fr(10, -2, 4, 4);

            fs(this.level.clock % 2 > 1 ? '#f00' : '#0f0');
            fr(6, -3, 2, 2);
        });
    }
}

class Guard extends PlayerSpotter {
    constructor(level, cycleDefinition) {
        super(level);
        this.cycleDefinition = cycleDefinition;
        this.maxDistance = 200;
        this.halfFov = 0.7;
        this.facing = 1;
        this.facingScale = 1;
        this.radius = 7.5;
    }

    cycle(e) {
        let { facing } = this;

        if (!this.foundPlayer) {
            this.cycleDefinition.update(this, this.level.clock);
        } else {
            this.facing = sign(this.level.player.x - this.x);
            this.walking = 0;
        }

        // If the guard is facing back, add a quick 180 degrees
        this.angle = this.facing > 0 ? 0 : PI;

        super.cycle(e);

        if (facing != this.facing) {
            interp(this, 'facingScale', -1, 1, 0.1);
            interp(this, 'maxDistance', 0, 200, 0.2);
        }
    }

    render() {
        super.render();

        wrap(() => {
            translate(this.x, this.y);

            renderCharacter(
                R,
                this.level.clock,
                GUARD_BODY,
                1,
                this.facing * this.facingScale,
                this.walking,
                0
            );
        });
    }
}

class Cycle {
    constructor() {
        this.items = [];
        this.totalDuration = 0;
        this.phase = 0;
    }

    withPhase(phase) {
        this.phase = phase;
        return this;
    }

    add(duration, action) {
        this.items.push([duration, this.totalDuration, action]);
        this.totalDuration += duration;
        return this;
    }

    update(element, clock) {
        this.constants(element);

        if (!this.items.length) {
            return;
        }

        let progressInCycle = (this.phase + clock + this.totalDuration) % this.totalDuration;

        // Find which item is currently relevant
        let index = this.items.length - 1;
        while (this.items[index][1] > progressInCycle) {
            index--;
        }

        // Find the progress within that item
        let [duration, startTime, update] = this.items[index];
        let progressWithinItem = progressInCycle - startTime;
        let progressRatio = progressWithinItem / duration;

        update(element, progressRatio);
    }
}

class CameraCycle extends Cycle {
    constructor(row, col, angle) {
        super();
        this.lastAngle = angle;
        this.x = toMiddleCellCoord(col);
        this.y = toMiddleCellCoord(row);
    }

    wait(duration) {
        let { lastAngle } = this;
        return this.add(duration, camera => {
            camera.angle = lastAngle;
        });
    }

    rotateTo(duration, toAngle) {
        let { lastAngle } = this;
        this.lastAngle = toAngle;
        return this.add(duration, (camera, ratio) => {
            camera.angle = ratio * (toAngle - lastAngle) + lastAngle;
        });
    }

    rotateBy(duration, angleOffset) {
        return this.rotateTo(duration, this.lastAngle + angleOffset);
    }

    constants(camera) {
        camera.x = this.x;
        camera.y = this.y;
        camera.angle = this.lastAngle;
    }

    patrol(rotationDuration, toAngle, pauseDuration) {
        let { lastAngle } = this;
        return this.wait(pauseDuration).rotateTo(rotationDuration, toAngle).wait(pauseDuration).rotateTo(rotationDuration, lastAngle);
    }
}

class GuardCycle extends Cycle {
    constructor(row, col) {
        super();
        this.lastFacing = 1;
        this.lastX = toMiddleCellCoord(col);
        this.y = toMiddleCellCoord(row) + 5;
    }

    wait(duration) {
        let { lastFacing, lastX } = this;
        return this.add(duration, guard => {
            guard.walking = 0;
            guard.x = lastX;
        });
    }

    walkTo(col) {
        let { lastX } = this;
        let x = toMiddleCellCoord(col);
        let duration = abs(this.lastX - x) / 80;
        let facing = sign(x - lastX);
        this.lastX = x;
        this.lastFacing = facing;
        return this.add(duration, (guard, ratio) => {
            guard.facing = facing;
            guard.walking = 1;
            guard.x = ratio * (x - lastX) + lastX;
        });
    }

    constants(guard) {
        guard.y = this.y;
        guard.x = this.lastX;
    }

    patrol(pauseFrom, toCol, pauseTo) {
        let fromCol = toCellUnit(this.lastX);
        return this.wait(pauseFrom).walkTo(toCol).wait(pauseTo).walkTo(fromCol);
    }
}

class Level {
    constructor(index, definition) {
        this.index = index;
        this.definition = definition;

        this.deathCount = 0;

        this.backgroundColor = LEVEL_COLORS[index % LEVEL_COLORS.length];
        this.obstacleColor = darken(this.backgroundColor, 0.2);

        this.stop();
    }

    endWith(f) {
        if (!this.ended) {
            this.ended = 1;
            f();
        }
    }

    foundExit() {
        this.endWith(() => {
            exitSound();

            let hasNextLevel = LEVELS[this.index + 1];
            G.menu = new Menu(
                pick([
                    /*nomangle*/'SEARCHING FOR EVIL PLANS...'/*/nomangle*/,
                    /*nomangle*/'GET http://evil.corp/plans.pdf'/*/nomangle*/,
                    /*nomangle*/'GET http://localhost/evil-plans.pdf'/*/nomangle*/,
                    /*nomangle*/'BROWSING FILES...'/*/nomangle*/,
                ]),
                hasNextLevel ? pick([
                    /*nomangle*/'404 NOT FOUND'/*/nomangle*/,
                    /*nomangle*/'FILE NOT FOUND'/*/nomangle*/,
                    /*nomangle*/'NOTHING HERE'/*/nomangle*/,
                ]) : /*nomangle*/'200 FOUND!'/*/nomangle*/
            );
            G.menu.animateIn();

            setTimeout(() => {
                (hasNextLevel ? notFoundSound : finishSound)();
            }, 1000);

            setTimeout(() => {
                G.menu.animateOut();
            }, 2000);

            setTimeout(() => {
                if (hasNextLevel) {
                    G.nextLevel();
                } else {
                    G.endAnimation();
                }
            }, 2500);
        });
    }

    wasFound() {
        this.endWith(() => {
            this.deathCount++;

            G.menu = new Menu(
                /*nomangle*/'YOU WERE FOUND!'/*/nomangle*/,
                /*nomangle*/'PRESS [R] TO TRY AGAIN'/*/nomangle*/,
                DIFFICULTY_INSTRUCTION.toUpperCase()
            );
            G.menu.animateIn();

            failSound();

            setTimeout(() => {
                if (this.ended) {
                    this.waitingForRetry = 1;
                }
            }, 1000);
        });
    }

    prepare() {
        this.ended = 0;
        this.started = 0;

        this.clock = 0;

        this.cyclables = [];
        this.renderables = [];

        this.player = new Player(
            this,
            toMiddleCellCoord(this.definition.spawn[1]),
            toMiddleCellCoord(this.definition.spawn[0])
        );
        this.cyclables.push(this.player);

        let exit = new Exit(
            this,
            toMiddleCellCoord(this.definition.exit[1]),
            toMiddleCellCoord(this.definition.exit[0])
        );
        this.cyclables.push(exit);
        this.renderables.push(exit);

        this.definition.cameras.forEach(cameraDefinition => {
            let camera = new Camera(this, cameraDefinition);
            this.cyclables.push(camera);
            this.renderables.push(camera);
        });

        this.definition.guards.forEach(guardDefinition => {
            let guard = new Guard(this, guardDefinition);
            this.cyclables.push(guard);
            this.renderables.push(guard);
        });

        // Give cyclables a cycle so they're in place
        this.cyclables.forEach((cyclable) => {
            cyclable.cycle(0);
        });
    }

    start() {
        this.started = 1;

        this.player.spawn();
        this.renderables.push(this.player);
    }

    stop() {
        this.cyclables = [];
        this.renderables = [];
    }

    cycle(e) {
        e *= G.difficulty.timeFactor;

        if (this.started && !this.ended) {
            this.clock += e;
            this.cyclables.forEach(x => x.cycle(e));
        }

        if (INPUT.jump() && this.waitingForRetry || down[82] && this.started) {
            this.waitingForRetry = 0;
            if (G.menu) {
                G.menu.animateOut();

                if (!G.difficultyPromptShown && this.deathCount > 3) {
                    G.difficultyPromptShown = 1;
                    alert(DIFFICULTY_INSTRUCTION);
                }
            }
            this.prepare();

            setTimeout(() => this.start(), 1000);

            beepSound();
        }
    }

    render() {
        this.background = this.background || createLevelBackground(this);
        drawImage(this.background, 0, 0);

        if (true && getDebugValue('grid')) {
            R.fs('rgba(0,0,0,0.2)');
            for (let k = 0 ; k < 20 ; k++) {
                fr(0, k * 40, 20 * 40, 1);
                fr(k * 40, 0, 1, 20 * 40);
            }

            R.fs('#fff');
            R.textAlign = 'center';
            R.textBaseline = 'middle';
            R.font = '8pt Arial';
            for (let row = 0 ; row < 20 ; row++) {
                for (let col = 0 ; col < 20 ; col++) {
                    fillText(
                        `${row}-${col}`,
                        toMiddleCellCoord(col),
                        toMiddleCellCoord(row)
                    );
                }
            }
        }

        // Message
        wrap(() => {
            let ratio = limit(0, (this.clock - 1) * 3, 1);
            R.globalAlpha = ratio;
            translate(0, (1 - ratio) * -10);

            let [row, message] = this.definition.message || [0, ''];
            R.textAlign = 'center';
            R.textBaseline = 'middle';
            R.fs('rgba(255,255,255,0.7)');
            R.font = font(26);
            fillText(
                message,
                800 / 2,
                toMiddleCellCoord(row)
            );
        });

        // Renderables
        this.renderables.forEach(x => wrap(() => x.render()));

        // Matrix
        R.fs(this.obstacleColor);
        for (let row = 0 ; row < 20 ; row++) {
            for (let col = 0 ; col < 20 ; col++) {
                if (this.definition.matrix[row][col]) {
                    fr(col * 40, row * 40, 40, 40);
                }
            }
        }
    }

    particle(properties) {
        let particle;
        properties.onFinish = () => remove(this.renderables, particle);
        this.renderables.push(particle = new Particle(properties));
    }

}

LEVELS = [
    // First level, learn to jump
    {
        'matrix': revertOptimizeMatrix([[6,1,4,0],[6,2,4,0],[6,3,0,2],[6,11,0,8],[9,5,5,0],[9,6,0,3],[10,8,3,0],[12,9,0,4],[13,1,2,0],[13,2,2,0],[13,16,0,3],[16,10,0,7],[18,5,0,3]]),
        'spawn': [16, 2],
        'exit': [5, 17],
        'message': [3, /*nomangle*/'PRESS [SPACE] TO JUMP, HOLD TO JUMP HIGHER'/*/nomangle*/],
        'cameras': [],
        'guards': []
    },

    // Second level, learn to walljump
    {
        'matrix': revertOptimizeMatrix([[6,3,0,13],[7,7,7,0],[7,13,3,0],[7,14,3,0],[7,15,4,0],[9,1,0,3],[10,3,2,0],[11,11,8,0],[14,15,0,4],[17,6,0,5],[18,6,0,5],[18,12,0,7]]),
        'spawn': [16, 2],
        'exit': [5, 4],
        'message': [3, /*nomangle*/'WALL JUMPS GET YOU HIGHER'/*/nomangle*/],
        'cameras': [],
        'guards': []
    },

    // Third level, first cameras
    {
        'matrix': revertOptimizeMatrix([[2,11,0,4],[3,16,3,0],[4,4,5,0],[4,5,0,3],[5,11,1,0],[5,15,1,0],[7,2,0,2],[8,5,1,0],[8,8,0,11],[10,1,3,0],[10,2,3,0],[12,3,0,12],[13,3,4,0],[13,14,3,0],[15,8,0,4],[15,15,1,0],[16,4,0,2],[17,18,1,0]]),
        'spawn': [16, 2],
        'exit': [7, 17],
        'message': [13.5, /*nomangle*/'AVOID CAMERAS'/*/nomangle*/],
        'cameras': [
            new CameraCycle(16, 9.5, PI / 2),
            new CameraCycle(5, 6.5, PI * 3 / 4).patrol(2, PI / 4, 1),
            new CameraCycle(3, 12, PI / 2).patrol(2, PI / 9, 1)
        ],
        'guards': []
    },


    // Two guards - one camera (simple route but alternative is hard)
    {
        'matrix': revertOptimizeMatrix([[4,2,0,6],[4,10,0,3],[4,15,0,4],[5,3,0,3],[5,11,3,0],[5,16,3,0],[5,17,3,0],[5,18,3,0],[6,3,0,3],[7,4,0,5],[10,8,0,10],[11,2,0,2],[11,6,0,3],[12,3,3,0],[13,16,0,3],[16,8,0,3],[16,13,0,4],[17,10,1,0]]),
        'spawn': [17, 2],
        'exit': [3, 17],
        'message': [13, /*nomangle*/'OBSERVE PATROLS'/*/nomangle*/],
        'cameras': [
            new CameraCycle(4, 13.5, PI / 5).patrol(3, 4 * PI / 5, 1),
        ],
        'guards': [
            new GuardCycle(6, 6).patrol(2, 8, 2),
            new GuardCycle(15, 13).patrol(2, 16, 2),
        ]
    },

    // Cameras moving up and down
    {
        'matrix': revertOptimizeMatrix([[2,14,3,0],[3,1,0,10],[4,15,4,0],[4,16,0,2],[7,4,3,0],[7,8,3,0],[7,12,0,2],[7,18,3,0],[9,3,1,0],[9,5,0,3],[9,9,0,9],[11,1,4,0],[13,4,2,0],[14,2,0,2],[14,7,2,0],[14,8,2,0],[14,11,0,2],[14,15,0,2],[17,17,2,0],[17,18,2,0]]),
        'spawn': [16, 2],
        'exit': [3, 16],
        'message': [11, /*nomangle*/'STUDY THE PATTERNS'/*/nomangle*/],
        'cameras': [
            new CameraCycle(12.5, 5.5, PI / 2).wait(3).rotateBy(5, -PI * 2).withPhase(2),
            new CameraCycle(12.5, 9.5, PI / 2).wait(3).rotateBy(5, -PI * 2).withPhase(2.5),
            new CameraCycle(12.5, 13.5, PI / 2).wait(3).rotateBy(5, -PI * 2).withPhase(3),

            new CameraCycle(5, 14, PI * 7 / 8).patrol(1, PI / 2, 2),
        ],
        'guards': [
            new GuardCycle(2, 1).patrol(1, 10, 1),
        ]
    },

    // Simple level: avoid guards and cameras
    {
        'matrix': revertOptimizeMatrix([[3,8,0,2],[4,12,3,0],[4,13,1,0],[4,16,0,3],[5,17,4,0],[5,18,4,0],[6,5,0,7],[7,1,1,0],[9,6,0,2],[9,12,0,2],[10,2,0,2],[12,5,0,10],[13,5,3,0],[13,14,4,0],[13,17,0,2],[15,1,0,4],[15,9,0,2],[16,15,0,2],[18,8,0,4]]),
        'spawn': [16, 2],
        'exit': [3, 17],
        'cameras': [
            new CameraCycle(1, 8.5, PI / 4).patrol(2, PI * 2 / 3, 1),
        ],
        'guards': [
            new GuardCycle(17, 8).patrol(1, 11, 1),
            new GuardCycle(11, 5).patrol(1, 14, 1)
        ]
    },

    // Guards and camera
    {
        'matrix': revertOptimizeMatrix([[3,4,0,7],[3,12,0,2],[3,15,3,0],[4,7,2,0],[4,10,2,0],[5,4,1,0],[5,11,0,4],[5,16,0,3],[6,1,1,0],[8,6,3,0],[8,7,1,0],[8,10,0,5],[9,1,0,5],[9,12,1,0],[10,17,0,2],[13,9,0,3],[13,15,0,2],[16,5,0,4],[16,11,0,4],[16,17,0,2]]),
        'spawn': [16, 2],
        'exit': [4, 17],
        'cameras': [
            new CameraCycle(4.5, 5.5, 0).rotateBy(5, PI * 2)
        ],
        'guards': [
            new GuardCycle(15, 5).patrol(1, 8, 1),
            new GuardCycle(15, 11).patrol(1, 14, 1),
            new GuardCycle(2, 12).patrol(2.5, 13, 2.5),
        ]
    },

    // Wall jump past camera then jump between three guards
    {
        'matrix': revertOptimizeMatrix([[1,8,16,0],[1,9,7,0],[2,13,2,0],[3,14,0,3],[4,4,0,3],[5,6,14,0],[5,18,14,0],[7,2,0,2],[7,10,0,2],[7,16,12,0],[7,17,12,0],[10,1,6,0],[10,2,6,0],[10,3,6,0],[10,13,0,3],[13,9,0,3],[16,13,0,3]]),
        'spawn': [17, 2],
        'exit': [2, 15],
        'cameras': [
            new CameraCycle(5, 4.5, PI / 2).patrol(1, PI, 2),
        ],
        'guards': [
            new GuardCycle(15, 13).patrol(1, 15, 2.5),
            new GuardCycle(12, 11).patrol(1, 9, 2.5).withPhase(-0.5),
            new GuardCycle(9, 13).patrol(1, 15, 2.5).withPhase(-1)
        ]
    },

    // Zigzag
    {
        'matrix': revertOptimizeMatrix([[1,6,1,0],[1,18,4,0],[2,10,0,2],[3,11,0,4],[4,6,3,0],[4,17,1,0],[6,5,1,0],[6,7,0,2],[6,10,0,2],[7,11,2,0],[7,15,2,0],[7,16,4,0],[8,12,0,3],[9,3,0,2],[10,17,0,2],[12,5,0,8],[13,5,4,0],[13,12,4,0],[14,1,0,4],[14,13,3,0],[14,14,3,0],[15,8,0,2],[16,15,0,2],[18,8,0,2]]),
        'spawn': [16, 2],
        'exit': [2, 13],
        'cameras': [
            new CameraCycle(12, 1, 0).patrol(1, -PI / 3, 1),
            new CameraCycle(7, 18, PI / 2).patrol(1, PI * 5 / 4, 1)
        ],
        'guards': [
            new GuardCycle(17, 8).patrol(1.1, 9, 1.1)
        ]
    },

    // Two guards crossing each other
    {
        'matrix': revertOptimizeMatrix([[4,5,0,4],[4,11,0,2],[4,15,0,4],[5,1,0,2],[5,5,1,0],[6,16,1,0],[8,1,3,0],[8,2,3,0],[8,3,3,0],[9,9,4,0],[9,10,3,0],[9,13,3,0],[9,14,2,0],[10,4,0,5],[10,15,0,2],[11,11,0,2],[12,18,7,0],[14,5,0,3],[14,11,0,3],[15,3,2,0],[15,13,1,0],[15,15,4,0],[15,16,4,0],[15,17,4,0],[16,1,0,2],[17,6,0,7]]),
        'spawn': [14, 2],
        'exit': [3, 17],
        'cameras': [
            new CameraCycle(10, 11.5, PI / 2).wait(1).rotateBy(1, PI).wait(1).rotateBy(1, PI)
        ],
        'guards': [
            new GuardCycle(16, 6).patrol(2, 12, 2),
            new GuardCycle(16, 12).patrol(2, 6, 2),
            new GuardCycle(7, 1).patrol(1, 3, 1),
        ]
    },

    // Two cameras and two guards + one guarding the exit
    {
        'matrix': revertOptimizeMatrix([[3,6,3,0],[4,14,2,0],[5,4,0,2],[5,9,0,3],[5,15,0,2],[8,3,0,5],[8,12,0,3],[8,17,0,2],[9,5,3,0],[9,6,3,0],[9,13,3,0],[9,14,3,0],[11,1,2,0],[11,2,1,0],[11,15,0,2],[14,4,0,3],[14,13,3,0],[14,14,3,0],[14,15,1,0],[15,5,4,0],[15,6,2,0],[16,1,0,2],[16,7,0,3],[16,12,1,0],[16,17,0,2]]),
        'spawn': [18, 2],
        'exit': [18, 8],
        'message': [9.5, /*nomangle*/'BE PATIENT'/*/nomangle*/],
        'cameras': [
            new CameraCycle(13, 8, PI).patrol(1, PI / 2, 3),
            new CameraCycle(13, 11, PI / 2).patrol(1, 0, 3),
        ],
        'guards': [
            new GuardCycle(7, 7).patrol(2, 3, 2),
            new GuardCycle(7, 12).patrol(2, 14, 2),
            new GuardCycle(18, 6).patrol(0, 18, 0).withPhase(2)
        ]
    },

    // Walljump steps
    {
        'matrix': revertOptimizeMatrix([[3,6,6,0],[4,1,0,3],[4,7,4,0],[4,8,1,0],[4,10,0,3],[5,11,0,3],[5,16,0,3],[6,11,0,2],[8,4,5,0],[8,5,1,0],[8,11,0,4],[10,17,0,2],[12,1,0,3],[12,7,0,5],[13,13,0,3],[16,4,0,5],[16,11,0,3],[16,17,0,2]]),
        'spawn': [18, 2],
        'exit': [11, 2],
        'cameras': [
            new CameraCycle(13.5, 9.5, PI * 5 / 6).patrol(1, PI / 2, 1),
            new CameraCycle(9, 12.5, PI / 6).patrol(1, PI * 5 / 6, 1),
        ],
        'guards': [
            new GuardCycle(4, 18).patrol(1, 16, 1),
            new GuardCycle(3, 1).patrol(1, 3, 1)
        ]
    },

    // Shortcut over guard
    {
        'matrix': revertOptimizeMatrix([[3,6,0,4],[4,3,2,0],[4,4,1,0],[4,9,9,0],[4,16,2,0],[5,2,1,0],[5,10,0,6],[7,4,1,0],[8,1,6,0],[8,6,0,3],[8,13,8,0],[8,14,0,2],[9,5,0,4],[10,2,4,0],[10,7,3,0],[10,8,3,0],[12,3,2,0],[12,4,1,0],[12,17,0,2],[15,6,4,0],[15,7,0,3],[17,5,2,0]]),
        'spawn': [18, 2],
        'exit': [18, 8],
        'cameras': [
            new CameraCycle(4, 8, PI / 2).patrol(1, PI * 4 / 5, 1),
            new CameraCycle(13, 17, PI * 3 / 4).patrol(1, PI / 2, 1).withPhase(-0.5),
        ],
        'guards': [
            new GuardCycle(14, 6).patrol(1, 9, 1),
            new GuardCycle(4, 10).patrol(1, 15, 1),
        ]
    },

    // Weird level, not sure what's up
    {
        'matrix': revertOptimizeMatrix([[3,1,0,5],[3,7,0,6],[3,15,0,4],[5,3,0,2],[6,1,1,0],[6,4,6,0],[6,8,1,0],[6,11,1,0],[6,13,4,0],[6,14,3,0],[6,15,0,2],[7,3,1,0],[8,5,2,0],[8,6,2,0],[8,17,0,2],[9,7,0,2],[9,11,0,2],[11,2,0,2],[11,14,0,3],[12,3,2,0],[12,8,0,4],[14,12,2,0],[14,13,2,0],[14,16,3,0],[15,5,0,3],[16,6,0,2],[16,17,1,0],[18,1,0,3],[18,9,0,2]]),
        'spawn': [17, 2],
        'exit': [2, 2],
        'cameras': [
            new CameraCycle(12, 14.5, PI * 92 / 128).patrol(1, PI / 4, 1.5),
            new CameraCycle(4, 10, PI / 4).patrol(1, PI * 4 / 5, 1.5),
        ],
        'guards': [
            new GuardCycle(14, 5).patrol(1, 7, 1),
            new GuardCycle(2, 15).patrol(3, 18, 3),
        ]
    },

    // Stairs with guards
    {
        'matrix': revertOptimizeMatrix([[1,1,4,0],[1,2,4,0],[1,12,9,0],[3,6,0,3],[6,7,1,0],[6,15,0,2],[7,4,0,2],[7,9,4,0],[7,10,1,0],[8,5,3,0],[9,13,1,0],[10,1,0,2],[10,6,0,3],[10,16,0,3],[11,7,8,0],[11,18,8,0],[13,2,0,4],[13,14,0,4],[14,16,5,0],[14,17,5,0],[16,1,0,2],[16,5,0,2],[16,12,0,4],[17,12,0,4],[18,12,0,4]]),
        'spawn': [18, 1],
        'exit': [5, 15.5],
        'cameras': [
            new CameraCycle(14, 3.5, PI * 3 / 4).patrol(1.5, PI / 4, 1),
            new CameraCycle(4, 7, PI * 3 / 4).patrol(1, PI / 4, 1),
        ],
        'guards': [
            new GuardCycle(12, 5).patrol(1, 2, 1),
            new GuardCycle(15, 15).patrol(2, 12, 0),
            new GuardCycle(12, 17).patrol(2, 14, 0),
        ]
    },

    // Alternate wall jumps
    {
        'matrix': revertOptimizeMatrix([[2,11,0,5],[3,7,16,0],[3,11,2,0],[3,15,4,0],[4,1,0,4],[6,8,0,6],[7,13,2,0],[8,1,0,4],[8,14,0,4],[10,10,7,0],[10,15,4,0],[10,16,0,3],[12,1,0,4],[12,14,2,0],[16,1,0,4],[16,11,0,5]]),
        'spawn': [18, 2],
        'exit': [18, 9],
        'cameras': [
            new CameraCycle(13, 1, PI / 3).patrol(1, 2 * PI / 3, 1),
            new CameraCycle(9, 1, PI * 2 / 3).patrol(1, PI / 3, 1),
            new CameraCycle(5, 1, PI / 3).patrol(1, 2 * PI / 3, 1),
            new CameraCycle(3, 12, PI / 2).wait(4).rotateTo(1, 0).wait(1).rotateTo(1, PI / 2),
            new CameraCycle(7, 8, 0).patrol(1, PI / 2, 1),
            new CameraCycle(11, 17, PI * 3 / 4).wait(5).rotateTo(1, PI / 3).wait(1).rotateTo(1, PI * 3 / 4),
        ],
        'guards': []
    },

    // Final level: a million routes
    {
        'matrix': revertOptimizeMatrix([[2,3,3,0],[2,8,4,0],[3,4,0,2],[3,7,1,0],[4,9,0,5],[4,15,0,4],[5,15,1,0],[6,3,4,0],[6,4,1,0],[8,7,0,6],[8,14,2,0],[8,15,1,0],[9,7,1,0],[11,17,0,2],[12,9,2,0],[13,5,2,0],[13,6,1,0],[13,10,2,0],[13,14,2,0],[14,1,0,4],[14,11,0,3],[16,17,0,2],[17,9,2,0],[17,10,2,0]]),
        'spawn': [16, 2],
        'exit': [3, 11],
        'message': [10.5, /*nomangle*/'THIS IS IT'/*/nomangle*/],
        'cameras': [
            new CameraCycle(17, 18, PI / 2).patrol(1, 8 * PI / 9, 1),
            new CameraCycle(5, 9, PI / 6).wait(4).rotateTo(1, PI / 2).wait(1).rotateTo(1, PI / 6),
        ],
        'guards': [
            new GuardCycle(13, 11).patrol(1, 13, 1),
            new GuardCycle(3, 13).patrol(1, 9, 1),
            new GuardCycle(13, 1).patrol(1, 4, 1),
        ]
    }

].map((definition, i) => new Level(i, definition));

if (true) {
    LEVELS = LEVELS.slice(0, getDebugValue('levelCount', 0) || LEVELS.length);
}

MAX_LEVEL_ALTITUDE = LEVELS.length * 800 + 0 - 800;

/**
* SfxrParams
*
* Copyright 2010 Thomas Vian
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* @author Thomas Vian
*/
/** @constructor */
function SfxrParams() {
    //--------------------------------------------------------------------------
    //
    //  Settings String Methods
    //
    //--------------------------------------------------------------------------

    /**
    * Parses a settings array into the parameters
    * @param array Array of the settings values, where elements 0 - 23 are
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
    * @return If the string successfully parsed
    */
    this.setSettings = function(values){
        for(var i = 0 ; i < 24 ; i++){
            this[String.fromCharCode(97 + i)] = values[i] || 0;
        }

        // I moved this here from the reset(1) function
        if (this.c < 0.01) {
            this.c = 0.01;
        }

        var totalTime = this.b + this.c + this.e;
        if (totalTime < 0.18) {
            var multiplier = 0.18 / totalTime;
            this.b *= multiplier;
            this.c *= multiplier;
            this.e *= multiplier;
        }
    };
}

/**
* SfxrSynth
*
* Copyright 2010 Thomas Vian
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* @author Thomas Vian
*/
/** @constructor */
function SfxrSynth() {
    // All variables are kept alive through function closures

    //--------------------------------------------------------------------------
    //
    //  Sound Parameters
    //
    //--------------------------------------------------------------------------

    this._params = new SfxrParams();  // Params instance

    //--------------------------------------------------------------------------
    //
    //  Synth Variables
    //
    //--------------------------------------------------------------------------

    var _envelopeLength0, // Length of the attack stage
        _envelopeLength1, // Length of the sustain stage
        _envelopeLength2, // Length of the decay stage

        _period,          // Period of the wave
        _maxPeriod,       // Maximum period before sound stops (from minFrequency)

        _slide,           // Note slide
        _deltaSlide,      // Change in slide

        _changeAmount,    // Amount to change the note by
        _changeTime,      // Counter for the note change
        _changeLimit,     // Once the time reaches this limit, the note changes

        _squareDuty,      // Offset of center switching point in the square wave
        _dutySweep;       // Amount to change the duty by

    //--------------------------------------------------------------------------
    //
    //  Synth Methods
    //
    //--------------------------------------------------------------------------

    /**
    * Resets the runing variables from the params
    * Used once at the start (total reset) and for the repeat effect (partial reset)
    */
    this.resetManglable = function() {
        // Shorter reference
        var p = this._params;

        _period       = 100 / (p.f * p.f + 0.001);
        _maxPeriod    = 100 / (p.g   * p.g   + 0.001);

        _slide        = 1 - p.h * p.h * p.h * 0.01;
        _deltaSlide   = -p.i * p.i * p.i * 0.000001;

        if(!p.a){
            _squareDuty = 0.5 - p.n / 2;
            _dutySweep  = -p.o * 0.00005;
        }

        _changeAmount = 1 + p.l * p.l * (p.l > 0 ? -0.9 : 10);
        _changeTime   = 0;
        _changeLimit  = p.m == 1 ? 0 : (1 - p.m) * (1 - p.m) * 20000 + 32;
    };

    // I split the reset() function into two functions for better readability
    this.totalReset = function() {
        this.resetManglable();

        // Shorter reference
        var p = this._params;

        // Calculating the length is all that remained here, everything else moved somewhere
        _envelopeLength0 = p.b  * p.b  * 100000;
        _envelopeLength1 = p.c * p.c * 100000;
        _envelopeLength2 = p.e   * p.e   * 100000 + 12;
        // Full length of the volume envelop (and therefore sound)
        // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
        return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
    };

    /**
    * Writes the wave to the supplied buffer ByteArray
    * @param buffer A ByteArray to write the wave to
    * @return If the wave is finished
    */
    this.synthWave = function(buffer, length) {
        // Shorter reference
        var p = this._params;

        // If the filters are active
        var _filters = p.s != 1 || p.v,
            // Cutoff multiplier which adjusts the amount the wave position can move
            _hpFilterCutoff = p.v * p.v * 0.1,

            // Speed of the high-pass cutoff multiplier
            _hpFilterDeltaCutoff = 1 + p.w * 0.0003,

            // Cutoff multiplier which adjusts the amount the wave position can move
            _lpFilterCutoff = p.s * p.s * p.s * 0.1,

            // Speed of the low-pass cutoff multiplier
            _lpFilterDeltaCutoff = 1 + p.t * 0.0001,

            // If the low pass filter is active
            _lpFilterOn = p.s != 1,

            // masterVolume * masterVolume (for quick calculations)
            _masterVolume = p.x * p.x,

            // Minimum frequency before stopping
            _minFreqency = p.g,

            // If the phaser is active
            _phaser = p.q || p.r,

            // Change in phase offset
            _phaserDeltaOffset = p.r * p.r * p.r * 0.2,

            // Phase offset for phaser effect
            _phaserOffset = p.q * p.q * (p.q < 0 ? -1020 : 1020),

            // Once the time reaches this limit, some of the    iables are reset
            _repeatLimit = p.p ? ((1 - p.p) * (1 - p.p) * 20000 | 0) + 32 : 0,

            // The punch factor (louder at begining of sustain)
            _sustainPunch = p.d,

            // Amount to change the period of the wave by at the peak of the vibrato wave
            _vibratoAmplitude = p.j / 2,

            // Speed at which the vibrato phase moves
            _vibratoSpeed = p.k * p.k * 0.01,

            // The type of wave to generate
            _waveType = p.a;

        var _envelopeLength      = _envelopeLength0,     // Length of the current envelope stage
            _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
            _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
            _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)

        // Damping muliplier which restricts how fast the wave position can move
        var _lpFilterDamping = 5 / (1 + p.u * p.u * 20) * (0.01 + _lpFilterCutoff);
        if (_lpFilterDamping > 0.8) {
            _lpFilterDamping = 0.8;
        }
        _lpFilterDamping = 1 - _lpFilterDamping;

        var _finished = 0,     // If the sound has finished
            _envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
            _envelopeTime     = 0, // Current time through current enelope stage
            _envelopeVolume   = 0, // Current volume of the envelope
            _hpFilterPos      = 0, // Adjusted wave position after high-pass filter
            _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
            _lpFilterOldPos,       // Previous low-pass wave position
            _lpFilterPos      = 0, // Adjusted wave position after low-pass filter
            _periodTemp,           // Period modified by vibrato
            _phase            = 0, // Phase through the wave
            _phaserInt,            // Integer phaser offset, for bit maths
            _phaserPos        = 0, // Position through the phaser buffer
            _pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
            _repeatTime       = 0, // Counter for the repeats
            _sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
            _superSample,          // Actual sample writen to the wave
            _vibratoPhase     = 0; // Phase through the vibrato sine wave

        // Buffer of wave values used to create the out of phase second wave
        var _phaserBuffer = new Array(1024),

            // Buffer of random values used to generate noise
            _noiseBuffer  = new Array(32);

        for (var i = _phaserBuffer.length; i--; ) {
            _phaserBuffer[i] = 0;
        }
        for (i = _noiseBuffer.length; i--; ) {
            _noiseBuffer[i] = rnd(-1, 1);
        }

        for (i = 0; i < length; i++) {
            if (_finished) {
                return i;
            }

            // Repeats every _repeatLimit times, partially resetting the sound parameters
            if (_repeatLimit) {
                if (++_repeatTime >= _repeatLimit) {
                    _repeatTime = 0;
                    this.resetManglable();
                }
            }

            // If _changeLimit is reached, shifts the pitch
            if (_changeLimit) {
                if (++_changeTime >= _changeLimit) {
                    _changeLimit = 0;
                    _period *= _changeAmount;
                }
            }

            // Acccelerate and apply slide
            _slide += _deltaSlide;
            _period *= _slide;

            // Checks for frequency getting too low, and stops the sound if a minFrequency was set
            if (_period > _maxPeriod) {
                _period = _maxPeriod;
                if (_minFreqency > 0) {
                    _finished = 1;
                }
            }

            _periodTemp = _period;

            // Applies the vibrato effect
            if (_vibratoAmplitude > 0) {
                _vibratoPhase += _vibratoSpeed;
                _periodTemp *= 1 + sin(_vibratoPhase) * _vibratoAmplitude;
            }

            _periodTemp |= 0;
            if (_periodTemp < 8) {
                _periodTemp = 8;
            }

            // Sweeps the square duty
            if (!_waveType) {
                _squareDuty += _dutySweep;
                if (_squareDuty < 0) {
                    _squareDuty = 0;
                } else if (_squareDuty > 0.5) {
                    _squareDuty = 0.5;
                }
            }

            // Moves through the different stages of the volume envelope
            if (++_envelopeTime > _envelopeLength) {
                _envelopeTime = 0;

                switch (++_envelopeStage)  {
                    case 1:
                        _envelopeLength = _envelopeLength1;
                        break;
                    case 2:
                        _envelopeLength = _envelopeLength2;
                }
            }

            // Sets the volume based on the position in the envelope
            switch (_envelopeStage) {
                case 0:
                    _envelopeVolume = _envelopeTime * _envelopeOverLength0;
                    break;
                case 1:
                    _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
                    break;
                case 2:
                    _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
                    break;
                case 3:
                    _envelopeVolume = 0;
                    _finished = 1;
            }

            // Moves the phaser offset
            if (_phaser) {
                _phaserOffset += _phaserDeltaOffset;
                _phaserInt = _phaserOffset | 0;
                if (_phaserInt < 0) {
                    _phaserInt = -_phaserInt;
                } else if (_phaserInt > 1023) {
                    _phaserInt = 1023;
                }
            }

            // Moves the high-pass filter cutoff
            if (_filters && _hpFilterDeltaCutoff) {
                _hpFilterCutoff *= _hpFilterDeltaCutoff;
                if (_hpFilterCutoff < 0.00001) {
                    _hpFilterCutoff = 0.00001;
                } else if (_hpFilterCutoff > 0.1) {
                    _hpFilterCutoff = 0.1;
                }
            }

            _superSample = 0;
            for (var j = 8; j--; ) {
                // Cycles through the period
                _phase++;
                if (_phase >= _periodTemp) {
                    _phase %= _periodTemp;

                    // Generates new random noise for this period
                    if (_waveType == 3) {
                        for (var n = _noiseBuffer.length; n--; ) {
                            _noiseBuffer[n] = rnd(-1, 1);
                        }
                    }
                }

                // Gets the sample from the oscillator
                switch (_waveType) {
                    case 0: // Square wave
                        _sample = ((_phase / _periodTemp) < _squareDuty) ? 0.5 : -0.5;
                        break;
                    case 1: // Saw wave
                        _sample = 1 - _phase / _periodTemp * 2;
                        break;
                    case 2: // Sine wave (fast and accurate approx)
                        _pos = _phase / _periodTemp;
                        _pos = (_pos > 0.5 ? _pos - 1 : _pos) * 6.28318531;
                        _sample = 1.27323954 * _pos + 0.405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
                        _sample = 0.225 * ((_sample < 0 ? -1 : 1) * _sample * _sample  - _sample) + _sample;
                        break;
                    case 3: // Noise
                        _sample = _noiseBuffer[abs(_phase * 32 / _periodTemp | 0)];
                }

                // Applies the low and high pass filters
                if (_filters) {
                    _lpFilterOldPos = _lpFilterPos;
                    _lpFilterCutoff *= _lpFilterDeltaCutoff;
                    if (_lpFilterCutoff < 0) {
                        _lpFilterCutoff = 0;
                    } else if (_lpFilterCutoff > 0.1) {
                        _lpFilterCutoff = 0.1;
                    }

                    if (_lpFilterOn) {
                        _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
                        _lpFilterDeltaPos *= _lpFilterDamping;
                    } else {
                        _lpFilterPos = _sample;
                        _lpFilterDeltaPos = 0;
                    }

                    _lpFilterPos += _lpFilterDeltaPos;

                    _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
                    _hpFilterPos *= 1 - _hpFilterCutoff;
                    _sample = _hpFilterPos;
                }

                // Applies the phaser effect
                if (_phaser) {
                    _phaserBuffer[_phaserPos % 1024] = _sample;
                    _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
                    _phaserPos++;
                }

                _superSample += _sample;
            }

            // Averages out the super samples and applies volumes
            _superSample *= 0.125 * _envelopeVolume * _masterVolume;

            // Clipping if too loud
            buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
        }

        return length;
    };
}

// Adapted from http://codebase.es/riffwave/
var synth = new SfxrSynth();

// Export for the Closure Compiler
var jsfxr = function(settings) {
    // Initialize SfxrParams
    synth._params.setSettings(settings);

    // Synthesize Wave
    var envelopeFullLength = synth.totalReset();
    var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
    var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
    var dv = new Uint32Array(data.buffer, 0, 44);

    // Initialize header
    dv[0] = 0x46464952; // "RIFF"
    dv[1] = used + 36;  // put total size here
    dv[2] = 0x45564157; // "WAVE"
    dv[3] = 0x20746D66; // "fmt "
    dv[4] = 0x00000010; // size of the following
    dv[5] = 0x00010001; // Mono: 1 channel, PCM format
    dv[6] = 0x0000AC44; // 44,100 samples per second
    dv[7] = 0x00015888; // byte rate: two bytes per sample
    dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
    dv[9] = 0x61746164; // "data"
    dv[10] = used;      // put number of samples here

    // Base64 encoding written by me, @maettig
    used += 44;
    var i = 0,
        base64Characters = /*nomangle*/'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'/*/nomangle*/,
        output = /*nomangle*/'data:audio/wav;base64,'/*/nomangle*/;
    for (; i < used; i += 3){
        var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
        output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
    }

    var audio = new Audio();
    audio.src = output;
    return () => audio.play();
};

sound = definition => {
    let pool = Array(5).fill(0).map(() => jsfxr(definition));
    return () => {
        // Cycle the queue by removing the first value and moving it to the last
        pool.push(pool.shift());

        // Play the sound
        pool[0]();
    };
};

beepSound = sound([0,,0.0759,0.3764,0.3201,0.5109,,,,,,,,,,,,,1,,,,,0.53
]);
exitSound = sound([0,,0.0424,0.4676,0.4241,0.4421,,,,,,0.3703,0.5339,,,,,,1,,,,,0.53
]);
failSound = sound([0,0.05,0.19,0.41,0.29,0.12,,,,0.2,1,,,,,,,,1,,,,,0.53
]);
finishSound = sound([0,,0.01,0.3568,0.432,0.71,,,,,,0.5058,0.6842,,,,,,1,,,,,0.53
]);
jumpSound = sound([0,,0.0119,,0.29,0.18,,0.2838,,,,,,0.4169,,,,,1,,,0.191,,0.53
]);
landSound = sound([3,,0.06,,0.24,0.99,,0.1979,,,,,,,,,,,1,,,,,0.2
]);
nextLevelSound = sound([3,0.42,0.01,,0.48,0.99,,-0.04,-0.04,,,-0.04,,,,0.6839,,,0.27,-0.02,,,,0.53
]);
notFoundSound = sound([0,,0.0759,0.22,0.36,0.13,,,,0.03,0.23,-0.06,,,,,,,1,,,,,0.53
]);

down = {};
onkeydown = e => {
    down[e.keyCode] = 1;

    if (e.keyCode == 75) {
        G.changeDifficulty();
        beepSound();
    }

    if (e.keyCode == 84 && G.queuedTweet) {
        tweet(G.queuedTweet);
    }

    if (e.keyCode == 27 && G.isStarted && G.timerActive && confirm(/*nomangle*/'Exit?'/*/nomangle*/)) {
        G.mainMenu();
    }
};
onkeyup = e => {
    down[e.keyCode] = 0;
};
onblur = oncontextmenu = () => down = {};

if (true) {
    mousePosition = {'x': 0, 'y': 0};
    onmousemove = e => {
        let canvasCoords = CANVAS.getBoundingClientRect();

        let x = 1600 * (e.pageX - canvasCoords.left) / canvasCoords.width;
        let y = CANVAS.height * (e.pageY - canvasCoords.top) / canvasCoords.height;

        mousePosition.x = x;
        mousePosition.y = y;
    };
}

ontouchstart = ontouchmove = ontouchend = ontouchcancel = e => {
    down = {};

    e.preventDefault();

    let canvasCoords = CANVAS.getBoundingClientRect();
    for (let i = 0 ; i < e.touches.length ; i++) {
        let x = 1600 * (e.touches[i].pageX - canvasCoords.left) / canvasCoords.width;
        let buttonIndex = ~~(x / (1600 / 4));
        down[37] = down[37] || buttonIndex == 0;
        down[39] = down[39] || buttonIndex == 1;
        down[32] = down[32] || between(2, buttonIndex, 3);
    }
};

gamepads = () => (navigator.getGamepads ? Array.from(navigator.getGamepads()) : []).filter(x => !!x);

isGamepadButtonPressed = buttonIndex => {
    let pads = gamepads();
    for (var i = 0; i < pads.length; i++) {
        try {
            if (pads[i].buttons[buttonIndex].pressed) {
                return 1;
            }
        } catch (e) {}
    }
};

isGamepadAxisNearValue = (axisIndex, targetValue) => {
    let pads = gamepads();
    for (var i = 0; i < pads.length; i++) {
        try {
            if (abs(targetValue - pads[i].axes[axisIndex]) < 0.5) {
                return 1;
            }
        } catch (e) {}
    }
};

INPUT = {
    'jump': () => down[32] || down[38] || down[87] || down[90] || isGamepadButtonPressed(0) || isGamepadButtonPressed(1),
    'left': () => down[37] || down[65] || down[81] || isGamepadButtonPressed(14) || isGamepadAxisNearValue(0, -1),
    'right': () => down[39] || down[68] || isGamepadButtonPressed(15) || isGamepadAxisNearValue(0, 1),
};

NORMAL_DIFFICULTY = {
    'label': /*nomangle*/'NORMAL'/*/nomangle*/,
    'timeFactor': 1,
    'visionFactor': 1
};
EASY_DIFFICULTY = {
    'label': /*nomangle*/'EASY'/*/nomangle*/,
    'timeFactor': 0.8,
    'visionFactor': 0.7
};
SUPER_EASY_DIFFICULTY = {
    'label': /*nomangle*/'SUPER EASY'/*/nomangle*/,
    'timeFactor': 0.6,
    'visionFactor': 0.5
};
HARD_DIFFICULTY = {
    'label': /*nomangle*/'NIGHTMARE'/*/nomangle*/,
    'timeFactor': 1,
    'visionFactor': 10
};

difficultySettings = () => {
    let settings = [
        NORMAL_DIFFICULTY,
        EASY_DIFFICULTY,
        SUPER_EASY_DIFFICULTY,
        HARD_DIFFICULTY
    ]

    if (document.monetization && document.monetization.state === /*nomangle*/'started'/*/nomangle*/) {
        settings.push({
            'label': /*nomangle*/'PRACTICE'/*/nomangle*/,
            'timeFactor': 1,
            'visionFactor': 1,
            'noSpotters': 1
        });
    }

    return settings;
};

let NINJA_POSITION = {
    'x': 800 / 2 + 30,
    'y': -15
};
let TITLE_FONT = italicFont(120);
let INTER_TITLE_FONT = italicFont(24);

class Game {

    constructor() {
        G = this;
        G.clock = 0;

        G.timer = 0;
        G.timerActive = 0;

        G.difficulty = NORMAL_DIFFICULTY;
        G.wasDifficultyChangedDuringRun = 0;
        G.difficultyPromptShown = 0;

        G.level = LEVELS[0];
        G.level.prepare();

        G.renderables = [];

        G.bottomScreenAltitude = MAX_LEVEL_ALTITUDE + 800 - 800 / 2 + 100;
        G.windowsAlpha = 1;

        G.introAlpha = 1;
        G.mainTitleAlpha = 1;
        G.mainTitleYOffset = 1;
        G.interTitleYOffset = 1;

        G.bandanaSource = {'x': NINJA_POSITION.x, 'y': NINJA_POSITION.y - 10};
        G.bandanaTrail = Array(~~(50 / 5)).fill(0).map((x, i) => {
            return { 'x': G.bandanaSource.x + 15 / 2 + i * 5};
        })

        G.mainTitle = /*nomangle*/'NINJA'/*/nomangle*/;
        G.interTitle = /*nomangle*/'VS'/*/nomangle*/;

        interp(G, 'introAlpha', 1, 0, 1, 2);
        interp(G, 'mainTitleYOffset', -800 , 0, 0.3, 0.5, 0, () => {
            G.shakeTitleTime = 0.1;

            R.font = TITLE_FONT;
            G.dust(measureText(G.mainTitle).width / 2, 264 + 50, 100);
        });
        interp(G, 'interTitleYOffset', 800, 0, 0.3, 1, 0, () => {
            G.shakeTitleTime = 0.1;

            R.font = INTER_TITLE_FONT;
            G.dust(measureText(G.interTitle).width / 2, 344 - 20, 5);
        });
    }

    dust(spreadRadius, y, count) {
        for (let i = 0 ; i < count ; i++) {
            G.particle({
                'size': [16],
                'color': '#fff',
                'duration': rnd(0.4, 0.8),
                'x': [1600 / 2 + rnd(-spreadRadius, spreadRadius), rnd(-40, 40)],
                'y': [y + rnd(-10, 10), rnd(-15, 15)]
            });
        }
    }

    changeDifficulty() {
        if (G.isStarted) {
            G.wasDifficultyChangedDuringRun = 1;
        }

        let settings = difficultySettings();
        let currentDifficultyIndex = settings.indexOf(G.difficulty);
        G.difficulty = settings[(currentDifficultyIndex + 1) % settings.length];
    };

    startAnimation() {
        if (G.isStarted) {
            return;
        }

        G.isStarted = 1;

        G.timer = 0;

        G.wasDifficultyChangedDuringRun = 0;
        G.queuedTweet = 0;

        G.level = LEVELS[0];
        if (true) {
            G.level = LEVELS[getDebugValue('level', 0)];
        }
        G.level.prepare();

        // Fade the title and intertitle out
        interp(G, 'mainTitleAlpha', 1, 0, 0.5);

        // Center the level, hide the windows, then start it
        G.centerLevel(
            G.level.index,
            5,
            0.5,
            () => {
                // Hide the windows, then start the level
                interp(G, 'windowsAlpha', 1, 0, 1, 0, 0, () => {
                    G.timerActive = 1;
                    G.level.start()
                });
            }
        )

        setTimeout(() => {
            G.menu = new Menu(
                /*nomangle*/'INFILTRATE THE TOWER'/*/nomangle*/,
                /*nomangle*/'FIND THE EVIL PLANS'/*/nomangle*/
            );
            G.menu.dim = 0;
            G.menu.animateIn();

            setTimeout(() => G.menu.animateOut(), 3000);
        }, 1000);

        beepSound();
    }

    get bestTime() {
        try {
            return parseFloat(localStorage[G.bestTimeKey]) || 0;
        } catch(e) {
            return 0;
        }
    }

    get bestTimeKey() {
        return location.pathname + G.difficulty.label;
    }

    mainMenu() {
        INTERPOLATIONS = [];

        // Go to the top of the tower
        interp(
            G,
            'bottomScreenAltitude',
            G.bottomScreenAltitude,
            MAX_LEVEL_ALTITUDE + 800 - 800 / 2 + 100,
            2,
            0.5,
            easeInOutCubic
        );

        // Show the windows so the tower can be rendered again
        interp(G, 'windowsAlpha', G.windowsAlpha, 1, 1, 1);
        interp(G, 'mainTitleAlpha', 0, 1, 1, 3);

        G.isStarted = 0;
        G.timerActive = 0;
        G.timer = 0;
    }

    endAnimation() {
        // Allow the player to start the game again
        G.isStarted = 0;
        G.timerActive = 0;

        // Only save the best time if the player didn't switch the difficulty during
        if (!G.wasDifficultyChangedDuringRun) {
            localStorage[G.bestTimeKey] = min(G.bestTime || 999999, G.timer);
        }

        G.queuedTweet = /*nomangle*/'I beat '/*/nomangle*/ + document.title + /*nomangle*/' in '/*/nomangle*/ + formatTime(G.timer) + /*nomangle*/' on '/*/nomangle*/ + G.difficulty.label + ' ' + /*nomangle*/'difficulty!'/*/nomangle*/;

        G.mainMenu();

        // Replace the title
        G.mainTitle = /*nomangle*/'YOU BEAT'/*/nomangle*/;
        G.interTitle = '';

        // Trophies for OS13K (not checking if the player changed difficulty just so they can win trophies more easily)
        let hardTrophy = G.difficulty == HARD_DIFFICULTY;
        let normalTrophy = G.difficulty == NORMAL_DIFFICULTY || hardTrophy;

        let keyPrefix = /*nomangle*/`OS13kTrophy,GG,${document.title},Beat the game - `/*/nomangle*/;
        let value = /*nomangle*/`Find the evil plans`/*/nomangle*/;

        if (normalTrophy) {
            localStorage[keyPrefix + /*nomangle*/'normal'/*/nomangle*/] = value;
        }

        if (hardTrophy) {
            localStorage[keyPrefix + /*nomangle*/'nightmare'/*/nomangle*/] = value;
        }

        localStorage[keyPrefix + /*nomangle*/'any'/*/nomangle*/] = value;
    }

    cycle(e) {
        if (true) {
            if (down[70]) {
                e *= 4;
            }
            if (down[71]) {
                e *= 0.25;
            }
        }

        if (G.timerActive) {
            G.timer += e;
        }
        G.clock += e;
        G.shakeTitleTime -= e;

        if (INPUT.jump()) {
            G.startAnimation();
        }

        G.level.cycle(e);
        INTERPOLATIONS.slice().forEach(i => i.cycle(e));
    }

    centerLevel(levelIndex, duration, delay, callback) {
        // Move the camera to the new level, and only then start it
        interp(
            G,
            'bottomScreenAltitude',
            G.bottomScreenAltitude,
            G.levelBottomAltitude(levelIndex) - 0,
            duration,
            delay,
            easeInOutCubic,
            callback
        );
    }

    nextLevel() {
        // Stop the previous level
        G.level.stop();

        // Prepare the new one
        G.level = LEVELS[G.level.index + 1];
        G.level.prepare();

        // Move the camera to the new level, and only then start it
        G.centerLevel(G.level.index, 0.5, 0, () => G.level.start());

        nextLevelSound();
    }

    levelBottomAltitude(levelIndex) {
        return levelIndex * 800;
    }

    render() {
        if (true) {
            resetPerfLogs();
        }

        if (true) {
            G.castIterations = 0;
        }

        if (true && getDebugValue('zoom')) {
            translate(-mousePosition.x + 1600 / 2, -mousePosition.y + 800 / 2);
            translate(1600 / 2, 800 / 2);
            scale(getDebugValue('zoom'), getDebugValue('zoom'));
            translate(-1600 / 2, -800 / 2);
        }

        // Sky
        fs(SKY_BACKGROUND);
        fr(0, 0, 1600, 800); // TODO maybe split into two?

        if (true) logPerf('sky');

        // Moon
        wrap(() => {
            fs('#fff');
            fillCircle(1600 - 200, 100, 50);
        })

        if (true) logPerf('moon');

        // Thunder
        if (G.clock % 5 < 0.3) {
            if (G.clock % 0.1 < 0.05) {
                fs('rgba(255, 255, 255, 0.2)');
                fr(0, 0, 1600, 800);
            }

            R.strokeStyle = '#fff';
            R.lineWidth = 4;
            let x = createNumberGenerator(G.clock / 5).floating() * 1600;
            beginPath();
            for (let y = 0 ; y <= 800 ; y += 40) {
                x += rnd(-40, 40);
                lineTo(x, y);
            }
            stroke();
        }

        if (true) logPerf('thunder');

        // Buildings in the background
        BUILDINGS_BACKGROUND.forEach((layer, i) => wrap (() => {
            let layerRatio = 0.2 + 0.8 * i / (BUILDINGS_BACKGROUND.length - 1);

            let altitudeRatio = G.bottomScreenAltitude / MAX_LEVEL_ALTITUDE;

            fs(layer);
            translate(0, ~~(800 - layer.height + altitudeRatio * layerRatio * 400));

            fr(0, 0, 1600, layer.height);
        }));

        if (true) logPerf('builds bg');

        // Rain
        wrap(() => {
            fs('rgba(255,255,255,0.4)');
            let rng = createNumberGenerator(1);
            for (let i = 0 ; i < 200 ; i++) {
                let startX = rng.between(-0.2, 1);
                let startRatio = rng.floating();
                let speed = rng.between(1, 2);

                let rainDropAngle = PI * 14 / 32 + rng.between(-1, 1) * PI / 64;

                let ratio = (startRatio + G.clock * speed) % 1.2;
                let xRatio = startX + cos(rainDropAngle) * ratio;
                let yRatio = sin(rainDropAngle) * ratio;

                wrap(() => {
                    translate(xRatio * 1600, yRatio * 800);
                    rotate(rainDropAngle);
                    fr(0, 0, -20, 1);
                });
            }
        });

        if (true) logPerf('rain');

        // Render the tower
        wrap(() => {
            translate(400, ~~G.bottomScreenAltitude + 800 + 0);

            // Render the rooftop (sign, lights)
            wrap(() => {
                translate(0, -MAX_LEVEL_ALTITUDE - 800);

                wrap(() => {
                    R.globalAlpha = 0.5;

                    drawImage(
                        GOD_RAY,
                        0, 0,
                        GOD_RAY.width,
                        GOD_RAY.height / 2,
                        0,
                        -100,
                        800,
                        100
                    );
                });

                // Sign holder
                wrap(() => {
                    translate(800 / 2 - 40 * 6, 0);
                    fs(SIGN_HOLDER_PATTERN);
                    fr(0, 0, 40 * 12, -40 * 2);
                });

                // Halo behind the sign
                [
                    30,
                    90,
                    150,
                    210
                ].forEach(x => wrap(() => {
                    R.globalAlpha = (sin(G.clock * PI * 2 / 2) * 0.5 + 0.5) * 0.1 + 0.2;
                    drawImage(RED_HALO, 800 / 2 + x - RED_HALO.width / 2, -200);
                    drawImage(RED_HALO, 800 / 2 - x - RED_HALO.width / 2, -200);
                }));

                // Sign
                R.textAlign = /*nomangle*/'center'/*/nomangle*/;
                R.textBaseline = /*nomangle*/'alphabetic'/*/nomangle*/;
                fs('#900');
                R.strokeStyle = '#f00';
                R.lineWidth = 5;
                R.font = italicFont(96);
                outlinedText(/*nomangle*/'EVILCORP'/*/nomangle*/, 800 / 2, -30);

                wrap(() => {
                    let ninjaScale = 1.5;

                    G.bandanaTrail.forEach((item, i, arr) => {
                        let ratio = i / arr.length
                        let amplitude = 15 * ratio;
                        item.y = G.bandanaSource.y - ratio * 30 + sin(-ratio * 20 + G.clock * 35) * amplitude;
                    });

                    scale(1.5, 1.5);
                    renderBandana(R, G.bandanaSource, G.bandanaTrail);

                    translate(NINJA_POSITION.x, NINJA_POSITION.y);
                    renderCharacter(
                        R,
                        G.clock,
                        PLAYER_BODY,
                        1,
                        -1,
                        0,
                        0
                    );
                });
            });

            if (true) logPerf('roof');

            // Render the levels
            let currentLevelIndex = LEVELS.indexOf(G.level);
            for (let i = max(0, currentLevelIndex - 1) ; i < min(LEVELS.length, currentLevelIndex + 2) ; i++) {
                wrap(() => {
                    translate(0, -G.levelBottomAltitude(i) - 800);
                    LEVELS[i].render();
                });
            }

            if (true) logPerf('levels');

            // Render the windows in front
            R.globalAlpha = G.windowsAlpha;
            fs(BUILDING_PATTERN);
            wrap(() => {
                // translate(-40 / 2, 0);
                fr(0, 0, 800, -MAX_LEVEL_ALTITUDE - 800);
            });

            if (true) logPerf('windows');
        });

        if (G.menu) {
            wrap(() => G.menu.render());
        }

        wrap(() => {
            if (true && getDebugValue('nohud')) {
                return;
            }

            // Instructions
            if (G.clock % 2 < 1.5 && G.mainTitleAlpha == 1) {
                let instructions = [
                    /*nomangle*/'PRESS [SPACE] TO START'/*/nomangle*/,
                    DIFFICULTY_INSTRUCTION.toUpperCase(),
                ]
                if (G.queuedTweet) {
                    instructions.unshift(/*nomangle*/'PRESS [T] TO TWEET YOUR TIME'/*/nomangle*/);
                }
                instructions.forEach((s, i) => {
                    R.textAlign = /*nomangle*/'center'/*/nomangle*/;
                    R.textBaseline = /*nomangle*/'middle'/*/nomangle*/;
                    R.font = font(24);
                    fs('#fff');
                    R.strokeStyle = '#000';
                    R.lineWidth = 2;

                    outlinedText(s, 1600 / 2, 800 * 4 / 5 + i * 50);
                });
            }
        });

        if (true) logPerf('instructions');

        // Mobile controls
        fs('#000');
        fr(0, 800, 1600, 200);

        fs('#fff');

        wrap(() => {
            R.globalAlpha = 0.5 + 0.5 * !!down[37];
            translate(1600 / 8, 800 + 200 / 2);
            scale(-1, 1);
            renderMobileArrow();
        });

        wrap(() => {
            R.globalAlpha = 0.5 + 0.5 * !!down[39];
            translate(1600 * 3 / 8, 800 + 200 / 2);
            renderMobileArrow();
        });

        wrap(() => {
            R.globalAlpha = 0.5 + 0.5 * !!down[32];
            fillCircle(
                1200,
                900,
                50
            );
        });

        if (true) logPerf('mobile');

        // HUD
        let hudItems = [
            [/*nomangle*/'DIFFICULTY:'/*/nomangle*/, G.difficulty.label]
        ];

        if (G.timer) {
            hudItems.push([
                /*nomangle*/'LEVEL:'/*/nomangle*/,
                (G.level.index + 1) + '/' + LEVELS.length
            ]);
            hudItems.push([
                /*nomangle*/'TIME' /*/nomangle*/ + (G.wasDifficultyChangedDuringRun ? /*nomangle*/' (INVALIDATED):'/*/nomangle*/ : ':'),
                formatTime(G.timer)
            ]);
        }

        hudItems.push([
            /*nomangle*/'BEST ['/*/nomangle*/ + G.difficulty.label + ']:',
            formatTime(G.bestTime)
        ]);

        if (true) {
            hudItems.push(['Render FPS', ~~G.renderFps]);
            hudItems.push(['Cycle FPS', ~~G.cycleFps]);
            hudItems.push(['Interpolations', INTERPOLATIONS.length]);
            hudItems.push(['Cast iterations', ~~G.castIterations]);
            perfLogs.forEach(log => {
                hudItems.push(log);
            });
        }

        hudItems.forEach(([label, value], i) => wrap(() => {
            if (true && getDebugValue('nohud')) {
                return;
            }

            R.textAlign = /*nomangle*/'left'/*/nomangle*/;
            R.textBaseline = /*nomangle*/'middle'/*/nomangle*/;
            fs('#fff');

            // Label
            R.font = italicFont(18);
            shadowedText(label, 20, 30 + i * 90);

            // Value
            R.font = font(36);
            shadowedText(value, 20, 30 + 40 + i * 90);
        }));

        // Gamepad info
        R.textAlign = /*nomangle*/'right'/*/nomangle*/;
        R.textBaseline = /*nomangle*/'alphabetic'/*/nomangle*/;
        R.font = /*nomangle*/'18pt Courier'/*/nomangle*/;
        fs('#888');
        fillText(
            /*nomangle*/'Gamepad: '/*/nomangle*/ + (gamepads().length ? /*nomangle*/'yes'/*/nomangle*/ : /*nomangle*/'no'/*/nomangle*/),
            1580,
            780
        );

        // Intro background
        wrap(() => {
            R.globalAlpha = G.introAlpha;
            fs('#000');
            fr(0, 0, 1600, 800);
        });

        // Title
        wrap(() => {
            if (G.shakeTitleTime > 0) {
                translate(rnd(-10, 10), rnd(-10, 10));
            }

            R.globalAlpha = G.mainTitleAlpha;
            R.textAlign = /*nomangle*/'center'/*/nomangle*/;
            R.textBaseline = /*nomangle*/'middle'/*/nomangle*/;
            fs('#fff');
            R.strokeStyle = '#000';

            // Main title
            R.lineWidth = 5;
            R.font = TITLE_FONT;
            outlinedText(G.mainTitle, 1600 / 2, 264 + G.mainTitleYOffset);

            // "Inter" title (between the title and EVILCORP)
            R.font = INTER_TITLE_FONT;
            R.lineWidth = 2;
            outlinedText(G.interTitle, 1600 / 2, 344 + G.interTitleYOffset);
        });

        G.renderables.forEach(renderable => wrap(() => renderable.render()));
    }

    particle(props) {
        let particle;
        props.onFinish = () => remove(G.renderables, particle);
        G.renderables.push(particle = new Particle(props));
    }

}

tweet = message => {
    open(
        /*nomangle*/'//twitter.com/intent/tweet?'/*/nomangle*/ +
        /*nomangle*/'hashtags=js13k'/*/nomangle*/ +
        /*nomangle*/'&url='/*/nomangle*/ + location +
        /*nomangle*/'&text='/*/nomangle*/ + encodeURIComponent(message)
    );
};

onload = () => {
    CANVAS.width = 1600;
    CANVAS.height = 800;

    if (navigator.userAgent.match(/*nomangle*//andro|ipho|ipa|ipo/i/*/nomangle*/)) {
        CANVAS.height += 200;
    }

    onresize(); // trigger initial sizing pass

    R = CANVAS.getContext('2d');

    // Shortcut for all canvas methods to the main canvas
    Object.getOwnPropertyNames(canvasProto).forEach(n => {
        if (R[n].call) {
            w[n] = canvasProto[n].bind(R);
        }
    });

    // Create the game
    new Game();

    // Run the game at 200 FPS
    let didCycle = 0;
    loop(
        (e, fps) => {
            G.cycle(e);
            didCycle = 1;

            if (true) {
                G.cycleFps = fps;
            }
        },
        func => setTimeout(func, 1000 / 200)
    );

    // Render at 60 FPS
    loop(
        (e, fps) => {
            // Don't render if nothing was updated
            if (didCycle) {
                wrap(() => G.render());

                if (true) {
                    G.renderFps = fps;
                }
            }
        },
        func => requestAnimationFrame(func)
    );

};
