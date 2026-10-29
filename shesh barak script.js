const gameContainer = document.getElementById("game-container");
const uiLayer = document.getElementById("ui-layer");

const onion = document.getElementById("onion");
const knife = document.getElementById("knife");
const successScreen = document.getElementById("success-screen");
const meat = document.getElementById("meat");
const oil = document.getElementById("oil");
const pan = document.getElementById("pan");
const panWithStuffing =
    document.getElementById("pan-with-stuffing");

const stuffing = document.getElementById("stuffing");

const dough1 = document.getElementById("dough1");
const dough2 = document.getElementById("dough2");
const dough3 = document.getElementById("dough3");

const yogurt = document.getElementById("yogurt");
const cookingPan = document.getElementById("cooking-pan");


/* =========================
   DOUGH + STUFFING
========================= */

let dough1Done = false;
let dough2Done = false;
let dough3Done = false;

function stuffingTouchesDough(dough) {

    const stuffingRect = stuffing.getBoundingClientRect();
    const doughRect = dough.getBoundingClientRect();

    const stuffingCenterX =
        stuffingRect.left + stuffingRect.width / 2;

    const stuffingCenterY =
        stuffingRect.top + stuffingRect.height / 2;

    return (
        stuffingCenterX > doughRect.left &&
        stuffingCenterX < doughRect.right &&
        stuffingCenterY > doughRect.top &&
        stuffingCenterY < doughRect.bottom
    );
}


/* =========================
   STEP VARIABLES
========================= */

let onionInPan = false;
let meatInPan = false;
let oilInPan = false;

let onionCut = false;

let knifeDragging = false;
let knifeOffsetX = 0;
let knifeOffsetY = 0;


/* =========================
   EDGE UI
========================= */

const EDGE_THRESHOLD = 120;

if (gameContainer && uiLayer) {

    gameContainer.addEventListener("mousemove", (event) => {

        const rect = gameContainer.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const nearLeft = x <= EDGE_THRESHOLD;
        const nearRight = x >= rect.width - EDGE_THRESHOLD;
        const nearTop = y <= EDGE_THRESHOLD;
        const nearBottom = y >= rect.height - EDGE_THRESHOLD;

        const nearEdge =
            nearLeft ||
            nearRight ||
            nearTop ||
            nearBottom;

        if (nearEdge) {
            uiLayer.classList.add("visible-ui");
        } else {
            uiLayer.classList.remove("visible-ui");
        }
    });
}


/* =========================
   STEP 1 - CUT ONION
========================= */

knife.addEventListener("mousedown", (event) => {

    if (onionCut) return;

    knifeDragging = true;

    const rect = knife.getBoundingClientRect();

    knifeOffsetX = event.clientX - rect.left;
    knifeOffsetY = event.clientY - rect.top;

    knife.style.cursor = "grabbing";
    knife.style.zIndex = "50";

    event.preventDefault();
});


document.addEventListener("mousemove", (event) => {

    if (!knifeDragging) return;

    const playArea = document.getElementById("play-area");
    const areaRect = playArea.getBoundingClientRect();

    knife.style.left =
        (event.clientX - areaRect.left - knifeOffsetX) + "px";

    knife.style.top =
        (event.clientY - areaRect.top - knifeOffsetY) + "px";


    /* Check if knife touches onion */

    const knifeRect = knife.getBoundingClientRect();
    const onionRect = onion.getBoundingClientRect();

    if (
        knifeRect.left < onionRect.right &&
        knifeRect.right > onionRect.left &&
        knifeRect.top < onionRect.bottom &&
        knifeRect.bottom > onionRect.top
    ) {

        onionCut = true;
        knifeDragging = false;

        onion.src = "cutted onion.png";

        knife.classList.add("hidden");


        /* Start Step 2 */

        setTimeout(() => {

            meat.style.display = "block";
            oil.style.display = "block";
            pan.style.display = "block";

            onion.style.left = "300px";
            onion.style.top = "80px";

        }, 1000);
    }
});


document.addEventListener("mouseup", () => {

    knifeDragging = false;

    if (knife) {
        knife.style.cursor = "grab";
        knife.style.zIndex = "5";
    }
});


/* =========================
   STEP 2 - COOK ONION + MEAT + OIL
========================= */

