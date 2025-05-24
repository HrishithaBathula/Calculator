
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

let display = document.getElementById("display");
let isRad = true;


function appendFunction(func) {
  if (display.value === "0" || display.value === "Error") display.value = "";
  if (func === "+/-") {
   
    if (display.value.startsWith("-")) {
      display.value = display.value.slice(1);
    } else {
      display.value = "-" + display.value;
    }
    return;
  }
  display.value += func;
}


function clearDisplay() {
  display.value = "0";
}


function calculate() {
  try {
    let expr = display.value
      .replace(/π/g, "Math.PI")
      .replace(/e/g, "Math.E")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/\^2/g, "**2")
      .replace(/\^/g, "**")
      .replace(/\|x\|/g, "Math.abs")
      .replace(/1\//g, "1/");

    
    expr = expr.replace(/ln\(/g, "Math.log(");

    
    expr = expr.replace(/log\(/g, "Math.log10(");

    
    expr = expr.replace(/sin\(/g, isRad ? "Math.sin(" : "Math.sin(toRad(");
    expr = expr.replace(/cos\(/g, isRad ? "Math.cos(" : "Math.cos(toRad(");
    expr = expr.replace(/tan\(/g, isRad ? "Math.tan(" : "Math.tan(toRad(");

    
    function toRad(deg) {
      return (deg * Math.PI) / 180;
    }

   
    const f = new Function("toRad", "return " + expr);
    const result = f(toRad);

    if (result === undefined || isNaN(result)) {
      display.value = "Error";
      return;
    }

    addToHistory(display.value + " = " + result);
    display.value = result;
  } catch (e) {
    display.value = "Error";
  }
}

// History
function addToHistory(entry) {
  const list = document.getElementById("historyList");
  const li = document.createElement("li");
  li.textContent = entry;
  list.appendChild(li);
}

function clearHistory() {
  document.getElementById("historyList").innerHTML = "";
}

// Conversion units data
const unitData = {
  Length: {
    Meters: 1,
    Kilometers: 1000,
    Feet: 0.3048,
    Inches: 0.0254,
    Miles: 1609.34,
  },
  Area: {
    "Square meters": 1,
    Acres: 4046.86,
    Hectares: 10000,
    "Square feet": 0.092903,
  },
  Temperature: ["Celsius", "Fahrenheit", "Kelvin"], 
  Volume: {
    Liters: 1,
    Milliliters: 0.001,
    Gallons: 3.78541,
    "Cubic meters": 1000,
  },
  Mass: {
    Grams: 1,
    Kilograms: 1000,
    Pounds: 453.592,
    Ounces: 28.3495,
  },
  Speed: {
    "m/s": 1,
    "km/h": 0.277778,
    mph: 0.44704,
  },
  Data: {
    KB: 1,
    MB: 1024,
    GB: 1048576,
    TB: 1073741824,
  },
  Time: {
    Seconds: 1,
    Minutes: 60,
    Hours: 3600,
    Days: 86400,
  },
};


function updateUnits(category) {
  const fromSelect = document.getElementById("fromUnit");
  const toSelect = document.getElementById("toUnit");

  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  if (category === "Temperature") {
    unitData.Temperature.forEach((unit) => {
      fromSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
      toSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
  } else {
    Object.keys(unitData[category]).forEach((unit) => {
      fromSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
      toSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
  }
}


function selectCategory(category, btn) {
  document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  updateUnits(category);
  clearConvInput();
  document.getElementById("convertedResult").textContent = "";
 
  currentCategory = category;
}


let currentCategory = "Length";

function convertUnits() {
  let fromUnit = document.getElementById("fromUnit").value;
  let toUnit = document.getElementById("toUnit").value;
  let inputValue = parseFloat(document.getElementById("inputValue").value);

  if (isNaN(inputValue)) {
    alert("Please enter a valid number.");
    return;
  }

  if (currentCategory === "Temperature") {
    let result;
    if (fromUnit === toUnit) {
      result = inputValue;
    } else if (fromUnit === "Celsius") {
      if (toUnit === "Fahrenheit") result = (inputValue * 9) / 5 + 32;
      else if (toUnit === "Kelvin") result = inputValue + 273.15;
    } else if (fromUnit === "Fahrenheit") {
      if (toUnit === "Celsius") result = ((inputValue - 32) * 5) / 9;
      else if (toUnit === "Kelvin") result = ((inputValue - 32) * 5) / 9 + 273.15;
    } else if (fromUnit === "Kelvin") {
      if (toUnit === "Celsius") result = inputValue - 273.15;
      else if (toUnit === "Fahrenheit") result = ((inputValue - 273.15) * 9) / 5 + 32;
    }
    if (result === undefined) {
      alert("Invalid conversion");
      return;
    }
    document.getElementById("convertedResult").textContent = `${result.toFixed(4)} ${toUnit}`;
  } else {
    let baseValue = inputValue * unitData[currentCategory][fromUnit]; 
    let convertedValue = baseValue / unitData[currentCategory][toUnit];
    document.getElementById("convertedResult").textContent = `${convertedValue.toFixed(6)} ${toUnit}`;
  }
}


function appendConvNumber(num) {
  let input = document.getElementById("inputValue");
  if (input.value === "0") input.value = "";
  input.value += num;
}

function clearConvInput() {
  document.getElementById("inputValue").value = "";
}


window.onload = () => {
  updateUnits(currentCategory);
};
