import './App.css';
import CheckEvent from './components/CheckEvent';
import HeaderBar from './components/HeaderBar';
import 'antd/dist/antd.css';
import {Layout} from 'antd';
import React, {useState} from "react";

const {Sider, Header, Content, Footer} = Layout

class App extends React.Component {
    render() {
        let _props = this.props;
        let _location = this.props.location;
        let _match = this.props.match;
        console.log(_props);
        console.log(_location);
        console.log(_match);
        const query = this.props.location.search;
        const arr = query.split('&');
        const taskId = !arr[0] || arr[0].length < 8 ? "" : arr[0].substr(8);
        return (<Layout>
            <Header style={{background: '#fff', padding: '0 0'}}>
                <HeaderBar/>
            </Header>
            <Content style={{background: '#fff', padding: '5px 0', margin: '2px 5px'}}>
                <CheckEvent taskId={taskId}/>
            </Content>
            {/*<Footer style={{textAlign: 'center'}}>React-Admin ©2018 Created by 137596665@qq.com <a*/}
            {/*    target='_blank'*/}
            {/*    href='https://github.com/zhangZhiHao1996/react-admin-master'>github地址</a></Footer>*/}
        </Layout>)
    }
}

export default App;
