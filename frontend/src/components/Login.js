import {useState} from 'react'

export const Login = ({onLogin}) => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (evt) => {
    const {name, value} = evt.target;
    setUserData({
      ...userData,
      [name]: value
    })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onLogin(userData)
  }

  return (
      <section className="auth page__auth">
        <h2 className="auth__title">Вход</h2>
        <form
            className="auth__form"
            action="#"
            noValidate
            onSubmit={handleSubmit}
        >
          <fieldset className="auth__form-fieldset">
            <input
                className="auth__input"
                name="email"
                type="email"
                value={userData.email}
                id="email-input"
                autoComplete="off"
                placeholder="Email"
                required
                onChange={handleChange}
            />
            <span className="auth__input-error" id="auth-email-input-error"> </span>
            <input
                className="auth__input"
                name="password"
                type="password"
                value={userData.password}
                id="password-input"
                minLength="8"
                maxLength="30"
                autoComplete="off"
                placeholder="Пароль"
                required
                onChange={handleChange}
            />
            <span className="auth__input-error" id="auth-password-input-error"> </span>
          </fieldset>
          <button className="auth__submit-button" type="submit">
            Войти
          </button>
        </form>
      </section>
  )
}