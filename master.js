const img = new Image(),
    canvasContainer = document.getElementById("image-area"),
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    accepted = ["jpeg", "png", "jpg"],
    info = document.getElementById("pixel-info"),
    color = document.getElementById("color");

const readImg = input => {
    if (input.files && input.files[0]) {
        const type = input.files[0].type.split("/")[1];
        if (accepted.includes(type)) {
            const reader = new FileReader();

            reader.onload = e => {
                canvas.classList.remove("hidden");
                info.innerHTML = "";
                color.style.opacity = 0;
                try {
                    canvas.removeEventListener("click", pixelInfo);
                } catch (err) {
                    return;
                }
                img.onload = function () {
                    const ratio = img.width / img.height;
                    canvas.width = canvasContainer.offsetWidth;
                    canvas.height = canvas.width / ratio;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    showInfo(input, img);

                    canvas.addEventListener("click", pixelInfo);
                    canvas.addEventListener("mouseenter", () => {
                        canvas.addEventListener("mousemove", tooltip);
                    });
                    canvas.addEventListener("mouseleave", () => {
                        try {
                            canvas.removeEventListener("mousemove", tooltip);
                            document.getElementById("tooltip").style.visibility = "hidden";
                        } catch (err) {
                            console.log(err);
                        }
                    });
                };
                img.src = e.target.result;
            };

            reader.readAsDataURL(input.files[0]);
        } else {
            alert("Error: tipo de archivo inválido.");
        }
    } else {
        alert("Algo salió mal, por favor vuelva a intentar.");
    }
};

const showInfo = (input, img) => {
    const infoName = document.getElementById("upload-label");
    const infoArea = document.getElementById("image-info");
    const file = input.files[0];
    const name = file.name;

    const info = {
        tamaño: `${file.size / 1000} KB`,
        tipo: file.type.split("/")[1],
        ancho: img.width + "px",
        alto: img.height + "px"
    };

    let str = "";

    for (const [key, value] of Object.entries(info)) {
        str += addP(capitalize(key) + ": " + value);
    }

    infoName.textContent = `Nombre del archivo: ${name}`;
    infoArea.innerHTML = str;
};

const pixelInfo = e => {
    const rect = canvas.getBoundingClientRect();
    const x = floor(e.clientX - rect.left);
    const y = floor(e.clientY - rect.top);
    const p = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = p;
    const hex = rgbToHex(r, g, b).toUpperCase();
    const rgb = rgbString(r, g, b);

    let str = "";
    str += "<h6>Información del pixel:</h6>";
    str += addP("Coordenadas: " + x + ", " + y);
    str += addP("Hex: " + hex, "hex");
    str += addP(`RGB: ${r}, ${g}, ${b}`);

    info.innerHTML = str;
    color.style.background = hex;
    color.style.opacity = 1;
};

const tooltip = e => {
    const rect = canvas.getBoundingClientRect();
    const x = floor(e.clientX - rect.left);
    const y = floor(e.clientY - rect.top);
    const tt = document.getElementById("tooltip");

    const p = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = p;
    const hex = rgbToHex(r, g, b);

    tt.style.background = hex;
    tt.style.visibility = "visible";
    tt.style.top = e.clientY - 30;
    tt.style.left = e.clientX + 10;
};

const addP = (str, id = "") => `<p id=${id}>${str}</p>`;

const capitalize = str => {
    const fl = str.charAt(0);
    return fl.toUpperCase() + str.substring(1);
};
