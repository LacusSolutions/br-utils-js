'use strict';

setupInstallationTabs();
setupInstallationCopyButton();
setupGenFeatures();
setupValFeatures();
setupFmtFeatures();


function setupInstallationTabs() {
  const tabsEls = document.querySelectorAll('.tabs');

  tabsEls.forEach((tabEl) => {
    M.Tabs.init(tabEl, {});
  });

  tabsEls.forEach(tab => {
    tab.addEventListener('click', () => {
      console.log('clicked');
    });
  });
}

function setupInstallationCopyButton() {
  const copyBtnsEls = document.querySelectorAll('.tab-view button');

  copyBtnsEls.forEach((copyBtnEl) => {
    const data = copyBtnEl.previousElementSibling.textContent;
    const checkIconEl = copyBtnEl.nextElementSibling;

    copyBtnEl.addEventListener('click', async () => {
      await navigator.clipboard.writeText(data);
      copyBtnEl.style.display = 'none';
      checkIconEl.style.display = 'block';

      setTimeout(() => {
        checkIconEl.style.display = 'none';
        copyBtnEl.style.display = 'block';
      }, 2000);
    });
  });
}

function setupGenFeatures() {
  const outputFieldEl = document.getElementById('gen-output-field');
  const formatFieldEl = document.getElementById('gen-format-field');
  const genBtnEl = document.getElementById('gen-btn');
  const copyBtnEl = document.querySelector('#gen-output button');
  const checkIconEl = copyBtnEl.nextElementSibling;

  formatFieldEl.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    const outputValue = outputFieldEl.value

    if (!outputValue) {
      return;
    }

    if (isChecked) {
      setOutputValue(cpfUtils.format(outputValue));
    } else {
      setOutputValue(outputValue.replace(/\D/g, ''));
    }
  });

  genBtnEl.addEventListener('click', () => {
    const cpf = cpfUtils.generate({
      format: formatFieldEl.checked,
    });

    setOutputValue(cpf);
  });

  copyBtnEl.addEventListener('click', async () => {
    await navigator.clipboard.writeText(outputFieldEl.value);
    copyBtnEl.style.display = 'none';
    checkIconEl.style.display = 'block';

    setTimeout(() => {
      checkIconEl.style.display = 'none';
      copyBtnEl.style.display = 'block';
    }, 2000);
  });

  function setOutputValue(value) {
    outputFieldEl.value = value;
    copyBtnEl.disabled = false;
    M.updateTextFields();
  }
}

function setupValFeatures() {
  const inputFieldEl = document.getElementById('val-input-field');
  const pasteBtnEl = document.querySelector('#val-input button');
  const alertEl = document.getElementById('val-input');

  pasteBtnEl.addEventListener('click', async () => {
    const value = await navigator.clipboard.readText();
    const numericValue = value.replace(/\D/g, '');

    setInputValue(numericValue);
    inputFieldEl.focus();
  });

  inputFieldEl.addEventListener('input', () => {
    const value = inputFieldEl.value;
    const numericValue = value.replace(/\D/g, '');

    if (!numericValue) {
      clearValidation();
      return;
    }

    setInputValue(numericValue);
  });

  inputFieldEl.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      clearValidation();
    }
  });

  function validateCpf() {
    const value = inputFieldEl.value;
    const isValid = cpfUtils.isValid(value);

    if (isValid) {
      alertEl.classList.remove('invalid');
      alertEl.classList.add('valid');
    } else {
      alertEl.classList.remove('valid');
      alertEl.classList.add('invalid');
    }
  }

  function setInputValue(value) {
    inputFieldEl.value = value;
    M.updateTextFields();
    validateCpf();
  }

  function clearValidation() {
    alertEl.classList.remove('valid');
    alertEl.classList.remove('invalid');
    inputFieldEl.value = '';
    M.updateTextFields();
  }
}

