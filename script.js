document.addEventListener("DOMContentLoaded", () => {

    let currentStep = 1;

    const gameContainer = document.getElementById("game-container");
    const uiLayer = document.getElementById("ui-layer");

    const eggplant = document.getElementById("eggplant");
    const bowl = document.getElementById("bowl");
    const rice = document.getElementById("rice");
    const meat = document.getElementById("meat");
    const mixedFilling = document.getElementById("mixed-filling");
    const spoon = document.getElementById("spoon");

    const stuffingEggplant = document.getElementById("stuffing-eggplant");
    const stuffing = document.getElementById("stuffing");

    const pan = document.getElementById("pan");
    const panDropZone = document.getElementById("pan-drop-zone");

    const stove = document.getElementById("stove");
    const startCooking = document.getElementById("start-cooking");

    const finishedMahshi = document.getElementById("finished-mahshi");
    const successScreen = document.getElementById("success-screen");


    /*const EDGE_THRESHOLD = 120;

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
       STEP 1
       OPEN EGGPLANT
    ========================= */

    if (eggplant) {

        eggplant.addEventListener("click", () => {

            if (currentStep !== 1) return;

            eggplant.src = "eggplant-open.png";

            currentStep = 1.5;

            setTimeout(() => {
                startStep2();
            }, 700);
        });
    }


    /* =========================
       STEP 2
       RICE + MEAT
    ========================= */

    let riceAdded = false;
    let meatAdded = false;
    let mixtureShown = false;

    function startStep2() {

        currentStep = 2;

        eggplant.classList.add("hidden");

        bowl.classList.remove("hidden");
        rice.classList.remove("hidden");
        meat.classList.remove("hidden");

        spoon.classList.add("hidden");
        mixedFilling.classList.add("hidden");

        rice.style.cursor = "grab";
        meat.style.cursor = "grab";
    }


    makeDraggable(rice, "rice");
    makeDraggable(meat, "meat");


    function ingredientDropped(element, type) {

        if (currentStep !== 2) return;

        if (isInside(element, bowl)) {

            if (type === "rice") {

                riceAdded = true;

                rice.style.left = "355px";
                rice.style.top = "245px";

                rice.style.zIndex = "25";
            }

            if (type === "meat") {

                meatAdded = true;

                meat.style.left = "390px";
                meat.style.top = "250px";

                meat.style.zIndex = "26";
            }

            checkMixing();
        }
    }


    function checkMixing() {

        if (riceAdded && meatAdded) {

            spoon.classList.remove("hidden");

            spoon.style.cursor = "grab";
            spoon.style.zIndex = "30";

            currentStep = 2.5;
        }
    }


    /* =========================
       SPOON MIXING
    ========================= */

    let spoonDragging = false;
    let spoonOffsetX = 0;
    let spoonOffsetY = 0;

    spoon.addEventListener("mousedown", (event) => {

        if (currentStep !== 2.5) return;

        spoonDragging = true;

        const rect = spoon.getBoundingClientRect();

        spoonOffsetX =
            event.clientX - rect.left;

        spoonOffsetY =
            event.clientY - rect.top;

        spoon.style.cursor = "grabbing";
        spoon.style.zIndex = "100";

        event.preventDefault();
    });


    document.addEventListener("mousemove", (event) => {

        if (!spoonDragging) return;

        const playArea =
            document.getElementById("play-area");

        if (!playArea) return;

        const areaRect =
            playArea.getBoundingClientRect();

        spoon.style.left =
            (event.clientX -
            areaRect.left -
            spoonOffsetX) + "px";

        spoon.style.top =
            (event.clientY -
            areaRect.top -
            spoonOffsetY) + "px";


        /* MIX WHEN SPOON ENTERS BOWL */

        if (
            currentStep === 2.5 &&
            isInside(spoon, bowl) &&
            !mixtureShown
        ) {

            mixtureShown = true;

            rice.classList.add("hidden");
            meat.classList.add("hidden");

            mixedFilling.classList.remove("hidden");

            mixedFilling.style.zIndex = "40";

            mixedFilling.style.transform =
                "scale(0.8)";

            setTimeout(() => {

                mixedFilling.style.transform =
                    "scale(1)";

            }, 100);


            setTimeout(() => {

                bowl.classList.add("hidden");
                spoon.classList.add("hidden");
                mixedFilling.classList.add("hidden");

                startStep3();

            }, 900);
        }
    });


    document.addEventListener("mouseup", () => {

        if (!spoonDragging) return;

        spoonDragging = false;

        spoon.style.cursor = "grab";
    });


    /* =========================
   STEP 3
   STUFF THE ZUCCHINI
========================= */

function startStep3() {

    currentStep = 3;

    stuffingEggplant.classList.remove("hidden");
    stuffing.classList.remove("hidden");

    /* Put the filling close to the zucchini */

    stuffing.style.left = "390px";
    stuffing.style.top = "300px";

    stuffing.style.zIndex = "50";
    stuffing.style.cursor = "grab";

    makeDraggable(stuffing, "stuffing", () => {

        if (isInside(stuffing, stuffingEggplant)) {

            stuffing.classList.add("hidden");

            stuffingEggplant.src = "stuffed-eggplant.png";

            currentStep = 4;

            setTimeout(() => {
                startStep4();
            }, 700);
        }
    });
}

    /* =========================
       STEP 4
       PUT IN PAN
    ========================= */

    function startStep4() {

        stuffingEggplant.classList.add("hidden");

        pan.classList.remove("hidden");
        panDropZone.classList.remove("hidden");

        createStuffedEggplants();
    }


    function createStuffedEggplants() {

        const positions = [
            [275, 200],
            [350, 180],
            [425, 210],
            [290, 290],
            [370, 280],
            [440, 300]
        ];

        let placed = 0;

        positions.forEach((position) => {

            const egg = document.createElement("img");

            egg.src = "stuffed-eggplant.png";

            egg.classList.add("game-object");

            egg.style.width = "80px";
            egg.style.left = "400px";
egg.style.top = "350px";
            egg.style.zIndex = "30";
            egg.style.cursor = "grab";

            document
                .getElementById("play-area")
                .appendChild(egg);


            makeDraggable(egg, "panEgg", () => {

                if (
                    isInside(egg, panDropZone) &&
                    egg.dataset.placed !== "true"
                ) {

                    egg.style.left =
                        position[0] + "px";

                    egg.style.top =
                        position[1] + "px";

                    egg.style.cursor = "default";

                    egg.dataset.placed = "true";

                    placed++;

                    if (placed === positions.length) {

                        currentStep = 5;

                        setTimeout(() => {
                            startStep5();
                        }, 800);
                    }
                }
            });
        });
    }


    /* =========================
       STEP 5
       COOK
    ========================= */

function startStep5() {

    pan.classList.remove("hidden");
    panDropZone.classList.add("hidden");

    stove.classList.remove("hidden");

    stove.style.zIndex = "10";
    pan.style.zIndex = "20";

    startCooking.classList.remove("hidden");

}


    

startCooking.addEventListener("click", () => {

    startCooking.classList.add("hidden");

    // Hide the stove and pan
    stove.classList.add("hidden");
    pan.classList.add("hidden");

    // Hide all individual mahshi pieces
    document.querySelectorAll("#play-area .game-object").forEach(egg => {
        egg.classList.add("hidden");
    });

    // Show the finished mahashi
    finishedMahshi.classList.remove("hidden");

    // Show the success screen after a short pause
    setTimeout(() => {
        successScreen.classList.remove("hidden");
    }, 1000);

});



    /* =========================
       FINAL RESULT
    ========================= */

    function finishGame() {

    /* Hide the stove */

    stove.classList.add("hidden");

    /* Hide the pan */

    pan.classList.add("hidden");

    /* Hide the timer */

    timer.classList.add("hidden");

    /* Hide the cooking button */

    startCooking.classList.add("hidden");

    /* Hide all the individual mehshi */

    const mehshi =
        document.querySelectorAll(".game-object");

    mehshi.forEach((egg) => {
        egg.classList.add("hidden");
    });

    /* Show the finished mahshi */

    finishedMahshi.classList.remove("hidden");

    /* Show success screen */

    setTimeout(() => {
        successScreen.classList.remove("hidden");
    }, 1000);
}


    /* =========================
       MOUSE DRAG SYSTEM
    ========================= */

    function makeDraggable(element, type, onDrop) {

        if (!element) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;


        element.addEventListener("mousedown", (event) => {

            if (type === "rice" || type === "meat") {
                if (currentStep !== 2) return;
            }

            if (type === "stuffing") {
                if (currentStep !== 3) return;
            }

            if (type === "panEgg") {
                if (currentStep !== 4) return;
            }

            isDragging = true;

            const rect =
                element.getBoundingClientRect();

            offsetX =
                event.clientX - rect.left;

            offsetY =
                event.clientY - rect.top;

            element.style.cursor = "grabbing";
            element.style.zIndex = "100";

            event.preventDefault();
        });


        document.addEventListener("mousemove", (event) => {

            if (!isDragging) return;

            const playArea =
                document.getElementById("play-area");

            if (!playArea) return;

            const areaRect =
                playArea.getBoundingClientRect();

            element.style.left =
                (event.clientX -
                areaRect.left -
                offsetX) + "px";

            element.style.top =
                (event.clientY -
                areaRect.top -
                offsetY) + "px";
        });


        document.addEventListener("mouseup", () => {

            if (!isDragging) return;

            isDragging = false;

            element.style.cursor = "grab";
            element.style.zIndex = "20";

            if (type === "rice") {
                ingredientDropped(element, "rice");
            }

            if (type === "meat") {
                ingredientDropped(element, "meat");
            }

            if (onDrop) {
                onDrop();
            }
        });
    }


    /* =========================
       DROP CHECK
    ========================= */

    function isInside(object, target) {

        if (!object || !target) return false;

        const objectRect =
            object.getBoundingClientRect();

        const targetRect =
            target.getBoundingClientRect();

        const objectCenterX =
            objectRect.left +
            objectRect.width / 2;

        const objectCenterY =
            objectRect.top +
            objectRect.height / 2;

        return (
            objectCenterX > targetRect.left &&
            objectCenterX < targetRect.right &&
            objectCenterY > targetRect.top &&
            objectCenterY < targetRect.bottom
        );
    }

});