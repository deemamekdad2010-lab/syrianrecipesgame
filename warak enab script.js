const gameContainer = document.getElementById("game-container");
const uiLayer = document.getElementById("ui-layer");

const rice = document.getElementById("rice");
const meat = document.getElementById("meat");
const bowl = document.getElementById("bowl");

const mixedFilling = document.getElementById("mixed-filling");
const leaf = document.getElementById("leaf");
const warakaiah = document.getElementById("warakaiah");

const pan = document.getElementById("pan");
const cookedPan = document.getElementById("cooked-pan");
const finishedWarakEnab =
    document.getElementById("finished-warak-enab");

const successScreen =
    document.getElementById("success-screen");


/* =========================
   EDGE UI
========================= */

const EDGE_THRESHOLD = 120;

gameContainer.addEventListener("mousemove", (event) => {

    const rect = gameContainer.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const nearLeft = x <= EDGE_THRESHOLD;
    const nearRight = x >= rect.width - EDGE_THRESHOLD;
    const nearTop = y <= EDGE_THRESHOLD;
    const nearBottom = y >= rect.height - EDGE_THRESHOLD;

    if (
        nearLeft ||
        nearRight ||
        nearTop ||
        nearBottom
    ) {

        uiLayer.classList.add("visible-ui");

    } else {

        uiLayer.classList.remove("visible-ui");

    }

});


/* =========================
   GAME VARIABLES
========================= */

let riceInBowl = false;
let meatInBowl = false;
let fillingMixed = false;

let warakaiahCount = 0;

const REQUIRED_WARAKAIAHS = 5;

/* Keep track of the warakaiahs
   placed inside the pan */

let placedWarakaiahs = [];


/* =========================
   INITIAL GAME STATE
========================= */

mixedFilling.classList.add("hidden");

leaf.classList.add("hidden");

warakaiah.classList.add("hidden");

pan.classList.add("hidden");

cookedPan.classList.add("hidden");

finishedWarakEnab.classList.add("hidden");

successScreen.classList.add("hidden");


/* =========================
   DRAG SYSTEM
========================= */

function makeDraggable(element, dropFunction) {

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;


    /* START DRAGGING */

    element.addEventListener("mousedown", (event) => {

        if (element.classList.contains("hidden")) {
            return;
        }

        dragging = true;

        const rect =
            element.getBoundingClientRect();

        offsetX =
            event.clientX - rect.left;

        offsetY =
            event.clientY - rect.top;

        element.style.zIndex = "1000";

        event.preventDefault();

    });


    /* DRAGGING */

    document.addEventListener("mousemove", (event) => {

        if (!dragging) {
            return;
        }

        const containerRect =
            gameContainer.getBoundingClientRect();

        const newLeft =
            event.clientX -
            containerRect.left -
            offsetX;

        const newTop =
            event.clientY -
            containerRect.top -
            offsetY;

        element.style.left =
            newLeft + "px";

        element.style.top =
            newTop + "px";

    });


    /* RELEASE */

    document.addEventListener("mouseup", () => {

        if (!dragging) {
            return;
        }

        dragging = false;

        element.style.zIndex = "20";

        dropFunction(element);

    });

}


/* =========================
   OVERLAP CHECK
========================= */

function isOverlapping(element1, element2) {

    const r1 =
        element1.getBoundingClientRect();

    const r2 =
        element2.getBoundingClientRect();

    return (
        r1.left < r2.right &&
        r1.right > r2.left &&
        r1.top < r2.bottom &&
        r1.bottom > r2.top
    );

}


/* =========================
   STEP 1
   RICE
========================= */

makeDraggable(rice, () => {

    if (
        !rice.classList.contains("hidden") &&
        isOverlapping(rice, bowl)
    ) {

        rice.classList.add("hidden");

        riceInBowl = true;

        console.log("Rice added!");

        checkMixing();

    }

});


/* =========================
   STEP 1
   MEAT
========================= */

makeDraggable(meat, () => {

    if (
        !meat.classList.contains("hidden") &&
        isOverlapping(meat, bowl)
    ) {

        meat.classList.add("hidden");

        meatInBowl = true;

        console.log("Meat added!");

        checkMixing();

    }

});


/* =========================
   CHECK MIXING
========================= */

function checkMixing() {

    if (
        riceInBowl &&
        meatInBowl &&
        !fillingMixed
    ) {

        fillingMixed = true;

        bowl.classList.add("hidden");

        mixedFilling.classList.remove("hidden");

        console.log(
            "Rice and meat mixed!"
        );

        setTimeout(() => {

            leaf.classList.remove("hidden");

            console.log(
                "Leaf appeared!"
            );

        }, 500);

    }

}


/* =========================
   STEP 2
   FILL LEAF
========================= */

