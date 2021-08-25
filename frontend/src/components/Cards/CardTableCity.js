import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import axios from 'axios';
import * as direction from '../../direction/direction';
import swal from 'sweetalert';
import * as actionTypes from '../../store/actions';
import { connect } from "react-redux";
// components
class CardCityTable extends Component {
  state = {
    cities: [],
    total: 0,
    countPerPage: 10,
    page: 1,
    loading: false
  }
  componentDidMount() {
    this.getCities();
  }
  setPage(page) {
    this.setState({ page: page }, () => {
      this.getCities();
    });
  }

  getCities = () => {

    const { page, countPerPage } = this.state;
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null) {
      axios.get(`${direction.API_CITY}?page=${page}&per_page=${countPerPage}`, {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(
        response => {

          this.setState({ cities: response.data.data, total: response.data.total, loading: true });
        },
        error => {

        }
      );
    }
  }

  delete = (id) => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null) {
      axios.delete(direction.API_CITY + `${id}`, {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(res => {
        if (res.status === 200) {
          swal({
            title: "Se eliminó correctamente",
            text: "Haga click en el botón!",
            icon: "success",
          });
          this.props.onRenderCityTable();
        }

      }).catch((e) => {
        if (e)
          swal({
            title: e,
            text: "Haga click en el botón!",
            icon: "error",
          });
      });
      let log = {
        message: `Ha eliminado una ciudad con el id:  ${id}`,
        userId: user.id,
        activityLog: "ELIMINAR"
      }
      axios.post(`${direction.API_LOGS}`, log, {
        headers: {
          'x-auth-token': user.accessToken
        }
      })
    }
  }
  renderCity = (id) => {
    this.props.onRenderCity(id)
  }

  componentDidUpdate() {
    if (this.props.cities) {
      this.props.onRenderCityTable();
      this.getCities();
    }
  }
  render() {
    const column = [

      {
        name: "Nombre",
        cell: row => row.name
      },
     
      {
        name: 'Operaciones',
        cell: row => <React.Fragment>
          <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
            onClick={() => this.renderCity(row.id)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
            onClick={() => this.delete(row.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </React.Fragment>
      }
    ];
    const { cities, total, countPerPage } = this.state;

    return (
      <>
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3
                  className={
                    "font-semibold text-lg text-blueGray-700"
                  }
                >
                  Tabla de ciudades
                </h3>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto px-4 p-4">
            {/* Projects table */}

            <DataTable
              data={cities}
              columns={column}
              highlightOnHover
              pagination
              paginationServer
              paginationTotalRows={total}
              paginationPerPage={countPerPage}
              paginationComponentOptions={{
                noRowsPerPage: true
              }}
              onChangePage={page => this.setPage(page)}
            />
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    cityId: state.cityId,
    cities: state.cities
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onRenderCity: (cityId) => dispatch({ type: actionTypes.RENDER_CITY, cityId: cityId }),
    onRenderCityTable: () => dispatch({ type: actionTypes.RENDER_CITY_TABLE })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CardCityTable);