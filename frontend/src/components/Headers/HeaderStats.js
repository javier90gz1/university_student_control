import React, { Component } from "react";
import axios from 'axios';
import * as direction from '../../direction/direction';

// components

import CardStats from "components/Cards/CardStats.js";

class HeaderStats extends Component {
  state = {
    cantProf: 0,
    cantEst: 0,
    cantGroup: 0,
    cantCity: 0
  }
  componentDidMount() {
    this.getCant();
  }
  getCant = () => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    axios.get(`${direction.API_GROUP}all`, {
      headers: {
        'x-auth-token': user.accessToken
      }
    }).then(res => {
      if (res !== null && res.data !== null)
        this.setState({ cantGroup: res.data.length })
    })
    axios.get(`${direction.API_PROFESSOR}all`, {
      headers: {
        'x-auth-token': user.accessToken
      }
    }).then(res => {
      if (res !== null && res.data !== null)
        this.setState({ cantProf: res.data.length })
    })
    axios.get(`${direction.API_STUDENT}all`, {
      headers: {
        'x-auth-token': user.accessToken
      }
    }).then(res => {
      if (res !== null && res.data !== null)
        this.setState({ cantEst: res.data.length })
    })
    axios.get(`${direction.API_CITY}all`, {
      headers: {
        'x-auth-token': user.accessToken
      }
    }).then(res => {
      if (res !== null && res.data !== null)
        this.setState({ cantCity: res.data.length })
    })
  }
  render() {

    return (
      <>
        {/* Header */}
        <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
          <div className="px-4 md:px-10 mx-auto w-full">
            <div>
              {/* Card stats */}
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="CANTIDAD DE PROFESORES"
                    statTitle={this.state.cantProf}
                    statPercent={this.state.cantProf}
                    statDescripiron="Totales"
                    statIconName="fas fa-users"
                    statIconColor="bg-red-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="CANTIDAD DE ESTUDIANTES"
                    statTitle={this.state.cantEst}
                    statDescripiron="Totales"
                    statIconName="fas fa-users"
                    statIconColor="bg-orange-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="CANTIDAD DE GRUPOS"
                    statTitle={this.state.cantGroup}
                    statDescripiron="Totales"
                    statIconName="fas fa-users"
                    statIconColor="bg-pink-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="CANTIDAD DE CIUDADES"
                    statTitle={this.state.cantCity}
                    statDescripiron="Totales"
                    statIconName="fas fa-users"
                    statIconColor="bg-lightBlue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default HeaderStats;
