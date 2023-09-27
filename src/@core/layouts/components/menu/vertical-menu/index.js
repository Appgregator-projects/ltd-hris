// ** React Imports
import { Fragment, useState, useRef, useEffect } from "react"

// ** Third Party Components
import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"

// ** Vertical Menu Components
import VerticalMenuHeader from "./VerticalMenuHeader"
import VerticalNavMenuItems from "./VerticalNavMenuItems"
import {Input} from 'reactstrap'
import Api from '../../../../../sevices/Api'
import { useSelector,useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { handleLogin } from '@store/authentication'
import { handleCompany } from "../../../../../redux/authentication"

const Sidebar = (props) => {
  const dispatch = useDispatch();
  const {company} = useSelector(state => state.authentication)
 
  // ** Props
  const { menuCollapsed, menu, skin, menuData } = props

  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const [companies, setCompanies] = useState([])
  const [selectCompany, setSelect] = useState([])

  // console.log(companies, "companies index sidebar")

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false)

  // ** Ref
  const shadowRef = useRef(null)

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    setMenuHover(true)
  }

  const fetchCompany = async() => {
    try {
      const data = await Api.get(`/hris/company`)
      data.splice(0,0,{id : "all", name: "ALL COMPANY"})
      setCompanies([...data])
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchCompany()
  },[])

  const onSelectCompany = async(e) => {
    try {
      const value = e.target.value
      setSelect(value)
      const selectedCompany = companies.find((x) => x.id == value)
      dispatch(handleCompany(selectedCompany))

      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      return toast.error(`Error : ${error.message}`, {
				position: 'top-center'
			}) 
    }

  }

  // ** Scroll Menu
  const scrollMenu = (container) => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains("d-block")) {
        shadowRef.current.classList.add("d-block")
      }
    } else {
      if (shadowRef.current.classList.contains("d-block")) {
        shadowRef.current.classList.remove("d-block")
      }
    }
  }

  return (
    <Fragment>
      <div
        className={classnames(
          "main-menu menu-fixed menu-accordion menu-shadow",
          {
            expanded: menuHover || menuCollapsed === false,
            "menu-light": skin !== "semi-dark" && skin !== "dark",
            "menu-dark": skin === "semi-dark" || skin === "dark"
          }
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setMenuHover(false)}
      >
        {menu ? (
          menu({ ...props })
        ) : (
          <Fragment>
            {/* Vertical Menu Header */}
            <VerticalMenuHeader
              setGroupOpen={setGroupOpen}
              menuHover={menuHover}
              {...props}
            />
            {/* Vertical Menu Header Shadow */}
            <div className="shadow-bottom" ref={shadowRef}></div>
            {/* Perfect Scrollbar */}
            <PerfectScrollbar
              className="main-menu-content"
              options={{ wheelPropagation: false }}
              onScrollY={(container) => scrollMenu(container)}
            >
              <ul className="navigation navigation-main">
                <li className="nav-item">
                  <div className="d-flex align-items-center px-1">
                    <Input
                      name="select"
                      type="select"
                      size="md"
                      className="text-xs"
                      onChange={onSelectCompany}
                      value={company.id}
                    >
                      {companies.map(x => (
                        <option key={x.id} value={x.id}>{x.name}</option>
                      ))}
                    </Input>
                  </div>
                  {/* <a aria-current="page" class="d-flex align-items-center" href="/home"><span class="menu-item text-truncate">Home</span></a> */}
                </li>
                <VerticalNavMenuItems
                  items={menuData}
                  menuData={menuData}
                  menuHover={menuHover}
                  groupOpen={groupOpen}
                  activeItem={activeItem}
                  groupActive={groupActive}
                  setGroupOpen={setGroupOpen}
                  menuCollapsed={menuCollapsed}
                  setActiveItem={setActiveItem}
                  setGroupActive={setGroupActive}
                  currentActiveGroup={currentActiveGroup}
                  setCurrentActiveGroup={setCurrentActiveGroup}
                />
              </ul>
            </PerfectScrollbar>
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default Sidebar
