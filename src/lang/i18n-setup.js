
import Vue from 'vue';
import Cookies from 'js-cookie';
import VueI18n from 'vue-i18n';
import ElementLocal from 'element-ui/lib/locale'
Vue.use(VueI18n); // 实例化

// 浏览器默认语言
let SYS_LANG = navigator.language || navigator.userLanguage;
// 兼容zh-cn模式
SYS_LANG = SYS_LANG.toLowerCase().split('-')[1] ? SYS_LANG.toLowerCase().split('-')[0] + '-' + SYS_LANG.toUpperCase().split('-')[1] : SYS_LANG;

// 当前支持的语言
const SUPPORT_LANGUAGE = ['zh-CN', 'en-GB'];
// Cookies 里保存的语言
const COOKIES_LANG = !Cookies.get('my_language') || Cookies.get('my_language') == 'undefined' ? '' : Cookies.get('my_language');
// URL 里设置的语言,例如: www.aex.cash/page/xxx.html#/?lang=zh
const LINK_LANG = location.hash.indexOf('my-lang') != -1 ? location.hash.split('?')[1].split('my-lang')[1].split('=')[1].split('&')[0] : '';
// 上述所有的 语言参数 都为空值的话，则需要提供一个默认的语言。（英语。20210812 确定）
const DEFAULT_LANGUAGE = 'en-GB';
// 当前语言环境, 优先级:  url参数设置的 > Cookie保存的 > 浏览器默认的
// 输出这个参数, 可以在项目entry 入口文件处获取当前语言环境, .vue 文件内部就不用这个了(用 this.$i18n.locale 来获取即可)
let CURRENT_LANG = LINK_LANG || COOKIES_LANG || SYS_LANG || DEFAULT_LANGUAGE;
// 兼容之前的链接方式
CURRENT_LANG = CURRENT_LANG == 'en' ? 'en-GB' : CURRENT_LANG;
CURRENT_LANG = CURRENT_LANG == 'zh' ? 'zh-CN' : CURRENT_LANG;
// 实例化 i18n
export const i18n = new VueI18n({
	locale: CURRENT_LANG, // 设置当前语言环境
	fallbackLocale: DEFAULT_LANGUAGE, // 回滚设置
	messages: {}, // 设置语言环境包
	silentTranslationWarn: true
});

ElementLocal.i18n((key, value) => i18n.t(key, value)); // 兼容 aex-ui i18n函数

// 改变语言环境
function setI18nLanguage(lang) {
	Cookies.set('my_language', lang, {
		expires: 7,
		path: '/'
	}); // 添加到cookie
	i18n.locale = lang; // 切换语言环境
	document.querySelector('html').setAttribute('lang', lang); // html 加lang 备用
	document.querySelector('body').setAttribute('id', lang == 'zh-CN' ? 'zh-CN' : 'en-GB'); // 给body 加id 现在代码里有用到
	return lang;
}
// 更新本地缓存，并返回对应的语言包
const updataLocalStorage = (lang, langMessage) => {
	// 如果有传入语言包, 就直接更新 localStorage，这里就是针对后端请求有返回，就保存
	if (!!langMessage) {
		localStorage.setItem(lang, JSON.stringify(langMessage));
		return Promise.resolve(langMessage);
    }
    // 如果本地不存在语言
    if (!localStorage.getItem(lang)) {
        return import(`@/lang/locale/${lang}.json`).then((messages) => {
            localStorage.setItem(lang, JSON.stringify(messages));
			return messages
        })
    }
    // 如果本地存在
	return Promise.resolve(JSON.parse(localStorage.getItem(lang)));
};
// 异步加载语言包
export async function loadLanguageAsync(_lang, message) {
	// 语言环境优先级: 需要设置的 > url参数设置的 > Cookie保存的 > 浏览器默认的
	let lang = _lang || CURRENT_LANG;
	lang = SUPPORT_LANGUAGE.includes(lang) ? lang : DEFAULT_LANGUAGE; // 还没有支持的语言就直接用默认的语言
	// updateMetaInfo(lang); // 更新 html页面的 meta信息

    const langMessage = await updataLocalStorage(lang, message); // 先获取本地缓存直接使用，后面再根据后端的请求是否要更新
    console.log(langMessage)
	i18n.setLocaleMessage(lang, Object.assign({}, langMessage));
	return setI18nLanguage(lang);
}

i18n.loadLanguageAsync = loadLanguageAsync;