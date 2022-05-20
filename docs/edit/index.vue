<template>
  <div>
    <Navbar />
    <div class="edit-container">
      <div class="iframe-wrapper">
        <iframe ref="iframe" frameborder="0" class="iframe" :key="iframeKey"></iframe>
      </div>
      <div class="editor-wrapper" ref="editor"></div>
      <button class="button" @click="onRunClick">run</button>
    </div>
  </div>
</template>

<script>
import Navbar from "@theme/components/Navbar.vue";
import CodeMirror from "codemirror/lib/codemirror";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/lesser-dark.css";

function getRandom(){
  return Math.random().toString(16).slice(-6)
}

export default {
  components: { Navbar },
  data(){
    return {
      iframeKey:getRandom()
    }
  },
  mounted() {
    this.initCodeMirror();
  },
  methods: {
    request(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        xhr.addEventListener("readystatechange", () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            resolve(xhr.response);
          }
        });
        xhr.addEventListener("error", reject);
      });
    },
    initCodeMirror() {
      this.request("/htmls/demo.html")
        .then((data) => {
          this.codeMirror = CodeMirror(this.$refs.editor, {
            value: data,
            //   mode: "htmlmixed",
            mode: "text/html",
            theme: "lesser-dark", // 用于设置编辑器样式的主题
            lineNumbers: true, // 是否在编辑器的左侧显示行号
            line: true,
            lineWrapping: true,
            autoCloseBrackets: true, // 在键入时自动关闭括号和引号
            smartIndent: true,
            styleActiveLine: true
          });
          this.initFrame()
        })
        .catch(() => {});
    },
    initFrame() {
      if (!this.codeMirror) {
        return;
      }
      const iframe = this.$refs.iframe;
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(this.codeMirror.getValue());
      doc.close();
    },
    onRunClick(){
      this.iframeKey  = getRandom()
      this.$nextTick(()=>{

      this.initFrame()
      })
    }
  },
};
</script>

<style lang="scss">
.edit-container {
  margin-top: 3.6rem;
  height: calc(100vh - 3.6rem);
  display: flex;
  flex-direction: row;
  position: relative;
  .iframe-wrapper {
    width: 50%;
    height: 100%;
    background-color: #1a1a1a;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }
  .iframe {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .editor-wrapper {
    width: 50%;
    height: 100%;
    appearance: none;
    outline: none;
    background-color: #262626;
    box-sizing: border-box;
    overflow: hidden;
  }
  .button {
    box-sizing: border-box;
    display: inline-block;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid #409eff;
    border-radius: 4px;
    outline: none;
    transition: 0.1s;
    -webkit-appearance: none;
    color: #fff;
    background-color: #409eff;
    position: absolute;
    top: 10px;
    right: 20px;
    padding: 8px 15px;
    z-index: 100;
  }

  .CodeMirror {
    height: 100%;
  }
}

@media screen and (max-width: 1000px) {
  .edit-container {
    flex-direction: column;
    .iframe-wrapper {
      width: 100%;
      height: 0;
      flex: 1;
    }

    .editor-wrapper {
      width: 100%;
      height: 0;
      flex: 1;
    }
  }
}
</style>