function makeStep2Draggable(item) {

    if (!item) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;


    item.addEventListener("mousedown", (event) => {

        if (onionCut === false) return;

        dragging = true;

        const rect = item.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        item.style.cursor = "grabbing";
        item.style.zIndex = "20";

        event.preventDefault();
    });


    document.addEventListener("mousemove", (event) => {

        if (!dragging) return;

        const playArea =
            document.getElementById("play-area");

        const areaRect =
            playArea.getBoundingClientRect();

        item.style.left =
            (event.clientX - areaRect.left - offsetX) + "px";

        item.style.top =
            (event.clientY - areaRect.top - offsetY) + "px";
    });


    document.addEventListener("mouseup", () => {

        if (!dragging) return;

        dragging = false;

        item.style.cursor = "grab";
        item.style.zIndex = "5";


        if (isInside(item, pan)) {

            if (item === onion) {
                onionInPan = true;
            }

            if (item === meat) {
                meatInPan = true;
            }

            if (item === oil) {
                oilInPan = true;
            }

            item.style.pointerEvents = "none";

            checkStep2();
        }
    });
}


/* =========================
   CHECK IF OBJECT IS INSIDE
========================= */

function isInside(item, target) {

    const itemRect = item.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const itemCenterX =
        itemRect.left + itemRect.width / 2;

    const itemCenterY =
        itemRect.top + itemRect.height / 2;

    return (
        itemCenterX > targetRect.left &&
        itemCenterX < targetRect.right &&
        itemCenterY > targetRect.top &&
        itemCenterY < targetRect.bottom
    );
}


/* =========================
   CHECK STEP 2
========================= */

function checkStep2() {

    if (onionInPan && meatInPan && oilInPan) {

        onion.style.display = "none";
        meat.style.display = "none";
        oil.style.display = "none";

        pan.style.display = "none";

        panWithStuffing.style.display = "block";


        /* Start Step 3 after 1 second */

        setTimeout(() => {

            panWithStuffing.style.display = "none";

            stuffing.style.display = "block";

            dough1.style.display = "block";
            dough2.style.display = "block";
            dough3.style.display = "block";

            console.log("Step 3 started!");

        }, 1000);
    }
}


/* Make Step 2 ingredients draggable */

makeStep2Draggable(onion);
makeStep2Draggable(meat);
makeStep2Draggable(oil);


/* =========================
   STEP 3 - STUFFING
========================= */

let stuffingDragging = false;

let stuffingOffsetX = 0;
let stuffingOffsetY = 0;


stuffing.addEventListener("mousedown", (event) => {

    stuffingDragging = true;

    const rect = stuffing.getBoundingClientRect();

    stuffingOffsetX =
        event.clientX - rect.left;

    stuffingOffsetY =
        event.clientY - rect.top;

    stuffing.style.cursor = "grabbing";
    stuffing.style.zIndex = "30";

    event.preventDefault();
});


document.addEventListener("mousemove", (event) => {

    if (!stuffingDragging) return;

    const playArea =
        document.getElementById("play-area");

    const areaRect =
        playArea.getBoundingClientRect();

    stuffing.style.left =
        (event.clientX - areaRect.left - stuffingOffsetX) + "px";

    stuffing.style.top =
        (event.clientY - areaRect.top - stuffingOffsetY) + "px";
});


document.addEventListener("mouseup", () => {

    if (!stuffingDragging) return;

    stuffingDragging = false;

    stuffing.style.cursor = "grab";
    stuffing.style.zIndex = "5";


    /* Put stuffing into dough 1 */

    if (!dough1Done && stuffingTouchesDough(dough1)) {

        dough1Done = true;

        dough1.src = "sheshbarakaiah.png";
    }


    /* Put stuffing into dough 2 */

    else if (!dough2Done && stuffingTouchesDough(dough2)) {

        dough2Done = true;

        dough2.src = "sheshbarakaiah.png";
    }


    /* Put stuffing into dough 3 */

    else if (!dough3Done && stuffingTouchesDough(dough3)) {

        dough3Done = true;

        dough3.src = "sheshbarakaiah.png";
    }


    /* Return stuffing to starting position */

    stuffing.style.left = "100px";
    stuffing.style.top = "150px";


    /* When all three are finished, start Step 4 */

    if (dough1Done && dough2Done && dough3Done) {

    stuffing.style.display = "none";
    pan.style.display = "block";

    console.log("Step 4 started!");
}
});


/* =========================
   STEP 4 - SHESH BARAK INTO PAN
========================= */

