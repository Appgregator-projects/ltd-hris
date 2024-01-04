// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";
import { auth } from "../../../../configs/firebase"

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
  Bell,
} from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import {
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

const userString = localStorage.getItem("userData");
const user = JSON.parse(userString);

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@store/authentication";
import { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";

const UserDropdown = () => {
  const dispatch = useDispatch();

  // ** State
  const [userData, setUserData] = useState(null);
  const store = useSelector((state) => state.auth);

  // const getUserData = async () => {
  //   const result = await serviceAccurateEmployeeId(user.id);

  //   setUserData(result.data);
  // };

  //** ComponentDidMount
  useEffect(() => {
    if (store?.userData) {
    }
    // if (user) {
    //   getUserData();
    // }
  }, [user]);

  const logout = () => {
    auth.signOut();
    dispatch(handleLogout());
    window.location.href = "/login";
  };

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">
            {user != null ? user.name : ""}
          </span>
          <span className="user-status">
            {user != null ? user.role_name : ""}
          </span>
        </div>
        <Avatar
          img={
            user != null
              ? user.avatar
                ? user.avatar
                : "https://firebasestorage.googleapis.com/v0/b/lifetime-design-erp.appspot.com/o/Profile%2FDefault%2Fblank-profile-picture-973460_1280-768x768.png?alt=media&token=6aeacc2b-7fd3-4c16-be60-35383b119aa9"
              : ""
          }
          imgHeight="40"
          imgWidth="40"
          status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/profile/accountSettings">
          <User size={14} className="me-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/profile/accountSettings/notifications">
          <Bell size={14} className="me-75" />
          <span className="align-middle">Notifications</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/tasks">
          <FaTasks size={14} className="me-75" />
          <span className="align-middle">Tasks</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={logout}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;