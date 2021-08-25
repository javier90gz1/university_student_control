import React, { Component } from 'react'

import axios from 'axios';
import * as direction from '../../direction/direction';
class Logout extends Component {
    componentDidMount() {
        localStorage.removeItem('user');
        window.location = '/auth/login'
    }
    render() {
        return <div></div>
    }
}

export default Logout;