let shesh1InPan = false;
let shesh2InPan = false;
let shesh3InPan = false;


/* =========================
   MAKE SHESH BARAK DRAGGABLE
========================= */

function makeSheshDraggable(item, number) {

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;


    item.addEventListener("mousedown", (event) => {

        /* Only allow dragging after it became Shesh Barak */

        if (
            (number === 1 && !dough1Done) ||
            (number === 2 && !dough2Done) ||
            (number === 3 && !dough3Done)
        ) {
            return;
        }


        dragging = true;

        const rect = item.getBoundingClientRect();

        offsetX =
            event.clientX - rect.left;

        offsetY =
            event.clientY - rect.top;

        item.style.cursor = "grabbing";
        item.style.zIndex = "30";

        event.preventDefault();
    });


    document.addEventListener("mousemove", (event) => {

        if (!dragging) return;

        const playArea =
            document.getElementById("play-area");

        const areaRect =
            playArea.getBoundingClientRect();

        item.style.left =
            (event.clientX - areaRect.left - offsetX) + "px";

        item.style.top =
            (event.clientY - areaRect.top - offsetY) + "px";
    });


    document.addEventListener("mouseup", () => {

        if (!dragging) return;

        dragging = false;

        item.style.cursor = "grab";
        item.style.zIndex = "5";


        /* Put Shesh Barak into the pan */

        if (isInside(item, pan)) {

            if (number === 1) {
                shesh1InPan = true;
            }

            if (number === 2) {
                shesh2InPan = true;
            }

            if (number === 3) {
                shesh3InPan = true;
            }


            checkSheshInPan();
        }
    });
}


/* =========================
   CHECK ALL SHESH BARAK
========================= */

function checkSheshInPan() {

    if (
        shesh1InPan &&
        shesh2InPan &&
        shesh3InPan
    ) {

        console.log("All three Shesh Barak are in the pan!");

        /* Show yogurt */

        yogurt.style.display = "block";
    }
}


/* Make all three Shesh Barak draggable */

makeSheshDraggable(dough1, 1);
makeSheshDraggable(dough2, 2);
makeSheshDraggable(dough3, 3);


/* =========================
   STEP 4 - YOGURT
========================= */

let yogurtDragging = false;

let yogurtOffsetX = 0;
let yogurtOffsetY = 0;


yogurt.addEventListener("mousedown", (event) => {

    yogurtDragging = true;

    const rect = yogurt.getBoundingClientRect();

    yogurtOffsetX =
        event.clientX - rect.left;

    yogurtOffsetY =
        event.clientY - rect.top;

    yogurt.style.cursor = "grabbing";
    yogurt.style.zIndex = "30";

    event.preventDefault();
});


document.addEventListener("mousemove", (event) => {

    if (!yogurtDragging) return;

    const playArea =
        document.getElementById("play-area");

    const areaRect =
        playArea.getBoundingClientRect();

    yogurt.style.left =
        (event.clientX - areaRect.left - yogurtOffsetX) + "px";

    yogurt.style.top =
        (event.clientY - areaRect.top - yogurtOffsetY) + "px";
});


document.addEventListener("mouseup", () => {

    if (!yogurtDragging) return;

    yogurtDragging = false;

    yogurt.style.cursor = "grab";
    yogurt.style.zIndex = "5";


    /* Put yogurt into the pan */

    if (isInside(yogurt, pan)) {

        yogurtInPan = true;

        yogurt.style.pointerEvents = "none";

        checkYogurt();
    }
});


/* =========================
   CHECK YOGURT
========================= */

function checkYogurt() {

    if (yogurtInPan) {

        /* Hide normal pan and yogurt */

        pan.style.display = "none";
        yogurt.style.display = "none";


        /* Show cooking pan */

        cookingPan.style.display = "block";

        console.log("Shesh Barak is ready to cook!");
    }
}
/* =========================
   STEP 5 - FINISH COOKING
========================= */

const finishedSheshBarak =
    document.getElementById("finished-sheshbarak");

cookingPan.addEventListener("click", () => {

    cookingPan.style.display = "none";

    finishedSheshBarak.style.display = "block";

    console.log("Shesh Barak is finished!");
});


/* =========================
   SUCCESS SCREEN
========================= */

finishedSheshBarak.addEventListener("click", () => {

    finishedSheshBarak.style.display = "none";

    successScreen.classList.remove("hidden");

    console.log("Success screen shown!");
});