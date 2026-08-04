'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const defaultCode = `print('Hello, Python!')\n`;
const STORAGE_KEY = 'python-editor-code';

function extractInputPrompts(code: string): string[] {
  const prompts: string[] = [];
  // input() / input("...") / input('...') のパターンを抽出
  const regex = /input\s*\(\s*(?:(['"]{1,3})([\s\S]*?)\1)?\s*\)/g;
  let match;
  let count = 0;
  while ((match = regex.exec(code)) !== null) {
    prompts.push(match[2] ?? `入力 ${++count}`);
  }
  return prompts;
}

interface InputModalProps {
  prompts: string[];
  values: string[];
  onChange: (index: number, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function InputModal({ prompts, values, onChange, onSubmit, onCancel }: InputModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-1 text-lg font-bold text-white">入力値を入力してください</h2>
        <p className="mb-5 text-sm text-slate-400">
          コード内の <code className="rounded bg-slate-800 px-1 text-cyan-400">input()</code> に渡す値を入力してください。
        </p>
        <div className="space-y-4">
          {prompts.map((prompt, i) => (
            <div key={i}>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                {prompt || `入力 ${i + 1}`}
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                value={values[i] ?? ''}
                onChange={(e) => onChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && i === prompts.length - 1) onSubmit();
                }}
                autoFocus={i === 0}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" className="rounded-lg px-4 py-2 text-sm" onClick={onCancel}>
            キャンセル
          </Button>
          <Button className="rounded-lg px-4 py-2 text-sm" onClick={onSubmit}>
            実行
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [code, setCode] = useState(() => {
    if (typeof window === 'undefined') return defaultCode;
    return localStorage.getItem(STORAGE_KEY) ?? defaultCode;
  });
  const [output, setOutput] = useState('実行結果がここに表示されます。');
  const [analysis, setAnalysis] = useState('ここにエラー説明や改善提案が表示されます。');
  const [errorLines, setErrorLines] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const [inputPrompts, setInputPrompts] = useState<string[]>([]);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [showInputModal, setShowInputModal] = useState(false);
  const pendingCodeRef = useRef<string>('');

  const codeRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumberRef = useRef<HTMLDivElement | null>(null);

  const syncScroll = useCallback(() => {
    if (codeRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = codeRef.current.scrollTop;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  const lineCount = code.split('\n').length;

  const copyAll = async () => {
    if (codeRef.current) {
      codeRef.current.select();
      codeRef.current.setSelectionRange(0, code.length);
    }
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      console.error('コピーに失敗しました', error);
    }
  };

  const executeCode = async (targetCode: string, stdin: string) => {
    setIsRunning(true);
    setOutput('実行中...');
    setAnalysis('');
    setErrorLines([]);
    try {
      const response = await fetch('/api/run-python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: targetCode, stdin }),
      });
      const data = await response.json();
      setOutput(data.output);
      setAnalysis(data.analysis);
      setErrorLines(data.errorLines ?? []);
    } catch (error) {
      setOutput('実行に失敗しました。');
      setAnalysis(String(error));
      setErrorLines([]);
    } finally {
      setIsRunning(false);
    }
  };

  const runCode = () => {
    const prompts = extractInputPrompts(code);
    if (prompts.length > 0) {
      pendingCodeRef.current = code;
      setInputPrompts(prompts);
      setInputValues(Array(prompts.length).fill(''));
      setShowInputModal(true);
    } else {
      executeCode(code, '');
    }
  };

  const handleInputSubmit = () => {
    setShowInputModal(false);
    const stdin = inputValues.join('\n');
    executeCode(pendingCodeRef.current, stdin);
  };

  const handleInputCancel = () => {
    setShowInputModal(false);
  };

  const renderOutput = (text: string) => {
    const lines = text.split('\n');
    const highlightIndices = new Set<number>();

    lines.forEach((line, index) => {
      if (/^\s*\^+\s*$/.test(line)) {
        highlightIndices.add(index);
        if (index > 0) highlightIndices.add(index - 1);
      }
      if (/(SyntaxError|NameError|IndentationError|Traceback)/.test(line)) {
        highlightIndices.add(index);
      }
    });

    return lines.map((line, index) => {
      const isHighlighted = highlightIndices.has(index);
      return (
        <div
          key={index}
          className={isHighlighted ? 'rounded-md bg-red-950 px-2 text-red-300' : 'px-2'}
        >
          {line === '' ? '\u00a0' : line}
        </div>
      );
    });
  };

  return (
    <>
      {showInputModal && (
        <InputModal
          prompts={inputPrompts}
          values={inputValues}
          onChange={(i, v) => setInputValues((prev) => { const next = [...prev]; next[i] = v; return next; })}
          onSubmit={handleInputSubmit}
          onCancel={handleInputCancel}
        />
      )}

      <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6">
          <header className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white">Python エディタ</h1>
                <p className="mt-2 max-w-2xl text-slate-400">
                  コード入力、実行結果、エラー解説の 3 画面構成。
                </p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>コード入力</CardTitle>
                  <CardDescription>Python コードを編集し、実行結果を確認。</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="secondary"
                    className="rounded-lg px-3 py-2 text-xs"
                    onClick={copyAll}
                  >
                    全てコピー
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-lg px-3 py-2 text-xs text-slate-400"
                    onClick={() => {
                      if (confirm('コードをリセットしますか？')) {
                        setCode(defaultCode);
                      }
                    }}
                  >
                    リセット
                  </Button>
                  <Button onClick={runCode} disabled={isRunning}>
                    {isRunning ? '実行中…' : '実行'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex min-h-[520px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 transition focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20">
                  <div
                    ref={lineNumberRef}
                    className="select-none overflow-hidden border-r border-slate-800 bg-slate-900/60 py-4 pr-3 pl-4 font-mono text-sm leading-6 text-slate-500"
                    style={{ minWidth: '3rem' }}
                  >
                    {Array.from({ length: lineCount }, (_, i) => (
                      <div key={i + 1} className="text-right">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <textarea
                    ref={codeRef}
                    className="min-h-[520px] flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 text-slate-100 outline-none"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onScroll={syncScroll}
                    spellCheck={false}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>実行結果</CardTitle>
                <CardDescription>Python の出力結果を表示。</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[320px] overflow-auto rounded-3xl border border-slate-800 bg-slate-950/90 p-4 text-sm leading-6 text-slate-100">
                  <pre className="whitespace-pre-wrap">{renderOutput(output)}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>コード分析 / 改善提案</CardTitle>
                <CardDescription>構文エラーや改善点を表示。</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[320px] overflow-auto rounded-3xl border border-slate-800 bg-slate-950/90 p-4 text-sm leading-6 text-slate-100 space-y-4">
                  <p>{analysis}</p>
                  {errorLines.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        エラー該当行
                      </p>
                      <div className="overflow-hidden rounded-xl border border-slate-700 font-mono text-xs">
                        {code.split('\n').map((line, index) => {
                          const lineNum = index + 1;
                          const isError = errorLines.includes(lineNum);
                          return (
                            <div
                              key={lineNum}
                              className={`flex ${isError ? 'bg-red-950/70 text-red-300' : 'text-slate-500'}`}
                            >
                              <span className={`select-none w-10 shrink-0 border-r px-2 py-0.5 text-right ${isError ? 'border-red-800 bg-red-900/60 text-red-400 font-bold' : 'border-slate-700 bg-slate-900/60'}`}>
                                {lineNum}
                              </span>
                              <span className={`flex-1 px-3 py-0.5 ${isError ? 'text-red-200' : 'text-slate-400'}`}>
                                {line || '\u00a0'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
