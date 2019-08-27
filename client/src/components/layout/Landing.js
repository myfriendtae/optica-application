import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Landing extends Component {
    render() {
        return (
            <div className="jumbotron text-center">
                <h1 className="display-3">OPTICA</h1>
                <p> Optica Applications are now up and running! </p>
                <p> *If no disply, please refresh the screen after few seconds.</p>
                <div className="row">
                    <div className="card col-sm-6 p-3 mt-5">
                        <h2 className="card-titlte mb-3">Sample</h2>
                        <div className="list-group">
                            <Link className="list-group-item list-group-item-action bt light" to="./samples/add">Form</Link>
                            <Link className="list-group-item list-group-item-action bt light" to="./samples/">History</Link>
                        </div>
                    </div>
                    <div className="card col-sm-6 p-3 mt-5">
                        <h2 className="card-titlte mb-3">Write-off</h2>
                        <div className="list-group">
                            <Link className="list-group-item list-group-item-action bt light" to="./writeoffs/add">Form</Link>
                            <Link className="list-group-item list-group-item-action bt light" to="./writeoffs/">History</Link>
                        </div>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="card col-sm-6 p-3 mt-5">
                        <h2 className="card-titlte mb-3">Production</h2>
                        <div className="list-group">
                                <Link className="list-group-item list-group-item-action bt light" to="./production/add">Production</Link>
                                <Link className="list-group-item list-group-item-action bt light" to="./production/">Production History</Link>
                        </div>
                    </div>
                    <div className="card col-sm-6 p-3 mt-5">
                        <h2 className="card-titlte mb-3">Adjustment</h2>
                        <div className="list-group">
                                <Link className="list-group-item list-group-item-action bt light" to="./adjustment/add">Adjustment Form</Link>
                                <Link className="list-group-item list-group-item-action bt light" to="./adjustment/">Adjustment History</Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="card col-sm-6 p-3 mt-5">
                        <h2 className="card-titlte mb-3">SPS Commerce</h2>
                        <div className="list-group">
                                <Link className="list-group-item list-group-item-action bt light" to="https://optica.shinyapps.io/SPS_App/">Jobsheet</Link>
                                <Link className="list-group-item list-group-item-action bt light text-muted" to="/about/">Analysis</Link>
                        </div>
                    </div>
                </div> */}
            </div>
        )
    }
}

export default Landing;