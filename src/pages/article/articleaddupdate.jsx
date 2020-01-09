import React,{Component} from 'react';
import {Button, Card, Form, Icon, Input, message, Select} from 'antd'
import LinkButton from "../../components/link-button";
import Editor from "./brafteditor";
import {reqCategory} from "../../api";
const {Option} = Select;
const {Item} = Form;
/*
文章编辑子路由
 */
class ArticleAddUpdate extends Component{
    state = {
        categories:[],
    };

    submit = () => {
        this.props.form.validateFields((error, value) => {
            if(!error) {
                alert("发送ajax请求")
            }
        })
    };

   /* constructor (props) {
        super(props);

        // 创建用来保存ref标识的标签对象的容器
        //this.pw = React.createRef()
       this.editor = React.createRef()
    }*/

    getCategory = async () => {
        this.setState({loading:true});
        const result = await reqCategory();
        if(result.status === 'success'){
            const categories = result.data;
            this.setState({loading:false});
            this.setState({
                categories

            })
        }else{
            message.success(result.msg)
        }
    };


    componentDidMount() {
        this.getCategory();
    }

    render() {
        const {categories} = this.state;
      //  const { getFieldDecorator } = this.props.form;
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                <Icon type='arrow-left' style={{fontSize: 20}}/>
                </LinkButton>
                <span>文章编辑</span>
            </span>
        );

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 10 },  // 左侧label的宽度
            // wrapperCol: { span: 8 }, // 右侧包裹的宽度
        };

        const {getFieldDecorator} = this.props.form;
        return(
            <Card title={title}>
                <Form layout="inline" {...formItemLayout}>
                    <Item label="请选择文章类型">
                        {
                            getFieldDecorator('category', {
                                initialValue: "",
                                rules: [
                                    {required: true, message: '必须选择文章类别'}
                                ]
                            })(
                                <Select placeholder="请选择文章类别" style={{width : 170, height : 35}}>
                                {
                                    categories.map(c => <Option value={c.id}>{c.cateName}</Option>)
                                }
                                </Select>
                            )
                        }
                    </Item>
                    <Item> {
                        getFieldDecorator('title', {
                            initialValue: "",
                            rules: [
                                {required: true, message: '必須輸入文章標題'}
                            ]
                        })(
                            <Input placeholder="请输入文章标题" style={{width: 430, height: 35}}/>
                        )
                    }
                    </Item>
                    <Item>
                        <Editor/>
                    </Item>
                </Form>
                <Button type="primary" style={{marginTop: '10px'}} onClick={() => this.submit()}>发布文章</Button>
            </Card>
        )
    }
}

export default Form.create()(ArticleAddUpdate)