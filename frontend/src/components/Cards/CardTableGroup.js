import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import axios from 'axios';
import * as direction from '../../direction/direction';
import swal from 'sweetalert';
import * as actionTypes from '../../store/actions';
import { connect } from "react-redux";
// components
class CardTableGroup extends Component {
  state = {
    groups: [],
    total: 0,
    countPerPage: 10,
    page: 1,
    loading: false,
  }
  componentDidMount() {
    this.getGroup();
  }
  setPage(page) {
    this.setState({ page: page }, () => {
        this.getGroup();
    });
  }

  getGroup = () => {

    const { page, countPerPage } = this.state;
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null) {
      axios.get(`${direction.API_GROUP}?page=${page}&per_page=${countPerPage}`, {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(
        response => {
          this.setState({ groups: response.data.data, total: response.data.total, loading: true });
        },
        error => {

        }
      );
    }
  }
  setValues = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
 

  delete = (id) => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null) {
      axios.delete(direction.API_GROUP + `${id}`, {
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
          this.props.onRenderGroupTable();
        }
      }).catch((e) => {
        if (e)
          swal({
            title: "Upss, Algo salió mal inténtelo más tarde",
            text: "Haga click en el botón!",
            icon: "error",
          });
      });
      let log = {
        message: `Ha eliminado un grupo con el id:  ${id}`,
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
  renderGroup = (id) => {
    this.props.onRenderGroup(id)
  }

  componentDidUpdate() {
    if (this.props.groups) {
      this.props.onRenderGroupTable();
      this.getGroup();
    }
  }
  render() {

    const column = [

      {
        name: "Nombre",
        cell: row => row.name
      },
      {
        name: "Profesor",
        cell: row => row.profesor.name
      },
     
      {
        name: 'Operaciones',
        cell: row => <React.Fragment>
          <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
            onClick={() => this.renderGroup(row.id)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
            onClick={() => this.delete(row.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </React.Fragment>
      }
    ];
    const { groups, total, countPerPage } = this.state;

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
                  Tabla de grupos
                </h3>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto px-4 p-4">
            {/* Projects table */}

            <DataTable
              data={groups}
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
    groupId: state.groupId,
    groups: state.groups
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRenderGroup: (groupId) => dispatch({ type: actionTypes.RENDER_GROUP, groupId: groupId }),
    onRenderGroupTable: () => dispatch({ type: actionTypes.RENDER_GROUP_TABLE })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CardTableGroup);