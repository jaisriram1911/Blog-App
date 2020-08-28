import Layout from '../../components/Layout'
import Private from '../../components/auth/PrivateRoute'
import ProfileUpdate from '../../components/user/ProfileUpdate'

const UserProfileUpdate = () => {
    return(
        <Layout>
        <Private>
        <div>
        
        <ProfileUpdate />
        </div>
        </Private>
        </Layout>
    )
}

export default UserProfileUpdate;