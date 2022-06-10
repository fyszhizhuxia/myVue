import request from '../utils/http'
// post请求
// export function addLikes(data) {
//     return request({
//         method: 'post',
//         url: '/v2/aboutUs/like.php',
//         data
//     })
// }
// get请求
export function getMyhobby(params) {
    return request({
        method: 'get',
        url: '/user/myhobby.php',
        params
    })
}