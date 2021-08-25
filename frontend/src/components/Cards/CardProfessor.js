import React, { Component } from "react";
import axios from 'axios';
import * as direction from '../../direction/direction';
import * as actionTypes from '../../store/actions';
import { connect } from "react-redux";
import swal from 'sweetalert';
// components

class CardProfessor extends Component {
  state = {
    id: -1,
    name: '',
    department: '',
    title: '',
    error: {}
  }

  setValues = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  addProfessor = async (e) => {
    e.preventDefault()
    let error = this.handleError();
    if (!error) {
      const {
        id,
        name,
        department, title
      } = this.state;


      let professor = {
        name: name,
        department: department,
        title: title,
      }

      const user = JSON.parse(localStorage.getItem('user')) || null;
      if (user !== null) {


        if (this.state.id !== -1) {
          professor['id'] = this.state.id
          axios.put(direction.API_PROFESSOR, professor, {
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
              this.props.onRenderProfessorTable()
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
            message: `Ha actualizado un profesor con el nombre:  ${professor.name}`,
            userId: user.id,
            activityLog: "ACTUALIZAR"
          }
          axios.post(`${direction.API_LOGS}`, log, {
            headers: {
              'x-auth-token': user.accessToken
            }
          })
        } else {
          axios.post(direction.API_PROFESSOR, professor, {
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
              this.props.onRenderProfessorTable();
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
            message: `Ha insertado un profesor con el nombre:  ${professor.name}`,
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
      department: '',
      title: '',

    });


  }
  getProfessor = (id) => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null && id !== -1) {
      axios.get(`${direction.API_PROFESSOR}${id}`, {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(res => {
        if (res.status === 200) {
          this.setState({
            id: res.data.id,
            name: res.data.name,
            department: res.data.department,
            title: res.data.title,

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
    if (this.props.professorId !== -1) {
      this.getProfessor(this.props.professorId);
      this.props.onRenderProfessor(-1);
    }
  }
  handleError = () => {
    let error = {}
    let check = false;
    const {
      name,
      department,
      title,

    } = this.state;
    if (!name) {
      error['name'] = "El nombre no debe estar vacío";
      check = true;
    } else if (!name.match(/^[A-Za-z áéíóú]+$/)) {
      error['name'] = "El nombre no debe tener números";
      check = true;
    }
    if (!department) {
      error['department'] = "El departamento no debe estar vacío";
      check = true;
    }
    if (!title) {
      error['title'] = "El título no debe estar vacío";
      check = true;
    }

    this.setState({ error })
    return check;

  }  
  


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
                onClick={this.addProfessor}
              >
                {this.state.id === -1 ? <>Insertar profesor</> : <>Actualizar profesor</>}

              </button>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form>
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Información del profesor
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
                      Departamento
                    </label>
                    <input
                      type="text"
                      name="department"
                      onChange={this.setValues}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={this.state.department}
                    />
                  </div>
                  {this.state.error.department !== undefined ?
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                      <span className="inline-block align-middle mr-8">
                        {this.state.error.department}
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
                      Título
                    </label>
                    <input
                      type="text"
                      name="title"
                      onChange={this.setValues}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={this.state.title}
                    />
                  </div>
                  {this.state.error.title !== undefined ?
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                      <span className="inline-block align-middle mr-8">
                        {this.state.error.title}
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
    professorId: state.professorId
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRenderProfessor: (professorId) => dispatch({ type: actionTypes.RENDER_PROFESSOR, professorId: professorId }),
    onRenderProfessorTable: () => dispatch({ type: actionTypes.RENDER_PROFESSOR_TABLE })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CardProfessor);