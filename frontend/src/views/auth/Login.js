import React, { Component } from "react";
import axios from 'axios';
import * as direction from '../../direction/direction';
import swal from 'sweetalert';
class Login extends Component {
  state = {
    user_name: '',
    password: ''
  }

  setValues = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleLogin = () => {

    let user = {
      user_name: this.state.user_name,
      password: this.state.password
    }

    axios.post(direction.API_LOGIN, user).then(result => {
      localStorage.setItem('user', JSON.stringify(result.data));
      if (result.data.roles === 'ROLE_ADMIN') {       
        this.props.history.push('/admin');
      } else
        this.props.history.push('/');
    }).catch((e) => {
      if (e) {
        swal({
          title: "Usuario o contraseña incorrectos",
          text: "Haga click en el botón!",
          icon: "error",
        });
      }
    })
  }
  render() {
    return (
      <>
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">

            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">


                <div className="flex-auto px-4 lg:px-10 py-10 pt-0 mt-6">

                  <form>

                    <div className="w-full text-center mb-3">

                      <img
                        style={{ marginLeft: '33%' }}
                        src="/SIMBOLO.svg"
                        alt="esta es"
                        width="100"
                      />

                    </div>
                    <div className="relative w-full mb-3">


                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Usuario
                      </label>
                      <input
                        type="text"
                        name="user_name"
                        onChange={this.setValues}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Nombre de usuario"
                        defaultValue={this.state.user_name}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Contraseña
                      </label>
                      <input
                        type="password"
                        name="password"
                        onChange={this.setValues}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Contraseña"
                        defaultValue={this.state.password}
                      />
                    </div>


                    <div className="text-center mt-6">
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="button"
                        onClick={this.handleLogin}
                      >
                        Entrar
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </>

    );
  }
}
export default Login;
