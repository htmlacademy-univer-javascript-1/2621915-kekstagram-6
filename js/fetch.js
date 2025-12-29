const Urls = {
  GET: 'https://29.javascript.htmlacademy.pro/kekstagram/data',
  POST: 'https://29.javascript.htmlacademy.pro/kekstagram',
};

const makeRequest = (route, errorText, method = 'GET', body = null) =>
  fetch(route, { method, body })
    .then((response) => {
      if (!response.ok) {
        throw new Error(errorText);
      }
      return response.json();
    });

const getDataFromServer = () =>
  makeRequest(Urls.GET, 'Ошибка загрузки данных');

const sendDataToServer = (body) =>
  makeRequest(Urls.POST, 'Ошибка отправки формы', 'POST', body);

export { getDataFromServer, sendDataToServer };
