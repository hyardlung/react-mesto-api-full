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
  getUserData() {
    return fetch(`${this._url}/users/me`, {
      headers: this._headers
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
  getRemoteCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._headers
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
}

export const api = new Api({
  // url: 'https://localhost:3001',
  url: 'https://api.hyardlung-frontend.nomoredomains.icu',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `${localStorage.getItem('jwt')}`,
  }
});


