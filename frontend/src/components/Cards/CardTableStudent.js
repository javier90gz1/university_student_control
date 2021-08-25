import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import axios from 'axios';
import * as direction from '../../direction/direction';
import swal from 'sweetalert';
import * as actionTypes from '../../store/actions';
import { connect } from "react-redux";
// components
class CardTableStudent extends Component {
  state = {
    students: [],
    total: 0,
    countPerPage: 10,
    page: 1,
    loading: false,
  }
  componentDidMount() {
    this.getStudent();
  }
  setPage(page) {
    this.setState({ page: page }, () => {
        this.getStudent();
    });
  }

  getStudent = () => {

    const { page, countPerPage } = this.state;
    const user = JSON.parse(localStorage.getItem('user')) || null;
    console.log(`${direction.API_STUDENT}?page=${page}&per_page=${countPerPage}`);
    if (user !== null) {
      axios.get(`${direction.API_STUDENT}?page=${page}&per_page=${countPerPage}`, {
        headers: {
          'x-auth-token': user.accessToken
        }
      }).then(
        response => {
          console.log(response.data.data);
          this.setState({ students: response.data.data, total: response.data.total, loading: true });
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
      axios.delete(direction.API_STUDENT + `${id}`, {
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
          this.props.onRenderStudentTable();
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
        message: `Ha eliminado un estudiante con el id:  ${id}`,
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
  renderStudent = (id) => {
    this.props.onRenderStudent(id)
  }

  componentDidUpdate() {
    if (this.props.students) {
      this.props.onRenderStudentTable();
      this.getStudent();
    }
  }
  render() {

    const column = [

      {
        name: "Nombre completo",
        cell: row => row.name + " " + row.last_name
      },
      {
        name: "Correo",
        cell: row => row.email
      },
      {
        name: "Ciudad",
        cell: row => row.city.name
      },
      {
        name: "Grupo",
        cell: row => row.group.name
      },
     
      {
        name: 'Operaciones',
        cell: row => <React.Fragment>
          <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
            onClick={() => this.renderStudent(row.id)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
            onClick={() => this.delete(row.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </React.Fragment>
      }
    ];
    const { students, total, countPerPage } = this.state;

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
                  Tabla de estudiantes
                </h3>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto px-4 p-4">
            {/* Projects table */}

            <DataTable
              data={students}
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
    studentId: state.studentId,
    students: state.students
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRenderStudent: (studentId) => dispatch({ type: actionTypes.RENDER_STUDENT, studentId: studentId }),
    onRenderStudentTable: () => dispatch({ type: actionTypes.RENDER_STUDENT_TABLE })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CardTableStudent);