import React,{Component} from 'react';
import {Form, Input} from "antd";
import PropTypes from 'prop-types'
const Item = Form.Item;
/*
人员更新分类组件
 */
class UpdateForm extends Component{

    static propTypes = {
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentWillMount () {
        // 将form对象通过setForm()传递父组件
        this.props.setForm(this.props.form)
    }


    render() {
        const {username,password} = this.props;
        const {getFieldDecorator} = this.props.form;
        return(
            <Form>
                <span>username</span>
                <Item>
                    {
                        getFieldDecorator("username",{
                            rules: [
                                {required: true, message: '用户名必须输入'}
                            ],
                            initialValue: username
                        })(
                            <Input placeholder="please update username"/>
                        )
                    }
                </Item>
                <span>password</span>
                <Item>
                    {
                        getFieldDecorator("password",{
                            rules: [
                                {required: true, message: '密码必须输入'}
                            ],
                            initialValue: password
                        })(

                            <Input placeholder="please update password"/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UpdateForm)