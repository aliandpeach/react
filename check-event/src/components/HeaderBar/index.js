import React from 'react'
import {Icon, Badge, Dropdown, Menu, Modal} from 'antd';
import logo from '../../assets/img/logo.png';

class HeaderBar extends React.Component {
    state = {
        visible: false
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    toggle = () => {
        this.props.onToggle()
    }

    render() {
        // const {visible} = this.state
        // const {appStore, collapsed, location} = this.props
        return (
            <div id='header_bar' style={{backgroundColor: '#ca0000'}}>
                <img src={logo} alt= "" style={{width: '2.5rem', height: '2.5rem'}}/>
                <label style={{fontSize: '1.125rem', fontWeight: 'bolder', color: '#fff',margin: '0 0.5rem'}}>数据库保密检查系统（大数据版）</label>
            </div>
        )
    }
}

export default HeaderBar