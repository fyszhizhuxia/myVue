import axios from 'axios'; // 引入axios
import Qs from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到

 // 请求超时时间
// axios.defaults.timeout = TIME_OUT

// 切换环境
// if (process.env.NODE_ENV == 'development') {    
//     axios.defaults.baseURL = 'https://www.development.com'
// }else if (process.env.NODE_ENV == 'test') {    
//     axios.defaults.baseURL = 'https://www.test.com';
// }else if (process.env.NODE_ENV == 'production') {    
//     axios.defaults.baseURL = 'https://www.production.com';
// }
const server = axios.create({
	baseURL: '/',
    headers: {
        //一些基本信息，可以在这里添加
		// 'X-RequestID': `${new Date().getTime()}-${randomString(6, 'abcdefghijklmnopqrstuvwxyz')}`,
		// 'X-Device': `${os.Browser} ${os.BrowserVersion}`,
		// 'X-Platform': `${os.OS},${os.OSVersion}`,
		// 'X-Client': `${os.deviceType},1.0.0`,
		// 'X-Language': `${i18n.locale}`,
		// 'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 10000,  // 请求超时时间10s
	transformRequest: function (data, header) {
		if (typeof data == 'object') {
			return Qs.stringify(data); //formateParams(data)
		}
		return data;
	}
});
console.log(server,'创建的axios')
// post请求，需要添加一个请求头(告诉服务器是表单格式)两种，向服务端传输时的编码方式
// application/json;charset=UTF-8
// application/x-www-form-urlencoded;charset=UTF-8
server.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

 // 封装请求拦截(发送之前进行一个拦截，进行我们想要的操作)
 //有些请求是需要用户登录之后才能访问的，或者post请求的时候，我们需要序列化我们提交的数据
 server.interceptors.request.use(
     config => {
          let token = localStorage.getItem('token')   // 获取token，也可以让后端存到Cookie中
         let method = config.method
         let datas;
         method=='post'?(datas=config.data||{}):(datas=config.params||{})
     
        config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        config.headers['Authorization'] = ''
        if(token != null){                          // 如果token不为null，否则传token给后台
            config.headers['Authorization'] = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
// 响应拦截器
server.interceptors.response.use(    
    response => {   
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
        // 否则的话抛出错误
        if (response.status === 200) {            
            return Promise.resolve(response);        
        } else {            
            return Promise.reject(response);        
        }    
    },    
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码    
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {            
        if (error.response.status) {            
            switch (error.response.status) {                
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                case 401:                    
                    router.replace({                        
                        path: '/login',                        
                        query: { 
                            redirect: router.currentRoute.fullPath 
                        }
                    });
                    break;

                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面                
                case 403:
                     Toast({
                        message: '登录过期，请重新登录',
                        duration: 1000,
                        forbidClick: true
                    });
                    // 清除token
                    localStorage.removeItem('token');
                    store.commit('loginSuccess', null);
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
                    setTimeout(() => {                        
                        router.replace({                            
                            path: '/login',                            
                            query: { 
                                redirect: router.currentRoute.fullPath 
                            }                        
                        });                    
                    }, 1000);                    
                    break; 

                // 404请求不存在
                case 404:
                    Toast({
                        message: '网络请求不存在',
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Toast({
                        message: error.response.data.message,
                        duration: 1500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        }
    }    
)
export default server;
