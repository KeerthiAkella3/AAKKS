import React, { Component, useState } from "react";
import {
  Row,
  Col,
  FormControl,
  Modal,
  InputGroup,
  Form,Image
} from "react-bootstrap";
import { Input } from "reactstrap";
import "../CSS/navbar.css";
import "../CSS/List.css";
import LeftNav from "./LeftNav";
import classnames from "classnames";
import { TabProvider, Tab, Tabs, TabPanel, TabList } from "react-web-tabs";
//import "react-web-tabs/dist/react-web-tabs.css";
import axios from "axios";
import { hostAddress, port } from "../Constants/index";
//import Modal from "react-modal";
import OwnedList from "./OwnedList";
import SubscribedList from "./SusbscribedList";
import MemberList from "./MemberList";

const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    "Content-Type": "application/json"
  }
};

let pageRefresh = false;

const ListTabs = props => {
  return (
    <div>
      <Tabs
        defaultTab="one" class="removePadding"
        onChange={tabId => {
          console.log(tabId);
        }}
      >
        <TabList>
          <Tab style={{ width: "33%" }} tabFor="one">
            Owned
          </Tab>

          <Tab style={{ width: "33%" }} tabFor="two">
            Subscribed
          </Tab>

          <Tab style={{ width: "33%" }} tabFor="three">
            Member
          </Tab>
        </TabList>

        <TabPanel tabId="one">
          <OwnedList />
        </TabPanel>

        <TabPanel tabId="two">
          <SubscribedList />
        </TabPanel>

        <TabPanel tabId="three">
          <MemberList />
        </TabPanel>
      </Tabs>
    </div>
  );
};

