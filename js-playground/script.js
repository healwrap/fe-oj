console.log(window.ts);
document.addEventListener('DOMContentLoaded', () => {
  // 获取DOM元素
  const outputPanel = document.getElementById('output-panel');
  const runButton = document.getElementById('run-button');
  const clearButton = document.getElementById('clear-button');
  const languageSelect = document.getElementById('language-select');

  // Monaco编辑器实例
  let editor;

  // 初始代码示例
  const jsExample = `// JavaScript示例
console.log("Hello World!");

// 定义一个函数
function add(a, b) {
    return a + b;
}

// 调用函数并输出结果
const result = add(5, 3);
console.log(\`5 + 3 = \${result}\`);

// 数组操作
const fruits = ["苹果", "香蕉", "橙子"];
fruits.forEach(fruit => console.log(fruit));`;

  const tsExample = `// TypeScript示例
console.log("Hello TypeScript!");

// 带类型的函数
function add(a: number, b: number): number {
    return a + b;
}

// 接口定义
interface Person {
    name: string;
    age: number;
}

// 使用接口
const person: Person = {
    name: "张三",
    age: 30
};

console.log(\`姓名: \${person.name}, 年龄: \${person.age}\`);
console.log(\`1 + 2 = \${add(1, 2)}\`);`;

  // 初始化Monaco编辑器
  initMonacoEditor();

  function initMonacoEditor() {
    // 配置AMD加载器路径
    require.config({
      paths: {
        vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs',
      },
    });

    // 加载Monaco编辑器
    require(['vs/editor/editor.main'], function () {
      // 初始化编辑器
      editor = monaco.editor.create(document.getElementById('code-editor'), {
        value: jsExample,
        language: 'javascript',
        theme: 'vs',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        renderWhitespace: 'boundary',
        formatOnPaste: true,
        formatOnType: true,
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        renderLineHighlight: 'all',
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
          vertical: 'visible',
          horizontal: 'visible',
        },
      });

      // 配置TypeScript
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowNonTsExtensions: true,
      });

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowNonTsExtensions: true,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        strict: true,
      });

      // 设置DOM类型定义，增强代码提示
      const libSource = [
        'declare class Console {',
        '    log(...data: any[]): void;',
        '    info(...data: any[]): void;',
        '    warn(...data: any[]): void;',
        '    error(...data: any[]): void;',
        '}',
        'declare var console: Console;',
        'declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;',
        'declare function clearTimeout(timeoutId: number): void;',
        'declare function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;',
        'declare function clearInterval(intervalId: number): void;',
      ].join('\n');

      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        libSource,
        'ts:browser.d.ts'
      );

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        libSource,
        'ts:browser.d.ts'
      );

      // 支持Ctrl+Enter运行代码
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        executeCode
      );

      // 添加语言切换事件处理
      languageSelect.addEventListener('change', () => {
        const language = languageSelect.value;
        const model = editor.getModel();
        monaco.editor.setModelLanguage(model, language);

        if (language === 'javascript') {
          editor.setValue(jsExample);
        } else {
          editor.setValue(tsExample);
        }
      });
    });
  }

  // 运行按钮点击事件
  runButton.addEventListener('click', () => {
    executeCode();
  });

  // 清除按钮点击事件
  clearButton.addEventListener('click', () => {
    outputPanel.innerHTML = '';
  });

  // 执行代码的函数
  function executeCode() {
    // 如果编辑器未初始化，则返回
    if (!editor) return;

    // 清空输出面板
    outputPanel.innerHTML = '';

    // 获取代码和语言
    const code = editor.getValue();
    const language = languageSelect.value;

    try {
      // 重写console方法捕获输出
      const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
      };

      // 创建沙箱环境
      const sandbox = {
        console: {
          log: (...args) => {
            appendToOutput(
              args.map((arg) => formatOutput(arg)).join(' '),
              'log'
            );
            originalConsole.log(...args);
          },
          info: (...args) => {
            appendToOutput(
              args.map((arg) => formatOutput(arg)).join(' '),
              'info'
            );
            originalConsole.info(...args);
          },
          warn: (...args) => {
            appendToOutput(
              args.map((arg) => formatOutput(arg)).join(' '),
              'warning'
            );
            originalConsole.warn(...args);
          },
          error: (...args) => {
            appendToOutput(
              args.map((arg) => formatOutput(arg)).join(' '),
              'error'
            );
            originalConsole.error(...args);
          },
        },
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
      };

      let processedCode = code;

      // 如果是TypeScript，需要先编译
      if (language === 'typescript') {
        if (typeof ts === 'undefined') {
          throw new Error('TypeScript编译器未加载，请检查网络连接');
        }

        // 获取编译器错误
        const result = ts.transpileModule(code, {
          compilerOptions: {
            target: ts.ScriptTarget.ES2015,
            module: ts.ModuleKind.None,
            strict: true,
          },
          reportDiagnostics: true,
        });

        // 如果有编译错误，显示错误信息
        if (result.diagnostics && result.diagnostics.length > 0) {
          result.diagnostics.forEach((diagnostic) => {
            const message = ts.flattenDiagnosticMessageText(
              diagnostic.messageText,
              '\n'
            );

            // 尝试获取错误位置
            let position = '';
            if (diagnostic.file && diagnostic.start !== undefined) {
              const { line, character } =
                diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
              position = `(${line + 1},${character + 1}): `;
            }

            appendToOutput(
              `TypeScript编译错误: ${position}${message}`,
              'error'
            );
          });

          // 如果有错误，不执行编译后的代码
          if (
            result.diagnostics.some(
              (d) => d.category === ts.DiagnosticCategory.Error
            )
          ) {
            return;
          }
        }

        processedCode = result.outputText;
      } else {
        // JavaScript语法检查 - 简单尝试解析代码
        try {
          new Function(code);
        } catch (syntaxError) {
          appendToOutput(`JavaScript语法错误: ${syntaxError.message}`, 'error');
          return;
        }
      }

      // 创建一个安全的函数执行环境
      const safeEval = new Function(
        ...Object.keys(sandbox),
        `"use strict"; 
                try { 
                    ${processedCode} 
                } catch (error) { 
                    console.error(error); 
                }`
      );

      // 执行代码
      safeEval(...Object.values(sandbox));
    } catch (error) {
      appendToOutput(`执行错误: ${error.message}`, 'error');
      console.error(error);
    }
  }

  // 将输出添加到输出面板
  function appendToOutput(text, type = 'log') {
    const element = document.createElement('div');
    element.className = type;
    element.textContent = text;
    outputPanel.appendChild(element);

    // 自动滚动到底部
    outputPanel.scrollTop = outputPanel.scrollHeight;
  }

  // 格式化输出内容
  function formatOutput(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return value.toString();
      }
    }
    return String(value);
  }
});
