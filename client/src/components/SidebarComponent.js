import React,{Component} from "react";
import { NavItem, 
         NavLink, 
         Nav,
        } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";
import auth from "../api/auth-helper"
import EntityFilter from "../components/EntityFilterComponent";
import SubMenu from "../components/TransactionFilterComponent";
import { withRouter } from 'react-router-dom';
import logo from "../images/logo.png"
class SideBar extends Component {

  
  render()
  {
    return(
        <div className={classNames("sidebar", { "is-open": this.props.isOpen })}>
        <div className="sidebar-header">
          <span color="info" onClick={this.props.toggle} style={{ color: "#fff" }}>
            &times;
          </span>
          <h3><img src={logo} alt="logo"></img></h3>
        </div>
        <div className="side-menu">
          <Nav vertical className="list-unstyled pb-3">
            {/* <p className="ml-5">Dashboard</p>  */}
            {
              auth.isAuthenticated() && (
                  <NavItem>
                    <NavLink onClick={this.props.toggle} tag={Link} to={"/entity"}>
                      <span className="fa fa-plus ml-4 mr-2"/>
                      Add Entity
                    </NavLink>
                  </NavItem>
                )
            }
            
            <br></br>
            {
              auth.isAuthenticated() && (
                  <NavItem>
                    <NavLink onClick={this.props.toggle} tag={Link} to={"/transaction"}>
                      <span className="fa fa-plus ml-4 mr-2"/>
                      Add Transaction
                    </NavLink>
                  </NavItem>
                )
            }
            <br></br>
            {
              auth.isAuthenticated() && (
                        <EntityFilter  toggleside={this.props.toggle} setData={this.props.setEntities}  title="Entities"/>
                    
                )
            }
            <br></br>
            {
              auth.isAuthenticated() && (
                   
                          <SubMenu  toggleside={this.props.toggle} setData={this.props.setTrans} title="Transactions"/>
                )
            }
          </Nav>
          
        </div>
      </div>
    )
  }
}

export default withRouter(SideBar);
