import NavBar from './NavBar'
import Footer from './Footer'
import Search from './blog/Search'

const Layout = ({children}) => {
    return(
        <div  className='App'>
        <NavBar/>
        <div className= 'backDropStyle' />
        {children}
        </div>
    )
}

export default Layout