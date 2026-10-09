'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Mode = "timeattack" | "converter";

interface Question {
  id: number;
  val: number;
  fromBase: 2 | 10 | 16;
  toBase: 2 | 10 | 16;
  questionStr: string;
  answerStr: string;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("timeattack");

  // --- Converter Mode State ---
  const [binInput, setBinInput] = useState<string>("101010");
  const [decInput, setDecInput] = useState<string>("42");
  const [hexInput, setHexInput] = useState<string>("2a");
  const [activeField, setActiveField] = useState<"bin" | "dec" | "hex">("dec");

  // --- Time Attack Mode State ---
  const [taState, setTaState] = useState<"idle" | "playing" | "finished">("idle");
  const [taModeSelect, setTaModeSelect] = useState<string>("random");
  const [digitCount, setDigitCount] = useState<number>(4);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [history, setHistory] = useState<{ q: Question; userAns: string; correct: boolean }[]>([]);

  // Converter sync logic
  useEffect(() => {
    if (activeField === "dec") {
      const num = parseInt(decInput, 10);
      if (isNaN(num) || decInput === "") {
        setBinInput("");
        setHexInput("");
      } else {
        setBinInput(num.toString(2));
        setHexInput(num.toString(16));
      }
    }
  }, [decInput, activeField]);

  useEffect(() => {
    if (activeField === "bin") {
      const num = parseInt(binInput, 2);
      if (isNaN(num) || binInput === "") {
        setDecInput("");
        setHexInput("");
      } else {
        setDecInput(num.toString(10));
        setHexInput(num.toString(16));
      }
    }
  }, [binInput, activeField]);

  useEffect(() => {
    if (activeField === "hex") {
      const num = parseInt(hexInput, 16);
      if (isNaN(num) || hexInput === "") {
        setBinInput("");
        setDecInput("");
      } else {
        setBinInput(num.toString(2));
        setDecInput(num.toString(10));
      }
    }
  }, [hexInput, activeField]);

  const handleDecChange = (val: string) => {
    if (/^\d*$/.test(val)) {
      setActiveField("dec");
      setDecInput(val);
    }
  };

  const handleBinChange = (val: string) => {
    if (/^[01]*$/.test(val)) {
      setActiveField("bin");
      setBinInput(val);
    }
  };

  const handleHexChange = (val: string) => {
    if (/^[0-9a-fA-F]*$/.test(val)) {
      setActiveField("hex");
      setHexInput(val);
    }
  };