makeDraggable(mixedFilling, () => {

    if (
        !mixedFilling.classList.contains("hidden") &&
        !leaf.classList.contains("hidden") &&
        isOverlapping(mixedFilling, leaf)
    ) {

        mixedFilling.classList.add("hidden");

        leaf.classList.add("hidden");

        warakaiah.classList.remove("hidden");

        pan.classList.remove("hidden");

        console.log(
            "Warak Enab rolled!"
        );

        console.log(
            "Pan appeared!"
        );

    }

});


/* =====================================================
   STEP 3
   WARAKAIAH SYSTEM
===================================================== */


/* =========================
   START WARAKAIAH
========================= */

makeDraggable(
    warakaiah,
    handleWarakaiahDrop
);


/* =========================
   HANDLE WARAKAIAH DROP
========================= */

function handleWarakaiahDrop(element) {

    console.log(
        "Warakaiah released."
    );


    /* Make sure the pan exists */

    if (pan.classList.contains("hidden")) {

        console.log(
            "Pan is hidden."
        );

        return;

    }


    /* Check if it touched the pan */

    const touchingPan =
        isOverlapping(element, pan);

    console.log(
        "Touching pan:",
        touchingPan
    );


    /* =========================
       SUCCESSFUL DROP
    ========================= */

    if (touchingPan) {

        warakaiahCount++;

        console.log(
            "WARAKAIAH:",
            warakaiahCount,
            "/",
            REQUIRED_WARAKAIAHS
        );


        /* Create a permanent
           warakaiah inside the pan */

        createPlacedWarakaiah();


        /* Hide draggable one */

        element.classList.add("hidden");


        /* =========================
           FIVE REACHED
        ========================= */

        if (
            warakaiahCount >=
            REQUIRED_WARAKAIAHS
        ) {

            console.log(
                "FIVE WARAKAIAHS!"
            );

            cookWarakEnab();

            return;

        }


        /* =========================
           CREATE NEXT ONE
        ========================= */

        setTimeout(() => {

            resetWarakaiah();

        }, 200);

    }


    /* =========================
       FAILED DROP
    ========================= */

    else {

        console.log(
            "Warakaiah was NOT dropped into pan."
        );

        resetWarakaiah();

    }

}


/* =========================
   RESET DRAGGABLE WARAKAIAH
========================= */

function resetWarakaiah() {

    warakaiah.style.left = "235px";

    warakaiah.style.top = "100px";

    warakaiah.style.zIndex = "20";

    warakaiah.classList.remove("hidden");

}


/* =========================
   CREATE WARAKAIAH
   INSIDE PAN
========================= */

function createPlacedWarakaiah() {

    const placed =
        document.createElement("img");


    placed.src =
        "warakaiah.png";


    placed.className =
        "game-object";


    placed.style.position =
        "absolute";


    placed.style.width =
        "80px";


    /* Positions inside the pan */

    const positions = [

        {
            left: 205,
            top: 225
        },

        {
            left: 275,
            top: 225
        },

        {
            left: 240,
            top: 260
        },

        {
            left: 190,
            top: 270
        },

        {
            left: 290,
            top: 270
        }

    ];


    const position =
        positions[warakaiahCount - 1];


    placed.style.left =
        position.left + "px";

    placed.style.top =
        position.top + "px";


    placed.style.zIndex =
        "25";


    /* Make placed pieces
       impossible to drag */

    placed.style.pointerEvents =
        "none";


    gameContainer.appendChild(placed);


    /* IMPORTANT:
       Remember this piece so we
       can hide it later */

    placedWarakaiahs.push(placed);


    console.log(
        "Placed warakaiah created!"
    );

}


/* =========================
   COOK WARAK ENAB
========================= */

function cookWarakEnab() {

    console.log(
        "Cooking Warak Enab!"
    );


    /* =========================
       HIDE ALL WARAKAIAHS
    ========================= */

    placedWarakaiahs.forEach((placed) => {

        placed.classList.add("hidden");

    });


    /* Hide normal pan */

    pan.classList.add("hidden");


    /* Hide draggable warakaiah */

    warakaiah.classList.add("hidden");


    /* Show cooked pan */

    cookedPan.classList.remove("hidden");

    console.log(
        "Cooked pan appeared!"
    );


    /* Wait for cooking */

    setTimeout(() => {

        finishWarakEnab();

    }, 3000);

}


/* =========================
   FINISHED WARAK ENAB
========================= */

function finishWarakEnab() {

    cookedPan.classList.add("hidden");

    finishedWarakEnab.classList.remove("hidden");

    console.log(
        "Finished Warak Enab!"
    );

}


/* =========================
   SUCCESS SCREEN
========================= */

finishedWarakEnab.addEventListener(
    "click",
    () => {

        finishedWarakEnab.classList.add("hidden");

        successScreen.classList.remove("hidden");

        console.log(
            "SUCCESS!"
        );

    }
);