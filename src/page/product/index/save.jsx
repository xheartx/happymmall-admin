/*
 * @Author: X.Heart
 * @Date: 2018-06-05 10:52:57
 * @Last Modified by: X.Heart
 * @Last Modified time: 2018-06-07 14:37:52
 * @description: 产品管理
 */

import React, { Component }from 'react';
import { Link } from 'react-router-dom';
import XUtil from 'util/xutil.jsx';
import Product from 'service/product-service.jsx';
import PageTitle from 'component/page-title/index.jsx';
import CategorySelector from './category-selector.jsx';
import FileUploader from 'util/file-uploader/index.jsx';
import RichEditor from 'util/rich-editor/index.jsx';

import './save.scss'

const _util = new XUtil();
const _product = new Product();


class ProductSave extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.pid,
      name: '',
      subtitle: '',
      categoryId: 0,
      parentCategoryId: 0,
      subImages: [],
      price: '',
      stock: '',
      detail: '',
      status: 1  // 商品状态 1 ： 在售
    }
  }
  componentDidMount() {
    this.loadProduct()
  }
  // 加载商品详情
  loadProduct() {
    if (this.state.id) {
      // 有ID表示编辑功能，需要表单回填
      _product.getProduct(this.state.id).then(res => {
        let images = res.subImages.split(',');
        res.subImages = images.map((imgUri) => {
          return {
            uri: imgUri,
            url: res.imageHost + imgUri
          }
        })
        res.defaultDetail = res.detail
        this.setState(res)
      }, errMsg => {
        _util.errorTips(errMsg)
      })
    }
  }
  // 简单字段改变
  onValueChange(e) {
    let name = e.target.name,
        value = e.target.value.trim();
    this.setState({
      [name]: value
    })
  }
  // 品类选择器的变化
  onCategoryChange(categoryId, parentCategoryId) {
    this.setState({
      categoryId,
      parentCategoryId
    })
  }
  // 上传图片成功
  onUploadSuccess(res) {
    let subImages = this.state.subImages;
    subImages.push(res);
    this.setState({
      subImages
    })
  }
  // 上传图片失败
  onUploadError(errMsg) {
    _util.errorTips(errMsg)
  }
  // 删除图片
  onImageDelete(e) {
    let index = parseInt(e.target.getAttribute('index')),
        subImages = this.state.subImages;
    subImages.splice(index, 1);
    this.setState({
      subImages
    })
  }
  // 富文本编辑器变化
  onDetailChange(value) {
    this.setState({
      detail: value
    })
  }
  getSubimagesString() {
    return this.state.subImages.map((image) => image.uri).join(',')
  }
  // 提交表单
  onSubmit() {
    let product = {
      name             : this.state.name,
      subtitle         : this.state.subtitle,
      categoryId       : parseInt(this.state.categoryId),
      parentCategoryId : this.state.parentCategoryId,
      subImages        : this.getSubimagesString(),
      price            : parseFloat(this.state.price),
      stock            : parseInt(this.state.stock),
      detail           : this.state.detail,
      status           : this.state.status,
    },
    productCheckResult = _product.checkProduct(product);
    if (this.state.id) {
      product.id = this.state.id;
    }
    if (productCheckResult.status) {
      // 表单验证成功
      _product.saveProduct(product).then(res => {
        _util.successTips(res)
        this.props.history.push('/product/index')
      }, errMsg => {
        _util.errorTips(saveProduct)
      })
    } else {
      // 表单验证失败
      _util.errorTips(productCheckResult.msg)
    }

  }
  render() {
    return (
      <div id="page-wrapper">
        <PageTitle title="添加商品" />
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-md-2 control-label">商品名称</label>
            <div className="col-md-5">
              <input type="text" 
                     className="form-control" 
                     placeholder="请输入商品名称"
                     name="name"
                     value={this.state.name}
                     onChange={this.onValueChange.bind(this)} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品描述</label>
            <div className="col-md-5">
              <input type="text" 
                     className="form-control" 
                     placeholder="请输入商品描述"
                     name="subtitle"
                     value={this.state.subtitle}
                     onChange={this.onValueChange.bind(this)} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">所属分类</label>
            <CategorySelector categoryId={this.state.categoryId}
              parentCategoryId={this.state.parentCategoryId}
              onCategoryChange={this.onCategoryChange.bind(this)}/>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品价格</label>
            <div className="col-md-3">
              <div className="input-group">
                <input type="number" 
                       className="form-control" 
                       placeholder="价格"
                       name="price"
                       value={this.state.price}
                       onChange={this.onValueChange.bind(this)} />
                <span className="input-group-addon">元</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品库存</label>
            <div className="col-md-3">
              <div className="input-group">
                <input type="number" 
                       className="form-control" 
                       placeholder="库存"
                       name="stock"
                       value={this.state.stock}
                       onChange={this.onValueChange.bind(this)} />
                <span className="input-group-addon">件</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品图片</label>
            <div className="col-md-10 file-upload-images">
            {
              this.state.subImages.length ? this.state.subImages.map((image, index) => (
                <div className="img-con" key={image.uri}>
                  <img src={image.url} alt=""/>
                  <i className="fa fa-close" index={index} onClick={this.onImageDelete.bind(this)}></i>
                </div>
              )) : (<div>请上传图片</div>)
            }
            </div>
            <div className="col-md-10 col-md-offset-2 file-upload-con">
              <FileUploader onSuccess={this.onUploadSuccess.bind(this)}
                            onError={this.onUploadError.bind(this)} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品详情</label>
            <div className="col-md-10">
              <RichEditor detail={this.state.detail}
                          defaultDetail={this.state.defaultDetail}
                          onValueChange={this.onDetailChange.bind(this)}/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-offset-2 col-md-10">
              <button type="submit" 
                      className="btn btn-primary"
                      onClick={this.onSubmit.bind(this)}>提交</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductSave