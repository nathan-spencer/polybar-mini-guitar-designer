const colorOptions = [
  { name: "Red", value: "#8A1D29" },
  { name: "Orange", value: "#EE7539" },
  { name: "Yellow", value: "#E7CC20" },
  { name: "Green", value: "#2C4A39" },
  { name: "Neon Green", value: "#7FBE74" },
  { name: "Blue", value: "#2D8CC9" },
  { name: "Royal Blue", value: "#10287B" },
  { name: "Light Blue", value: "#6DB9CA" },
  { name: "Purple", value: "#523177" },
  { name: "Pink", value: "#F28498" },
  { name: "Black", value: "#0E0E15" },
  { name: "White", value: "#FFFFFF" },
  { name: "Silver", value: "#767782" },
  { name: "Clear", value: "#D4D2CC" },
];

const getContrastYIQ = (hexcolor) => {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

document.querySelectorAll(".color-picker").forEach((div) => {
  div.onclick = (event) => {
    event.stopPropagation();
    const dialog = document.createElement("dialog");
    const colorDialog = document.createElement("div");
    colorDialog.style.display = "flex";
    colorDialog.style.flexWrap = "wrap";
    colorDialog.style.justifyContent = "center";
    colorDialog.style.padding = "10px";

    colorOptions.forEach((color) => {
      const colorOption = document.createElement("div");
      colorOption.textContent = color.name;
      colorOption.style.backgroundColor = color.value;
      colorOption.style.color = getContrastYIQ(color.value);
      colorOption.style.cursor = "pointer";
      colorOption.style.width = "50px";
      colorOption.style.height = "50px";
      colorOption.style.display = "flex";
      colorOption.style.justifyContent = "center";
      colorOption.style.alignItems = "center";
      colorOption.style.margin = "5px";
      colorOption.style.borderRadius = "5px";
      colorOption.style.fontWeight = "bold";
      colorOption.style.fontSize = "12px";
      colorOption.style.textTransform = "uppercase";

      colorOption.onclick = () => {
        div.style.backgroundColor = color.value;
        div.style.color = getContrastYIQ(color.value);
        dialog.close();
      };
      colorDialog.appendChild(colorOption);
    });

    dialog.appendChild(colorDialog);
    document.body.appendChild(dialog);
    dialog.showModal();
  };
});

const updateColorInfo = () => {
  const colorInfo = document.getElementById("color-info");
  const colorPickers = document.querySelectorAll(".color-picker");
  let output = "";

  const numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  numbers.forEach((number, index) => {
    const picker = document.getElementById(number);
    if (picker) {
      const backgroundColor = picker.style.backgroundColor;
      const rgbToHex = (rgb) => {
        const values = rgb.match(/\d+/g);
        if (!values) return "";
        return "#" + values.map((x) => parseInt(x).toString(16).padStart(2, "0")).join("");
      };
      const hexColor = rgbToHex(backgroundColor);
      const colorName = colorOptions.find((c) => c.value.toLowerCase() === hexColor.toLowerCase())?.name || "Not Found";
      output += `${index + 1} - ${colorName}\n`;
    }
  });

  colorInfo.value = output.trim();
};

// Initial update
updateColorInfo();

// Add event listener to update when colors change
document.querySelectorAll(".color-picker").forEach((div) => {
  const originalClick = div.onclick;
  div.onclick = (event) => {
    const observer = new MutationObserver((mutations) => {
      updateColorInfo();
      observer.disconnect();
    });
    observer.observe(div, { attributes: true, attributeFilter: ["style"] });
    originalClick(event);
  };
});
