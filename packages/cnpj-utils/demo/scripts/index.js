'use strict';

setupSkipLinks();
setupInstallationTabs();
setupInstallationCopyButton();
setupGenFeatures();
setupValFeatures();
setupFmtFeatures();
setupHotkeys();

function setupSkipLinks() {
  const skipLinks = document.querySelectorAll('.skip-link');

  skipLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function setupInstallationTabs() {
  const tabsEl = document.querySelector('[role="tablist"]');
  const tabEls = tabsEl.querySelectorAll('[role="tab"]');

  M.Tabs.init(tabsEl, {});
  tabEls.forEach((tabEl) => {
    tabEl.addEventListener('click', (event) => {
      event.preventDefault();
      activateTab(tabEl);
    });
  });

  function activateTab(tabEl) {
    const ariaAttribute = 'aria-selected';

    tabEls.forEach((tabEl) => tabEl.setAttribute(ariaAttribute, 'false'));
    document.querySelector(tabEl.getAttribute('href'))?.focus();
    tabEl.setAttribute(ariaAttribute, 'true');
  }
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
      setOutputValue(cnpjUtils.format(outputValue));
    } else {
      setOutputValue(outputValue.replace(/\D/g, ''));
    }
  });

  genBtnEl.addEventListener('click', () => {
    const cnpj = cnpjUtils.generate({
      format: formatFieldEl.checked,
    });

    setOutputValue(cnpj);
    copyBtnEl.focus();
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

  function validateCnpj() {
    const value = inputFieldEl.value;
    const isValid = cnpjUtils.isValid(value);

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
    validateCnpj();
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

  function formatCnpj() {
    const formattedValue = cnpjUtils.format(inputFieldEl.value, {
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

      formatCnpj();
    });
  }

  function setupFmtInputField() {
    inputFieldEl.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        setInputValue('');
        setOutputValue('');
      }

      if (inputFieldEl.value && event.key === 'Enter') {
        formatCnpj();
        copyBtnEl.focus();
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
    delimiterDotEl.addEventListener('input', formatCnpj);
    delimiterDashEl.addEventListener('input', formatCnpj);
    isHiddenEl.addEventListener('change', formatCnpj);
    hiddenKeyEl.addEventListener('input', formatCnpj);
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
        max: 14,
      },
      format: wNumb({
        decimals: 0,
      }),
    });

    sliderEl.noUiSlider.on('update', (_valuesString, _handle, valuesNumber) => {
      const [start, end] = valuesNumber;

      hiddenStartEl.textContent = `${start}`;
      hiddenEndEl.textContent = `${end}`;
      formatCnpj();
    });
  }
}

function setupHotkeys() {
  document.addEventListener('keydown', function (event) {
    if (event.altKey && event.key === 'g') {
      event.preventDefault();

      document.getElementById('gen-title').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('gen-btn').click();
      document.querySelector('#gen-output-field').focus();
    }

    if (event.altKey && event.key === 'v') {
      event.preventDefault();

      document.getElementById('val-title').scrollIntoView({ behavior: 'smooth' });
      document.querySelector('#val-input button').click();
      document.querySelector('#val-input input').focus();
    }

    if (event.altKey && event.key === 'f') {
      event.preventDefault();

      document.getElementById('fmt-title').scrollIntoView({ behavior: 'smooth' });
      document.querySelector('#fmt-input button').click();
    }
  });
}
