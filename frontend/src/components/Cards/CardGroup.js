import React, { Component } from "react";
import axios from 'axios';
import * as direction from '../../direction/direction';
import * as actionTypes from '../../store/actions';
import { connect } from "react-redux";
import swal from 'sweetalert';
// components

class CardGroup extends Component {
  state = {
    id: -1,
    name: '',
    professorSelection: null,
    professors: [],
    error: {}
  }

  setValues = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  addGroup = async (e) => {
    e.preventDefault()
    let error = this.handleError();
    if (!error) {
      const {
        id,
        name,
        professorSelection,
      } = this.state;


      let group = {
        name: name,
        profesorId: professorSelection.value
      }
      const user = JSON.parse(localStorage.getItem('user')) || null;
      if (user !== null) {
        if (this.state.id !== -1) {
          group['id'] = this.state.id
          axios.put(direction.API_GROUP, group, {
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
              this.props.onRenderGroupTable()
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
            message: `Ha actualizado un grupo con nombre ${group.name}`,
            userId: user.id,
            activityLog: "ACTUALIZAR"
          }
          axios.post(`${direction.API_LOGS}`, log, {
            headers: {
              'x-auth-token': user.accessToken
            }
          })
        } else {
          let log = {
            message: `Ha insertado un grupo con nombre ${group.name}`,
            userId: user.id,
            activityLog: "INSERTAR"
          }
          axios.post(`${direction.API_LOGS}`, log, {
            headers: {
              'x-auth-token': user.accessToken
            }
          })
          axios.post(direction.API_GROUP, group, {
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
              this.props.onRenderGroupTable();
            }
          }).catch(e => {
            if (e) {
              swal({
                title: "Upss,Algo salió mal inténtelo más tarde",
                text: "Haga click en el botón!",
                icon: "error",
              });
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
      professorSelection: null,
    });

    this.getProfessor();

  }
  getGroup = (id) => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null && id !== -1) {
      console.log(`${direction.API_GROUP}${id}`);
      axios.get(`${direction.API_GROUP}${id}`, {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(res => {
        if (res.status === 200) {
          this.setState({
            id: res.data.id,
            name: res.data.name,
            professorSelection: { label: res.data.profesor.name, value: res.data.profesor.id },
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
    if (this.props.groupId !== -1) {
      this.getGroup(this.props.groupId);
      this.props.onRenderGroup(-1);
    }
  }
  handleError = () => {
    let error = {}
    let check = false;
    const {
      name,
      professorSelection
    } = this.state;
    if (!name) {
      error['name'] = "El nombre no debe estar vacío";
      check = true;
    } else if (!name.match(/^[A-Za-z áéíóú]+$/)) {
      error['name'] = "El nombre no debe tener números";
      check = true;
    }
    if (professorSelection === null) {
      error['professorSelection'] = "Debe seleccionar un profesor";
      check = true;
    }
    this.setState({ error })
    return check;

  }
  componentDidMount() {
    this.getProfessor();
  }

  getProfessor = () => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null) {
      axios.get(direction.API_PROFESSOR + 'all', {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(res => {
        if (res.status === 200) {
          let professors = [];
          if (res.data !== null) {
            for (let value of res.data) {
              professors.push({ label: value.name, value: value.id });
            }
            this.setState({ professors });
          }
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
                onClick={this.addGroup}
              >
                {this.state.id === -1 ? <>Insertar grupo</> : <>Actualizar grupo</>}

              </button>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form>
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Información del grupo
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
                      Profesor
                    </label>
                    <select
                      name="professorSelection"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      onChange={this.handleSelect}
                    >
                      <option value='-1' label="Seleccione un profesor" selected={this.state.id !== -1 ? false : true}></option>
                      {this.state.professors.map(l => {
                        if (this.state.professorSelection !== null)
                          if (l.value === this.state.professorSelection.value)
                            return <option value={l.value} label={l.label} selected="true">{l.label}</option>

                        return <option value={l.value} >{l.label}</option>
                      })}
                    </select>
                  </div>
                  {this.state.error.professorSelection !== undefined ?
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400">
                      <span className="inline-block align-middle mr-8">
                        {this.state.error.professorSelection}
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
    groupId: state.groupId
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRenderGroup: (groupId) => dispatch({ type: actionTypes.RENDER_GROUP, groupId: groupId }),
    onRenderGroupTable: () => dispatch({ type: actionTypes.RENDER_GROUP_TABLE })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CardGroup);