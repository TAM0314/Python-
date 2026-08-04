import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { code, stdin = '' } = await request.json();
  let output = '';
  let analysis = '';
  let errorLines: number[] = [];

  try {
    const exec = await import('child_process');
    const { spawn } = exec;
    const py = spawn('python', ['-c', code]);

    const TIMEOUT_MS = 10000;

    if (stdin) {
      py.stdin.write(stdin.endsWith('\n') ? stdin : stdin + '\n');
    }
    py.stdin.end();

    output = await new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';

      const timer = setTimeout(() => {
        py.kill('SIGKILL');
        resolve('⏱ 実行がタイムアウトしました（10秒）。無限ループや重い処理がないか確認してください。');
      }, TIMEOUT_MS);

      py.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });
      py.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });
      py.on('close', () => {
        clearTimeout(timer);
        if (stderr) {
          resolve(stderr);
        } else {
          resolve(stdout || '実行が完了しました。');
        }
      });
      py.on('error', (error) => {
        clearTimeout(timer);
        reject(error);
      });
    });

    if (output.toLowerCase().includes('error') || output.toLowerCase().includes('traceback')) {
      analysis = generateAnalysis(output);
      errorLines = extractErrorLines(output);
    } else {
      analysis = 'エラーがありません。必要に応じて改善点を検討してください。';
    }
  } catch (error) {
    output = 'Python 実行に失敗しました。';
    analysis = String(error);
  }

  return new Response(JSON.stringify({ output, analysis, errorLines }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function extractErrorLines(text: string): number[] {
  const lines = new Set<number>();
  const linePattern = /line (\d+)/gi;
  let match;
  while ((match = linePattern.exec(text)) !== null) {
    lines.add(parseInt(match[1], 10));
  }
  return Array.from(lines).sort((a, b) => a - b);
}

function generateAnalysis(text: string) {
  if (text.includes('SyntaxError')) {
    return '構文エラーです。コードの文法と括弧・インデントを確認してください。';
  }
  if (text.includes('NameError')) {
    return '名前エラーです。変数や関数名が未定義になっていないか確認してください。';
  }
  if (text.includes('IndentationError')) {
    return 'インデントに問題があります。Python はインデントが構文の一部です。';
  }
  return '実行時エラーが発生しました。エラーメッセージを読んで、該当する箇所を修正してください。';
}
