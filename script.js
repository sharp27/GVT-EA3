// Hauttöne: Ein Array von RGBA-Farbwerten zur Darstellung verschiedener Hauttöne
const skinTones = [
    [0.96, 0.76, 0.69, 1.0],  // heller Hautton
    [0.87, 0.67, 0.53, 1.0],  // mittlerer Hautton
    [0.78, 0.58, 0.48, 1.0],  // etwas dunkler
    [0.67, 0.45, 0.35, 1.0],  // dunkler Hautton
    [0.56, 0.39, 0.29, 1.0]   // tiefere Hauttöne
];

// Hauptfunktion, die die WebGL-Initialisierung und das Rendern der Polygone steuert
async function main() {
    // Zugriff auf das Canvas-Element und den WebGL-Kontext für Rendering
    const canvas = document.getElementById('webglCanvas');
    const gl = canvas.getContext('webgl');

    // Überprüfung, ob WebGL unterstützt wird
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    // Vertex-Shader-Quelle: legt die Position der Scheitelpunkte fest
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main(void) {
            gl_Position = aVertexPosition;
        }
    `;

    // Fragment-Shader-Quelle: legt die Farbe der Pixel basierend auf dem uniform color fest
    const fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main(void) {
            gl_FragColor = uColor;
        }
    `;

    // Initialisiert das Shader-Programm, das die Vertex- und Fragment-Shader kombiniert
    function initShaderProgram(gl, vsSource, fsSource) {
        // Lädt und kompiliert den Vertex-Shader
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        // Lädt und kompiliert den Fragment-Shader
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // Erstellt ein neues Shader-Programm und fügt beide Shader hinzu
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // Überprüft, ob das Shader-Programm erfolgreich verlinkt wurde
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program:', gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        return shaderProgram;
    }

    // Hilfsfunktion, um einen Shader zu erstellen und zu kompilieren
    function loadShader(gl, type, source) {
        // Erstellt den Shader und setzt den Quellcode
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        // Überprüft, ob die Kompilierung erfolgreich war
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // Initialisiert das Shader-Programm und verwendet es für das Rendern
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    gl.useProgram(shaderProgram);

    // Speichert Informationen über Attribut- und Uniform-Standorte im Shader-Programm
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            color: gl.getUniformLocation(shaderProgram, 'uColor'),
        },
    };

    // Array von Polygon-Daten, wobei jedes Polygon eine Liste von Eckpunktkoordinaten enthält
    const polygonsData = [[[386, 946], [383, 1080], [476, 1057]], [[383, 946], [380, 1079], [290, 1050], [381, 946], [289, 1052], [380, 1080]], [[447, 902], [387, 942], [475, 1050], [387, 942], [450, 904], [476, 1048]], [[386, 937], [444, 900], [386, 899]], [[325, 897], [381, 937]], [[322, 897], [289, 1046], [381, 943]], [[325, 895], [381, 899], [383, 937], [382, 899]], [[585, 877], [486, 1052], [640, 952]],
    [[514, 877], [479, 1046], [452, 901]], [[581, 875], [518, 876], [483, 1046]], [[579, 875], [485, 1044], [518, 877]], [[437, 872], [392, 895], [447, 897]], [[447, 893], [446, 897], [393, 896], [438, 872]], [[443, 871], [451, 897], [508, 876], [452, 896], [445, 871], [508, 874]], [[386, 894], [433, 872], [387, 894], [389, 870], [432, 870], [388, 870]], [[321, 891], [376, 896], [333, 870]], [[321, 891], [332, 870], [376, 895]], [[256, 870], [285, 1043], [316, 894]], [[257, 870], [316, 895], [286, 1039]], [[338, 869], [378, 895], [383, 894], [384, 870]], [[338, 870], [383, 870], [383, 893]], 
    [[264, 868], [316, 891], [327, 872]], [[264, 869], [327, 871], [316, 891]], [[187, 866], [131, 938], [279, 1046], [131, 937], [188, 866], [281, 1046]], [[192, 865], [281, 1040], [253, 868]], [[194, 864], [253, 869], [281, 1039]], [[387, 840], [388, 867], [434, 868]], [[387, 841], [434, 867], [389, 867]], [[384, 840], [338, 865], [384, 867]], [[384, 841], [383, 867], [339, 865]], [[393, 838], [437, 866], [450, 841], [438, 866], [393, 839], [450, 839]], [[328, 864], [319, 836], [262, 864]], [[328, 864], [263, 865], [317, 836]], [[322, 835], [331, 865], [379, 839]], [[322, 836], [378, 839], [332, 865]], 
    [[385, 773], [384, 834], [366, 833], [383, 774], [366, 834], [384, 835], [386, 773], [387, 834], [403, 836]], [[388, 775], [405, 831], [403, 836], [387, 833]], [[686, 771], [587, 872], [640, 947]], [[685, 771], [641, 947], [587, 873]], [[447, 763], [388, 763], [407, 831], [388, 764], [447, 764], [410, 831]], [[476, 762], [413, 836], [452, 835]], [[475, 762], [452, 834], [414, 836]], [[486, 761], [580, 870], [486, 761], [518, 872], [580, 872], [518, 871]], [[327, 761], [363, 830], [383, 763]], [[328, 761], [383, 764], [362, 830]], 
    [[480, 760], [455, 837], [510, 872], [445, 868], [454, 840], [509, 870], [454, 840], [444, 868], [514, 870], [482, 760], [514, 869], [455, 836]], [[298, 758], [320, 831], [358, 834]], [[299, 758], [357, 834], [320, 830]], [[93, 758], [131, 932], [186, 861]], [[94, 758], [186, 862], [130, 932]], [[474, 757], [420, 821], [475, 759], [450, 763], [418, 822], [450, 764]], [[289, 757], [194, 862], [254, 864]], [[288, 757], [254, 863], [194, 862]], [[294, 756], [317, 832], [259, 863], [292, 756], [257, 862], [317, 833]], [[299, 753], [353, 820], [323, 761]], 
    [[300, 753], [323, 762], [352, 820]], [[435, 740], [450, 759], [474, 754]], [[435, 740], [474, 753], [451, 759]], [[446, 758], [423, 738], [392, 760], [446, 761], [393, 759], [427, 738]], [[339, 738], [301, 748], [338, 738], [323, 757], [300, 750], [324, 757]], [[387, 757], [421, 739], [389, 758], [389, 737], [421, 737], [388, 737]], [[328, 756], [379, 758], [347, 737]], [[328, 757], [346, 737], [378, 759]], [[352, 736], [384, 737], [383, 758], [352, 738], [384, 758], [385, 737]], [[328, 703], [298, 746], [342, 734]],
    [[328, 704], [342, 733], [299, 746]], [[601, 683], [586, 868], [687, 766]], [[600, 683], [687, 765], [587, 868]], [[596, 682], [483, 753], [581, 868]], [[595, 683], [582, 868], [484, 753]], [[177, 672], [92, 750], [185, 857], [93, 752], [180, 673], [188, 858]], [[183, 671], [192, 857], [290, 748]], [[184, 671], [290, 749], [191, 857]], [[429, 618], [430, 735], [476, 750], [431, 620], [476, 749], [429, 732]], [[349, 618], [343, 727], [330, 695], [347, 618], [330, 695], [344, 727]], [[392, 598], [385, 733], [347, 731], [387, 599], [347, 733], [385, 734], [390, 598], [388, 734], [426, 734]], 
    [[392, 598], [425, 734], [388, 733]], [[393, 588], [425, 719], [393, 589], [426, 601], [427, 721], [426, 600]], [[388, 588], [352, 599], [348, 720]], [[386, 588], [348, 719], [352, 600]], [[237, 578], [295, 745], [326, 698], [239, 578], [326, 699], [292, 742]], [[548, 570], [450, 696], [479, 749]], [[547, 571], [480, 749], [449, 699]], [[555, 565], [485, 748], [596, 677]], [[554, 565], [596, 677], [485, 748]], [[225, 562], [183, 667], [288, 744], [183, 666], [226, 562], [290, 744]], [[549, 561], [509, 560], [455, 685]],
    [[547, 561], [456, 685], [509, 561]], [[557, 561], [595, 668], [557, 562], [598, 559], [597, 668], [599, 557]], [[230, 555], [320, 686], [231, 562], [275, 554], [322, 687], [275, 553]], [[222, 555], [184, 656], [224, 558], [184, 553], [183, 659], [184, 554]], [[458, 551], [429, 599], [445, 684], [429, 599]], [[460, 550], [447, 684]], [[322, 547], [328, 684], [322, 549], [349, 597], [330, 685], [349, 596]], [[647, 545], [601, 556], [599, 668]], [[646, 545], [600, 668], [601, 557]], [[467, 545], [451, 687], [506, 561]], [[467, 545], [506, 561], [451, 686]], 
    [[650, 544], [603, 669], [650, 545], [721, 549], [601, 680], [687, 761], [723, 552], [667, 609], [721, 548]], [[722, 552], [687, 760], [601, 678]], [[317, 540], [278, 554], [324, 685], [278, 554], [320, 542], [326, 686]], [[64, 540], [93, 747], [178, 665]],[[65, 540], [178, 666], [92, 747]], [[141, 537], [178, 655], [141, 539], [181, 553], [180, 655], [181, 553]], [[66, 536], [175, 659], [137, 536]], [[67, 536], [138, 538], [175, 659]], [[586, 516], [588, 557], [643, 543], [588, 557], [587, 517], [643, 541]], [[402, 516], [392, 584], [423, 596], [392, 583]], 
    [[377, 516], [355, 595], [388, 584]], [[376, 516], [388, 583], [355, 595]],[[531, 515], [468, 543], [531, 558]], [[531, 516], [530, 558], [468, 542]],[[404, 515], [425, 596]], [[534, 516], [581, 514], [583, 556], [536, 559]],[[540, 512], [577, 512]], [[374, 511], [323, 538], [349, 592], [374, 513], [350, 592], [323, 539]],[[407, 510], [428, 593], [405, 512], [459, 543], [430, 593], [459, 542]], [[205, 509], [249, 512], [245, 552], [204, 552]], [[252, 508], [250, 552], [315, 538]], [[252, 510], [315, 537], [277, 550], [251, 552]], [[200, 507], [143, 535], [200, 552]], 
    [[201, 510], [199, 552], [143, 534]], [[577, 510], [562, 501], [541, 510], [562, 501]], [[204, 506], [246, 507], [206, 506], [222, 496], [245, 505], [222, 496]], [[678, 477], [653, 541], [722, 544], [680, 477], [722, 543], [653, 540]], [[675, 477], [601, 520], [649, 540]],[[675, 478], [648, 540], [601, 519]], [[665, 477], [567, 498], [599, 519], [665, 479], [597, 518], [569, 499]], [[394, 477], [391, 569], [378, 507], [392, 477], [378, 507], [390, 574], [401, 510]],[[474, 473], [554, 498], [520, 516], [474, 475], [519, 516], [557, 499]], [[467, 473], [464, 539], [516, 518]], 
    [[467, 474], [516, 517], [465, 539]], [[464, 472], [406, 507], [461, 539]], [[463, 473], [459, 539], [407, 506]], [[403, 502], [457, 473], [405, 503], [398, 472], [458, 471], [397, 472]], [[320, 470], [322, 535], [321, 470], [373, 507], [324, 534], [373, 508]], [[315, 470], [271, 513], [319, 535]], [[316, 470], [318, 535], [271, 512]], [[311, 470], [228, 496], [266, 511]], [[311, 471], [266, 511], [228, 495]], [[123, 469], [187, 509], [216, 496]], [[123, 470], [216, 495], [188, 509]], [[325, 469], [374, 504], [391, 474]], [[326, 469], [391, 474], [375, 504]], [[114, 468], [139, 532], [184, 512]], 
    [[114, 469], [184, 511], [140, 532]], [[110, 468], [65, 533], [135, 533]], [[109, 468], [135, 532], [66, 533]], [[568, 495], [672, 471], [607, 451]], [[568, 495], [608, 451], [671, 472]], [[603, 451], [474, 471], [561, 498], [603, 453], [561, 498], [476, 470]], [[185, 446], [223, 493], [310, 467], [223, 493], [186, 446], [309, 465]], [[216, 491], [180, 445], [117, 463], [180, 446], [215, 491], [118, 465]], [[609, 425], [610, 448], [668, 467], [612, 449], [610, 425], [667, 465]], [[606, 424], [487, 463], [604, 423], [605, 448], [485, 465], [606, 448]], [[179, 421], [122, 457], [177, 421], [177, 443], [121, 459], [178, 443]], 
    [[182, 419], [184, 443], [299, 460]], [[182, 420], [298, 460], [184, 443]], [[730, 338], [681, 470], [722, 539]], [[729, 338], [723, 539], [681, 470]], [[63, 335], [64, 528], [108, 461], [65, 336], [108, 464], [63, 527]], [[391, 334], [392, 468], [322, 464], [389, 335], [322, 465], [392, 469]], [[395, 332], [395, 467], [461, 468]], [[395, 334], [461, 468], [395, 467]], [[397, 330], [466, 467], [601, 422]], [[397, 331], [601, 421], [467, 467]], [[388, 330], [186, 417], [318, 464]], [[388, 330], [317, 464], [187, 417]], [[635, 289], [676, 467], [609, 420], [633, 290], [609, 421], [676, 468]], 
    [[159, 287], [179, 415], [113, 459], [157, 287], [113, 460], [179, 416]], [[637, 283], [678, 464], [637, 284], [729, 327], [680, 465], [729, 326]], [[632, 282], [399, 327], [606, 418]], [[632, 283], [605, 418], [400, 327]], [[155, 281], [64, 323], [109, 457], [64, 324], [155, 282], [111, 456]], [[160, 280], [181, 414], [386, 327]], [[160, 281], [385, 327], [182, 414]], [[397, 323], [629, 278], [491, 187]], [[628, 278], [397, 322], [492, 187]], [[164, 275], [389, 323], [300, 187]], [[164, 276], [299, 187], [388, 322]], [[303, 186], [391, 322], [487, 188]], [[303, 187], [487, 187], [393, 322]], [[147, 132], [156, 276], [65, 318], [145, 133], [65, 319], [156, 277]], 
    [[654, 131], [636, 279], [728, 323]], [[654, 132], [727, 322], [636, 278]], [[159, 272], [295, 184], [150, 127]], [[159, 272], [151, 127], [295, 185]], [[651, 126], [496, 186], [633, 276]], [[650, 127], [632, 276], [496, 185]], [[297, 182], [278, 53], [153, 122]], [[297, 180], [153, 123], [277, 53]], [[494, 181], [648, 123], [520, 52]], [[494, 180], [521, 52], [647, 122]], [[488, 180], [398, 43], [303, 183]], [[488, 181], [303, 182], [399, 43]], [[404, 41], [491, 179], [517, 51]], [[405, 41], [517, 52], [490, 179]], [[395, 41], [282, 51], [300, 179]], [[394, 41], [301, 179], [281, 53]]];


    // Normalisiert und rendert die Polygone auf der Leinwand
    normalizeAndRenderPolygons(gl, programInfo, polygonsData);
}

