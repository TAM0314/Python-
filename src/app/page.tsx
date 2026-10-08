'use client';

import { useRef, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const defaultCode = `print('Hello, Python!')\n`;

export default function Home() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('実行結果がここに表示されます。');
  const [analysis, setAnalysis] = useState('ここにエラー説明や改善提案が表示されます。');
  const [isRunning, setIsRunning] = useState(false);
  const codeRef = useRef<HTMLTextAreaElement | null>(null);

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

  const checkInput = () => {
    if (!codeRef.current) {
      setAnalysis('入力欄が見つかりません。');
      return;
    }

    codeRef.current.focus();
    const isActive = document.activeElement === codeRef.current;
    setAnalysis(isActive ? '入力が有効です。テキストエリアにフォーカスしました。' : '入力が無効です。');
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('実行中...');
    setAnalysis('');

    try {
      const response = await fetch('/api/run-python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      setOutput(data.output);
      setAnalysis(data.analysis);
    } catch (error) {
      setOutput('実行に失敗しました。');
      setAnalysis(String(error));
    } finally {
      setIsRunning(false);
    }
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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6">
        <header className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white">Python エディタ</h1>
              <p className="mt-2 max-w-2xl text-slate-400">
                コード入力、実行結果、エラー解説の 3 画面構成。
              </p>
            </div>
            <div>
              <a
                href="/base-converter"
                className="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow hover:bg-cyan-700 transition"
              >
                基数変換 & タイムアタックへ ↗
              </a>
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
                <Button variant="secondary" className="rounded-lg px-3 py-2 text-xs" onClick={copyAll}>
                  全てコピー
                </Button>
                <Button variant="secondary" className="rounded-lg px-3 py-2 text-xs" onClick={checkInput}>
                  入力確認
                </Button>
                <Button onClick={runCode} disabled={isRunning}>
                  {isRunning ? '実行中…' : '実行'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                ref={codeRef}
                className="min-h-[520px] w-full resize-none rounded-3xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
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
              <div className="min-h-[320px] overflow-auto rounded-3xl border border-slate-800 bg-slate-950/90 p-4 text-sm leading-6 text-slate-100">
                {analysis}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
