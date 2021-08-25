import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import axios from 'axios';
import * as direction from '../../direction/direction';
import swal from 'sweetalert';
import * as actionTypes from '../../store/actions';
import { connect } from "react-redux";
// components
class CardTableProfessor extends Component {
  state = {
    professor: [],
    total: 0,
    countPerPage: 10,
    page: 1,
    loading: false,
  }
  componentDidMount() {
    this.getProfessor();
  }
  setPage(page) {
    this.setState({ page: page }, () => {
        this.getProfessor();
    });
  }

  getProfessor = () => {

    const { page, countPerPage } = this.state;
    const user = JSON.parse(localStorage.getItem('user')) || null;
    
    if (user !== null) {
      axios.get(`${direction.API_PROFESSOR}?page=${page}&per_page=${countPerPage}`, {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(
        response => {
          this.setState({ professor: response.data.data, total: response.data.total, loading: true });
        },
        error => {

        }
      );
    }
  }
  setValues = (e) => {
    if (e.target.value === '')
      this.getStudent();
    this.setState({ [e.target.name]: e.target.value })
  }
 

  delete = (id) => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user !== null) {
      axios.delete(direction.API_PROFESSOR + `${id}`, {
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
          this.props.onRenderProfessorTable();
        }
      }).catch((e) => {
        if (e)
          swal({
            title: "Upss algo salió mal inténtelo más tarde",
            text: "Haga click en el botón!",
            icon: "error",
          });
      });
      let log = {
        message: `Ha eliminado un profesor con el id:  ${id}`,
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
  renderProfessor = (id) => {
    this.props.onRenderProfessor(id)
  }

  componentDidUpdate() {
    if (this.props.professors) {
      this.props.onRenderProfessorTable();
      this.getProfessor();
    }
  }
  render() {

    const column = [

      {
        name: "Nombre completo",
        cell: row => row.name
      },
      {
        name: "Departamento",
        cell: row => row.department
      },
      {
        name: "Título",
        cell: row => row.title
      },
     
      {
        name: 'Operaciones',
        cell: row => <React.Fragment>
          <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
            onClick={() => this.renderProfessor(row.id)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
            onClick={() => this.delete(row.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </React.Fragment>
      }
    ];
    const { professor, total, countPerPage } = this.state;

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
                  Tabla de profesores
                </h3>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto px-4 p-4">
            {/* Projects table */}

            <DataTable
              data={professor}
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
    professorId: state.professorId,
    professors: state.professors
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRenderProfessor: (professorId) => dispatch({ type: actionTypes.RENDER_PROFESSOR, professorId: professorId }),
    onRenderProfessorTable: () => dispatch({ type: actionTypes.RENDER_PROFESSOR_TABLE })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CardTableProfessor);