import React from 'react';

export default React.createClass({
    displayName: 'HomePage',

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="error-page">
                        <h2>404 Not Found</h2>
                        <p className="error-details">
                            Sorry, an error has occured, Requested page not found!
                        </p>
                    </div>
                </div>
            </div>
        );
    }
});
