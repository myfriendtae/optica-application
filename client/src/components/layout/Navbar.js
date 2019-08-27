import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearSample } from '../../actions/sampleActions';


class Navbar extends Component {
    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.clearSample();
        this.props.logoutUser();
    }

    render() {

        const { isAuthenticated } = this.props.auth;

        const authLink = (
            <ul className="navbar-nav ml-auto">
                <li className="nave-item">
                    <div onClick={this.onLogoutClick} className="nav-link click">Logout</div>
                </li>
            </ul>
        );

        const guestLink = (
            <ul className="navbar-nav ml-auto">
                <li className="nave-item">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nave-item">
                    <Link className="nav-link" to="/register">Sign up</Link>
                </li>
            </ul>
        );

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
                <div className="container">
                    <div className="navbar-brand" to="/">Optica Applications</div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                            </li>
                            {/* <li className="nav-item">
                        <Link className="nav-link" to="/about">About</Link>
                        </li> */}
                        </ul>
                        {isAuthenticated ? authLink : guestLink}
                    </div>
                </div>
            </nav>
        )
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser, clearSample })(Navbar);
