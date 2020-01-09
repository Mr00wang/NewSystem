import React,{Component} from 'react';
import {Table, Card, Button, message, Icon, Modal, Select, Input} from "antd";
import {reqDeleteArticle, reqGetArticls, reqSearchArticle} from "../../api";

const {Option} = Select;
const {Search} = Input;
/*
默认子件文章编辑路由
 */
export default class ArticleHome extends Component{
    state = {
        loading:false,
        articles:[],
    };

    initColumns = () => {
        this.columns = [
            {
                title : "序号",
                dataIndex : "id",
            },
            {
                title : "文章标题",
                dataIndex: "title",
            },
            {
                title : "文章类别",
                dataIndex : "cname",
            },
            {
                title : "发布时间",
                dataIndex : "publishTime",
            },
            {
                title: "修改时间",
                dataIndex: "editTime",
            },
            {
                width:250,
                title:"操作",
                render:(article) => (
                    <span>
                        <Button type="primary" onClick={() => this.props.history.push('/article/addupdate', article)}>修改文章</Button>&nbsp;&nbsp;
                        <Button type="primary" onClick={() => {this.deleteArticle(article)}}>删除文章</Button>&nbsp;&nbsp;
                    </span>
                )
            },
        ]
    };


    /**
     * 获取文章列表
     */
    getArticles = async () => {
        this.setState({loading : true});
        const result = await reqGetArticls();
        this.setState({loading : false});
        if(result.status === "success") {
            const articles = result.data;
            this.setState({
                articles
            })
        }else{
            message.warn("未发布文章");
        }

    };

    /**
     * 删除文章
     * @returns {*}
     */
    deleteArticle = (article) => {
        Modal.confirm({
            title: `确认删除 ${article.title} 吗?`,
            onOk: async () => {
                const result = await reqDeleteArticle(article.id);
                if(result.status=== "success") {
                    message.success(result.msg);
                    this.getArticles();
                }else{
                    message.error(result.msg);
                }
            }
        })
    };
    /**
     * 查询文章
     */
    searchArticle = async (value) => {
        if(value === ''){
            this.getArticles();
        }
        else{
           this.setState({loading : true});
           const result = await reqSearchArticle(value);
           this.setState({loading : false});
           if(result.status === "success") {
               const articles = result.data;
               this.setState({
                   articles
               })
           }else{
               message.warn(result.msg);
           }

        }
    };
    /**
     * 初始化表格标题
     * @returns {*}
     */
    componentWillMount() {
        this.initColumns();
    }

    /**
     * 渲染获取所有文章
     * @returns {*}
     */
    componentDidMount() {
        this.getArticles();
    }


    render() {
        const {loading, articles} = this.state;
        const title = (
            <span>
                {/*<span>文章编辑</span>&nbsp;&nbsp;*/}
                 <Select style={{width:130}} defaultValue="1">
                    <Option value="1">按ID查询</Option>
                    <Option value="2" disabled>按文章题目查询</Option>
                </Select>
                &nbsp;&nbsp;
                <Search
                    placeholder="input search text"
                    onSearch={(value) => {this.searchArticle(value)}}
                    enterButton
                    style={{ width: 200 }}
                />
            </span>

        );
        const extra = (
            <span>
                <Button type="primary" onClick={() => this.props.history.push('/article/addupdate')}>
                    <Icon type="plus"/>
                    <span>添加文章</span>
                </Button>
            </span>
        );

        return(

            <div>
                <Card title={title} extra={extra}>
                    <Table
                        loading={loading}
                        rowKey={'id'}
                        bordered={true}
                        //pagination={{defaultPageSize: 6,showQuickJumper: true}}
                        columns={this.columns}
                        dataSource={articles}
                    />
                </Card>
            </div>
        )
    }
}