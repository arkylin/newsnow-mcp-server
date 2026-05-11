#!/usr/bin/env node
import process from 'process';
import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { $fetch } from 'ofetch';
import { config } from 'dotenv';

// package.json
var package_default = {
  version: "0.0.11"};

// src/sources.json
var sources_default = {
  v2ex: {
    redirect: "v2ex-share",
    name: "V2EX",
    column: "tech",
    home: "https://v2ex.com/",
    color: "slate",
    interval: 6e5,
    title: "\u6700\u65B0\u5206\u4EAB"
  },
  "v2ex-share": {
    name: "V2EX",
    column: "tech",
    home: "https://v2ex.com/",
    color: "slate",
    interval: 6e5,
    title: "\u6700\u65B0\u5206\u4EAB"
  },
  zhihu: {
    name: "\u77E5\u4E4E",
    type: "hottest",
    column: "china",
    home: "https://www.zhihu.com",
    color: "blue",
    interval: 6e5
  },
  weibo: {
    title: "\u5B9E\u65F6\u70ED\u641C",
    name: "\u5FAE\u535A",
    type: "hottest",
    column: "china",
    home: "https://weibo.com",
    color: "red",
    interval: 12e4
  },
  zaobao: {
    name: "\u8054\u5408\u65E9\u62A5",
    type: "realtime",
    desc: "\u6765\u81EA\u7B2C\u4E09\u65B9\u7F51\u7AD9: \u65E9\u6668\u62A5",
    column: "world",
    home: "https://www.zaobao.com",
    color: "red",
    interval: 18e5
  },
  coolapk: {
    title: "\u4ECA\u65E5\u6700\u70ED",
    name: "\u9177\u5B89",
    type: "hottest",
    column: "tech",
    home: "https://coolapk.com",
    color: "green",
    interval: 6e5
  },
  mktnews: {
    redirect: "mktnews-flash",
    name: "MKTNews",
    column: "finance",
    home: "https://mktnews.net",
    color: "indigo",
    interval: 12e4,
    title: "\u5FEB\u8BAF"
  },
  "mktnews-flash": {
    name: "MKTNews",
    column: "finance",
    home: "https://mktnews.net",
    color: "indigo",
    interval: 12e4,
    title: "\u5FEB\u8BAF"
  },
  wallstreetcn: {
    redirect: "wallstreetcn-quick",
    name: "\u534E\u5C14\u8857\u89C1\u95FB",
    type: "realtime",
    column: "finance",
    home: "https://wallstreetcn.com/",
    color: "blue",
    interval: 3e5,
    title: "\u5FEB\u8BAF"
  },
  "wallstreetcn-quick": {
    name: "\u534E\u5C14\u8857\u89C1\u95FB",
    type: "realtime",
    column: "finance",
    home: "https://wallstreetcn.com/",
    color: "blue",
    interval: 3e5,
    title: "\u5FEB\u8BAF"
  },
  "wallstreetcn-news": {
    name: "\u534E\u5C14\u8857\u89C1\u95FB",
    column: "finance",
    home: "https://wallstreetcn.com/",
    color: "blue",
    interval: 18e5,
    title: "\u6700\u65B0"
  },
  "wallstreetcn-hot": {
    name: "\u534E\u5C14\u8857\u89C1\u95FB",
    type: "hottest",
    column: "finance",
    home: "https://wallstreetcn.com/",
    color: "blue",
    interval: 18e5,
    title: "\u6700\u70ED"
  },
  "36kr": {
    redirect: "36kr-quick",
    name: "36\u6C2A",
    type: "realtime",
    column: "tech",
    home: "https://36kr.com",
    color: "blue",
    interval: 6e5,
    title: "\u5FEB\u8BAF"
  },
  "36kr-quick": {
    name: "36\u6C2A",
    type: "realtime",
    column: "tech",
    home: "https://36kr.com",
    color: "blue",
    interval: 6e5,
    title: "\u5FEB\u8BAF"
  },
  "36kr-renqi": {
    name: "36\u6C2A",
    type: "hottest",
    column: "tech",
    home: "https://36kr.com",
    color: "blue",
    interval: 6e5,
    title: "\u4EBA\u6C14\u699C"
  },
  douyin: {
    name: "\u6296\u97F3",
    type: "hottest",
    column: "china",
    home: "https://www.douyin.com",
    color: "gray",
    interval: 6e5
  },
  hupu: {
    title: "\u4E3B\u5E72\u9053\u70ED\u5E16",
    name: "\u864E\u6251",
    type: "hottest",
    column: "china",
    home: "https://hupu.com",
    color: "red",
    interval: 6e5
  },
  tieba: {
    title: "\u70ED\u8BAE",
    name: "\u767E\u5EA6\u8D34\u5427",
    type: "hottest",
    column: "china",
    home: "https://tieba.baidu.com",
    color: "blue",
    interval: 6e5
  },
  toutiao: {
    name: "\u4ECA\u65E5\u5934\u6761",
    type: "hottest",
    column: "china",
    home: "https://www.toutiao.com",
    color: "red",
    interval: 6e5
  },
  ithome: {
    name: "IT\u4E4B\u5BB6",
    type: "realtime",
    column: "tech",
    home: "https://www.ithome.com",
    color: "red",
    interval: 6e5
  },
  thepaper: {
    title: "\u70ED\u699C",
    name: "\u6F8E\u6E43\u65B0\u95FB",
    type: "hottest",
    column: "china",
    home: "https://www.thepaper.cn",
    color: "gray",
    interval: 18e5
  },
  sputniknewscn: {
    name: "\u536B\u661F\u901A\u8BAF\u793E",
    column: "world",
    home: "https://sputniknews.cn",
    color: "orange",
    interval: 6e5
  },
  cankaoxiaoxi: {
    name: "\u53C2\u8003\u6D88\u606F",
    column: "world",
    home: "https://china.cankaoxiaoxi.com",
    color: "red",
    interval: 18e5
  },
  pcbeta: {
    redirect: "pcbeta-windows11",
    name: "\u8FDC\u666F\u8BBA\u575B",
    type: "realtime",
    column: "tech",
    home: "https://bbs.pcbeta.com",
    color: "blue",
    interval: 3e5,
    title: "Win11"
  },
  "pcbeta-windows11": {
    name: "\u8FDC\u666F\u8BBA\u575B",
    type: "realtime",
    column: "tech",
    home: "https://bbs.pcbeta.com",
    color: "blue",
    interval: 3e5,
    title: "Win11"
  },
  cls: {
    redirect: "cls-telegraph",
    name: "\u8D22\u8054\u793E",
    type: "realtime",
    column: "finance",
    home: "https://www.cls.cn",
    color: "red",
    interval: 3e5,
    title: "\u7535\u62A5"
  },
  "cls-telegraph": {
    name: "\u8D22\u8054\u793E",
    type: "realtime",
    column: "finance",
    home: "https://www.cls.cn",
    color: "red",
    interval: 3e5,
    title: "\u7535\u62A5"
  },
  "cls-depth": {
    name: "\u8D22\u8054\u793E",
    column: "finance",
    home: "https://www.cls.cn",
    color: "red",
    interval: 6e5,
    title: "\u6DF1\u5EA6"
  },
  "cls-hot": {
    name: "\u8D22\u8054\u793E",
    type: "hottest",
    column: "finance",
    home: "https://www.cls.cn",
    color: "red",
    interval: 6e5,
    title: "\u70ED\u95E8"
  },
  xueqiu: {
    redirect: "xueqiu-hotstock",
    name: "\u96EA\u7403",
    type: "hottest",
    column: "finance",
    home: "https://xueqiu.com",
    color: "blue",
    interval: 12e4,
    title: "\u70ED\u95E8\u80A1\u7968"
  },
  "xueqiu-hotstock": {
    name: "\u96EA\u7403",
    type: "hottest",
    column: "finance",
    home: "https://xueqiu.com",
    color: "blue",
    interval: 12e4,
    title: "\u70ED\u95E8\u80A1\u7968"
  },
  gelonghui: {
    title: "\u4E8B\u4EF6",
    name: "\u683C\u9686\u6C47",
    type: "realtime",
    column: "finance",
    home: "https://www.gelonghui.com",
    color: "blue",
    interval: 12e4
  },
  fastbull: {
    redirect: "fastbull-express",
    name: "\u6CD5\u5E03\u8D22\u7ECF",
    type: "realtime",
    column: "finance",
    home: "https://www.fastbull.cn",
    color: "emerald",
    interval: 12e4,
    title: "\u5FEB\u8BAF"
  },
  "fastbull-express": {
    name: "\u6CD5\u5E03\u8D22\u7ECF",
    type: "realtime",
    column: "finance",
    home: "https://www.fastbull.cn",
    color: "emerald",
    interval: 12e4,
    title: "\u5FEB\u8BAF"
  },
  "fastbull-news": {
    name: "\u6CD5\u5E03\u8D22\u7ECF",
    column: "finance",
    home: "https://www.fastbull.cn",
    color: "emerald",
    interval: 18e5,
    title: "\u5934\u6761"
  },
  solidot: {
    name: "Solidot",
    column: "tech",
    home: "https://solidot.org",
    color: "teal",
    interval: 36e5
  },
  hackernews: {
    name: "Hacker News",
    type: "hottest",
    column: "tech",
    home: "https://news.ycombinator.com/",
    color: "orange",
    interval: 6e5
  },
  producthunt: {
    name: "Product Hunt",
    type: "hottest",
    column: "tech",
    home: "https://www.producthunt.com/",
    color: "red",
    interval: 6e5
  },
  github: {
    redirect: "github-trending-today",
    name: "Github",
    type: "hottest",
    column: "tech",
    home: "https://github.com/",
    color: "gray",
    interval: 6e5,
    title: "Today"
  },
  "github-trending-today": {
    name: "Github",
    type: "hottest",
    column: "tech",
    home: "https://github.com/",
    color: "gray",
    interval: 6e5,
    title: "Today"
  },
  bilibili: {
    redirect: "bilibili-hot-search",
    name: "\u54D4\u54E9\u54D4\u54E9",
    type: "hottest",
    column: "china",
    home: "https://www.bilibili.com",
    color: "blue",
    interval: 6e5,
    title: "\u70ED\u641C"
  },
  "bilibili-hot-search": {
    name: "\u54D4\u54E9\u54D4\u54E9",
    type: "hottest",
    column: "china",
    home: "https://www.bilibili.com",
    color: "blue",
    interval: 6e5,
    title: "\u70ED\u641C"
  },
  "bilibili-hot-video": {
    name: "\u54D4\u54E9\u54D4\u54E9",
    type: "hottest",
    disable: "cf",
    column: "china",
    home: "https://www.bilibili.com",
    color: "blue",
    interval: 6e5,
    title: "\u70ED\u95E8\u89C6\u9891"
  },
  "bilibili-ranking": {
    name: "\u54D4\u54E9\u54D4\u54E9",
    type: "hottest",
    disable: "cf",
    column: "china",
    home: "https://www.bilibili.com",
    color: "blue",
    interval: 18e5,
    title: "\u6392\u884C\u699C"
  },
  kuaishou: {
    name: "\u5FEB\u624B",
    type: "hottest",
    disable: "cf",
    column: "china",
    home: "https://www.kuaishou.com",
    color: "orange",
    interval: 6e5
  },
  kaopu: {
    name: "\u9760\u8C31\u65B0\u95FB",
    desc: "\u4E0D\u4E00\u5B9A\u9760\u8C31\uFF0C\u591A\u770B\u591A\u601D\u8003",
    column: "world",
    home: "https://kaopu.news/",
    color: "gray",
    interval: 18e5
  },
  jin10: {
    name: "\u91D1\u5341\u6570\u636E",
    type: "realtime",
    column: "finance",
    home: "https://www.jin10.com",
    color: "blue",
    interval: 6e5
  },
  baidu: {
    name: "\u767E\u5EA6\u70ED\u641C",
    type: "hottest",
    column: "china",
    home: "https://www.baidu.com",
    color: "blue",
    interval: 6e5
  },
  nowcoder: {
    name: "\u725B\u5BA2",
    type: "hottest",
    column: "china",
    home: "https://www.nowcoder.com",
    color: "blue",
    interval: 6e5
  },
  sspai: {
    name: "\u5C11\u6570\u6D3E",
    type: "hottest",
    column: "tech",
    home: "https://sspai.com",
    color: "red",
    interval: 6e5
  },
  juejin: {
    name: "\u7A00\u571F\u6398\u91D1",
    type: "hottest",
    column: "tech",
    home: "https://juejin.cn",
    color: "blue",
    interval: 6e5
  },
  ifeng: {
    title: "\u70ED\u70B9\u8D44\u8BAF",
    name: "\u51E4\u51F0\u7F51",
    type: "hottest",
    column: "china",
    home: "https://www.ifeng.com",
    color: "red",
    interval: 6e5
  },
  chongbuluo: {
    redirect: "chongbuluo-latest",
    name: "\u866B\u90E8\u843D",
    column: "china",
    home: "https://www.chongbuluo.com/forum.php?mod=guide&view=newthread",
    color: "green",
    interval: 18e5,
    title: "\u6700\u65B0"
  },
  "chongbuluo-latest": {
    name: "\u866B\u90E8\u843D",
    column: "china",
    home: "https://www.chongbuluo.com/forum.php?mod=guide&view=newthread",
    color: "green",
    interval: 18e5,
    title: "\u6700\u65B0"
  },
  "chongbuluo-hot": {
    name: "\u866B\u90E8\u843D",
    type: "hottest",
    column: "china",
    home: "https://www.chongbuluo.com/forum.php?mod=guide&view=hot",
    color: "green",
    interval: 18e5,
    title: "\u6700\u70ED"
  },
  douban: {
    title: "\u70ED\u95E8\u7535\u5F71",
    name: "\u8C46\u74E3",
    type: "hottest",
    column: "china",
    home: "https://www.douban.com",
    color: "green",
    interval: 6e5
  },
  steam: {
    title: "\u5728\u7EBF\u4EBA\u6570",
    name: "Steam",
    type: "hottest",
    column: "world",
    home: "https://store.steampowered.com",
    color: "blue",
    interval: 6e5
  },
  tencent: {
    redirect: "tencent-hot",
    name: "\u817E\u8BAF\u65B0\u95FB",
    type: "hottest",
    column: "china",
    home: "https://news.qq.com/tag/aEWqxLtdgmQ=",
    color: "blue",
    interval: 18e5,
    title: "\u7EFC\u5408\u65E9\u62A5"
  },
  "tencent-hot": {
    name: "\u817E\u8BAF\u65B0\u95FB",
    type: "hottest",
    column: "china",
    home: "https://news.qq.com/tag/aEWqxLtdgmQ=",
    color: "blue",
    interval: 18e5,
    title: "\u7EFC\u5408\u65E9\u62A5"
  },
  freebuf: {
    title: "\u7F51\u7EDC\u5B89\u5168",
    name: "Freebuf",
    type: "hottest",
    column: "china",
    home: "https://www.freebuf.com/",
    color: "green",
    interval: 6e5
  },
  qqvideo: {
    redirect: "qqvideo-tv-hotsearch",
    name: "\u817E\u8BAF\u89C6\u9891",
    type: "hottest",
    column: "china",
    home: "https://v.qq.com/channel/tv",
    color: "blue",
    interval: 18e5,
    title: "\u7535\u89C6\u5267-\u70ED\u641C\u699C"
  },
  "qqvideo-tv-hotsearch": {
    name: "\u817E\u8BAF\u89C6\u9891",
    type: "hottest",
    column: "china",
    home: "https://v.qq.com/channel/tv",
    color: "blue",
    interval: 18e5,
    title: "\u7535\u89C6\u5267-\u70ED\u641C\u699C"
  },
  iqiyi: {
    redirect: "iqiyi-hot-ranklist",
    name: "\u7231\u5947\u827A",
    type: "hottest",
    column: "china",
    home: "https://www.iqiyi.com",
    color: "green",
    interval: 18e5,
    title: "\u70ED\u64AD\u699C"
  },
  "iqiyi-hot-ranklist": {
    name: "\u7231\u5947\u827A",
    type: "hottest",
    column: "china",
    home: "https://www.iqiyi.com",
    color: "green",
    interval: 18e5,
    title: "\u70ED\u64AD\u699C"
  }
};

// src/process.js
var description = Object.entries(sources_default).filter(([_, source]) => {
  if (source.redirect) {
    return false;
  }
  return true;
}).map(([id, source]) => {
  return source.title ? `${source.name}-${source.title} id is ${id}` : `${source.name} id is ${id}`;
}).join(";");

// src/index.ts
config();
if (!process.env.BASE_URL) {
  console.error("BASE_URL is not set");
  process.exit(1);
}
var baseUrl = process.env.BASE_URL;
var server = new FastMCP({
  name: "NewsNow",
  version: package_default.version
});
server.addTool({
  name: "get_hottest_latest_news",
  description: `get hottest or latest news from source by {id}, return {count: 10} news.`,
  parameters: z.object({
    id: z.string().describe(`source id. e.g. ${description}`),
    count: z.any().default(10).describe("count of news to return.")
  }),
  execute: async ({ id, count }) => {
    const res = await $fetch(`${baseUrl}/api/s?id=${id}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
      }
    });
    return {
      content: res.items.slice(0, count).map((item) => ({
        text: `[${item.title}](${item.url})`,
        type: "text"
      }))
    };
  }
});
server.start({
  transportType: "stdio"
});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map