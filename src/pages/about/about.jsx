import React,{Component} from 'react';
import {Carousel, Card} from "antd";
import "./about.less"
 // import img1 from "./image/carousel1.jpg"
import img1 from "./image/1.1.jpg"

import img2 from "./image/carousel6.jpg"

import img3 from "./image/3.1.jpg"
import img4 from "./image/carousel4.jpg"
// import img5 from "./image/carousel5.jpg"


/*
关于我们路由
 */
export default class About extends Component{
    render() {
        return(
            <div>
                <Card>
                    <Carousel autoplay>
                        <div>
                            <img src={img1} alt="未加载"/>
                        </div>
                        <div>
                            <img src={img2} alt="未加载"/>
                        </div>
                        <div>
                            <img src={img3} alt="未加载"/>
                        </div>
                        <div>
                            <img src={img4} alt="未加载"/>
                        </div>
                    </Carousel>,
                </Card>
            </div>
        )
    }
}