  // Sanitize user answer to half-width alphanumeric only
  const handleAnswerChange = (val: string) => {
    let sanitized = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );
    sanitized = sanitized.replace(/[^0-9a-zA-Z]/g, "");
    setUserAnswer(sanitized);
  };

  // Time Attack functions
  const startTimer = () => {
    const start = Date.now();
    setStartTime(start);
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - start);
    }, 100);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const quitGame = () => {
    stopTimer();
    setTaState("idle");
    setUserAnswer("");
    setFeedback(null);
  };

  const generateQuestions = (): Question[] => {
    const bases: (2 | 10 | 16)[] = [2, 10, 16];
    const qs: Question[] = [];
    const maxVal = Math.pow(2, digitCount) - 1;
    const minVal = 1;

    for (let i = 0; i < 10; i++) {
      let fromBase: 2 | 10 | 16 = 10;
      let toBase: 2 | 10 | 16 = 2;

      if (taModeSelect === "random") {
        fromBase = bases[Math.floor(Math.random() * bases.length)];
        toBase = bases[Math.floor(Math.random() * bases.length)];
        while (toBase === fromBase) {
          toBase = bases[Math.floor(Math.random() * bases.length)];
        }
      } else if (taModeSelect === "2to10") {
        fromBase = 2; toBase = 10;
      } else if (taModeSelect === "10to2") {
        fromBase = 10; toBase = 2;
      } else if (taModeSelect === "10to16") {
        fromBase = 10; toBase = 16;
      } else if (taModeSelect === "16to10") {
        fromBase = 16; toBase = 10;
      } else if (taModeSelect === "2to16") {
        fromBase = 2; toBase = 16;
      } else if (taModeSelect === "16to2") {
        fromBase = 16; toBase = 2;
      }

      let val;
      if (fromBase === 2 || toBase === 2) {
        val = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      } else {
        val = Math.floor(Math.random() * 254) + 1;
      }

      let formatVal = "";
      if (fromBase === 2) formatVal = val.toString(2).padStart(digitCount, '0');
      else if (fromBase === 10) formatVal = val.toString(10);
      else formatVal = val.toString(16).toUpperCase();

      let targetStr = "";
      if (toBase === 2) targetStr = val.toString(2).padStart(digitCount, '0');
      else if (toBase === 10) targetStr = val.toString(10);
      else targetStr = val.toString(16).toUpperCase();

      const baseNames = { 2: "2進数", 10: "10進数", 16: "16進数" };
      const questionStr = `${baseNames[fromBase]} 「${formatVal}」 を ${baseNames[toBase]} に変換せよ`;

      qs.push({
        id: i + 1,
        val,
        fromBase,
        toBase,
        questionStr,
        answerStr: targetStr,
      });
    }
    return qs;
  };

  const handleStartGame = () => {
    const newQs = generateQuestions();
    setQuestions(newQs);
    setCurrentIndex(0);
    setUserAnswer("");
    setHistory([]);
    setTaState("playing");
    setElapsedTime(0);
    startTimer();
  };

  const normalizeAns = (ans: string) => {
    let s = ans.trim().toUpperCase();
    if (s.startsWith("0X")) s = s.slice(2);
    return s;
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taState !== "playing") return;

    const currentQ = questions[currentIndex];
    const cleanUserAns = normalizeAns(userAnswer);
    const cleanCorrectAns = normalizeAns(currentQ.answerStr);

    const isCorrect = cleanUserAns === cleanCorrectAns;

    const newHistoryItem = { q: currentQ, userAns: userAnswer, correct: isCorrect };
    setHistory([...history, newHistoryItem]);

    if (isCorrect) {
      setFeedback("正解！ 🎉");
      setTimeout(() => setFeedback(null), 600);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer("");
      } else {
        stopTimer();
        setTaState("finished");
      }
    } else {
      setFeedback("不正解... もう一度！ ❌");
      setUserAnswer("");
      setTimeout(() => setFeedback(null), 800);
    }
  };

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const formatTime = (ms: number) => {
    const totalSec = ms / 1000;
    return totalSec.toFixed(2);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6">
        <header className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">基数変換マスター</h1>
            <p className="mt-2 text-sm text-slate-400">
              2進数・10進数・16進数の相互変換とタイムアタック学習ツール
            </p>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setMode("timeattack")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "timeattack" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              タイムアタック
            </button>
            <button
              onClick={() => setMode("converter")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "converter" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              通常変換
            </button>
          </div>
        </header>

        {mode === "converter" ? (
          <Card>
            <CardHeader>
              <CardTitle>リアルタイム基数変換</CardTitle>
              <CardDescription>任意の欄に入力すると自動で他の進数に変換されます。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    10進数 (Decimal)
                  </label>
                  <input
                    type="text"
                    value={decInput}
                    onChange={(e) => handleDecChange(e.target.value)}
                    placeholder="例: 42"
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-lg font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <p className="text-xs text-slate-500">使用文字: 0-9</p>
                </div>

                <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    2進数 (Binary)
                  </label>
                  <input
                    type="text"
                    value={binInput}
                    onChange={(e) => handleBinChange(e.target.value)}
                    placeholder="例: 101010"
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-lg font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <p className="text-xs text-slate-500">使用文字: 0, 1</p>
                </div>

                <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    16進数 (Hexadecimal)
                  </label>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value.toLowerCase())}
                    placeholder="例: 2a"
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-lg font-mono text-white uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <p className="text-xs text-slate-500">使用文字: 0-9, a-f</p>
                </div>
              </div>

              {decInput !== "" && !isNaN(parseInt(decInput, 10)) && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-cyan-400">詳細情報 (8bit パディング表示)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
                      <span className="text-slate-400">8ビット2進数:</span>
                      <span className="font-bold text-cyan-400">
                        {parseInt(decInput, 10) >= 0 && parseInt(decInput, 10) <= 255
                          ? parseInt(decInput, 10).toString(2).padStart(8, "0")
                          : "範囲外 (0-255)"}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
                      <span className="text-slate-400">16進数 (大文字):</span>
                      <span className="font-bold text-cyan-400">
                        0x{parseInt(decInput, 10).toString(16).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>タイムアタックモード</CardTitle>
                <CardDescription>変換パターンと2進数桁数を選んで全10問のタイムアタックに挑戦します。</CardDescription>
              </div>
              {taState === "playing" && (
                <Button variant="destructive" onClick={quitGame} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg">
                  中断する (終了)
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {taState === "idle" && (
                <div className="text-center space-y-6 py-8">
                  <div className="w-20 h-20 bg-cyan-950 text-cyan-400 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold shadow-inner border border-cyan-800">
                    ⏱️
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">タイムアタック開始準備</h3>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">
                      変換モードと2進数の桁数を選択してスタートボタンを押してください。
                    </p>
                  </div>

                  <div className="max-w-xs mx-auto space-y-4 text-left">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                        変換モード選択
                      </label>
                      <select
                        value={taModeSelect}
                        onChange={(e) => setTaModeSelect(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="random">🔀 ランダム（すべての組み合わせ）</option>
                        <option value="2to10">2進数 ⇒ 10進数</option>
                        <option value="10to2">10進数 ⇒ 2進数</option>
                        <option value="10to16">10進数 ⇒ 16進数</option>
                        <option value="16to10">16進数 ⇒ 10進数</option>
                        <option value="2to16">2進数 ⇒ 16進数</option>
                        <option value="16to2">16進数 ⇒ 2進数</option>
                      </select>
                    </div>

                    {taModeSelect !== "10to16" && taModeSelect !== "16to10" && (
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          2進数の桁数 (n桁)
                        </label>
                        <select
                          value={digitCount}
                          onChange={(e) => setDigitCount(parseInt(e.target.value, 10))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value={2}>2桁 (0 ～ 3)</option>
                          <option value={3}>3桁 (0 ～ 7)</option>
                          <option value={4}>4桁 (デフォルト: 0 ～ 15)</option>
                          <option value={6}>6桁 (0 ～ 63)</option>
                          <option value={8}>8桁 (0 ～ 255)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <Button onClick={handleStartGame} className="px-8 py-4 text-lg">
                    タイムアタック開始！
                  </Button>
                </div>
              )}

              {taState === "playing" && questions.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div className="text-sm font-semibold text-slate-400">
                      問題 <span className="text-cyan-400 font-bold text-base">{currentIndex + 1}</span> / 10
                    </div>
                    <div className="text-xl font-mono font-bold text-cyan-400 bg-slate-900 px-4 py-1.5 rounded-lg border border-slate-800">
                      {formatTime(elapsedTime)} 秒
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
                    <span className="inline-block bg-cyan-950 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-cyan-800">
                      {(() => {
                        const baseNames = { 2: "2進数", 10: "10進数", 16: "16進数" };
                        const q = questions[currentIndex];
                        return `${baseNames[q.fromBase]} ⇒ ${baseNames[q.toBase]}`;
                      })()}
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      {questions[currentIndex].questionStr}
                    </h3>
                    {feedback && (
                      <div className="text-lg font-bold animate-bounce text-cyan-400">
                        {feedback}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleAnswerSubmit} className="space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        lang="en"
                        inputMode="text"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        value={userAnswer}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !isComposing) {
                            e.preventDefault();
                            handleAnswerSubmit(e as unknown as React.FormEvent);
                          }
                        }}
                        placeholder="半角英数字で入力..."
                        autoFocus
                        className="flex-1 px-5 py-4 rounded-xl border border-slate-700 bg-slate-950 text-xl font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
                      />
                      <Button type="submit" className="px-8 py-4 text-lg">
                        解答
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                      半角英数字のみ入力可能（Enterキー1回で解答送信）
                    </p>
                  </form>
                </div>
              )}

              {taState === "finished" && (
                <div className="text-center space-y-6 py-6">
                  <div className="w-20 h-20 bg-emerald-950 text-emerald-400 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold shadow-inner border border-emerald-800">
                    🏆
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">クリアおめでとうございます！</h3>
                    <p className="text-sm text-slate-400">全10問の変換を達成しました。</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm mx-auto space-y-3">
                    <div className="text-sm text-slate-400">タイム</div>
                    <div className="text-4xl font-extrabold font-mono text-cyan-400">
                      {formatTime(elapsedTime)} 秒
                    </div>
                    <div className="text-xs text-slate-500">
                      1問あたりの平均: {(elapsedTime / 1000 / 10).toFixed(2)} 秒/問
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button onClick={handleStartGame}>もう一度挑戦する</Button>
                    <Button variant="secondary" onClick={() => setTaState("idle")}>
                      トップに戻る
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
