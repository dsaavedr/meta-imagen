// TODO: add pixel information and functionality

const readImg = input => {
    const img = document.getElementById("imageResult");

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        const oImg = new Image();

        oImg.onload = () => {
            console.log(oImg.width, oImg.height);
            showInfo(input, oImg);
        };

        reader.onload = e => {
            img.src = e.target.result;
            oImg.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
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
        str += addP(key.toUpperCase() + ": " + value);
    }

    infoName.textContent = `Nombre del archivo: ${name}`;
    infoArea.innerHTML = str;
};

const addP = str => `<p>${str}</p>`;
