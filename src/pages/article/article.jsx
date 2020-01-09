import React,{Component} from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import ArticleHome from "./articlehome";
import ArticleAddUpdate from "./articleaddupdate";
export default class Article extends Component{
    render() {
        return(
            <Switch>
                <Route path='/article' component={ArticleHome} exact/> {/*路径完全匹配*/}
                <Route path='/article/addupdate' component={ArticleAddUpdate}/>
                <Redirect to='/article'/>
            </Switch>
        )
    }
}