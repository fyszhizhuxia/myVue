<template>
  <div>
    <h1>{{ $t("lang.mypage.t1") }}</h1>
    <div class="info">
      <span class="left">{{ $t("lang.mypage.t2") }}</span>
      <span class="left">{{ $t("lang.mypage.t3") }}</span>
    </div>
    <el-select
      v-model="language"
      :placeholder="$t('lang.mypage.t5')"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-button type="primary" @click="changeWord">{{
      $t("lang.mypage.t4")
    }}</el-button>
    <div style="margin-top:20px">
      <span v-for="(item, index) in hobbys" :key="index" class="item">{{
        item
      }}</span>
    </div>
    <el-date-picker
      v-model="value"
      type="date"
      :placeholder="$t('lang.mypage.t7')"
    >
    </el-date-picker>
    {{ this.agess }}
    <div style="margin-top:50px">
      <svg width="200" height="50" class="svg">
        <polygon
          :fill="num < 0 ? 'url(#LinearGradien)' : 'url(#LinearGradien1)'"
          :points="
            klinegon(
              '10, 20,18, 6, 20, 44, 12, 9,49, 20, 18, 6, 20, 0, 29, 34, 20, 0, 12, 9,10, 20, 18, 26'
            )
          "
        ></polygon>
        <polyline
          fill="none"
          :points="
            kline(
              '10, 20,18, 6, 20, 44, 12, 9,49, 20, 18, 6, 20, 0, 29, 34, 20, 0, 12, 9,10, 20, 18, 26'
            )
          "
          :stroke="num < 0 ? '#3AB293' : '#E5575A'"
          stroke-width="1"
          stroke-linecap="square"
          ref="btc"
        ></polyline>
        <defs>
          <linearGradient id="LinearGradien">
            <stop offset="0" stop-color="rgba(58,178,147,0.4)" />
            <stop offset="1" stop-color="rgba(58,178,147,0)" />
          </linearGradient>

          <linearGradient id="LinearGradien1">
            <stop offset="0" stop-color="rgba(229,87,90,0.4)" />
            <stop offset="1" stop-color="rgba(229,87,90,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <input type="text" v-model="test" @input="goInput('圆圆', '滚滚')" />
  </div>
</template>

<script>
import { getMyhobby } from "../api/mypage";
import Cookies from "js-cookie";
const path = require("path");
import { mapActions, mapState } from "vuex";
const debounce = (fn, delay = 500) => {
  let timeout;
  return function() {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      // fn.apply(this, ...arguments);
      // fn.bind(this, ...arguments)();
      fn.call(this, ...arguments);
    }, delay);
  };
};
const throttle = (fn, wait = 500, type) => {
  if (type === 1) {
    var previous = 0;
  } else if (type === 2) {
    var timeout;
  }
  return function() {
    let args = arguments;
    if (type === 1) {
      let now = Date.now();
      if (now - previous > wait) {
        fn.bind(this, ...args)();
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          fn.bind(this, ...args)();
        }, wait);
      }
    }
  };
};
export default {
  name: "myComponents",
  created() {
    this.addNum();
    this.hobby();
    console.log(this.$i18n.locale, "语言包");
  },
  computed: {
    ...mapState({
      agess: state => state.currentPage.agess
    })
  },
  data() {
    return {
      test: "请输入",
      num: -2,
      msg: "一瓶人间小样",
      intro: "一句话简介不了我",
      word: "来过什么话都没有留下",
      language: "",
      options: [
        {
          value: "zh-CN",
          label: "中文"
        },
        {
          value: "en-GB",
          label: "English"
        }
      ],
      hobbys: [],
      value: "",
      allNum: 0
    };
  },
  mounted() {
    this.$store.commit("currentPage/setMyInfos", {
      name: "一瓶人间小样",
      age: 20
    });
  },
  methods: {
    goInput: throttle(
      (a, b) => {
        console.log(a + b + "节流"); // 圆圆滚滚防抖
      },
      1000,
      1
    ),
    async change(val) {
      if (this.$i18n.locale === val) return;
      await this.$i18n.loadLanguageAsync(val);
    },
    changeWord() {
      this.$message({
        showClose: true,
        message: this.$t("lang.mypage.t6")
      });
      return;
    },
    addNum() {
      this.allNum += 2;
      this.allNum += 8;
      this.allNum += 10;
    },
    // 获取我的兴趣爱好
    async hobby() {
      try {
        let data = { page: 0 };
        const result = await getMyhobby(data);
        this.hobbys = result.data.data;
      } catch (error) {}
    },
    //获取走势图
    kline(val) {
      let valarr = val.split(",");
      let max = Math.max(...valarr);
      let min = Math.min(...valarr);
      let equal = (max - min) / (valarr.length - 1);
      let arr = [];
      for (let i = 0; i < valarr.length; i++) {
        let x = (200 / valarr.length) * i;
        let y = (max - valarr[i]) / equal;
        arr.push(x);
        arr.push(y);
      }
      //   console.log(arr.toString().replace(/,/g, " "));
      if (!isNaN(arr[0]) && !isNaN(arr[1])) {
        return arr.toString().replace(/,/g, " ");
      } else {
        return "0,0";
      }
    },
    klinegon(val) {
      let valarr = val.split(",");
      let max = Math.max(...valarr);
      let min = Math.min(...valarr);
      let equal = (max - min) / (valarr.length - 1);
      let arr = [];
      for (let i = 0; i < valarr.length; i++) {
        let x = (200 / valarr.length) * i;
        let y = (max - valarr[i]) / equal;
        arr.push(x);
        arr.push(y);
      }
      arr.unshift(50);
      arr.unshift(0);
      arr.push(200);
      arr.push(50);
      //   console.log(arr.toString().replace(/,/g, " "));
      return arr.toString().replace(/,/g, " ");
    }
  }
};
</script>

<style lang="less" scoped>
.info {
  color: pink;
  display: flex;
  justify-content: center;
  align-items: center;
  .left {
    margin-right: 30px;
  }
}
.item {
  color: yellowgreen;
  margin-right: 10px;
}
// svg {
//   stroke: #000;
//   stroke-width: 5;
//   stroke-linecap: round;
//   stroke-linejoin: round;
//   fill: none;
// }
</style>
