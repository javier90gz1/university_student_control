import React, { Component } from "react";
import axios from 'axios';
import * as direction from '../../direction/direction';
import * as actionTypes from '../../store/actions';
import { connect } from "react-redux";
import swal from 'sweetalert';
// components

class CardStudent extends Component {
  state = {
    id: -1,
    name: '',
    last_name: '',
    age: 16,
    citySelection: null,
    email: '',
    groupSelection: null,
    sex: '',
    born_date: '',
    cities: [],
    groups: [],
    error: {}
  }

  setValues = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  addStudent = async (e) => {
    e.preventDefault()
    let error = this.handleError();
    if (!error) {
      const {
        id,
        name,
        last_name,
        age,
        citySelection,
        email,
        groupSelection,
        sex, born_date
      } = this.state;

      let startDate1 = new Date(born_date);
      let student = {
        name: name,
        last_name: last_name,
        age: age,
        email: email,
        sex: sex,
        groupId: groupSelection.value,
        cityId: citySelection.value,
        born_date: startDate1
      }

      const user = JSON.parse(localStorage.getItem('user')) || null;
      if (user !== null) {


        if (this.state.id !== -1) {
          student['id'] = this.state.id
          axios.put(direction.API_STUDENT, student, {
            headers: {
              'x-auth-token': user.accessToken
            }
          }).then(result => {
            if (result.status === 200) {
              swal({
                title: "Se actualizó corectamente",
                text: "Haga click en el botón!",
                icon: "success",
              });
              this.cleanData()
              this.props.onRenderStudentTable()
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
          let log = {
            message: `Ha actualizado un estudiante con el nombre:  ${student.name} ${student.last_name}`,
            userId: user.id,
            activityLog: "ACTUALIZAR"
          }
          axios.post(`${direction.API_LOGS}`, log, {
            headers: {
              'x-auth-token': user.accessToken
            }
          })
        } else {
          axios.post(direction.API_STUDENT, student, {
            headers: {
              'x-auth-token': user.accessToken
            }
          }).then(result => {
            if (result.status === 200) {
              swal({
                title: "Se insertó corectamente",
                text: "Haga click en el botón!",
                icon: "success",
              });
              this.cleanData();
              this.props.onRenderStudentTable();
            }
          }).catch(e => {
            if (e) {
              swal({
                title: "Upss,Algo salió mal inténtelo mas tarde",
                text: "Haga click en el botón!",
                icon: "error",
              });
            }
          });
          let log = {
            message: `Ha insertado un estudiante con el nombre:  ${student.name} ${student.last_name}`,
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
  cleanData = () => {
    this.setState({
      id: -1,
      name: '',
      last_name: '',
      age: 16,
      citySelection: null,
      email: '',
      groupSelection: null,
      sex: '',
      born_date: ''
    });
    this.getCity();
    this.getGroup();

  }
  getStudent = (id) => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    console.log(`${direction.API_STUDENT}${id}`);
    if (user !== null && id !== -1) {
      axios.get(`${direction.API_STUDENT}${id}`, {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(res => {
        if (res.status === 200) {
          this.setState({
            id: res.data.id,
            name: res.data.name,
            last_name: res.data.last_name,
            age: res.data.age,
            citySelection: { label: res.data.city.name, value: res.data.city.id },
            email: res.data.email,
            sex: res.data.sex,
            groupSelection: { label: res.data.group.name, value: res.data.group.id },
            born_date: res.data.born_date.split('T')[0]
          })
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
    if (this.props.autorId !== -1) {
      this.getStudent(this.props.studentId);
      this.props.onRenderStudent(-1);
    }
  }
  handleError = () => {
    let error = {}
    let check = false;
    const {
      name,
      last_name,
      age,
      citySelection,
      email,
      groupSelection,
      born_date,
      sex
    } = this.state;
    if (!name) {
      error['name'] = "El nombre no debe estar vacío";
      check = true;
    } else if (!name.match(/^[A-Za-z áéíóú]+$/)) {
      error['name'] = "El nombre no debe tener números";
      check = true;
    }
    if (!last_name) {
      error['last_name'] = "El apellido no debe estar vacío";
      check = true;
    } else if (!last_name.match(/^[A-Za-z áéíóú]+$/)) {
      error['last_name'] = "El apellido no debe tener números";
      check = true;
    }

    if (!email) {
      error['email'] = "El correo no debe estar vacío";
      check = true;
    }
    else if (!email.match(/[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/)) {
      error['email'] = "Dirección de correo inválida";
      check = true;
    }
    if (groupSelection === null) {
      error['groupSelection'] = "Debe seleccionar un grupo";
      check = true;
    }
    if (citySelection === null) {
      error['citySelection'] = "Debe seleccionar un grupo";
      check = true;
    }

    if (born_date === '') {
      error['born_date'] = "Seleccione una fecha";
      check = true;
    }
    if (!sex) {
      error['sex'] = "El sexo no debe estar vacío";
      check = true;
    }
    this.setState({ error })
    return check;

  }
  componentDidMount() {
    this.getCity();
    this.getGroup();
  }
  getCity = () => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null) {
      axios.get(direction.API_CITY + 'all', {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(res => {
        if (res.status === 200) {
          let cities = [];
          for (let value of res.data) {
            cities.push({ label: value.name, value: value.id });
          }
          this.setState({ cities });
        }
      })
    }
  }
  getGroup = () => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null) {
      console.log(direction.API_GROUP + 'all');
      axios.get(direction.API_GROUP + 'all', {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(res => {
        if (res.status === 200) {
          let groups = [];
          for (let value of res.data) {
            groups.push({ label: value.name, value: value.id });
          }
          this.setState({ groups });
        }
      })
    }
  }

  handleSelect = e => {
    this.setState({ [e.target.name]: { value: e.target.value, label: e.target.label } });
  };
 

  render() {
    return (
      <>
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">Estudiante</h6>
              <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
                onClick={this.addStudent}
              >
                {this.state.id === -1 ? <>Insertar estudiante</> : <>Actualizar estudiante</>}

              </button>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form>
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Información del estudiante
              </h6>
              <div className="flex flex-wrap">

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="name"
                      onChange={this.setValues}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={this.state.name}
                    />
                  </div>
                  {this.state.error.name !== undefined ?
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                      <span className="inline-block align-middle mr-8">
                        {this.state.error.name}
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
                      Apellidos
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      onChange={this.setValues}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={this.state.last_name}
                    />
                  </div>
                  {this.state.error.last_name !== undefined ?
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                      <span className="inline-block align-middle mr-8">
                        {this.state.error.last_name}
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
                      Grupo
                    </label>
                    <select
                      name="groupSelection"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      onChange={this.handleSelect}
                    >
                      <option value='-1' label="Seleccione una especialidad" selected={this.state.id !== -1 ? false : true}></option>
                      {this.state.groups.map(l => {
                        if (this.state.groupSelection !== null)
                          if (l.value === this.state.groupSelection.value)
                            return <option value={l.value} label={l.label} selected="true">{l.label}</option>

                        return <option value={l.value} >{l.label}</option>
                      })}


                    </select>
                  </div>
                  {this.state.error.groupSelection !== undefined ?
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                      <span className="inline-block align-middle mr-8">
                        {this.state.error.groupselection}
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
                      Ciudad
                    </label>
                    <select
                      name="citySelection"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      onChange={this.handleSelect}
                    >
                      <option value='-1' label="Seleccione una especialidad" selected={this.state.id !== -1 ? false : true}></option>
                      {this.state.cities.map(l => {
                        if (this.state.citySelection !== null)
                          if (l.value === this.state.citySelection.value)
                            return <option value={l.value} label={l.label} selected="true">{l.label}</option>

                        return <option value={l.value} >{l.label}</option>
                      })}


                    </select>
                  </div>
                  {this.state.error.citySelection !== undefined ?
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                      <span className="inline-block align-middle mr-8">
                        {this.state.error.citySelection}
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
                      Edad
                    </label>
                    <input
                      type="number"
                      name="age"
                      min="16"
                      max="120"
                      onChange={this.setValues}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={this.state.age}
                    />
                  </div>
                  {this.state.error.age !== undefined ?
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                      <span className="inline-block align-middle mr-8">
                        {this.state.error.age}
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
                      Fecha de nacimiento
                    </label>
                    <input
                      type="date"
                      name="born_date"
                      value={this.state.born_date}
                      onChange={this.setValues}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                  </div>
                  {this.state.error.born_date !== undefined ?
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                      <span className="inline-block align-middle mr-8">
                        {this.state.error.born_date}
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
                      Correo
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
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Sexo
                    </label>
                    <input
                      type="text"
                      name="sex"
                      onChange={this.setValues}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={this.state.sex}
                    />
                  </div>
                  {this.state.error.sex !== undefined ?
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                      <span className="inline-block align-middle mr-8">
                        {this.state.error.sex}
                      </span>
                    </div> : null
                  }
                </div>
               
                

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
    studentId: state.studentId
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRenderStudent: (studentId) => dispatch({ type: actionTypes.RENDER_STUDENT, studentId: studentId }),
    onRenderStudentTable: () => dispatch({ type: actionTypes.RENDER_STUDENT_TABLE })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CardStudent);