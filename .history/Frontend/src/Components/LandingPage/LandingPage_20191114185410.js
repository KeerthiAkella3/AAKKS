import React, { Component } from 'react'
import GettingStarted from './GettingStarted'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import image from './twitterLandingPage.png'

class LandingPage extends Component {
    render() {
        return (
            <img src ={image} alt="twitterLandingPage" />
        )
        //LandingPage
    }
}

export default LandingPage
