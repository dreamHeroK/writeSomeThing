
class Axios {
    constructor() {
        this.interceptors = {
            request: new InterceptorsManage(),
            response: new InterceptorsManage()
        }
    }

    request(config) {
        // ��������������װ����
        let chain = [this.sendAjax.bind(this), undefined] // �ɶԳ��ֵģ�ʧ�ܻص���ʱ������

        // ��������
        this.interceptors.request.handlers.forEach(interceptor => {
            chain.unshift(interceptor.fullfield, interceptor.rejected)
        })

        // ��Ӧ����
        this.interceptors.response.handlers.forEach(interceptor => {
            chain.push(interceptor.fullfield, interceptor.rejected)
        })

        // ִ�ж��У�ÿ��ִ��һ�ԣ�����promise�����µ�ֵ
        let promise = Promise.resolve(config);
        while (chain.length > 0) {
            promise = promise.then(chain.shift(), chain.shift())
        }
        return promise;
    }

    sendAjax(config) {
        return new Promise(resolve => {
            const { url = '', method = 'get', data = {} } = config;
            // ����ajax����
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
        console.log('ִ��' + method + '����');
        if (['get', 'delete', 'head', 'options'].includes(met)) { // 2������(url[, config])
            return this.request({
                method: met,
                url: arguments[0],
                ...arguments[1] || {}
            })
        } else { // 3������(url[,data[,config]])
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