let showFlag = false;

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listname: "",
      description: "",
      modalIsOpen: false,
      buttonflag: false,
      members: [],
      memberSearch: "",
      addMemberList: []
    };
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    pageRefresh = false;
  }
  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleNewList = () => {
    this.setState({
      newListFlag: true
    });
  };
  handleClose = () => {
    this.setState({
      newListFlag: false,
      buttonflag: false,
      addMemberList: []
    });
  };

  removeMember = value1 => {
    console.log(value1);

    var t = this.state.addMemberList.filter(
      value => value.username != value1.username
    );
    console.log(t);
    this.setState({
      addMemberList: t
    });
  };

  searchMember = () => {
    const data = {
      username: this.state.memberSearch
    };
    console.log(data);
    //set the with credentials to true
    if (this.state.memberSearch != "") {
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post(
          "http://" + hostAddress + ":" + port + "/findMember/findMember",
          data,
          config
        )
        .then(response => {
          console.log("Hello find member Data received:", response.data);

          var obj;
          if (response.data[0] == null) {
            obj = null;
          } else {
            obj = {
              firstName: response.data[0].firstName,
              lastName: response.data[0].lastName,
              username: response.data[0].username,
              img: response.data[0].profilePicture
            };
          }
          console.log(this.state.addMemberList);

          var t = this.state.addMemberList.concat(obj);
          console.log("Hello find member Data received:", obj);
          this.setState({
            addMemberList: t
          });
        });
    }
  };




  gotoNext = () => {
    console.log("I am here in next button handler");
    this.setState({
      buttonflag: true
    });
  };

  createList = e => {
    var t1 = [];
    this.state.addMemberList.map(item => {
      t1.push(item.username);
    });
    console.log(t1);
    console.log("Hi there I am in create list");
    e.preventDefault();
    const data = {
      listname: this.state.listname,
      // creatorID:localStorage.getItem('username'),
      // creatorName:localStorage.getItem('firstName'),
      creatorID: "alaukika",
      creatorName: "Alaukika Diwanji",
      description: this.state.description,
      members: t1
    };
    console.log(data);
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios
      .post(
        "http://" + hostAddress + ":" + port + "/createList/createList",
        data,
        config
      )
      .then(response => {
        console.log("Status Code : ", response.status);
        alert(response.data.msg);
        pageRefresh = true;
        this.handleClose();
      });
  };

  render() {
    let redi = null;
    if (pageRefresh) {
      redi = window.location.reload();
    }
    const { tags, suggestions } = this.state;
    let links = [
      { label: "Home", link: "/", className: "fas fa-home", active: true },
      { label: "Explore", link: "/Explore", className: "fas fa-hashtag" },
      { label: "Notifications", link: "#home", className: "fas fa-bell" },
      { label: "Messages", link: "/Messages", className: "fas fa-envelope" },
      { label: "Bookmarks", link: "#home", className: "fas fa-bookmark" },
      { label: "Lists", link: "#home", className: "fas fa-list-alt" },
      { label: "Profile", link: "#home", className: "fas fa-user-circle" },
      { label: "More", link: "#home", className: "fas fas fa-ellipsis-h" }
    ];

    let modalContent = null;
    if (!this.state.buttonflag) {
      modalContent = (
        <div>
          <InputGroup className="ip2">
            <FormControl
              onChange={this.inputChangeHandler}
              name="listname"
              placeholder="Name"
              style={{
                backgroundColor: "rgb(245, 250, 258)",
                borderBottom: "solid black 1px"
              }}
            />
          </InputGroup>
          <div style={{ padding: "4%" }}></div>
          <InputGroup className="ip2">
            <FormControl
              onChange={this.inputChangeHandler}
              name="description"
              placeholder="Description"
              style={{
                backgroundColor: "rgb(245, 250, 258)",
                borderBottom: "solid black 1px"
              }}
            />
          </InputGroup>
          <button
            onClick={this.gotoNext}
            style={{
              backgroundColor: "rgba(29, 161, 242, 1)",
              float: "right",
              margin: "4%",
              display: { showFlag },
              borderRadius: "12px",
              color: "white"
            }}
          >
            {" "}
            <b>Next</b>
          </button>
        </div>
      );
    } else {
      let memberDetails = [];
      console.log("bleh:", this.state.addMemberList);
      if (this.state.addMemberList != "") {
        this.state.addMemberList.map(listItem => {
          console.log("Hello:", listItem);
          memberDetails.push(
            <span>
              <button
                class="tagbutton"
                name={listItem.username}
                onClick={this.removeMember.bind(this, listItem)}
              >
                <Image
                  src="https://i.pinimg.com/280x280_RS/7b/8d/fe/7b8dfea729e9ff134515fef97cf646df.jpg"
                  style={{
                    height: "20px",
                    width: "20px",
                    margin: "4px"
                  }}
                  roundedCircle
                  alt=""
                ></Image>

                <span>
                  <b style={{ fontSize: "12px", marginRight: "3px" }}>
                    {listItem.firstName}
                  </b>
                </span>
                <span>
                  <b style={{ fontSize: "12px", marginRight: "2px" }}>
                    {listItem.lastName}
                  </b>
                </span>

                <span
                  style={{ fontSize: "14px", marginTop: "2%", float: "right" }}
                >
                  <i class="far fa-times-circle"></i>
                </span>
              </button>
            </span>
          );
        });
      }

      modalContent=(
        <div>
          <Form>
            <Form.Row>
              <Col class="col-10">
                <Input
                  className="ip2 inputList wideinput"
                  onChange={this.inputChangeHandler}
                  name="memberSearch"
                  onChange={this.inputChangeHandler.bind(this)}
                  placeholder="Enter username"
                />
              </Col>
              <Col class="col-2">
                <i
                  class="fas fa-search levelClass"
                  onClick={this.searchMember.bind(this)}
                ></i>
                {/* <Button  className="fas fa-search" onClick={this.searchMember.bind(this)}>
              
            </Button> */}
              </Col>
            </Form.Row>
          </Form>
          <div>
            <ul>{memberDetails}</ul>
          </div>
          <div>
            <br></br>
            <br></br>

            <br></br>
            <br></br>
          </div>
          <button onClick={this.createList}
            style={{
              backgroundColor: "rgba(29, 161, 242, 1)",
              float: "right",
              margin: "4%",
              display: { showFlag },
              borderRadius: "12px",
              color: "white"
            }}>
            <b> Create</b>
          </button>
        </div>
      );
 
    }
    return (
      <div>
        <Row>
          <Col className="col-sm-3 removePadding">
            <LeftNav links={links}></LeftNav>
          </Col>
          <Col className="col-sm-6 removePadding">
            {redi}
            <div style={{ fontSize: "18px", paddingTop: "2%" }}>
              <b>Lists</b>
              <i
                style={{ colour: "blue" }}
                className="far fa-edit float-right fa-list-alt"
                onClick={this.handleNewList}
              ></i>
            </div>
            <div
              style={{
                fontSize: "14px",
                marginTop: "0%",
                color: "rgb(124, 124, 124)"
              }}
            >
              <b>@AlaukikaD</b>
            </div>

            {console.log("blehhh")}
            <ListTabs />

            <Modal show={this.state.newListFlag} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>
                  <h6>
                    <b>Create New List</b>
                  </h6>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>{modalContent}</Modal.Body>
            </Modal>
          </Col>
          <Col className="col-sm-3">
            <div class="navbar-side-right" id="navbarSide">
              here
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default List;