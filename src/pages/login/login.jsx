import React,{Component} from 'react';
import {Input,Form,Icon,Button,Tooltip,message} from "antd";
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin}from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
const Item = Form.Item //不能写在import之前
/*
登陆的路由组件
 */
class Login extends Component{
    handleSubmit = (event) =>{
        //阻止事件的默认行为
        event.preventDefault()

        //对所有表单字段进行校验
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // console.log('提交登陆的ajax请求', values)
                // 请求登陆
                const {username, password} = values
                const result = await reqLogin(username, password); // {status: 0, data: user}  {status: 1, msg: 'xxx'}
                // console.log('请求成功', result)
                //if(username==='admin' || password==='admin'){
                if(result.status==="success"){

                    // 提示登陆成功
                    message.success('登陆成功');

                    // 保存user
                    const user = result.data;


                    //const user = {"username":{username},"password":{password}}
                   //const user = {"_id":"1","username":"admin","password":"admin"}
                    memoryUtils.user = user;// 保存在内存中
                    storageUtils.saveUser(user); // 保存到local中

                    // 跳转到管理界面 (不需要再回退回到登陆)
                    this.props.history.replace('/');

                }else { // 登陆失败
                    // 提示错误信息
                    message.error(result.msg);
                }


            }else{
                console.log("校验失败！")
            }
        });

        //得到form对象
        const form = this.props.form
        //获取表单项的输入数据
        const values = form.getFieldsValue()
        console.log('handleSubmit()',values)
    }

    /*
    对密码进行自定义验证
     */
    validatePwd = (rule,value,callback) => {
        console.log('validatePwd()',rule,value)
        if(!value){
            callback('密码必须输入')
        }else if(value.length<3){
            callback('密码长度至少大于三位')
        }else if(value.length>12){
            callback('密码长度不能大于十二位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文、数字或下划线组成')
        }else{
            callback()
        }
        //callback(xxx) 验证失败，并指定提示的文本
    }

    validateUser = (rule,value,callback) => {
        console.log('validateUser()',rule,value)
        if(!value){
            callback('用户名必须输入')
        }else if(value.length<3){
            callback('用户名长度至少大于三位')
        }else if(value.length>12){
            callback('用户名长度不能大于十二位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('用户名必须是英文、数字或下划线组成')
        }else{
            callback()
        }
        //callback(xxx) 验证失败，并指定提示的文本
    }

    render() {

        //如果用户已经登陆，自动跳转到管理界面
        /*const user = memoryUtils.user
        if(user){
            return <Redirect to='/'/>
        }*/
        const form = this.props.form
        const {getFieldDecorator} = form

        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>软件创新基地门户网站后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username', {//配置对象：属性名是特定一些名称
                                    //声明式验证，直接使用别人定义好的验证规则进行验证
                                   /* rules:[
                                        {
                                            validator: this.validateUser
                                        }
                                    ],*/
                                rules: [
                                    { required: true, whitespace:true,message: '用户名必须输入' },
                                    { min : 3, message: '用户名至少3位' },
                                    { max:  12, message: '用户名最多12位' },
                                    //{ pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                                    ],
                                    initialValue:'123' //指定初始值
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                    suffix={
                                        <Tooltip title="Extra information">
                                            <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                                        </Tooltip>
                                    }
                                />,
                            )
                            }
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        validator: this.validatePwd
                                    }
                                    ]
                                /*rules: [
                                    { required: true, whitespace:true,message: '用户名必须输入' },
                                    { min : 4, message: '用户名至少4位' },
                                    { max:  12, message: '用户名最多12位' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                                ],*/
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                    suffix={
                                        <Tooltip title="Extra information">
                                            <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                                        </Tooltip>
                                    }
                                />,
                            )}
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登  陆
                            </Button>
                        </Item>
                    </Form>
                </section>
                <footer className="login-bottom">
                    <div>Copyright&copy;2019该版权归郑州轻工业大学软件创新基地所有</div>
                </footer>
            </div>
        )
    }
}

/*
1.高阶函数
    1).一类特别的函数
        a.接收函数类型的参数
        b.返回值是函数
    2).常见
        a.定时器: setTimeout()/setInterval()
        b:Promise: Promise(() => {} ) then(value => {}, reason => {})
        c:数组遍历相关的方法：forEach() /filter()/map()/reduce()/find()/findIndex()
        d:函数对象的bind()
        e:Form.create() / getFieldDecorator()
     3).高阶函数更新动态，更加具有扩展性
2.高阶组件
    1).本质就是一个函数
    2).接收一个组件(被包装组件)，返回一个新的组件(包装组件)，包装组件会向被包装组件传入特定属性
    3).作用:扩展组件的功能
    4).高阶组件也是高阶函数，接收一个组件函数，返回是一个新的组件函数

 */
/*
包装Form组件生成一个新的组件： Form(Login)
新组件会向form组件传递一个强大的对象属性：form
 */
const  WrapLogin = Form.create()(Login)
export default WrapLogin

/*
1. 前台表单验证
2. 收集表单输入数据
 */

/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
 */