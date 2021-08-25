import React, { Component } from "react";
import axios from 'axios';
import * as direction from '../../direction/direction';
import * as actionTypes from '../../store/actions';
import swal from 'sweetalert';
import { connect } from "react-redux";


class CardUser extends Component {

  state = {
    id: -1,
    user_name: '',
    email: '',
    password: '',
    full_name: '',
    active: false,
    roles: [],
    selectedOption: null,
    checkP: false,
    password1: '',
    password2: '',
    error: {}
  }

  setValues = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  //handle error of inputs
  handleError = () => {
    let error = {};
    const { user_name, email, password, full_name, selectedOption, checkP, password1, password2, born_date } = this.state;
    let check = false;
    if (!user_name) {
      check = true;
      error['user_name'] = "Debe introducir un nombre de usuario";
    }
    if (!email) {
      check = true;
      error['email'] = "El correo no debe estar vacío";
    }
    else if (!email.match(/[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/)) {
      check = true;
      error['email'] = "Debe introducir una dirección válida de correo";
    }
    if (!password) {
      check = true;
      error['password'] = "Debe introducir una contraseña";
    }
    if (!full_name) {
      check = true;
      error['full_name'] = "Debe introducir el nombre y los apellidos";
    } else if (!full_name.match(/^[A-Za-z áéíóú]+$/)) {
      check = true;
      error['full_name'] = "Solo debe introducir letras";
    }
    if (selectedOption === null) {
      check = true;
      error['roleId'] = "Debe seleccionar un role";
    }
    if (checkP) {
      if (password1 !== password2) {
        check = true;
        error['password1'] = "Las contraseñas no coinciden";
      }
    }
    this.setState({ error })
    return check;
  }

  getRole = () => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null) {
      axios.get(direction.API_ROLE + 'all', {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(res => {
        if (res.status === 200) {
          if (res.data !== null) {
          let roles = [];
          for (let value of res.data) {
            roles.push({ label: value.name, value: value.id });
          }
          this.setState({ roles });
        }
      }
      })
  }
}

componentDidMount() {
  this.getRole();
}

handleSelect = e => {
  this.setState({ selectedOption: { value: e.target.value, label: e.target.label } });
};
handleCheck = (e) => {
  this.setState({ active: !this.state.active });
}
handleCheckP = (e) => {
  this.setState({ checkP: !this.state.checkP });
}

addUser = async (e) => {
  e.preventDefault();
  let error = this.handleError();
  const user = JSON.parse(localStorage.getItem('user')) || null;
  if (user !== null) {
    if (!error) {
      let users = {
        full_name: this.state.full_name,
        user_name: this.state.user_name,
        email: this.state.email,
        roleId: this.state.selectedOption.value,
        password:this.state.password
      }
      console.log(`${direction.API_CHECK_USER_NAME}/?user_name=${users.user_name}`);
      let { data: user_name } = await axios.get(`${direction.API_CHECK_USER_NAME}?user_name=${users.user_name}`, {
        headers: {
          'x-auth-token': user.accessToken
        }
      });
      if (user_name !== null && this.state.id === -1) {
        swal({
          title: "Debe cambiar el nombre de usuario",
          text: "Haga click en el botón!",
          icon: "warning",
        });
      } else {

        if (this.state.id !== -1) {
          users['id'] = this.state.id;
          if (this.state.checkP)
            users['password'] = this.state.password1;
          axios.put(direction.API_USER, users, {
            headers: {
              'x-auth-token': user.accessToken
            }
          }).then(res => {
            if (res.status === 200) {

              swal({
                title: "Se ha actualizado correctamente el usuario",
                text: "Haga click en el botón!",
                icon: "success",
              });
              this.cleanData();
              this.props.onRenderUsersTable();
            }
          }).catch((e) => {
            if (e)
              swal({
                title: "Upps, algo salió mal, inténtelo más tarde",
                text: "Haga click en el botón!",
                icon: "error",
              });
          });
          let log = {
            message: `Ha actualizado un usuario con el nombre de usuario:  ${users.user_name}`,
            userId: user.id,
            activityLog: "ACTUALIZAR"
          }
          axios.post(`${direction.API_LOGS}`, log, {
            headers: {
              'x-auth-token': user.accessToken
            }
          })
        } else {
          users['password'] = this.state.password;

          axios.post(direction.API_USER, users, {
            headers: {
              'x-auth-token': user.accessToken
            }
          }).then(res => {
            if (res.status === 200) {
              swal({
                title: "Usuario insertado correctamente",
                text: "Haga click en el botón!",
                icon: "success",
              });
              this.cleanData();
              this.props.onRenderUsersTable();
            }
          });
          let log = {
            message: `Ha insertado un usuario con el nombre de usuario:  ${users.user_name}`,
            userId: user.id,
            activityLog: "INSERTAR"
          }
          axios.post(`${direction.API_LOGS}`, log, {
            headers: {
              'x-auth-token': user.accessToken
            }
          })
        }
      }
    }
  }
}
cleanData = () => {
  this.setState({ id: -1, email: '', user_name: '', full_name: '', password: '', password1: '', password2: '', checkP: false, selectedOption: null });
  this.getRole();
}
getUser = (id) => {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  if (user !== null) {
    axios.get(`${direction.API_USER}${id}`, {
      headers: {
        'x-auth-token': user.accessToken
      }
    }).then(res => {
      if (res.status === 200) {
        if (res.data !== null)
          this.setState({ id: res.data.id, email: res.data.email, user_name: res.data.user_name, full_name: res.data.full_name, password: res.data.password, selectedOption: { label: res.data.role.name, value: res.data.role.id } });
      }
    }).catch(e => {
      if (e) {
        swal({
          title: "Upss,Algo salió mal inténtelo mas tarde",
          text: "Haga click en el botón!",
          icon: "error",
        });
      }
    })
  }
}
componentDidUpdate() {
  if (this.props.userId !== -1) {
    this.getUser(this.props.userId);
    this.props.onRenderUsers(-1);
  }
}
render() {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold"> </h6>
            <button
              className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
              onClick={this.addUser}
            >
              {this.state.id === -1 ? <>Insertar Usuario</> : <>Actualizar usuario</>}

            </button>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Información
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    onChange={this.setValues}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={this.state.user_name}
                  />
                </div>
                {this.state.error.user_name !== undefined ?
                  <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                    <span className="inline-block align-middle mr-8">
                      {this.state.error.user_name}
                    </span>
                  </div> : null
                }
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Dirección de correo
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={this.setValues}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={this.state.email}
                  />
                </div>
                {this.state.error.email !== undefined ?
                  <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                    <span className="inline-block align-middle mr-8">
                      {this.state.error.email}
                    </span>
                  </div> : null
                }
              </div>
              {this.state.id === -1 ? <div className="w-full lg:w-6/12 px-4">
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
                    disabled={this.state.id !== -1 ? true : false}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={this.state.id !== -1 ? "" : this.state.password}
                  />
                </div>
                {this.state.error.password !== undefined ?
                  <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                    <span className="inline-block align-middle mr-8">
                      {this.state.error.password}
                    </span>
                  </div> : null
                }
              </div> : null}

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    onChange={this.setValues}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={this.state.full_name}
                  />
                </div>
                {this.state.error.full_name !== undefined ?
                  <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                    <span className="inline-block align-middle mr-8">
                      {this.state.error.full_name}
                    </span>
                  </div> : null
                }
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Role
                  </label>

                  <select
                    name="selectedOption"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    onChange={this.handleSelect}
                  >
                    <option value='-1' label="Seleccione un role" selected={this.state.id !== -1 ? false : true}></option>
                    {this.state.roles.map(l => {
                      if (this.state.selectedOption !== null)
                        if (l.value === this.state.selectedOption.value)
                          return <option value={l.value} label={l.label} selected="true">{l.label}</option>

                      return <option value={l.value} >{l.label}</option>
                    })}


                  </select>

                </div>
                {this.state.error.roleId !== undefined ?
                  <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                    <span className="inline-block align-middle mr-8">
                      {this.state.error.roleId}
                    </span>
                  </div> : null
                }
              </div>



              {this.state.id !== -1 ?
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Cambiar contraseña
                    </label>
                    <input
                      type="checkbox"
                      name="checkP"
                      checked={this.state.checkP}
                      onChange={this.handleCheckP}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                      value={this.state.checkP}
                    />
                  </div>
                </div> : null
              }
              {this.state.checkP ?
                <>
                  <div className="w-full lg:w-6/12 px-4"></div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        name="password1"
                        onChange={this.setValues}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={this.state.password1}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4"></div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Repita la Contraseña
                      </label>
                      <input
                        type="password"
                        name="password2"
                        onChange={this.setValues}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={this.state.password2}
                      />
                    </div>
                    {this.state.error.password1 !== undefined ?
                      <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                        <span className="inline-block align-middle mr-8">
                          {this.state.error.password1}
                        </span>
                      </div> : null
                    }
                  </div>


                </> : null}

            </div>
          </form>
        </div>
      </div>
    </>
  );
}
}
const mapStateToProps = state => {
  return {
    userId: state.userId,
    users: state.users
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onRenderUsers: (userId) => dispatch({ type: actionTypes.RENDER_USERS, userId: userId }),
    onRenderUsersTable: () => dispatch({ type: actionTypes.RENDER_USERS_TABLE })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CardUser);