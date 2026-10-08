import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  let output = '';
  let analysis = '';

  try {
    const exec = await import('child_process');
    const { spawn } = exec;
    const pythonExecutable = process.env.PYTHON_EXECUTABLE || 'python';
    const py = spawn(
      pythonExecutable,
      ['-c', code],
      {
        env: {
          ...process.env,
          PYTHONIOENCODING: 'utf-8',
        },
      }
    );

    output = await new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      py.stdout.setEncoding('utf8');
      py.stderr.setEncoding('utf8');
      py.stdout.on('data', (chunk) => {
        stdout += chunk;
      });
      py.stderr.on('data', (chunk) => {
        stderr += chunk;
      });
      py.on('close', () => {
        if (stderr) {
          resolve(stderr);
        } else {
          resolve(stdout || '実行が完了しました。');
        }
      });
      py.on('error', (error) => reject(error));
    });

    if (output.toLowerCase().includes('error') || output.toLowerCase().includes('traceback')) {
      analysis = generateAnalysis(output);
    } else {
      analysis = 'エラーがありません。必要に応じて改善点を検討してください。';
    }
  } catch (error) {
    output = 'Python 実行に失敗しました。';
    analysis = String(error);
  }

  return new Response(JSON.stringify({ output, analysis }), {
    headers: { 'Content-Type': 'application/json' },
  });
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
