import React,{Component} from 'react';
import './index.less'
import {withRouter} from 'react-router-dom'
import {formateDate} from "../../utils/dateUtils";
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { Modal,message} from 'antd';
import LinkButton from "../link-button";
import {reqWeather} from "../../api";

class Header extends Component{

    state = {
        currentTime: formateDate(Date.now()),//当前时间字符串
        dayPictureUrl: "",  //天气图片的url
        weather: "", //天气的文本
    };

    /**
     * 动态获取事件
     */
    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now());
            this.setState({currentTime})
        },1000)

    };

    /**
     * 动态获取天气情况
     * @returns {Promise<void>}
     */
    getWeather = async () => {
        // 调用接口请求异步获取数据
        const {dayPictureUrl, weather} = await reqWeather('郑州');
        // 更新状态
        this.setState({dayPictureUrl, weather})
    };
    getTitle = () => {
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item => {
            if(item.key===path) {
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0);
                if (cItem){
                    title = cItem.title
                }

            }
        });
        return title
    };
    /*
    第一次render（）之后执行一次
    一般在此执行异步操作： 发ajax请求启动定时器
     */
    componentDidMount() {
        this.getTime();
        this.getWeather();
    }
    componentWillUnmount () {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    /*
    退出登陆
     */
    loyout = () => {
        Modal.confirm({
            title: '确定退出吗？',
            //content: '确定退出吗？',
            onOk: () => {
                //console.log('OK');
                //删除保存的user数据
                storageUtils.removeUser();
                memoryUtils.user = {};
                //console.log("header"+memoryUtils.user)
                //跳转到Login
                message.success('退出成功')
                this.props.history.replace('/login')
            }

        });

    }
    render() {
        const {currentTime, weather, dayPictureUrl} = this.state;
        const username = memoryUtils.user[0].username;

        const title = this.getTitle();
        return(
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.loyout}>
                        <span>退出</span>
                    </LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)