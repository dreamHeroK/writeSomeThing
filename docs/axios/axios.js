
class Axios {
    constructor() {
        this.interceptors = {
            request: new InterceptorsManage(),
            response: new InterceptorsManage()
        }
    }

    request(config) {
        // 拦截器和请求组装队列
        let chain = [this.sendAjax.bind(this), undefined] // 成对出现的，失败回调暂时不处理

        // 请求拦截
        this.interceptors.request.handlers.forEach(interceptor => {
            chain.unshift(interceptor.fullfield, interceptor.rejected)
        })

        // 响应拦截
        this.interceptors.response.handlers.forEach(interceptor => {
            chain.push(interceptor.fullfield, interceptor.rejected)
        })

        // 执行队列，每次执行一对，并给promise赋最新的值
        let promise = Promise.resolve(config);
        while (chain.length > 0) {
            promise = promise.then(chain.shift(), chain.shift())
        }
        return promise;
    }

    sendAjax(config) {
        return new Promise(resolve => {
            const { url = '', method = 'get', data = {} } = config;
            // 发送ajax请求
            console.log(config);
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.onload = function () {
                console.log(xhr.responseText)
                resolve(xhr.responseText);
            };
            xhr.send(data);
        })
    }

}
function creatAxiosIns() {
    let axios = new Axios()
    let req = axios.request.bind(axios)
    utils.extend(req, Axios.prototype, axios)
    utils.extend(req, axios)
    return req
}

const methodsArr = ['get', 'delete', 'head', 'options', 'put', 'patch', 'post'];
methodsArr.forEach(method => {
    Axios.prototype[method] = function () {
        console.log('执行' + method + '方法');
        if (['get', 'delete', 'head', 'options'].includes(met)) { // 2个参数(url[, config])
            return this.request({
                method: met,
                url: arguments[0],
                ...arguments[1] || {}
            })
        } else { // 3个参数(url[,data[,config]])
            return this.request({
                method: met,
                url: arguments[0],
                data: arguments[1] || {},
                ...arguments[2] || {}
            })
        }
    }
})

const utils = {
    extend(a, b, context) {
        for (let key in b) {
            if (b.hasOwnProperty(key)) {
                if (typeof b[key] === 'function') {
                    a[key] = b[key].bind(context);
                } else {
                    a[key] = b[key]
                }
            }

        }
    }
}

class InterceptorsManage {
    constructor() {
        this.handlers = [];
    }

    use(fullfield, rejected) {
        this.handlers.push({
            fullfield,
            rejected
        })
    }
}
let request = creatAxiosIns()
request({ method: 'get', url: 'localhost:3000' }).then(res => {
    console.log(res, 'res')
})
