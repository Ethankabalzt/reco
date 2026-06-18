const BASE_URL = '';

const NOTIF_DELAY = 5000;

function showNotification(elementId, message, type) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.className = 'notification ' + type;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, NOTIF_DELAY);
}

function getFormData(formId) {
  const form = document.getElementById(formId);
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

function resetForm(formId) {
  document.getElementById(formId).reset();
}

async function postJSON(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  return { ok: response.ok, status: response.status, body: text };
}

const passwordInput = document.getElementById('user-password');
const rules = {
  lower: document.querySelector('[data-rule="lower"]'),
  upper: document.querySelector('[data-rule="upper"]'),
  digit: document.querySelector('[data-rule="digit"]'),
  special: document.querySelector('[data-rule="special"]'),
  length: document.querySelector('[data-rule="length"]'),
};

function validatePassword(value) {
  const checks = {
    lower: /[a-z]/.test(value),
    upper: /[A-Z]/.test(value),
    digit: /\d/.test(value),
    special: /[@#$%^&*!?]/.test(value),
    length: value.length >= 8,
  };
  for (const [rule, valid] of Object.entries(checks)) {
    rules[rule].className = valid ? 'valid' : 'invalid';
  }
  return Object.values(checks).every(Boolean);
}

if (passwordInput) {
  passwordInput.addEventListener('input', () => {
    validatePassword(passwordInput.value);
  });
}

document.getElementById('form-user').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = getFormData('form-user');

  if (!validatePassword(data.password)) {
    showNotification('notif-user', 'La contraseña no cumple los requisitos de seguridad', 'error');
    return;
  }

  const result = await postJSON(BASE_URL + '/users/add', data);
  if (result.ok || result.status === 201) {
    showNotification('notif-user', '¡Registro exitoso!', 'success');
    resetForm('form-user');
  } else {
    showNotification('notif-user', 'Error: ' + (result.body || 'No se pudo registrar el usuario'), 'error');
  }
});

document.getElementById('form-space').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = getFormData('form-space');
  data.price = parseFloat(data.price);

  const result = await postJSON(BASE_URL + '/spaces/add', data);
  if (result.ok || result.status === 201) {
    showNotification('notif-space', '¡Espacio registrado exitosamente!', 'success');
    resetForm('form-space');
  } else {
    showNotification('notif-space', 'Error: ' + (result.body || 'No se pudo registrar el espacio'), 'error');
  }
});

document.getElementById('form-reservation').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = getFormData('form-reservation');
  data.spaceId = parseInt(data.spaceId, 10);
  data.startDate += ':00';
  data.endDate += ':00';

  const result = await postJSON(BASE_URL + '/reservation/add', data);
  if (result.ok || result.status === 201) {
    showNotification('notif-reservation', '¡Reservación creada exitosamente!', 'success');
    resetForm('form-reservation');
  } else {
    showNotification('notif-reservation', 'Error: ' + (result.body || 'No se pudo crear la reservación'), 'error');
  }
});
