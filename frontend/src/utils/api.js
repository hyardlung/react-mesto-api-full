class Api {
  constructor(params) {
    this._url = params.url;
    this._headers = params.headers;
  }

  // проверка промиса, возврат json'а в случае резолва, возврат статуса ошибки в случае реджекта
  _getResponse(res) {
    return res.ok ?
        res.json() :
        Promise.reject(`Что-то пошло не так: ${res.status} ${res.statusText}`)
  }

  // запрос на получение данных своего профиля
  getUserData(token) {
    return fetch(`${this._url}/users/me`, {
      headers: {
        ...this._headers,
        'Authorization': `${token}`
      }
    }).then(this._getResponse)
  }

  // запрос на редактирование данных профиля (тоже своего есессено)
  editUserData({name, about}) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({name, about})
    }).then(this._getResponse)
  }

  // запрос карточек с сервера
  getRemoteCards(token) {
    return fetch(`${this._url}/cards`, {
      headers: {
        ...this._headers,
        'Authorization': `${token}`
      }
    }).then(this._getResponse)
  }

  // запрос на добавление карточки на сервер
  sendCard(name, link) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(name, link)
    }).then(this._getResponse)
  }

  // запрос на удаление карточки с сервера
  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers
    }).then(this._getResponse)
  }

  // запрос на добавление лайка карточке
  setLike(cardId) {
    return fetch(`${this._url}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: this._headers
    }).then(this._getResponse)
  }
  // запрос на удаление лайка карточки
  removeLike(cardId) {
    return fetch(`${this._url}/cards/likes/${cardId}`, {
      method: 'DELETE',
      headers: this._headers
    }).then(this._getResponse)
  }
  // запрос на обновление аватара пользователя
  updateAvatar(imgUrl) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({avatar: imgUrl.avatar})
    }).then(this._getResponse)
  }
  // изменение статуса кнопки лайка
  changeLikeCardStatus(cardId, isLiked) {
    return isLiked ?
        this.removeLike(cardId) :
        this.setLike(cardId)
  }

  register(data) {
    return fetch(`${this._url}/sign-up`, {
      method: 'POST',
      headers: {
        ...this._headers,
      },
      body: JSON.stringify(data)
    }).then(this._getResponse)
  };

  authorize(data) {
    return fetch(`${this._url}/sign-in`, {
      method: 'POST',
      headers: {
        ...this._headers,
      },
      body: JSON.stringify(data)
    }).then(this._getResponse)
  }

// проверка токена и получение данных пользователя
  getContent(token) {
    return fetch(`${this._url}/users/me`, {
      headers: {
        ...this._headers,
        'Authorization': `${token}`
      }
    }).then(this._getResponse)
  }
}

export const api = new Api({
  url: 'http://localhost:3001',
  // url: 'https://api.hyardlung-frontend.nomoredomains.icu',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});


