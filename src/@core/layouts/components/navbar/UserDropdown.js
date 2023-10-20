import { useState, useEffect } from "react"
// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power
} from "react-feather"

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap"

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg"
import { useDispatch, useSelector } from 'react-redux'
import { handleLogout } from '@store/authentication'
import { signOut } from "firebase/auth"
import { auth } from "../../../../configs/firebase"

const UserDropdown = () => {

  const dispatch = useDispatch()

  // ** State
  const [userData, setUserData] = useState(null)
  const store = useSelector(state => state.authentication)

  //** ComponentDidMount
  useEffect(() => {
    if (store.userData) {
      setUserData(store.userData)
    }
  }, [])

  const logout = () => {
    signOut(auth)
    dispatch(handleLogout())
    window.location.href = '/login'
  }

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold text-capitalize">{(userData && userData['name']) || 'John Doe'}</span>
          <span className="user-status text-capitalize">{(userData && userData['role_name']) || 'Staff'}</span>
        </div>
        <Avatar
          img={userData && userData['avatar']}
          imgHeight="40"
          imgWidth="40"
          status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem
          tag={Link}
          to="/setting/account"
        >
          <Settings size={14} className="me-75" />
          <span className="align-middle">Settings</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <CreditCard size={14} className="me-75" />
          <span className="align-middle">Pricing</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <HelpCircle size={14} className="me-75" />
          <span className="align-middle">FAQ</span>
        </DropdownItem>
        <DropdownItem onClick={logout}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown