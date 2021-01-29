// TODO: add pixel information and functionality
// TODO: move to canvas

const img = new Image();
const canvasContainer = document.getElementById("image-area");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const accepted = ["jpeg", "png", "jpg"];

const readImg = input => {
    if (input.files && input.files[0]) {
        const type = input.files[0].type.split("/")[1];
        if (accepted.includes(type)) {
            const reader = new FileReader();

            reader.onload = e => {
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
    const info = document.getElementById("pixel-info");

    const rect = canvas.getBoundingClientRect();
    const x = floor(e.clientX - rect.left);
    const y = floor(e.clientY - rect.top);
    const p = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = p;
    const hex = rgbToHex(r, g, b);
    const rgb = rgbString(r, g, b);

    let str = "";
    str += "<h6>Información del pixel:</h6>";
    str += addP("Coordenadas: " + x + ", " + y);
    str += addP("Hex: " + hex);
    str += addP(`RGB: ${r}, ${g}, ${b}`);

    info.innerHTML = str;
};

const addP = str => `<p>${str}</p>`;

const capitalize = str => {
    const fl = str.charAt(0);
    return fl.toUpperCase() + str.substring(1);
};
