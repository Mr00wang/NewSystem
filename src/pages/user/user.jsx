import React,{Component} from 'react';
import {Button, Card, Icon, Input, Table,message,Modal,Select} from "antd";
import LinkButton from "../../components/link-button";
import AddForm from "./addform"
import UpdateForm from "./updateform";
import {reqAddUser, reqDeleteUser, reqSearchUser, reqUpdateUser, reqUsers} from "../../api";

const Option = Select.Option;
const {Search} = Input;
/*
人员管理路由
 */

export default class User extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
        users: []  //用户列表
    };

    initColumns = () => {
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 280,
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.seat - b.seat,
            },
            {
                title: 'UserName',
                dataIndex: 'username',
                width: 280,
            },
            {
                title: 'PassWord',
                dataIndex: 'password',
                width: 280,
            },
            {
                title: '操作',
                width: 280,
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改人员</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除人员</LinkButton>
                    </span>

                )
            },

        ];
    };

    /**
     * 获取用户列表
     */
    getUsers = async () => {
        this.setState({loading:true});
        const result = await reqUsers();
        if(result.status === "success"){
            const users = result.data;
            this.setState({loading:false});
            this.setState({
                users
            })
        }else {
            message.error(result.msg);
        }
    };
    /**
     * 获取用户列表
     */
    componentDidMount() {
        this.getUsers();
    }

    /**
    为第一次render()准备数据
     */
    componentWillMount() {
        this.initColumns()
    }
    /**
     * 响应点击取消: 隐藏确定框
     */
    handleCancel = () => {
        // 清除输入数据
        this.form.resetFields();
        // 隐藏确认框
        this.setState({
            showStatus: 0
        })
    };
    /**
     *显示人员添加的确认框
     */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    };

    /*
   添加成员请求
    */
    addUser = () => {
        this.form.validateFields(async (err,values) => {
            if(!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                });
                //准备数据
                const {username, password} = values;
                //const user = {memberName, place}
                //清除
                this.form.resetFields();
                const result = await reqAddUser(username, password);
                if(result.status === "success"){
                    this.getUsers();
                    message.success(result.msg)
                }else{
                    message.error(result.msg)
                }
            }
        })
    };

    /*
    修改人员请求
     */
    updateUser = () => {

        this.form.validateFields(async (err,values) => {
            if(!err) {
                //1,隐藏确定框
                this.setState({
                    showStatus: 0
                });
                //准备数据
                const {username, password} = values;
                const id = this.user.id;
                //清除
                this.form.resetFields();
                const result = await reqUpdateUser(id, username, password);
                if(result.status === "success"){
                    message.success(result.msg);
                    this.getUsers()
                }else{
                    message.error(result.msg);
                }
            }
        })
    };
    /*
  显示修改的确认框
   */
    showUpdate = (user) => {
        // 保存分类对象
        this.user = user;
        // 更新状态
        this.setState({
            showStatus: 2
        })
    };
    /**
     *删除指定用户
     */
    deleteUser = (user) => {
        //console.log(user)
        Modal.confirm({
            title: `确认删除${user.id}吗?`,
            onOk: async () => {
                //const id = user.index
                const result = await reqDeleteUser(user.id);
                if(result.status=== "success") {
                    message.success(result.msg);
                    this.getUsers();
                }else{
                    message.error(result.msg);
                }
            }
        })
    };

    /**
     * 查询用户
     */
    searchUser = async (value) => {
        if(value === ''){
            this.getUsers();
        }
        else{
            this.setState({loading:true});
            const result = await reqSearchUser(value);
            this.setState({loading:false});
            if(result.status === "success") {
                const users = result.data;
                this.setState({
                    users
                })
            }else{
                message.error(result.msg);
            }
        }
    };

    start = () => {
        message.warn("正在开发中！");
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    };

    onSelectChange = selectedRowKeys => {
        //console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    render() {
        const {selectedRowKeys, showStatus ,users,loading} = this.state;

        //读取指定的分类
        const user = this.user || {};
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const title = (
            <span>
                <Select style={{width:130}} defaultValue="1">
                    <Option value="1">按用户名查询</Option>
                    <Option value="2" disabled>按ID查询</Option>
                </Select>
                &nbsp;&nbsp;
                <Search
                    placeholder="input search text"
                    onSearch={value => {this.searchUser(value)}}
                    enterButton
                    style={{ width: 200 }}
                />
            </span>
        );

        const extra = (
            <span>
                <span style={{ marginLeft: 16 }}>
                    {hasSelected ? `已选中 ${selectedRowKeys.length} 项` : ''}
                    &nbsp;&nbsp;
                    <Button type="primary" onClick={this.start} disabled={!hasSelected} >
                        <Icon type="delete"/>
                        <span>删除所选</span>
                    </Button>
                </span>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.showAdd}>
                    <Icon type="user-add"/>
                    <span>用户添加</span>
                </Button>


            </span>
        );

        return(
            <Card title={title} extra={extra}>
                <Table
                    loading={loading}
                    rowKey={"id"}
                    bordered={true}
                   // pagination={{defaultPageSize: 6,showQuickJumper: true}}
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={users}
                />
                <Modal
                    title="用户添加"
                    visible={showStatus===1}
                    onOk={this.addUser}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>

                <Modal
                    title="修改人员"
                    visible={showStatus===2}
                    onOk={this.updateUser}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        username={user.username}
                        password={user.password}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
            </Card>
        )
    }
}