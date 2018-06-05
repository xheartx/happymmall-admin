/*
 * @Author: X.Heart
 * @Date: 2018-06-04 14:20:10
 * @Last Modified by: X.Heart
 * @Last Modified time: 2018-06-04 16:41:38
 * @description: 工具
 */

class XUtil{
    request(param) {
      return new Promise((resolve, reject) => {
        $.ajax({
          type:     param.type     || 'get',
          url:      param.url      || '',
          dataType: param.dataType || 'json',
          data:     param.data     || null,
          success: (res) => {
            // 数据请求成功
            if (res.status === 0) {
              typeof resolve === 'function' && resolve(res.data, res.msg);
            } else if (res.status === 10) {
              // 未登录
              this.doLogin()
            } else {
              typeof reject === 'function' && reject(res.msg ||  res.data);
            }
          },
          error: (err) => {
            typeof reject === 'function' && reject(err.statusText);
          }
        })
      })
    }
    //跳转登录
    doLogin() {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    }
    // 获取url参数
    getUrlParam(name) {
      let queryString = window.location.search.split('?')[1] || '',
          reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
          result = queryString.match(reg)
      return result ? decodeURIComponent(result[2]) : null

    }
    // 错误提示
    errorTips(errMsg) {
      alert(errMsg || '好像哪里不对了')
    }
    // 存储 LoceStorage 
    setStorage(name, data) {
      let dataType = typeof data;
      if (dataType === 'object') {
        // json 对象
        window.localStorage.setItem(name, JSON.stringify(data))
      } else if(['number', 'string', 'boolean'].indexOf(dataType) >= 0) {
        // 基础类型
        window.localStorage.setItem(name, data)
      } else {
        alert('该类型不能用于本地存储')
      }
    }
    // 获取 LoceStorage 
    getStorage(name) {
      let data = window.localStorage.getItem(name)
      if (data) {
        return JSON.parse(data)
      } else {
        return ''
      }
    }
    // 删除 LoceStorage
    removeStorage(name) {
      window.localStorage.removeItem(name)
    }
}

export default XUtil;