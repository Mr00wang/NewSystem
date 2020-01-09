import React,{Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom'
import memoryUtils from "../../utils/memoryUtils";
import {Layout , Icon} from "antd";
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Article from "../article/article";
import Category from "../category/category";
import User from "../user/user";
import NotFound from "../waring/notFound";
import About from "../about/about";
const { Footer,  Content ,Sider} = Layout;
/*
后台管理的路由组件
 */
export default class Admin extends Component{
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const user = memoryUtils.user;
        if(!user){
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{minHeight:'100%'}}>
                <Sider
                    trigger={null}
                    collapsible collapsed={this.state.collapsed}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                    }}
                >

                    <LeftNav/>
                </Sider>
                <Layout style={{ marginLeft: 200 }}>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content
                        style={{margin:20,backgroundColor:'#fff'}}
                    >
                        <Switch>
                            <Redirect exact from='/' to='/home'/>
                            <Route path='/home' component={Home}/>
                            <Route path='/user' component={User}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/article' component={Article}/>
                            <Route path='/about' component={About}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:'center' , color:'#cccccc'}}>Copyright&copy;2019 Software Innovation Base Of Zhengzhou University Of Light Industry. All Rights Reserved</Footer>
                </Layout>
            </Layout>
        )
    }
}