// barbell.js

document.addEventListener('DOMContentLoaded', () => {
  const plateColorMap = {
    25: 'red',
    20: 'blue',
    15: 'yellow',
    10: 'green',
    5: 'grey',
    2.5: 'red',
    2: 'blue',
    1.5: 'yellow',
    1: 'green',
    0.5: 'white'
  };

  const plateWeights = Object.keys(plateColorMap)
    .map(w => parseFloat(w))
    .sort((a, b) => b - a);

  const barWeightRadios = document.querySelectorAll('input[name="barWeight"]');

  function getSelectedBarWeightInfo() {
    const selected = document.querySelector('input[name="barWeight"]:checked');
    return {
      weight: parseFloat(selected.value),
      color: selected.dataset.color
    };
  }

  function calculatePlateBreakdown(weightPerSide) {
    let remaining = weightPerSide;
    const plates = [];

    plateWeights.forEach(plate => {
      while (remaining >= plate - 0.001) {
        plates.push({ weight: plate, color: plateColorMap[plate] });
        remaining -= plate;
      }
    });

    return plates;
  }

  function createPlateElement(plate) {
    const plateDiv = document.createElement('span');
    plateDiv.className = `plate ${plate.color}`;
    plateDiv.textContent = plate.weight;
    plateDiv.style.backgroundColor = plate.color;
    plateDiv.style.color = (plate.color === 'white' || plate.color === 'yellow') ? 'black' : 'white';
    plateDiv.style.borderRadius = '4px';
    plateDiv.style.margin = '0 2px';
    plateDiv.style.textAlign = 'center';
    plateDiv.style.fontWeight = 'bold';
    plateDiv.style.textShadow = '0 1px 1px rgba(0,0,0,0.4)';
    plateDiv.style.minWidth = plate.weight < 5 ? '20px' : '30px';
    plateDiv.style.padding = plate.weight < 5 ? '6px 2px' : '12px 0px';
    plateDiv.style.fontSize = plate.weight < 5 ? '0.7em' : '0.9em';
    return plateDiv;
  }


  function createBarCenter(barWeight, barColor) {
    const bar = document.createElement('span');
    bar.className = 'bar';
    bar.style.backgroundColor = barColor;
    bar.style.color = (barColor === 'white' || barColor === 'yellow') ? 'black' : 'white';
    bar.style.padding = '6px 12px';
    bar.style.margin = '15px 0px';
    bar.style.borderRadius = '6px';
    bar.style.fontWeight = 'bold';
    bar.style.textAlign = 'center';
    bar.textContent = `${barWeight}`;
    return bar;
  }

  function createBarSection(barColor) {
    const section = document.createElement('span');
    section.className = 'barbell-line';
    section.style.backgroundColor = barColor;
    section.style.borderColor = barColor;
    return section;
  }

  function buildBarbell(exerciseDiv, totalWeight) {
    const { weight: barWeight, color: barColor } = getSelectedBarWeightInfo();
    const platesWeight = (totalWeight - barWeight) / 2;
    const weightPerSide = platesWeight > 0 ? platesWeight : 0;

    const barbellContainer = document.createElement('div');
    barbellContainer.style.display = 'flex';
    barbellContainer.style.alignItems = 'center';
    barbellContainer.style.justifyContent = 'center';
    barbellContainer.style.flexWrap = 'nowrap';
    barbellContainer.style.margin = '0 auto';
    barbellContainer.style.overflowX = 'hidden';
    barbellContainer.style.padding = '5px 0';
    barbellContainer.style.maxWidth = '100%';

    const plateList = calculatePlateBreakdown(weightPerSide);

    // --- Left side (largest plates near bar) ---
    plateList.slice().reverse().forEach(plate => {
      barbellContainer.appendChild(createPlateElement(plate));
    });


    // Bar section
    barbellContainer.appendChild(createBarSection(barColor));

    // Bar center
    barbellContainer.appendChild(createBarCenter(barWeight, barColor));

    // Bar section
    barbellContainer.appendChild(createBarSection(barColor));

    // --- Right side (largest plates near bar) ---
    plateList.forEach(plate => {
      barbellContainer.appendChild(createPlateElement(plate));
    });

    // Clear old display
    exerciseDiv.innerHTML = '';

    // Add weights display
    const weightsText = document.createElement('div');
    weightsText.style.textAlign = 'center';
    weightsText.style.fontSize = '14px';
    weightsText.style.marginBottom = '5px';
    weightsText.innerHTML = `
      ${weightPerSide.toFixed(1)} kg (${(weightPerSide * 2.2).toFixed(1)} lbs)  per side
    `;

    exerciseDiv.appendChild(barbellContainer);
    exerciseDiv.appendChild(weightsText);
  }

  window.renderAllBarbells = function renderAllBarbells() {
    const barbellDivs = document.querySelectorAll('.barbellWorkout');
    barbellDivs.forEach(div => {
      const weight = parseFloat(div.dataset.weight);
      buildBarbell(div, weight);
    });
  }

  // Handle bar weight selection change
  barWeightRadios.forEach(radio => {
    radio.addEventListener('change', renderAllBarbells);
  });

  // Initial render
  renderAllBarbells();
});

