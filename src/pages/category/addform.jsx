import React,{Component} from 'react';
import {Form,Input} from "antd";
import PropTypes from 'prop-types'
const Item = Form.Item;

/*
添加分类组件
 */
class AddForm extends Component{

    static propTypes = {
        setForm: PropTypes.func.isRequired // 用来传递form对象的函数
    };

    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return(
            <Form>
                <span>分类</span>
                <Item>
                    {

                        getFieldDecorator("cateName",{
                            rules: [
                                {required: true, message: '分类名必须输入'}
                            ]
                        })(
                            <Input placeholder="please input cateName"/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)