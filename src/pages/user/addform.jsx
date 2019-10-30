import React,{Component} from 'react';
import {Form,Input} from "antd";
import PropTypes from 'prop-types'
const Item = Form.Item;

/*
人员添加分类组件
 */
class AddForm extends Component{

    static propTypes = {
        setForm: PropTypes.func.isRequired // 用来传递form对象的函数
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return(
            <Form>
                <span>username</span>
                <Item>
                    {

                        getFieldDecorator("username",{
                            rules: [
                                {required: true, message: '用户名必须输入'}
                            ]
                        })(
                            <Input placeholder="please input username"/>
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
                        })(
                            <Input placeholder="please input password"/>
                        )
                    }

                </Item>

            </Form>
        )
    }
}

export default Form.create()(AddForm)