function setupFmtFeatures() {
  const inputFieldEl = document.getElementById('fmt-input-field');
  const outputFieldEl = document.getElementById('fmt-output-field');
  const formatBtnEl = document.getElementById('fmt-btn');
  const pasteBtnEl = document.querySelector('#fmt-input button');
  const copyBtnEl = document.querySelector('#fmt-output button');
  const checkIconEl = copyBtnEl.nextElementSibling;
  const delimiterDotEl = document.getElementById('fmt-delimiter-dot');
  const delimiterDashEl = document.getElementById('fmt-delimiter-dash');
  const isHiddenEl = document.getElementById('fmt-is-hidden');
  const hiddenKeyEl = document.getElementById('fmt-hidden-key');
  const hiddenStartEl = document.getElementById('fmt-hidden-range-start');
  const hiddenEndEl = document.getElementById('fmt-hidden-range-end');

  setupFmtFormatButton();
  setupFmtInputField();
  setupFmtPasteButton();
  setupFmtCopyButton();
  setupFmtOptionsControls();
  setupFmtHiddenRange();

  function setInputValue(value) {
    inputFieldEl.value = value.replace(/\D/g, '');
    formatBtnEl.disabled = !value;
    M.updateTextFields();
  }

  function setOutputValue(value) {
    outputFieldEl.value = value;
    copyBtnEl.disabled = !value;
    M.updateTextFields();
  }

  function formatCpf() {
    const formattedValue = cpfUtils.format(inputFieldEl.value, {
      delimiters: {
        dot: delimiterDotEl.value,
        dash: delimiterDashEl.value,
      },
      hidden: isHiddenEl.checked,
      hiddenKey: hiddenKeyEl.value,
      hiddenRange: {
        start: parseInt(hiddenStartEl.textContent) - 1,
        end: parseInt(hiddenEndEl.textContent) - 1,
      },
      onFail: () => '',
    });

    setOutputValue(formattedValue);
  }

  function setupFmtFormatButton() {
    formatBtnEl.addEventListener('click', () => {
      if (!inputFieldEl.value) {
        return;
      }

      formatCpf();
    });
  }

  function setupFmtInputField() {
    inputFieldEl.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        setInputValue('');
        setOutputValue('');
      }
    });

    inputFieldEl.addEventListener('input', () => {
      const value = inputFieldEl.value;
      const numericValue = value.replace(/\D/g, '');

      if (!numericValue) {
        clearValidation();
        return;
      }

      setInputValue(numericValue);
    });
  }

  function setupFmtPasteButton() {
    pasteBtnEl.addEventListener('click', async () => {
      const value = await navigator.clipboard.readText();
      const numericValue = value.replace(/\D/g, '');

      setInputValue(numericValue);
      inputFieldEl.focus();
    });
  }

  function setupFmtCopyButton() {
    copyBtnEl.addEventListener('click', async () => {
      await navigator.clipboard.writeText(outputFieldEl.value);
      copyBtnEl.style.display = 'none';
      checkIconEl.style.display = 'block';

      setTimeout(() => {
      checkIconEl.style.display = 'none';
        copyBtnEl.style.display = 'block';
      }, 2000);
    });
  }

  function setupFmtOptionsControls() {
    delimiterDotEl.addEventListener('input', formatCpf);
    delimiterDashEl.addEventListener('input', formatCpf);
    isHiddenEl.addEventListener('change', formatCpf);
    hiddenKeyEl.addEventListener('input', formatCpf);
  }

  function setupFmtHiddenRange() {
    const sliderEl = document.querySelector('#fmt-hidden-range .slider');

    noUiSlider.create(sliderEl, {
      orientation: 'horizontal',
      connect: true,
      start: [
        parseInt(hiddenStartEl.textContent),
        parseInt(hiddenEndEl.textContent),
      ],
      step: 1,
      range: {
        min: 1,
        max: 11,
      },
      format: wNumb({
        decimals: 0,
      }),
    });

    sliderEl.noUiSlider.on('update', (_valuesString, _handle, valuesNumber) => {
      const [start, end] = valuesNumber;

      hiddenStartEl.textContent = `${start}`;
      hiddenEndEl.textContent = `${end}`;
      formatCpf();
    });
  }
}
