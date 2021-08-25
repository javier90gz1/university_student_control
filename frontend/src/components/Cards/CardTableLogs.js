import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import axios from 'axios';
import * as direction from '../../direction/direction';
import swal from 'sweetalert';
// components

class CardTableLogs extends Component {
  state = {
    role: [],
    total: 0,
    countPerPage: 10,
    page: 1,
    loading: false,
  }
  componentDidMount() {
    this.getLogs();
  }
  setPage(page) {
    this.setState({ page: page }, () => {
      this.getLogs();
    });
  }

  getLogs = () => {

    const { page, countPerPage } = this.state;
    const user = JSON.parse(localStorage.getItem('user'));

    axios.get(`${direction.API_LOGS}?page=${page}&per_page=${countPerPage}`, {
      headers: {
        'x-auth-token': user.accessToken
      }
    }).then(
      response => {
        this.setState({ logs: response.data.data, total: response.data.total, loading: true });
      },
      error => {

      }
    );
  }
  setValues = (e) => {
    if (!e.target.value)
      this.getLogs();
    this.setState({ [e.target.name]: e.target.value });
  }
  
  render() {
    const column = [

      {
        name: "Comentario",
        selector: 'message',
        sortable: true,
        cell: row => row.message
      },
      {
        name: "Usuario",
        cell: row => row.userId.user_name,
        selector: 'user_name',
        sortable: true,
      },
      {
        name: "Acción realizada",
        selector: 'activityLog',
        sortable: true,
        cell: row => row.activityLog
      },
      {
        name: "Fecha de la acción",
        selector: 'createdAt',
        sortable: true,
        cell: row => row.createdAt
      },

    ];
    const { logs, total, countPerPage } = this.state;

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
                  Tabla de logs
                </h3>
              </div>
              
            </div>
          </div>
          <div>

          </div>
          <div className="block w-full overflow-x-auto px-4 p-4">
            {/* Projects table */}



           

            <DataTable
              data={logs}
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

export default CardTableLogs;