// Funktion zum Normalisieren und Rendern der Polygone
function normalizeAndRenderPolygons(gl, programInfo, polygonsData) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // Berechnet die min- und max-Werte für die Normalisierung der Polygonkoordinaten
    polygonsData.flat().forEach(([x, y]) => {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    });

    // Berechnet die Skalierung und Verschiebung für die Normalisierung
    const scaleX = 2 / (maxX - minX);
    const scaleY = 2 / (maxY - minY);
    const translateX = -(maxX + minX) / 2;
    const translateY = -(maxY + minY) / 2;

    // Setzt das Viewport und bereinigt das Canvas mit einem weißen Hintergrund
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Erstellt und bindet einen Puffer für die Positionen der Eckpunkte
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Durchläuft alle Polygone, normalisiert sie und zeichnet sie
    polygonsData.forEach((polygon) => {
        // Wählt eine Farbe basierend auf dem Polygon-Typ (Augen oder Haut)
        const color = isEyePolygon(polygon)
            ? [0.6, 0.8, 1.0, 1.0] // Blau für Augen
            : skinTones[Math.floor(Math.random() * skinTones.length)]; // Zufälliger Hautton

        // Setzt die Farbe im Shader-Programm
        gl.uniform4fv(programInfo.uniformLocations.color, color);

        // Normalisiert die Eckpunkte und bereitet sie für das Rendering vor
        const flatVertices = polygon.flatMap(([x, y]) => {
            const normalizedX = (x + translateX) * scaleX;
            const normalizedY = (y + translateY) * scaleY;
            return [normalizedX, -normalizedY];
        });

        // Lädt die normalisierten Eckpunkte in den WebGL-Puffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatVertices), gl.STATIC_DRAW);

        // Verknüpft die Positionen der Eckpunkte mit dem Vertex-Shader
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        // Zeichnet das Polygon als Dreiecks-Fächer
        gl.drawArrays(gl.TRIANGLE_FAN, 0, polygon.length);
    });
}

// Hilfsfunktion zur Identifizierung von Augen-Polygonen anhand bestimmter Koordinatenmuster
function isEyePolygon(polygon) {
    const eyePolygons = [
        JSON.stringify([[534, 516], [581, 514], [583, 556], [536, 559]]),  // rechtes Auge
        JSON.stringify([[205, 509], [249, 512], [245, 552], [204, 552]])   // linkes Auge
    ];
    return eyePolygons.includes(JSON.stringify(polygon));
}

main();