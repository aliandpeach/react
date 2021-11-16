import React from 'react'
import {
    Card,
    Popconfirm,
    Button,
    Icon,
    Table,
    Divider,
    BackTop,
    Affix,
    Anchor,
    Form,
    InputNumber,
    Input,
    Modal
} from 'antd'
import axios from 'axios'
import EventDetail from "../EventDetail";

class CheckEvent extends React.Component {
    escapeRegexSpecialWord(keyword) {
        if (keyword && keyword.length > 0) {
            let reg_reg = /\$|\(|\)|\*|\+|\.|\[|\]|\?|\\|\^|\{|\}|\||\《|\》"/g;
            let reg_str = keyword.replace(reg_reg, str => {
                return `\\${str}`;
            });
            return '(' + reg_str + ')';
        }
    }

    columns = [
    {
        title: '匹配内容',
        dataIndex: 'breachContent',
        width: '35%',
        render: (a,record) => {
            if (record.matchContent && record.matchContent != '||') {
                let matchArr = record.matchContent.split(';');
                matchArr = Array.from(new Set(matchArr));
                let regStr = '';
                matchArr.forEach((keywords, i) => {
                    //将‘||’转为‘|’
                    let keyArr = keywords.split('||');
                    keyArr = Array.from(new Set(keyArr));
                    keyArr.forEach(eles => {
                        let ele;
                        //如果创建正则失败，将正则中的特殊字符全部转义
                        try {
                            new RegExp(eles);
                        } catch (err) {
                            ele = this.escapeRegexSpecialWord(eles);
                        }
                        regStr += '|' + (ele || eles);
                    });
                });
                regStr = regStr.substr(1);
                let reg;
                try {
                    reg = new RegExp(regStr, 'gi');
                } catch (err) {
                    reg = '';
                }
                if (reg) {
                    let breachArr = record.breachContent.split(';'), str = '';
                    breachArr.forEach(ele => {
                        let eleStr = ele.replace(reg, str => {
                            return `<label class='event-red'>${str}</label>`;
                        });
                        str += eleStr.trim() ? eleStr + ';' : ';';
                    });
                    record.matchTemplate = str.slice(0, -1);
                }
            }
            return <div dangerouslySetInnerHTML={{__html: record.matchTemplate ? record.matchTemplate : record.breachContent}}></div>;
        }
    }, {
        title: '涉密等级',
        dataIndex: 'sensitivityId',
        render: sensitivityId => {
            if (sensitivityId === 1) {
                return '很低';
            } else if (sensitivityId === 2) {
                return '低';
            } else if (sensitivityId === 3) {
                return '中等';
            } else if (sensitivityId === 4) {
                return '高';
            } else if (sensitivityId === 5) {
                return '很高';
            }
        }
    }, {
        title: '数据',
        dataIndex: 'filepath',
    }, {
        title: '规则名称',
        dataIndex: 'ruleName',
    }, {
        title: '匹配模板',
        dataIndex: 'matchContent',
    }, {
        title: '时间',
        dataIndex: 'detectDateTs',
    }, {
        title: '操作',
        dataIndex: 'option',
        render: (text, record) => (
            <span>
              <a onClick={() => this.detail(record.id)}>详情</a>
            </span>
        )
    }];

    state = {
        filteredInfo: null,
        sortedInfo: null,
        loading: false,
        pagination: {
            pageSize: 10,
            pageSizeOptions: ["5", "10", "20"],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => {
                return (
                    <span
                        style={{
                            fontSize: 18,
                            color: '#264653',
                            fontFamily: "微软雅黑",
                        }}
                    >共{total}条数据</span>
                )
            }
        },
        data:[],

        detailVisible: false,

        errorVisible: false,
        message: ''
    }

    closeModal(a) {
        this.setState({
            [a]: false
        })
    }
    detail(id) {
        this.setState({
            detailVisible: true,
            eventId: id
        })
    }

    componentDidMount() {
        let _props = this.props;
        this.getRemoteData({currentPage: 1, pageSize: 10})
    }

    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        })
    }
    clearFilters = () => {
        this.setState({filteredInfo: null})
    }
    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        })
    }
    setSort = (type) => {
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: type,
            },
        })
    }

    getRemoteData(params) {
        this.setState({
            loading: true
        })

        axios.post('/SIMP_DBS_S/event/file/detect/event/page', {
            taskId: this.props.taskId,
            ...params
        }).then(res => {
            const pagination = {...this.state.pagination};
            pagination.total = res.data.total;
            this.setState({
                loading: false,
                data: res.data.rowList,
                pagination
            })
        }).catch(e => {
            console.log(e.response.data.message);
            console.log(e.response.status);
            this.setState({message: e.response.data.message, errorVisible: true, loading: false});
        })
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.pageSize = pagination.pageSize;
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        let _this = this;
        this.getRemoteData({
            taskId: _this.props.taskId,
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        })
    }

    render() {
        const rowSelection = {
            selections: true
        }
        let {sortedInfo, filteredInfo} = this.state
        sortedInfo = sortedInfo || {}
        filteredInfo = filteredInfo || {}
        const {detailVisible} = this.state;
        const {errorVisible} = this.state;
        return (
            <div>
                <Table rowKey={record => record.id}
                       bodyStyle={{color: 'black'}}
                       loading={this.state.loading}
                       dataSource={this.state.data}
                       pagination={this.state.pagination}
                       onChange={this.handleTableChange}
                       columns={this.columns} style={styles.tableStyle}/>

                <Modal visible={detailVisible} title='事件详情' width={'800px'} style={{color: 'black'}}
                       onCancel={() => this.closeModal('detailVisible')} footer={null}>
                    <EventDetail eventId={this.state.eventId}/>
                </Modal>
                <Modal visible={errorVisible} title='提示信息' width={'320px'} style={{color: 'black'}}
                       onCancel={() => this.closeModal('errorVisible')} footer={
                    <div style={{textAlign: 'center'}}>
                        <Button style={{backgroundColor: '#f1455b'}} onClick={() => this.closeModal('errorVisible')}>确认</Button>
                    </div>
                }>
                    <div style={{height: '150px', overflowY: 'auto', overflowX: 'hidden'}}>
                        <p style={{paddingTop: '20px', paddingLeft: '20px'}}>{this.state.message}</p>
                    </div>
                </Modal>
            </div>
        )
    }
}

const styles = {
    tableStyle: {
        width: '99%',
        fontSize: '0.875rem',
        color: '#333'
    },
    affixBox: {
        position: 'absolute',
        top: 100,
        right: 50,
        with: 170
    }
}

export default CheckEvent