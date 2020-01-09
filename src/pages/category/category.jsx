import React,{Component} from 'react';
import {Card, Button, Table, Icon, message, Modal} from "antd";
import LinkButton from "../../components/link-button";
import {
    reqCategory,
    reqDeleteCategory,
    reqUpdateCategory,
    reqAddCategory,
    reqGetArticleByCateName,
    reqDeleteArticle
} from "../../api";
import AddForm from "../category/addform";
import UpdateForm from "../category/updateform"
/*
首页路由
 */
export default class Category extends Component{
    state = {
        loading:false,
        categories:[],   //分类数组
        articles: [],   //文章数组
        cateNames: "",
        showStatus: 0,
    };
    /**
     * 表格标题
     */
    initColumns = () => {
      this.columns = [
          {
              title:'序号',
              dataIndex: "id",
          },
          {
              title:"名称",
              dataIndex: "cateName",
          },
          {
              width:350,
              title:"操作",
              render:(category) => (
                  <span>
                      <Button type="primary" onClick={() => {this.showArticle(category)}}>查看详情</Button>&nbsp;&nbsp;
                      <Button type="primary" onClick={() => {this.showUpdate(category)}}>修改分类</Button>&nbsp;&nbsp;
                      <Button type="primary" onClick={() => {this.deleteCategory(category)}}>删除分类</Button>&nbsp;&nbsp;
                  </span>
              )
          },
      ];
      this.columns1 = [
          {
              title:'序号',
              dataIndex: "id",
          },
          {
              title:"题目",
              dataIndex: "title",
          },
          {
              title:"发布时间",
              dataIndex:"publishTime",
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
                      <Button type="primary" onClick={() => {}}>查看详情</Button>&nbsp;&nbsp;
                      <Button type="primary" onClick={() => {this.deleteArticle(article)}}>删除文章</Button>&nbsp;&nbsp;
                  </span>
              )
          },
      ]
    };

    /**
     * 第一次加载表格标题
     * @returns {*}
     */
    componentWillMount() {
        this.initColumns()
    }

    /**
     *获取分类列表
     */
    getCategories = async () => {
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
    /**
     * 第一次异步加载分类列表
     * @returns {*}
     */
    componentDidMount() {
        this.getCategories()
    }

    /**
     * 获取该分类 的所有文章
     */
    showArticle = (category) => {

        this.setState({
            cateNames: category.cateName
            },() => { // 在状态更新且重新render()后执行
                //console.log(user)
                console.log(category);
                console.log("cateNames : "+this.state.cateNames);
                this.getArticle(category);
            }
        )
    };

    /**
     * 获取该分类 的所有文章
     */
    getArticle = async (category) => {
        this.setState({loading: true});
        const result = await reqGetArticleByCateName(category.cateName);
        this.setState({loading: false});
        if(result.status === "success") {
            const articles = result.data;
            console.log(articles);
            this.setState({
                articles
            })
        }else{
            message.warn("还未此类添加文章！")
        }
    };
    UpdateArticle = () => {
        //更新为显示一级列表的状态
        this.setState({
            cateNames: '',
            articles:[]
        })
    };
    /**
     * 隐藏对话框
     */
    handleCancel = () => {
        // 清除输入数据
        this.form.resetFields();
        // 隐藏确认框
        this.setState({
            showStatus: 0
        })
    };
    /**
     * 显示修改的确认框
     */
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category;
        // 更新状态
        this.setState({
            showStatus: 2
        })
    };

    /**
     * 更新分类对话框
     * @returns {*}
     */
    updateCategory = () => {
        this.form.validateFields(async (err,values) => {
            if(!err) {
                //1,隐藏确定框
                this.setState({
                    showStatus: 0
                });
                //准备数据
                const {cateName} = values;
                const id = this.category.id;
                //清除
                this.form.resetFields();
                const result = await reqUpdateCategory(cateName,id);
                if(result.status === "success"){
                    message.success(result.msg);
                    this.getCategories()
                }else{
                    message.error(result.msg);
                }
            }
        })
    };

    /**
     * 删除分类
     * @returns {*}
     */
    deleteCategory = (category) => {
        Modal.confirm({
            title: `确认删除 ${category.cateName} 吗?`,
            onOk: async () => {
                const result = await reqDeleteCategory(category.cateName,category.id);
                if(result.status=== "success") {
                    message.success(result.msg);
                    this.getCategories();
                }else{
                    message.error(result.msg);
                }
            }
        })
    };

    /*
显示人员添加的确认框
 */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    };

    /*
    添加成员请求
     */
    addCategory = () => {
        this.form.validateFields(async (err,values) => {
            if(!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                });
                //准备数据
                const {cateName} = values;
                //清除
                this.form.resetFields();
                const result = await reqAddCategory(cateName);
                if(result.status === "success"){
                    this.getCategories();
                    message.success("添加成功");
                }else{
                    message.error(result.msg);
                }
            }
        })
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

    render() {
        const {categories, articles, loading, showStatus, cateNames} = this.state;
        console.log(cateNames);
        const category = this.category || {};

        const title = cateNames === "" ? '文章分类列表' : (
            <span>
                <LinkButton onClick={() => {this.UpdateArticle()}}>文章分类列表</LinkButton>
                <Icon type="arrow-right" style={{marginRight: 5}}/>
                <span>{cateNames}</span>
            </span>
        );

        const extra = cateNames === "" ? (
            <Button type="primary" onClick={this.showAdd}>
                <Icon type="plus"/>
                添加分类
            </Button>
        ) : "";
        return(
            <Card title={title} extra={extra}>
                <Table
                    loading={loading}
                    rowKey={cateNames === "" ? 'id' : 'id'}
                    bordered={true}
                    pagination={{defaultPageSize: 6,showQuickJumper: true}}
                    columns={cateNames === "" ? this.columns : this.columns1}
                    dataSource={cateNames === "" ? categories : articles}
                />

                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        cateName={category.cateName}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
            </Card>
        )
    }
}