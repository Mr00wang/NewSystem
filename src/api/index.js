/*
要求： 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
 */

import ajax from "./ajax";
import jsonp from 'jsonp'
import {message} from 'antd'

const BASE = '';

//获取天气API
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data);
            // 如果成功了
            if (!err && data.status==='success') {
                // 取出需要的数据
                const {dayPictureUrl, weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl, weather})
            } else {
                // 如果失败了
                message.error('获取天气信息失败!')
            }

        })
    })
};
//登陆接口
export const reqLogin = (username, password) => ajax(BASE+'/login', {username, password}, 'POST')

//获取成员列表
export const reqUsers = () => ajax(BASE + '/users');

//添加成员
export const reqAddUser = (username,password) => ajax(BASE+'/user',{username,password},'POST');

//修改成员接口
export const reqUpdateUser = (id,username,password) => ajax(BASE + '/user',{id,username,password},'PUT');

//删除成员
export const reqDeleteUser = (id) => ajax(BASE + `/user/${id}`,{},'DELETE');

//查询成员
export const reqSearchUser = (username) => ajax(BASE + `/search/${username}`);

//获取分类列表接口
export const reqCategory = () => ajax(BASE + '/categories');

//更新分类接口
export const reqUpdateCategory = (cateName,id) => ajax(BASE + '/category',{cateName,id},'PUT');

//删除指定分类接口
export const reqDeleteCategory = (cateName,id) => ajax(BASE + `/category/${cateName}/${id}`,{},'DELETE');

//增加分类接口
export const reqAddCategory = (cateName) => ajax(BASE + '/category',{cateName}, 'POST');

//获取所有文章列表接口
export const reqGetArticls = () => ajax(BASE + '/articles');

//根据分类名称获取文章接口
export const reqGetArticleByCateName = (cname) => ajax(BASE + `/articles/${cname}`);

//删除文章接口
export const reqDeleteArticle = (id) => ajax(BASE + `/article/${id}`,{},'DELETE');

//查询文章接口
export const reqSearchArticle = (id) => ajax(BASE + `/article/${id}`);