import React, { Component } from "react";
import axios from 'axios';
import * as direction from '../../direction/direction';
import * as actionTypes from '../../store/actions';
import { connect } from "react-redux";
import Select from 'react-select';
import swal from 'sweetalert';
// components

class CardCity extends Component {
  state = {
    id: -1,
    name: '',
    error: {}
  }

  setValues = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  addCity = (e) => {
    e.preventDefault()
    let error = this.handleError();
    if (!error) {
      let { name } = this.state;
      let city = {
        name: name,
      }
      const user = JSON.parse(localStorage.getItem('user')) || null;
      if (user !== null) {
        if (this.state.id !== -1) {
          city['id'] = this.state.id
          axios.put(direction.API_CITY, city, {
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
              this.cleanData();
              this.props.onRenderCityTable()
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
            message: `Ha actualizado una ciudad con el nombre:  ${city.name}`,
            userId: user.id,
            activityLog: "ACTUALIZAR"
          }
          axios.post(`${direction.API_LOGS}`, log, {
            headers: {
              'x-auth-token': user.accessToken
            }
          })
        } else {
          axios.post(direction.API_CITY, city, {
            headers: {
              'x-auth-token': user.accessToken
            }
          }).then(result => {
            if (result.status === 200) {
              swal({
                title: "Se insertó correctamente",
                text: "Haga click en el botón!",
                icon: "success",
              });
              this.cleanData();
              this.props.onRenderCityTable()
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
            message: `Ha insertado una ciudad con el nombre:  ${city.name}`,
            userId: user.id,
            activityLog: "ACTUALIZAR"
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
    this.setState({ id: -1, name: '' })
    this.getCity();
  }
  componentDidMount() {
    this.getCity();
  }
  getCity = (id) => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null && id !== -1) {
      axios.get(`${direction.API_CITY}${id}`, {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(result => {
        if(result.data!==null)
        this.setState({ id: result.data.id, name: result.data.name })
      }).catch(e => {
        if (e)
          swal({
            title: "Upss,Algo salió mal inténtelo mas tarde",
            text: "Haga click en el botón!",
            icon: "error",
          });
      })
    }
  }

  componentDidUpdate() {
    if (this.props.cityId !== -1) {
      this.getCity(this.props.cityId);
      this.props.onRenderCity(-1);
    }
  }
  handleError = () => {
    let error = {}
    let check = false;
    const { name } = this.state;
    if (!name) {
      error['name'] = "El nombre no debe estar vacío";
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
              <h6 className="text-blueGray-700 text-xl font-bold">Ciudad</h6>
              <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
                onClick={this.addCity}
              >
                {this.state.id === -1 ? <> Insertar ciudad</> : <>Actualizar ciudad</>}

              </button>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form>
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">

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
    cityId: state.cityId
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRenderCity: (cityId) => dispatch({ type: actionTypes.RENDER_CITY, cityId: cityId }),
    onRenderCityTable: () => dispatch({ type: actionTypes.RENDER_CITY_TABLE })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CardCity);