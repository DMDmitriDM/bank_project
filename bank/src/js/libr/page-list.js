export default function pageList(parent, length, step, fun = null) {
  const pageBtnBox = document.createElement('div');
  pageBtnBox.classList.add('page-btn-box');

  const btnStart = document.createElement('button');
  btnStart.classList.add('page-btn-box-btn', 'blue-btn', 'btn-reset');
  btnStart.setAttribute('id', 'id-page-btn-box-btn-start');
  btnStart.textContent = 'В начало';

  const btnPrev = document.createElement('button');
  btnPrev.classList.add('page-btn-box-btn', 'blue-btn', 'btn-reset');
  btnPrev.setAttribute('id', 'id-page-btn-box-btn-prev');
  btnPrev.textContent = 'Назад';

  const btnNext = document.createElement('button');
  btnNext.classList.add('page-btn-box-btn', 'blue-btn', 'btn-reset');
  btnNext.setAttribute('id', 'id-page-btn-box-btn-next');
  btnNext.textContent = 'Вперёд';

  const btnEnd = document.createElement('button');
  btnEnd.classList.add('page-btn-box-btn', 'blue-btn', 'btn-reset');
  btnEnd.setAttribute('id', 'id-page-btn-box-btn-end');
  btnEnd.textContent = 'В конец';

  pageBtnBox.append(btnStart);
  pageBtnBox.append(btnPrev);
  pageBtnBox.append(btnNext);
  pageBtnBox.append(btnEnd);
  parent.append(pageBtnBox);

  // ------------------------------- //

  let lastIndex = length - 1;
  if (lastIndex < 0) {
    lastIndex = 0;
  }
  let currentIndexStart = 0;
  let currentIndexEnd = currentIndexStart + step - 1;

  correctIndex();
  changeBtnPage();

  if (fun) {
    fun(currentIndexStart, currentIndexEnd);
  }

  // ------------------------------- //

  btnStart.addEventListener('click', () => {
    currentIndexStart = 0;

    correctIndex();
    changeBtnPage();

    if (fun) {
      fun(currentIndexStart, currentIndexEnd);
    }
  });

  btnPrev.addEventListener('click', () => {
    currentIndexStart = currentIndexStart - step;

    correctIndex();
    changeBtnPage();

    if (fun) {
      fun(currentIndexStart, currentIndexEnd);
    }
  });

  btnNext.addEventListener('click', () => {
    currentIndexStart = currentIndexStart + step;

    correctIndex();
    changeBtnPage();

    if (fun) {
      fun(currentIndexStart, currentIndexEnd);
    }
  });

  btnEnd.addEventListener('click', () => {
    currentIndexStart = lastIndex - step + 1;

    correctIndex();
    changeBtnPage();

    if (fun) {
      fun(currentIndexStart, currentIndexEnd);
    }
  });

  // ------------------------------- //

  function correctIndex() {
    if (currentIndexStart > lastIndex - step + 1) {
      currentIndexStart = lastIndex - step + 1;
    }

    if (currentIndexStart < 0) {
      currentIndexStart = 0;
    }

    currentIndexEnd = currentIndexStart + step - 1;
    if (currentIndexEnd > lastIndex) {
      currentIndexEnd = lastIndex;
    }
  }

  // ------------------------------- //

  function changeBtnPage() {
    if (currentIndexStart === 0) {
      btnStart.setAttribute('disabled', '');
      btnPrev.setAttribute('disabled', '');
    } else {
      btnStart.removeAttribute('disabled');
      btnPrev.removeAttribute('disabled');
    }

    if (currentIndexStart > lastIndex - step) {
      btnNext.setAttribute('disabled', '');
      btnEnd.setAttribute('disabled', '');
    } else {
      btnNext.removeAttribute('disabled');
      btnEnd.removeAttribute('disabled');
    }
  }
}
