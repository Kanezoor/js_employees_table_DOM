'use strict';

function savedChanges(input, cell, originalValue) {
  let newValue = input.value.trim() || originalValue;

  const indexOfSalaryColumn = 4;

  if (cell.cellIndex === indexOfSalaryColumn) {
    const numericValue = Number(newValue.replace(/[^0-9]/g, ''));

    if (!isNaN(numericValue)) {
      newValue = `$${numericValue.toLocaleString()}`;
    }
  }
  cell.textContent = newValue;
}

const mainHeader = document.querySelector('thead');

const headers = mainHeader.querySelectorAll('th');
const currentSort = { index: null, sortType: 'acs' };

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (currentSort.index === index) {
      currentSort.sortType = currentSort.sortType === 'acs' ? 'des' : 'acs';
    } else {
      currentSort.index = index;
      currentSort.sortType = 'acs';
    }

    const tBody = document.querySelector('tbody');
    const tRows = Array.from(tBody.querySelectorAll('tr'));

    let comparisonResult = 0;

    tRows.sort((a, b) => {
      const parameterA = a.children[index].textContent.trim();
      const parameterB = b.children[index].textContent.trim();

      if (index === 0 || index === 1 || index === 2) {
        comparisonResult = parameterA.localeCompare(parameterB);
      }

      if (index === 3) {
        comparisonResult = parameterA - parameterB;
      }

      if (index === 4) {
        comparisonResult =
          Number(parameterA.replace(/[$,]/g, '')) -
          Number(parameterB.replace(/[$,]/g, ''));
      }

      return currentSort.sortType === 'acs'
        ? comparisonResult
        : -comparisonResult;
    });

    tBody.innerHTML = '';
    tRows.forEach((row) => tBody.appendChild(row));
  });
});

const tableBody = document.querySelector('tbody');

tableBody.addEventListener('click', (e) => {
  const targetRow = e.target.closest('tr');

  const rows = tableBody.querySelectorAll('tr');

  rows.forEach((row) => row.classList.remove('active'));
  targetRow.classList.add('active');
});

tableBody.addEventListener('dblclick', (e) => {
  const targetedTD = e.target.closest('td');

  if (targetedTD) {
    const savedText = targetedTD.textContent;

    targetedTD.dataset.originalValue = savedText;
    targetedTD.textContent = '';

    const currentInput = document.createElement('input');

    currentInput.className = 'cell-input';
    currentInput.value = savedText;

    targetedTD.appendChild(currentInput);
    currentInput.focus();

    currentInput.addEventListener('blur', () => {
      savedChanges(currentInput, targetedTD, savedText);
    });

    currentInput.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        savedChanges(currentInput, targetedTD, savedText);
      }
    });
  }
});

const addNewEmployeeForm = document.createElement('form');

addNewEmployeeForm.className = 'new-employee-form';

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name:';

const nameInput = document.createElement('input');

nameInput.name = 'name';
nameInput.type = 'text';
nameInput.setAttribute('data-qa', 'name');

nameLabel.appendChild(nameInput);

const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position:';

const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.type = 'text';
positionInput.setAttribute('data-qa', 'position');

positionLabel.appendChild(positionInput);

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.setAttribute('data-qa', 'office');

const officeOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

officeOptions.forEach((officeOption) => {
  const option = document.createElement('option');

  option.value = officeOption;
  option.textContent = officeOption;
  officeSelect.appendChild(option);
});

officeLabel.appendChild(officeSelect);

const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age:';

const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.setAttribute('data-qa', 'age');

ageLabel.appendChild(ageInput);

const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.setAttribute('data-qa', 'salary');

salaryLabel.appendChild(salaryInput);

const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';
submitButton.type = 'submit';

addNewEmployeeForm.appendChild(nameLabel);
addNewEmployeeForm.appendChild(positionLabel);
addNewEmployeeForm.appendChild(officeLabel);
addNewEmployeeForm.appendChild(ageLabel);
addNewEmployeeForm.appendChild(salaryLabel);
addNewEmployeeForm.appendChild(submitButton);

document.body.appendChild(addNewEmployeeForm);

function showNotification(title, message, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  const notificationTitle = document.createElement('span');

  notificationTitle.className = 'title';
  notificationTitle.textContent = title;

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = `${message}`;

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationDescription);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

addNewEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameField = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeSelect.value;
  const age = Number(ageInput.value);
  const salary = Number(salaryInput.value);

  if (!nameField || nameField.length < 4) {
    showNotification(
      'Invalid name',
      'The name cannot be shorter than 4 symbols!',
      'error',
    );

    return;
  }

  if (!position) {
    showNotification(
      'Invalid position',
      'The position field is not assigned',
      'error',
    );

    return;
  }

  if (!office) {
    showNotification(
      'Invalid office',
      "Haven't choosen the office position",
      'error',
    );

    return;
  }

  if (!age || age < 18 || age > 90) {
    showNotification('Invalid age', 'Age is not suitable', 'error');

    return;
  }

  if (!salary || salary < 60000) {
    showNotification(
      'Invalid salary',
      'The salary field is assigned wrongly',
      'error',
    );
  }

  const newRow = document.createElement('tr');

  const nameCell = document.createElement('td');

  nameCell.textContent = nameField;

  const positionCell = document.createElement('td');

  positionCell.textContent = position;

  const officeCell = document.createElement('td');

  officeCell.textContent = office;

  const ageCell = document.createElement('td');

  ageCell.textContent = age;

  const salaryCell = document.createElement('td');

  salaryCell.textContent = `$${salary.toLocaleString()}`;

  newRow.appendChild(nameCell);
  newRow.appendChild(positionCell);
  newRow.appendChild(officeCell);
  newRow.appendChild(ageCell);
  newRow.appendChild(salaryCell);

  tableBody.appendChild(newRow);

  showNotification(
    'Added a new employee',
    'Employee is now in the table',
    'success',
  );

  addNewEmployeeForm.reset();
});
