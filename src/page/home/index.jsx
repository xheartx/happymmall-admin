/*
 * @Author: X.Heart
 * @Date: 2018-06-04 10:21:14
 * @Last Modified by: X.Heart
 * @Last Modified time: 2018-06-07 14:56:39
 * @description: Home
 */
import React, { Component }from 'react'
import { Link } from 'react-router-dom'
import XUtil from 'util/xutil.jsx'
import Statistic from 'service/statistic-service.jsx'

const _util = new XUtil();
const _statistic = new Statistic();

import './index.scss'
import PageTitle from 'component/page-title/index.jsx'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userCount: '-',
      productCount: '-',
      orderCount: '-',
    }
  }
  componentDidMount() {
    this.loadCount()
  }
  loadCount() {
    _statistic.getHomeCount().then(res => {
      this.setState(res)
    }, errMsg => {
      _util.errorTips(errMsg)
    })
  }
  render() {
    return(
      <div id="page-wrapper">
        <PageTitle title="首页" />
        <div className="row">
          <div className="col-md-4">
            <Link to="/user" className="color-box brown">
              <p className="count">{this.state.userCount}</p>
              <p className="desc">
                <i className="fa fa-user-o"></i>
                <span>用户总数</span>
              </p>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/product" className="color-box green">
              <p className="count">{this.state.productCount}</p>
              <p className="desc">
                <i className="fa fa-list"></i>
                <span>商品总数</span>
              </p>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/order" className="color-box blue">
              <p className="count">{this.state.orderCount}</p>
              <p className="desc">
                <i className="fa fa-check-square-o"></i>
                <span>订单总数</span>
              </p>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home