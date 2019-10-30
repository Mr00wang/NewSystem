import React,{Component} from 'react';
import {Form, Input} from "antd";
import PropTypes from 'prop-types'
const Item = Form.Item;
/*
人员更新分类组件
 */
class UpdateForm extends Component{

    static propTypes = {
        cateName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    };

    /**
     * 将form对象通过setForm()传递父组件
     */
    componentWillMount () {
        this.props.setForm(this.props.form)
    }


    render() {
        const {cateName} = this.props;
        const {getFieldDecorator} = this.props.form;
        return(
            <Form>
                <span>cateName</span>
                <Item>
                    {
                        getFieldDecorator("cateName",{
                            rules: [
                                {required: true, message: '分类名称必须输入'}
                            ],
                            initialValue: cateName
                        })(
                            <Input placeholder="please update username"/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UpdateForm)