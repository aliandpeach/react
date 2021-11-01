import React from 'react'
import {Card, Button, Modal, Tooltip} from 'antd'
import axios from "axios"
import '../../assets/css/eventDetail.css'
// import Parser from 'html-react-parser';

const sensitivityMap = {1: "很低", 2: "低", 3: "中等", 4: "高", 5: "很高"};
const secretRateMap = {1: "★", 2: "★★", 3: "★★★", 4: "★★★★", 5: "★★★★★"};
const statusMap = {'1':'未审核','2':'处理','3':'关闭','4':'已审核'};

class EventDetail extends React.Component {
    state = {
        loading: false,
        breachContent: null,
        detectDateTs: null,
        fileContent: null,
        filename: null,
        filepath: null,
        ip: null,
        secretRate: null,
        sensitivityId: null,
        orgName: null,
        status: null
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     // return {eventId: nextProps.eventId};
    //     // debugger
    //     return {eventId: nextProps.eventId};
    // }
    //
    // getSnapshotBeforeUpdate(a, b, c) {
    //     return null;
    // }

    componentDidMount() {
        this.setState({
            loading: true
        });

        let eventId = this.props.eventId;
        axios.get('/SIMP_DBS_S/event/file/detect/event/' + eventId, {}).then(res => {
            this.setState({
                loading: false,
                breachContent: res.data.dscvrFiles.breachContent,
                detectDateTs: res.data.dscvrFiles.detectDateTs,
                fileContent: res.data.dscvrFiles.fileContent,
                filename: res.data.dscvrFiles.filename,
                filepath: res.data.dscvrFiles.filepath,
                ip: res.data.dscvrFiles.ip,
                secretRate: res.data.dscvrFiles.secretRate,
                sensitivityId: res.data.dscvrFiles.sensitivityId,
                orgName: res.data.dscvrFiles.orgName,
                status: res.data.dscvrFiles.status
            })
        })
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return !(nextProps.eventId === this.props.eventId);
    // }

    // componentDidUpdate(prevProps, prevState) {
    //
    // }

    componentWillReceiveProps(nextProps) {
        this.setState({
            loading: true
        });

        let eventId = nextProps.eventId;
        axios.get('/SIMP_DBS_S/event/file/detect/event/' + eventId, {}).then(res => {
            this.setState({
                loading: false,
                breachContent: res.data.dscvrFiles.breachContent,
                detectDateTs: res.data.dscvrFiles.detectDateTs,
                fileContent: res.data.dscvrFiles.fileContent,
                filename: res.data.dscvrFiles.filename,
                filepath: res.data.dscvrFiles.filepath,
                ip: res.data.dscvrFiles.ip,
                secretRate: res.data.dscvrFiles.secretRate,
                sensitivityId: res.data.dscvrFiles.sensitivityId,
                orgName: res.data.dscvrFiles.orgName,
                status: res.data.dscvrFiles.status
            })
        })
    }

    render() {
        let _className = 'span sensitivityId color-' + this.state.sensitivityId;
        let _sensitivityName = sensitivityMap[this.state.sensitivityId];

        let rate = this.state.secretRate > 80 && this.state.secretRate <= 100 ? 5 : 4;
        rate = this.state.secretRate > 60 && this.state.secretRate <= 80 ? 4 : rate;
        rate = this.state.secretRate > 40 && this.state.secretRate <= 60 ? 3 : rate;
        rate = this.state.secretRate > 20 && this.state.secretRate <= 40 ? 2 : rate;
        rate = this.state.secretRate >= 0 && this.state.secretRate <= 20 ? 1 : rate;

        let secretRateName = secretRateMap[rate];
        return (
            <div style={{maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden'}}>
                <Card title={"基本属性"} style={{fontSize: '0.875rem', color: 'black'}}
                      headStyle={{height: '2rem', minHeight: '2rem', backgroundColor: '#f1f1f1'}}>
                    <div>
                        <div className={'text-detail div2'}>
                            <div className={'inline-block'}>
                                <label className={'text'}>涉密等级：</label>
                                <span className={_className}>{_sensitivityName}</span>
                            </div>
                            <div className={'inline-block'}>
                                <label className={'text'}>涉密概率：</label>
                                <span className={'span rate'}>{secretRateName}</span>
                            </div>
                            <div className={'inline-block'}>
                                <label className={'text'}>IP地址：</label>
                                <span className={'span'}>{this.state.ip}</span>
                            </div>
                        </div>
                        <div className={'text-detail div2'}>
                            <label className={'text'}>检查时间：</label>
                            <span className={'span2'}>{this.state.detectDateTs}</span>
                        </div>
                        <div className={'text-detail div2'}>
                            <label className={'text'}>涉密数据：</label>
                            <span className={'span2'}>{this.state.filename}</span>
                        </div>
                        <div className={'text-detail'}>
                            <label className={'text'}>路径：</label>
                            <span className={'span2'}>{this.state.filepath}</span>
                        </div>
                    </div>
                </Card>
                <Card title={"从属信息"} style={{color: 'black'}}
                      headStyle={{height: '2rem', minHeight: '2rem', backgroundColor: '#f1f1f1'}}>
                    <div className={'text-detail div2'}>
                        <label className={'text'}>部门：</label>
                        <span className={'span'}>{this.state.orgName}</span>
                        <label className={'text'}>审核状态：</label>
                        <span className={'span'}>{statusMap[this.state.status]}</span>
                    </div>
                </Card>
                <div>
                    <Card title={"敏感内容概要"} style={{color: 'black'}}
                          headStyle={{height: '2rem', minHeight: '2rem', backgroundColor: '#f1f1f1'}}>
                    <pre className={'table2 pre2'} style={{color: 'black'}} dangerouslySetInnerHTML={{__html: this.state.fileContent}}>
                    </pre>
                    </Card>
                </div>
            </div>
        )
    }
}

export default EventDetail