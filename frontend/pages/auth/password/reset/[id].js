import { useState } from 'react';
import Layout from '../../../../components/Layout';
import { withRouter } from 'next/router';
import { resetPassword } from '../../../../actions/auth';
import Message from '../../../../message/Message'

const ResetPassword = ({ router }) => {
    const [values, setValues] = useState({
        resetPasswordLink: '',
        newPassword: '',
        error: '',
        message: '',
        loading: false,
        showForm: true
    });

    const { showForm, loading , resetPasswordLink, newPassword, error, message } = values;

    const handleSubmit = e => {
        e.preventDefault();
        setValues({...values , loading: true})
        resetPassword({
            newPassword,
            resetPasswordLink: router.query.id
        }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, showForm: false, newPassword: '' , loading: false});
            } else {
                setValues({ ...values, message: data.message, showForm: false, newPassword: '', error: false , loading: false});
            }
        });
    };

    const passwordResetForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group pt-5">
                <input
                    type="password"
                    onChange={e => setValues({ ...values, newPassword: e.target.value })}
                    className="form-control"
                    value={newPassword}
                    placeholder="Type new password"
                    required
                />
            </div>
            <div>
                <button className="btn btn-primary">Change password</button>
            </div>
        </form>
    );

    const showError = () => (
        error ? <Message name={error} styles="alert-danger" /> : ""
    )

    const showLoading = () => (
        loading ? <Message name="Loading" styles="alert-info" /> : ""
    )

    const showMessage = () => (
        message ? <Message name={message} styles="alert-success" /> : ""
    )

    return (
        <React.Fragment>
            {showLoading()}
            {showError()}
            {showMessage()}
        <Layout>
            <div className="container">
                <h2>Reset password</h2>
                <hr />
                {passwordResetForm()}
            </div>
        </Layout>
        </React.Fragment>
    );
};

export default withRouter(ResetPassword);